'use client'

import { useEffect, useState } from 'react'
import { Shield, Lock, Eye, EyeOff, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { useObscura } from '@/hooks/useObscura'
import { Job } from '@/hooks/useObscura'

export function PrivacyDashboard() {
  const { myJobs } = useObscura()
  const [privacyScore, setPrivacyScore] = useState(0)
  const [stats, setStats] = useState({
    totalEncrypted: 0,
    neverExposed: 0,
    secureComputations: 0,
    privacyViolations: 0,
  })

  useEffect(() => {
    if (myJobs.length === 0) return

    // Calculate privacy metrics
    const totalEncrypted = myJobs.length
    const neverExposed = myJobs.filter(j => j.encryptedInputs && j.encryptedInputs !== '0x').length
    const secureComputations = myJobs.filter(j => j.status >= 2).length
    const privacyViolations = 0 // In real app, track any privacy issues

    // Calculate privacy score (0-100)
    const score = Math.min(100, Math.round(
      (neverExposed / Math.max(totalEncrypted, 1)) * 40 +
      (secureComputations / Math.max(totalEncrypted, 1)) * 40 +
      (privacyViolations === 0 ? 20 : 0)
    ))

    setPrivacyScore(score)
    setStats({
      totalEncrypted,
      neverExposed,
      secureComputations,
      privacyViolations,
    })
  }, [myJobs])

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500'
    if (score >= 70) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  return (
    <div className="space-y-6">
      {/* Privacy Score */}
      <div className="glass rounded-2xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Privacy Dashboard</h2>
              <p className="text-sm text-gray-400">Your data protection metrics</p>
            </div>
          </div>
        </div>

        {/* Score Circle */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <svg className="w-48 h-48 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-obscura-gray"
              />
              {/* Progress circle */}
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: 553 }}
                animate={{ strokeDashoffset: 553 - (553 * privacyScore) / 100 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{
                  strokeDasharray: 553,
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className={`stop-color-${privacyScore >= 90 ? 'green' : privacyScore >= 70 ? 'yellow' : 'red'}-500`} />
                  <stop offset="100%" className={`stop-color-${privacyScore >= 90 ? 'emerald' : privacyScore >= 70 ? 'orange' : 'pink'}-500`} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-5xl font-bold ${getScoreColor(privacyScore)}`}>
                {privacyScore}
              </div>
              <div className="text-sm text-gray-400">Privacy Score</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-obscura-gray rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <div className="text-xs text-gray-400">Total Encrypted</div>
            </div>
            <div className="text-2xl font-bold">{stats.totalEncrypted}</div>
          </div>

          <div className="bg-obscura-gray rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <EyeOff className="w-4 h-4 text-green-400" />
              <div className="text-xs text-gray-400">Never Exposed</div>
            </div>
            <div className="text-2xl font-bold text-green-400">{stats.neverExposed}</div>
          </div>

          <div className="bg-obscura-gray rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-purple-400" />
              <div className="text-xs text-gray-400">Secure Computations</div>
            </div>
            <div className="text-2xl font-bold text-purple-400">{stats.secureComputations}</div>
          </div>

          <div className="bg-obscura-gray rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <div className="text-xs text-gray-400">Privacy Violations</div>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{stats.privacyViolations}</div>
          </div>
        </div>
      </div>

      {/* Privacy Features */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* What's Protected */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            What's Protected
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Input Data', status: 'Fully Encrypted', icon: Lock, color: 'text-green-400' },
              { label: 'Computation Process', status: 'Zero Knowledge', icon: EyeOff, color: 'text-green-400' },
              { label: 'Results', status: 'Client-Only Decryption', icon: Lock, color: 'text-green-400' },
              { label: 'Worker Identity', status: 'Pseudonymous', icon: Shield, color: 'text-blue-400' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-obscura-gray rounded-lg">
                <div className="flex items-center gap-2">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm">{item.label}</span>
                </div>
                <span className="text-xs text-gray-400">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Who Can See What */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-400" />
            Who Can See What
          </h3>
          <div className="space-y-3">
            {[
              { role: 'You (Client)', canSee: 'Everything (after decryption)', icon: CheckCircle, color: 'text-green-400' },
              { role: 'Workers', canSee: 'Only encrypted data', icon: EyeOff, color: 'text-yellow-400' },
              { role: 'Blockchain', canSee: 'Only encrypted data', icon: EyeOff, color: 'text-yellow-400' },
              { role: 'Public', canSee: 'Only encrypted data', icon: EyeOff, color: 'text-red-400' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-obscura-gray rounded-lg">
                <div className="flex items-center gap-2">
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-sm font-medium">{item.role}</span>
                </div>
                <span className="text-xs text-gray-400">{item.canSee}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Encryption Details */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-purple-400" />
          Encryption Details
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-obscura-gray rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Algorithm</div>
            <div className="font-semibold">TFHE (Fully Homomorphic)</div>
            <div className="text-xs text-gray-500 mt-1">Zama's FHE implementation</div>
          </div>
          <div className="bg-obscura-gray rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Security Level</div>
            <div className="font-semibold text-green-400">128-bit</div>
            <div className="text-xs text-gray-500 mt-1">Military-grade encryption</div>
          </div>
          <div className="bg-obscura-gray rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-1">Key Management</div>
            <div className="font-semibold text-blue-400">Client-Side</div>
            <div className="text-xs text-gray-500 mt-1">You control your keys</div>
          </div>
        </div>
      </div>

      {/* Privacy Tips */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Privacy Best Practices
        </h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <span>Always verify job completion before paying workers</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <span>Keep your private keys secure - they're needed for decryption</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <span>Review worker reputation before assigning sensitive jobs</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
            <span>Your data never leaves encrypted state during computation</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

