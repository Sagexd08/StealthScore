'use client'

import { motion } from 'framer-motion'
import { Chrome, Shield } from 'lucide-react'

export default function GoogleOneTapPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Google One Tap Demo
          </h1>
          <p className="text-white/70">
            Experience seamless authentication
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl max-w-sm mx-auto"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-center justify-center mb-4"
            >
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-full shadow-lg">
                <Chrome className="w-6 h-6 text-white" />
              </div>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg font-semibold text-white mb-2"
            >
              Quick Sign In
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-white/70 text-sm mb-4"
            >
              Google One Tap will appear automatically when available
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-center justify-center gap-2 text-xs text-white/50"
            >
              <Shield className="w-3 h-3" />
              <span>Secure authentication with Google</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
