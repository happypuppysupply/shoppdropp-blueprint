'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// Progress component not available, using simple div
import {
  Brain,
  Search,
  Package,
  Target,
  BarChart3,
  CheckCircle2,
  Loader2,
  Clock,
  Play,
  RotateCcw,
} from 'lucide-react'

interface WorkflowStep {
  id: string
  title: string
  description: string
  status: 'done' | 'running' | 'waiting' | 'error'
  icon: any
  details?: string[]
}

export default function DashboardPage() {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: 'product-research',
      title: 'Product Research',
      description: 'AI analyzes trending products, competitor data, and market demand',
      status: 'done',
      icon: Search,
      details: ['Found 12 trending pet products', '3 high-margin opportunities identified'],
    },
    {
      id: 'cj-dropshipping',
      title: 'CJ Dropshipping Import',
      description: 'Import winning products from CJ Dropshipping to Shopify',
      status: 'running',
      icon: Package,
      details: ['Connecting to CJ API', 'Syncing inventory...'],
    },
    {
      id: 'meta-ads',
      title: 'Meta Ads Launch',
      description: 'Auto-create and launch Facebook & Instagram campaigns',
      status: 'waiting',
      icon: Target,
      details: ['Campaign setup ready', 'Budget: $50/day allocated'],
    },
    {
      id: 'measure-results',
      title: 'Measure Results',
      description: 'Track ROAS, conversions, and performance metrics',
      status: 'waiting',
      icon: BarChart3,
      details: [],
    },
  ])

  const runStep = (stepId: string) => {
    setWorkflowSteps((steps) =>
      steps.map((step) =>
        step.id === stepId ? { ...step, status: 'running' } : step
      )
    )
  }

  const getStatusIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case 'running':
        return <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
      case 'waiting':
        return <Clock className="w-5 h-5 text-slate-400" />
      case 'error':
        return <div className="w-5 h-5 rounded-full bg-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: WorkflowStep['status']) => {
    const styles = {
      done: 'bg-green-500/20 text-green-400 border-green-500/30',
      running: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
      waiting: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
    }
    return styles[status]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
              <Brain className="w-6 h-6 text-violet-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">AI Workflow</h1>
          </div>
          <p className="text-slate-400 mt-1 ml-14">Autonomous dropshipping pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500">
            <Play className="w-4 h-4 mr-2" />
            Run Full Workflow
          </Button>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Worker Active
          </Badge>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="space-y-4">
        {workflowSteps.map((step, index) => {
          const Icon = step.icon
          return (
            <Card
              key={step.id}
              className={`bg-[#111118] border-white/10 transition-all ${
                step.status === 'running' ? 'ring-1 ring-violet-500/50' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Step Number & Icon */}
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        step.status === 'done'
                          ? 'bg-green-500/20 text-green-400'
                          : step.status === 'running'
                          ? 'bg-violet-500/20 text-violet-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {step.status === 'done' ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </div>
                    {index < workflowSteps.length - 1 && (
                      <div className="w-0.5 h-8 bg-white/10" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-slate-400" />
                        <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                        <Badge
                          variant="outline"
                          className={`capitalize ${getStatusBadge(step.status)}`}
                        >
                          {step.status}
                        </Badge>
                      </div>
                      {step.status !== 'running' && step.status !== 'done' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runStep(step.id)}
                          className="border-white/10 hover:bg-white/10"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Run
                        </Button>
                      )}
                      {step.status === 'done' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runStep(step.id)}
                          className="border-white/10 hover:bg-white/10"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Re-run
                        </Button>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{step.description}</p>

                    {/* Progress bar for running step */}
                    {step.status === 'running' && (
                      <div className="mt-4">
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full animate-pulse" style={{width: '45%'}} />
                        </div>
                      </div>
                    )}

                    {/* Details */}
                    {step.details && step.details.length > 0 && (
                      <div className="mt-3 space-y-1">
                        {step.details.map((detail, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                            <span className="text-slate-300">{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Hetzner VPS Card */}
      <Card className="bg-[#111118] border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <span className="text-red-400 font-bold text-sm">H</span>
            </div>
            Hetzner VPS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400">No worker assigned</p>
              <p className="text-sm text-slate-500 mt-1">
                Provision a VPS to enable autonomous workflow execution
              </p>
            </div>
            <Button className="bg-violet-600 hover:bg-violet-500">
              Setup Worker
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
