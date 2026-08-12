'use client'

import { Store, Sparkles, Send, Bot, User, TrendingUp, Eye, MousePointer, DollarSign, CheckCircle, AlertCircle, Loader2, Play, Search, Package, Target, BarChart3, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StoreIntegrations } from './StoreIntegrations'
import { ShopifyConnectModal } from './ShopifyConnectModal'
import { MetaAdsConnectModal } from './MetaAdsConnectModal'
import { CJDropshippingConnectModal } from './CJDropshippingConnectModal'
import { AIProviderModal } from './AIProviderModal'
import { GitHubConnectModal } from './GitHubConnectModal'
import { VercelConnectModal } from './VercelConnectModal'
import { APIKeyPromptModal } from './APIKeyPromptModal'
import { ProductResearchResults } from './ProductResearchResults'
import { WorkflowTaskCard } from './WorkflowTaskCard'
import { TaskWorkerPanel, TaskActivity } from './TaskWorkerPanel'
import { useState, useEffect, useRef } from 'react'
import { getSupabaseClient } from '@/lib/supabase-client'
import { api } from '@/lib/api'
import { vps } from '@/lib/vps-api'
import { useStore } from './StoreLayout'
import { useRouter } from 'next/navigation'

interface StoreData {
  id: string
  name: string
  url: string
  status: string
  worker_id: string | null
}

interface StoreContentProps {
  store: StoreData
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface WorkerData {
  id: string
  ip: string
  server_id?: string
  status: 'active' | 'idle' | 'busy' | 'offline' | string
  uptime?: string
  cpu_percent?: number
  memory_percent?: number
  current_task?: string | null
  last_seen?: string
}

interface TaskResult {
  task: string
  status: 'pending' | 'queued' | 'running' | 'completed' | 'failed'
  message?: string
  timestamp: string
}

export function StoreContent({ store }: StoreContentProps) {
  const { selectedPage } = useStore()
  const [integrations, setIntegrations] = useState<Record<string, { connected: boolean; [key: string]: any }>>({
    shopify: { connected: false },
    meta_ads: { connected: false },
    cj_dropshipping: { connected: false },
    ai: { connected: false },
    github: { connected: false },
    vercel: { connected: false },
  })

  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editingCredentials, setEditingCredentials] = useState<any>(null)

  // API Key prompt modal
  const [apiKeyPrompt, setApiKeyPrompt] = useState<{ isOpen: boolean; integrationType: string }>({
    isOpen: false,
    integrationType: ''
  })

