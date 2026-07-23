'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Server, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Terminal,
  ArrowLeft,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface BuildStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  log?: string
}

const BUILD_STEPS: BuildStep[] = [
  { id: 'init', name: 'Initialize VPS', status: 'pending' },
  { id: 'deps', name: 'Install Dependencies', status: 'pending' },
  { id: 'ssh', name: 'Configure SSH', status: 'pending' },
  { id: 'openclaw', name: 'Install OpenClaw', status: 'pending' },
  { id: 'env', name: 'Configure Environment', status: 'pending' },
  { id: 'start', name: 'Start Services', status: 'pending' },
  { id: 'health', name: 'Health Check', status: 'pending' },
]

export default function BuildProgressPage() {
  const searchParams = useSearchParams()
  const storeId = searchParams.get('storeId')
  const [steps, setSteps] = useState<BuildStep[]>(BUILD_STEPS)
  const [currentStep, setCurrentStep] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [isBuilding, setIsBuilding] = useState(true)
  const [serverIp, setServerIp] = useState<string | null>(null)
  const [serverType, setServerType] = useState('cpx12')

  useEffect(() => {
    if (!isBuilding) return

    const interval = setInterval(() => {
      setSteps(prevSteps => {
        const newSteps = [...prevSteps]
        
        // Mark current step as running
        if (currentStep < newSteps.length) {
          newSteps[currentStep].status = 'running'
          
          // Add log
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${newSteps[currentStep].name}...`])
        }
        
        // Complete previous step
        if (currentStep > 0) {
          newSteps[currentStep - 1].status = 'completed'
        }
        
        return newSteps
      })

      setCurrentStep(prev => {
        if (prev >= BUILD_STEPS.length - 1) {
          setIsBuilding(false)
          setServerIp('49.13.123.45') // Mock IP
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [currentStep, isBuilding])

  const getStepIcon = (status: BuildStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case 'running':
        return <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
    }
  }

  const completedCount = steps.filter(s => s.status === 'completed').length
  const progress = Math.round((completedCount / steps.length) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href={`/app/dashboard?storeId=${storeId}`}>
            <Button variant="ghost" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </Link>
          <Badge className={isBuilding ? 'bg-violet-500/20 text-violet-400' : 'bg-green-500/20 text-green-400'}>
            {isBuilding ? 'Building...' : 'Ready'}
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Building Your VPS Worker</h1>
          <p className="text-slate-400">This will take approximately 2-3 minutes</p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Build Steps */}
          <Card className="bg-[#111118] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-violet-400" />
                Build Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getStepIcon(step.status)}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${step.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>
                      {step.name}
                    </p>
                  </div>
                  {step.status === 'completed' && (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Server Details / Live Log */}
          <div className="space-y-4">
            {!isBuilding && serverIp && (
              <Card className="bg-[#111118] border-white/10 border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Server Ready
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-white font-mono">{serverType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">IP Address:</span>
                    <span className="text-white font-mono">{serverIp}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Status:</span>
                    <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-violet-600 to-pink-600 mt-4"
                    onClick={() => window.location.href = `/app/dashboard?storeId=${storeId}`}
                  >
                    Go to Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="bg-[#111118] border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-violet-400" />
                  Live Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 overflow-y-auto font-mono text-xs space-y-1 bg-black/30 rounded-lg p-3">
                  {logs.length === 0 ? (
                    <p className="text-slate-500">Waiting to start...</p>
                  ) : (
                    logs.map((log, i) => (
                      <p key={i} className="text-green-400">{log}</p>
                    ))
                  )}
                  {isBuilding && (
                    <p className="text-violet-400 animate-pulse">_</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Retry Button */}
        {!isBuilding && (
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              className="border-white/10 text-slate-400 hover:text-white"
              onClick={() => {
                setSteps(BUILD_STEPS)
                setCurrentStep(0)
                setLogs([])
                setIsBuilding(true)
                setServerIp(null)
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Rebuild
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
