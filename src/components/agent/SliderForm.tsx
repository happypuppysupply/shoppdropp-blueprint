'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

interface SliderFormProps {
  min?: number
  max?: number
  defaultValue?: number
  leftLabel?: string
  rightLabel?: string
  onSubmit: (value: number) => void
}

export function SliderForm({ 
  min = 0, 
  max = 10, 
  defaultValue = 5,
  leftLabel = 'Playful',
  rightLabel = 'Professional',
  onSubmit 
}: SliderFormProps) {
  const [value, setValue] = useState(defaultValue)
  
  return (
    <div className="space-y-4 py-2">
      <div className="flex justify-between text-sm text-slate-400">
        <span>{leftLabel}</span>
        <span className="text-violet-400 font-bold text-lg">{value}</span>
        <span>{rightLabel}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={1}
        onValueChange={(v: number[]) => setValue(v[0])}
        className="w-full"
      />
      <Button 
        onClick={() => onSubmit(value)}
        className="w-full bg-violet-600 hover:bg-violet-500"
      >
        Confirm ({value})
      </Button>
    </div>
  )
}
