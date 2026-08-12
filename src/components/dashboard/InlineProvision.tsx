'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, CheckCircle, XCircle, Server, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSupabaseClient } from '@/lib/supabase-client'

interface ProvisionStep {
  id: string
  label: string
  status: 'pending' | 'running' | 'completed' | 'error'
  message?: string
  timestamp?: string
}

interface InlineProvisionProps {
  workerId: string
  onComplete?: (ip: string) => void
  onError?: (error: string) => void
}

export function InlineProvision({ workerId, onComplete, onError }: InlineProvisionProps) {
  const [steps, setSteps] = useState<ProvisionStep[]>([
    { id: 'init', label: 'Initialize', status: 'pending' },
    { id: 'destroy', label: 'Destroy Old VPS', status: 'pending' },
    { id: 'ssh_key', label: 'Upload SSH Key', status: 'pending' },
    { id: 'create', label: 'Create Server', status: 'pending' },
    { id: 'wait', label: 'Wait for Ready', status: 'pending' },
    { id: 'ssh', label: 'Connect via SSH', status: 'pending' },
    { id: 'install', label: 'Install OpenClaw', status: 'pending' },
    { id: 'verify', label: 'Verify Health', status: 'pending' },
    { id: 'ready', label: 'Worker Ready', status: 'pending' },
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [serverInfo, setServerInfo] = useState<{ip?: string, id?: string}>({})
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(`[Provision] ${message}`)
    setLogs(prev => [...prev.slice(-20), `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const updateStep = useCallback((stepId: string, status: ProvisionStep['status'], message?: string) => {
    addLog(`${stepId}: ${status}${message ? ` - ${message}` : ''}`)
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, message, timestamp: new Date().toISOString() }
        : step
    ))
  }, [])

  useEffect(() => {
    if (!workerId) {
      setError('No worker ID provided')
      setIsLoading(false)
      return
    }

    let pollInterval: NodeJS.Timeout
    let attempts = 0
    const maxAttempts = 120 // 10 minutes (5 second intervals)

    const pollProvisionStatus = async () => {
      try {
        const supabase = getSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.access_token) {
          throw new Error('Authentication required')
        }

        addLog(`Polling provision status (attempt ${attempts + 1}/${maxAttempts})`)

        // Call provision status API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/provision/status/${workerId}?_t=${Date.now()}`,
          { headers: { 'Authorization': `Bearer ${session.access_token}` } }
        )

        if (!response.ok) {
          addLog(`Status API error: ${response.status}`)
          attempts++
          if (attempts >= maxAttempts) {
            throw new Error('Provisioning timeout - max attempts reached')
          }
          return
        }

        const data = await response.json()
        addLog(`Status: ${data.status}, Steps: ${data.steps?.length || 0}`)

        // Update steps based on backend logs
        if (data.steps && data.steps.length > 0) {
          data.steps.forEach((step: any) => {
            const stepName = step.name?.toLowerCase() || ''
            const stepStatus = step.progress >= 100 ? 'completed' : 'running'
            
            if (stepName.includes('init')) {
              updateStep('init', stepStatus, step.message)
            } else if (stepName.includes('destroy')) {
              updateStep('destroy', stepStatus, step.message)
            } else if (stepName.includes('ssh') && stepName.includes('key')) {
              updateStep('ssh_key', stepStatus, step.message)
            } else if (stepName.includes('create')) {
              updateStep('create', stepStatus, step.message)
              if (stepStatus === 'completed' && data.serverId) {
                setServerInfo(prev => ({ ...prev, id: data.serverId }))
              }
            } else if (stepName.includes('wait')) {
              updateStep('wait', stepStatus, step.message)
            } else if (stepName.includes('ssh') && !stepName.includes('key')) {
              updateStep('ssh', stepStatus, step.message)
            } else if (stepName.includes('install') || stepName.includes('openclaw')) {
              updateStep('install', stepStatus, step.message)
            } else if (stepName.includes('verify') || stepName.includes('health')) {
              updateStep('verify', stepStatus, step.message)
            } else if (stepName.includes('ready')) {
              updateStep('ready', stepStatus, step.message)
            }
          })
        }

        // Update server info
        if (data.serverIp) {
          setServerInfo(prev => ({ ...prev, ip: data.serverIp }))
        }

        // Check completion
        if (data.status === 'running' || data.status === 'active') {
          addLog('Provisioning complete!')
          // Mark all steps complete
          steps.forEach(s => updateStep(s.id, 'completed'))
          setIsLoading(false)
          if (data.serverIp) {
            onComplete?.(data.serverIp)
          }
          clearInterval(pollInterval)
          return
        }

        if (data.status === 'error') {
          throw new Error(data.error || 'Provisioning failed')
        }

        attempts++
        if (attempts >= maxAttempts) {
          throw new Error('Provisioning timeout - worker did not become active')
        }

      } catch (err: any) {
        addLog(`ERROR: ${err.message}`)
        setError(err.message)
        setIsLoading(false)
        onError?.(err.message)
        clearInterval(pollInterval)
      }
    }

    // Start polling
    updateStep('init', 'running', 'Starting provisioning...')
    pollProvisionStatus() // First call immediately
    pollInterval = setInterval(pollProvisionStatus, 5000)

    return () => {
      clearInterval(pollInterval)
    }
  }, [workerId, onComplete, onError, updateStep])

  const getStepIcon = (status: ProvisionStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-slate-600" />
    }
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <h3 className="font-semibold text-red-400">Provisioning Failed</h3>
        </div>
        <p className="text-sm text-red-300 mb-3">{error}</p>
        <div className="bg-black/30 rounded p-2 text-xs font-mono text-slate-400 max-h-32 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="truncate">{log}</div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Server className="w-5 h-5 text-violet-400" />
        <h3 className="font-semibold text-white">Provisioning VPS Worker</h3>
        {isLoading && <Loader2 className="w-4 h-4 text-violet-400 animate-spin ml-auto" />}
      </div>

      {/* Steps */}
      <div className="space-y-2 mb-4">
        {steps.map((step) => (
          <div 
            key={step.id}
            className={`flex items-center gap-3 p-2 rounded-lg text-sm ${
              step.status === 'running' ? 'bg-violet-500/10 border border-violet-500/30' : ''
            }`}
          >
            {getStepIcon(step.status)}
            <div className="flex-1">
              <span className={step.status === 'completed' ? 'text-green-400' : step.status === 'running' ? 'text-violet-400' : 'text-slate-400'}>
                {step.label}
              </span>
              {step.message && (
                <p className="text-xs text-slate-500 truncate">{step.message}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Server Info */}
      {(serverInfo.id || serverInfo.ip) && (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 mb-3">
          <p className="text-sm text-green-400 font-medium">Server Created</p>
          {serverInfo.id && <p className="text-xs text-slate-400">ID: {serverInfo.id}</p>}
          {serverInfo.ip && <p className="text-xs text-slate-400">IP: {serverInfo.ip}</p>}
        </div>
      )}

      {/* Debug Logs */}
      <details className="text-xs">
        <summary className="text-slate-500 cursor-pointer hover:text-slate-300">Show debug logs</summary>
        <div className="mt-2 bg-black/30 rounded p-2 font-mono text-slate-500 max-h-40 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="truncate">{log}</div>
          ))}
        </div>
      </details>
    </div>
  )
}
