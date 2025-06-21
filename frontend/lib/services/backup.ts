import { supabase } from '../supabase'
import { DatabaseService } from './database'
import { AdvancedEncryption } from '../security/encryption'
import { AnalyticsService } from './analytics'

export interface BackupConfig {
  includeUserData: boolean
  includeAnalytics: boolean
  includeSettings: boolean
  encryptBackup: boolean
  compressionLevel: number
}

export interface BackupMetadata {
  id: string
  timestamp: string
  size: number
  checksum: string
  version: string
  config: BackupConfig
  encrypted: boolean
}

export interface RestoreOptions {
  backupId: string
  selectiveRestore: {
    userData?: boolean
    analytics?: boolean
    settings?: boolean
  }
  overwriteExisting: boolean
}

export class BackupService {
  private static readonly BACKUP_VERSION = '2.0'
  private static readonly CHUNK_SIZE = 1024 * 1024 // 1MB chunks

  // Create full backup
  static async createBackup(
    userId: string, 
    config: BackupConfig = {
      includeUserData: true,
      includeAnalytics: true,
      includeSettings: true,
      encryptBackup: true,
      compressionLevel: 6
    }
  ): Promise<BackupMetadata> {
    try {
      await AnalyticsService.trackUserAction({
        action: 'backup_started',
        category: 'backup',
        properties: { config }
      })

      const backupData: any = {
        version: this.BACKUP_VERSION,
        timestamp: new Date().toISOString(),
        userId,
        config
      }

      // Collect user data
      if (config.includeUserData) {
        backupData.userData = await this.collectUserData(userId)
      }

      // Collect analytics data
      if (config.includeAnalytics) {
        backupData.analytics = await this.collectAnalyticsData(userId)
      }

      // Collect settings
      if (config.includeSettings) {
        backupData.settings = await this.collectUserSettings(userId)
      }

      // Serialize and compress
      let serializedData = JSON.stringify(backupData)
      
      if (config.compressionLevel > 0) {
        serializedData = await this.compressData(serializedData, config.compressionLevel)
      }

      // Encrypt if requested
      let finalData = serializedData
      let encrypted = false
      
      if (config.encryptBackup) {
        const key = AdvancedEncryption.generateKey()
        const iv = AdvancedEncryption.generateIV()
        const encryptedResult = await AdvancedEncryption.encryptData(serializedData, key, iv)
        
        finalData = JSON.stringify({
          ...encryptedResult,
          keyHint: AdvancedEncryption.hashData(key.toString()).substring(0, 8)
        })
        encrypted = true
      }

      // Calculate checksum
      const checksum = AdvancedEncryption.hashData(finalData)
      
      // Store backup
      const backupId = `backup_${userId}_${Date.now()}`
      const metadata: BackupMetadata = {
        id: backupId,
        timestamp: new Date().toISOString(),
        size: finalData.length,
        checksum,
        version: this.BACKUP_VERSION,
        config,
        encrypted
      }

      // Save to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('backups')
        .upload(`${userId}/${backupId}.json`, finalData, {
          contentType: 'application/json',
          metadata: {
            userId,
            checksum,
            encrypted: encrypted.toString()
          }
        })

      if (uploadError) throw uploadError

      // Save metadata to database
      const { error: metadataError } = await supabase
        .from('backup_metadata')
        .insert({
          id: backupId,
          user_id: userId,
          timestamp: metadata.timestamp,
          size: metadata.size,
          checksum: metadata.checksum,
          version: metadata.version,
          config: metadata.config,
          encrypted: metadata.encrypted
        })

      if (metadataError) throw metadataError

      await AnalyticsService.trackUserAction({
        action: 'backup_completed',
        category: 'backup',
        properties: { 
          backupId, 
          size: metadata.size,
          encrypted: metadata.encrypted
        }
      })

      return metadata

    } catch (error) {
      await AnalyticsService.trackError({
        message: error instanceof Error ? error.message : 'Backup creation failed',
        component: 'BackupService',
        action: 'createBackup',
        severity: 'high'
      })
      throw error
    }
  }

