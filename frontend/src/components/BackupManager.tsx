'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  Upload, 
  Shield, 
  Clock, 
  Database, 
  FileText,
  Trash2,
  Settings,
  CheckCircle,
  AlertCircle,
  Calendar,
  HardDrive
} from 'lucide-react'
import { BackupService, BackupMetadata, BackupConfig } from '../../lib/services/backup'
import { useUnifiedAuth } from '../../lib/auth/unified-auth'
import { AnalyticsService } from '../../lib/services/analytics'

const BackupManager: React.FC = () => {
  const { user } = useUnifiedAuth()
  const [backups, setBackups] = useState<BackupMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [restoring, setRestoring] = useState<string | null>(null)
  const [config, setConfig] = useState<BackupConfig>({
    includeUserData: true,
    includeAnalytics: true,
    includeSettings: true,
    encryptBackup: true,
    compressionLevel: 6
  })

  useEffect(() => {
    if (user) {
      loadBackups()
    }
  }, [user])

  const loadBackups = async () => {
    if (!user) return

    setLoading(true)
    try {
      const backupList = await BackupService.listBackups(user.id)
      setBackups(backupList)
    } catch (error) {
      console.error('Error loading backups:', error)
    } finally {
      setLoading(false)
    }
  }

  const createBackup = async () => {
    if (!user) return

    setCreating(true)
    try {
      const metadata = await BackupService.createBackup(user.id, config)
      setBackups(prev => [metadata, ...prev])
      
      await AnalyticsService.trackUserAction({
        action: 'backup_created_manually',
        category: 'backup',
        properties: { size: metadata.size }
      })
    } catch (error) {
      console.error('Error creating backup:', error)
    } finally {
      setCreating(false)
    }
  }

  const restoreBackup = async (backupId: string) => {
    if (!user) return

    setRestoring(backupId)
    try {
      await BackupService.restoreBackup(user.id, {
        backupId,
        selectiveRestore: {
          userData: config.includeUserData,
          analytics: config.includeAnalytics,
          settings: config.includeSettings
        },
        overwriteExisting: true
      })
      
      await AnalyticsService.trackUserAction({
        action: 'backup_restored',
        category: 'backup',
        properties: { backupId }
      })
    } catch (error) {
      console.error('Error restoring backup:', error)
    } finally {
      setRestoring(null)
    }
  }

  const deleteBackup = async (backupId: string) => {
    if (!user) return

    try {
      await BackupService.deleteBackup(user.id, backupId)
      setBackups(prev => prev.filter(b => b.id !== backupId))
    } catch (error) {
      console.error('Error deleting backup:', error)
    }
  }

  const exportData = async (format: 'json' | 'csv' | 'xml') => {
    if (!user) return

    try {
      const blob = await BackupService.exportUserData(user.id, format)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `stealth-score-export-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      await AnalyticsService.trackUserAction({
        action: 'data_exported',
        category: 'backup',
        properties: { format }
      })
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-2">
            Backup & Recovery
          </h1>
          <p className="text-white/70 text-lg">
            Secure your data with automated backups and easy recovery options
          </p>
        </motion.div>

        {/* Backup Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            Backup Configuration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.includeUserData}
                  onChange={(e) => setConfig(prev => ({ ...prev, includeUserData: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-white">Include User Data</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.includeAnalytics}
                  onChange={(e) => setConfig(prev => ({ ...prev, includeAnalytics: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-white">Include Analytics</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.includeSettings}
                  onChange={(e) => setConfig(prev => ({ ...prev, includeSettings: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-white">Include Settings</span>
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.encryptBackup}
                  onChange={(e) => setConfig(prev => ({ ...prev, encryptBackup: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-white">Encrypt Backup</span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white/70 text-sm block mb-2">Compression Level</label>
                <input
                  type="range"
                  min="0"
                  max="9"
                  value={config.compressionLevel}
                  onChange={(e) => setConfig(prev => ({ ...prev, compressionLevel: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <span>None</span>
                  <span>Maximum</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={createBackup}
                  disabled={creating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white rounded-xl font-medium transition-all duration-200"
                >
                  {creating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <HardDrive className="w-4 h-4" />
                  )}
                  {creating ? 'Creating...' : 'Create Backup'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Export Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8"
        >
          <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-green-400" />
            Export Data
          </h3>
          
          <div className="flex gap-3">
            <button
              onClick={() => exportData('json')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-xl text-green-400 hover:bg-green-500/30 transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              JSON
            </button>
            <button
              onClick={() => exportData('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-xl text-green-400 hover:bg-green-500/30 transition-all duration-200"
            >
              <Database className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={() => exportData('xml')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-xl text-green-400 hover:bg-green-500/30 transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              XML
            </button>
          </div>
        </motion.div>

        {/* Backup List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
        >
          <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" />
            Backup History
          </h3>

          {backups.length > 0 ? (
            <div className="space-y-4">
              {backups.map((backup) => (
                <motion.div
                  key={backup.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      {backup.encrypted ? (
                        <Shield className="w-5 h-5 text-blue-400" />
                      ) : (
                        <Database className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium">
                        Backup {new Date(backup.timestamp).toLocaleDateString()}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(backup.timestamp).toLocaleString()}
                        </span>
                        <span>{formatFileSize(backup.size)}</span>
                        {backup.encrypted && (
                          <span className="flex items-center gap-1 text-green-400">
                            <Shield className="w-3 h-3" />
                            Encrypted
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => restoreBackup(backup.id)}
                      disabled={restoring === backup.id}
                      className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-400/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-all duration-200 disabled:opacity-50"
                    >
                      {restoring === backup.id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full"
                        />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {restoring === backup.id ? 'Restoring...' : 'Restore'}
                    </button>
                    
                    <button
                      onClick={() => deleteBackup(backup.id)}
                      className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No backups found. Create your first backup above.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default BackupManager
