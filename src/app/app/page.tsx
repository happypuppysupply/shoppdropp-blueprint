'use client'

import { useStore } from '@/components/dashboard/StoreLayout'
import { StoreContent } from '@/components/dashboard/StoreContent'

export default function AppPage() {
  const { selectedStore, stores } = useStore()
  
  // If no store selected, show store list (handled by StoreLayout sidebar)
  // If store selected, show store content
  if (selectedStore) {
    const store = selectedStore === 'demo' 
      ? { 
          id: 'demo', 
          name: 'Demo Store', 
          url: 'https://demo-store.myshopify.com', 
          status: 'active', 
          worker_id: 'demo-worker-123' 
        }
      : stores.find(s => s.id === selectedStore)
    
    if (store) {
      return <StoreContent store={store} />
    }
  }
  
  // No store selected - StoreLayout shows the store list in sidebar
  // Main area shows welcome message
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Welcome to ShoppDropp</h1>
        <p className="text-slate-400 mb-6">
          Select a store from the sidebar or create a new one to get started with AI-powered dropshipping automation.
        </p>
        <div className="flex gap-3 justify-center">
          <button 
            onClick={() => {/* StoreLayout handles this */}}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg font-medium transition-colors"
          >
            Try Demo Store
          </button>
        </div>
      </div>
    </div>
  )
}
