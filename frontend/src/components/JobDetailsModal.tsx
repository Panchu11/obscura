'use client'

import { X, Clock, DollarSign, User, CheckCircle, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Job } from '@/hooks/useObscura'
import { COMPUTATION_TYPE_NAMES, JOB_STATUS_NAMES, OBSCURA_ADDRESS } from '@/lib/contracts'
import { useObscura } from '@/hooks/useObscura'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface JobDetailsModalProps {
  job: Job
  onClose: () => void
}

export function JobDetailsModal({ job, onClose }: JobDetailsModalProps) {
  const { verifyAndPay, cancelJob, loading } = useObscura()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleVerifyAndPay = async () => {
    setIsProcessing(true)
    try {
      const txHash = await verifyAndPay(job.jobId)
      toast.success(`Payment sent! Transaction: ${txHash.slice(0, 10)}...`)
      onClose()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to verify and pay')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this job?')) return
    
    setIsProcessing(true)
    try {
      const txHash = await cancelJob(job.jobId)
      toast.success(`Job cancelled! Transaction: ${txHash.slice(0, 10)}...`)
      onClose()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to cancel job')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 1: return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 2: return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 3: return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 4: return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 5: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-obscura-gray-light rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Job Details</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                {JOB_STATUS_NAMES[job.status]}
              </span>
            </div>
            <p className="text-gray-400 text-sm">Job ID: #{job.jobId}</p>
          </div>

          {/* Job Information */}
          <div className="space-y-6">
            {/* Computation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Computation Type</label>
              <div className="bg-obscura-gray rounded-lg p-4">
                <p className="text-white font-semibold">{COMPUTATION_TYPE_NAMES[job.computationType]}</p>
              </div>
            </div>

            {/* Reward */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Reward</label>
              <div className="bg-obscura-gray rounded-lg p-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <p className="text-white font-semibold">{job.reward} ETH</p>
              </div>
            </div>

            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Client</label>
              <div className="bg-obscura-gray rounded-lg p-4 flex items-center gap-2">
                <User className="w-5 h-5 text-obscura-accent" />
                <a 
                  href={`https://sepolia.etherscan.io/address/${job.client}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-obscura-accent hover:text-obscura-accent-dark font-mono text-sm flex items-center gap-1"
                >
                  {job.client.slice(0, 6)}...{job.client.slice(-4)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Worker */}
            {job.worker !== '0x0000000000000000000000000000000000000000' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Worker</label>
                <div className="bg-obscura-gray rounded-lg p-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" />
                  <a 
                    href={`https://sepolia.etherscan.io/address/${job.worker}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-obscura-accent hover:text-obscura-accent-dark font-mono text-sm flex items-center gap-1"
                  >
                    {job.worker.slice(0, 6)}...{job.worker.slice(-4)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Created</label>
                <div className="bg-obscura-gray rounded-lg p-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <p className="text-white text-sm">{new Date(job.createdAt * 1000).toLocaleString()}</p>
                </div>
              </div>
              {job.completedAt > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Completed</label>
                  <div className="bg-obscura-gray rounded-lg p-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <p className="text-white text-sm">{new Date(job.completedAt * 1000).toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Encrypted Data */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Encrypted Input Data</label>
              <div className="bg-obscura-gray rounded-lg p-4">
                <p className="text-white font-mono text-xs break-all">
                  {job.encryptedInputs.slice(0, 100)}...
                </p>
              </div>
            </div>

            {/* Result if available */}
            {job.encryptedResult && job.encryptedResult !== '0x' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Encrypted Result</label>
                <div className="bg-obscura-gray rounded-lg p-4">
                  <p className="text-white font-mono text-xs break-all">
                    {job.encryptedResult.slice(0, 100)}...
                  </p>
                </div>
              </div>
            )}

            {/* Contract Link */}
            <div>
              <a 
                href={`https://sepolia.etherscan.io/address/${OBSCURA_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-obscura-accent hover:text-obscura-accent-dark text-sm flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Contract on Etherscan
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            {job.status === 2 && ( // Completed
              <button
                onClick={handleVerifyAndPay}
                disabled={isProcessing || loading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Verify & Pay Worker'}
              </button>
            )}
            {job.status === 0 && ( // Pending
              <button
                onClick={handleCancel}
                disabled={isProcessing || loading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Cancelling...' : 'Cancel Job'}
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-obscura-gray hover:bg-obscura-gray-light text-white font-semibold py-3 rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

