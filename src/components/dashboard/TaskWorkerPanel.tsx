'use client'

import { useState, useRef, useEffect } from 'react'
import { Terminal, Send, Square, Loader2, CheckCircle, XCircle, Clock, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface TaskActivity {
  id: string
  timestamp: string
  type: 'system' | 'tool' | 'result' | 'error' | 'user' | 'ai'
  message: string
  details?: any
}

interface TaskWorkerPanelProps {
  taskId: string
  taskName: string
  status: 'waiting' | 'running' | 'completed' | 'failed'
  activities: TaskActivity[]
  onSendMessage?: (message: string) => void
  onStop?: () => void
  isActive: boolean
}

const typeConfig = {
  system: { icon: '>', color: 'text-slate-400', bg: 'bg-slate-500/10' },
  tool: { icon: '🔧', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  result: { icon: '✓', color: 'text-green-400', bg: 'bg-green-500/10' },
  error: { icon: '✗', color: 'text-red-400', bg: 'bg-red-500/10' },
  user: { icon: '👤', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  ai: { icon: '🤖', color: 'text-violet-400', bg: 'bg-violet-500/10' },
}

export function TaskWorkerPanel({ 
  taskId, 
  taskName, 
  status, 
  activities, 
  onSendMessage, 
  onStop,
  isActive 
}: TaskWorkerPanelProps) {
  const [inputMessage, setInputMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activities])

  const handleSend = () => {
    if (inputMessage.trim() && onSendMessage) {
      onSendMessage(inputMessage.trim())
      setInputMessage('')
    }
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3 
    })
  }

  if (!isActive && activities.length === 0) {
    return null
  }

  return (
    <div className="mt-3 rounded-lg bg-[#0d0d12] border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-white">Worker Console</span>
          {isActive && (
            <span className="flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400">Live</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isActive && onStop && (
            <Button
              size="sm"
              variant="destructive"
              className="h-7 px-2 text-xs"
              onClick={onStop}
            >
              <Square className="w-3 h-3 mr-1" />
              Stop
            </Button>
          )}
          <span className="text-xs text-slate-500">{activities.length} events</span>
        </div>
      </div>

      {/* Activity Stream */}
      <div 
        ref={scrollRef}
        className="h-48 overflow-y-auto p-2 space-y-1 font-mono text-xs"
      >
        {activities.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-600">
            <div className="text-center">
              <Terminal className="w-6 h-6 mx-auto mb-1 opacity-50" />
              <p className="text-xs">Waiting for activity...</p>
            </div>
          </div>
        ) : (
          activities.map((activity) => {
            const config = typeConfig[activity.type]
            return (
              <div 
                key={activity.id}
                className={`flex items-start gap-2 p-1.5 rounded ${config.bg}`}
              >
                <span className={`${config.color} font-bold w-4`}>{config.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 text-[10px]">{formatTime(activity.timestamp)}</span>
                  </div>
                  <p className={`${config.color} text-xs`}>{activity.message}</p>
                  {activity.details && (
                    <pre className="mt-1 p-1 rounded bg-black/30 text-slate-500 text-[10px] overflow-x-auto">
                      {typeof activity.details === 'string' ? activity.details : JSON.stringify(activity.details, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            )
          })
        )}
        
        {isActive && (
          <div className="flex items-center gap-2 p-2 text-slate-500 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-xs">Waiting for next event...</span>
          </div>
        )}
      </div>

      {/* Input Area - Like OpenClaw Gateway */}
      <div className="p-2 border-t border-white/10 bg-white/5">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message worker..."
            className="flex-1 h-8 text-xs bg-black/20 border-white/10 text-white placeholder:text-slate-600"
            disabled={!isActive}
          />
          <Button
            size="sm"
            className="h-8 px-3 bg-violet-600 hover:bg-violet-700"
            onClick={handleSend}
            disabled={!isActive || !inputMessage.trim()}
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
        <p className="text-[10px] text-slate-600 mt-1">
          {isActive ? 'Type to interact with the worker' : 'Start the task to enable messaging'}
        </p>
      </div>
    </div>
  )
}
