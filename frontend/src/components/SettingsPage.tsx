<<<<<<< HEAD
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, User, Shield, Palette, Zap, Bell, Download, Trash2, Save, RotateCcw, Eye, EyeOff, Sun, Moon, Monitor } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTheme } from '../contexts/ThemeContext'
import ClickSpark from './ClickSpark'
import PixelCard from './PixelCard'

interface SettingsData {
  apiKey: string
  animationsEnabled: boolean
  encryptionLevel: 'standard' | 'high'
  modelProvider: 'openai' | 'mistral' | 'anthropic'
  notifications: {
    analysisComplete: boolean
    securityAlerts: boolean
    productUpdates: boolean
  }
  privacy: {
    shareUsageData: boolean
    allowAnalytics: boolean
  }
  performance: {
    autoSave: boolean
    cacheResults: boolean
  }
}

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'privacy' | 'advanced'>('general')
  const [showApiKey, setShowApiKey] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [settings, setSettings] = useState<SettingsData>({
    apiKey: '',
    animationsEnabled: true,
    encryptionLevel: 'standard',
    modelProvider: 'mistral',
    notifications: {
      analysisComplete: true,
      securityAlerts: true,
      productUpdates: false
    },
    privacy: {
      shareUsageData: false,
      allowAnalytics: true
    },
    performance: {
      autoSave: true,
      cacheResults: true
    }
  })

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('pitchguard_settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Failed to parse saved settings:', error)
      }
    }
  }, [])

  const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasUnsavedChanges(true)
  }

  const updateNestedSetting = <T extends keyof SettingsData>(
    category: T,
    key: keyof SettingsData[T],
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
    setHasUnsavedChanges(true)
  }
  const handleSaveSettings = () => {
    try {
      localStorage.setItem('pitchguard_settings', JSON.stringify({
        ...settings,
        lastUpdated: new Date().toISOString()
      }))
      setHasUnsavedChanges(false)
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    }
  }

  const handleResetSettings = () => {
    const defaultSettings: SettingsData = {
      apiKey: '',
      animationsEnabled: true,
      encryptionLevel: 'standard',
      modelProvider: 'mistral',
      notifications: {
        analysisComplete: true,
        securityAlerts: true,
        productUpdates: false
      },
      privacy: {
        shareUsageData: false,
        allowAnalytics: true
      },
      performance: {
        autoSave: true,
        cacheResults: true
      }
    }

    setSettings(defaultSettings)
    setTheme('dark')
    setHasUnsavedChanges(true)
    toast.success('Settings reset to defaults')
  }

  const tabs = [
    { id: 'general', label: 'General', icon: <Settings className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Eye className="w-4 h-4" /> },
    { id: 'advanced', label: 'Advanced', icon: <Zap className="w-4 h-4" /> },
  ]
