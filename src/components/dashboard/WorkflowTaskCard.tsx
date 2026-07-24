'use client'

import { Loader2, CheckCircle, XCircle, Clock, Play, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

interface WorkflowTaskCardProps {
  id: string
  title: string
  description: string
  status: 'waiting' | 'queued' | 'running' | 'completed' | 'failed'
  icon: ReactNode
  color: string
  onRun: () => void
  disabled: boolean
  queuePosition?: number
  progress?: number
  lastResult?: string
}

const statusConfig = {
  waiting: { 
    icon: Clock, 
    color: 'text-slate-400', 
    bg: 'bg-slate-500/10', 
    border: 'border-slate-500/20',
    label: 'Ready'
  },
  queued: { 
    icon: Clock, 
    color: 'text-amber-400', 
    bg: 'bg-amber-500/10', 
    border: 'border-amber-500/20',
    label: 'Queued'
  },
  running: { 
    icon: Loader2, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/10', 
    border: 'border-blue-500/20',
    label: 'Running',
    spin: true
  },
  completed: { 
    icon: CheckCircle, 
    color: 'text-green-400', 
    bg: 'bg-green-500/10', 
    border: 'border-green-500/20',
    label: 'Done'
  },
  failed: { 
    icon: XCircle, 
    color: 'text-red-400', 
    bg: 'bg-red-500/10', 
    border: 'border-red-500/20',
    label: 'Failed'
  },
}

export function WorkflowTaskCard({ 
  title, 
  description, 
  status, 
  icon, 
  color,
  onRun, 
  disabled,
  queuePosition,
  progress,
  lastResult
}: WorkflowTaskCardProps) {
  const config = statusConfig[status] || statusConfig.waiting
  const StatusIcon = config.icon

  return (
    <div className={`p-4 rounded-lg ${config.bg} border ${config.border} transition-all duration-300`}>
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg bg-${color}-500/20 flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-white">{title}</h4>
              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                <StatusIcon className={`w-3 h-3 ${status === 'running' ? 'animate-spin' : ''}`} />
                {config.label}
                {status === 'queued' && queuePosition && ` (#${queuePosition})`}
              </span>
            </div>
            
            {/* Show Run button ONLY when waiting or failed */}
            {(status === 'waiting' || status === 'failed') && (
              <Button
                size="sm"
                className={`bg-${color}-600/50 hover:bg-${color}-600`}
                onClick={onRun}
                disabled={disabled}
              >
                <Play className="w-3 h-3 mr-1" />
                Run
              </Button>
            )}
          </div>
          
          <p className="text-sm text-slate-400 mt-1">{description}</p>
          
          {/* Progress bar for running tasks */}
          {status === 'running' && progress !== undefined && (
            <div className="mt-2">
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div 
                  className={`bg-${color}-400 h-1.5 rounded-full transition-all duration-500`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">{progress}% complete</p>
            </div>
          )}
          
          {/* Last result message */}
          {lastResult && (status === 'completed' || status === 'failed') && (
            <p className={`text-xs mt-2 ${status === 'completed' ? 'text-green-400' : 'text-red-400'}`}>
              {lastResult}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
