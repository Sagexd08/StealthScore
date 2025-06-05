import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Key, Settings, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface EncryptionSettingsProps {
  className?: string;
}

type EncryptionMode = 'aes256' | 'dual' | 'quantum-ready';

interface EncryptionConfig {
  mode: EncryptionMode;
  aesKeySize: 256 | 512;
  rsaKeySize: 2048 | 4096;
  enableQuantumResistance: boolean;
  enablePerfectForwardSecrecy: boolean;
}

const EncryptionSettings: React.FC<EncryptionSettingsProps> = ({ className = '' }) => {
  const [config, setConfig] = useState<EncryptionConfig>({
    mode: 'dual',
    aesKeySize: 256,
    rsaKeySize: 4096,
    enableQuantumResistance: false,
    enablePerfectForwardSecrecy: true,
  });

  const [isApplying, setIsApplying] = useState(false);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('stealthscore-encryption-config');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (error) {
        console.error('Failed to load encryption config:', error);
      }
    }
  }, []);

  const handleConfigChange = (updates: Partial<EncryptionConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const applySettings = async () => {
    setIsApplying(true);
    try {
      // Save to localStorage
      localStorage.setItem('stealthscore-encryption-config', JSON.stringify(config));
      
      // Simulate applying encryption settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Encryption settings applied successfully');
    } catch (error) {
      toast.error('Failed to apply encryption settings');
    } finally {
      setIsApplying(false);
    }
  };

  const getSecurityLevel = (): { level: string; color: string; description: string } => {
    if (config.mode === 'quantum-ready' && config.enableQuantumResistance) {
      return {
        level: 'Quantum-Ready',
        color: 'text-purple-400',
        description: 'Future-proof against quantum computing threats'
      };
    } else if (config.mode === 'dual' && config.rsaKeySize === 4096) {
      return {
        level: 'Military-Grade',
        color: 'text-green-400',
        description: 'Dual-layer encryption with maximum security'
      };
    } else if (config.mode === 'aes256') {
      return {
        level: 'Standard',
        color: 'text-blue-400',
        description: 'Industry-standard AES-256 encryption'
      };
    }
    return {
      level: 'Enhanced',
      color: 'text-cyan-400',
      description: 'Advanced encryption configuration'
    };
  };

  const securityInfo = getSecurityLevel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card p-6 space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-400/20 rounded-lg">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Encryption Settings</h3>
            <p className="text-white/70 text-sm">Configure dual encryption protocols</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-white/60 text-sm">Security Level</p>
          <p className={`text-sm font-medium ${securityInfo.color}`}>{securityInfo.level}</p>
        </div>
      </div>

      {/* Security Status */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <div className="flex items-center space-x-3 mb-2">
          <Check className={`w-5 h-5 ${securityInfo.color}`} />
          <span className="text-white font-medium">Current Configuration</span>
        </div>
        <p className="text-white/70 text-sm">{securityInfo.description}</p>
      </div>

      {/* Encryption Mode Selection */}
      <div className="space-y-3">
        <label className="text-white font-medium">Encryption Mode</label>
        <div className="grid grid-cols-1 gap-3">
          {[
            {
              mode: 'aes256' as EncryptionMode,
              title: 'AES-256 Only',
              description: 'Standard symmetric encryption',
              icon: Lock
            },
            {
              mode: 'dual' as EncryptionMode,
              title: 'Dual Encryption',
              description: 'AES-256 + RSA hybrid encryption',
              icon: Shield
            },
            {
              mode: 'quantum-ready' as EncryptionMode,
              title: 'Quantum-Ready',
              description: 'Post-quantum cryptography enabled',
              icon: Key
            }
          ].map((option) => (
            <motion.button
              key={option.mode}
              onClick={() => handleConfigChange({ mode: option.mode })}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                config.mode === option.mode
                  ? 'bg-blue-400/20 border-blue-400/50 text-white'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center space-x-3">
                <option.icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{option.title}</div>
                  <div className="text-sm opacity-70">{option.description}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Advanced Settings */}
      {config.mode !== 'aes256' && (
        <div className="space-y-4">
          <h4 className="text-white font-medium">Advanced Configuration</h4>
          
          {/* RSA Key Size */}
          <div className="space-y-2">
            <label className="text-white/80 text-sm">RSA Key Size</label>
            <div className="flex space-x-3">
              {[2048, 4096].map((size) => (
                <button
                  key={size}
                  onClick={() => handleConfigChange({ rsaKeySize: size as 2048 | 4096 })}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    config.rsaKeySize === size
                      ? 'bg-blue-400/20 text-blue-400 border border-blue-400/50'
                      : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {size}-bit
                </button>
              ))}
            </div>
          </div>

          {/* Quantum Resistance */}
          {config.mode === 'quantum-ready' && (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/80 text-sm">Quantum Resistance</div>
                <div className="text-white/60 text-xs">Enable post-quantum algorithms</div>
              </div>
              <button
                onClick={() => handleConfigChange({ enableQuantumResistance: !config.enableQuantumResistance })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.enableQuantumResistance ? 'bg-blue-400' : 'bg-white/20'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.enableQuantumResistance ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Perfect Forward Secrecy */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white/80 text-sm">Perfect Forward Secrecy</div>
              <div className="text-white/60 text-xs">Generate new keys for each session</div>
            </div>
            <button
              onClick={() => handleConfigChange({ enablePerfectForwardSecrecy: !config.enablePerfectForwardSecrecy })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.enablePerfectForwardSecrecy ? 'bg-blue-400' : 'bg-white/20'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.enablePerfectForwardSecrecy ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Warning for Quantum-Ready */}
      {config.mode === 'quantum-ready' && (
        <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Experimental Feature</span>
          </div>
          <p className="text-yellow-400/80 text-xs mt-1">
            Quantum-ready encryption is experimental and may impact performance.
          </p>
        </div>
      )}

      {/* Apply Button */}
      <motion.button
        onClick={applySettings}
        disabled={isApplying}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all"
      >
        {isApplying ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Settings className="w-4 h-4" />
            </motion.div>
            <span>Applying Settings...</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            <span>Apply Encryption Settings</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default EncryptionSettings;
