'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Check, 
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface OnboardingQuestion {
  id: string
  section: string
  question: string
  type: 'cards' | 'chips' | 'text' | 'number' | 'slider'
  options?: string[]
  placeholder?: string
  multi?: boolean
  min?: number
  max?: number
  prefix?: string
}

interface InlineOnboardingProps {
  storeId: string
  onComplete: () => void
  onRestart?: () => void
}

export function InlineOnboarding({ storeId, onComplete, onRestart }: InlineOnboardingProps) {
  const [questions, setQuestions] = useState<OnboardingQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [textValue, setTextValue] = useState('')
  const [numberValue, setNumberValue] = useState('')

  useEffect(() => {
    loadQuestions()
  }, [storeId])

  const loadQuestions = async () => {
    setLoading(true)
    try {
      // Import questions directly from lib
      const { ONBOARDING_QUESTIONS } = await import('@/lib/onboarding-questions')
      setQuestions(ONBOARDING_QUESTIONS)
      setCurrentIndex(0)
      setAnswers({})
      setSelectedValues([])
      setTextValue('')
      setNumberValue('')
    } catch (err: any) {
      setError('Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  const handleRestart = async () => {
    if (!confirm('This will reset all your onboarding progress. Continue?')) return
    
    try {
      // Reset on backend
      await api.request(`/onboarding/reset/${storeId}`, { method: 'POST' })
      // Reload
      await loadQuestions()
      if (onRestart) onRestart()
    } catch (err: any) {
      setError('Failed to reset onboarding')
    }
  }

  const handleSelect = (option: string) => {
    const question = questions[currentIndex]
    
    if (question.multi) {
      // Multi-select: toggle selection
      setSelectedValues(prev => 
        prev.includes(option) 
          ? prev.filter(v => v !== option)
          : [...prev, option]
      )
    } else {
      // Single select: replace selection and auto-submit
      setSelectedValues([option])
    }
  }

  const handleSubmit = async () => {
    const question = questions[currentIndex]
    if (!question) return

    // Validate
    let value: any
    if (question.type === 'text') {
      if (!textValue.trim()) {
        setError('Please enter a value')
        return
      }
      value = textValue
    } else if (question.type === 'number') {
      if (!numberValue.trim()) {
        setError('Please enter a value')
        return
      }
      value = parseFloat(numberValue)
    } else if (question.type === 'cards' || question.type === 'chips') {
      if (selectedValues.length === 0) {
        setError(question.multi ? 'Please select at least one option' : 'Please select an option')
        return
      }
      value = question.multi ? selectedValues : selectedValues[0]
    }

    setSaving(true)
    setError('')

    try {
      // Save answer
      await api.request(`/onboarding/step/${storeId}`, {
        method: 'POST',
        body: JSON.stringify({
          stepNumber: currentIndex + 1,
          stepName: question.id,
          data: value,
        }),
      })

      // Update local state
      setAnswers(prev => ({ ...prev, [question.id]: value }))

      // Move to next question
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        setSelectedValues([])
        setTextValue('')
        setNumberValue('')
      } else {
        // Complete
        onComplete()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    )
  }

  const question = questions[currentIndex]
  if (!question) return null

  const isMulti = question.multi === true
  const progress = Math.round(((currentIndex) / questions.length) * 100)

  return (
    <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20 rounded-2xl p-6 my-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-400" />
          <span className="text-sm text-slate-400">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">{progress}%</span>
          <button
            onClick={handleRestart}
            className="p-2 text-slate-500 hover:text-slate-300 transition-colors"
            title="Restart Onboarding"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-xs text-violet-400 uppercase tracking-wider mb-2">{question.section}</p>
        <h3 className="text-lg font-medium text-white">{question.question}</h3>
        {isMulti && (
          <p className="text-sm text-slate-400 mt-1">Select all that apply</p>
        )}
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        {/* Text Input */}
        {question.type === 'text' && (
          <input
            type="text"
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder={question.placeholder || "Type your answer..."}
            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        )}

        {/* Number Input */}
        {question.type === 'number' && (
          <div className="relative">
            {question.prefix && (
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                {question.prefix}
              </span>
            )}
            <input
              type="number"
              value={numberValue}
              onChange={(e) => setNumberValue(e.target.value)}
              placeholder={question.placeholder || "Enter amount..."}
              min={question.min}
              max={question.max}
              className={`w-full ${question.prefix ? 'pl-8' : 'px-4'} py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500`}
            />
          </div>
        )}

        {/* Cards/Chips Options */}
        {(question.type === 'cards' || question.type === 'chips') && question.options && (
          <div className={`grid gap-2 ${question.type === 'chips' ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {question.options.map((option, idx) => {
              const isSelected = selectedValues.includes(option)
              
              if (question.type === 'chips') {
                // Chips style - compact, pill-like
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(option)}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      isSelected
                        ? 'bg-violet-500/30 border-violet-500'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    <span className="text-sm text-white">{option}</span>
                  </button>
                )
              }
              
              // Cards style - larger, with radio/checkbox
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(option)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? 'bg-violet-500/20 border-violet-500'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-${isMulti ? 'md' : 'full'} border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      isSelected 
                        ? 'border-violet-400 bg-violet-400' 
                        : 'border-white/30'
                    }`}>
                      {isSelected && (
                        isMulti ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-white">{option}</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 mt-4 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-gradient-to-r from-violet-600 to-pink-600"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Saving...
            </>
          ) : currentIndex === questions.length - 1 ? (
            'Finish'
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  )
}
