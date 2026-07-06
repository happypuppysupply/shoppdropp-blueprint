"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const uiScreens = [
  {
    id: "login",
    name: "Login / Sign Up",
    category: "Auth",
    description: "Email, Google, GitHub authentication",
    elements: ["Email input", "Password field", "OAuth buttons", "Forgot password"]
  },
  {
    id: "dashboard",
    name: "Dashboard Home",
    category: "Dashboard",
    description: "Overview of all projects and stats",
    elements: ["Project cards", "Quick stats", "Recent activity", "Create project CTA"]
  },
  {
    id: "projects-list",
    name: "Projects List",
    category: "Dashboard",
    description: "View and manage all projects",
    elements: ["Grid/List view", "Status badges", "Search/Filter", "Sort options"]
  },
  {
    id: "project-create",
    name: "Create Project",
    category: "Project",
    description: "Start new dropshipping project",
    elements: ["Project name", "Niche selection", "Description", "Template picker"]
  },
  {
    id: "wizard-step1",
    name: "Wizard - Connect Shopify",
    category: "Onboarding",
    description: "Step 3: Shopify store connection",
    elements: ["Store URL input", "API token field", "Test connection", "Help tooltip"]
  },
  {
    id: "wizard-step2",
    name: "Wizard - Connect AutoDS",
    category: "Onboarding",
    description: "Step 4: AutoDS integration",
    elements: ["API key input", "Validation status", "Webhook config", "Skip option"]
  },
  {
    id: "wizard-step3",
    name: "Wizard - AI Provider",
    category: "Onboarding",
    description: "Step 5: AI provider setup",
    elements: ["Provider dropdown", "API key input", "Model selection", "Test generation"]
  },
  {
    id: "wizard-review",
    name: "Wizard - Review",
    category: "Onboarding",
    description: "Step 7: Review configuration",
    elements: ["Config summary", "Validation status", "Edit links", "Launch button"]
  },
  {
    id: "wizard-building",
    name: "Wizard - Building",
    category: "Onboarding",
    description: "Step 11: Real-time build progress",
    elements: ["Progress bar", "Live logs", "Current step", "ETA indicator"]
  },
  {
    id: "project-detail",
    name: "Project Detail",
    category: "Project",
    description: "Manage individual project",
    elements: ["Status header", "Worker stats", "Action buttons", "Settings tabs"]
  },
  {
    id: "worker-monitor",
    name: "Worker Monitor",
    category: "Monitoring",
    description: "Real-time worker status",
    elements: ["CPU/RAM charts", "Job queue", "Live logs", "Restart controls"]
  },
  {
    id: "store-builder",
    name: "Store Builder",
    category: "Build",
    description: "Visual store building interface",
    elements: ["Theme preview", "Section editor", "Product grid", "SEO panel"]
  },
  {
    id: "products-import",
    name: "Products Import",
    category: "Products",
    description: "AutoDS product import center",
    elements: ["Search products", "Import queue", "Pricing rules", "Category mapping"]
  },
  {
    id: "collections",
    name: "Collections Manager",
    category: "Products",
    description: "Organize products into collections",
    elements: ["Collection list", "Product assignment", "Smart rules", "Visual editor"]
  },
  {
    id: "meta-ads",
    name: "Meta Ads Manager",
    category: "Marketing",
    description: "Facebook/Instagram ad campaigns",
    elements: ["Campaign list", "Create campaign", "Audience builder", "Budget settings"]
  },
  {
    id: "ad-creative",
    name: "Ad Creative Studio",
    category: "Marketing",
    description: "Generate and manage ad creatives",
    elements: ["Image generator", "Video creator", "Copy variations", "A/B test setup"]
  },
  {
    id: "analytics",
    name: "Analytics Dashboard",
    category: "Analytics",
    description: "Store and ad performance metrics",
    elements: ["Revenue chart", "Traffic sources", "Conversion funnel", "ROI calculator"]
  },
  {
    id: "billing",
    name: "Billing & Usage",
    category: "Billing",
    description: "Subscription and usage tracking",
    elements: ["Current plan", "Usage meter", "Invoice history", "Upgrade options"]
  },
  {
    id: "api-keys",
    name: "API Keys Manager",
    category: "Settings",
    description: "Manage external API credentials",
    elements: ["Key list", "Add key form", "Test buttons", "Security warnings"]
  },
  {
    id: "settings",
    name: "Account Settings",
    category: "Settings",
    description: "User profile and preferences",
    elements: ["Profile form", "Notification prefs", "Team members", "Danger zone"]
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
          <p className="text-slate-400 text-sm md:text-base">Interactive preview of all ShoppDropp user interface screens</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 w-fit">{uiScreens.length} Screens</Badge>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            selectedCategory === null
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
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
            <div className="relative overflow-hidden rounded-xl bg-slate-900/50 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
              {/* Mock Screen Preview */}
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 p-3 relative">
                {/* Header mock */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded bg-purple-500/30" />
                  <div className="h-3 w-20 bg-white/20 rounded" />
                  <div className="ml-auto flex gap-1">
                    <div className="w-4 h-4 rounded-full bg-white/10" />
                    <div className="w-4 h-4 rounded-full bg-white/10" />
                  </div>
                </div>
                {/* Content mock */}
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                  <div className="h-3 w-full bg-white/5 rounded" />
                  <div className="h-3 w-5/6 bg-white/5 rounded" />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="h-16 bg-white/5 rounded" />
                    <div className="h-16 bg-white/5 rounded" />
                  </div>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium">View Details</span>
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
            className="w-full max-w-2xl max-h-[90vh] overflow-auto bg-slate-900 rounded-2xl border border-white/10 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="mb-2">{selectedScreen.category}</Badge>
                  <h2 className="text-xl font-bold text-white">{selectedScreen.name}</h2>
                  <p className="text-slate-400 mt-1">{selectedScreen.description}</p>
                </div>
                <button
                  onClick={() => setSelectedScreen(null)}
                  className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* UI Elements List */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-3">UI Elements</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedScreen.elements.map((element, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/5 text-slate-300 rounded-lg text-sm">
                      {element}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mockup Preview */}
              <div className="rounded-xl bg-slate-800 p-4 border border-white/5">
                <div className="bg-slate-900 rounded-lg p-4">
                  {/* App Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
                      <div className="h-4 w-24 bg-white/20 rounded" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/10" />
                    </div>
                  </div>
                  {/* Page Content */}
                  <div className="space-y-4">
                    <div className="h-8 w-1/2 bg-white/10 rounded" />
                    <div className="h-4 w-full bg-white/5 rounded" />
                    <div className="h-4 w-4/5 bg-white/5 rounded" />
                    <div className="grid grid-cols-3 gap-3 mt-6">
                      <div className="h-24 bg-purple-500/10 rounded-lg border border-purple-500/20" />
                      <div className="h-24 bg-purple-500/10 rounded-lg border border-purple-500/20" />
                      <div className="h-24 bg-purple-500/10 rounded-lg border border-purple-500/20" />
                    </div>
                    <div className="mt-6 p-4 bg-white/5 rounded-lg">
                      <div className="h-4 w-1/3 bg-white/20 rounded mb-3" />
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-white/5 rounded" />
                        <div className="h-3 w-5/6 bg-white/5 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Hint */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">User Flow Context</p>
                    <p className="text-slate-400 text-sm">This screen is part of the {selectedScreen.category.toLowerCase()} flow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Flow Section */}
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">User Flow Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Flow Line */}
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500/20" />
            
            {/* Flow Steps */}
            <div className="space-y-6">
              {[
                { step: 1, title: "Authentication", screens: ["Login / Sign Up"], desc: "User signs in or creates account" },
                { step: 2, title: "Dashboard Discovery", screens: ["Dashboard Home", "Projects List"], desc: "Explore existing projects or create new" },
                { step: 3, title: "Project Creation", screens: ["Create Project"], desc: "Set up new dropshipping project" },
                { step: 4, title: "Onboarding Wizard", screens: ["Wizard - Connect Shopify", "Wizard - Connect AutoDS", "Wizard - AI Provider", "Wizard - Review"], desc: "Configure integrations step by step" },
                { step: 5, title: "Build Process", screens: ["Wizard - Building"], desc: "AI builds the store automatically" },
                { step: 6, title: "Store Management", screens: ["Project Detail", "Store Builder", "Products Import", "Collections"], desc: "Manage and optimize the store" },
                { step: 7, title: "Marketing", screens: ["Meta Ads Manager", "Ad Creative Studio"], desc: "Launch and manage ad campaigns" },
                { step: 8, title: "Analytics & Billing", screens: ["Analytics Dashboard", "Billing & Usage"], desc: "Track performance and manage subscription" },
              ].map((flow, i) => (
                <div key={i} className="relative pl-12 md:pl-16">
                  {/* Step Number */}
                  <div className="absolute left-0 md:left-2 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{flow.step}</span>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-purple-500/30 transition-colors">
                    <h3 className="text-white font-semibold mb-1">{flow.title}</h3>
                    <p className="text-slate-400 text-sm mb-3">{flow.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {flow.screens.map((screen, j) => (
                        <span key={j} className="px-2 py-1 bg-purple-500/10 text-purple-300 rounded text-xs">
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
