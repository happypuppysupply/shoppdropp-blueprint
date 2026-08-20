'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Link2 } from 'lucide-react'

interface ConnectAPIFormProps {
  services: string[]
  onSubmit: (selected: string[]) => void
}

export function ConnectAPIForm({ services, onSubmit }: ConnectAPIFormProps) {
  const [selected, setSelected] = useState<string[]>([])
  
  const toggleService = (service: string) => {
    setSelected(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    )
  }
  
  return (
    <div className="space-y-4 py-2">
      <div className="flex flex-wrap gap-2">
        {services.map((service) => {
          const isSelected = selected.includes(service)
          return (
            <button
              key={service}
              onClick={() => toggleService(service)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all border ${
                isSelected
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {isSelected ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
              <span>{service}</span>
            </button>
          )
        })}
      </div>
      <Button 
        onClick={() => onSubmit(selected)}
        disabled={selected.length === 0}
        className="w-full bg-violet-600 hover:bg-violet-500"
      >
        Connect {selected.length > 0 && `(${selected.length})`}
      </Button>
    </div>
  )
}