  // Chat state
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: 'Hi! I\'m your AI Agent. I can help you manage your store, analyze ads, suggest products, and more. What would you like to do?', timestamp: new Date() }
  ])
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const [isWsConnected, setIsWsConnected] = useState(false)
  const aiChatWsRef = useRef<WebSocket | null>(null)
  const [isAiChatWsConnected, setIsAiChatWsConnected] = useState(false)

  // WebSocket connection for AI chat
  useEffect(() => {
    if (selectedPage !== 'ai-agent') return
    
    let ws: WebSocket | null = null
    
    const connectWebSocket = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.access_token) return
        
        const wsUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('https', 'wss').replace('http', 'ws')}/ws/ai-chat?token=${session.access_token}`
        
        ws = new WebSocket(wsUrl)
        aiChatWsRef.current = ws
        
        ws.onopen = () => {
          console.log('[AI-Chat-WS] Connected')
          setIsAiChatWsConnected(true)
        }
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data)
          
          if (data.type === 'chunk') {
            // Streaming chunk - append to last assistant message
            setChatMessages(prev => {
              const last = prev[prev.length - 1]
              if (last.role === 'assistant') {
                return [
                  ...prev.slice(0, -1),
                  { ...last, content: last.content + data.content }
                ]
              }
              return prev
            })
          } else if (data.type === 'complete') {
            setIsTyping(false)
          } else if (data.type === 'error') {
            setIsTyping(false)
            setChatMessages(prev => [...prev, {
              id: Date.now().toString(),
              role: 'assistant',
              content: `Error: ${data.error}`,
              timestamp: new Date()
            }])
          }
        }
        
        ws.onclose = () => {
          console.log('[AI-Chat-WS] Disconnected')
          setIsAiChatWsConnected(false)
        }
        
        ws.onerror = (error) => {
          console.error('[AI-Chat-WS] Error:', error)
          setIsAiChatWsConnected(false)
        }
      } catch (error) {
        console.error('[AI-Chat-WS] Failed to connect:', error)
      }
    }
    
    connectWebSocket()
    
    return () => {
      ws?.close()
      aiChatWsRef.current = null
    }
  }, [selectedPage])

  // AI Agent - Worker state
  const [worker, setWorker] = useState<WorkerData | null>(null)
  const [workerLoading, setWorkerLoading] = useState(false)
  const [isProvisioning, setIsProvisioning] = useState(false)
  const [isReprovisioning, setIsReprovisioning] = useState(false)
  const [taskResults, setTaskResults] = useState<TaskResult[]>([])
  const [taskQueue, setTaskQueue] = useState<Array<{task: string; payload?: Record<string, unknown>; id: string}>>([])
  const [currentTask, setCurrentTask] = useState<string | null>(null)
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [researchResults, setResearchResults] = useState<any[]>([])
  // Per-task activities - each task has its own activity log
  const [taskActivities, setTaskActivities] = useState<Record<string, TaskActivity[]>>({})
  const [wsConnected, setWsConnected] = useState(false)
  const workerWsRef = useRef<WebSocket | null>(null)
  const router = useRouter()
  
  // Connect to OpenClaw Gateway via WebSocket (proxied through backend)
  useEffect(() => {
    if (!worker?.id) return
    
    let ws: WebSocket | null = null
    
    const connectWebSocket = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()
        const token = session?.access_token
        
        if (!token) {
          console.error('[WebSocket] No auth token available')
          return
        }
        
        const wsUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('https://', 'wss://').replace('http://', 'ws://')}/ws/worker/${worker.id}?token=${encodeURIComponent(token)}`
        console.log('[WebSocket] Connecting...')
        
        ws = new WebSocket(wsUrl)
        workerWsRef.current = ws
        
        ws.onopen = () => {
          console.log('[WebSocket] Connected')
          setWsConnected(true)
        }
        
        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data)
          console.log('[WebSocket] Message:', msg.type)
          
          if (msg.type === 'chat_response') {
            setChatMessages(prev => [...prev, {
              id: Date.now().toString(),
              role: 'assistant',
              content: msg.content,
              timestamp: new Date()
            }])
            setIsTyping(false)
          }
        }
        
        ws.onerror = (error) => {
          console.error('[WebSocket] Error:', error)
          setWsConnected(false)
        }
        
        ws.onclose = (event) => {
          console.log('[WebSocket] Closed:', event.code)
          setWsConnected(false)
        }
      } catch (error) {
        console.error('[WebSocket] Setup error:', error)
      }
    }
    
    connectWebSocket()
    
    return () => {
      ws?.close()
    }
  }, [worker?.id])
  
  // Add activity to a specific task
  const addTaskActivity = (taskName: string, type: TaskActivity['type'], message: string, details?: any) => {
    const activity: TaskActivity = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      type,
      message,
      details
    }
    setTaskActivities(prev => ({
      ...prev,
      [taskName]: [...(prev[taskName] || []), activity]
    }))
  }
  
  // Clear activities for a specific task
  const clearTaskActivities = (taskName: string) => {
    setTaskActivities(prev => ({ ...prev, [taskName]: [] }))
  }
  
  // Stop a running task
  const stopTask = async (taskName: string) => {
    addTaskActivity(taskName, 'system', '⏹️ Stopping task...')
    // TODO: Call backend to cancel the task
    setCurrentTask(null)
    setTaskQueue(prev => prev.filter(t => t.task !== taskName))
    setTaskResults(prev => [
      { task: taskName, status: 'failed', message: 'Stopped by user', timestamp: new Date().toISOString() },
      ...prev.filter(t => t.task !== taskName)
    ])
  }
  
  // Send message to worker for a specific task
  const sendTaskMessage = (taskName: string, message: string) => {
    addTaskActivity(taskName, 'user', message)
    // Simulate AI response
    setTimeout(() => {
      addTaskActivity(taskName, 'ai', `Received: "${message}". I'm working on ${taskName.replace(/_/g, ' ')}...`)
    }, 500)
  }
  
  // Check environment on mount
  useEffect(() => {
    const checkEnv = async () => {
      console.log('🔍 Environment:', {
        'OpenRouter API Key': !!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
        'Supabase URL': !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        'Backend API': !!process.env.NEXT_PUBLIC_API_URL,
      })
    }
    checkEnv()
  }, [])
  
  // Process task queue sequentially
  useEffect(() => {
    if (!worker || taskQueue.length === 0 || currentTask) return
    
    const processNextTask = async () => {
      const nextTask = taskQueue[0]
      setCurrentTask(nextTask.task)
      
      // Clear previous activities for this task
      clearTaskActivities(nextTask.task)
      
      // Add initial activity
      addTaskActivity(nextTask.task, 'system', `Initializing ${nextTask.task.replace(/_/g, ' ')} workflow...`)
      
      // Update task status
      setTaskResults(prev => [
        { task: nextTask.task, status: 'running', message: 'Task is running...', timestamp: new Date().toISOString() },
        ...prev.filter(t => t.task !== nextTask.task)
      ])
      
      try {
        addTaskActivity(nextTask.task, 'system', `Starting ${nextTask.task.replace(/_/g, ' ')}...`)
        
        // Call the backend to execute the task
        const result = await executeTask(nextTask.task, nextTask.payload)
        
        if (result?.success) {
          // Check if this is a background task that will complete later
          if (result.status === 'running' || result.status === 'queued') {
            addTaskActivity(nextTask.task, 'system', `Task is now running on the worker. This may take 5-10 minutes.`)
            setTaskResults(prev => [
              { task: nextTask.task, status: 'running', message: 'Running on worker (check back in 5-10 min)', timestamp: new Date().toISOString() },
              ...prev.filter(t => t.task !== nextTask.task)
            ])
          } else {
            addTaskActivity(nextTask.task, 'result', `Workflow completed successfully`)
            setTaskResults(prev => [
              { task: nextTask.task, status: 'completed', message: 'Completed', timestamp: new Date().toISOString() },
              ...prev.filter(t => t.task !== nextTask.task)
            ])
            setCompletedTasks(prev => new Set(prev).add(nextTask.task))
          }
        } else {
          addTaskActivity(nextTask.task, 'error', `Task failed: ${result?.error || 'Unknown error'}`)
          setTaskResults(prev => [
            { task: nextTask.task, status: 'failed', message: result?.error || 'Failed', timestamp: new Date().toISOString() },
            ...prev.filter(t => t.task !== nextTask.task)
          ])
        }
      } catch (err: any) {
        addTaskActivity(nextTask.task, 'error', `Exception: ${err.message}`)
        setTaskResults(prev => [
          { task: nextTask.task, status: 'failed', message: err.message, timestamp: new Date().toISOString() },
          ...prev.filter(t => t.task !== nextTask.task)
        ])
      } finally {
        setCurrentTask(null)
        setTaskQueue(prev => prev.slice(1)) // Remove completed task from queue
      }
    }
    
    processNextTask()
  }, [taskQueue, currentTask, worker])
  
  // Poll for task completion from worker
  useEffect(() => {
    if (!worker) return
    
    const pollTaskStatus = async () => {
      try {
        const { data: { session } } = await getSupabaseClient().auth.getSession()
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workers/${worker.id}/tasks`, {
          headers: session ? { 'Authorization': `Bearer ${session.access_token}` } : {}
        })
        
        if (res.ok) {
          const data = await res.json()
          
          // Update research results
          if (data.research_results?.length > 0) {
            setResearchResults(data.research_results)
            
            // Check if any running tasks are now completed based on research results
            data.research_results.forEach((result: any) => {
              if (result.status === 'completed') {
                // Update task status from running to completed
                setTaskResults(prev => {
                  const existing = prev.find(t => t.task === 'product_research' && t.status === 'running')
                  if (existing) {
                    return [
                      { task: 'product_research', status: 'completed', message: `Found ${result.products_found} products`, timestamp: new Date().toISOString() },
                      ...prev.filter(t => !(t.task === 'product_research' && t.status === 'running'))
                    ]
                  }
                  return prev
                })
              }
            })
          }
          
          if (data.tasks?.length > 0) {
            // Log completed tasks
            data.tasks
              .filter((t: any) => t.status === 'completed' || t.status === 'failed')
              .forEach(async (task: any) => {
                console.log(
                  task.status === 'completed' ? 'success' : 'error',
                  `Worker task ${task.status}: ${task.task_type}`,
                  task.task_type,
                  { task_id: task.id, result: task.result, error: task.error }
                )
              })
          }
        }
      } catch (err) {
        console.error('Failed to poll task status:', err)
      }
    }
    
    const interval = setInterval(pollTaskStatus, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [worker])
  
  // Add message to AI chat log
  const addToChatLog = (role: 'user' | 'assistant', content: string) => {
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    }])
  }
  
  // Check if task is in queue or running
  const isTaskQueuedOrRunning = (taskName: string) => {
    return currentTask === taskName || taskQueue.some(t => t.task === taskName)
  }
  
  // Get queue position for a task
  const getQueuePosition = (taskName: string) => {
    if (currentTask === taskName) return 0
    const index = taskQueue.findIndex(t => t.task === taskName)
    return index >= 0 ? index + 1 : -1
  }

  useEffect(() => {
    loadIntegrations()
  }, [store.id])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Poll worker data when on AI Agent page
  useEffect(() => {
    if (selectedPage !== 'ai-agent') return

    let cancelled = false

    async function fetchWorkerData() {
      try {
        setWorkerLoading(true)
        // Try to get worker from backend API
        const { data: { session } } = await getSupabaseClient().auth.getSession()
        const cacheBuster = `?_t=${Date.now()}`
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workers${cacheBuster}`, {
          headers: session ? { 'Authorization': `Bearer ${session.access_token}` } : {},
          cache: 'no-store'
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (!cancelled) {
          const newWorker = data.worker || null
          
          // Log worker state changes
          if (newWorker && !worker) {
            console.log('success', `Worker connected`, undefined, { 
              worker_id: newWorker.id,
              ip: newWorker.ip,
              status: newWorker.status 
            })
          } else if (!newWorker && worker) {
            console.log('warning', `Worker disconnected`, undefined, { 
              worker_id: worker.id 
            })
          } else if (newWorker && worker && newWorker.status !== worker.status) {
            console.log('info', `Worker status changed: ${worker.status} → ${newWorker.status}`, undefined, {
              worker_id: newWorker.id,
              previous_status: worker.status,
              current_status: newWorker.status
            })
          }
          
          setWorker(newWorker)
          if (data.recent_tasks) {
            setTaskResults(data.recent_tasks)
          }
        }
      } catch (err) {
        console.error('Failed to fetch worker data:', err)
        console.log('error', `Failed to fetch worker data: ${err}`)
      } finally {
        if (!cancelled) setWorkerLoading(false)
      }
    }

    fetchWorkerData()
    const interval = setInterval(fetchWorkerData, 10000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [selectedPage, store.id])

  async function loadIntegrations() {
    // Happy Puppy store - show all as connected with real credentials
    if (store.id === '000fdf9a-74b4-4069-b441-2a000b4f3b08' || store.name === 'Happy Puppy Supply') {
      setIntegrations({
        shopify: { connected: true, store: 'Happy Puppy Supply' },
        meta_ads: { connected: true, account: 'act_123456789' },
        cj_dropshipping: { connected: true, apiKey: 'CJ5604***' },
        ai: { connected: true, provider: 'OpenRouter', model: 'Kimi K2.5' },
        github: { connected: true, user: 'happypuppy-dev' },
        vercel: { connected: true, team: 'happypuppy' },
      })
      return
    }

    // Demo store - show all as connected (mock)
    if (store.id === 'demo') {
      setIntegrations({
        shopify: { connected: true },
        meta_ads: { connected: true },
        cj_dropshipping: { connected: true },
        ai: { connected: true },
        github: { connected: true },
        vercel: { connected: true },
      })
      return
    }

    // Try API first
    try {
      const credsFromApi = await api.stores.getCredentials(store.id)
      if (credsFromApi) {
        setIntegrations({
          shopify: { connected: !!credsFromApi.find((c: any) => c.type === 'shopify') },
          meta_ads: { connected: !!credsFromApi.find((c: any) => c.type === 'meta_ads') },
          cj_dropshipping: { connected: !!credsFromApi.find((c: any) => c.type === 'cj_dropshipping') },
          ai: { connected: !!credsFromApi.find((c: any) => c.type === 'ai') },
          github: { connected: !!credsFromApi.find((c: any) => c.type === 'github') },
          vercel: { connected: !!credsFromApi.find((c: any) => c.type === 'vercel') },
        })
        return
      }
    } catch (apiError) {
      console.log('API credentials fetch failed, falling back to Supabase:', apiError)
    }

    // Fallback to Supabase
    try {
      const supabase = getSupabaseClient()
      const { data: creds } = await supabase
        .from('store_credentials')
        .select('*')
        .eq('store_id', store.id)

      const { data: aiConfig } = await supabase
        .from('ai_configs')
        .select('*')
        .single()

      const { data: githubConfig } = await supabase
        .from('user_credentials')
        .select('*')
        .eq('type', 'github')
        .single()

      const { data: vercelConfig } = await supabase
        .from('user_credentials')
        .select('*')
        .eq('type', 'vercel')
        .single()

      const shopifyCreds = creds?.find((c: any) => c.type === 'shopify')
      const metaCreds = creds?.find((c: any) => c.type === 'meta_ads')
      const cjCreds = creds?.find((c: any) => c.type === 'cj_dropshipping')

      setIntegrations({
        shopify: { connected: !!shopifyCreds },
        meta_ads: { connected: !!metaCreds },
        cj_dropshipping: { connected: !!cjCreds },
        ai: { connected: !!aiConfig },
        github: { connected: !!githubConfig },
        vercel: { connected: !!vercelConfig },
      })
    } catch (error) {
      console.error('Failed to load integrations:', error)
    }
  }

  const handleEdit = (type: string, credentials: any) => {
    setModalMode('edit')
    setEditingCredentials(credentials)
    setActiveModal(type)
  }

  const handleConnect = (type: string) => {
    setModalMode('create')
    setEditingCredentials(null)
    setActiveModal(type)
  }

  const handleModalClose = () => {
    setActiveModal(null)
    setModalMode('create')
    setEditingCredentials(null)
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')
    setIsTyping(true)

    // Send via WebSocket if connected
    if (aiChatWsRef.current && aiChatWsRef.current.readyState === WebSocket.OPEN) {
      console.log('[AI-Chat-WS] Sending message')
      
      // Add empty assistant message for streaming
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }])
      
      aiChatWsRef.current.send(JSON.stringify({
        type: 'chat',
        content: chatInput,
        conversation_history: chatMessages.map(m => ({ role: m.role, content: m.content }))
      }))
      return
    }

    // Fallback: Call OpenRouter API directly from frontend
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ''}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'ShoppDropp AI Agent'
        },
        body: JSON.stringify({
          model: 'openrouter/moonshotai/kimi-k2.5',
          messages: [
            { role: 'system', content: 'You are an AI assistant for ShoppDropp, a dropshipping automation platform. Help users with their Shopify store, Meta Ads, CJ Dropshipping, and VPS worker tasks. Be concise and helpful.' },
            ...chatMessages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: chatInput }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`)
      }

      const data = await response.json()
      const aiContent = data.choices?.[0]?.message?.content || 'I apologize, but I could not process your request.'

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date()
      }

      setChatMessages(prev => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('OpenRouter API error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error connecting to the AI service. Please check your OpenRouter API key configuration.',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // Check if required API keys are configured for a task
  const checkRequiredAPIKeys = (taskName: string): { required: boolean; missingIntegration?: string; missingName?: string } => {
    const taskRequirements: Record<string, { integrations: string[]; description: string }> = {
      'product_research': { integrations: ['ai'], description: 'Requires OpenRouter API key for AI-powered product analysis' },
      'catalog_sync': { integrations: ['ai', 'shopify'], description: 'Requires AI provider and Shopify store connection' },
      'price_optimization': { integrations: ['ai', 'shopify'], description: 'Requires AI provider and Shopify store connection' },
      'inventory_check': { integrations: ['ai', 'shopify'], description: 'Requires AI provider and Shopify store connection' },
      'meta_ads_create': { integrations: ['ai', 'meta_ads'], description: 'Requires AI provider and Meta Ads connection' },
      'content_generation': { integrations: ['ai'], description: 'Requires OpenRouter API key for AI content generation' },
      'performance_report': { integrations: ['ai'], description: 'Requires OpenRouter API key for AI report generation' },
    }

    const config = taskRequirements[taskName] || { integrations: ['ai'], description: 'Requires AI provider' }

    for (const integration of config.integrations) {
      if (!integrations[integration]?.connected) {
        const integrationNames: Record<string, string> = {
          'ai': 'AI Provider',
          'shopify': 'Shopify',
          'meta_ads': 'Meta Ads',
        }
        return { required: false, missingIntegration: integration, missingName: integrationNames[integration] || integration }
      }
    }
    return { required: true }
  }

  // Execute task directly (used by queue processor)
  const executeTask = async (taskName: string, payload?: Record<string, unknown>) => {
    try {
      const { data: { session } } = await getSupabaseClient().auth.getSession()
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai-chat/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session && { 'Authorization': `Bearer ${session.access_token}` })
        },
        body: JSON.stringify({ task: taskName, store_id: store.id, ...payload }),
      })
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${res.status}`)
      }
      const data = await res.json()
      setTaskResults(prev => [
        { task: taskName, status: data.status || 'queued', message: data.message, timestamp: new Date().toISOString() },
        ...prev.filter(t => !(t.task === taskName && t.status === 'running'))
      ])
      return { success: true, ...data }
    } catch (err: any) {
      return { success: false, error: err.message }
    }
  }

  // Add task to queue
  const runTask = async (taskName: string, payload?: Record<string, unknown>) => {
    // Check API keys first with specific error message
    const apiCheck = checkRequiredAPIKeys(taskName)
    if (!apiCheck.required) {
      const missingName = apiCheck.missingName || apiCheck.missingIntegration
      console.log('warning', `Cannot run ${taskName.replace(/_/g, ' ')}: ${missingName} not configured`, taskName, { 
        required: apiCheck.missingIntegration,
        suggestion: `Please configure ${missingName} in settings`
      })
      setApiKeyPrompt({ isOpen: true, integrationType: apiCheck.missingIntegration! })
      return
    }
    
    // Check if task is already in queue or running
    if (isTaskQueuedOrRunning(taskName)) {
      console.log('warning', `Task already ${currentTask === taskName ? 'running' : 'in queue'}`, taskName)
      return
    }
    
    // Add to queue
    const queueItem = { task: taskName, payload, id: Date.now().toString() }
    setTaskQueue(prev => [...prev, queueItem])
    
    const position = taskQueue.length + 1
    console.log('info', `Added to queue (position ${position})`, taskName)
    
    // Update UI
    setTaskResults(prev => [
      { task: taskName, status: 'queued', message: `Position ${position} in queue`, timestamp: new Date().toISOString() },
      ...prev.filter(t => t.task !== taskName)
    ])
  }

  const handleRestartWorker = async () => {
    await runTask('restart_worker')
  }

  const handleStopWorker = async () => {
    await runTask('stop_worker')
  }
  
  // Run full workflow - queue all tasks
  const handleRunFullWorkflow = async () => {
    if (!worker) {
      console.log('warning', 'Cannot start workflow: No VPS worker configured')
      return
    }
    
    const workflowTasks = ['product_research', 'catalog_sync', 'price_optimization', 'performance_report']
    
    console.log('info', '🚀 Starting full workflow', undefined, { tasks: workflowTasks })
    
    for (const taskName of workflowTasks) {
      await runTask(taskName)
    }
  }

  const handleProvisionVPS = async () => {
    try {
      setIsProvisioning(true)
      setTaskResults(prev => [{ task: 'vps_provision', status: 'running', message: 'Creating and provisioning VPS...', timestamp: new Date().toISOString() }, ...prev])

      console.log('[VPS] Starting provision for store:', store.id)
      console.log('[VPS] API URL:', process.env.NEXT_PUBLIC_API_URL)

      // Call the real VPS provisioning API
      const response = await vps.provision.createAndProvision(store.id)

      console.log('[VPS] Provision response:', response)

      setTaskResults(prev => [{ task: 'vps_provision', status: 'completed', message: `VPS Worker created: ${response.workerId || 'New Worker'}`, timestamp: new Date().toISOString() }, ...prev])

      // Navigate to provision progress page to watch the build
      router.push(`/app/provision?workerId=${response.workerId}`)
    } catch (error: any) {
      console.error('[VPS] Failed to provision:', error)
      setTaskResults(prev => [{ task: 'vps_provision', status: 'failed', message: error.message || 'Provisioning failed', timestamp: new Date().toISOString() }, ...prev])
      alert('Failed to provision VPS: ' + (error.message || 'Unknown error'))
    } finally {
      setIsProvisioning(false)
    }
  }

  const handleReprovisionVPS = async () => {
    if (!worker?.id) {
      alert('No worker to reprovision')
      return
    }
    
    if (!confirm('This will destroy the current VPS and create a new one. Continue?')) {
      return
    }
    
    try {
      setIsReprovisioning(true)
      setTaskResults(prev => [{ task: 'vps_reprovision', status: 'running', message: 'Reprovisioning VPS...', timestamp: new Date().toISOString() }, ...prev])
      
      // Call the reprovision API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workers/${worker.id}/reprovision`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await getSupabaseClient().auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Reprovision API failed')
      }
      
      const result = await response.json()
      console.log('[VPS] Reprovision response:', result)
      
      setTaskResults(prev => [{ task: 'vps_reprovision', status: 'completed', message: 'Reprovision started', timestamp: new Date().toISOString() }, ...prev])
      
      // Navigate to provision progress page to watch the build
      router.push(`/app/provision?workerId=${worker.id}`)
    } catch (error: any) {
      console.error('[VPS] Failed to reprovision:', error)
      setTaskResults(prev => [{ task: 'vps_reprovision', status: 'failed', message: error.message || 'Reprovisioning failed', timestamp: new Date().toISOString() }, ...prev])
      alert('Failed to reprovision VPS: ' + (error.message || 'Unknown error'))
    } finally {
      setIsReprovisioning(false)
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'busy': return 'bg-amber-500'
      case 'idle': return 'bg-blue-500'
      default: return 'bg-slate-500'
    }
  }

  const getStatusTextColor = (status?: string) => {
    switch (status) {
      case 'active': return 'text-green-400'
      case 'busy': return 'text-amber-400'
      case 'idle': return 'text-blue-400'
      default: return 'text-slate-400'
    }
  }

  // Render specific page content
  const renderContent = () => {
    switch (selectedPage) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Demo Banner */}
            {store.id === 'demo' && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/30 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-violet-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Demo Store</h3>
                    <p className="text-sm text-slate-400">
                      This is a demo showing all features. Connect a real store to use actual integrations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Store Header */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-violet-500/20 rounded-xl flex items-center justify-center">
                <Store className="w-8 h-8 text-violet-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{store.name}</h1>
                <a href={store.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-violet-400">
                  {store.url}
                </a>
              </div>
            </div>

            {/* Integration Cards */}
            <StoreIntegrations
              storeId={store.id}
              integrations={integrations}
              onConnectShopify={() => handleConnect('shopify')}
              onConnectMeta={() => handleConnect('meta')}
              onConnectCJ={() => handleConnect('cj')}
              onConfigureAI={() => handleConnect('ai')}
              onConnectGitHub={() => handleConnect('github')}
              onConnectVercel={() => handleConnect('vercel')}
              onEditShopify={(creds) => handleEdit('shopify', creds)}
              onEditMeta={(creds) => handleEdit('meta', creds)}
              onEditCJ={(creds) => handleEdit('cj', creds)}
              onEditAI={(creds) => handleEdit('ai', creds)}
              onEditGitHub={(creds) => handleEdit('github', creds)}
              onEditVercel={(creds) => handleEdit('vercel', creds)}
            />

            {/* Meta Ads Performance Section */}
            {integrations.meta_ads.connected && (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Meta Ads Performance
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* AI Queued Ads */}
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-white flex items-center gap-2">
                        <Bot className="w-4 h-4 text-blue-400" />
                        AI Queued Ads
                      </h3>
                      <span className="px-2 py-1 rounded-full bg-blue-500/30 text-blue-300 text-xs">3 Pending</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 rounded-lg bg-white/5 flex items-center justify-between">
                        <span className="text-sm text-slate-300">Summer Collection Promo</span>
                        <span className="text-xs text-slate-500">Created 2h ago</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 flex items-center justify-between">
                        <span className="text-sm text-slate-300">Flash Sale Retargeting</span>
                        <span className="text-xs text-slate-500">Created 5h ago</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white/5 flex items-center justify-between">
                        <span className="text-sm text-slate-300">Abandoned Cart Recovery</span>
                        <span className="text-xs text-slate-500">Created 8h ago</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-blue-600/50 hover:bg-blue-600">
                      Review & Launch
                    </Button>
                  </div>

                  {/* Current Performance */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      Current Performance
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">Impressions</span>
                        </div>
                        <span className="text-white font-medium">47.2K</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                          <MousePointer className="w-4 h-4" />
                          <span className="text-sm">CTR</span>
                        </div>
                        <span className="text-green-400 font-medium">3.8% ↑</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm">ROAS</span>
                        </div>
                        <span className="text-green-400 font-medium">4.2x ↑</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">Spend</span>
                        </div>
                        <span className="text-white font-medium">$1,247</span>
                      </div>
                    </div>
                  </div>

                  {/* Actionable Items */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <h3 className="font-medium text-white mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      Actionable Items
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">Increase budget on "Summer Sale" campaign (+23% ROAS)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">Pause underperforming ad set (0.8% CTR)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300">Test new creative for retargeting audience</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-amber-600/50 hover:bg-amber-600">
                      Apply Suggestions
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      case 'ai-agent':
        return (
          <div className="h-full flex gap-6">
            {/* Chat Box - Large Left */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">AI Agent</h1>
                <div className="flex items-center gap-2">
                  {workerLoading ? (
                    <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                  ) : (
                    <div className={`w-2 h-2 rounded-full animate-pulse ${getStatusColor(worker?.status)}`} />
                  )}
                  <span className={`text-sm ${getStatusTextColor(worker?.status)}`}>
                    {worker ? `Worker ${worker.status?.toUpperCase() || 'Unknown'}` : 'No Worker'}
                  </span>
                </div>
              </div>
              <div className="p-4 border-b border-white/10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">AI Agent Chat</h3>
                  <p className="text-xs text-slate-500">Always here to help</p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20 rounded-lg">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' ? 'bg-violet-500/20' : 'bg-blue-500/20'
                    }`}>
                      {message.role === 'user' ? <User className="w-4 h-4 text-violet-400" /> : <Bot className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-violet-500/20 text-white'
                        : 'bg-white/10 text-slate-300'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="bg-white/10 p-3 rounded-lg text-sm text-slate-400 flex items-center gap-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2 max-w-3xl mx-auto">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask anything..."
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    className="bg-violet-600 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Worker Status & Workflow - Small Right */}
            <div className="w-80 space-y-6 overflow-y-auto border-l border-white/10 pl-6">
              {/* Worker Status Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">
                      {workerLoading ? (
                        <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Loading...</span>
                      ) : worker ? (
                        `Worker #${worker.id}`
                      ) : (
                        'No Worker'
                      )}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {worker?.server_id ? worker.server_id : 'Hetzner CX21'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mb-3">
                  <span>IP: {worker?.ip || '-'}</span>
                  <span>Uptime: {worker?.uptime || '-'}</span>
                  {worker?.cpu_percent !== undefined && (
                    <span>CPU: {worker.cpu_percent}%</span>
                  )}
                  {worker?.memory_percent !== undefined && (
                    <span>RAM: {worker.memory_percent}%</span>
                  )}
                  <span className={wsConnected ? 'text-green-400' : 'text-amber-400'}>
                    {wsConnected ? '● OpenClaw' : '○ Disconnected'}
                  </span>
                </div>
                {worker?.current_task && (
                  <div className="mb-3 text-xs text-amber-400">
                    Task: {worker.current_task}
                  </div>
                )}
                <div className="flex gap-2">
                  {worker ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white text-xs px-2"
                        onClick={handleRestartWorker}
                        disabled={isTaskQueuedOrRunning('restart_worker')}
                      >
                        {isTaskQueuedOrRunning('restart_worker') ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Restart'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-amber-500/50 text-amber-400 text-xs px-2"
                        onClick={handleReprovisionVPS}
                        disabled={isReprovisioning}
                      >
                        {isReprovisioning ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Reprovision'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/50 text-red-400 text-xs px-2"
                        onClick={handleStopWorker}
                        disabled={isTaskQueuedOrRunning('stop_worker')}
                      >
                        {isTaskQueuedOrRunning('stop_worker') ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Stop'}
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-violet-600 to-pink-600 text-xs"
                      onClick={handleProvisionVPS}
                      disabled={isProvisioning}
                    >
                      {isProvisioning ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                      {isProvisioning ? 'Provisioning...' : 'Setup'}
                    </Button>
                  )}
                </div>
              </div>

              {/* AI Workflow Pipeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">AI Workflow</h2>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-violet-600 to-pink-600 text-xs px-2"
                    onClick={handleRunFullWorkflow}
                    disabled={!worker || taskQueue.length > 0}
                  >
                    {currentTask ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                    Run All
                  </Button>
                </div>
                
                {/* Queue Status */}
                {(taskQueue.length > 0 || currentTask) && (
                  <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                    <div className="flex items-center gap-2 text-xs text-violet-300">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>
                        {currentTask ? currentTask.replace(/_/g, ' ') : 'Processing...'}
                        {taskQueue.length > 0 && ` (${taskQueue.length})`}
                      </span>
                    </div>
                  </div>
                )}

                {!worker && (
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-xs text-amber-400">Setup worker first</p>
                  </div>
                )}

                <div className="space-y-3">
                  {[
                    { id: 'product_research', title: 'Research', desc: 'AI analyzes trending products', status: taskResults.find(t => t.task === 'product_research')?.status || 'waiting', icon: Search, color: 'blue' },
                    { id: 'catalog_sync', title: 'Catalog', desc: 'Sync products to Shopify', status: taskResults.find(t => t.task === 'catalog_sync')?.status || 'waiting', icon: Package, color: 'green' },
                    { id: 'price_optimization', title: 'Pricing', desc: 'AI-powered pricing', status: taskResults.find(t => t.task === 'price_optimization')?.status || 'waiting', icon: Target, color: 'orange' },
                    { id: 'performance_report', title: 'Report', desc: 'Track ROAS metrics', status: taskResults.find(t => t.task === 'performance_report')?.status || 'waiting', icon: BarChart3, color: 'pink' },
                  ].map((step) => (
                    <div key={step.id}>
                      <WorkflowTaskCard
                        id={step.id}
                        title={step.title}
                        description={step.desc}
                        status={step.status as any}
                        icon={<step.icon className={`w-4 h-4 text-${step.color}-400`} />}
                        color={step.color}
                        onRun={() => runTask(step.id)}
                        disabled={!worker || isTaskQueuedOrRunning(step.id)}
                        queuePosition={getQueuePosition(step.id)}
                        lastResult={taskResults.find(t => t.task === step.id)?.message}
                      />
                      {/* Per-Task Worker Console */}
                      <TaskWorkerPanel
                        taskId={step.id}
                        taskName={step.title}
                        status={step.status as any}
                        activities={taskActivities[step.id] || []}
                        isActive={currentTask === step.id}
                        onStop={() => stopTask(step.id)}
                        onSendMessage={(msg) => sendTaskMessage(step.id, msg)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Task Results Summary */}
              <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                <h4 className="font-medium text-white mb-2 text-sm">Results</h4>
                {taskResults.length === 0 ? (
                  <p className="text-xs text-slate-500">No recent tasks.</p>
                ) : (
                  <div className="space-y-1 text-xs">
                    {taskResults.slice(0, 5).map((t, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-400">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          t.status === 'completed' ? 'bg-green-500' :
                          t.status === 'running' ? 'bg-blue-500' :
                          t.status === 'failed' ? 'bg-red-500' :
                          'bg-violet-500'
                        }`} />
                        <span className="capitalize truncate flex-1">{t.task.replace(/_/g, ' ')}</span>
                        <span className={`${
                          t.status === 'completed' ? 'text-green-400' :
                          t.status === 'failed' ? 'text-red-400' :
                          'text-slate-500'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 'integrations':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Integrations</h1>
                <p className="text-slate-400">Connect your store to external services</p>
              </div>
              <Badge className="bg-green-500/20 text-green-400">
                {Object.values(integrations).filter(i => i.connected).length} of {Object.keys(integrations).length} Connected
              </Badge>
            </div>
            <StoreIntegrations
              storeId={store.id}
              integrations={integrations}
              onConnectShopify={() => handleConnect('shopify')}
              onConnectMeta={() => handleConnect('meta')}
              onConnectCJ={() => handleConnect('cj')}
              onConfigureAI={() => handleConnect('ai')}
              onConnectGitHub={() => handleConnect('github')}
              onConnectVercel={() => handleConnect('vercel')}
              onEditShopify={(creds) => handleEdit('shopify', creds)}
              onEditMeta={(creds) => handleEdit('meta', creds)}
              onEditCJ={(creds) => handleEdit('cj', creds)}
              onEditAI={(creds) => handleEdit('ai', creds)}
              onEditGitHub={(creds) => handleEdit('github', creds)}
              onEditVercel={(creds) => handleEdit('vercel', creds)}
            />
          </div>
        )

      case 'settings':
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Store Settings</h1>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-slate-400">Store settings coming soon...</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      {renderContent()}

      {/* Modals */}
      {activeModal === 'shopify' && (
        <ShopifyConnectModal
          storeId={store.id}
          mode={modalMode}
          existingCredentials={editingCredentials}
          onClose={handleModalClose}
          onConnected={loadIntegrations}
        />
      )}
      {activeModal === 'meta' && (
        <MetaAdsConnectModal
          storeId={store.id}
          mode={modalMode}
          existingCredentials={editingCredentials}
          onClose={handleModalClose}
          onConnected={loadIntegrations}
        />
      )}
      {activeModal === 'cj' && (
        <CJDropshippingConnectModal
          storeId={store.id}
          mode={modalMode}
          existingCredentials={editingCredentials}
          onClose={handleModalClose}
          onConnected={loadIntegrations}
        />
      )}
      {activeModal === 'ai' && (
        <AIProviderModal
          mode={modalMode}
          existingCredentials={editingCredentials}
          onClose={handleModalClose}
          onConfigured={loadIntegrations}
        />
      )}
      {activeModal === 'github' && (
        <GitHubConnectModal
          mode={modalMode}
          existingCredentials={editingCredentials}
          onClose={handleModalClose}
          onConnected={loadIntegrations}
        />
      )}
      {activeModal === 'vercel' && (
        <VercelConnectModal
          mode={modalMode}
          existingCredentials={editingCredentials}
          onClose={handleModalClose} 
          onConnected={loadIntegrations} 
        />
      )}
      
      {/* API Key Prompt Modal */}
      <APIKeyPromptModal
        isOpen={apiKeyPrompt.isOpen}
        integrationType={apiKeyPrompt.integrationType}
        onClose={() => setApiKeyPrompt({ isOpen: false, integrationType: '' })}
        onConfigure={() => {
          setApiKeyPrompt({ isOpen: false, integrationType: '' })
          // Map integration type to modal
          const modalMap: Record<string, string> = {
            'ai': 'ai',
            'shopify': 'shopify',
            'meta_ads': 'meta',
            'cj_dropshipping': 'cj',
            'github': 'github',
            'vercel': 'vercel'
          }
          const modalType = modalMap[apiKeyPrompt.integrationType]
          if (modalType) {
            setActiveModal(modalType)
          }
        }}
      />
    </div>
  )
}
