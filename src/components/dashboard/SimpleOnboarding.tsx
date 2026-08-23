'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronRight, Loader2, RefreshCw, Bot, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { ONBOARDING_QUESTIONS } from '@/lib/onboarding-questions'

interface SimpleOnboardingProps {
  storeId: string
  onComplete: () => void
}

export function SimpleOnboarding({ storeId, onComplete }: SimpleOnboardingProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [textValue, setTextValue] = useState('')
  const [numberValue, setNumberValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(false)

  const currentQuestion = ONBOARDING_QUESTIONS[currentIndex]
  const progress = Math.round(((currentIndex) / ONBOARDING_QUESTIONS.length) * 100)

  const handleSelect = (option: string) => {
    if (currentQuestion.multi) {
      setSelectedValues(prev =>
        prev.includes(option)
          ? prev.filter(v => v !== option)
          : [...prev, option]
      )
    } else {
      setSelectedValues([option])
      setTimeout(() => submitAnswer([option]), 300)
    }
  }

  const submitAnswer = async (value?: string | string[] | number) => {
    let answerValue: any

    if (value !== undefined) {
      answerValue = value
    } else if (currentQuestion.type === 'text') {
      if (!textValue.trim()) return
      answerValue = textValue
    } else if (currentQuestion.type === 'number') {
      if (!numberValue.trim()) return
      answerValue = parseFloat(numberValue)
    } else {
      if (selectedValues.length === 0) return
      answerValue = currentQuestion.multi ? selectedValues : selectedValues[0]
    }

    setLoading(true)

    try {
      await api.request(`/onboarding/step/${storeId}`, {
        method: 'POST',
        body: JSON.stringify({
          stepNumber: currentIndex + 1,
          stepName: currentQuestion.id,
          data: answerValue,
        }),
      })

      setAnswers(prev => ({ ...prev, [currentQuestion.id]: answerValue }))

      if (currentIndex < ONBOARDING_QUESTIONS.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setSelectedValues([])
        setTextValue('')
        setNumberValue('')
      } else {
        setCompleted(true)
        setTimeout(onComplete, 1500)
      }
    } catch (err) {
      console.error('Failed to save:', err)
    } finally {
      setLoading(false)
    }
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">All Set!</h3>
        <p className="text-slate-400">Starting product research...</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 border border-violet-500/30 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/20 rounded-xl">
            <Bot className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400">Question {currentIndex + 1} of {ONBOARDING_QUESTIONS.length}</p>
            <p className="text-xs text-violet-400">{currentQuestion.section}</p>
          </div>
        </div>
        <span className="text-sm text-slate-400">{progress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-white/10 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="flex items-start gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-violet-400 mt-1" />
          <p className="text-white text-lg">{currentQuestion.question}</p>
        </div>

        {currentQuestion.multi && (
          <p className="text-sm text-slate-400 ml-6">Select all that apply</p>
        )}
      </div>

      {/* Input */}
      <div className="space-y-3">
        {currentQuestion.type === 'text' && (
          <div className="flex gap-2">
            <input
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Type your answer..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
              onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
            />
            <Button onClick={() => submitAnswer()} disabled={!textValue.trim() || loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        )}

        {currentQuestion.type === 'number' && (
          <div className="flex gap-2">
            <input
              type="number"
              value={numberValue}
              onChange={(e) => setNumberValue(e.target.value)}
              placeholder="Enter amount..."
              className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white"
              onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
            />
            <Button onClick={() => submitAnswer()} disabled={!numberValue.trim() || loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        )}

        {(currentQuestion.type === 'cards' || currentQuestion.type === 'chips') && currentQuestion.options && (
          <div className={`grid gap-2 ${currentQuestion.type === 'chips' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedValues.includes(option)
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(option)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'bg-violet-500/30 border-violet-500'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 ${currentQuestion.multi ? 'rounded' : 'rounded-full'} border-2 flex items-center justify-center ${
                      isSelected ? 'bg-violet-500 border-violet-500' : 'border-white/30'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-white">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {currentQuestion.multi && selectedValues.length > 0 && (
          <Button onClick={() => submitAnswer()} disabled={loading} className="w-full">
            Continue with {selectedValues.length} selected
          </Button>
        )}
      </div>
    </div>
  )
}
