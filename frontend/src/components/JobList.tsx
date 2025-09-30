'use client'

import { useState } from 'react'
import { Clock, DollarSign, Cpu, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useObscura, Job } from '@/hooks/useObscura'
import { COMPUTATION_TYPE_NAMES, JOB_STATUS_NAMES, JobStatus } from '@/lib/contracts'
import { JobDetailsModal } from './JobDetailsModal'

export function JobList() {
  const { myJobs, loading } = useObscura()
  const [filter, setFilter] = useState<'all' | 'pending' | 'assigned' | 'completed'>('all')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const filteredJobs = filter === 'all'
    ? myJobs
    : myJobs.filter(job => {
        if (filter === 'pending') return job.status === JobStatus.Pending;
        if (filter === 'assigned') return job.status === JobStatus.Assigned;
        if (filter === 'completed') return job.status === JobStatus.Completed || job.status === JobStatus.Verified;
        return true;
      })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'assigned':
        return 'bg-blue-500/20 text-blue-400'
      case 'completed':
        return 'bg-green-500/20 text-green-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Jobs</h2>
        
        {/* Filter Buttons */}
        <div className="flex gap-2">
          {(['all', 'pending', 'assigned', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === status
                  ? 'bg-obscura-accent text-white'
                  : 'bg-obscura-gray text-gray-400 hover:bg-obscura-gray-light'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-4">
        {loading ? (
          <div className="glass rounded-lg p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-obscura-accent" />
            <p className="text-gray-400">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="glass rounded-lg p-12 text-center">
            <p className="text-gray-400">No jobs found. Create your first job to get started!</p>
          </div>
        ) : (
          filteredJobs.map((job, index) => (
            <motion.div
              key={job.jobId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass rounded-lg p-6 hover:bg-obscura-gray-light transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-obscura-accent/20 p-3 rounded-lg">
                    <Cpu className="w-6 h-6 text-obscura-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{COMPUTATION_TYPE_NAMES[job.computationType]}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(job.createdAt * 1000).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.reward} ETH
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(JOB_STATUS_NAMES[job.status].toLowerCase())}`}>
                    {JOB_STATUS_NAMES[job.status]}
                  </span>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="bg-obscura-accent hover:bg-obscura-accent-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  )
}

