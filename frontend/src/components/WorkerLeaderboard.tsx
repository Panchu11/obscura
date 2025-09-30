'use client'

import { useEffect, useState } from 'react'
import { Trophy, Award, TrendingUp, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useObscura } from '@/hooks/useObscura'
import { JobStatus } from '@/lib/contracts'

interface WorkerStats {
  address: string
  jobsCompleted: number
  totalEarned: number
  avgCompletionTime: number
  successRate: number
  rank: number
}

export function WorkerLeaderboard() {
  const { jobs } = useObscura()
  const [topWorkers, setTopWorkers] = useState<WorkerStats[]>([])

  useEffect(() => {
    if (jobs.length === 0) return

    // Calculate stats for each worker
    const workerStatsMap = jobs.reduce((acc, job) => {
      if (job.worker === '0x0000000000000000000000000000000000000000') return acc

      if (!acc[job.worker]) {
        acc[job.worker] = {
          address: job.worker,
          jobsCompleted: 0,
          totalEarned: 0,
          totalTime: 0,
          completedJobs: 0,
          totalJobs: 0,
        }
      }

      acc[job.worker].totalJobs++

      if (job.status === JobStatus.Completed || job.status === JobStatus.Verified) {
        acc[job.worker].jobsCompleted++
        acc[job.worker].completedJobs++
        acc[job.worker].totalEarned += parseFloat(job.reward || '0') * 0.98 // 2% platform fee
        
        if (job.completedAt > 0) {
          acc[job.worker].totalTime += (job.completedAt - job.createdAt)
        }
      }

      return acc
    }, {} as Record<string, any>)

    // Convert to array and calculate derived stats
    const workerStats: WorkerStats[] = Object.values(workerStatsMap).map((stats: any) => ({
      address: stats.address,
      jobsCompleted: stats.jobsCompleted,
      totalEarned: stats.totalEarned,
      avgCompletionTime: stats.completedJobs > 0 ? stats.totalTime / stats.completedJobs : 0,
      successRate: stats.totalJobs > 0 ? (stats.completedJobs / stats.totalJobs) * 100 : 0,
      rank: 0,
    }))

    // Sort by jobs completed and assign ranks
    workerStats.sort((a, b) => b.jobsCompleted - a.jobsCompleted)
    workerStats.forEach((worker, index) => {
      worker.rank = index + 1
    })

    setTopWorkers(workerStats.slice(0, 10))
  }, [jobs])

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h`
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-400" />
      case 2: return <Award className="w-5 h-5 text-gray-300" />
      case 3: return <Award className="w-5 h-5 text-orange-400" />
      default: return <span className="text-gray-400 font-bold">#{rank}</span>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30'
      case 2: return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30'
      case 3: return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 border-orange-500/30'
      default: return 'bg-obscura-gray border-obscura-gray-light'
    }
  }

  if (topWorkers.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">No workers yet. Be the first to register and start earning!</p>
      </div>
    )
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold">Worker Leaderboard</h2>
        </div>
        <div className="text-xs text-gray-400">Top 10 Workers</div>
      </div>

      <div className="space-y-3">
        {topWorkers.map((worker, index) => (
          <motion.div
            key={worker.address}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`border rounded-lg p-4 ${getRankBg(worker.rank)} hover:bg-obscura-gray-light transition-all`}
          >
            <div className="flex items-center justify-between">
              {/* Rank & Address */}
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 flex items-center justify-center">
                  {getRankIcon(worker.rank)}
                </div>
                <div className="flex-1">
                  <div className="font-mono text-sm text-white">
                    {worker.address.slice(0, 8)}...{worker.address.slice(-6)}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {worker.jobsCompleted} jobs
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {worker.successRate.toFixed(0)}% success
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-sm font-bold text-green-400">
                    {worker.totalEarned.toFixed(4)} ETH
                  </div>
                  <div className="text-xs text-gray-400">Earned</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-400">
                    {formatTime(worker.avgCompletionTime)}
                  </div>
                  <div className="text-xs text-gray-400">Avg Time</div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-obscura-gray-light grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-yellow-400">
            {topWorkers.reduce((sum, w) => sum + w.jobsCompleted, 0)}
          </div>
          <div className="text-xs text-gray-400">Total Jobs</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">
            {topWorkers.reduce((sum, w) => sum + w.totalEarned, 0).toFixed(4)}
          </div>
          <div className="text-xs text-gray-400">Total Earned (ETH)</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">
            {(topWorkers.reduce((sum, w) => sum + w.successRate, 0) / topWorkers.length).toFixed(0)}%
          </div>
          <div className="text-xs text-gray-400">Avg Success Rate</div>
        </div>
      </div>
    </div>
  )
}

