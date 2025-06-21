import { supabase } from '../supabase'
import { RealtimeChannel } from '@supabase/supabase-js'
import { AnalyticsService } from './analytics'

export interface RealtimeNotification {
  id: string
  type: 'analysis_complete' | 'analysis_failed' | 'credit_low' | 'subscription_update' | 'system_update'
  title: string
  message: string
  data?: any
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
}

export interface AnalysisStatus {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  stage: string
  estimatedTimeRemaining?: number
  error?: string
}

export class RealtimeService {
  private static instance: RealtimeService
  private channels: Map<string, RealtimeChannel> = new Map()
  private notifications: RealtimeNotification[] = []
  private analysisStatuses: Map<string, AnalysisStatus> = new Map()
  private listeners: Map<string, Set<Function>> = new Map()

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService()
    }
    return RealtimeService.instance
  }

  // Notification Management
  async subscribeToNotifications(userId: string, callback: (notification: RealtimeNotification) => void) {
    const channelName = `notifications:${userId}`
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe()
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        const notification = this.formatNotification(payload.new)
        this.notifications.unshift(notification)
        callback(notification)
        
        // Track notification received
        AnalyticsService.trackUserAction({
          action: 'notification_received',
          category: 'realtime',
          properties: {
            notification_type: notification.type,
            priority: notification.priority
          }
        })
      })
      .subscribe()

    this.channels.set(channelName, channel)
    
    // Load existing notifications
    await this.loadNotifications(userId)
  }

  async loadNotifications(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      this.notifications = data?.map(this.formatNotification) || []
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  private formatNotification(data: any): RealtimeNotification {
    return {
      id: data.id,
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data,
      timestamp: data.created_at,
      read: data.read || false,
      priority: data.priority || 'medium'
    }
  }

  async markNotificationAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error

      // Update local state
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification) {
        notification.read = true
      }

      await AnalyticsService.trackUserAction({
        action: 'notification_read',
        category: 'realtime',
        properties: { notification_id: notificationId }
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  async sendNotification(userId: string, notification: Omit<RealtimeNotification, 'id' | 'timestamp' | 'read'>) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          priority: notification.priority
        })

      if (error) throw error
    } catch (error) {
      console.error('Error sending notification:', error)
    }
  }

  getNotifications(): RealtimeNotification[] {
    return this.notifications
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  // Analysis Status Management
  async subscribeToAnalysisStatus(analysisId: string, callback: (status: AnalysisStatus) => void) {
    const channelName = `analysis:${analysisId}`
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe()
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pitch_analyses',
        filter: `id=eq.${analysisId}`
      }, (payload) => {
        const status = this.formatAnalysisStatus(payload.new || payload.old)
        this.analysisStatuses.set(analysisId, status)
        callback(status)
      })
      .subscribe()

    this.channels.set(channelName, channel)
  }

  private formatAnalysisStatus(data: any): AnalysisStatus {
    return {
      id: data.id,
      status: data.status || 'pending',
      progress: this.calculateProgress(data.status),
      stage: this.getStageFromStatus(data.status),
      estimatedTimeRemaining: this.estimateTimeRemaining(data.status),
      error: data.error_message
    }
  }

  private calculateProgress(status: string): number {
    switch (status) {
      case 'pending': return 0
      case 'processing': return 50
      case 'completed': return 100
      case 'failed': return 0
      default: return 0
    }
  }

  private getStageFromStatus(status: string): string {
    switch (status) {
      case 'pending': return 'Queued for analysis'
      case 'processing': return 'Analyzing your pitch'
      case 'completed': return 'Analysis complete'
      case 'failed': return 'Analysis failed'
      default: return 'Unknown'
    }
  }

  private estimateTimeRemaining(status: string): number | undefined {
    switch (status) {
      case 'pending': return 30
      case 'processing': return 15
      default: return undefined
    }
  }

  updateAnalysisProgress(analysisId: string, progress: number, stage: string) {
    const status = this.analysisStatuses.get(analysisId)
    if (status) {
      status.progress = progress
      status.stage = stage
      this.notifyListeners(`analysis:${analysisId}`, status)
    }
  }

  // Live Collaboration Features
  async subscribeToCollaboration(roomId: string, callback: (event: any) => void) {
    const channelName = `collaboration:${roomId}`
    
    if (this.channels.has(channelName)) {
      this.channels.get(channelName)?.unsubscribe()
    }

    const channel = supabase
      .channel(channelName)
      .on('broadcast', { event: 'cursor_move' }, callback)
      .on('broadcast', { event: 'text_change' }, callback)
      .on('broadcast', { event: 'user_join' }, callback)
      .on('broadcast', { event: 'user_leave' }, callback)
      .subscribe()

    this.channels.set(channelName, channel)
  }

  async broadcastCollaborationEvent(roomId: string, event: string, data: any) {
    const channel = this.channels.get(`collaboration:${roomId}`)
    if (channel) {
      await channel.send({
        type: 'broadcast',
        event,
        payload: data
      })
    }
  }

  // Presence Management
  async trackUserPresence(userId: string, metadata: any = {}) {
    const channel = supabase.channel('online-users')
    
    await channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        this.notifyListeners('presence:sync', state)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        this.notifyListeners('presence:join', { key, newPresences })
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        this.notifyListeners('presence:leave', { key, leftPresences })
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: userId,
            online_at: new Date().toISOString(),
            ...metadata
          })
        }
      })

    this.channels.set('presence', channel)
  }

  // Event Listener Management
  addEventListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)?.add(callback)
  }

  removeEventListener(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback)
  }

  private notifyListeners(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data))
  }

  // Cleanup
  unsubscribeAll() {
    this.channels.forEach(channel => channel.unsubscribe())
    this.channels.clear()
    this.listeners.clear()
  }

  unsubscribe(channelName: string) {
    const channel = this.channels.get(channelName)
    if (channel) {
      channel.unsubscribe()
      this.channels.delete(channelName)
    }
  }
}

// React Hook for Realtime Features
export function useRealtime(userId?: string) {
  const [notifications, setNotifications] = React.useState<RealtimeNotification[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [isConnected, setIsConnected] = React.useState(false)

  const realtimeService = RealtimeService.getInstance()

  React.useEffect(() => {
    if (userId) {
      // Subscribe to notifications
      realtimeService.subscribeToNotifications(userId, (notification) => {
        setNotifications(prev => [notification, ...prev])
        setUnreadCount(prev => prev + 1)
      })

      // Track user presence
      realtimeService.trackUserPresence(userId, {
        status: 'online',
        last_seen: new Date().toISOString()
      })

      setIsConnected(true)

      // Load initial data
      setNotifications(realtimeService.getNotifications())
      setUnreadCount(realtimeService.getUnreadCount())
    }

    return () => {
      if (userId) {
        realtimeService.unsubscribe(`notifications:${userId}`)
        realtimeService.unsubscribe('presence')
      }
    }
  }, [userId])

  const markAsRead = async (notificationId: string) => {
    await realtimeService.markNotificationAsRead(notificationId)
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const sendNotification = async (notification: Omit<RealtimeNotification, 'id' | 'timestamp' | 'read'>) => {
    if (userId) {
      await realtimeService.sendNotification(userId, notification)
    }
  }

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    sendNotification,
    realtimeService
  }
}

// React import for hooks
import React from 'react'
