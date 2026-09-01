'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Bot, Send, Sparkles, Server, Store, AlertCircle, CheckCircle2, 
  Loader2, Wallet, TrendingUp, Settings, Activity, Zap, 
  Shield, CreditCard, ChevronRight, Rocket, LayoutTemplate, Brain, X, AlertTriangle,
  CheckSquare, Square, Lock, ShoppingBag, Share2, Truck, Save, Target, Users
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { AIOnboarding } from '@/components/dashboard/AIOnboarding'
import { SliderForm } from '@/components/agent/SliderForm'
import { NumberForm } from '@/components/agent/NumberForm'
import { ConnectAPIForm } from '@/components/agent/ConnectAPIForm'
import { TextForm } from '@/components/agent/TextForm'
import { APISplashScreen } from '@/components/agent/APISplashScreen'
import { ONBOARDING_QUESTIONS, getQuestionById, TOTAL_ONBOARDING_QUESTIONS } from '@/lib/onboarding-questions'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  command_result?: any
  isStreaming?: boolean
  interactive?: {
    type: 'multiselect' | 'select' | 'text'
    question: string
    options?: { id: string; label: string; description?: string }[]
    allowMultiple?: boolean
    placeholder?: string
  }
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

interface WorkflowStatus {
  onboardingComplete: boolean
  canStartWorkflow: boolean
  missingRequirements: string[]
  aiConfigured: boolean
  storeConfig?: {
    market?: string
    brandVoice?: string
    siteStyle?: string
    targetAudience?: any
  }
}

