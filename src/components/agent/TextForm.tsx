'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'

interface TextFormProps {
  placeholder?: string
  onSubmit: (value: string) => void
}

export function TextForm({ placeholder, onSubmit }: TextFormProps) {
  const [value, setValue] = useState('')

  return (
    <div className="mt-3 p-4 bg-white/5 rounded-xl border border-white/10">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && value.trim()) {
              onSubmit(value.trim())
            }
          }}
          placeholder={placeholder || 'Type your answer...'}
          className="bg-white/5 border-white/10 text-white flex-1"
        />
        <Button
          size="sm"
          className="bg-violet-600 hover:bg-violet-500"
          disabled={!value.trim()}
          onClick={() => value.trim() && onSubmit(value.trim())}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
