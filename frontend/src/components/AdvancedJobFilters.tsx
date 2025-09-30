'use client'

import { useState } from 'react'
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ComputationType, JobStatus, COMPUTATION_TYPE_NAMES } from '@/lib/contracts'

interface FilterOptions {
  search: string
  status: JobStatus | 'all'
  computationType: ComputationType | 'all'
  minReward: string
  maxReward: string
  sortBy: 'newest' | 'oldest' | 'reward-high' | 'reward-low'
}

interface AdvancedJobFiltersProps {
  onFilterChange: (filters: FilterOptions) => void
}

export function AdvancedJobFilters({ onFilterChange }: AdvancedJobFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: 'all',
    computationType: 'all',
    minReward: '',
    maxReward: '',
    sortBy: 'newest',
  })

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      search: '',
      status: 'all',
      computationType: 'all',
      minReward: '',
      maxReward: '',
      sortBy: 'newest',
    }
    setFilters(defaultFilters)
    onFilterChange(defaultFilters)
  }

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.computationType !== 'all' || filters.minReward || filters.maxReward

  return (
    <div className="glass rounded-lg p-4 mb-6">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search by job ID, client address, or worker address..."
            className="w-full bg-obscura-gray border border-obscura-gray-light rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-obscura-accent"
          />
        </div>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
            showAdvanced ? 'bg-obscura-accent text-white' : 'bg-obscura-gray text-gray-400 hover:bg-obscura-gray-light'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden md:inline">Advanced</span>
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-3 rounded-lg font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all flex items-center gap-2"
          >
            <X className="w-5 h-5" />
            <span className="hidden md:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-obscura-gray-light">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter('status', e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="w-full bg-obscura-gray border border-obscura-gray-light rounded-lg px-3 py-2 text-white focus:outline-none focus:border-obscura-accent"
                >
                  <option value="all">All Statuses</option>
                  <option value={JobStatus.Pending}>Pending</option>
                  <option value={JobStatus.Assigned}>Assigned</option>
                  <option value={JobStatus.Completed}>Completed</option>
                  <option value={JobStatus.Verified}>Verified</option>
                  <option value={JobStatus.Disputed}>Disputed</option>
                  <option value={JobStatus.Cancelled}>Cancelled</option>
                </select>
              </div>

              {/* Computation Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Computation Type</label>
                <select
                  value={filters.computationType}
                  onChange={(e) => updateFilter('computationType', e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                  className="w-full bg-obscura-gray border border-obscura-gray-light rounded-lg px-3 py-2 text-white focus:outline-none focus:border-obscura-accent"
                >
                  <option value="all">All Types</option>
                  <option value={ComputationType.SUM}>{COMPUTATION_TYPE_NAMES[ComputationType.SUM]}</option>
                  <option value={ComputationType.AVERAGE}>{COMPUTATION_TYPE_NAMES[ComputationType.AVERAGE]}</option>
                  <option value={ComputationType.MAX}>{COMPUTATION_TYPE_NAMES[ComputationType.MAX]}</option>
                  <option value={ComputationType.MIN}>{COMPUTATION_TYPE_NAMES[ComputationType.MIN]}</option>
                  <option value={ComputationType.LINEAR_REGRESSION}>{COMPUTATION_TYPE_NAMES[ComputationType.LINEAR_REGRESSION]}</option>
                  <option value={ComputationType.DECISION_TREE}>{COMPUTATION_TYPE_NAMES[ComputationType.DECISION_TREE]}</option>
                </select>
              </div>

              {/* Min Reward */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Min Reward (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  value={filters.minReward}
                  onChange={(e) => updateFilter('minReward', e.target.value)}
                  placeholder="0.001"
                  className="w-full bg-obscura-gray border border-obscura-gray-light rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-obscura-accent"
                />
              </div>

              {/* Max Reward */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Max Reward (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  value={filters.maxReward}
                  onChange={(e) => updateFilter('maxReward', e.target.value)}
                  placeholder="10.0"
                  className="w-full bg-obscura-gray border border-obscura-gray-light rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-obscura-accent"
                />
              </div>
            </div>

            {/* Sort By */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
              <div className="flex gap-2">
                {[
                  { value: 'newest', label: 'Newest First' },
                  { value: 'oldest', label: 'Oldest First' },
                  { value: 'reward-high', label: 'Highest Reward' },
                  { value: 'reward-low', label: 'Lowest Reward' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFilter('sortBy', option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filters.sortBy === option.value
                        ? 'bg-obscura-accent text-white'
                        : 'bg-obscura-gray text-gray-400 hover:bg-obscura-gray-light'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.search && (
            <span className="px-3 py-1 bg-obscura-accent/20 text-obscura-accent rounded-full text-xs flex items-center gap-1">
              Search: "{filters.search}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('search', '')} />
            </span>
          )}
          {filters.status !== 'all' && (
            <span className="px-3 py-1 bg-obscura-accent/20 text-obscura-accent rounded-full text-xs flex items-center gap-1">
              Status: {typeof filters.status === 'number' ? ['Pending', 'Assigned', 'Completed', 'Verified', 'Disputed', 'Cancelled'][filters.status] : 'All'}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('status', 'all')} />
            </span>
          )}
          {filters.computationType !== 'all' && (
            <span className="px-3 py-1 bg-obscura-accent/20 text-obscura-accent rounded-full text-xs flex items-center gap-1">
              Type: {typeof filters.computationType === 'number' ? COMPUTATION_TYPE_NAMES[filters.computationType] : 'All'}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('computationType', 'all')} />
            </span>
          )}
          {filters.minReward && (
            <span className="px-3 py-1 bg-obscura-accent/20 text-obscura-accent rounded-full text-xs flex items-center gap-1">
              Min: {filters.minReward} ETH
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('minReward', '')} />
            </span>
          )}
          {filters.maxReward && (
            <span className="px-3 py-1 bg-obscura-accent/20 text-obscura-accent rounded-full text-xs flex items-center gap-1">
              Max: {filters.maxReward} ETH
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('maxReward', '')} />
            </span>
          )}
        </div>
      )}
    </div>
  )
}