  // Restore from backup
  static async restoreBackup(
    userId: string, 
    options: RestoreOptions
  ): Promise<boolean> {
    try {
      await AnalyticsService.trackUserAction({
        action: 'restore_started',
        category: 'backup',
        properties: { backupId: options.backupId, options }
      })

      // Get backup metadata
      const { data: metadata, error: metadataError } = await supabase
        .from('backup_metadata')
        .select('*')
        .eq('id', options.backupId)
        .eq('user_id', userId)
        .single()

      if (metadataError || !metadata) {
        throw new Error('Backup not found or access denied')
      }

      // Download backup file
      const { data: backupFile, error: downloadError } = await supabase.storage
        .from('backups')
        .download(`${userId}/${options.backupId}.json`)

      if (downloadError) throw downloadError

      let backupContent = await backupFile.text()

      // Decrypt if encrypted
      if (metadata.encrypted) {
        const encryptedData = JSON.parse(backupContent)
        // In a real implementation, you'd need to handle key management
        // For now, we'll assume the key is available
        const key = AdvancedEncryption.generateKey() // This should be the actual key
        backupContent = await AdvancedEncryption.decryptData(
          encryptedData.ciphertext,
          key,
          encryptedData.iv,
          encryptedData.tag
        )
      }

      // Verify checksum
      const calculatedChecksum = AdvancedEncryption.hashData(backupContent)
      if (calculatedChecksum !== metadata.checksum) {
        throw new Error('Backup integrity check failed')
      }

      // Decompress if needed
      if (metadata.config.compressionLevel > 0) {
        backupContent = await this.decompressData(backupContent)
      }

      const backupData = JSON.parse(backupContent)

      // Restore data selectively
      if (options.selectiveRestore.userData !== false && backupData.userData) {
        await this.restoreUserData(userId, backupData.userData, options.overwriteExisting)
      }

      if (options.selectiveRestore.analytics !== false && backupData.analytics) {
        await this.restoreAnalyticsData(userId, backupData.analytics, options.overwriteExisting)
      }

      if (options.selectiveRestore.settings !== false && backupData.settings) {
        await this.restoreUserSettings(userId, backupData.settings, options.overwriteExisting)
      }

      await AnalyticsService.trackUserAction({
        action: 'restore_completed',
        category: 'backup',
        properties: { backupId: options.backupId }
      })

      return true

    } catch (error) {
      await AnalyticsService.trackError({
        message: error instanceof Error ? error.message : 'Restore failed',
        component: 'BackupService',
        action: 'restoreBackup',
        severity: 'high'
      })
      throw error
    }
  }

  // List available backups
  static async listBackups(userId: string): Promise<BackupMetadata[]> {
    try {
      const { data, error } = await supabase
        .from('backup_metadata')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error listing backups:', error)
      return []
    }
  }

