'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bot, Send, Sparkles } from 'lucide-react'

export default function AIAgentPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hello! I\'m your ShoppDropp AI assistant. I can help you create products, set up ads, analyze performance, and automate your dropshipping business. What would you like to do today?' },
  ])

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages([...messages, { role: 'user', content: input }])
    setInput('')
    // TODO: Integrate with AI API
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'I\'m still learning! In the full version, I\'ll be able to help you with product research, ad copy, store optimization, and more.' },
      ])
    }, 1000)
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-violet-400" />
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">AI Agent</h1>
          <p className="text-slate-400">Your autonomous dropshipping assistant</p>
        </div>
      </div>

      <Card className="bg-[#111118] border-white/10 flex flex-col h-[calc(100%-6rem)]">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
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
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-violet-500/20 text-white'
                    : 'bg-white/5 text-slate-200'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </CardContent>
        <CardHeader className="border-t border-white/10 pt-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything about dropshipping..."
              className="bg-white/5 border-white/10 text-white"
            />
            <Button onClick={sendMessage} className="bg-violet-600 hover:bg-violet-500">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  )
}
