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
  Package, 
  Megaphone,
  TrendingUp,
  Loader2,
  Key,
  Truck,
  Search,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  X,
  SkipForward
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'

interface OnboardingStep {
  stepNumber: number
  stepName: string
  prompt: string
  inputType: 'single_select' | 'multi_select' | 'text' | 'textarea' | 'api_key' | 'number' | 'slider' | 'research_apis'
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
  serviceType?: string
  docsUrl?: string
  section?: string
  placeholder?: string
  prefix?: string
  min?: number
  max?: number
}

interface OnboardingWizardProps {
  storeId: string
  onComplete: () => void
  onSkip?: () => void
}

// Section icons mapping
const sectionIcons: Record<string, any> = {
  'Business Goals': Target,
  'Store Identity': Store,
  'Product Strategy': Package,
  'Target Audience': Users,
  'Brand & Marketing': Megaphone,
  'Marketing Strategy': TrendingUp,
  'Operations': Settings,
}

// Simplified integration steps - OpenWeb Ninja APIs grouped into one step
const INTEGRATION_STEPS: OnboardingStep[] = [
  {
    stepNumber: 1,
    stepName: 'meta_ads',
    prompt: 'Connect your Meta (Facebook) Ads API to enable automated ad campaign creation and management. This allows the AI to create, optimize, and manage your Facebook and Instagram ads.',
    inputType: 'api_key',
    serviceType: 'meta_ads',
    docsUrl: 'https://developers.facebook.com/docs/marketing-api/overview',
    validation: { required: false }
  },
  {
    stepNumber: 2,
    stepName: 'cj_dropshipping',
    prompt: 'Connect CJ Dropshipping for automated product sourcing and fulfillment. This enables the AI to import products, sync inventory, and handle order fulfillment.',
    inputType: 'api_key',
    serviceType: 'cj_dropshipping',
    docsUrl: 'https://cjdropshipping.com/api',
    validation: { required: false }
  },
  {
    stepNumber: 3,
    stepName: 'shopify',
    prompt: 'Connect your Shopify store API to enable automated store building, product listing creation, and inventory management. The AI can create products, collections, and themes.',
    inputType: 'api_key',
    serviceType: 'shopify',
    docsUrl: 'https://shopify.dev/docs/api/admin',
    validation: { required: false }
  },
  {
    stepNumber: 4,
    stepName: 'research_apis',
    prompt: 'Connect Research APIs for product research. You can use ShoppDropp\'s built-in research (powered by OpenWeb Ninja) or add your own API keys for Amazon, Walmart, eBay, Product Search, and E-commerce Data.',
    inputType: 'research_apis',
    serviceType: 'research_apis',
    validation: { required: false }
  },
  {
    stepNumber: 5,
    stepName: 'google_trends',
    prompt: 'Connect Google Trends API to analyze search trends and seasonality. This helps the AI identify rising products and optimal timing for launches.',
    inputType: 'api_key',
    serviceType: 'google_trends',
    docsUrl: 'https://developers.google.com/trends',
    validation: { required: false }
  },
]

