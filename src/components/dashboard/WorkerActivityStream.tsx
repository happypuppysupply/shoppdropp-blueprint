'use client'

import { Terminal, Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { useRef, useEffect } from 'react'

export interface WorkerActivity {
  id: string
  timestamp: string
  type: 'thinking' | 'tool' | 'result' | 'error' | 'complete'
  message: string
  tool?: string
  duration?: number
  details?: any
}

interface WorkerActivityStreamProps {
  activities: WorkerActivity[]
  isActive: boolean
  currentTask?: string
}

const typeConfig = {
  thinking: { icon: Loader2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  tool: { icon: ArrowRight, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  result: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
  complete: { icon: CheckCircle, color: 'text-violet-400', bg: 'bg-violet-500/10' },
}

export function WorkerActivityStream({ activities, isActive, currentTask }: WorkerActivityStreamProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activities])

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })
  }

  if (!isActive && activities.length === 0) {
    return (
      <div className="rounded-xl bg-[#111118] border border-white/10 overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-500" />
          <h3 className="font-semibold text-slate-500 text-sm">Worker Activity</h3>
        </div>
        <div className="h-48 flex items-center justify-center text-slate-600">
          <div className="text-center">
            <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Run a workflow to see real-time activity</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-[#111118] border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-violet-400" />
          <h3 className="font-semibold text-white text-sm">Worker Activity</h3>
          {isActive && (
            <span className="flex items-center gap-1 text-xs text-blue-400">
              <Loader2 className="w-3 h-3 animate-spin" />
              {currentTask?.replace(/_/g, ' ')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isActive && (
            <span className="flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400">Live</span>
            </span>
          )}
          <span className="text-xs text-slate-500">{activities.length} events</span>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="h-64 overflow-y-auto p-3 space-y-1 font-mono text-xs"
      >
        {activities.map((activity) => {
          const config = typeConfig[activity.type]
          const Icon = config.icon
          
          return (
            <div 
              key={activity.id}
              className={`flex items-start gap-2 p-2 rounded-lg ${config.bg} border border-white/5`}
            >
              <Icon className={`w-3.5 h-3.5 mt-0.5 ${config.color} ${activity.type === 'thinking' ? 'animate-spin' : ''}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[10px]">{formatTime(activity.timestamp)}</span>
                  {activity.tool && (
                    <span className="px-1.5 py-0.5 rounded bg-white/10 text-amber-300 text-[10px]">
                      {activity.tool}
                    </span>
                  )}
                  {activity.duration && (
                    <span className="text-slate-600 text-[10px]">{activity.duration}ms</span>
                  )}
                </div>
                <p className={`mt-0.5 ${config.color}`}>{activity.message}</p>
                {activity.details && (
                  <pre className="mt-1 p-1.5 rounded bg-black/30 text-slate-400 text-[10px] overflow-x-auto">
                    {typeof activity.details === 'string' ? activity.details : JSON.stringify(activity.details, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )
        })}
        
        {isActive && (
          <div className="flex items-center gap-2 p-2 text-slate-500 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Waiting for next event...</span>
          </div>
        )}
      </div>
    </div>
  )
}
