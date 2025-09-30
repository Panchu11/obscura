'use client'

import { Briefcase, Users, CheckCircle, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { useObscura } from '@/hooks/useObscura'
import { JobStatus } from '@/lib/contracts'

export function Stats() {
  const { jobs } = useObscura()

  const totalJobs = jobs.length
  const completedJobs = jobs.filter(j => j.status === JobStatus.Completed || j.status === JobStatus.Verified).length
  const totalVolume = jobs.reduce((sum, job) => sum + parseFloat(job.reward || '0'), 0).toFixed(2)

  // Count unique workers
  const activeWorkers = new Set(jobs.filter(j => j.worker !== '0x0000000000000000000000000000000000000000').map(j => j.worker)).size

  const statItems = [
    {
      icon: Briefcase,
      label: 'Total Jobs',
      value: totalJobs,
      color: 'text-blue-400',
    },
    {
      icon: Users,
      label: 'Active Workers',
      value: activeWorkers,
      color: 'text-green-400',
    },
    {
      icon: CheckCircle,
      label: 'Completed',
      value: completedJobs,
      color: 'text-purple-400',
    },
    {
      icon: TrendingUp,
      label: 'Volume (ETH)',
      value: totalVolume,
      color: 'text-yellow-400',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="glass rounded-lg p-6 text-center"
        >
          <item.icon className={`w-8 h-8 ${item.color} mx-auto mb-2`} />
          <div className="text-2xl font-bold mb-1">{item.value}</div>
          <div className="text-sm text-gray-400">{item.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

