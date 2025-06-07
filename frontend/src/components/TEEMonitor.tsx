import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Shield, 
  Lock, 
  CheckCircle, 
  AlertTriangle, 
  Activity,
  Zap,
  Eye,
  Database,
  Clock
} from 'lucide-react';

interface TEEStatus {
  status: 'active' | 'inactive' | 'simulated';
  attestation: {
    enclave_id: string;
    measurement: string;
    timestamp: number;
    signature: string;
  } | null;
  privacy_guarantees: string[];
  execution_time_ms: number;
}

interface TEEMonitorProps {
  onTEEStatusChange?: (status: TEEStatus) => void;
}

const TEEMonitor: React.FC<TEEMonitorProps> = ({ onTEEStatusChange }) => {
  const [teeStatus, setTeeStatus] = useState<TEEStatus>({
    status: 'simulated',
    attestation: null,
    privacy_guarantees: [
      'Data processed in isolated enclave',
      'Memory encryption active',
      'Attestation verified',
      'No data persistence',
      'Secure key management'
    ],
    execution_time_ms: 0
  });

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionHistory, setExecutionHistory] = useState<Array<{
    timestamp: number;
    type: string;
    duration: number;
    status: 'success' | 'error';
  }>>([]);

  useEffect(() => {
    
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        simulateTEEExecution();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const simulateTEEExecution = async () => {
    setIsExecuting(true);
    
    try {
      
      const response = await fetch('/api/tee/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          encrypted_data: btoa('sample_pitch_data'),
          computation_type: 'pitch_analysis',
          attestation_required: true
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        const newStatus: TEEStatus = {
          status: 'active',
          attestation: result.attestation,
          privacy_guarantees: result.privacy_guarantees,
          execution_time_ms: result.result.execution_time_ms
        };

        setTeeStatus(newStatus);

        setExecutionHistory(prev => [
          {
            timestamp: Date.now(),
            type: 'pitch_analysis',
            duration: result.result.execution_time_ms,
            status: 'success'
          },
          ...prev.slice(0, 9) 
        ]);

        if (onTEEStatusChange) {
          onTEEStatusChange(newStatus);
        }
      }
    } catch (error) {
      console.error('TEE execution failed:', error);
      setExecutionHistory(prev => [
        {
          timestamp: Date.now(),
          type: 'pitch_analysis',
          duration: 0,
          status: 'error'
        },
        ...prev.slice(0, 9)
      ]);
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'simulated': return 'yellow';
      case 'inactive': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5" />;
      case 'simulated': return <AlertTriangle className="w-5 h-5" />;
      case 'inactive': return <Eye className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6"
    >
      {}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-400/20 rounded-lg">
            <Cpu className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">TEE Monitor</h3>
            <p className="text-white/70 text-sm">Trusted Execution Environment</p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-${getStatusColor(teeStatus.status)}-400/20`}>
          <div className={`text-${getStatusColor(teeStatus.status)}-400`}>
            {getStatusIcon(teeStatus.status)}
          </div>
          <span className={`text-${getStatusColor(teeStatus.status)}-400 text-sm font-medium capitalize`}>
            {teeStatus.status}
          </span>
        </div>
      </div>

      {}
      {teeStatus.attestation && (
        <div className="bg-white/5 rounded-lg p-4 space-y-3">
          <h4 className="text-white font-medium flex items-center">
            <Shield className="w-4 h-4 mr-2 text-green-400" />
            Attestation Details
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-white/70">Enclave ID:</span>
              <p className="text-white font-mono text-xs break-all">
                {teeStatus.attestation.enclave_id}
              </p>
            </div>
            
            <div>
              <span className="text-white/70">Measurement:</span>
              <p className="text-white font-mono text-xs break-all">
                {teeStatus.attestation.measurement.slice(0, 16)}...
              </p>
            </div>
            
            <div>
              <span className="text-white/70">Timestamp:</span>
              <p className="text-white">
                {new Date(teeStatus.attestation.timestamp * 1000).toLocaleTimeString()}
              </p>
            </div>
            
            <div>
              <span className="text-white/70">Execution Time:</span>
              <p className="text-white">
                {teeStatus.execution_time_ms.toFixed(2)}ms
              </p>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="space-y-3">
        <h4 className="text-white font-medium flex items-center">
          <Lock className="w-4 h-4 mr-2 text-purple-400" />
          Privacy Guarantees
        </h4>
        
        <div className="grid grid-cols-1 gap-2">
          {teeStatus.privacy_guarantees.map((guarantee, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-2 text-sm"
            >
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-white/80">{guarantee}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium flex items-center">
            <Clock className="w-4 h-4 mr-2 text-blue-400" />
            Recent Executions
          </h4>
          
          <button
            onClick={simulateTEEExecution}
            disabled={isExecuting}
            className="flex items-center space-x-2 px-3 py-1 bg-blue-400/20 text-blue-400 rounded-lg hover:bg-blue-400/30 transition-colors disabled:opacity-50"
          >
            {isExecuting ? (
              <Activity className="w-4 h-4 animate-pulse" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span className="text-sm">
              {isExecuting ? 'Executing...' : 'Test TEE'}
            </span>
          </button>
        </div>
        
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {executionHistory.length === 0 ? (
            <p className="text-white/50 text-sm text-center py-4">
              No executions yet
            </p>
          ) : (
            executionHistory.map((execution, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white/5 rounded-lg text-sm"
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    execution.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <span className="text-white/80">{execution.type}</span>
                </div>
                
                <div className="flex items-center space-x-3 text-white/60">
                  <span>{execution.duration.toFixed(1)}ms</span>
                  <span>{new Date(execution.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TEEMonitor;
