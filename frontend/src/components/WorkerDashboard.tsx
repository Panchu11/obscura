'use client'

import { useState } from 'react'
import { Server, Award, TrendingUp, Play, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useObscura } from '@/hooks/useObscura'
import { COMPUTATION_TYPE_NAMES, JOB_STATUS_NAMES, JobStatus } from '@/lib/contracts'

export function WorkerDashboard() {
  const { isWorker, workerInfo, jobs, registerWorker, claimJob, loading } = useObscura()
  const [workerName, setWorkerName] = useState('')
  const [stake, setStake] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!workerName.trim()) {
      toast.error('Please enter a worker name')
      return
    }

    if (!stake || parseFloat(stake) < 0.1) {
      toast.error('Minimum stake is 0.1 ETH (required for security)')
      return
    }

    setIsRegistering(true)

    try {
      const txHash = await registerWorker(workerName, stake)
      toast.success(`Registered! Transaction: ${txHash.slice(0, 10)}...`)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to register')
      console.error(error)
    } finally {
      setIsRegistering(false)
    }
  }

  const handleClaimJob = async (jobId: string) => {
    try {
      const txHash = await claimJob(jobId)
      toast.success(`Job claimed! Transaction: ${txHash.slice(0, 10)}...`)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to claim job')
      console.error(error)
    }
  }

  // Get available jobs (pending jobs)
  const availableJobs = jobs.filter(job => job.status === JobStatus.Pending)

  if (!isWorker) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <Server className="w-16 h-16 text-obscura-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Become a Worker</h2>
            <p className="text-gray-400">
              Earn rewards by executing encrypted computations
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Worker Name</label>
              <input
                type="text"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                placeholder="Enter your worker name"
                className="w-full bg-obscura-gray border border-obscura-gray-light rounded-lg p-4 text-white focus:outline-none focus:border-obscura-accent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stake Amount (ETH)</label>
              <input
                type="number"
                step="0.01"
                min="0.1"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="e.g., 0.1, 0.5, 1.0"
                className="w-full bg-obscura-gray border border-obscura-gray-light rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-obscura-accent"
                required
              />
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-400">
                  Minimum: 0.1 ETH (required for security) • You can stake more for higher reputation
                </p>
                <p className="text-xs text-gray-500">
                  💡 Your stake will be returned when you deregister
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full bg-obscura-accent hover:bg-obscura-accent-dark text-white font-semibold py-4 rounded-lg transition-all glow-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isRegistering && <Loader2 className="w-5 h-5 animate-spin" />}
              {isRegistering ? 'Registering...' : 'Register as Worker'}
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Worker Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass rounded-lg p-6">
          <Award className="w-8 h-8 text-yellow-400 mb-2" />
          <div className="text-2xl font-bold">{workerInfo?.reputation || 0}</div>
          <div className="text-sm text-gray-400">Reputation Score</div>
        </div>
        <div className="glass rounded-lg p-6">
          <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
          <div className="text-2xl font-bold">{workerInfo?.completedJobs || 0}</div>
          <div className="text-sm text-gray-400">Completed Jobs</div>
        </div>
        <div className="glass rounded-lg p-6">
          <Server className="w-8 h-8 text-blue-400 mb-2" />
          <div className="text-2xl font-bold">{workerInfo?.stake || '0'} ETH</div>
          <div className="text-sm text-gray-400">Total Earned</div>
        </div>
      </div>

      {/* Available Jobs */}
      <div>
        <h3 className="text-xl font-bold mb-4">Available Jobs</h3>
        <div className="space-y-3">
          {loading ? (
            <div className="glass rounded-lg p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-obscura-accent" />
              <p className="text-gray-400">Loading jobs...</p>
            </div>
          ) : availableJobs.length === 0 ? (
            <div className="glass rounded-lg p-12 text-center">
              <p className="text-gray-400">No available jobs at the moment. Check back soon!</p>
            </div>
          ) : (
            availableJobs.map((job) => (
              <div key={job.jobId} className="glass rounded-lg p-6 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{COMPUTATION_TYPE_NAMES[job.computationType]}</h4>
                  <p className="text-sm text-gray-400">Reward: {job.reward} ETH</p>
                  <p className="text-xs text-gray-500 mt-1">Job ID: {job.jobId}</p>
                </div>
                <button
                  onClick={() => handleClaimJob(job.jobId)}
                  disabled={loading}
                  className="bg-obscura-accent hover:bg-obscura-accent-dark text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-4 h-4" />
                  Claim Job
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