export function OnboardingWizard({ storeId, onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [stepData, setStepData] = useState<OnboardingStep | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [textValue, setTextValue] = useState('')
  const [numberValue, setNumberValue] = useState('')
  const [apiKeyValue, setApiKeyValue] = useState('')
  const [apiKeySecret, setApiKeySecret] = useState('')
  const [error, setError] = useState('')
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [isIntegrationPhase, setIsIntegrationPhase] = useState(false)
  const [totalSteps, setTotalSteps] = useState(27)
  const [currentSection, setCurrentSection] = useState('')
  const [allSections, setAllSections] = useState<string[]>([])

  // Research API form state
  const [researchChoice, setResearchChoice] = useState<'shoppdropp' | 'own' | null>(null)
  const [researchAPIs, setResearchAPIs] = useState({
    amazon: '',
    walmart: '',
    ebay: '',
    product_search: '',
    ecommerce: ''
  })

  // Fetch current step data
  useEffect(() => {
    fetchStepData()
  }, [currentStep, storeId])

  const fetchStepData = async () => {
    setLoading(true)
    setError('')
    try {
      // Check if we're in integration phase (after all onboarding questions)
      if (isIntegrationPhase) {
        const integrationIndex = currentStep - totalSteps - 1
        if (integrationIndex >= 0 && integrationIndex < INTEGRATION_STEPS.length) {
          setStepData(INTEGRATION_STEPS[integrationIndex])
        } else if (integrationIndex >= INTEGRATION_STEPS.length) {
          setIsComplete(true)
        }
        setLoading(false)
        return
      }

      // Fetch from backend
      const step = await api.request(`/onboarding/step/${storeId}`)
      
      if (step.isComplete) {
        // Move to integration phase
        setIsIntegrationPhase(true)
        setCurrentStep(totalSteps + 1)
        setLoading(false)
        return
      }
      
      setStepData(step)
      setTotalSteps(step.totalSteps || 27)
      setCurrentSection(step.section || '')
      
      // Build sections list from step data
      if (step.section && !allSections.includes(step.section)) {
        setAllSections(prev => [...prev, step.section])
      }
      
      setIsIntegrationPhase(false)
      setSelectedValues([])
      setTextValue('')
      setNumberValue('')
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

  const handleSkipAll = async () => {
    // Skip all remaining integration steps
    setIsComplete(true)
    setTimeout(() => {
      onComplete()
    }, 1500)
  }

  const handleContinue = async () => {
    setSaving(true)
    setError('')

    try {
      // Handle integration API key steps
      if (isIntegrationPhase && stepData?.inputType === 'api_key') {
        // Save API credentials if provided (optional)
        if (apiKeyValue.trim()) {
          await api.request(`/stores/${storeId}/credentials`, {
            method: 'POST',
            body: JSON.stringify({
              type: stepData.serviceType,
              credentials: {
                api_key: apiKeyValue,
                api_secret: apiKeySecret || undefined,
              },
            }),
          })
        }
        
        setCompletedSteps(prev => [...prev, currentStep])
        
        const integrationIndex = currentStep - totalSteps - 1
        if (integrationIndex >= INTEGRATION_STEPS.length - 1) {
          setIsComplete(true)
          setTimeout(() => {
            onComplete()
          }, 2000)
        } else {
          setCurrentStep(currentStep + 1)
        }
      } else if (isIntegrationPhase && stepData?.inputType === 'research_apis') {
        // Handle research APIs form
        if (researchChoice === 'own') {
          // Save any provided research API keys
          const apisToSave = [
            { key: 'openwebninja_amazon', value: researchAPIs.amazon },
            { key: 'openwebninja_walmart', value: researchAPIs.walmart },
            { key: 'openwebninja_ebay', value: researchAPIs.ebay },
            { key: 'openwebninja_product_search', value: researchAPIs.product_search },
            { key: 'openwebninja_ecommerce', value: researchAPIs.ecommerce },
          ]

          for (const apiItem of apisToSave) {
            if (apiItem.value.trim()) {
              await api.request(`/stores/${storeId}/credentials`, {
                method: 'POST',
                body: JSON.stringify({
                  type: apiItem.key,
                  credentials: { api_key: apiItem.value },
                }),
              })
            }
          }
        } else {
          // Save choice to use ShoppDropp APIs
          await api.request(`/stores/${storeId}/credentials`, {
            method: 'POST',
            body: JSON.stringify({
              type: 'research_api_choice',
              credentials: {
                choice: 'use_shoppdropp',
                use_shoppdropp: true,
              },
            }),
          })
        }
        
        setCompletedSteps(prev => [...prev, currentStep])
        setCurrentStep(currentStep + 1)
      } else {
        // Regular onboarding steps
        let dataToSend: any
        if (stepData?.inputType === 'text' || stepData?.inputType === 'textarea') {
          dataToSend = textValue
        } else if (stepData?.inputType === 'number') {
          dataToSend = parseFloat(numberValue) || 0
        } else if (stepData?.inputType === 'single_select') {
          dataToSend = selectedValues[0]
        } else {
          dataToSend = selectedValues
        }

        const response = await api.request(`/onboarding/step/${storeId}`, {
          method: 'POST',
          body: JSON.stringify({
            stepNumber: currentStep,
            stepName: stepData?.stepName,
            data: dataToSend,
          }),
        })

        setCompletedSteps(prev => [...prev, currentStep])

        if (response.isComplete) {
          // Move to integration phase after main onboarding
          setIsIntegrationPhase(true)
          setCurrentStep(totalSteps + 1)
        } else {
          setCurrentStep(response.nextStep)
        }
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

  const getStepIcon = () => {
    if (isIntegrationPhase) {
      const integrationIndex = currentStep - totalSteps - 1
      const step = INTEGRATION_STEPS[integrationIndex]
      const serviceType = step?.serviceType
      
      if (serviceType === 'research_apis') {
        return Search
      }
      
      switch (serviceType) {
        case 'meta_ads': return Megaphone
        case 'cj_dropshipping': return Truck
        case 'shopify': return ShoppingBag
        case 'google_trends': return BarChart3
        default: return Key
      }
    }
    return sectionIcons[currentSection] || Target
  }

  const getStepTitle = () => {
    if (isIntegrationPhase) {
      const integrationIndex = currentStep - totalSteps - 1
      const step = INTEGRATION_STEPS[integrationIndex]
      if (step) {
        return step.stepName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      }
      return 'Integration'
    }
    return stepData?.section || 'Setup'
  }

  const getProgressText = () => {
    if (isIntegrationPhase) {
      const integrationIndex = currentStep - totalSteps
      return `Integration ${integrationIndex} of ${INTEGRATION_STEPS.length}`
    }
    return `Question ${currentStep} of ${totalSteps}`
  }

  const getTotalProgress = () => {
    const total = totalSteps + INTEGRATION_STEPS.length
    const current = isIntegrationPhase ? currentStep : currentStep
    return Math.round(((current - 1) / total) * 100)
  }

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
            Your store and integrations are configured! The AI now has everything it needs.
          </p>
          <div className="flex items-center justify-center gap-2 text-violet-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Starting your AI agent...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  const StepIcon = getStepIcon()

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl bg-[#111118] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex"
      >
        {/* LEFT - Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/20 rounded-xl">
                  <StepIcon className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">{getProgressText()}</p>
                  <h2 className="text-xl font-semibold text-white">{getStepTitle()}</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isIntegrationPhase && (
                  <button
                    onClick={handleSkipAll}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip All
                  </button>
                )}
                {onSkip && !isIntegrationPhase && (
                  <button
                    onClick={onSkip}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Skip for now
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-1">
              {Array.from({ length: 20 }, (_, i) => {
                const total = totalSteps + INTEGRATION_STEPS.length
                const progress = ((currentStep - 1) / total) * 20
                return (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      i < progress
                        ? 'bg-green-500'
                        : i < progress + 1
                        ? 'bg-violet-500'
                        : 'bg-white/10'
                    }`}
                  />
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto flex-1">
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

                  {/* Research APIs Form */}
                  {stepData.inputType === 'research_apis' && (
                    <div className="space-y-6">
                      {/* Choice */}
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-300">
                          Choose how to handle research:
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setResearchChoice('shoppdropp')}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              researchChoice === 'shoppdropp'
                                ? 'bg-violet-500/20 border-violet-500'
                                : 'bg-white/5 border-white/10 hover:border-white/30'
                            }`}
                          >
                            <div className="font-medium text-white">Use ShoppDropp APIs</div>
                            <div className="text-sm text-slate-400 mt-1">Powered by OpenWeb Ninja - no setup needed</div>
                          </button>
                          <button
                            onClick={() => setResearchChoice('own')}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                              researchChoice === 'own'
                                ? 'bg-violet-500/20 border-violet-500'
                                : 'bg-white/5 border-white/10 hover:border-white/30'
                            }`}
                          >
                            <div className="font-medium text-white">Use My Own APIs</div>
                            <div className="text-sm text-slate-400 mt-1">Enter your OpenWeb Ninja API keys</div>
                          </button>
                        </div>
                      </div>

                      {/* API Key Inputs (only if choosing own) */}
                      {researchChoice === 'own' && (
                        <div className="space-y-4 p-4 bg-white/5 rounded-xl">
                          <p className="text-sm text-slate-400 mb-4">Enter your OpenWeb Ninja API keys (all optional):</p>
                          
                          {[
                            { key: 'amazon', label: 'Amazon API', placeholder: 'Amazon API key' },
                            { key: 'walmart', label: 'Walmart API', placeholder: 'Walmart API key' },
                            { key: 'ebay', label: 'eBay API', placeholder: 'eBay API key' },
                            { key: 'product_search', label: 'Product Search API', placeholder: 'Product Search API key' },
                            { key: 'ecommerce', label: 'E-commerce Data API', placeholder: 'E-commerce API key' },
                          ].map((api) => (
                            <div key={api.key}>
                              <label className="block text-sm font-medium text-slate-300 mb-2">
                                {api.label}
                              </label>
                              <input
                                type="password"
                                value={researchAPIs[api.key as keyof typeof researchAPIs]}
                                onChange={(e) => setResearchAPIs(prev => ({ ...prev, [api.key]: e.target.value }))}
                                placeholder={`${api.placeholder} (optional)`}
                                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* API Key Input */}
                  {stepData.inputType === 'api_key' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                        <h4 className="font-medium text-white mb-2">{stepData.stepName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Configuration</h4>
                        <p className="text-sm text-slate-400 mb-4">
                          This is optional. You can skip this and add it later in Settings.
                        </p>
                        <a 
                          href={stepData.docsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-violet-400 hover:text-violet-300 underline"
                        >
                          How to get your API key →
                        </a>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          API Key
                        </label>
                        <input
                          type="password"
                          value={apiKeyValue}
                          onChange={(e) => setApiKeyValue(e.target.value)}
                          placeholder="Enter API key (optional)"
                          className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
                        />
                      </div>
                      
                      {(stepData.serviceType === 'shopify' || stepData.serviceType === 'meta_ads') && (
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            API Secret / Access Token (if required)
                          </label>
                          <input
                            type="password"
                            value={apiKeySecret}
                            onChange={(e) => setApiKeySecret(e.target.value)}
                            placeholder="Enter secret (optional)"
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text/Number Inputs */}
                  {stepData.inputType === 'text' && (
                    <input
                      type="text"
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      placeholder={stepData.placeholder || "Enter your answer..."}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                    />
                  )}

                  {stepData.inputType === 'textarea' && (
                    <textarea
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      placeholder={stepData.placeholder || "Describe your niche..."}
                      className="w-full h-32 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    />
                  )}

                  {stepData.inputType === 'number' && (
                    <div className="relative">
                      {stepData.prefix && (
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          {stepData.prefix}
                        </span>
                      )}
                      <input
                        type="number"
                        value={numberValue}
                        onChange={(e) => setNumberValue(e.target.value)}
                        placeholder={stepData.placeholder || "Enter amount..."}
                        min={stepData.min}
                        max={stepData.max}
                        className={`w-full ${stepData.prefix ? 'pl-8' : 'px-4'} py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500`}
                      />
                    </div>
                  )}

                  {/* Select Options */}
                  {(stepData.inputType === 'single_select' || stepData.inputType === 'multi_select') && stepData.options && (
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
                  {isIntegrationPhase
                    ? `Integration ${currentStep - totalSteps} of ${INTEGRATION_STEPS.length}`
                    : selectedValues.length > 0 && stepData?.inputType === 'multi_select' 
                      ? `${selectedValues.length} selected`
                      : `${getTotalProgress()}% complete`
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
                  ) : isIntegrationPhase && currentStep === totalSteps + INTEGRATION_STEPS.length ? (
                    <>
                      Finish Setup
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
        </div>

        {/* RIGHT - Progress Sidebar */}
        <div className="w-72 bg-gradient-to-b from-violet-950/30 to-purple-950/30 border-l border-white/10 p-6 flex flex-col">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
            Setup Progress
          </h3>
          
          <div className="flex-1 space-y-4 overflow-y-auto">
            {/* Onboarding Sections */}
            <div>
              <p className="text-xs text-slate-500 mb-2">Onboarding Questions</p>
              <div className="space-y-2">
                {[
                  { name: 'Business Goals', icon: Target },
                  { name: 'Store Identity', icon: Store },
                  { name: 'Product Strategy', icon: Package },
                  { name: 'Target Audience', icon: Users },
                  { name: 'Brand & Marketing', icon: Megaphone },
                  { name: 'Marketing Strategy', icon: TrendingUp },
                  { name: 'Operations', icon: Settings },
                ].map((section) => {
                  const SectionIcon = section.icon
                  const isActive = currentSection === section.name && !isIntegrationPhase
                  const isCompleted = allSections.includes(section.name) && currentSection !== section.name
                  
                  return (
                    <div 
                      key={section.name}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                        isActive 
                          ? 'bg-violet-500/20 text-violet-300' 
                          : isCompleted
                          ? 'text-green-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <SectionIcon className="w-4 h-4" />
                      )}
                      <span>{section.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Integration Steps */}
            <div>
              <p className="text-xs text-slate-500 mb-2">API Integrations</p>
              <div className="space-y-2">
                {INTEGRATION_STEPS.map((step, idx) => {
                  const stepNum = totalSteps + idx + 1
                  const isActive = isIntegrationPhase && currentStep === stepNum
                  const isCompleted = isIntegrationPhase && currentStep > stepNum
                  
                  return (
                    <div 
                      key={step.stepName}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                        isActive 
                          ? 'bg-violet-500/20 text-violet-300' 
                          : isCompleted
                          ? 'text-green-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Key className="w-4 h-4" />
                      )}
                      <span>{step.stepName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Progress</span>
              <span className="text-white font-medium">{getTotalProgress()}%</span>
            </div>
            <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-300"
                style={{ width: `${getTotalProgress()}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}