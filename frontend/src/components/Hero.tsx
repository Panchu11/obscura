'use client'

import { Shield, Lock, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface HeroProps {
  onCreateJob: () => void
}

export function Hero({ onCreateJob }: HeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-obscura-accent/20 to-obscura-accent-dark/20 p-12 mb-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Computing in the Shadows</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            The first decentralized marketplace for Fully Homomorphic Encrypted computation.
            <br />
            Your data remains hidden. Always.
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass rounded-lg p-6"
            >
              <Shield className="w-12 h-12 text-obscura-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-sm text-gray-400">
                Data never leaves encrypted form. Workers compute without seeing plaintext.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass rounded-lg p-6"
            >
              <Lock className="w-12 h-12 text-obscura-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Trustless Execution</h3>
              <p className="text-sm text-gray-400">
                Smart contract escrow ensures fair payment. No intermediaries needed.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass rounded-lg p-6"
            >
              <Zap className="w-12 h-12 text-obscura-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Powered by Zama</h3>
              <p className="text-sm text-gray-400">
                Built on FHEVM - the most advanced FHE blockchain protocol.
              </p>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={onCreateJob}
            className="bg-obscura-accent hover:bg-obscura-accent-dark text-white font-bold py-4 px-8 rounded-lg transition-all glow-hover"
          >
            Create Your First Job
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

