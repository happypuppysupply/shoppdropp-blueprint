"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppDroppLogo, ShoppDroppLogoSmall, ShoppDroppText } from "@/components/logo";
import { useState } from "react";

const uiScreens = [
  {
    id: "login",
    name: "Login / Sign Up",
    category: "Auth",
    description: "OAuth and email authentication with onboarding questions",
    elements: ["Google/GitHub OAuth", "Email/password", "Experience level selector", "Goals checklist"]
  },
  {
    id: "dashboard",
    name: "Dashboard Home",
    category: "Dashboard",
    description: "Main dashboard with stats, activity feed, and connected platforms",
    elements: ["Revenue cards", "AI Activity Feed", "Sales chart", "Platform status"]
  },
  {
    id: "connect-accounts",
    name: "Connect Accounts",
    category: "Onboarding",
    description: "Step 1: Connect all integrations (Shopify, AutoDS, Meta, TikTok, YouTube, AI)",
    elements: ["Integration grid", "Connection status", "Store niche input", "Security notice"]
  },
  {
    id: "ai-preferences",
    name: "AI Preferences",
    category: "Onboarding",
    description: "Step 2: Configure AI strategy, niche, audience, goals, and budget",
    elements: ["Niche selector", "Audience targeting", "Business goals", "Ad budget slider", "AI Strategy Preview panel"]
  },
  {
    id: "connect-tools",
    name: "Connect Your Tools",
    category: "Onboarding",
    description: "Step 3: API connection interface for all platforms",
    elements: ["API key inputs", "Connection status badges", "Encrypted security notice", "Platform cards"]
  },
  {
    id: "projects",
    name: "Projects List",
    category: "Dashboard",
    description: "View and manage all AI store projects",
    elements: ["Project cards", "Status indicators", "Quick actions", "Filter/search"]
  },
  {
    id: "products",
    name: "Products",
    category: "Store",
    description: "Product management and AutoDS integration",
    elements: ["Product grid", "Import from AutoDS", "Pricing rules", "Inventory sync"]
  },
  {
    id: "orders",
    name: "Orders",
    category: "Store",
    description: "Order management and fulfillment tracking",
    elements: ["Order list", "Status tracking", "Fulfillment details", "Export options"]
  },
  {
    id: "content",
    name: "Content",
    category: "Marketing",
    description: "AI-generated content management (blogs, descriptions, social)",
    elements: ["Content calendar", "AI generator", "Published posts", "Performance metrics"]
  },
  {
    id: "ads",
    name: "Ads Manager",
    category: "Marketing",
    description: "Meta and TikTok ad campaign management",
    elements: ["Campaign list", "Create campaign", "Budget/ROAS charts", "Audience targeting"]
  },
  {
    id: "analytics",
    name: "Analytics",
    category: "Analytics",
    description: "Store performance, traffic, and conversion analytics",
    elements: ["Revenue charts", "Traffic sources", "Conversion funnel", "AI insights"]
  },
  {
    id: "automation",
    name: "Automation",
    category: "AI",
    description: "Configure AI automation rules and workflows",
    elements: ["Automation rules", "Trigger setup", "Action sequences", "AI Agent status"]
  },
  {
    id: "ai-agent",
    name: "AI Agent",
    category: "AI",
    description: "Direct chat interface with the AI assistant",
    elements: ["Chat interface", "Suggested actions", "Task history", "AI status"]
  },
  {
    id: "integrations",
    name: "Integrations",
    category: "Settings",
    description: "Manage all connected platform integrations",
    elements: ["Platform cards", "Connection status", "API key management", "Webhook settings"]
  },
  {
    id: "settings",
    name: "Settings",
    category: "Settings",
    description: "Account settings, team management, and preferences",
    elements: ["Profile settings", "Team members", "Billing info", "Notification prefs"]
  }
];

const categories = [...new Set(uiScreens.map(s => s.category))];

