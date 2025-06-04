import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Cpu, 
  Network, 
  Zap, 
  Eye, 
  Lock, 
  Globe,
  Trophy,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import AdvancedCard from './AdvancedCard';
import AdvancedLoader from './AdvancedLoader';
import TEEMonitor from './TEEMonitor';

const HackathonShowcase: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const hackathonFeatures = [
    {
      id: 'tee',
      title: 'Trusted Execution Environment',
      description: 'Secure computation in isolated hardware enclaves',
      icon: <Cpu className="w-6 h-6 text-blue-400" />,
      gradient: 'from-blue-400 to-cyan-500',
      demo: 'TEE simulation with attestation and secure processing'
    },
    {
      id: 'federated',
      title: 'Federated Learning',
      description: 'Collaborative AI training without data sharing',
      icon: <Network className="w-6 h-6 text-green-400" />,
      gradient: 'from-green-400 to-emerald-500',
      demo: 'Distributed model updates with differential privacy'
    },
    {
      id: 'zk',
      title: 'Zero-Knowledge Proofs',
      description: 'Verify computations without revealing data',
      icon: <Eye className="w-6 h-6 text-purple-400" />,
      gradient: 'from-purple-400 to-pink-500',
      demo: 'Cryptographic proofs for score verification'
    },
    {
      id: 'did',
      title: 'Decentralized Identity',
      description: 'Web3-native identity and reputation system',
      icon: <Globe className="w-6 h-6 text-orange-400" />,
      gradient: 'from-orange-400 to-red-500',
      demo: 'DID verification and trust graph integration'
    }
  ];

  const runDemo = async (featureId: string) => {
    setActiveDemo(featureId);
    setIsLoading(true);
    
    // Simulate demo execution
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6"
        >
          <Trophy className="w-12 h-12 text-white" />
        </motion.div>
        
        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
          OnlyFounders AI Hackathon
        </h1>
        
        <p className="text-white/80 text-xl max-w-3xl mx-auto mb-8">
          Experience the future of privacy-preserving AI with our revolutionary decentralized fundraising platform
        </p>

        <div className="flex items-center justify-center space-x-4 text-sm text-white/60">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Privacy-First</span>
          </div>
          <div className="w-1 h-1 bg-white/40 rounded-full" />
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span>TEE + ZK Proofs</span>
          </div>
          <div className="w-1 h-1 bg-white/40 rounded-full" />
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Web3 Native</span>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hackathonFeatures.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <AdvancedCard
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              gradient={feature.gradient}
              animationType="elastic"
              onClick={() => runDemo(feature.id)}
              className="h-64"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full mt-4 px-4 py-2 bg-gradient-to-r ${feature.gradient} rounded-lg text-white font-medium flex items-center justify-center space-x-2`}
                onClick={(e) => {
                  e.stopPropagation();
                  runDemo(feature.id);
                }}
              >
                <span>Run Demo</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </AdvancedCard>
          </motion.div>
        ))}
      </div>

      {/* Demo Area */}
      <AnimatePresence mode="wait">
        {activeDemo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">
                {hackathonFeatures.find(f => f.id === activeDemo)?.title} Demo
              </h3>
              
              <button
                onClick={() => setActiveDemo(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <AdvancedLoader 
                  message={`Initializing ${hackathonFeatures.find(f => f.id === activeDemo)?.title}...`}
                  type="elastic"
                />
              </div>
            ) : (
              <div className="space-y-6">
                {activeDemo === 'tee' && (
                  <TEEMonitor onTEEStatusChange={(status) => console.log('TEE Status:', status)} />
                )}
                
                {activeDemo === 'federated' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">Global Model</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Round</span>
                          <span className="text-green-400">#42</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Participants</span>
                          <span className="text-blue-400">156</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Privacy Budget</span>
                          <span className="text-yellow-400">85%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">Local Updates</h4>
                      <div className="space-y-2">
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full w-3/4" />
                        </div>
                        <p className="text-white/70 text-sm">Training progress: 75%</p>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-2">Differential Privacy</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Epsilon</span>
                          <span className="text-purple-400">0.1</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">Noise Scale</span>
                          <span className="text-purple-400">10.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeDemo === 'zk' && (
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-6">
                      <h4 className="text-white font-semibold mb-4">Zero-Knowledge Proof Generation</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white/70 text-sm mb-2">Proof Statement</label>
                          <div className="bg-white/10 rounded-lg p-3 text-white/80 text-sm font-mono">
                            score &gt; threshold ∧ valid_computation
                          </div>
                        </div>
                        <div>
                          <label className="block text-white/70 text-sm mb-2">Proof Hash</label>
                          <div className="bg-white/10 rounded-lg p-3 text-green-400 text-sm font-mono">
                            0x7f9a2b8c...d4e5f6a7
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center space-x-2 text-green-400">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">Proof verified successfully</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeDemo === 'did' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-lg p-6">
                      <h4 className="text-white font-semibold mb-4">Decentralized Identity</h4>
                      <div className="space-y-3">
                        <div>
                          <span className="text-white/70 text-sm">DID:</span>
                          <p className="text-white font-mono text-sm break-all">
                            did:ethr:0x1234...abcd
                          </p>
                        </div>
                        <div>
                          <span className="text-white/70 text-sm">Verification Method:</span>
                          <p className="text-blue-400 text-sm">secp256k1</p>
                        </div>
                        <div>
                          <span className="text-white/70 text-sm">Identity Score:</span>
                          <p className="text-green-400 text-lg font-bold">8.7/10</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-6">
                      <h4 className="text-white font-semibold mb-4">Trust Graph</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-white/70 text-sm">Network Position:</span>
                          <span className="text-yellow-400 text-sm">Top Tier</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70 text-sm">Connections:</span>
                          <span className="text-blue-400 text-sm">42 verified</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70 text-sm">Reputation Rank:</span>
                          <span className="text-green-400 text-sm">#15 of 1,247</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-xl p-8 border border-yellow-400/20"
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          Ready to Experience the Future?
        </h3>
        <p className="text-white/70 mb-6 max-w-2xl mx-auto">
          PitchGuard represents the cutting edge of privacy-preserving AI for decentralized fundraising. 
          Built for the OnlyFounders hackathon with real-world impact in mind.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-black font-bold flex items-center space-x-2"
          >
            <Trophy className="w-5 h-5" />
            <span>Try Full Demo</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-medium flex items-center space-x-2"
          >
            <Globe className="w-5 h-5" />
            <span>View on GitHub</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HackathonShowcase;