const AI_PROVIDERS = [
  { 
    id: 'openrouter', 
    name: 'OpenRouter', 
    description: 'Recommended: Access to Kimi, Claude, GPT-4, and more with one API key',
    models: [
      { id: 'moonshotai/kimi-k2.5', name: 'Kimi K2.5 (Recommended)', description: 'Fast, capable, cost-effective' },
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', description: 'Excellent reasoning and coding' },
      { id: 'openai/gpt-4o', name: 'GPT-4o', description: 'Great all-around performance' },
      { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', description: 'Fast and economical' },
    ],
    docsUrl: 'https://openrouter.ai/keys'
  },
  { 
    id: 'openai', 
    name: 'OpenAI', 
    description: 'Direct OpenAI API access',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', description: 'Best for complex tasks' },
      { id: 'gpt-4', name: 'GPT-4', description: 'Reliable and capable' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and affordable' },
    ],
    docsUrl: 'https://platform.openai.com/api-keys'
  },
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shoppdropp-api.onrender.com'

// Animated thinking dots component
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 px-1">
      <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

// Parse [[FORM]] blocks from AI message content (handles JSON format)
function parseFormBlocks(content: string): { 
  text: string; 
  forms: Array<{
    type: string; 
    options?: string[]; 
    question?: string; 
    allowMultiple?: boolean;
    min?: number;
    max?: number;
    default?: number;
    placeholder?: string;
    services?: Array<{id: string; name: string; description?: string}>;
    leftLabel?: string;
    rightLabel?: string;
  }> 
} {
  const forms: Array<any> = []
  
  // Match [[FORM]] ... [[/FORM]] blocks with JSON content
  const formRegex = /\[\[FORM\]\]([\s\S]*?)\[\[\/FORM\]\]/gi
  
  let cleanedText = content
  let match
  
  while ((match = formRegex.exec(content)) !== null) {
    const jsonStr = match[1].trim()
    
    try {
      // Parse the JSON content
      const data = JSON.parse(jsonStr)
      
      // Handle different form types based on the JSON structure
      if (data.type === 'range' || data.type === 'slider') {
        forms.push({
          type: 'slider',
          min: data.min || 0,
          max: data.max || 10,
          default: data.default || data.value || 5,
          leftLabel: data.leftLabel,
          rightLabel: data.rightLabel,
        })
      } else if (data.type === 'number' || data.type === 'budget') {
        forms.push({
          type: 'number',
          placeholder: data.help_text || data.placeholder || 'Enter amount...',
          min: data.min,
          max: data.max,
          prefix: data.prefix,
        })
      } else if (data.type === 'text') {
        forms.push({
          type: 'text',
          placeholder: data.placeholder || 'Type your answer...',
        })
      } else if (data.type === 'connect' && data.services) {
        // Parse services array
        const services = data.services.map((s: any) => ({
          id: s.id || s.name,
          name: s.name || s.id,
          description: s.description,
        }))
        forms.push({ 
          type: 'connect', 
          options: services.map((s: any) => s.name),
          services,
          allowMultiple: true 
        })
      } else if (data.type === 'chips' || data.type === 'cards' || data.options) {
        // Handle options-based forms
        const options = data.options || []
        const allowMultiple = data.allowMultiple || data.multi === true
        
        forms.push({
          type: data.type === 'chips' ? 'chips' : 'cards',
          options: Array.isArray(options) ? options : [],
          allowMultiple,
          question: data.question,
        })
      }
      
      // Remove the form block from the text
      cleanedText = cleanedText.replace(match[0], '').trim()
    } catch (e) {
      // If JSON parsing fails, keep the original text
      console.error('Failed to parse FORM block:', e)
    }
  }
  
  return { text: cleanedText, forms }
}

// Parse [[ACTIVITY]] blocks for activity logs
function parseActivityBlocks(content: string): { text: string; activities: Array<{message: string; timestamp?: string; status: 'pending' | 'success' | 'error'}> } {
  const activities: Array<{message: string; timestamp?: string; status: 'pending' | 'success' | 'error'}> = []
  
  // Match [[ACTIVITY]] ... [[/ACTIVITY]] blocks
  const activityRegex = /\[\[ACTIVITY\]\]([\s\S]*?)\[\[\/ACTIVITY\]\]/gi
  
  let cleanedText = content
  let match
  
  while ((match = activityRegex.exec(content)) !== null) {
    const activityText = match[1].trim()
    
    // Parse each line as an activity entry
    const lines = activityText.split('\n').filter(line => line.trim())
    
    lines.forEach(line => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return
      
      // Check for status indicators
      let status: 'pending' | 'success' | 'error' = 'pending'
      if (trimmedLine.includes('✓') || trimmedLine.includes('✅') || trimmedLine.includes('connected') || trimmedLine.includes('success')) {
        status = 'success'
      } else if (trimmedLine.includes('✗') || trimmedLine.includes('error') || trimmedLine.includes('failed')) {
        status = 'error'
      }
      
      // Extract timestamp if present (format: HH:MM:SS)
      const timeMatch = trimmedLine.match(/(\d{2}:\d{2}:\d{2})/)
      const timestamp = timeMatch ? timeMatch[1] : undefined
      
      // Clean up the message
      let message = trimmedLine
        .replace(/^(⏳|✓|✅|✗|🔐|📝)/, '')
        .replace(/^\d{2}:\d{2}:\d{2}\s*-?\s*/, '')
        .trim()
      
      if (message) {
        activities.push({ message, timestamp, status })
      }
    })
    
    // Remove the activity block from the text
    cleanedText = cleanedText.replace(match[0], '').trim()
  }
  
  return { text: cleanedText, activities }
}

// Component for interactive multi-select questions
function InteractiveQuestion({ 
  question, 
  options, 
  allowMultiple = false,
  onSubmit,
  variant = 'default'
}: { 
  question?: string
  options: { id: string; label: string; description?: string }[] | string[]
  allowMultiple?: boolean
  onSubmit: (selected: string | string[]) => void
  variant?: 'default' | 'cards' | 'chips'
}) {
  const [selected, setSelected] = useState<string[]>([])

  const toggleOption = (id: string) => {
    if (allowMultiple) {
      setSelected(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      )
    } else {
      setSelected([id])
      // Auto-submit on single selection
      if (!allowMultiple) {
        onSubmit(id)
      }
    }
  }

  // Normalize options to object format
  const normalizedOptions = options.map(opt => 
    typeof opt === 'string' ? { id: opt, label: opt, description: '' } : opt
  )

  if (variant === 'cards') {
    return (
      <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20 p-4 rounded-2xl my-2">
        {question && <p className="text-white font-medium mb-3">{question}</p>}
        <div className="grid grid-cols-2 gap-2">
          {normalizedOptions.map(option => (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`p-3 rounded-xl border transition-all text-left ${
                selected.includes(option.id)
                  ? 'bg-violet-500/30 border-violet-500'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <p className="text-white text-sm font-medium">{option.label}</p>
            </button>
          ))}
        </div>
        {allowMultiple && selected.length > 0 && (
          <button
            onClick={() => onSubmit(selected)}
            className="mt-4 w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors"
          >
            Confirm ({selected.length} selected)
          </button>
        )}
      </div>
    )
  }

  if (variant === 'chips') {
    return (
      <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20 p-4 rounded-2xl my-2">
        {question && <p className="text-white font-medium mb-3">{question}</p>}
        <div className="flex flex-wrap gap-2">
          {normalizedOptions.map(option => (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                selected.includes(option.id)
                  ? 'bg-violet-500/30 border-violet-500 text-white'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {allowMultiple && selected.length > 0 && (
          <button
            onClick={() => onSubmit(selected)}
            className="mt-4 w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors"
          >
            Confirm ({selected.length} selected)
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20 p-4 rounded-2xl my-2">
      {question && <p className="text-white font-medium mb-3">{question}</p>}
      <div className="space-y-2">
        {normalizedOptions.map(option => (
          <button
            key={option.id}
            onClick={() => toggleOption(option.id)}
            className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
              selected.includes(option.id)
                ? 'bg-violet-500/20 border-violet-500/50'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="mt-0.5">
              {selected.includes(option.id) ? (
                <CheckSquare className="w-5 h-5 text-violet-400" />
              ) : (
                <Square className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{option.label}</p>
              {option.description && (
                <p className="text-slate-400 text-xs mt-0.5">{option.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={() => onSubmit(allowMultiple ? selected : selected[0])}
        disabled={selected.length === 0}
        className="mt-4 w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
      >
        {allowMultiple ? `Send ${selected.length} selected` : 'Confirm'}
      </button>
    </div>
  )
}

// Version: 2026-08-17-002 - Auth fix
export default function AIAgentPage() {
  const { user, session, token: authToken, isAuthenticated, isLoading: authLoading } = useAuth()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  
  // Get storage key for current store's conversation
  const getStorageKey = useCallback((storeId: string) => `ai_chat_${storeId}`, [])
  const [context, setContext] = useState<ContextData | null>(null)
  const [loadingContext, setLoadingContext] = useState(true)
  const [budget, setBudget] = useState<BudgetData | null>(null)
  const [loadingBudget, setLoadingBudget] = useState(true)
  const [aiConfig, setAiConfig] = useState<AIConfig | null>(null)
  const [aiConfigStep, setAiConfigStep] = useState<'provider' | 'model' | 'key' | null>(null)
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [savingAIConfig, setSavingAIConfig] = useState(false)
  const [aiConfigError, setAiConfigError] = useState('')
  const [isLoadingAIConfig, setIsLoadingAIConfig] = useState(true)
  const [backendError, setBackendError] = useState<string | null>(null)
  
  // Onboarding & Workflow state
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus | null>(null)
  const [loadingWorkflow, setLoadingWorkflow] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showInlineOnboarding, setShowInlineOnboarding] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  
  // Sidebar view state
  const [sidebarView, setSidebarView] = useState<'setup' | 'vps' | 'onboarding' | 'api' | 'workflow'>('setup')
  
  // Onboarding state
  const [onboardingStep, setOnboardingStep] = useState(0)
  const [onboardingAnswers, setOnboardingAnswers] = useState<Record<string, string>>({})
  
  // API Splash Screen state
  const [showAPISplash, setShowAPISplash] = useState(false)
  
  // Worker & Provisioning state
  const [workerStatus, setWorkerStatus] = useState<'loading' | 'provisioning' | 'running' | 'error' | 'none'>('loading')
  const [provisionError, setProvisionError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  
  // WebSocket refs
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const [wsConnected, setWsConnected] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Clear error when auth becomes ready
  useEffect(() => {
    if (isAuthenticated && (aiConfigError === 'Please sign in first' || aiConfigError === 'Session not available. Please refresh the page.')) {
      setAiConfigError('')
    }
  }, [isAuthenticated, aiConfigError])

  // Initialize - load everything when auth is ready
  useEffect(() => {
    console.log('[AI Agent] Initializing v2026-08-17-002, auth:', isAuthenticated)
    if (!authLoading && isAuthenticated) {
      loadContext()
      loadBudget()
      loadAIConfig()
      loadWorkflowStatus()
    }
  }, [authLoading, isAuthenticated])

  // Load saved conversation when store is available
  useEffect(() => {
    const storeId = context?.stores?.[0]?.id
    if (storeId) {
      const storageKey = getStorageKey(storeId)
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setMessages(parsed)
        } catch (e) {
          console.error('Failed to load saved conversation:', e)
        }
      }
    }
  }, [context?.stores, getStorageKey])

  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    const storeId = context?.stores?.[0]?.id
    if (storeId && messages.length > 0) {
      const storageKey = getStorageKey(storeId)
      localStorage.setItem(storageKey, JSON.stringify(messages))
    }
  }, [messages, context?.stores, getStorageKey])

  // Show inline onboarding if onboarding is not complete
  useEffect(() => {
    if (!loadingWorkflow && workflowStatus && context?.stores?.[0] && !showInlineOnboarding && aiConfig) {
      // Show inline onboarding if onboarding is NOT complete
      if (!workflowStatus.onboardingComplete) {
        setShowInlineOnboarding(true)
        // Add a message prompting to complete onboarding
        setMessages(prev => {
          // Check if we already have an onboarding message
          const hasOnboardingMsg = prev.some(m => m.role === 'assistant' && m.content.includes('complete your store setup'))
          if (hasOnboardingMsg) return prev
          return [...prev, {
            role: 'assistant',
            content: 'Welcome! To get started, I need to learn about your store. Please complete the setup below:',
          }]
        })
      }
    }
  }, [loadingWorkflow, workflowStatus, context, showInlineOnboarding, aiConfig])

  // Show greeting when onboarding completes - DISABLED in favor of inline onboarding
  // useEffect(() => {
  //   if (workflowStatus?.onboardingComplete && !hasGreeted && !loadingWorkflow && aiConfig) {
  //     setHasGreeted(true)
  //     const greeting = generateOnboardingGreeting(workflowStatus.storeConfig)
  //     setMessages(prev => [...prev, { role: 'assistant', content: greeting }])
  //   }
  // }, [workflowStatus, hasGreeted, loadingWorkflow, aiConfig])

  // Wake up backend and auto-configure AI
  useEffect(() => {
    const wakeAndConfigure = async () => {
      if (!isAuthenticated) return
      
      setIsLoadingAIConfig(true)
      setBackendError(null)
      
      try {
        const token = authToken || session?.access_token
        if (!token) {
          setIsLoadingAIConfig(false)
          return
        }
        
        // First, wake up the backend with a health check (30s timeout)
        console.log('[AI] Waking up backend...')
        const healthController = new AbortController()
        const healthTimeout = setTimeout(() => healthController.abort(), 30000)
        
        try {
          const healthRes = await fetch(`${API_URL}/health`, {
            signal: healthController.signal
          })
          clearTimeout(healthTimeout)
          console.log('[AI] Backend awake:', healthRes.status)
        } catch (e) {
          clearTimeout(healthTimeout)
          console.log('[AI] Health check failed, proceeding anyway...')
        }
        
        // Check if already configured (with timeout)
        console.log('[AI] Checking existing config...')
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 15000)
        
        const response = await fetch(`${API_URL}/api/ai/config`, {
          headers: { 'Authorization': `Bearer ${token}` },
          signal: controller.signal
        })
        clearTimeout(timeout)
        
        if (response.ok) {
          const data = await response.json()
          if (data.configured) {
            console.log('[AI] Already configured:', data.provider)
            setAiConfig({ provider: data.provider, model: data.model })
            setIsLoadingAIConfig(false)
            return
          }
        }
        
        // Auto-configure with ShoppDropp AI
        console.log('[AI] Auto-configuring with ShoppDropp AI...')
        const saveController = new AbortController()
        const saveTimeout = setTimeout(() => saveController.abort(), 15000)
        
        const saveResponse = await fetch(`${API_URL}/api/ai/config`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            provider: 'openrouter',
            model: 'moonshotai/kimi-k2.5',
            usePlatformAI: true,
          }),
          signal: saveController.signal
        })
        clearTimeout(saveTimeout)
        
        if (saveResponse.ok) {
          console.log('[AI] Auto-configured successfully')
          setAiConfig({ provider: 'openrouter', model: 'moonshotai/kimi-k2.5' })
        } else {
          const errData = await saveResponse.json().catch(() => ({}))
          console.error('[AI] Auto-configure failed:', errData.error || saveResponse.status)
          setBackendError(errData.error || 'Failed to configure AI')
        }
      } catch (error: any) {
        console.error('[AI] Auto-configure failed:', error)
        if (error.name === 'AbortError') {
          setBackendError('Backend is waking up... Please wait 30 seconds and refresh.')
        } else {
          setBackendError('Connection failed. Backend may be sleeping.')
        }
      } finally {
        setIsLoadingAIConfig(false)
      }
    }
    
    wakeAndConfigure()
  }, [isAuthenticated, authToken, session])

  // Connect WebSocket when AI is configured
  useEffect(() => {
    if (aiConfig && !wsRef.current) {
      connectWebSocket()
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [aiConfig])

  function generateOnboardingGreeting(config?: WorkflowStatus['storeConfig']) {
    let greeting = `🎉 **Welcome! Your AI Agent is Ready**

`
    
    if (config?.market) {
      greeting += `I see you're building a store in **${config.market}**. `
    }
    
    greeting += `Here's what I can help you with:

`
    greeting += `**The ShoppDropp Workflow:**
`
    greeting += `1. 🔍 **Product Research** - Find trending, high-margin products
`
    greeting += `2. 📦 **Supplier Sourcing** - Connect with CJ Dropshipping
`
    greeting += `3. 🎨 **Store Building** - Create Shopify themes and listings
`
    greeting += `4. 📢 **Marketing Launch** - Set up Meta Ads campaigns
`
    greeting += `5. 📊 **Performance Review** - Analyze metrics and optimize
`
    greeting += `6. 🔄 **Iterate & Improve** - Continuous optimization

`
    
    if (!workflowStatus?.canStartWorkflow) {
      greeting += `⚠️ **Before we start:** Your store configuration needs a few more details. Let's complete that first!`
    } else {
      greeting += `✅ **You're all set!** Just say "start my store" and I'll begin the workflow.`
    }
    
    return greeting
  }

  async function connectWebSocket() {
    try {
      // Use token from useAuth (supports Supabase session OR localStorage JWT)
      const token = authToken || session?.access_token
      if (!token) {
        console.log('[AI-WS] No auth token available')
        return
      }

      // Use worker's gateway if available, otherwise fallback to backend
      let wsUrl: string
      if (activeWorker?.ip && activeWorker.status === 'running') {
        // Connect directly to worker's OpenClaw gateway
        wsUrl = `ws://${activeWorker.ip}:3001/ws?token=${token}`
        console.log('[AI-WS] Connecting to worker gateway:', wsUrl)
      } else {
        // Fallback to backend WebSocket
        wsUrl = `${API_URL.replace('https://', 'wss://').replace('http://', 'ws://')}/ws/ai-chat?token=${token}`
        console.log('[AI-WS] Connecting to backend:', wsUrl)
      }
      
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log('[AI-WS] Connected')
        setWsConnected(true)
      }
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        handleWebSocketMessage(data)
      }
      
      ws.onclose = () => {
        console.log('[AI-WS] Disconnected')
        setWsConnected(false)
        wsRef.current = null
      }
      
      ws.onerror = (error) => {
        console.error('[AI-WS] Error:', error)
        setWsConnected(false)
      }
      
      wsRef.current = ws
    } catch (error) {
      console.error('[AI-WS] Failed to connect:', error)
    }
  }

  function handleWebSocketMessage(data: any) {
    switch (data.type) {
      case 'connected':
        console.log('[AI-WS] Server confirmed connection')
        break
      case 'thinking':
        setMessages(prev => {
          const lastMsg = prev[prev.length - 1]
          if (lastMsg?.role === 'assistant' && lastMsg?.isStreaming) {
            return prev
          }
          return [...prev, { role: 'assistant', content: '', isStreaming: true }]
        })
        break
      case 'chunk':
        setMessages(prev => {
          const newMessages = [...prev]
          const lastMsg = newMessages[newMessages.length - 1]
          if (lastMsg?.role === 'assistant') {
            lastMsg.content += data.content
            lastMsg.isStreaming = true
          }
          return newMessages
        })
        break
      case 'complete':
        setMessages(prev => {
          const newMessages = [...prev]
          const lastMsg = newMessages[newMessages.length - 1]
          if (lastMsg?.role === 'assistant') {
            lastMsg.isStreaming = false
          }
          return newMessages
        })
        setLoading(false)
        break
      case 'error':
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Error: ${data.error}` 
        }])
        setLoading(false)
        break
    }
  }

  async function loadWorkflowStatus() {
    try {
      const token = authToken || session?.access_token
      if (!token) {
        setLoadingWorkflow(false)
        return
      }
      
      const storeRes = await fetch(`${API_URL}/api/stores`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      
      if (!storeRes.ok) {
        setLoadingWorkflow(false)
        return
      }
      
      const stores = await storeRes.json()
      if (stores.length === 0) {
        setLoadingWorkflow(false)
        return
      }
      
      const storeId = stores[0].id
      
      const response = await fetch(`${API_URL}/api/onboarding/workflow-status/${storeId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setWorkflowStatus(data)
      }
    } catch (error) {
      console.error('Failed to load workflow status:', error)
    } finally {
      setLoadingWorkflow(false)
    }
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    loadWorkflowStatus()
    
    // Show API splash screen after onboarding
    setTimeout(() => {
      setShowAPISplash(true)
    }, 500)
  }

  // Start research workflow after onboarding
  async function startResearchWorkflow() {
    try {
      const token = authToken || session?.access_token
      if (!token || !activeStore?.id || !user?.id) return

      setResearchStatus('running')
      setResearchActivities([])
      
      // Connect to research WebSocket
      const wsUrl = `${API_URL.replace(/^http/, 'ws')}/ws/research?userId=${user.id}&storeId=${activeStore.id}`
      const ws = new WebSocket(wsUrl)
      setResearchWs(ws)
      
      ws.onopen = () => {
        console.log('[Research] WebSocket connected')
        // Start research with onboarding data
        ws.send(JSON.stringify({
          type: 'start_research',
          context: {
            category: workflowStatus?.storeConfig?.market || 'General',
            subcategory: workflowStatus?.storeConfig?.market || 'products',
            productCount: 20,
            priceRange: { min: 10, max: 50 },
            targetAudience: workflowStatus?.storeConfig?.targetAudience || 'general',
            brandName: activeStore?.name || 'My Store',
          }
        }))
      }
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          console.log('[Research] Message:', data)
          
          switch (data.type) {
            case 'research_started':
              setResearchRunId(data.runId)
              break
              
            case 'activity':
              setResearchActivities(prev => [...prev, data.activity])
              break
              
            case 'research_complete':
              setResearchStatus('completed')
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: `✅ Research complete! Found ${data.result?.productsVerified || 0} products available on CJ Dropshipping.`
              }])
              ws.close()
              break
              
            case 'error':
              setResearchStatus('failed')
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: `❌ Research failed: ${data.message || 'Unknown error'}`
              }])
              ws.close()
              break
          }
        } catch (e) {
          console.error('[Research] Failed to parse message:', e)
        }
      }
      
      ws.onerror = (error) => {
        console.error('[Research] WebSocket error:', error)
        setResearchStatus('failed')
      }
      
      ws.onclose = () => {
        console.log('[Research] WebSocket closed')
        setResearchWs(null)
      }
      
      // Add initial message
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '🎯 **Starting Product Research Workflow**\n\nNow I\'ll analyze market opportunities in your niche using our research APIs. This includes:\n• TikTok viral product discovery\n• Reddit community validation\n• Google Trends demand analysis\n• Amazon competition & pricing\n• CJ Dropshipping availability check\n\nStreaming results...'
      }])
      
    } catch (error) {
      console.error('Failed to start research workflow:', error)
      setResearchStatus('failed')
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ I encountered an error starting the research workflow. Please try again.'
      }])
    }
  }

  // Save API key to backend
  const [savingAPIKey, setSavingAPIKey] = useState(false)
  const [apiKeyInputs, setApiKeyInputs] = useState<Record<string, string>>({})
  
  async function saveAPIKey(service: string, key: string) {
    if (!activeStore?.id || !key.trim()) return
    
    setSavingAPIKey(true)
    try {
      const token = authToken || session?.access_token
      if (!token) return
      
      const response = await fetch(`${API_URL}/api/credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          store_id: activeStore.id,
          service_type: service,
          api_key: key.trim(),
        }),
      })
      
      if (response.ok) {
        // Reload workflow status to update UI
        loadWorkflowStatus()
        // Clear input
        setApiKeyInputs(prev => ({ ...prev, [service]: '' }))
      }
    } catch (error) {
      console.error('Failed to save API key:', error)
    } finally {
      setSavingAPIKey(false)
    }
  }

  async function loadContext() {
    try {
      const token = authToken || session?.access_token
      if (!token) {
        setLoadingContext(false)
        return
      }

      const response = await fetch(`${API_URL}/api/ai-chat/context`, {
        headers: { 'Authorization': `Bearer ${token}` },
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
      const token = authToken || session?.access_token
      if (!token) {
        setLoadingBudget(false)
        return
      }

      const response = await fetch(`${API_URL}/api/budget/status`, {
        headers: { 'Authorization': `Bearer ${token}` },
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
      const token = authToken || session?.access_token
      if (!token) return

      const response = await fetch(`${API_URL}/api/ai/config`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.configured) {
          setAiConfig({ provider: data.provider, model: data.model })
          // Only add welcome message if no saved conversation exists
          // (The saved conversation will be loaded by the other useEffect)
        }
      }
    } catch (error) {
      console.error('Failed to load AI config:', error)
    }
  }

  const saveAIConfiguration = async () => {
    setSavingAIConfig(true)
    setAiConfigError('')

    try {
      const token = authToken || session?.access_token
      if (!token) {
        setAiConfigError('Session not available. Please refresh the page.')
        console.error('[AI Config] No session available')
        return
      }

      const response = await fetch(`${API_URL}/api/ai/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          provider: selectedProvider,
          model: selectedModel,
          apiKey: apiKeyInput,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save configuration')
      }

      // Success - update state
      setAiConfig({ provider: selectedProvider, model: selectedModel })
      setAiConfigStep(null)
      
      // Refresh context and trigger onboarding
      await loadContext()
      await loadWorkflowStatus()
      
      // Show success message and trigger onboarding (append to existing conversation)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `✅ **AI Configuration Saved!**

Your ${AI_PROVIDERS.find(p => p.id === selectedProvider)?.name} integration is now active with model **${selectedModel}**.

Next, I need to learn about your store to provide personalized assistance. Let's complete your store configuration!` 
      }])
      
      // Auto-show inline onboarding if not complete
      setTimeout(() => {
        setShowInlineOnboarding(true)
        setMessages(prev => {
          const hasOnboardingMsg = prev.some(m => m.role === 'assistant' && m.content.includes('complete your store setup'))
          if (hasOnboardingMsg) return prev
          return [...prev, {
            role: 'assistant',
            content: 'Welcome! To get started, I need to learn about your store. Please complete the setup below:',
          }]
        })
      }, 1500)
      
    } catch (error: any) {
      setAiConfigError(error.message || 'Failed to save configuration')
    } finally {
      setSavingAIConfig(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)

    // If WebSocket is connected, use it for streaming
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const conversationHistory = newMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(-10)
        .map(m => ({ role: m.role, content: m.content }))

      wsRef.current.send(JSON.stringify({
        type: 'chat',
        content: userMessage,
        conversation_history: conversationHistory,
      }))
      return
    }

    // Fallback to HTTP API
    try {
      const token = authToken || session?.access_token
      if (!token) {
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
          'Authorization': `Bearer ${token}`,
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
      
      // Check if we should show API splash screen
      if (data.show_api_splash) {
        setShowAPISplash(true)
      }
      
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
  const provider = AI_PROVIDERS.find(p => p.id === selectedProvider)

  // AI Configuration UI
  const renderAIConfig = () => {
    if (aiConfig) return null

    // Show loading state while checking/configuring
    if (isLoadingAIConfig) {
      return (
        <Card className="bg-gradient-to-br from-violet-950/50 to-pink-950/50 border-violet-500/30 mb-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
              <span className="text-white">Connecting to ShoppDropp AI...</span>
            </div>
            {backendError && (
              <p className="mt-3 text-sm text-yellow-400 text-center">{backendError}</p>
            )}
          </CardContent>
        </Card>
      )
    }

    // Show backend error with retry option
    if (backendError && !aiConfigStep) {
      return (
        <Card className="bg-gradient-to-br from-violet-950/50 to-pink-950/50 border-violet-500/30 mb-4">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Connection Issue</h3>
                <p className="text-slate-300 mb-4">{backendError}</p>
                <div className="space-y-3">
                  <Button 
                    onClick={() => {
                      setBackendError(null)
                      setIsLoadingAIConfig(true)
                      // Retry
                      window.location.reload()
                    }}
                    className="w-full bg-violet-500 hover:bg-violet-600"
                  >
                    <Loader2 className="w-4 h-4 mr-2" />
                    Retry Connection
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setAiConfigStep('provider')}
                    className="w-full"
                  >
                    Configure Manually
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (!aiConfigStep) {
      return (
        <Card className="bg-gradient-to-br from-violet-950/50 to-pink-950/50 border-violet-500/30 mb-4">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-violet-500/20 rounded-xl">
                <Brain className="w-6 h-6 text-violet-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">Configure AI Provider</h3>
                <p className="text-slate-300 mb-4">
                  Choose how you want to power your AI Agent:
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setAiConfigStep('provider')}
                    className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 rounded-xl text-left transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-500/20 rounded-lg">
                        <Zap className="w-5 h-5 text-violet-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">Use My Own API Key</h4>
                        <p className="text-sm text-slate-400">Connect your OpenRouter, OpenAI, or other provider</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-500" />
                    </div>
                  </button>
                  
                  <button
                    onClick={async () => {
                      // Use ShoppDropp AI (platform key)
                      setSavingAIConfig(true)
                      setAiConfigError('')
                      try {
                        const token = authToken || session?.access_token
                        if (!token) {
                          setAiConfigError('Session not available. Please refresh the page.')
                          return
                        }
                        const response = await fetch(`${API_URL}/api/ai/config`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                          },
                          body: JSON.stringify({
                            provider: 'openrouter',
                            model: 'moonshotai/kimi-k2.5',
                            usePlatformAI: true,
                          }),
                        })
                        if (!response.ok) {
                          const error = await response.json()
                          throw new Error(error.error || 'Platform AI not available')
                        }
                        setAiConfig({ provider: 'openrouter', model: 'moonshotai/kimi-k2.5' })
                        setMessages(prev => [...prev, { 
                          role: 'assistant', 
                          content: `✅ **ShoppDropp AI Activated!**

You're now using our platform AI (Kimi K2.5). This is perfect for getting started!

Next, I need to learn about your store to provide personalized assistance. Let's complete your store configuration, and I'll also collect your API keys for Meta Ads, CJ Dropshipping, Shopify, and Research APIs.` 
                        }])
                        setTimeout(() => {
                          setShowInlineOnboarding(true)
                          setMessages(prev => {
                            const hasOnboardingMsg = prev.some(m => m.role === 'assistant' && m.content.includes('complete your store setup'))
                            if (hasOnboardingMsg) return prev
                            return [...prev, {
                              role: 'assistant',
                              content: 'Welcome! To get started, I need to learn about your store. Please complete the setup below:',
                            }]
                          })
                        }, 1500)
                      } catch (error: any) {
                        setAiConfigError(error.message || 'Failed to activate platform AI')
                      } finally {
                        setSavingAIConfig(false)
                      }
                    }}
                    disabled={savingAIConfig}
                    className="w-full p-4 bg-gradient-to-r from-violet-500/20 to-pink-500/20 hover:from-violet-500/30 hover:to-pink-500/30 border border-violet-500/30 rounded-xl text-left transition-all disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-violet-500 to-pink-500 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">Use ShoppDropp AI</h4>
                        <p className="text-sm text-slate-400">Use our platform AI (no API key needed)</p>
                      </div>
                      {savingAIConfig ? (
                        <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </button>
                </div>
                {aiConfigError && (
                  <p className="mt-3 text-sm text-red-400">{aiConfigError}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="bg-[#111118] border-violet-500/30 mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/20 rounded-lg">
                <Brain className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Configure AI Provider</h3>
                <p className="text-sm text-slate-400">
                  Step {aiConfigStep === 'provider' ? 1 : aiConfigStep === 'model' ? 2 : 3} of 3
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setAiConfigStep(null)
                setSelectedProvider('')
                setSelectedModel('')
                setApiKeyInput('')
                setAiConfigError('')
              }}
              className="p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {aiConfigError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {aiConfigError}
            </div>
          )}

          {/* Step 1: Provider Selection */}
          {aiConfigStep === 'provider' && (
            <div className="space-y-3">
              <p className="text-slate-300 mb-4">
                Select your AI provider:
              </p>
              {AI_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedProvider(p.id)
                    setAiConfigStep('model')
                  }}
                  className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-violet-500/50 rounded-xl text-left transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{p.name}</h4>
                      <p className="text-sm text-slate-400">{p.description}</p>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-white/20" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Model Selection */}
          {aiConfigStep === 'model' && provider && (
            <div className="space-y-4">
              <button
                onClick={() => setAiConfigStep('provider')}
                className="text-sm text-violet-400 hover:text-violet-300"
              >
                ← Back to providers
              </button>
              <p className="text-slate-300">
                Select a model from {provider.name}:
              </p>
              <div className="space-y-2">
                {provider.models.map((model: any) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id)
                      setAiConfigStep('key')
                    }}
                    className={`w-full p-4 border rounded-xl text-left transition-all ${
                      selectedModel === model.id
                        ? 'bg-violet-500/20 border-violet-500'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-white">{model.name}</p>
                        <p className="text-sm text-slate-400">{model.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: API Key */}
          {aiConfigStep === 'key' && provider && (
            <form onSubmit={(e) => { e.preventDefault(); saveAIConfiguration(); }} className="space-y-4">
              <button
                type="button"
                onClick={() => setAiConfigStep('model')}
                className="text-sm text-violet-400 hover:text-violet-300"
              >
                ← Back to models
              </button>
              
              <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-violet-400" />
                  <span className="font-medium text-white">{provider.name}</span>
                </div>
                <code className="text-sm text-violet-300 font-mono">{selectedModel}</code>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  onPaste={(e) => {
                    e.preventDefault()
                    const pastedText = e.clipboardData.getData('text')
                    setApiKeyInput(pastedText.trim())
                  }}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
                      // Allow native paste to work, onPaste will handle it
                      return
                    }
                  }}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
                  placeholder={`sk-...`}
                  required
                />
                <div className="mt-2 flex items-start gap-2 text-xs text-slate-500">
                  <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <span>
                    Your API key is encrypted and stored securely. 
                    Get your key from{' '}
                    <a 
                      href={provider.docsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-violet-400 hover:underline"
                    >
                      {provider.name} console
                    </a>
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setAiConfigStep(null)}
                  className="flex-1 px-4 py-2 border border-white/20 text-slate-300 rounded-lg hover:bg-white/5"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={savingAIConfig || !apiKeyInput.trim()}
                  className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-50"
                >
                  {savingAIConfig ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Save & Continue'
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    )
  }

  // Loading Skeleton - also show while auth is loading
  if (authLoading || loadingContext || loadingWorkflow) {
    return (
      <div className="flex h-[calc(100vh-4rem)] gap-4">
        {/* LEFT - Loading Skeleton */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl animate-pulse" />
            <div className="space-y-2">
              <div className="w-32 h-6 bg-white/10 rounded animate-pulse" />
              <div className="w-48 h-4 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
          
          <Card className="bg-[#111118] border-white/10 flex-1">
            <CardContent className="p-6 space-y-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-white/10 rounded animate-pulse" />
                  <div className="w-1/2 h-4 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
                <div className="w-2/3 h-4 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="w-full h-4 bg-white/10 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT - Loading Skeleton */}
        <div className="w-80 flex-shrink-0 space-y-4">
          <Card className="bg-[#111118] border-white/10">
            <CardHeader className="pb-3">
              <div className="w-24 h-4 bg-white/10 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="w-full h-8 bg-white/10 rounded animate-pulse" />
              <div className="w-full h-8 bg-white/10 rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      {/* LEFT MAIN - Chat Interface */}
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
          {wsConnected && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse" />
              Live
            </Badge>
          )}
        </div>

        {/* AI Config Prompt */}
        {renderAIConfig()}

        {/* Chat Card */}
        <Card className="bg-[#111118] border-white/10 flex flex-col flex-1 min-h-0">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => {
              // Parse form and activity blocks from assistant messages
              const { text: contentAfterForms, forms } = msg.role === 'assistant' 
                ? parseFormBlocks(msg.content)
                : { text: msg.content, forms: [] }
              
              const { text: cleanedContent, activities } = msg.role === 'assistant'
                ? parseActivityBlocks(contentAfterForms)
                : { text: contentAfterForms, activities: [] }
              
              return (
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
                      {cleanedContent}
                      {msg.isStreaming && (
                        <span className="inline-block w-2 h-4 ml-1 bg-pink-400 animate-pulse" />
                      )}
                    </div>
                  </div>
                  
                  {/* Render ACTIVITY blocks */}
                  {activities.length > 0 && msg.role === 'assistant' && (
                    <div className="flex gap-3 mt-2">
                      <div className="w-8" />
                      <div className="max-w-[80%] flex-1">
                        <div className="bg-[#0d1117] border border-green-500/30 rounded-lg p-4 space-y-2">
                          <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-3">
                            <Activity className="w-4 h-4" />
                            Platform Connections
                          </div>
                          {activities.map((activity, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              {activity.status === 'success' ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                              ) : activity.status === 'error' ? (
                                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                              ) : (
                                <Loader2 className="w-4 h-4 text-yellow-400 flex-shrink-0 animate-spin" />
                              )}
                              {activity.timestamp && (
                                <span className="text-slate-500 text-xs font-mono">{activity.timestamp}</span>
                              )}
                              <span className={
                                activity.status === 'success' ? 'text-slate-300' :
                                activity.status === 'error' ? 'text-red-300' :
                                'text-slate-400'
                              }>{activity.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Render parsed FORM blocks as interactive questions */}
                  {forms.length > 0 && msg.role === 'assistant' && (
                    <div className="flex gap-3">
                      <div className="w-8" />
                      <div className="max-w-[80%] flex-1 space-y-3">
                        {forms.map((form, formIdx) => {
                          const handleSubmit = (value: string | number | string[]) => {
                            const selectedText = Array.isArray(value) ? value.join(', ') : String(value)
                            const selectionMessage = `Selected: ${selectedText}`
                            
                            // Track onboarding answers
                            setOnboardingAnswers(prev => {
                              const questionKey = `question_${Object.keys(prev).length + 1}`
                              return { ...prev, [questionKey]: selectedText }
                            })
                            setOnboardingStep(prev => prev + 1)
                            
                            setMessages(prev => [...prev, { role: 'user', content: selectionMessage }])
                            
                            const token = authToken || session?.access_token
                            if (token && wsRef.current?.readyState === WebSocket.OPEN) {
                              wsRef.current.send(JSON.stringify({
                                type: 'chat',
                                content: selectionMessage,
                              }))
                              setLoading(true)
                            } else if (token) {
                              fetch(`${API_URL}/api/ai-chat/chat`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify({ message: selectionMessage }),
                              }).then(async (res) => {
                                const data = await res.json()
                                setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
                                setLoading(false)
                              }).catch(() => setLoading(false))
                              setLoading(true)
                            }
                          }
                          
                          return (
                            <div key={formIdx}>
                              {/* TEXT INPUT FORM */}
                              {form.type === 'text' && (
                                <TextForm 
                                  placeholder={form.placeholder}
                                  onSubmit={handleSubmit}
                                />
                              )}
                              
                              {/* SLIDER FORM */}
                              {form.type === 'slider' && (
                                <SliderForm 
                                  min={form.min || 0} 
                                  max={form.max || 10} 
                                  defaultValue={form.default || 5}
                                  leftLabel={form.leftLabel || 'Low'}
                                  rightLabel={form.rightLabel || 'High'}
                                  onSubmit={(v) => handleSubmit(`${v}/${form.max || 10}`)}
                                />
                              )}
                              
                              {/* NUMBER/BUDGET INPUT */}
                              {(form.type === 'number' || form.type === 'budget') && (
                                <NumberForm 
                                  placeholder={form.placeholder}
                                  prefix={form.type === 'budget' ? '$' : ''}
                                  min={form.min}
                                  max={form.max}
                                  onSubmit={handleSubmit}
                                />
                              )}
                              
                              {/* API CONNECT FORM */}
                              {form.type === 'connect' && form.options && (
                                <ConnectAPIForm 
                                  services={form.options}
                                  onSubmit={handleSubmit}
                                />
                              )}
                              
                              {/* OPTIONS FORM */}
                              {(form.type === 'cards' || form.type === 'chips' || form.type === 'single' || form.type === 'multiselect') && form.options && (
                                <InteractiveQuestion
                                  question={form.question}
                                  options={form.options}
                                  allowMultiple={form.allowMultiple || form.type === 'multiselect'}
                                  variant={form.type === 'cards' ? 'cards' : 'chips'}
                                  onSubmit={handleSubmit}
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Interactive question component (legacy format) */}
                  {msg.interactive && msg.role === 'assistant' && (
                    <div className="flex gap-3">
                      <div className="w-8" />
                      <div className="max-w-[80%] flex-1">
                        <InteractiveQuestion
                          question={msg.interactive.question}
                          options={msg.interactive.options || []}
                          allowMultiple={msg.interactive.allowMultiple || msg.interactive.type === 'multiselect'}
                          onSubmit={(selected) => {
                            const selectedText = Array.isArray(selected) 
                              ? selected.join(', ') 
                              : selected
                            // Send the selection as a user message
                            const selectionMessage = `Selected: ${selectedText}`
                            setMessages(prev => [...prev, { role: 'user', content: selectionMessage }])
                            // Process the selection through the API
                            const token = authToken || session?.access_token
                            if (token && wsRef.current?.readyState === WebSocket.OPEN) {
                              const conversationHistory = [...messages, { 
                                role: 'user', 
                                content: selectionMessage 
                              }]
                                .filter(m => m.role === 'user' || m.role === 'assistant')
                                .slice(-10)
                                .map(m => ({ role: m.role, content: m.content }))
                              
                              wsRef.current.send(JSON.stringify({
                                type: 'chat',
                                content: selectionMessage,
                                conversation_history: conversationHistory,
                              }))
                              setLoading(true)
                            } else if (token) {
                              // HTTP fallback
                              fetch(`${API_URL}/api/ai-chat/chat`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                  message: selectionMessage,
                                  conversation_history: messages
                                    .filter(m => m.role === 'user' || m.role === 'assistant')
                                    .slice(-10)
                                    .map(m => ({ role: m.role, content: m.content })),
                                }),
                              }).then(async (res) => {
                                const data = await res.json()
                                setMessages(prev => [...prev, { 
                                  role: 'assistant', 
                                  content: data.response 
                                }])
                              }).catch(err => {
                                setMessages(prev => [...prev, { 
                                  role: 'assistant', 
                                  content: 'Error processing your selection. Please try again.' 
                                }])
                              })
                              setLoading(true)
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                
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
            )})}
            
            {/* Thinking indicator - shows when AI is processing */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-pink-500/20">
                  <Bot className="w-4 h-4 text-pink-400" />
                </div>
                <div className="max-w-[80%] p-3 rounded-lg bg-white/5 text-slate-200">
                  <ThinkingDots />
                </div>
              </div>
            )}
            
            {/* AI Onboarding */}
            {showInlineOnboarding && activeStore && (
              <div className="flex gap-3">
                <div className="w-8" />
                <div className="flex-1 max-w-[90%]">
                  <div className="bg-[#111118] border border-violet-500/30 rounded-2xl overflow-hidden max-h-[600px]">
                    <AIOnboarding 
                      storeId={activeStore.id}
                      onComplete={() => {
                        setShowInlineOnboarding(false)
                        loadWorkflowStatus()
                        // Start research workflow message
                        setTimeout(() => {
                          setMessages(prev => [...prev, {
                            role: 'assistant',
                            content: '🎯 **Starting Product Research Workflow**\n\nNow I\'ll analyze market opportunities in your niche using our research APIs. This includes:\n• Amazon best-seller analysis\n• Walmart pricing intelligence\n• eBay trending products\n• Google Trends seasonality data\n\nLet me find high-margin products that match your criteria...'
                          }])
                        }, 1000)
                      }}
                      onRestart={() => {
                        setMessages([{
                          role: 'assistant',
                          content: 'Onboarding restarted. Let\'s begin...'
                        }])
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* API Splash Screen - shown after onboarding complete */}
            {showAPISplash && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-pink-500/20">
                  <Bot className="w-4 h-4 text-pink-400" />
                </div>
                <div className="max-w-[80%] flex-1">
                  <APISplashScreen 
                    onContinue={() => {
                      setShowAPISplash(false)
                      setSidebarView('api')
                      // Add a message to guide them
                      setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: 'Perfect! Now enter your API keys in the **API Keys** section of the right sidebar. Click each platform, paste your key, and click Save.',
                        timestamp: new Date().toISOString()
                      }])
                    }}
                  />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>
          
          <CardHeader className="border-t border-white/10 pt-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={aiConfig ? "Ask me anything about your store, worker, or dropshipping..." : "Configure AI provider to start chatting..."}
                className="bg-white/5 border-white/10 text-white"
                disabled={loading || !aiConfig}
              />
              <Button 
                onClick={sendMessage} 
                className="bg-violet-600 hover:bg-violet-500"
                disabled={loading || !input.trim() || !aiConfig}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {aiConfig ? 'Try: "provision a vps", "check worker status", "run product research task"' : 'Configure your AI provider above to start using the AI Agent'}
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* RIGHT SIDEBAR - Gateway & Config */}
      <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">
        
        {/* BACK BUTTON - When viewing detail */}
        {sidebarView !== 'setup' && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-400 hover:text-white -ml-2"
            onClick={() => setSidebarView('setup')}
          >
            <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
            Back to Setup
          </Button>
        )}
        
        {/* SETUP PROGRESS - Default View */}
        {sidebarView === 'setup' && (
        <Card className="bg-[#111118] border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-400">
              <Rocket className="w-4 h-4 text-violet-400" />
              Setup Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* VPS Stage */}
            <div 
              className="space-y-2 p-2 -m-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setSidebarView('vps')}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium flex items-center gap-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  VPS Provisioned
                </span>
                {activeWorker ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                ) : workerStatus === 'provisioning' ? (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Provisioning
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
              
              {/* Provisioning Progress UI */}
              {!activeWorker && workerStatus === 'provisioning' && (
                <div className="mt-3 space-y-2">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full animate-pulse" style={{ width: '60%' }} />
                  </div>
                  <div className="space-y-1">
                    {[
                      { step: 'Creating server instance', done: true },
                      { step: 'Installing OpenClaw Gateway', done: true },
                      { step: 'Configuring AI worker', done: false },
                      { step: 'Starting services', done: false },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        {item.done ? (
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-white/20" />
                        )}
                        <span className={item.done ? 'text-slate-300' : 'text-slate-500'}>
                          {item.step}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    This takes ~3-5 minutes. You can start onboarding while waiting.
                  </p>
                </div>
              )}
              
              {/* Provision/Reprovision Button */}
              {workerStatus !== 'provisioning' && (
                <div className="mt-3">
                  <Button 
                    size="sm" 
                    variant={activeWorker ? "outline" : "default"}
                    className={activeWorker 
                      ? "w-full border-white/20 text-slate-300 hover:bg-white/5" 
                      : "w-full bg-violet-500 hover:bg-violet-600"
                    }
                    onClick={(e) => {
                      e.stopPropagation()
                      if (activeWorker && confirm('This will destroy the current VPS and create a new one. Continue?')) {
                        setInput('reprovision vps worker')
                      } else {
                        setInput('provision a vps worker')
                      }
                    }}
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    {activeWorker ? 'Reprovision VPS' : 'Provision VPS'}
                  </Button>
                </div>
              )}
              
              {activeWorker && (
                <p className="text-xs text-slate-500 mt-2">
                  Worker online at {activeWorker.ip || '...'}
                </p>
              )}
            </div>
            
            <Separator className="bg-white/10" />
            
            {/* Onboarding Stage */}
            <div 
              className="space-y-2 p-2 -m-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setSidebarView('onboarding')}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-violet-400" />
                  Onboarding
                </span>
                {workflowStatus?.onboardingComplete ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Complete
                  </Badge>
                ) : (
                  <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 text-xs">
                    {Object.keys(onboardingAnswers).length > 0 ? `${Object.keys(onboardingAnswers).length}/${TOTAL_ONBOARDING_QUESTIONS}` : 'Not Started'}
                  </Badge>
                )}
              </div>
              
              {/* Start Onboarding Button */}
              {!workflowStatus?.onboardingComplete && Object.keys(onboardingAnswers).length === 0 && (
                <div className="mt-3">
                  <Button 
                    size="sm" 
                    className="w-full bg-violet-500 hover:bg-violet-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowInlineOnboarding(true)
                      setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: 'Welcome! Let\'s start your store setup. I\'ll ask you 27 questions to understand your business goals and create a personalized strategy.'
                      }])
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Onboarding
                  </Button>
                </div>
              )}
              
              {/* Progress bar */}
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full rounded-full bg-violet-500 transition-all"
                  style={{ width: `${workflowStatus?.onboardingComplete ? 100 : Math.min(100, (Object.keys(onboardingAnswers).length / TOTAL_ONBOARDING_QUESTIONS) * 100)}%` }}
                />
              </div>
              
              {/* Completed steps - show ALL in scrollable area */}
              {Object.keys(onboardingAnswers).length > 0 && (
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {Object.entries(onboardingAnswers).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="truncate">
                        <span className="text-slate-400">{key.replace(/_/g, ' ')}:</span>
                        <span className="text-white ml-1">{Array.isArray(value) ? value.join(', ') : String(value).substring(0, 30)}{String(value).length > 30 ? '...' : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Separator className="bg-white/10" />
            
            {/* API Keys Stage */}
            <div 
              className={`space-y-2 p-2 -m-2 rounded-lg transition-colors ${
                workflowStatus?.onboardingComplete 
                  ? 'cursor-pointer hover:bg-white/5' 
                  : 'cursor-not-allowed opacity-60'
              }`}
              onClick={() => workflowStatus?.onboardingComplete && setSidebarView('api')}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  API Keys
                </span>
                {workflowStatus?.canStartWorkflow ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge className={`text-xs ${workflowStatus?.onboardingComplete ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                    {workflowStatus?.onboardingComplete ? 'Pending' : 'Locked'}
                  </Badge>
                )}
              </div>
              {!workflowStatus?.onboardingComplete && (
                <p className="text-xs text-slate-500">
                  Complete onboarding to unlock
                </p>
              )}
            </div>
            
            <Separator className="bg-white/10" />
            
            {/* AI Workflow Stage */}
            <div 
              className={`space-y-2 p-2 -m-2 rounded-lg transition-colors ${
                workflowStatus?.canStartWorkflow 
                  ? 'cursor-pointer hover:bg-white/5' 
                  : 'cursor-not-allowed opacity-60'
              }`}
              onClick={() => workflowStatus?.canStartWorkflow && setSidebarView('workflow')}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4 text-pink-400" />
                  AI Workflow
                </span>
                {workflowStatus?.canStartWorkflow ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                ) : (
                  <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30 text-xs">
                    <Lock className="w-3 h-3 mr-1" />
                    Locked
                  </Badge>
                )}
              </div>
              {workflowStatus?.canStartWorkflow && (
                <Button 
                  size="sm" 
                  className="w-full bg-violet-600 hover:bg-violet-500"
                  onClick={(e) => {
                    e.stopPropagation()
                    setInput('start my store workflow')
                  }}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Start Workflow
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        )}

        {/* ONBOARDING DETAIL VIEW */}
        {sidebarView === 'onboarding' && (
          <Card className="bg-[#111118] border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-400">
                <LayoutTemplate className="w-4 h-4 text-violet-400" />
                Store Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Overview */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Completion</span>
                  <span className="text-violet-400 font-medium">
                    {workflowStatus?.onboardingComplete ? '100%' : `${Math.min(100, Math.round((Object.keys(onboardingAnswers).length / 27) * 100))}%`}
                  </span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-violet-500 transition-all"
                    style={{ width: `${workflowStatus?.onboardingComplete ? 100 : Math.min(100, Math.round((Object.keys(onboardingAnswers).length / 27) * 100))}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">
                  {Object.keys(onboardingAnswers).length} of 27 questions answered
                </p>
              </div>

              <Separator className="bg-white/10" />

              {/* ALL QUESTIONS - Scrollable List with Actual Names */}
              {Object.keys(onboardingAnswers).length > 0 ? (
                <div className="max-h-[400px] overflow-y-auto space-y-3 pr-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Completed Questions ({Object.keys(onboardingAnswers).length}/{TOTAL_ONBOARDING_QUESTIONS})</p>
                  {Object.entries(onboardingAnswers).map(([key, value]) => {
                    const question = getQuestionById(key);
                    return (
                      <div key={key} className="flex items-start gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-400 text-xs">{question?.section || 'General'}</p>
                          <p className="text-white text-sm font-medium">{question?.question || key}</p>
                          <p className="text-slate-300 text-xs break-words mt-0.5">
                            {Array.isArray(value) 
                              ? value.join(', ') 
                              : String(value).length > 80 
                                ? String(value).substring(0, 80) + '...' 
                                : String(value)
                            }
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">
                  No onboarding data yet. Start chatting with the AI to configure your store.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* API KEYS DETAIL VIEW */}
        {sidebarView === 'api' && (
          <Card className="bg-[#111118] border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-400">
                <Shield className="w-4 h-4 text-amber-400" />
                API Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-slate-500">
                Connect your platforms and research APIs to enable full automation.
              </p>

              {/* Shopify */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-green-400" />
                    Shopify
                  </span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Required</Badge>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter Shopify API key..."
                    value={apiKeyInputs.shopify || ''}
                    onChange={(e) => setApiKeyInputs(prev => ({ ...prev, shopify: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white text-sm flex-1"
                  />
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-500"
                    disabled={savingAPIKey || !apiKeyInputs.shopify}
                    onClick={() => saveAPIKey('shopify', apiKeyInputs.shopify)}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Meta Ads */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-blue-400" />
                    Meta Ads
                  </span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Required</Badge>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter Meta Access Token..."
                    value={apiKeyInputs.meta_ads || ''}
                    onChange={(e) => setApiKeyInputs(prev => ({ ...prev, meta_ads: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white text-sm flex-1"
                  />
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-500"
                    disabled={savingAPIKey || !apiKeyInputs.meta_ads}
                    onClick={() => saveAPIKey('meta_ads', apiKeyInputs.meta_ads)}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* CJ Dropshipping */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white flex items-center gap-2">
                    <Truck className="w-4 h-4 text-orange-400" />
                    CJ Dropshipping
                  </span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Required</Badge>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter CJ API key..."
                    value={apiKeyInputs.cj_dropshipping || ''}
                    onChange={(e) => setApiKeyInputs(prev => ({ ...prev, cj_dropshipping: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white text-sm flex-1"
                  />
                  <Button 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-500"
                    disabled={savingAPIKey || !apiKeyInputs.cj_dropshipping}
                    onClick={() => saveAPIKey('cj_dropshipping', apiKeyInputs.cj_dropshipping)}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* RESEARCH APIs - PRIMARY (Not Secondary) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-amber-400 uppercase tracking-wide font-medium">🔍 Research APIs (PRIMARY - Required for Product Research)</p>
                </div>
                <p className="text-xs text-slate-500">
                  These APIs are essential for finding winning products and competitive analysis. NOT optional.
                </p>
              </div>

              {/* Amazon Data */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white flex items-center gap-2">
                    <span className="text-orange-400">📦</span>
                    Amazon Data API
                  </span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Required</Badge>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter OpenWeb Ninja Amazon API key..."
                    value={apiKeyInputs.openwebninja_amazon || ''}
                    onChange={(e) => setApiKeyInputs(prev => ({ ...prev, openwebninja_amazon: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white text-sm flex-1"
                  />
                  <Button 
                    size="sm" 
                    className="bg-orange-600 hover:bg-orange-500"
                    disabled={savingAPIKey || !apiKeyInputs.openwebninja_amazon}
                    onClick={() => saveAPIKey('openwebninja_amazon', apiKeyInputs.openwebninja_amazon)}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Walmart Data */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white flex items-center gap-2">
                    <span className="text-blue-400">🏪</span>
                    Walmart Data API
                  </span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Required</Badge>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter OpenWeb Ninja Walmart API key..."
                    value={apiKeyInputs.openwebninja_walmart || ''}
                    onChange={(e) => setApiKeyInputs(prev => ({ ...prev, openwebninja_walmart: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white text-sm flex-1"
                  />
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-500"
                    disabled={savingAPIKey || !apiKeyInputs.openwebninja_walmart}
                    onClick={() => saveAPIKey('openwebninja_walmart', apiKeyInputs.openwebninja_walmart)}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* eBay Data */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white flex items-center gap-2">
                    <span className="text-red-400">🏷️</span>
                    eBay Data API
                  </span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Required</Badge>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter OpenWeb Ninja eBay API key..."
                    value={apiKeyInputs.openwebninja_ebay || ''}
                    onChange={(e) => setApiKeyInputs(prev => ({ ...prev, openwebninja_ebay: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white text-sm flex-1"
                  />
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-500"
                    disabled={savingAPIKey || !apiKeyInputs.openwebninja_ebay}
                    onClick={() => saveAPIKey('openwebninja_ebay', apiKeyInputs.openwebninja_ebay)}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Product Search */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white flex items-center gap-2">
                    <span className="text-purple-400">🔍</span>
                    Product Search API
                  </span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Required</Badge>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter OpenWeb Ninja Product Search API key..."
                    value={apiKeyInputs.openwebninja_product_search || ''}
                    onChange={(e) => setApiKeyInputs(prev => ({ ...prev, openwebninja_product_search: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white text-sm flex-1"
                  />
                  <Button 
                    size="sm" 
                    className="bg-purple-600 hover:bg-purple-500"
                    disabled={savingAPIKey || !apiKeyInputs.openwebninja_product_search}
                    onClick={() => saveAPIKey('openwebninja_product_search', apiKeyInputs.openwebninja_product_search)}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* E-commerce Data */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white flex items-center gap-2">
                    <span className="text-green-400">🛒</span>
                    E-commerce Data API
                  </span>
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Required</Badge>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter OpenWeb Ninja E-commerce API key..."
                    value={apiKeyInputs.openwebninja_ecommerce || ''}
                    onChange={(e) => setApiKeyInputs(prev => ({ ...prev, openwebninja_ecommerce: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white text-sm flex-1"
                  />
                  <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-500"
                    disabled={savingAPIKey || !apiKeyInputs.openwebninja_ecommerce}
                    onClick={() => saveAPIKey('openwebninja_ecommerce', apiKeyInputs.openwebninja_ecommerce)}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* WORKFLOW DETAIL VIEW */}
        {sidebarView === 'workflow' && (
          <Card className="bg-[#111118] border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-slate-400">
                <Brain className="w-4 h-4 text-pink-400" />
                AI Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!workflowStatus?.canStartWorkflow ? (
                <div className="text-center py-6">
                  <Lock className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">
                    Complete onboarding and add API keys to unlock AI workflows.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Available Workflows</p>
                    
                    {[
                      { name: 'Product Research', desc: 'Find winning products', icon: '🔍' },
                      { name: 'Store Setup', desc: 'Configure your store', icon: '🏪' },
                      { name: 'Ad Campaign', desc: 'Launch Meta ads', icon: '📢' },
                      { name: 'Order Fulfillment', desc: 'Auto-process orders', icon: '📦' },
                    ].map(flow => (
                      <button
                        key={flow.name}
                        className="w-full p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{flow.icon}</span>
                          <div>
                            <p className="text-sm text-white font-medium">{flow.name}</p>
                            <p className="text-xs text-slate-500">{flow.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-violet-600 hover:bg-violet-500"
                    onClick={() => setInput('start my store workflow')}
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Start Workflow
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

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
              <Badge className={wsConnected ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs"}>
                {wsConnected ? 'Connected' : 'HTTP Mode'}
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

        {/* Worker Status - Always show */}
        <Card className="bg-[#111118] border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-slate-400">
              <Server className="w-4 h-4 text-blue-400" />
              Worker
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeWorker ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Status</span>
                  <Badge className={getStatusColor(activeWorker.status)}>
                    {activeWorker.status === 'provisioning' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                    {activeWorker.status}
                  </Badge>
                </div>
                {activeWorker.ip && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">IP</span>
                    <span className="text-sm text-white font-mono text-xs">{activeWorker.ip}</span>
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 text-xs border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                    onClick={async () => {
                      const token = authToken || session?.access_token
                      if (token && confirm('This will destroy the current VPS and create a new one. Continue?')) {
                        fetch(`${API_URL}/api/workers/${activeWorker.id}/reprovision`, {
                          method: 'POST',
                          headers: { 'Authorization': `Bearer ${token}` }
                        })
                      }
                    }}
                  >
                    Reprovision
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-400">No worker provisioned</p>
                <Button 
                  size="sm" 
                  className="w-full bg-blue-600 hover:bg-blue-500"
                  onClick={() => setInput('provision a vps worker')}
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Provision Worker
                </Button>
              </>
            )}
          </CardContent>
        </Card>

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

        {/* Workflow Status */}
        {!loadingWorkflow && workflowStatus && (
          <Card className={`border-white/10 ${
            workflowStatus.canStartWorkflow 
              ? 'bg-green-950/20 border-green-500/30' 
              : 'bg-yellow-950/20 border-yellow-500/30'
          }`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                {workflowStatus.canStartWorkflow ? (
                  <Rocket className="w-4 h-4 text-green-400" />
                ) : (
                  <LayoutTemplate className="w-4 h-4 text-yellow-400" />
                )}
                <span className={workflowStatus.canStartWorkflow ? 'text-green-400' : 'text-yellow-400'}>
                  {workflowStatus.canStartWorkflow ? 'Ready to Launch' : 'Setup Required'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Onboarding</span>
                {workflowStatus.onboardingComplete ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Complete
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Incomplete
                  </Badge>
                )}
              </div>
              
              {!workflowStatus.canStartWorkflow && workflowStatus.missingRequirements.length > 0 && (
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-slate-500 mb-2">Missing:</p>
                  {workflowStatus.missingRequirements.map((req) => (
                    <div key={req} className="text-xs text-yellow-400/80 mb-1">
                      • {req.replace(/_/g, ' ')}
                    </div>
                  ))}
                </div>
              )}
              
              {workflowStatus.canStartWorkflow && (
                <Button 
                  size="sm" 
                  className="w-full mt-2 bg-green-600 hover:bg-green-500"
                  onClick={() => setInput('start my store workflow')}
                >
                  Start Workflow
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>


    </div>
  )
}
