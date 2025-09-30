'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Server, Unlock, ArrowRight, Shield, Zap, CheckCircle } from 'lucide-react'

interface VisualizerProps {
  isActive?: boolean
}

export function ComputationVisualizer({ isActive = false }: VisualizerProps) {
  const [stage, setStage] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    if (!isActive) {
      setStage(0)
      return
    }

    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % 6)
    }, 2000)

    return () => clearInterval(interval)
  }, [isActive])

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
    setParticles(newParticles)
  }, [])

  const stages = [
    {
      title: 'Client Encrypts Data',
      description: 'User data is encrypted using FHE before leaving the client',
      icon: Lock,
      color: 'from-blue-500 to-cyan-500',
      position: 'left',
    },
    {
      title: 'Data Sent to Blockchain',
      description: 'Encrypted data is stored on-chain, visible but unreadable',
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
      position: 'center',
    },
    {
      title: 'Worker Claims Job',
      description: 'Worker node picks up the job from the marketplace',
      icon: Server,
      color: 'from-green-500 to-emerald-500',
      position: 'right',
    },
    {
      title: 'Computing on Encrypted Data',
      description: 'Worker performs computation without seeing plaintext',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      position: 'right',
    },
    {
      title: 'Encrypted Result Submitted',
      description: 'Result is submitted back to blockchain, still encrypted',
      icon: Shield,
      color: 'from-indigo-500 to-purple-500',
      position: 'center',
    },
    {
      title: 'Client Decrypts Result',
      description: 'Only the client can decrypt and view the final result',
      icon: Unlock,
      color: 'from-green-500 to-teal-500',
      position: 'left',
    },
  ]

  const currentStage = stages[stage]

  return (
    <div className="relative glass rounded-2xl p-8 overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-obscura-accent rounded-full"
            initial={{ x: `${particle.x}%`, y: `${particle.y}%` }}
            animate={{
              x: [`${particle.x}%`, `${(particle.x + 20) % 100}%`],
              y: [`${particle.y}%`, `${(particle.y + 20) % 100}%`],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10 + particle.id,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-12">
        <h2 className="text-3xl font-bold gradient-text mb-3">Live Computation Flow</h2>
        <p className="text-gray-400">Watch how FHE keeps your data private throughout the entire process</p>
      </div>

      {/* Visualization */}
      <div className="relative z-10">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            {stages.map((s, index) => (
              <div
                key={index}
                className={`flex-1 h-2 mx-1 rounded-full transition-all duration-500 ${
                  index <= stage
                    ? 'bg-gradient-to-r ' + s.color
                    : 'bg-obscura-gray'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Start</span>
            <span>Processing</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Main Visualization */}
        <div className="grid grid-cols-3 gap-8 mb-12">
          {/* Client */}
          <motion.div
            animate={{
              scale: currentStage.position === 'left' ? 1.05 : 1,
              opacity: currentStage.position === 'left' ? 1 : 0.5,
            }}
            className="glass rounded-xl p-6 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="font-semibold mb-2">Client</h3>
            <p className="text-xs text-gray-400">Encrypts & Decrypts</p>
            
            {/* Data flow animation */}
            {(stage === 0 || stage === 1) && (
              <motion.div
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 100 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute top-1/2 left-full w-8 h-1 bg-gradient-to-r from-blue-500 to-transparent"
              />
            )}
          </motion.div>

          {/* Blockchain */}
          <motion.div
            animate={{
              scale: currentStage.position === 'center' ? 1.05 : 1,
              opacity: currentStage.position === 'center' ? 1 : 0.5,
            }}
            className="glass rounded-xl p-6 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="font-semibold mb-2">Blockchain</h3>
            <p className="text-xs text-gray-400">Stores Encrypted Data</p>
            
            {/* Pulsing effect when active */}
            {currentStage.position === 'center' && (
              <motion.div
                className="absolute inset-0 border-2 border-purple-500 rounded-xl"
                animate={{ opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>

          {/* Worker */}
          <motion.div
            animate={{
              scale: currentStage.position === 'right' ? 1.05 : 1,
              opacity: currentStage.position === 'right' ? 1 : 0.5,
            }}
            className="glass rounded-xl p-6 text-center relative"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
              <Server className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-semibold mb-2">Worker</h3>
            <p className="text-xs text-gray-400">Computes Blindly</p>
            
            {/* Computing animation */}
            {stage === 3 && (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Zap className="w-12 h-12 text-yellow-400" />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Current Stage Info */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`bg-gradient-to-r ${currentStage.color} bg-opacity-10 border border-opacity-30 rounded-xl p-6`}
            style={{
              borderColor: `rgba(var(--tw-gradient-stops), 0.3)`,
            }}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 bg-gradient-to-br ${currentStage.color} bg-opacity-20 rounded-lg`}>
                <currentStage.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  {currentStage.title}
                  <span className="text-sm font-normal text-gray-400">
                    (Step {stage + 1}/6)
                  </span>
                </h3>
                <p className="text-gray-300">{currentStage.description}</p>
              </div>
              {stage === 5 && (
                <CheckCircle className="w-6 h-6 text-green-400" />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Key Points */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-obscura-gray rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <h4 className="font-semibold text-sm">End-to-End Encryption</h4>
            </div>
            <p className="text-xs text-gray-400">
              Data is encrypted before leaving your device and stays encrypted throughout
            </p>
          </div>
          
          <div className="bg-obscura-gray rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <h4 className="font-semibold text-sm">Zero Knowledge</h4>
            </div>
            <p className="text-xs text-gray-400">
              Workers compute without ever seeing your plaintext data
            </p>
          </div>
          
          <div className="bg-obscura-gray rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Unlock className="w-4 h-4 text-green-400" />
              <h4 className="font-semibold text-sm">Private Results</h4>
            </div>
            <p className="text-xs text-gray-400">
              Only you can decrypt and view the final computation results
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

