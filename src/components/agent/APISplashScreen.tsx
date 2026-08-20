'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ExternalLink, CheckCircle2, Key, ShoppingBag, Truck, Share2, Package, Store, Search, Globe } from 'lucide-react'

interface APISplashScreenProps {
  onContinue: () => void
}

const APIS = [
  {
    id: 'shopify',
    name: 'Shopify',
    description: 'Your e-commerce platform for store management, products, orders, and customer data.',
    icon: ShoppingBag,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    signupUrl: 'https://www.shopify.com/signup',
    apiUrl: 'https://admin.shopify.com/store/YOUR_STORE/settings/apps/development',
    instructions: 'Go to Settings > Apps and sales channels > Develop apps > Create an app > Configure Admin API scopes'
  },
  {
    id: 'cj_dropshipping',
    name: 'CJ Dropshipping',
    description: 'Supplier and fulfillment service for sourcing products and automated order processing.',
    icon: Truck,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    signupUrl: 'https://cjdropshipping.com/register',
    apiUrl: 'https://cjdropshipping.com/account.html#/api',
    instructions: 'Sign up for CJ account > Go to Account > API > Generate API Key'
  },
  {
    id: 'meta_ads',
    name: 'Meta Ads (Facebook)',
    description: 'Advertising platform for running Facebook and Instagram ad campaigns.',
    icon: Share2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    signupUrl: 'https://business.facebook.com/',
    apiUrl: 'https://developers.facebook.com/tools/explorer/',
    instructions: 'Go to Meta Business Suite > Settings > System Users > Generate Access Token'
  },
  {
    id: 'openwebninja_amazon',
    name: 'OpenWeb Ninja - Amazon Data',
    description: 'Real-time Amazon product data for market research, pricing, and competitor analysis.',
    icon: Package,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    signupUrl: 'https://api.openwebninja.com/',
    apiUrl: 'https://api.openwebninja.com/dashboard',
    instructions: 'Sign up > Dashboard > API Keys > Create New Key'
  },
  {
    id: 'openwebninja_walmart',
    name: 'OpenWeb Ninja - Walmart Data',
    description: 'Walmart product data API for price comparison and market research.',
    icon: Store,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    signupUrl: 'https://api.openwebninja.com/',
    apiUrl: 'https://api.openwebninja.com/dashboard',
    instructions: 'Same account as Amazon Data - one key accesses all endpoints'
  },
  {
    id: 'openwebninja_ebay',
    name: 'OpenWeb Ninja - eBay Data',
    description: 'eBay marketplace data for product research and competitive intelligence.',
    icon: Package,
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    signupUrl: 'https://api.openwebninja.com/',
    apiUrl: 'https://api.openwebninja.com/dashboard',
    instructions: 'Same account as Amazon Data - one key accesses all endpoints'
  },
  {
    id: 'openwebninja_product_search',
    name: 'OpenWeb Ninja - Product Search',
    description: 'Cross-platform product search across multiple marketplaces simultaneously.',
    icon: Search,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    signupUrl: 'https://api.openwebninja.com/',
    apiUrl: 'https://api.openwebninja.com/dashboard',
    instructions: 'Same account as Amazon Data - one key accesses all endpoints'
  },
  {
    id: 'openwebninja_ecommerce',
    name: 'OpenWeb Ninja - E-commerce Data',
    description: 'Multi-platform e-commerce intelligence and market analysis.',
    icon: Globe,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    signupUrl: 'https://api.openwebninja.com/',
    apiUrl: 'https://api.openwebninja.com/dashboard',
    instructions: 'Same account as Amazon Data - one key accesses all endpoints'
  }
]

export function APISplashScreen({ onContinue }: APISplashScreenProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checked)
    if (newChecked.has(id)) {
      newChecked.delete(id)
    } else {
      newChecked.add(id)
    }
    setChecked(newChecked)
  }

  const allChecked = checked.size === APIS.length

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-violet-500/30 flex items-center justify-center">
            <Key className="w-5 h-5 text-violet-300" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Connect Your Platforms</h3>
            <p className="text-slate-400 text-sm">You'll need API keys from all 8 services</p>
          </div>
        </div>
        <p className="text-slate-300 text-sm">
          Below are all the platforms and research APIs you'll need. Click each to learn more and get your API keys.
        </p>
      </div>

      <div className="grid gap-3">
        {APIS.map((api) => {
          const Icon = api.icon
          const isChecked = checked.has(api.id)
          
          return (
            <Card 
              key={api.id} 
              className={`p-4 bg-[#111118] border transition-all cursor-pointer ${
                isChecked ? 'border-green-500/50 bg-green-500/10' : 'border-white/10 hover:border-white/20'
              }`}
              onClick={() => toggleCheck(api.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${api.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${api.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-medium">{api.name}</h4>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                      isChecked ? 'bg-green-500 border-green-500' : 'border-slate-600'
                    }`}>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-2">{api.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={api.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 bg-violet-500/10 px-2 py-1 rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      Sign Up
                    </a>
                    <a
                      href={api.apiUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300 bg-white/5 px-2 py-1 rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Key className="w-3 h-3" />
                      Get API Key
                    </a>
                  </div>
                  
                  <p className="text-slate-500 text-xs mt-2">
                    <span className="text-slate-600">How to:</span> {api.instructions}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-400 text-sm">
            Progress: {checked.size} of {APIS.length} ready
          </span>
          {allChecked && (
            <span className="text-green-400 text-sm flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              All ready!
            </span>
          )}
        </div>
        
        <Button
          className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!allChecked}
          onClick={onContinue}
        >
          {allChecked ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Continue to Enter API Keys
            </>
          ) : (
            `Check all ${APIS.length} platforms to continue`
          )}
        </Button>
        
        {!allChecked && (
          <p className="text-slate-500 text-xs text-center mt-2">
            Click each platform above to mark it as ready
          </p>
        )}
      </div>
    </div>
  )
}
