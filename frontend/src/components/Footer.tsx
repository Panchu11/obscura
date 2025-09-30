'use client'

import { Github, ExternalLink, Shield } from 'lucide-react'
import { OBSCURA_ADDRESS } from '@/lib/contracts'

export function Footer() {
  const contractUrl = `https://sepolia.etherscan.io/address/${OBSCURA_ADDRESS}`
  
  return (
    <footer className="border-t border-obscura-gray-light bg-obscura-dark/50 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 gradient-text">Obscura</h3>
            <p className="text-sm text-gray-400 mb-4">
              A decentralized marketplace for Fully Homomorphic Encrypted computation. 
              Built on Zama's FHEVM for the Zama Developer Program.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Your data remains encrypted. Always.</span>
            </div>
          </div>

          {/* Contract Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Smart Contract</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Network:</span>
                <span className="ml-2 text-white">Sepolia Testnet</span>
              </div>
              <div>
                <span className="text-gray-400">Address:</span>
                <a 
                  href={contractUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-obscura-accent hover:text-obscura-accent-dark transition-colors inline-flex items-center gap-1"
                >
                  <span className="font-mono text-xs">{OBSCURA_ADDRESS.slice(0, 6)}...{OBSCURA_ADDRESS.slice(-4)}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <a 
                  href={contractUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-obscura-accent hover:text-obscura-accent-dark transition-colors inline-flex items-center gap-1 text-xs"
                >
                  View on Etherscan
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <div className="space-y-3">
              <a 
                href="https://docs.zama.ai/fhevm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>FHEVM Documentation</span>
              </a>
              <a 
                href="https://github.com/zama-ai/fhevm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>Zama GitHub</span>
              </a>
              <a 
                href="https://www.zama.ai/programs/developer-program"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Zama Developer Program</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-obscura-gray-light mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            © 2025 Obscura. Built with ❤️ using Zama FHEVM.
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Sepolia Testnet</span>
            <span>•</span>
            <span>FHE-Powered</span>
            <span>•</span>
            <span>Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

