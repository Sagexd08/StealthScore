import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Wallet,
  ArrowLeft,
  Shield,
  Zap,
  CheckCircle,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import StripePayment from './StripePayment';
import CryptoPayment from './CryptoPayment';
import { useWeb3Wallet } from '../hooks/useWeb3Wallet';

interface PricingTier {
  id: string;
  name: string;
  price: {
    usd: number;
    eth: string;
    matic: string;
  };
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  gradient: string;
}

interface PaymentProcessorProps {
  tier: PricingTier;
  onSuccess: () => void;
  onCancel: () => void;
}

type PaymentMethod = 'selection' | 'stripe' | 'crypto';

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ tier, onSuccess, onCancel }) => {
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod>('selection');
  const { isMetaMaskInstalled } = useWeb3Wallet();

  const handleMethodSelect = (method: 'stripe' | 'crypto') => {
    setCurrentMethod(method);
  };

  const handleBack = () => {
    setCurrentMethod('selection');
  };

  const renderMethodSelection = () => (
    <div className="space-y-6">
      {}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Choose Payment Method</h2>
        <p className="text-white/70">Select how you'd like to pay for {tier.name}</p>
      </div>

      {}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
          <p className="text-white/70 text-sm mb-4">{tier.description}</p>
          <div className="text-3xl font-bold text-white mb-1">${tier.price.usd}</div>
          <div className="text-white/60 text-sm">per {tier.period}</div>
        </div>
      </div>

      {}
      <div className="space-y-4">
        {}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleMethodSelect('stripe')}
          className="w-full p-6 bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-400/30 rounded-lg hover:border-blue-400/50 transition-all group"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-400/20 rounded-lg group-hover:bg-blue-400/30 transition-colors">
              <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-lg font-semibold text-white">Credit/Debit Card</h4>
              <p className="text-white/70 text-sm">Pay with Visa, Mastercard, or American Express</p>
              <div className="flex items-center space-x-2 mt-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-green-300 text-xs">Secured by Stripe</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">${tier.price.usd}</div>
              <div className="text-white/60 text-sm">USD</div>
            </div>
          </div>
        </motion.button>

        {}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleMethodSelect('crypto')}
          disabled={!isMetaMaskInstalled}
          className="w-full p-6 bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-400/30 rounded-lg hover:border-purple-400/50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-400/20 rounded-lg group-hover:bg-purple-400/30 transition-colors">
              <Wallet className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-lg font-semibold text-white">Cryptocurrency</h4>
              <p className="text-white/70 text-sm">Pay with ETH, MATIC, BNB, or other crypto</p>
              <div className="flex items-center space-x-2 mt-2">
                {isMetaMaskInstalled ? (
                  <>
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-300 text-xs">Instant & Decentralized</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-300 text-xs">Requires MetaMask</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">{tier.price.eth}</div>
              <div className="text-white/60 text-sm">ETH</div>
            </div>
          </div>
        </motion.button>
      </div>

      {}
      {!isMetaMaskInstalled && (
        <div className="bg-orange-400/10 border border-orange-400/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-orange-300 text-sm font-medium">MetaMask Required</p>
              <p className="text-orange-200/70 text-xs mb-3">
                Install MetaMask browser extension to use cryptocurrency payments.
              </p>
              <button
                onClick={() => window.open('https:
                className="inline-flex items-center space-x-2 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 rounded text-white text-xs transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Install MetaMask</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="bg-blue-400/10 border border-blue-400/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
          <div>
            <p className="text-blue-300 text-sm font-medium">Secure Payments</p>
            <p className="text-blue-200/70 text-xs">
              All payments are processed securely. We never store your payment information.
            </p>
          </div>
        </div>
      </div>

      {}
      <button
        onClick={onCancel}
        className="w-full px-6 py-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
      >
        Cancel
      </button>
    </div>
  );

  const renderPaymentForm = () => {
    switch (currentMethod) {
      case 'stripe':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">Card Payment</h2>
                <p className="text-white/70 text-sm">Complete your payment with Stripe</p>
              </div>
            </div>
            <StripePayment tier={tier} onSuccess={onSuccess} onCancel={handleBack} />
          </div>
        );
      
      case 'crypto':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-white">Crypto Payment</h2>
                <p className="text-white/70 text-sm">Pay with your preferred cryptocurrency</p>
              </div>
            </div>
            <CryptoPayment tier={tier} onSuccess={onSuccess} onCancel={handleBack} />
          </div>
        );
      
      default:
        return renderMethodSelection();
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMethod}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPaymentForm()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PaymentProcessor;