  // Delete backup
  static async deleteBackup(userId: string, backupId: string): Promise<boolean> {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('backups')
        .remove([`${userId}/${backupId}.json`])

      if (storageError) throw storageError

      // Delete metadata
      const { error: metadataError } = await supabase
        .from('backup_metadata')
        .delete()
        .eq('id', backupId)
        .eq('user_id', userId)

      if (metadataError) throw metadataError

      await AnalyticsService.trackUserAction({
        action: 'backup_deleted',
        category: 'backup',
        properties: { backupId }
      })

      return true
    } catch (error) {
      console.error('Error deleting backup:', error)
      return false
    }
  }

  // Automated backup scheduling
  static async scheduleAutomaticBackup(
    userId: string,
    frequency: 'daily' | 'weekly' | 'monthly',
    config: BackupConfig
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('backup_schedules')
        .upsert({
          user_id: userId,
          frequency,
          config,
          next_backup: this.calculateNextBackupTime(frequency),
          active: true
        })

      if (error) throw error

      await AnalyticsService.trackUserAction({
        action: 'backup_scheduled',
        category: 'backup',
        properties: { frequency, config }
      })
    } catch (error) {
      console.error('Error scheduling backup:', error)
      throw error
    }
  }

  // Data collection methods
  private static async collectUserData(userId: string): Promise<any> {
    const [profile, analyses] = await Promise.all([
      DatabaseService.getUserProfile(userId),
      DatabaseService.getUserAnalyses(userId, 1000) // Get all analyses
    ])

    return {
      profile,
      analyses,
      timestamp: new Date().toISOString()
    }
  }

  private static async collectAnalyticsData(userId: string): Promise<any> {
    // Get user analytics data
    const stats = await DatabaseService.getUserStats(userId)
    
    return {
      stats,
      timestamp: new Date().toISOString()
    }
  }

  private static async collectUserSettings(userId: string): Promise<any> {
    const profile = await DatabaseService.getUserProfile(userId)
    
    return {
      preferences: profile?.preferences || {},
      timestamp: new Date().toISOString()
    }
  }

  // Data restoration methods
  private static async restoreUserData(
    userId: string, 
    userData: any, 
    overwrite: boolean
  ): Promise<void> {
    if (userData.profile && (overwrite || !await DatabaseService.getUserProfile(userId))) {
      await DatabaseService.updateUserProfile(userId, userData.profile)
    }

    if (userData.analyses && overwrite) {
      // In a real implementation, you'd need to handle analysis restoration carefully
      // to avoid duplicates and maintain data integrity
    }
  }

  private static async restoreAnalyticsData(
    userId: string, 
    analyticsData: any, 
    overwrite: boolean
  ): Promise<void> {
    // Restore analytics data if needed
    // This would depend on your analytics data structure
  }

  private static async restoreUserSettings(
    userId: string, 
    settings: any, 
    overwrite: boolean
  ): Promise<void> {
    if (settings.preferences) {
      await DatabaseService.updateUserProfile(userId, {
        preferences: settings.preferences
      })
    }
  }

  // Utility methods
  private static async compressData(data: string, level: number): Promise<string> {
    // In a real implementation, you'd use a compression library like pako
    // For now, we'll just return the data as-is
    return data
  }

  private static async decompressData(data: string): Promise<string> {
    // In a real implementation, you'd decompress the data
    // For now, we'll just return the data as-is
    return data
  }

  private static calculateNextBackupTime(frequency: string): string {
    const now = new Date()
    
    switch (frequency) {
      case 'daily':
        now.setDate(now.getDate() + 1)
        break
      case 'weekly':
        now.setDate(now.getDate() + 7)
        break
      case 'monthly':
        now.setMonth(now.getMonth() + 1)
        break
    }
    
    return now.toISOString()
  }

  // Export data in various formats
  static async exportUserData(
    userId: string, 
    format: 'json' | 'csv' | 'xml' = 'json'
  ): Promise<Blob> {
    const userData = await this.collectUserData(userId)
    
    switch (format) {
      case 'json':
        return new Blob([JSON.stringify(userData, null, 2)], { 
          type: 'application/json' 
        })
      
      case 'csv':
        const csv = this.convertToCSV(userData)
        return new Blob([csv], { type: 'text/csv' })
      
      case 'xml':
        const xml = this.convertToXML(userData)
        return new Blob([xml], { type: 'application/xml' })
      
      default:
        throw new Error('Unsupported export format')
    }
  }

  private static convertToCSV(data: any): string {
    // Simple CSV conversion for analyses
    if (!data.analyses || !Array.isArray(data.analyses)) {
      return 'No data available'
    }

    const headers = [
      'ID', 'Title', 'Created At', 'Clarity Score', 
      'Originality Score', 'Team Strength Score', 'Market Fit Score', 'Overall Score'
    ]
    
    const rows = data.analyses.map((analysis: any) => [
      analysis.id,
      analysis.title || 'Untitled',
      analysis.created_at,
      analysis.clarity_score || 0,
      analysis.originality_score || 0,
      analysis.team_strength_score || 0,
      analysis.market_fit_score || 0,
      analysis.overall_score || 0
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  private static convertToXML(data: any): string {
    // Simple XML conversion
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<backup>\n'
    xml += `  <timestamp>${data.timestamp}</timestamp>\n`
    
    if (data.profile) {
      xml += '  <profile>\n'
      xml += `    <email>${data.profile.email}</email>\n`
      xml += `    <fullName>${data.profile.full_name || ''}</fullName>\n`
      xml += '  </profile>\n'
    }
    
    if (data.analyses) {
      xml += '  <analyses>\n'
      data.analyses.forEach((analysis: any) => {
        xml += '    <analysis>\n'
        xml += `      <id>${analysis.id}</id>\n`
        xml += `      <title>${analysis.title || 'Untitled'}</title>\n`
        xml += `      <createdAt>${analysis.created_at}</createdAt>\n`
        xml += `      <overallScore>${analysis.overall_score || 0}</overallScore>\n`
        xml += '    </analysis>\n'
      })
      xml += '  </analyses>\n'
    }
    
    xml += '</backup>'
    return xml
  }
}
