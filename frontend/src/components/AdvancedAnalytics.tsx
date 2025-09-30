'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Activity, DollarSign, Users, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useObscura } from '@/hooks/useObscura'
import { JobStatus } from '@/lib/contracts'

interface AnalyticsData {
  totalVolume: number
  avgJobReward: number
  completionRate: number
  activeWorkers: number
  avgCompletionTime: number
  volumeTrend: number
  jobsLast24h: number
  topWorker: string
}

export function AdvancedAnalytics() {
  const { jobs } = useObscura()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVolume: 0,
    avgJobReward: 0,
    completionRate: 0,
    activeWorkers: 0,
    avgCompletionTime: 0,
    volumeTrend: 0,
    jobsLast24h: 0,
    topWorker: '',
  })

  useEffect(() => {
    if (jobs.length === 0) return

    // Calculate total volume
    const totalVolume = jobs.reduce((sum, job) => sum + parseFloat(job.reward || '0'), 0)

    // Calculate average job reward
    const avgJobReward = totalVolume / jobs.length

    // Calculate completion rate
    const completedJobs = jobs.filter(j => j.status === JobStatus.Completed || j.status === JobStatus.Verified).length
    const completionRate = (completedJobs / jobs.length) * 100

    // Count active workers
    const activeWorkers = new Set(
      jobs.filter(j => j.worker !== '0x0000000000000000000000000000000000000000').map(j => j.worker)
    ).size

    // Calculate average completion time
    const completedJobsWithTime = jobs.filter(j => j.completedAt > 0)
    const avgCompletionTime = completedJobsWithTime.length > 0
      ? completedJobsWithTime.reduce((sum, job) => sum + (job.completedAt - job.createdAt), 0) / completedJobsWithTime.length
      : 0

    // Jobs in last 24 hours
    const now = Math.floor(Date.now() / 1000)
    const jobsLast24h = jobs.filter(j => now - j.createdAt < 86400).length

    // Volume trend (comparing last 24h to previous 24h)
    const last24hVolume = jobs
      .filter(j => now - j.createdAt < 86400)
      .reduce((sum, job) => sum + parseFloat(job.reward || '0'), 0)
    const prev24hVolume = jobs
      .filter(j => now - j.createdAt >= 86400 && now - j.createdAt < 172800)
      .reduce((sum, job) => sum + parseFloat(job.reward || '0'), 0)
    const volumeTrend = prev24hVolume > 0 ? ((last24hVolume - prev24hVolume) / prev24hVolume) * 100 : 0

    // Find top worker
    const workerJobCounts = jobs.reduce((acc, job) => {
      if (job.worker !== '0x0000000000000000000000000000000000000000') {
        acc[job.worker] = (acc[job.worker] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)
    const topWorker = Object.entries(workerJobCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || ''

    setAnalytics({
      totalVolume,
      avgJobReward,
      completionRate,
      activeWorkers,
      avgCompletionTime,
      volumeTrend,
      jobsLast24h,
      topWorker,
    })
  }, [jobs])

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h`
  }

  const metrics = [
    {
      label: 'Total Volume',
      value: `${analytics.totalVolume.toFixed(4)} ETH`,
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      trend: analytics.volumeTrend,
    },
    {
      label: 'Avg Job Reward',
      value: `${analytics.avgJobReward.toFixed(4)} ETH`,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'Completion Rate',
      value: `${analytics.completionRate.toFixed(1)}%`,
      icon: Activity,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Active Workers',
      value: analytics.activeWorkers,
      icon: Users,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Avg Completion',
      value: formatTime(analytics.avgCompletionTime),
      icon: Zap,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
    },
    {
      label: 'Jobs (24h)',
      value: analytics.jobsLast24h,
      icon: Activity,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
  ]

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">Advanced Analytics</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Data</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="glass rounded-lg p-4 hover:bg-obscura-gray-light transition-all"
          >
            <div className={`${metric.bgColor} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <div className="text-2xl font-bold mb-1">{metric.value}</div>
            <div className="text-xs text-gray-400 mb-2">{metric.label}</div>
            {metric.trend !== undefined && (
              <div className={`flex items-center gap-1 text-xs ${metric.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {metric.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{Math.abs(metric.trend).toFixed(1)}% (24h)</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Top Worker */}
      {analytics.topWorker && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="glass rounded-lg p-6 mt-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">🏆 Top Worker</h3>
              <p className="font-mono text-sm text-obscura-accent">
                {analytics.topWorker.slice(0, 10)}...{analytics.topWorker.slice(-8)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{Object.values(jobs.reduce((acc, job) => {
                if (job.worker === analytics.topWorker) acc[job.worker] = (acc[job.worker] || 0) + 1
                return acc
              }, {} as Record<string, number>))[0] || 0}</div>
              <div className="text-xs text-gray-400">Jobs Completed</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

