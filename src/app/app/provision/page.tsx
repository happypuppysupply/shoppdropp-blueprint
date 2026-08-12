'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle, XCircle, Server, Terminal, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSupabaseClient } from '@/lib/supabase-client'

interface ProvisionStep {
  id: string
  label: string
  status: 'pending' | 'running' | 'completed' | 'error'
  message?: string
  timestamp?: string
}

export default function ProvisionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const workerId = searchParams.get('workerId')
  const [steps, setSteps] = useState<ProvisionStep[]>([
    { id: 'init', label: 'Initialize Provisioning', status: 'pending' },
    { id: 'destroy', label: 'Destroy Old VPS (if exists)', status: 'pending' },
    { id: 'create', label: 'Create Hetzner Server', status: 'pending' },
    { id: 'wait', label: 'Wait for Server Ready', status: 'pending' },
    { id: 'ssh', label: 'Connect via SSH', status: 'pending' },
    { id: 'install', label: 'Install OpenClaw Gateway', status: 'pending' },
    { id: 'verify', label: 'Verify Installation', status: 'pending' },
    { id: 'connect', label: 'Connect WebSocket', status: 'pending' },
  ])
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [serverIp, setServerIp] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!workerId) {
      setError('No worker ID provided')
      return
    }

    // Start provisioning
    startProvisioning()

    return () => {
      eventSourceRef.current?.close()
    }
  }, [workerId])

  const updateStep = (stepId: string, status: ProvisionStep['status'], message?: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, message, timestamp: new Date().toISOString() }
        : step
    ))
  }

  const startProvisioning = async () => {
    try {
      const supabase = getSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        setError('Authentication required')
        return
      }

      // Step 1: Initialize
      updateStep('init', 'running')
      await new Promise(r => setTimeout(r, 500))
      updateStep('init', 'completed', 'Provisioning started')
      setCurrentStep(1)

      // Step 2: Call reprovision API with streaming
      updateStep('destroy', 'running')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workers/${workerId}/reprovision`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Provisioning failed')
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Provisioning failed')
      }

      updateStep('destroy', 'completed', 'Old VPS destroyed')
      updateStep('create', 'completed', `Server ${result.server_id} created`)
      updateStep('wait', 'completed', `IP: ${result.ip_address}`)
      setServerIp(result.ip_address)
      setCurrentStep(4)

      // Step 5-8: Poll for worker status
      if (!workerId) throw new Error('Worker ID is required')
      await pollWorkerStatus(workerId, session.access_token)

    } catch (err: any) {
      console.error('Provisioning error:', err)
      setError(err.message)
      // Mark current step as error
      setSteps(prev => {
        const current = prev[currentStep]
        if (current && current.status === 'running') {
          return prev.map((s, i) => i === currentStep ? { ...s, status: 'error', message: err.message } : s)
        }
        return prev
      })
    }
  }

  const pollWorkerStatus = async (workerId: string, token: string) => {
    const maxAttempts = 60 // 5 minutes
    let attempts = 0

    updateStep('ssh', 'running', 'Connecting to VPS...')

    while (attempts < maxAttempts) {
      try {
        // Check provision status for detailed steps
        const provisionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/provision/status/${workerId}?_t=${Date.now()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (provisionResponse.ok) {
          const provisionData = await provisionResponse.json()
          
          // Update steps based on provision logs
          if (provisionData.steps && provisionData.steps.length > 0) {
            provisionData.steps.forEach((step: any) => {
              const stepName = step.name?.toLowerCase() || ''
              if (stepName.includes('ssh')) {
                updateStep('ssh', step.progress >= 100 ? 'completed' : 'running', step.message)
              } else if (stepName.includes('install') || stepName.includes('openclaw')) {
                updateStep('install', step.progress >= 100 ? 'completed' : 'running', step.message)
              } else if (stepName.includes('verify') || stepName.includes('health')) {
                updateStep('verify', step.progress >= 100 ? 'completed' : 'running', step.message)
              } else if (stepName.includes('connect') || stepName.includes('ready')) {
                updateStep('connect', step.progress >= 100 ? 'completed' : 'running', step.message)
              }
            })
          }
          
          // Check if provisioning is complete
          if (provisionData.status === 'running' || provisionData.status === 'active') {
            updateStep('ssh', 'completed', 'SSH connected')
            updateStep('install', 'completed', 'OpenClaw installed')
            updateStep('verify', 'completed', 'Gateway verified')
            updateStep('connect', 'completed', 'WebSocket ready')
            setCurrentStep(7)
            setIsComplete(true)
            
            setTimeout(() => {
              router.push('/app')
            }, 3000)
            return
          }
        }

        // Also check worker status as fallback
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/workers/${workerId}?_t=${Date.now()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })

        if (!response.ok) {
          await new Promise(r => setTimeout(r, 5000))
          attempts++
          continue
        }

        const data = await response.json()
        const worker = data.worker

        console.log('Worker status:', worker?.status, 'IP:', worker?.ip_address)

        if (worker?.status === 'configuring' && worker?.ip_address) {
          updateStep('ssh', 'completed', 'SSH connected')
          updateStep('install', 'running', 'Installing OpenClaw...')
          setCurrentStep(5)
        }

        if (worker?.status === 'active' || worker?.status === 'running') {
          updateStep('ssh', 'completed', 'SSH connected')
          updateStep('install', 'completed', 'OpenClaw installed')
          updateStep('verify', 'completed', 'Gateway verified')
          updateStep('connect', 'completed', 'WebSocket ready')
          setCurrentStep(7)
          setIsComplete(true)
          
          setTimeout(() => {
            router.push('/app')
          }, 3000)
          return
        }

        if (worker?.status === 'error') {
          throw new Error('Worker configuration failed')
        }

      } catch (err: any) {
        console.error('Poll error:', err)
      }

      await new Promise(r => setTimeout(r, 5000))
      attempts++
    }

    throw new Error('Provisioning timeout - worker did not become active')
  }

  const getStepIcon = (status: ProvisionStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Provisioning Failed</h1>
            <p className="text-slate-400">{error}</p>
          </div>
          <Button 
            onClick={() => router.push('/app')} 
            className="w-full bg-gradient-to-r from-violet-600 to-pink-600"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 mb-4">
            <Server className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isComplete ? 'Provisioning Complete!' : 'Setting Up Your AI Agent'}
          </h1>
          <p className="text-slate-400">
            {isComplete 
              ? 'Redirecting to dashboard...' 
              : 'This will take 3-5 minutes. Please don\'t close this page.'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-start gap-4 p-3 rounded-xl transition-colors ${
                  step.status === 'running' ? 'bg-violet-500/10 border border-violet-500/30' : ''
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${
                      step.status === 'completed' ? 'text-green-400' :
                      step.status === 'error' ? 'text-red-400' :
                      step.status === 'running' ? 'text-violet-400' :
                      'text-slate-400'
                    }`}>
                      {step.label}
                    </h3>
                    {step.status === 'running' && (
                      <span className="text-xs text-violet-400 animate-pulse">Running...</span>
                    )}
                  </div>
                  {step.message && (
                    <p className="text-sm text-slate-500 mt-1 font-mono">{step.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Server Info */}
        {serverIp && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="w-5 h-5 text-violet-400" />
              <h2 className="font-semibold text-white">Server Details</h2>
            </div>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">IP Address:</span>
                <span className="text-violet-400">{serverIp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Provider:</span>
                <span className="text-slate-300">Hetzner Cloud</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Type:</span>
                <span className="text-slate-300">CX21 (2 vCPU, 4GB RAM)</span>
              </div>
            </div>
          </div>
        )}

        {/* Completion Actions */}
        {isComplete && (
          <div className="text-center">
            <Button 
              onClick={() => router.push('/app')}
              className="bg-gradient-to-r from-violet-600 to-pink-600"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Cancel/Back */}
        {!isComplete && (
          <div className="text-center">
            <button 
              onClick={() => router.push('/app')}
              className="text-slate-500 hover:text-slate-300 text-sm"
            >
              Cancel and go back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
