'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Lock, Check, Loader2, ExternalLink } from 'lucide-react'

interface APIConnectFormProps {
  title: string
  description: string
  placeholder: string
  serviceType: string
  storeId: string
  showStoreUrl?: boolean
  onConnected: () => void
}

export function APIConnectForm({ 
  title, 
  description, 
  placeholder, 
  serviceType, 
  storeId,
  showStoreUrl,
  onConnected 
}: APIConnectFormProps) {
  const [apiKey, setApiKey] = useState('')
  const [storeUrl, setStoreUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('auth_token')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shoppdropp-api.onrender.com'

      const response = await fetch(`${API_URL}/api/credentials`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          store_id: storeId,
          type: serviceType,
          credentials: {
            api_key: apiKey,
            store_url: showStoreUrl ? storeUrl : undefined
          }
        })
      })

      if (response.ok) {
        onConnected()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to connect')
      }
    } catch (err) {
      setError('Connection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getDocsUrl = () => {
    switch (serviceType) {
      case 'cj_dropshipping':
        return 'https://cjdropshipping.com/article-details/104.html'
      case 'shopify':
        return 'https://shopify.dev/docs/api/admin-rest'
      case 'meta_ads':
        return 'https://developers.facebook.com/docs/marketing-apis/'
      default:
        return '#'
    }
  }

  return (
    <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 border border-violet-500/30 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-violet-500/20 rounded-xl">
          <Lock className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>

      <div className="space-y-3">
        {showStoreUrl && (
          <input
            type="text"
            value={storeUrl}
            onChange={(e) => setStoreUrl(e.target.value)}
            placeholder="your-store.myshopify.com"
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        )}
        
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
        />

        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}

        <Button 
          onClick={handleConnect}
          disabled={loading || !apiKey.trim()}
          className="w-full bg-violet-600 hover:bg-violet-500"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <Check className="w-4 h-4 mr-2" />
              Connect
            </>
          )}
        </Button>

        <a 
          href={getDocsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-sm text-violet-400 hover:text-violet-300"
        >
          How to get your API key <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}
