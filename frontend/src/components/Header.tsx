'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Eye, Github, FileText } from 'lucide-react'
import { useAccount } from 'wagmi'
import { NotificationCenter } from './NotificationCenter'

export function Header() {
  const { isConnected } = useAccount()

  return (
    <header className="border-b border-obscura-gray-light bg-obscura-dark/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Eye className="w-8 h-8 text-obscura-accent transition-transform group-hover:scale-110" />
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Obscura</h1>
              <p className="text-xs text-gray-400">FHE Compute Marketplace</p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Links */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://github.com/zama-ai/fhevm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://docs.zama.ai/fhevm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
              >
                <FileText className="w-4 h-4" />
                <span>Docs</span>
              </a>
            </div>

            {/* Status Indicator */}
            {isConnected && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">Connected</span>
              </div>
            )}

            {/* Notifications */}
            {isConnected && <NotificationCenter />}

            {/* Connect Wallet */}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}

