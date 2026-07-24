'use client'

import { ScrollText, CheckCircle, XCircle, Loader2, Clock, AlertTriangle } from 'lucide-react'
import { useRef, useEffect } from 'react'

export interface LogEntry {
  id: string
  timestamp: string
  level: 'info' | 'success' | 'error' | 'warning' | 'running'
  task?: string
  message: string
  details?: Record<string, any>
}

interface ActivityLogProps {
  logs: LogEntry[]
  title?: string
}

const levelConfig = {
  info: { icon: ScrollText, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  success: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  running: { icon: Loader2, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
}

export function ActivityLog({ logs, title = 'Activity Log' }: ActivityLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  return (
    <div className="rounded-xl bg-[#111118] border border-white/10 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-violet-400" />
          <h3 className="font-semibold text-white text-sm">{title}</h3>
        </div>
        <span className="text-xs text-slate-500">{logs.length} entries</span>
      </div>
      
      <div 
        ref={scrollRef}
        className="h-64 overflow-y-auto p-2 space-y-1 font-mono text-xs"
      >
        {logs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            No activity yet. Run a workflow to see logs.
          </div>
        ) : (
          logs.map((log) => {
            const config = levelConfig[log.level]
            const Icon = config.icon
            return (
              <div 
                key={log.id}
                className={`flex items-start gap-2 p-2 rounded-lg ${config.bg} border ${config.border}`}
              >
                <Icon className={`w-3.5 h-3.5 mt-0.5 ${config.color} ${log.level === 'running' ? 'animate-spin' : ''}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{formatTime(log.timestamp)}</span>
                    {log.task && (
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 text-[10px]">
                        {log.task.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                  <p className={`mt-0.5 ${config.color}`}>{log.message}</p>
                  {log.details && (
                    <pre className="mt-1 p-1.5 rounded bg-black/30 text-slate-400 text-[10px] overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
