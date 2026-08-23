'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Bot, Send, Sparkles, CheckCircle2, 
  Loader2, Server, ChevronRight, Lock
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { SimpleOnboarding } from '@/components/dashboard/SimpleOnboarding'

interface Message {
  role: 'user' | 'assistant'
  content: string
  type?: 'text' | 'workflow' | 'api_key'
}

type WorkflowStage = 
  | 'onboarding' 
  | 'research' 
  | 'cj_dropshipping' 
  | 'shopify' 
  | 'meta_ads' 
  | 'complete'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shoppdropp-api.onrender.com'

export default function AIAgentPage() {
  const { user, token, isAuthenticated } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState<WorkflowStage>('onboarding')
  const [storeId, setStoreId] = useState<string | null>(null)
  const [worker, setWorker] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize
  useEffect(() => {
    if (isAuthenticated) {
      initialize()
    }
  }, [isAuthenticated])

  const initialize = async () => {
    try {
      // Get or create store
      const response = await fetch(`${API_URL}/api/stores`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      
      if (data.stores?.length > 0) {
        setStoreId(data.stores[0].id)
        checkWorkflowStatus(data.stores[0].id)
      } else {
        // Create default store
        const createRes = await fetch(`${API_URL}/api/stores`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: 'My Store' })
        })
        const newStore = await createRes.json()
        setStoreId(newStore.id)
        
        // Welcome message
        setMessages([{
          role: 'assistant',
          content: '👋 Welcome! I\'m your AI Business Advisor. I\'ve helped build 8-figure e-commerce brands. Let\'s start by understanding your business goals.'
        }])
      }
    } catch (error) {
      console.error('Failed to initialize:', error)
    }
  }

  const checkWorkflowStatus = async (sid: string) => {
    try {
      const response = await fetch(`${API_URL}/api/onboarding/workflow-status/${sid}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      
      // Determine current stage
      if (!data.onboardingComplete) {
        setStage('onboarding')
        setMessages([{
          role: 'assistant',
          content: '👋 Welcome back! Let\'s continue setting up your store.'
        }])
      } else if (!data.researchComplete) {
        setStage('research')
        setMessages([{
          role: 'assistant',
          content: '✅ Onboarding complete! Ready to start product research?'
        }])
      } else if (!data.cjConnected) {
        setStage('cj_dropshipping')
      } else if (!data.shopifyConnected) {
        setStage('shopify')
      } else if (!data.metaConnected) {
        setStage('meta_ads')
      } else {
        setStage('complete')
      }

      // Check worker status
      if (data.worker) {
        setWorker(data.worker)
      }
    } catch (error) {
      console.error('Failed to check status:', error)
    }
  }

  const handleOnboardingComplete = () => {
    setStage('research')
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: '🎉 Excellent! I now understand your business. Let me analyze market opportunities using our research tools.'
    }])
    startResearch()
  }

  const startResearch = async () => {
    setLoading(true)
    try {
      // System uses our OpenWeb Ninja APIs automatically
      const response = await fetch(`${API_URL}/api/workflow/research`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ store_id: storeId })
      })
      
      const data = await response.json()
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `🔍 **Research Complete!**

I found ${data.products?.length || 0} high-potential products for your store:

${data.products?.slice(0, 5).map((p: any) => `• ${p.name} - $${p.price} (${p.margin}% margin)`).join('\n')}

Next, I'll need your CJ Dropshipping API to source these products.`,
        type: 'workflow'
      }])
      
      setStage('cj_dropshipping')
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Research failed. Please try again or contact support.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      // Simple chat with AI
      const response = await fetch(`${API_URL}/api/ai-chat/simple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          store_id: storeId,
          stage: stage
        })
      })

      const data = await response.json()
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }])
    } finally {
      setLoading(false)
    }
  }

  const getStageDisplay = () => {
    switch (stage) {
      case 'onboarding': return { label: 'Setup', color: 'bg-violet-500' }
      case 'research': return { label: 'Research', color: 'bg-blue-500' }
      case 'cj_dropshipping': return { label: 'Sourcing', color: 'bg-amber-500' }
      case 'shopify': return { label: 'Store', color: 'bg-green-500' }
      case 'meta_ads': return { label: 'Ads', color: 'bg-pink-500' }
      case 'complete': return { label: 'Active', color: 'bg-green-500' }
    }
  }

  const stageDisplay = getStageDisplay()

  return (
    <div className="flex h-[calc(100vh-80px)] gap-4 p-4">
      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        <Card className="flex-1 flex flex-col bg-[#0d1117] border-white/10">
          {/* Header */}
          <CardHeader className="border-b border-white/10 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/20 rounded-xl">
                  <Bot className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">AI Business Advisor</h2>
                  <p className="text-xs text-slate-400">Expert VC & Investment Banker</p>
                </div>
              </div>
              <Badge className={`${stageDisplay.color} text-white`}>
                {stageDisplay.label}
              </Badge>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-violet-500/20' : 'bg-pink-500/20'
                }`}>
                  {msg.role === 'user' ? (
                    <span className="text-xs text-violet-300">You</span>
                  ) : (
                    <Bot className="w-4 h-4 text-pink-400" />
                  )}
                </div>
                <div className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-violet-500/20 text-white' 
                    : 'bg-white/5 text-slate-200'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Onboarding Form */}
            {stage === 'onboarding' && storeId && (
              <div className="flex gap-3">
                <div className="w-8" />
                <div className="flex-1 max-w-[90%]">
                  <SimpleOnboarding 
                    storeId={storeId}
                    onComplete={handleOnboardingComplete}
                  />
                </div>
              </div>
            )}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-pink-400" />
                </div>
                <div className="p-3 rounded-lg bg-white/5">
                  <Loader2 className="w-5 h-5 animate-spin text-pink-400" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input */}
          <CardHeader className="border-t border-white/10 pt-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything or give me commands..."
                className="bg-white/5 border-white/10 text-white"
                disabled={loading || stage === 'onboarding'}
              />
              <Button 
                onClick={sendMessage} 
                className="bg-violet-600 hover:bg-violet-500"
                disabled={loading || !input.trim() || stage === 'onboarding'}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 space-y-4">
        {/* Progress */}
        <Card className="bg-[#0d1117] border-white/10">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              Progress
            </h3>
            
            {[
              { id: 'onboarding', label: 'Business Setup', icon: Bot },
              { id: 'research', label: 'Product Research', icon: Sparkles },
              { id: 'cj_dropshipping', label: 'Connect CJ', icon: Server },
              { id: 'shopify', label: 'Connect Shopify', icon: CheckCircle2 },
              { id: 'meta_ads', label: 'Connect Meta', icon: CheckCircle2 },
            ].map((step) => {
              const StepIcon = step.icon
              const isActive = stage === step.id
              const isComplete = 
                (step.id === 'onboarding' && stage !== 'onboarding') ||
                (step.id === 'research' && ['shopify', 'meta_ads', 'complete'].includes(stage)) ||
                (step.id === 'cj_dropshipping' && ['shopify', 'meta_ads', 'complete'].includes(stage)) ||
                (step.id === 'shopify' && ['meta_ads', 'complete'].includes(stage)) ||
                (step.id === 'meta_ads' && stage === 'complete')
              
              return (
                <div key={step.id} className={`flex items-center gap-3 p-2 rounded-lg ${
                  isActive ? 'bg-violet-500/20' : ''
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isComplete ? 'bg-green-500/20' : isActive ? 'bg-violet-500/20' : 'bg-white/5'
                  }`}>
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <StepIcon className={`w-4 h-4 ${isActive ? 'text-violet-400' : 'text-slate-500'}`} />
                    )}
                  </div>
                  <span className={`text-sm ${isActive ? 'text-white' : isComplete ? 'text-green-400' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Worker Status */}
        <Card className="bg-[#0d1117] border-white/10">
          <CardContent className="p-4">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-blue-400" />
              VPS Status
            </h3>
            {worker ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Status</span>
                  <Badge className={worker.status === 'running' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                    {worker.status}
                  </Badge>
                </div>
                {worker.ip && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">IP</span>
                    <span className="text-sm text-white font-mono">{worker.ip}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No worker provisioned yet</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Commands */}
        <Card className="bg-[#0d1117] border-white/10">
          <CardContent className="p-4">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-pink-400" />
              Remote Commands
            </h3>
            <div className="space-y-2">
              {['Start research', 'Check worker status', 'Show my store config', 'Connect CJ API', 'Connect Shopify'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => {
                    setInput(cmd)
                    sendMessage()
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-slate-300 transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
