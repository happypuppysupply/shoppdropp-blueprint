'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface NumberFormProps {
  placeholder?: string
  prefix?: string
  min?: number
  max?: number
  onSubmit: (value: string) => void
}

export function NumberForm({ 
  placeholder = 'Enter amount...', 
  prefix,
  min,
  max,
  onSubmit 
}: NumberFormProps) {
  const [value, setValue] = useState('')
  
  return (
    <div className="space-y-3 py-2">
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          min={min}
          max={max}
          className={`bg-white/5 border-white/10 text-white ${prefix ? 'pl-8' : ''}`}
        />
      </div>
      <Button 
        onClick={() => value && onSubmit(value)}
        disabled={!value}
        className="w-full bg-violet-600 hover:bg-violet-500"
      >
        Confirm
      </Button>
    </div>
  )
}
