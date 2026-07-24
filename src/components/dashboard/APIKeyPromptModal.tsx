'use client'

import { X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface APIKeyPromptModalProps {
  isOpen: boolean
  onClose: () => void
  integrationType: string
  onConfigure: () => void
}

export function APIKeyPromptModal({ isOpen, onClose, integrationType, onConfigure }: APIKeyPromptModalProps) {
  if (!isOpen) return null

  const integrationNames: Record<string, string> = {
    'ai': 'AI Provider',
    'shopify': 'Shopify',
    'meta_ads': 'Meta Ads',
    'cj_dropshipping': 'CJ Dropshipping',
    'github': 'GitHub',
    'vercel': 'Vercel'
  }

  const integrationName = integrationNames[integrationType] || integrationType

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-[#111118] rounded-2xl border border-white/10 shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">API Key Required</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-slate-300 mb-6">
          To run this workflow, you need to configure your <strong>{integrationName}</strong> API key first.
        </p>

        <div className="space-y-3">
          <Button
            onClick={onConfigure}
            className="w-full bg-gradient-to-r from-violet-600 to-pink-600"
          >
            Configure {integrationName}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full border-white/20 text-slate-300"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
