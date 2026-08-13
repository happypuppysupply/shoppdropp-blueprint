'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Store, 
  Target, 
  Palette, 
  Package, 
  Megaphone,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface OnboardingStep {
  stepNumber: number
  stepName: string
  prompt: string
  inputType: 'single_select' | 'multi_select' | 'text' | 'textarea'
  options?: Array<{
    id: string
    name: string
    description?: string
    trending?: boolean
    example?: string
  }>
  validation?: {
    required?: boolean
    min?: number
    max?: number
  }
}

interface OnboardingWizardProps {
  storeId: string
  onComplete: () => void
  onSkip?: () => void
}

const stepIcons: Record<number, any> = {
  1: Store,
  2: Store,
  3: Target,
  4: Target,
  5: Target,
  6: Target,
  7: Palette,
  8: Palette,
  9: Package,
  10: Megaphone,
  11: TrendingUp,
}

const stepTitles: Record<number, string> = {
  1: 'Market Category',
  2: 'Subcategory',
  3: 'Your Niche',
  4: 'Target Audience',
  5: 'Psychographics',
  6: 'Pain Points',
  7: 'Brand Voice',
  8: 'Site Style',
  9: 'Product Strategy',
  10: 'Marketing',
  11: 'Business Goals',
}

export function OnboardingWizard({ storeId, onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [stepData, setStepData] = useState<OnboardingStep | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [textValue, setTextValue] = useState('')
  const [error, setError] = useState('')
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isComplete, setIsComplete] = useState(false)

  // Fetch current step data
  useEffect(() => {
    fetchStepData()
  }, [currentStep, storeId])

  const fetchStepData = async () => {
    setLoading(true)
    setError('')
    try {
      const step = await api.request(`/onboarding/step/${storeId}`)
      setStepData(step)
      setSelectedValues([])
      setTextValue('')
    } catch (err: any) {
      setError(err.message || 'Failed to load step')
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (id: string) => {
    if (stepData?.inputType === 'single_select') {
      setSelectedValues([id])
    } else if (stepData?.inputType === 'multi_select') {
      setSelectedValues(prev => 
        prev.includes(id) 
          ? prev.filter(v => v !== id)
          : [...prev, id]
      )
    }
  }

  const handleContinue = async () => {
    // Validate
    if (stepData?.validation?.required) {
      if (stepData.inputType === 'text' || stepData.inputType === 'textarea') {
        if (!textValue.trim()) {
          setError('This field is required')
          return
        }
      } else {
        if (selectedValues.length === 0) {
          setError('Please select at least one option')
          return
        }
      }
    }

    if (stepData?.validation?.min && selectedValues.length < stepData.validation.min) {
      setError(`Please select at least ${stepData.validation.min} options`)
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await api.request(`/onboarding/step/${storeId}`, {
        method: 'POST',
        body: JSON.stringify({
          stepNumber: currentStep,
          stepName: stepData?.stepName,
          data: stepData?.inputType === 'text' || stepData?.inputType === 'textarea' 
            ? textValue 
            : stepData?.inputType === 'single_select' 
              ? selectedValues[0] 
              : selectedValues,
        }),
      })

      setCompletedSteps(prev => [...prev, currentStep])

      if (response.isComplete) {
        setIsComplete(true)
        setTimeout(() => {
          onComplete()
        }, 2000)
      } else {
        setCurrentStep(response.nextStep)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save step')
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const StepIcon = stepIcons[currentStep] || Sparkles

  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-lg bg-gradient-to-br from-violet-900/90 to-purple-900/90 rounded-3xl border border-violet-500/30 p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            All Set! 🎉
          </h2>
          <p className="text-slate-300 text-lg mb-6">
            Your store configuration is complete. The AI now has everything it needs to build your dropshipping business.
          </p>
          <div className="flex items-center justify-center gap-2 text-violet-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Starting your AI agent...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-[#111118] rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/20 rounded-xl">
                <StepIcon className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Step {currentStep} of 11</p>
                <h2 className="text-xl font-semibold text-white">
                  {stepTitles[currentStep]}
                </h2>
              </div>
            </div>
            {onSkip && (
              <button
                onClick={onSkip}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Skip for now
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="flex gap-1">
            {Array.from({ length: 11 }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i + 1 < currentStep
                    ? 'bg-green-500'
                    : i + 1 === currentStep
                    ? 'bg-violet-500'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            </div>
          ) : error && !stepData ? (
            <div className="text-center py-8">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={fetchStepData} variant="outline">
                Try Again
              </Button>
            </div>
          ) : stepData ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* AI Prompt */}
                <div className="mb-6 p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-violet-400 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-300 leading-relaxed">
                      {stepData.prompt}
                    </p>
                  </div>
                </div>

                {/* Input Area */}
                {stepData.inputType === 'text' || stepData.inputType === 'textarea' ? (
                  <div className="space-y-3">
                    {stepData.inputType === 'textarea' ? (
                      <textarea
                        value={textValue}
                        onChange={(e) => setTextValue(e.target.value)}
                        placeholder="Describe your niche..."
                        className="w-full h-32 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={textValue}
                        onChange={(e) => setTextValue(e.target.value)}
                        placeholder="Enter your answer..."
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stepData.options?.map((option) => {
                      const isSelected = selectedValues.includes(option.id)
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleSelect(option.id)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                            isSelected
                              ? 'bg-violet-500/20 border-violet-500'
                              : 'bg-white/5 border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              isSelected 
                                ? 'border-violet-400 bg-violet-400' 
                                : 'border-white/30'
                            }`}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white">
                                  {option.name}
                                </span>
                                {option.trending && (
                                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                    Trending
                                  </span>
                                )}
                              </div>
                              {option.description && (
                                <p className="text-sm text-slate-400 mt-1">
                                  {option.description}
                                </p>
                              )}
                              {option.example && (
                                <p className="text-sm text-violet-400/70 mt-1 italic">
                                  "{option.example}"
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-red-400 text-sm"
                  >
                    {error}
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || saving}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">
                {selectedValues.length > 0 && stepData?.inputType === 'multi_select' 
                  ? `${selectedValues.length} selected`
                  : `${Math.round(((currentStep - 1) / 11) * 100)}% complete`
                }
              </span>
              <Button
                onClick={handleContinue}
                disabled={saving || loading}
                className="gap-2 bg-gradient-to-r from-violet-600 to-pink-600"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : currentStep === 11 ? (
                  <>
                    Complete
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
