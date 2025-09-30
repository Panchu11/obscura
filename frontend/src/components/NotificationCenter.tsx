'use client'

import { useState, useEffect } from 'react'
import { Bell, X, CheckCircle, AlertCircle, Info, DollarSign } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useObscura } from '@/hooks/useObscura'
import { JobStatus } from '@/lib/contracts'

interface Notification {
  id: string
  type: 'success' | 'info' | 'warning' | 'error'
  title: string
  message: string
  timestamp: number
  read: boolean
}

export function NotificationCenter() {
  const { jobs, myJobs } = useObscura()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [lastJobCount, setLastJobCount] = useState(0)

  useEffect(() => {
    // Check for new jobs
    if (jobs.length > lastJobCount && lastJobCount > 0) {
      const newJobsCount = jobs.length - lastJobCount
      addNotification({
        type: 'info',
        title: 'New Jobs Available',
        message: `${newJobsCount} new job${newJobsCount > 1 ? 's' : ''} posted on the marketplace`,
      })
    }
    setLastJobCount(jobs.length)
  }, [jobs.length])

  useEffect(() => {
    // Check for job status changes
    myJobs.forEach((job) => {
      const notificationId = `job-${job.jobId}-${job.status}`
      const exists = notifications.some(n => n.id === notificationId)
      
      if (!exists) {
        if (job.status === JobStatus.Assigned) {
          addNotification({
            type: 'info',
            title: 'Job Assigned',
            message: `Job #${job.jobId} has been assigned to a worker`,
          }, notificationId)
        } else if (job.status === JobStatus.Completed) {
          addNotification({
            type: 'success',
            title: 'Job Completed',
            message: `Job #${job.jobId} has been completed! Review and pay the worker.`,
          }, notificationId)
        } else if (job.status === JobStatus.Verified) {
          addNotification({
            type: 'success',
            title: 'Payment Sent',
            message: `Job #${job.jobId} verified and worker paid successfully`,
          }, notificationId)
        } else if (job.status === JobStatus.Disputed) {
          addNotification({
            type: 'warning',
            title: 'Job Disputed',
            message: `Job #${job.jobId} is under dispute`,
          }, notificationId)
        }
      }
    })
  }, [myJobs])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>, customId?: string) => {
    const newNotification: Notification = {
      id: customId || `notif-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      read: false,
      ...notification,
    }
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)) // Keep last 50
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />
      default: return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500/10 border-green-500/20'
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20'
      case 'error': return 'bg-red-500/10 border-red-500/20'
      default: return 'bg-blue-500/10 border-blue-500/20'
    }
  }

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 hover:bg-obscura-gray-light rounded-lg transition-all"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {showPanel && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowPanel(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-12 w-96 max-h-[600px] glass rounded-lg shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-obscura-gray-light flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">Notifications</h3>
                  <p className="text-xs text-gray-400">{unreadCount} unread</p>
                </div>
                <div className="flex gap-2">
                  {notifications.length > 0 && (
                    <>
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-obscura-accent hover:text-obscura-accent-dark"
                      >
                        Mark all read
                      </button>
                      <button
                        onClick={clearAll}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Clear all
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[500px]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-obscura-gray-light">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 hover:bg-obscura-gray-light transition-all cursor-pointer ${
                          !notification.read ? 'bg-obscura-gray/50' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg border ${getBgColor(notification.type)} h-fit`}>
                            {getIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-sm">{notification.title}</h4>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                                className="text-gray-400 hover:text-white"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-obscura-accent rounded-full"></span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

