import { supabase } from '../supabase'
import { createHash } from 'crypto'
import { queryCache, cached } from '../performance/cache'
import { performanceMonitor } from '../performance/monitor'

export interface PitchAnalysisData {
  title?: string
  content: string
  analysisType: 'text' | 'audio' | 'document'
  fileUrl?: string
  fileType?: string
  fileSize?: number
  scores: {
    clarity: number
    originality: number
    team_strength: number
    market_fit: number
    overall?: number
  }
  receipt: string
  feedback?: any
  suggestions?: any[]
  aiModel?: string
  confidence?: number
}

export interface UserProfile {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  subscriptionTier: 'free' | 'premium' | 'enterprise'
  creditsRemaining: number
  totalAnalyses: number
  preferences?: any
}

export interface AnalyticsEvent {
  eventType: string
  eventName: string
  properties?: any
  sessionId?: string
}

export class DatabaseService {
  static async createUserProfile(userData: {
    id: string
    email: string
    fullName?: string
    avatarUrl?: string
  }): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase.rpc('upsert_user_profile', {
        user_id: userData.id,
        user_email: userData.email,
        user_full_name: userData.fullName,
        user_avatar_url: userData.avatarUrl
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating user profile:', error)
      return null
    }
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const startTime = performance.now()
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      // Track query performance
      const queryTime = performance.now() - startTime
      console.log(`Database query performance: ${queryTime.toFixed(2)}ms`)

      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: updates.fullName,
          avatar_url: updates.avatarUrl,
          preferences: updates.preferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating user profile:', error)
      return false
    }
  }

  static async savePitchAnalysis(analysisData: PitchAnalysisData): Promise<string | null> {
    try {
      const contentHash = createHash('sha256').update(analysisData.content).digest('hex')
      
      const overallScore = analysisData.scores.overall || 
        (analysisData.scores.clarity + analysisData.scores.originality + 
         analysisData.scores.team_strength + analysisData.scores.market_fit) / 4

      const { data, error } = await supabase.rpc('save_pitch_analysis', {
        analysis_data: {
          title: analysisData.title,
          content_hash: contentHash,
          analysis_type: analysisData.analysisType,
          file_url: analysisData.fileUrl,
          file_type: analysisData.fileType,
          file_size: analysisData.fileSize,
          clarity_score: analysisData.scores.clarity,
          originality_score: analysisData.scores.originality,
          team_strength_score: analysisData.scores.team_strength,
          market_fit_score: analysisData.scores.market_fit,
          overall_score: overallScore,
          receipt_id: analysisData.receipt,
          feedback: analysisData.feedback || {},
          suggestions: analysisData.suggestions || [],
          ai_model_used: analysisData.aiModel || 'deepseek-r1',
          confidence_score: analysisData.confidence || 0.95
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving pitch analysis:', error)
      return null
    }
  }

  static async getUserAnalyses(userId: string, limit = 20, offset = 0): Promise<any[]> {
    const startTime = performance.now()
    try {
      const { data, error } = await supabase
        .from('pitch_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      // Track query performance
      const queryTime = performance.now() - startTime
      console.log(`Database query performance: ${queryTime.toFixed(2)}ms, results: ${data?.length || 0}`)

      return data || []
    } catch (error) {
      console.error('Error fetching user analyses:', error)
      return []
    }
  }

  static async getAnalysisById(analysisId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('pitch_analyses')
        .select('*')
        .eq('id', analysisId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching analysis:', error)
      return null
    }
  }

  static async deleteAnalysis(analysisId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('pitch_analyses')
        .delete()
        .eq('id', analysisId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting analysis:', error)
      return false
    }
  }

  static async getUserStats(userId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase.rpc('get_user_stats', {
        user_uuid: userId
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return null
    }
  }

  static async trackEvent(eventData: AnalyticsEvent): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('track_event', {
        event_type_param: eventData.eventType,
        event_name_param: eventData.eventName,
        properties_param: eventData.properties || {},
        session_id_param: eventData.sessionId
      })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error tracking event:', error)
      return false
    }
  }

  static async createUserSession(sessionData: {
    sessionId: string
    ipAddress?: string
    userAgent?: string
    deviceType?: string
    browser?: string
    os?: string
    country?: string
    city?: string
  }): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          session_id: sessionData.sessionId,
          ip_address: sessionData.ipAddress,
          user_agent: sessionData.userAgent,
          device_type: sessionData.deviceType,
          browser: sessionData.browser,
          os: sessionData.os,
          country: sessionData.country,
          city: sessionData.city
        })
        .select('id')
        .single()

      if (error) throw error
      return data.id
    } catch (error) {
      console.error('Error creating user session:', error)
      return null
    }
  }

  static async updateUserSession(sessionId: string, updates: {
    endedAt?: string
    duration?: number
    pagesVisited?: number
    analysesPerformed?: number
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({
          ended_at: updates.endedAt,
          duration: updates.duration,
          pages_visited: updates.pagesVisited,
          analyses_performed: updates.analysesPerformed,
          last_activity: new Date().toISOString()
        })
        .eq('session_id', sessionId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating user session:', error)
      return false
    }
  }

  static async saveFeedback(feedbackData: {
    analysisId?: string
    rating: number
    feedbackText?: string
    feedbackType: 'analysis_quality' | 'ui_experience' | 'feature_request' | 'bug_report' | 'general'
    isPublic?: boolean
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          analysis_id: feedbackData.analysisId,
          rating: feedbackData.rating,
          feedback_text: feedbackData.feedbackText,
          feedback_type: feedbackData.feedbackType,
          is_public: feedbackData.isPublic || false
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error saving feedback:', error)
      return false
    }
  }

  static async getPublicAnalyses(limit = 10, offset = 0): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('pitch_analyses')
        .select(`
          id,
          title,
          clarity_score,
          originality_score,
          team_strength_score,
          market_fit_score,
          overall_score,
          created_at,
          view_count,
          tags,
          users!inner(full_name, avatar_url)
        `)
        .eq('is_public', true)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching public analyses:', error)
      return []
    }
  }

  static async incrementViewCount(analysisId: string): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('increment_view_count', {
        analysis_id: analysisId
      })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error incrementing view count:', error)
      return false
    }
  }
}
