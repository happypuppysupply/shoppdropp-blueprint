'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Check, 
  Loader2,
  RefreshCw,
  TrendingUp,
  Target,
  Store,
  Package,
  Users,
  Megaphone,
  Settings,
  ChevronRight,
  Bot
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { ONBOARDING_QUESTIONS } from '@/lib/onboarding-questions'

interface Message {
  id: string
  role: 'assistant' | 'user'
  content: string
  type?: 'text' | 'question' | 'form'
  formData?: {
    questionId: string
    type: 'cards' | 'chips' | 'text' | 'number' | 'slider'
    options?: string[]
    multi?: boolean
    placeholder?: string
    section: string
  }
}

interface AIOnboardingProps {
  storeId: string
  onComplete: () => void
  onRestart?: () => void
}

// Expert VC/Banker persona system prompt
const EXPERT_PERSONA = `You are a world-class Venture Capitalist and former NYC investment banker who has built and scaled dozens of e-commerce businesses to 8-9 figures. You are now advising the user on their dropshipping business.

Your expertise includes:
- Shopify store optimization and conversion rate optimization
- Product research and market validation
- Meta Ads (Facebook/Instagram) campaign strategy
- CJ Dropshipping operations and supplier management
- Brand positioning and pricing strategy
- Target audience analysis and customer personas
- Operations and automation

Tone: Professional, direct, insightful, encouraging but demanding excellence. You ask probing questions to understand their business deeply.

You are guiding them through a streamlined 5-question onboarding covering:
1. Store Identity (name and brand)
2. Product Strategy (categories and price range)
3. Target Audience (demographics and interests)
4. Marketing Strategy (channels and budget)
5. Operations (automation preferences)

Ask questions conversationally, one at a time, adapting based on their responses. After gathering all information, you'll have enough to build their complete business profile.`