export default function PlatformUIPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScreen, setSelectedScreen] = useState<typeof uiScreens[0] | null>(null);

  const filteredScreens = selectedCategory
    ? uiScreens.filter(s => s.category === selectedCategory)
    : uiScreens;

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Platform UI Gallery</h1>
          <p className="text-slate-400 text-sm md:text-base">Complete ShoppDropp SaaS interface preview</p>
        </div>
        <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 w-fit">{uiScreens.length} Screens</Badge>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === null
              ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white"
              : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Screen Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredScreens.map((screen, index) => (
          <div
            key={screen.id}
            onClick={() => setSelectedScreen(screen)}
            className="group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-2xl bg-[#111118] border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
              {/* Mock Screen Preview */}
              <div className="aspect-[4/3] bg-gradient-to-br from-[#0a0a0f] to-[#111118] p-3 relative">
                {/* Header mock with logo */}
                <div className="flex items-center gap-2 mb-3">
                  <ShoppDroppLogoSmall className="w-6 h-6" />
                  <div className="h-2 w-16 bg-white/20 rounded" />
                  <div className="ml-auto flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                  </div>
                </div>
                {/* Content mock */}
                <div className="space-y-2">
                  <div className="h-3 w-3/4 bg-gradient-to-r from-violet-500/30 to-pink-500/30 rounded" />
                  <div className="h-2 w-full bg-white/5 rounded" />
                  <div className="h-2 w-5/6 bg-white/5 rounded" />
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="h-14 bg-gradient-to-br from-violet-500/10 to-pink-500/10 rounded-lg border border-violet-500/20" />
                    <div className="h-14 bg-white/5 rounded-lg" />
                  </div>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-gradient-to-r from-violet-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium">View Details</span>
                </div>
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">{screen.category}</span>
                  <span className="text-xs text-slate-600">#{index + 1}</span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{screen.name}</h3>
                <p className="text-slate-400 text-xs line-clamp-2">{screen.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Screen Detail Modal */}
      {selectedScreen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedScreen(null)}
        >
          <div 
            className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-[#0a0a0f] rounded-2xl border border-white/10 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="mb-2 bg-violet-500/20 text-violet-400 border-violet-500/30">{selectedScreen.category}</Badge>
                  <h2 className="text-xl font-bold text-white">{selectedScreen.name}</h2>
                  <p className="text-slate-400 mt-1">{selectedScreen.description}</p>
                </div>
                <button
                  onClick={() => setSelectedScreen(null)}
                  className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* UI Elements */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Key UI Elements</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedScreen.elements.map((element, i) => (
                    <span key={i} className="px-3 py-1.5 bg-violet-500/10 text-violet-300 rounded-lg text-sm border border-violet-500/20">
                      {element}
                    </span>
                  ))}
                </div>
              </div>

              {/* Full Mockup Preview */}
              <div className="rounded-2xl bg-[#111118] p-4 border border-white/5">
                <div className="bg-[#0a0a0f] rounded-xl overflow-hidden border border-white/10">
                  {/* App Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#111118]">
                    <div className="flex items-center gap-3">
                      <ShoppDroppLogoSmall className="w-7 h-7" />
                      <ShoppDroppText className="text-base" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-violet-300">AI Ready</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
                    </div>
                  </div>

                  {/* Page Content - Dynamic based on screen type */}
                  <div className="p-4 space-y-4">
                    {/* Page Title */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-lg font-bold text-white">{selectedScreen.name}</h1>
                        <p className="text-xs text-slate-400">{selectedScreen.description}</p>
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-lg text-sm font-medium">
                        Action
                      </button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-slate-400">Metric 1</p>
                        <p className="text-lg font-bold text-white">$12.5K</p>
                        <p className="text-xs text-green-400">+18.5%</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-slate-400">Metric 2</p>
                        <p className="text-lg font-bold text-white">326</p>
                        <p className="text-xs text-green-400">+12.4%</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <p className="text-xs text-slate-400">Metric 3</p>
                        <p className="text-lg font-bold text-white">3.8x</p>
                        <p className="text-xs text-green-400">+22.7%</p>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="h-4 w-1/3 bg-white/20 rounded mb-3" />
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-white/5 rounded" />
                          <div className="h-3 w-5/6 bg-white/5 rounded" />
                          <div className="h-3 w-4/5 bg-white/5 rounded" />
                        </div>
                        <div className="mt-4 h-32 bg-gradient-to-br from-violet-500/10 to-pink-500/10 rounded-lg border border-violet-500/20 flex items-center justify-center">
                          <span className="text-violet-400 text-sm">Chart/Visualization</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="h-4 w-2/3 bg-white/20 rounded mb-3" />
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="h-2 w-20 bg-white/20 rounded" />
                              <div className="h-2 w-12 bg-white/10 rounded mt-1" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="h-2 w-16 bg-white/20 rounded" />
                              <div className="h-2 w-10 bg-white/10 rounded mt-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Integration Context */}
              <div className="p-4 bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">System Integration</p>
                    <p className="text-slate-400 text-sm">This screen connects to {selectedScreen.category.toLowerCase()} services via REST API</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Flow Section */}
      <Card className="bg-[#111118] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">User Journey Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Flow Line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-pink-500 to-violet-500/20" />
            
            {/* Flow Steps */}
            <div className="space-y-6">
              {[
                { step: 1, title: "Authentication", screens: ["Login / Sign Up"], desc: "OAuth or email signup with onboarding" },
                { step: 2, title: "Connect Accounts", screens: ["Connect Accounts"], desc: "Link Shopify, AutoDS, Meta, TikTok, YouTube, AI" },
                { step: 3, title: "AI Configuration", screens: ["AI Preferences"], desc: "Set niche, audience, goals, and budget" },
                { step: 4, title: "API Connections", screens: ["Connect Your Tools"], desc: "Enter API keys for all integrations" },
                { step: 5, title: "Dashboard", screens: ["Dashboard Home"], desc: "View store stats, activity feed, and metrics" },
                { step: 6, title: "Store Management", screens: ["Products", "Orders", "Content"], desc: "Manage products, orders, and AI content" },
                { step: 7, title: "Marketing", screens: ["Ads Manager", "Content"], desc: "Run Meta/TikTok ads and create content" },
                { step: 8, title: "Analytics & AI", screens: ["Analytics", "AI Agent", "Automation"], desc: "Monitor performance and configure AI" },
              ].map((flow, i) => (
                <div key={i} className="relative pl-12 md:pl-16">
                  {/* Step Number */}
                  <div className="absolute left-0 md:left-2 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{flow.step}</span>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-violet-500/30 transition-colors">
                    <h3 className="text-white font-semibold mb-1">{flow.title}</h3>
                    <p className="text-slate-400 text-sm mb-3">{flow.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {flow.screens.map((screen, j) => (
                        <span key={j} className="px-2 py-1 bg-violet-500/10 text-violet-300 rounded text-xs border border-violet-500/20">
                          {screen}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
