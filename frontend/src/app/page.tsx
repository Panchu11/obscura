'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { JobList } from '@/components/JobList'
import { CreateJobModal } from '@/components/CreateJobModal'
import { WorkerDashboard } from '@/components/WorkerDashboard'
import { Stats } from '@/components/Stats'
import { Footer } from '@/components/Footer'
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics'
import { WorkerLeaderboard } from '@/components/WorkerLeaderboard'
import { FHEPlayground } from '@/components/FHEPlayground'
import { ComputationVisualizer } from '@/components/ComputationVisualizer'
import { PrivacyDashboard } from '@/components/PrivacyDashboard'
import { useAccount } from 'wagmi'
import { Wallet, TrendingUp, Trophy, Zap, Shield } from 'lucide-react'

export default function Home() {
  const [showCreateJob, setShowCreateJob] = useState(false)
  const [activeTab, setActiveTab] = useState<'client' | 'worker' | 'analytics' | 'fhe' | 'privacy'>('fhe')
  const { isConnected } = useAccount()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-grow">
        <Hero onCreateJob={() => setShowCreateJob(true)} />

        <Stats />

        {isConnected ? (
          <>
            {/* Tab Navigation */}
            <div className="flex justify-center gap-3 my-8 flex-wrap">
              <button
                onClick={() => setActiveTab('fhe')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'fhe'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : 'bg-obscura-gray text-gray-400 hover:bg-obscura-gray-light'
                }`}
              >
                <Zap className="w-5 h-5" />
                FHE Demo
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'privacy'
                    ? 'bg-obscura-accent text-white'
                    : 'bg-obscura-gray text-gray-400 hover:bg-obscura-gray-light'
                }`}
              >
                <Shield className="w-5 h-5" />
                Privacy
              </button>
              <button
                onClick={() => setActiveTab('client')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'client'
                    ? 'bg-obscura-accent text-white'
                    : 'bg-obscura-gray text-gray-400 hover:bg-obscura-gray-light'
                }`}
              >
                <Wallet className="w-5 h-5" />
                Client
              </button>
              <button
                onClick={() => setActiveTab('worker')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'worker'
                    ? 'bg-obscura-accent text-white'
                    : 'bg-obscura-gray text-gray-400 hover:bg-obscura-gray-light'
                }`}
              >
                <Trophy className="w-5 h-5" />
                Worker
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'analytics'
                    ? 'bg-obscura-accent text-white'
                    : 'bg-obscura-gray text-gray-400 hover:bg-obscura-gray-light'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                Analytics
              </button>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'fhe' && (
              <div className="space-y-8">
                <FHEPlayground />
                <ComputationVisualizer isActive={true} />
              </div>
            )}
            {activeTab === 'privacy' && <PrivacyDashboard />}
            {activeTab === 'client' && <JobList />}
            {activeTab === 'worker' && <WorkerDashboard />}
            {activeTab === 'analytics' && (
              <>
                <AdvancedAnalytics />
                <WorkerLeaderboard />
              </>
            )}
          </>
        ) : (
          /* Not Connected State */
          <div className="glass rounded-2xl p-12 text-center max-w-2xl mx-auto my-12">
            <Wallet className="w-16 h-16 text-obscura-accent mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              To create jobs or become a worker, please connect your MetaMask wallet.
              Make sure you're on the Sepolia testnet.
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <p>✓ Install MetaMask browser extension</p>
              <p>✓ Switch to Sepolia network</p>
              <p>✓ Get free Sepolia ETH from faucet</p>
              <p>✓ Click "Connect Wallet" above</p>
            </div>
          </div>
        )}
      </main>

      <Footer />

      {/* Create Job Modal */}
      {showCreateJob && (
        <CreateJobModal onClose={() => setShowCreateJob(false)} />
      )}
    </div>
  )
}