export function AIOnboarding({ storeId, onComplete, onRestart }: AIOnboardingProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [textValue, setTextValue] = useState('')
  const [numberValue, setNumberValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isComplete, setIsComplete] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Start onboarding with AI greeting
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        id: 'greeting',
        role: 'assistant',
        content: "Hello! I'm your AI Business Advisor. I've helped scale dozens of e-commerce brands to 8 figures, and I'm here to build yours.\n\nI'll ask you 5 quick questions to understand your business vision, target market, and product preferences. This takes about 2 minutes and will allow me to create a complete business profile and launch your store.\n\nLet's get started...",
        type: 'text'
      }
      setMessages([greeting])
      
      // Show first question after greeting
      setTimeout(() => {
        showQuestion(0)
      }, 1000)
    }
  }, [])

  const showQuestion = (index: number) => {
    if (index >= ONBOARDING_QUESTIONS.length) {
      completeOnboarding()
      return
    }

    const question = ONBOARDING_QUESTIONS[index]
    
    // AI formulates the question based on the structured data
    const aiQuestion: Message = {
      id: `q-${index}`,
      role: 'assistant',
      content: formulateQuestion(question, index),
      type: 'form',
      formData: {
        questionId: question.id,
        type: question.type,
        options: question.options,
        multi: question.multi,
        placeholder: question.placeholder,
        section: question.section
      }
    }

    setMessages(prev => [...prev, aiQuestion])
    setCurrentQuestionIndex(index)
    setSelectedValues([])
    setTextValue('')
    setNumberValue('')
  }

  const formulateQuestion = (question: any, index: number): string => {
    // AI formulates conversational question based on question data
    const formulations: Record<string, string> = {
      'business_goal': "First, let's understand your ambitions. Are you looking to build this as a side income stream, or are you aiming to create a scalable brand? This affects everything from product selection to marketing strategy.",
      'revenue_target': "Be specific with your numbers. What's your 12-month revenue target? I'm asking because this determines your marketing budget, product margins, and operational complexity.",
      'timeline': "How quickly do you need to see results? This helps me prioritize which strategies we deploy first.",
      'experience_level': "What's your experience with e-commerce? I need to know so I can calibrate my advice - whether you need step-by-step guidance or strategic direction.",
      'niche_category': "What market are you entering? The niche you choose will determine your competitive landscape, supplier options, and customer acquisition costs.",
      'niche_subcategory': "Let's get more specific within that category. The more focused your niche, the easier it is to dominate.",
      'store_name': "What will you call this business? Your brand name should resonate with your target audience and be memorable.",
      'brand_positioning': "How do you want customers to perceive your brand? Premium? Value-focused? Eco-conscious? This drives pricing and messaging.",
      'product_categories': "Which product categories interest you most? I can analyze profit margins, competition levels, and seasonality for each.",
      'price_range': "What's your target price point? This affects your customer lifetime value, ad costs, and supplier selection.",
      'product_criteria': "What matters most in your products? High margins? Fast shipping? Unique designs? I'll use this to filter opportunities.",
      'sourcing_preference': "Do you have preferences for sourcing? Some entrepreneurs prefer US suppliers for faster shipping, others prioritize cost.",
      'seasonal_products': "Are you open to seasonal products, or do you want year-round stability? Each has different cash flow patterns.",
      'target_audience': "Who exactly are we selling to? The more specific you are about demographics, the better I can target ads.",
      'audience_age': "What age range is your primary customer? This affects everything from ad creative to platform choice.",
      'audience_gender': "Is your product gender-specific, or universal?",
      'audience_income': "What's the income level of your target customer? This determines pricing strategy.",
      'customer_pain_points': "What problems are you solving for customers? The stronger the pain point, the easier the sale.",
      'purchase_behavior': "How do your customers typically make purchase decisions? Impulse buys? Research-heavy?",
      'brand_voice': "How should your brand sound? Professional? Playful? Luxurious? This affects all copywriting.",
      'visual_style': "What aesthetic are we going for? Minimal? Bold? Rustic? I'll use this for store design.",
      'brand_values': "What values should your brand embody? Sustainability? Innovation? Affordability?",
      'marketing_channels': "Which marketing channels do you want to prioritize? Meta Ads? Google? Organic?",
      'ad_budget': "What's your monthly ad budget? I need to know this to create realistic projections.",
      'acquisition_strategy': "How do you plan to acquire customers? Paid ads? Influencers? Content marketing?",
      'automation_level': "How hands-on do you want to be? Fully automated, or actively involved in daily operations?",
      'time_commitment': "How many hours per week can you dedicate to this business?",
    }

    return formulations[question.id] || question.question
  }

  const handleSelect = (option: string) => {
    const question = ONBOARDING_QUESTIONS[currentQuestionIndex]
    
    if (question.multi) {
      setSelectedValues(prev => 
        prev.includes(option) 
          ? prev.filter(v => v !== option)
          : [...prev, option]
      )
    } else {
      setSelectedValues([option])
      // Auto-submit for single select
      setTimeout(() => submitAnswer([option]), 300)
    }
  }

  const submitAnswer = async (value?: string | string[] | number) => {
    const question = ONBOARDING_QUESTIONS[currentQuestionIndex]
    let answerValue: any

    if (value !== undefined) {
      answerValue = value
    } else if (question.type === 'text') {
      if (!textValue.trim()) return
      answerValue = textValue
    } else if (question.type === 'number') {
      if (!numberValue.trim()) return
      answerValue = parseFloat(numberValue)
    } else {
      if (selectedValues.length === 0) return
      answerValue = question.multi ? selectedValues : selectedValues[0]
    }

    setLoading(true)

    try {
      // Save answer to backend
      await api.request(`/onboarding/step/${storeId}`, {
        method: 'POST',
        body: JSON.stringify({
          stepNumber: currentQuestionIndex + 1,
          stepName: question.id,
          data: answerValue,
        }),
      })

      // Update local state
      setAnswers(prev => ({ ...prev, [question.id]: answerValue }))

      // Show user's answer in chat
      const userResponse: Message = {
        id: `a-${currentQuestionIndex}`,
        role: 'user',
        content: Array.isArray(answerValue) ? answerValue.join(', ') : String(answerValue),
        type: 'text'
      }
      setMessages(prev => [...prev, userResponse])

      // Move to next question
      setTimeout(() => {
        showQuestion(currentQuestionIndex + 1)
      }, 500)

    } catch (err: any) {
      console.error('Failed to save answer:', err)
      // Show error but continue
      showQuestion(currentQuestionIndex + 1)
    } finally {
      setLoading(false)
    }
  }

  const completeOnboarding = async () => {
    setIsComplete(true)
    
    // Final AI message
    const completionMessage: Message = {
      id: 'complete',
      role: 'assistant',
      content: `Excellent! I've gathered all the information I need. Let me analyze your business profile and prepare your store configuration.\n\n**Summary of what I learned:**\n• Business Model: ${answers.business_goal || 'Not specified'}\n• Target Market: ${answers.niche_category || 'Not specified'}\n• Revenue Goal: ${answers.revenue_target || 'Not specified'}\n• Marketing Budget: ${answers.ad_budget || 'Not specified'}\n\nNow I'll configure your AI provider and research APIs, then we can start the product research workflow.`,
      type: 'text'
    }
    
    setMessages(prev => [...prev, completionMessage])
    
    // Configure system AI and APIs
    await configureSystemServices()
    
    setTimeout(() => {
      onComplete()
    }, 3000)
  }

  const configureSystemServices = async () => {
    try {
      // Configure system OpenRouter AI
      await api.request(`/ai/config`, {
        method: 'POST',
        body: JSON.stringify({
          useSystemAI: true,
          provider: 'openrouter',
          model: 'moonshotai/kimi-k2.5'
        })
      })

      // Configure system OpenWeb Ninja APIs
      await api.request(`/stores/${storeId}/credentials`, {
        method: 'POST',
        body: JSON.stringify({
          type: 'research_api_choice',
          credentials: {
            useSystemAPIs: true,
            choice: 'use_shoppdropp'
          }
        })
      })

    } catch (err) {
      console.error('Failed to configure system services:', err)
    }
  }

  const handleRestart = async () => {
    if (!confirm('This will reset all your onboarding progress. Continue?')) return
    
    try {
      await api.request(`/onboarding/reset/${storeId}`, { method: 'POST' })
      setMessages([])
      setAnswers({})
      setCurrentQuestionIndex(0)
      setIsComplete(false)
      if (onRestart) onRestart()
    } catch (err) {
      console.error('Failed to reset:', err)
    }
  }

  const currentQuestion = ONBOARDING_QUESTIONS[currentQuestionIndex]
  const progress = Math.round((currentQuestionIndex / ONBOARDING_QUESTIONS.length) * 100)

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-violet-900/50 to-purple-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-500/20 rounded-xl">
            <Bot className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Business Advisor</h3>
            <p className="text-xs text-slate-400">Strategic Onboarding</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
      <div className="h-1 bg-white/10">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-violet-500/20' : 'bg-pink-500/20'
            }`}>
              {msg.role === 'user' ? (
                <span className="text-xs text-violet-300">You</span>
              ) : (
                <Bot className="w-4 h-4 text-pink-400" />
              )}
            </div>
            
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
              {/* Text Message */}
              {msg.type === 'text' && (
                <div className={`p-3 rounded-lg whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-violet-500/20 text-white' 
                    : 'bg-white/5 text-slate-200'
                }`}>
                  {msg.content}
                </div>
              )}

              {/* Form Message */}
              {msg.type === 'form' && msg.formData && (
                <div className="space-y-3">
                  {/* AI Question Text */}
                  <div className="p-4 bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20 rounded-xl">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                      <p className="text-slate-200 leading-relaxed">{msg.content}</p>
                    </div>
                  </div>

                  {/* Form Inputs */}
                  {msg.formData.type === 'text' && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={textValue}
                        onChange={(e) => setTextValue(e.target.value)}
                        placeholder={msg.formData.placeholder || "Type your answer..."}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
                      />
                      <Button 
                        onClick={() => submitAnswer()}
                        disabled={!textValue.trim() || loading}
                        className="bg-violet-600 hover:bg-violet-500"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                    </div>
                  )}

                  {msg.formData.type === 'number' && (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={numberValue}
                        onChange={(e) => setNumberValue(e.target.value)}
                        placeholder={msg.formData.placeholder || "Enter amount..."}
                        className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        onKeyDown={(e) => e.key === 'Enter' && submitAnswer()}
                      />
                      <Button 
                        onClick={() => submitAnswer()}
                        disabled={!numberValue.trim() || loading}
                        className="bg-violet-600 hover:bg-violet-500"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                      </Button>
                    </div>
                  )}

                  {msg.formData.type === 'slider' && (
                    <div className="space-y-4 p-4 bg-white/5 rounded-xl">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={numberValue || '50'}
                        onChange={(e) => setNumberValue(e.target.value)}
                        className="w-full h-2 bg-violet-500/20 rounded-lg appearance-none cursor-pointer accent-violet-500"
                      />
                      <div className="flex justify-between text-sm text-slate-400">
                        <span>0</span>
                        <span className="text-violet-400 font-medium">{numberValue || '50'}</span>
                        <span>100</span>
                      </div>
                      <Button 
                        onClick={() => submitAnswer()}
                        disabled={loading}
                        className="w-full bg-violet-600 hover:bg-violet-500"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue'}
                      </Button>
                    </div>
                  )}

                  {(msg.formData.type === 'cards' || msg.formData.type === 'chips') && msg.formData.options && (
                    <div className={`grid gap-2 ${msg.formData.type === 'chips' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                      {msg.formData.options.map((option, idx) => {
                        const isSelected = selectedValues.includes(option)
                        
                        if (msg.formData?.type === 'chips') {
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
                              <div className={`w-5 h-5 rounded-${msg.formData?.multi ? 'md' : 'full'} border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                isSelected 
                                  ? 'border-violet-400 bg-violet-400' 
                                  : 'border-white/30'
                              }`}>
                                {isSelected && (
                                  msg.formData?.multi ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                              </div>
                              <span className="text-white">{option}</span>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Multi-select Submit Button */}
                  {msg.formData.multi && selectedValues.length > 0 && (
                    <Button 
                      onClick={() => submitAnswer()}
                      disabled={loading}
                      className="w-full bg-violet-600 hover:bg-violet-500"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <>
                          Continue with {selectedValues.length} selected
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Completion Overlay */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-10"
        >
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Onboarding Complete!</h3>
            <p className="text-slate-400">Preparing your research workflow...</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