=======
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Globe, 
  Shield, 
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UserSettings {
  theme: 'dark' | 'light' | 'auto';
  notifications: boolean;
  soundEffects: boolean;
  animationLevel: 'minimal' | 'standard' | 'enhanced';
  language: string;
  autoSave: boolean;
  privacyMode: 'standard' | 'enhanced' | 'maximum';
  deviceSync: boolean;
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    notifications: true,
    soundEffects: true,
    animationLevel: 'enhanced',
    language: 'en',
    autoSave: true,
    privacyMode: 'enhanced',
    deviceSync: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const updateSetting = <K extends keyof UserSettings>(
    key: K, 
    value: UserSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings({
      theme: 'dark',
      notifications: true,
      soundEffects: true,
      animationLevel: 'enhanced',
      language: 'en',
      autoSave: true,
      privacyMode: 'enhanced',
      deviceSync: false
    });
    toast.success('Settings reset to defaults');
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pitchguard-settings.json';
    link.click();
    toast.success('Settings exported successfully');
  };

  const settingSections = [
    {
      title: 'Appearance',
      icon: <Palette className="w-5 h-5" />,
      settings: [
        {
          key: 'theme',
          label: 'Theme',
          type: 'select',
          options: [
            { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
            { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
            { value: 'auto', label: 'Auto', icon: <Monitor className="w-4 h-4" /> }
          ]
        },
        {
          key: 'animationLevel',
          label: 'Animation Level',
          type: 'select',
          options: [
            { value: 'minimal', label: 'Minimal' },
            { value: 'standard', label: 'Standard' },
            { value: 'enhanced', label: 'Enhanced' }
          ]
        }
      ]
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      settings: [
        {
          key: 'notifications',
          label: 'Push Notifications',
          type: 'toggle'
        },
        {
          key: 'soundEffects',
          label: 'Sound Effects',
          type: 'toggle',
          icon: settings.soundEffects ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />
        }
      ]
    },
    {
      title: 'Privacy & Security',
      icon: <Shield className="w-5 h-5" />,
      settings: [
        {
          key: 'privacyMode',
          label: 'Privacy Mode',
          type: 'select',
          options: [
            { value: 'standard', label: 'Standard' },
            { value: 'enhanced', label: 'Enhanced' },
            { value: 'maximum', label: 'Maximum' }
          ]
        },
        {
          key: 'autoSave',
          label: 'Auto-save Analysis',
          type: 'toggle'
        }
      ]
    },
    {
      title: 'Sync & Backup',
      icon: <Smartphone className="w-5 h-5" />,
      settings: [
        {
          key: 'deviceSync',
          label: 'Cross-device Sync',
          type: 'toggle'
        }
      ]
    }
  ];
>>>>>>> e5c482e8 (feat: Complete OnlyFounders AI hackathon submission with full deployment pipeline)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
<<<<<<< HEAD
      transition={{ duration: 0.5 }}
      className="min-h-screen px-4 py-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4"
          >
            <Settings className="w-8 h-8 text-blue-400" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="text-gradient">Settings</span>
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Customize your PitchGuard experience and configure security preferences.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="glass-card p-2 mb-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-500/30 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'general' && (
            <motion.div
              key="general"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-blue-400 mb-6">General Settings</h2>

                <div className="space-y-6">
                  {/* API Configuration */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">API Configuration</h3>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="apiKey" className="block text-white mb-2">OpenRouter API Key</label>
                        <div className="relative">
                          <input
                            id="apiKey"
                            type={showApiKey ? "text" : "password"}
                            value={settings.apiKey}
                            onChange={(e) => updateSetting('apiKey', e.target.value)}
                            placeholder="sk-or-v1-..."
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                          >
                            {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-white/50 text-sm mt-1">Your OpenRouter API key for accessing AI models</p>
                      </div>

                      <div>
                        <label htmlFor="modelProvider" className="block text-white mb-2">Model Provider</label>
                        <select
                          id="modelProvider"
                          value={settings.modelProvider}
                          onChange={(e) => updateSetting('modelProvider', e.target.value as any)}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="mistral">Mistral AI</option>
                          <option value="openai">OpenAI</option>
                          <option value="anthropic">Anthropic</option>
                        </select>
                        <p className="text-white/50 text-sm mt-1">Select your preferred AI model provider</p>
                      </div>
                    </div>
                  </div>

                  {/* Appearance */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Appearance</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white mb-2">Theme</label>
                        <div className="flex gap-3">
                          {([
                            { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
                            { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
                            { id: 'system', label: 'System', icon: <Monitor className="w-4 h-4" /> }
                          ] as const).map((themeOption) => (
                            <button
                              key={themeOption.id}
                              onClick={() => {
                                setTheme(themeOption.id)
                                setHasUnsavedChanges(true)
                              }}
                              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                                theme === themeOption.id
                                  ? 'bg-blue-500 text-white shadow-lg'
                                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                              }`}
                            >
                              {themeOption.icon}
                              <span>{themeOption.label}</span>
                            </button>
                          ))}
                        </div>
                        <p className="text-white/50 text-sm mt-2">
                          {theme === 'system' ? 'Follows your system preference' : `Using ${theme} theme`}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-white font-medium">Enable Animations</label>
                          <p className="text-white/50 text-sm">Smooth transitions and visual effects</p>
                        </div>
                        <div
                          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                            settings.animationsEnabled ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                          onClick={() => updateSetting('animationsEnabled', !settings.animationsEnabled)}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                              settings.animationsEnabled ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-blue-400 mb-6">Security Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Encryption Level</h3>
                    <div className="space-y-3">
                      <div className="flex gap-4">
                        <button
                          onClick={() => updateSetting('encryptionLevel', 'standard')}
                          className={`flex-1 p-4 rounded-lg border transition-all duration-200 ${
                            settings.encryptionLevel === 'standard'
                              ? 'bg-blue-500/20 border-blue-400 text-white'
                              : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-medium mb-1">Standard (AES-256-GCM)</div>
                            <div className="text-sm opacity-70">Recommended for most users</div>
                          </div>
                        </button>
                        <button
                          onClick={() => updateSetting('encryptionLevel', 'high')}
                          className={`flex-1 p-4 rounded-lg border transition-all duration-200 ${
                            settings.encryptionLevel === 'high'
                              ? 'bg-blue-500/20 border-blue-400 text-white'
                              : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <div className="text-left">
                            <div className="font-medium mb-1">High (AES-256 + RSA)</div>
                            <div className="text-sm opacity-70">Maximum security, slower performance</div>
                          </div>
                        </button>
                      </div>
                      <p className="text-white/50 text-sm">Higher encryption levels provide additional security but may affect performance</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-white font-medium">Analysis Complete</label>
                          <p className="text-white/50 text-sm">Get notified when pitch analysis is finished</p>
                        </div>
                        <div
                          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                            settings.notifications.analysisComplete ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                          onClick={() => updateNestedSetting('notifications', 'analysisComplete', !settings.notifications.analysisComplete)}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                              settings.notifications.analysisComplete ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-white font-medium">Security Alerts</label>
                          <p className="text-white/50 text-sm">Important security notifications and updates</p>
                        </div>
                        <div
                          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                            settings.notifications.securityAlerts ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                          onClick={() => updateNestedSetting('notifications', 'securityAlerts', !settings.notifications.securityAlerts)}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                              settings.notifications.securityAlerts ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-white font-medium">Product Updates</label>
                          <p className="text-white/50 text-sm">New features and product announcements</p>
                        </div>
                        <div
                          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                            settings.notifications.productUpdates ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                          onClick={() => updateNestedSetting('notifications', 'productUpdates', !settings.notifications.productUpdates)}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                              settings.notifications.productUpdates ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-blue-400 mb-6">Privacy Settings</h2>

                <div className="space-y-6">
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="text-blue-300 font-medium">Privacy First</span>
                    </div>
                    <p className="text-blue-200 text-sm">
                      PitchGuard is designed with privacy at its core. Your pitch content is never stored on our servers.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white font-medium">Share Usage Data</label>
                        <p className="text-white/50 text-sm">Help improve PitchGuard by sharing anonymous usage statistics</p>
                      </div>
                      <div
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                          settings.privacy.shareUsageData ? 'bg-blue-500' : 'bg-white/20'
                        }`}
                        onClick={() => updateNestedSetting('privacy', 'shareUsageData', !settings.privacy.shareUsageData)}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                            settings.privacy.shareUsageData ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-white font-medium">Allow Analytics</label>
                        <p className="text-white/50 text-sm">Enable analytics to help us understand how you use the app</p>
                      </div>
                      <div
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                          settings.privacy.allowAnalytics ? 'bg-blue-500' : 'bg-white/20'
                        }`}
                        onClick={() => updateNestedSetting('privacy', 'allowAnalytics', !settings.privacy.allowAnalytics)}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                            settings.privacy.allowAnalytics ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Data Retention Policy</h4>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li>• Pitch content: Immediately deleted after analysis</li>
                      <li>• Analysis results: Stored locally in your browser only</li>
                      <li>• Usage data: Anonymized and aggregated if sharing is enabled</li>
                      <li>• Account data: Managed by Clerk authentication service</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'advanced' && (
            <motion.div
              key="advanced"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-blue-400 mb-6">Advanced Settings</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Performance</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-white font-medium">Auto-save Results</label>
                          <p className="text-white/50 text-sm">Automatically save analysis results to local storage</p>
                        </div>
                        <div
                          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                            settings.performance.autoSave ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                          onClick={() => updateNestedSetting('performance', 'autoSave', !settings.performance.autoSave)}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                              settings.performance.autoSave ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-white font-medium">Cache Results</label>
                          <p className="text-white/50 text-sm">Cache analysis results for faster access</p>
                        </div>
                        <div
                          className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                            settings.performance.cacheResults ? 'bg-blue-500' : 'bg-white/20'
                          }`}
                          onClick={() => updateNestedSetting('performance', 'cacheResults', !settings.performance.cacheResults)}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                              settings.performance.cacheResults ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Data Management</h3>
                    <div className="space-y-3">
                      <ClickSpark sparkColor="#ef4444" sparkCount={8} sparkRadius={25}>
                        <PixelCard variant="pink" className="w-full">
                          <button className="w-full flex items-center justify-between p-4 bg-red-500/10 border border-red-400/30 rounded-lg hover:bg-red-500/20 transition-colors">
                            <div className="text-left">
                              <div className="text-white font-medium">Clear All Data</div>
                              <div className="text-red-200 text-sm">Remove all locally stored data and settings</div>
                            </div>
                            <Trash2 className="w-5 h-5 text-red-400" />
                          </button>
                        </PixelCard>
                      </ClickSpark>

                      <ClickSpark sparkColor="#3b82f6" sparkCount={8} sparkRadius={25}>
                        <PixelCard variant="blue" className="w-full">
                          <button className="w-full flex items-center justify-between p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg hover:bg-blue-500/20 transition-colors">
                            <div className="text-left">
                              <div className="text-white font-medium">Export Settings</div>
                              <div className="text-blue-200 text-sm">Download your settings as a backup file</div>
                            </div>
                            <Download className="w-5 h-5 text-blue-400" />
                          </button>
                        </PixelCard>
                      </ClickSpark>
                    </div>
                  </div>

                  <div className="bg-gray-500/10 border border-gray-400/30 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Debug Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Version:</span>
                        <span className="text-white ml-2">1.0.0</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Build:</span>
                        <span className="text-white ml-2">2024.01.15</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Environment:</span>
                        <span className="text-white ml-2">Production</span>
                      </div>
                      <div>
                        <span className="text-gray-400">API Status:</span>
                        <span className="text-green-400 ml-2">Connected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save/Reset Actions */}
        {hasUnsavedChanges && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 mt-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <span className="text-white/70">You have unsaved changes</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleResetSettings}
                  className="flex items-center gap-2 glass-button px-4 py-2 text-white/70 font-medium hover:text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>

                <button
                  onClick={handleSaveSettings}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default SettingsPage
=======
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mb-6"
        >
          <Settings className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Settings
        </h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Customize your PitchGuard experience and privacy preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + sectionIndex * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              {section.icon}
              <span className="ml-3">{section.title}</span>
            </h3>
            
            <div className="space-y-4">
              {section.settings.map((setting) => (
                <div key={setting.key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {setting.icon && setting.icon}
                    <span className="text-white">{setting.label}</span>
                  </div>
                  
                  {setting.type === 'toggle' ? (
                    <button
                      onClick={() => updateSetting(setting.key as keyof UserSettings, !settings[setting.key as keyof UserSettings])}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        settings[setting.key as keyof UserSettings] 
                          ? 'bg-blue-400' 
                          : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                        settings[setting.key as keyof UserSettings] 
                          ? 'translate-x-6' 
                          : 'translate-x-0.5'
                      }`} />
                    </button>
                  ) : (
                    <select
                      value={settings[setting.key as keyof UserSettings] as string}
                      onChange={(e) => updateSetting(setting.key as keyof UserSettings, e.target.value as any)}
                      className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm min-w-[120px]"
                    >
                      {setting.options?.map((option) => (
                        <option key={option.value} value={option.value} className="bg-slate-800">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Zap className="w-5 h-5 mr-3 text-yellow-400" />
          Actions
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={saveSettings}
            disabled={isSaving}
            className="flex items-center justify-center space-x-2 bg-green-400/20 text-green-400 px-4 py-3 rounded-lg hover:bg-green-400/30 transition-colors disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
          
          <button
            onClick={exportSettings}
            className="flex items-center justify-center space-x-2 bg-blue-400/20 text-blue-400 px-4 py-3 rounded-lg hover:bg-blue-400/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          
          <button
            onClick={() => document.getElementById('import-file')?.click()}
            className="flex items-center justify-center space-x-2 bg-purple-400/20 text-purple-400 px-4 py-3 rounded-lg hover:bg-purple-400/30 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          
          <button
            onClick={resetSettings}
            className="flex items-center justify-center space-x-2 bg-red-400/20 text-red-400 px-4 py-3 rounded-lg hover:bg-red-400/30 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
        
        <input
          id="import-file"
          type="file"
          accept=".json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const importedSettings = JSON.parse(event.target?.result as string);
                  setSettings(importedSettings);
                  toast.success('Settings imported successfully');
                } catch (error) {
                  toast.error('Invalid settings file');
                }
              };
              reader.readAsText(file);
            }
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
>>>>>>> e5c482e8 (feat: Complete OnlyFounders AI hackathon submission with full deployment pipeline)
