'use client'

import { useState } from 'react'
import { Lock, Unlock, Zap, ArrowRight, CheckCircle, Code } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { demonstrateFHE, formatEncrypted } from '@/lib/fhe'
import toast from 'react-hot-toast'

export function FHEPlayground() {
  const [inputA, setInputA] = useState('25')
  const [inputB, setInputB] = useState('30')
  const [operation, setOperation] = useState<'add' | 'multiply' | 'compare'>('add')
  const [result, setResult] = useState<any>(null)
  const [isComputing, setIsComputing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const handleCompute = async () => {
    const a = parseInt(inputA)
    const b = parseInt(inputB)

    if (isNaN(a) || isNaN(b)) {
      toast.error('Please enter valid numbers')
      return
    }

    setIsComputing(true)
    setCurrentStep(0)
    setResult(null)

    try {
      // Simulate step-by-step process
      for (let i = 0; i <= 5; i++) {
        setCurrentStep(i)
        await new Promise(resolve => setTimeout(resolve, 800))
      }

      const demo = await demonstrateFHE(operation, a, b)
      setResult(demo)
      toast.success('FHE computation complete!')
    } catch (error: any) {
      toast.error(error?.message || 'Computation failed')
      console.error(error)
    } finally {
      setIsComputing(false)
    }
  }

  const steps = [
    { icon: Lock, label: 'Encrypting Input A', color: 'text-blue-400' },
    { icon: Lock, label: 'Encrypting Input B', color: 'text-blue-400' },
    { icon: Zap, label: 'Computing on Encrypted Data', color: 'text-yellow-400' },
    { icon: CheckCircle, label: 'Computation Complete', color: 'text-green-400' },
    { icon: Unlock, label: 'Decrypting Result', color: 'text-purple-400' },
    { icon: CheckCircle, label: 'Done!', color: 'text-green-400' },
  ]

  return (
    <div className="glass rounded-2xl p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold gradient-text">Interactive FHE Playground</h2>
        </div>
        <p className="text-gray-400 max-w-2xl mx-auto mb-3">
          Experience Fully Homomorphic Encryption in action! Compute on encrypted data without ever revealing the plaintext.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-400">
          <Code className="w-4 h-4" />
          <span>Demonstration using TFHE-inspired encryption • Production uses Zama's fhevmjs</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Input & Controls */}
        <div className="space-y-6">
          {/* Inputs */}
          <div className="glass rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-400" />
              Input Values
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Value A</label>
                <input
                  type="number"
                  value={inputA}
                  onChange={(e) => setInputA(e.target.value)}
                  className="w-full bg-obscura-gray border border-obscura-gray-light rounded-lg px-4 py-3 text-white text-lg font-mono focus:outline-none focus:border-obscura-accent"
                  disabled={isComputing}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Value B</label>
                <input
                  type="number"
                  value={inputB}
                  onChange={(e) => setInputB(e.target.value)}
                  className="w-full bg-obscura-gray border border-obscura-gray-light rounded-lg px-4 py-3 text-white text-lg font-mono focus:outline-none focus:border-obscura-accent"
                  disabled={isComputing}
                />
              </div>
            </div>
          </div>

          {/* Operation */}
          <div className="glass rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Operation
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'add', label: 'Add (+)', icon: '+' },
                { value: 'multiply', label: 'Multiply (×)', icon: '×' },
                { value: 'compare', label: 'Compare (>)', icon: '>' },
              ].map((op) => (
                <button
                  key={op.value}
                  onClick={() => setOperation(op.value as any)}
                  disabled={isComputing}
                  className={`p-4 rounded-lg font-semibold transition-all ${
                    operation === op.value
                      ? 'bg-obscura-accent text-white'
                      : 'bg-obscura-gray text-gray-400 hover:bg-obscura-gray-light'
                  }`}
                >
                  <div className="text-2xl mb-1">{op.icon}</div>
                  <div className="text-xs">{op.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Compute Button */}
          <button
            onClick={handleCompute}
            disabled={isComputing}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isComputing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Computing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Compute on Encrypted Data
              </>
            )}
          </button>
        </div>

        {/* Right: Visualization */}
        <div className="space-y-6">
          {/* Process Steps */}
          {isComputing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-lg p-6"
            >
              <h3 className="font-semibold mb-4">Process</h3>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: index <= currentStep ? 1 : 0.3,
                      x: 0 
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      index === currentStep ? 'bg-obscura-gray-light' : 'bg-obscura-gray/50'
                    }`}
                  >
                    <step.icon className={`w-5 h-5 ${index <= currentStep ? step.color : 'text-gray-600'}`} />
                    <span className={index <= currentStep ? 'text-white' : 'text-gray-600'}>
                      {step.label}
                    </span>
                    {index === currentStep && (
                      <div className="ml-auto w-4 h-4 border-2 border-obscura-accent border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {index < currentStep && (
                      <CheckCircle className="ml-auto w-4 h-4 text-green-400" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-lg p-6"
              >
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Result
                </h3>

                <div className="space-y-4">
                  {/* Encrypted Values */}
                  <div className="bg-obscura-gray rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-1">Encrypted A:</div>
                    <div className="font-mono text-xs text-blue-400 break-all">
                      {formatEncrypted(result.encryptedA, 40)}
                    </div>
                  </div>

                  <div className="bg-obscura-gray rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-1">Encrypted B:</div>
                    <div className="font-mono text-xs text-blue-400 break-all">
                      {formatEncrypted(result.encryptedB, 40)}
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-yellow-400" />
                  </div>

                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
                    <div className="text-xs text-gray-400 mb-1">Encrypted Result:</div>
                    <div className="font-mono text-xs text-green-400 break-all mb-3">
                      {formatEncrypted(result.encryptedResult, 40)}
                    </div>
                    <div className="pt-3 border-t border-green-500/30">
                      <div className="text-xs text-gray-400 mb-1">Decrypted Result:</div>
                      <div className="text-3xl font-bold text-green-400">
                        {result.result}
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Code className="w-5 h-5 text-blue-400 mt-0.5" />
                      <div className="text-sm text-gray-300">
                        <strong className="text-blue-400">How it works:</strong> Your inputs ({result.inputA} and {result.inputB}) were encrypted, 
                        the {result.operation.toLowerCase()} was performed on the encrypted values, 
                        and the result was decrypted to reveal <strong>{result.result}</strong> - 
                        all without exposing the intermediate values!
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Card */}
          {!isComputing && !result && (
            <div className="glass rounded-lg p-6">
              <h3 className="font-semibold mb-3">💡 How Obscura Uses FHE</h3>
              <p className="text-sm text-gray-400 mb-4">
                This playground demonstrates the CONCEPT of FHE. Our smart contracts use REAL TFHE operations via Zama's precompiled contracts on-chain!
              </p>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Client-side: Cryptographic encryption</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Smart Contract: REAL TFHE operations</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Workers: Zero knowledge computation</span>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-gray-400">
                <strong className="text-blue-400">Note:</strong> Our Solidity contracts use Zama's TFHE.sol library for real homomorphic operations (add, multiply, compare) on encrypted data.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

