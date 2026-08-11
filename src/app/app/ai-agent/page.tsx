'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Bot, Send, Sparkles, Server, Store, AlertCircle, CheckCircle2, 
  Loader2, Wallet, TrendingUp, Settings, Activity, Zap, 
  Shield, CreditCard, ChevronRight
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  command_result?: any
}

interface ContextData {
  workers: Array<{
    id: string
    status: string
    ip: string
    server_id: string
  }>
  stores: Array<{
    id: string
    name: string
    platform: string
  }>
  ai_configured: boolean
}

interface BudgetData {
  configured: boolean
  weeklyLimit: number
  weeklySpent: number
  percentageUsed: number
  remaining: number
  daysUntilReset: number
  accountBalance?: number
  isBlocked: boolean
}

interface AIConfig {
  provider: string
  model: string
}

export default function AIAgentPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm your ShoppDropp AI assistant. I can help you:\n\n• Provision and manage VPS workers\n• Monitor store performance\n• Run automation tasks\n• Control your dropshipping operations\n\nWhat would you like to do today?" 
    },
  ])
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState<ContextData | null>(null)
  const [loadingContext, setLoadingContext] = useState(true)
  const [budget, setBudget] = useState<BudgetData | null>(null)
  const [loadingBudget, setLoadingBudget] = useState(true)
  const [aiConfig, setAiConfig] = useState<AIConfig | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shoppdropp-api.onrender.com'

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    loadContext()
    loadBudget()
    loadAIConfig()
  }, [])

  async function loadContext() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoadingContext(false)
        return
      }

      const response = await fetch(`${API_URL}/api/ai-chat/context`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setContext(data)
      }
    } catch (error) {
      console.error('Failed to load context:', error)
    } finally {
      setLoadingContext(false)
    }
  }

  async function loadBudget() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoadingBudget(false)
        return
      }

      const response = await fetch(`${API_URL}/api/budget/status`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setBudget(data)
      }
    } catch (error) {
      console.error('Failed to load budget:', error)
    } finally {
      setLoadingBudget(false)
    }
  }

  async function loadAIConfig() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`${API_URL}/api/ai/config`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.configured) {
          setAiConfig({ provider: data.provider, model: data.model })
        }
      }
    } catch (error) {
      console.error('Failed to load AI config:', error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: 'Please sign in to use the AI assistant.' 
        }])
        setLoading(false)
        return
      }

      const conversationHistory = newMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))

      const response = await fetch(`${API_URL}/api/ai-chat/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_history: conversationHistory.slice(-10),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        if (error.budget_error) {
          throw new Error(
            `💰 Budget Limit Reached\n\n` +
            `${error.reason}\n` +
            `Remaining: $${error.remaining?.toFixed?.(2) || '0.00'}\n` +
            `Resets: ${error.resets_at ? new Date(error.resets_at).toLocaleDateString() : 'N/A'}\n\n` +
            `${error.suggestion || 'Consider increasing your weekly limit in settings.'}`
          )
        }
        throw new Error(error.error || 'Failed to get response')
      }

      const data = await response.json()
      loadBudget()
      
      let responseContent = data.response
      if (data.budget_alert) {
        responseContent = data.budget_alert + '\n\n---\n\n' + responseContent
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: responseContent,
      }

      if (data.command_executed) {
        assistantMessage.command_result = data.command_executed
      }

      setMessages([...newMessages, assistantMessage])

      if (data.command_executed) {
        loadContext()
      }

    } catch (error: any) {
      console.error('Chat error:', error)
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: `Error: ${error.message || 'Something went wrong. Please try again.'}` 
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'provisioning': 
      case 'configuring': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  const activeWorker = context?.workers?.[0]
  const activeStore = context?.stores?.[0]

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      {/* LEFT SIDEBAR - Gateway & Config */}
      <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">
        
        {/* Gateway Status */}
        <Card className="bg-[#111118] border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-400">
              <Activity className="w-4 h-4 text-green-400" />
              Gateway Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Status</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse" />
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Port</span>
              <span className="text-sm text-white font-mono">3001</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">WebSocket</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Budget Card */}
        {!loadingBudget && budget?.configured && (
          <Card className={`border-white/10 ${
            budget.isBlocked 
              ? 'bg-red-950/30 border-red-500/30' 
              : budget.percentageUsed >= 90 
                ? 'bg-yellow-950/30 border-yellow-500/30'
                : 'bg-[#111118]'
          }`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Wallet className={`w-4 h-4 ${
                  budget.isBlocked ? 'text-red-400' : 
                  budget.percentageUsed >= 90 ? 'text-yellow-400' : 'text-green-400'
                }`} />
                <span className={
                  budget.isBlocked ? 'text-red-400' : 
                  budget.percentageUsed >= 90 ? 'text-yellow-400' : 'text-slate-400'
                }>
                  OpenRouter Budget
                </span>
                {budget.isBlocked && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                    BLOCKED
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">
                    ${budget.weeklySpent.toFixed(2)} / ${budget.weeklyLimit.toFixed(2)}
                  </span>
                  <span className={`font-medium ${
                    budget.percentageUsed >= 95 ? 'text-red-400' :
                    budget.percentageUsed >= 75 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {budget.percentageUsed}%
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      budget.percentageUsed >= 95 ? 'bg-red-500' :
                      budget.percentageUsed >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Remaining: ${budget.remaining.toFixed(2)}</span>
                <span>Resets in {budget.daysUntilReset}d</span>
              </div>
              {budget.accountBalance !== undefined && (
                <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-white/10">
                  <CreditCard className="w-3 h-3" />
                  <span>Balance: ${budget.accountBalance.toFixed(2)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* AI Configuration */}
        <Card className="bg-[#111118] border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-400">
              <Zap className="w-4 h-4 text-violet-400" />
              AI Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!loadingContext && context && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Status</span>
                  {context.ai_configured ? (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Configured
                    </Badge>
                  )}
                </div>
                {aiConfig && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Provider</span>
                      <span className="text-sm text-white capitalize">{aiConfig.provider}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Model</span>
                      <span className="text-sm text-white font-mono text-xs">{aiConfig.model}</span>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Worker Status */}
        {activeWorker && (
          <Card className="bg-[#111118] border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-400">
                <Server className="w-4 h-4 text-blue-400" />
                Worker
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Status</span>
                <Badge className={getStatusColor(activeWorker.status)}>
                  {activeWorker.status}
                </Badge>
              </div>
              {activeWorker.ip && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">IP</span>
                  <span className="text-sm text-white font-mono text-xs">{activeWorker.ip}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Store Info */}
        {activeStore && (
          <Card className="bg-[#111118] border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-400">
                <Store className="w-4 h-4 text-pink-400" />
                Store
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Name</span>
                <span className="text-sm text-white">{activeStore.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Platform</span>
                <span className="text-sm text-white capitalize">{activeStore.platform}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="bg-[#111118] border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-400">
              <Settings className="w-4 h-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-between text-slate-400 hover:text-white"
              onClick={() => setInput('provision a vps')}
            >
              <span>Provision VPS</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-between text-slate-400 hover:text-white"
              onClick={() => setInput('check worker status')}
            >
              <span>Check Status</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-between text-slate-400 hover:text-white"
              onClick={() => setInput('run product research')}
            >
              <span>Product Research</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT MAIN - Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-violet-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">AI Agent</h1>
              <p className="text-slate-400 text-sm">Your autonomous dropshipping assistant</p>
            </div>
          </div>
        </div>

        {/* Chat Card */}
        <Card className="bg-[#111118] border-white/10 flex flex-col flex-1 min-h-0">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className="space-y-2">
                <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-violet-500/20' : 'bg-pink-500/20'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <span className="text-xs text-violet-300">You</span>
                    ) : (
                      <Bot className="w-4 h-4 text-pink-400" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-violet-500/20 text-white'
                        : 'bg-white/5 text-slate-200'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
                
                {msg.command_result && (
                  <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8" />
                    <div className="max-w-[80%] p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        {msg.command_result.status === 'success' || msg.command_result.status === 'queued' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : msg.command_result.status === 'error' ? (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        ) : (
                          <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
                        )}
                        <span className={`text-sm font-medium ${
                          msg.command_result.status === 'error' ? 'text-red-400' : 'text-green-400'
                        }`}>
                          Command: {msg.command_result.status}
                        </span>
                      </div>
                      {msg.command_result.message && (
                        <p className="text-sm text-slate-300">{msg.command_result.message}</p>
                      )}
                      {msg.command_result.data && (
                        <pre className="mt-2 text-xs text-slate-400 bg-black/30 p-2 rounded overflow-auto">
                          {JSON.stringify(msg.command_result.data, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          
          <CardHeader className="border-t border-white/10 pt-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your store, worker, or dropshipping..."
                className="bg-white/5 border-white/10 text-white"
                disabled={loading}
              />
              <Button 
                onClick={sendMessage} 
                className="bg-violet-600 hover:bg-violet-500"
                disabled={loading || !input.trim()}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Try: "provision a vps", "check worker status", "run product research task"
            </p>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
