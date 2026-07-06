"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppDroppLogoSmall } from "@/components/logo";
import { useState } from "react";

const uiScreens = [
  {
    id: "login",
    name: "Login / Sign Up",
    category: "Auth",
    description: "OAuth and email authentication with onboarding",
    elements: ["Google/GitHub OAuth", "Email/password", "Onboarding questions", "Secure encryption"]
  },
  {
    id: "dashboard",
    name: "Dashboard Home",
    category: "Dashboard",
    description: "Main dashboard with stats, activity, and platform status",
    elements: ["Revenue cards", "AI Activity Feed", "Sales chart", "Platform connections"]
  },
  {
    id: "connect-accounts",
    name: "Connect Accounts",
    category: "Onboarding",
    description: "Connect Shopify, AutoDS, Meta, TikTok, YouTube, AI",
    elements: ["Integration grid", "Connection status", "Store niche", "Security notice"]
  },
  {
    id: "ai-preferences",
    name: "AI Preferences",
    category: "Onboarding",
    description: "Configure AI strategy, niche, audience, goals, budget",
    elements: ["Niche selector", "Audience targeting", "Business goals", "Ad budget", "AI Strategy Preview"]
  },
  {
    id: "connect-tools",
    name: "Connect Your Tools",
    category: "Onboarding",
    description: "API connection interface for all platforms",
    elements: ["API key inputs", "Connection status", "Encrypted security", "Platform cards"]
  },
  {
    id: "projects",
    name: "Projects",
    category: "Dashboard",
    description: "View and manage all AI store projects",
    elements: ["Project cards", "Status indicators", "Quick actions", "Filter/search"]
  },
  {
    id: "products",
    name: "Products",
    category: "Store",
    description: "Product management and AutoDS integration",
    elements: ["Product grid", "AutoDS import", "Pricing rules", "Inventory sync"]
  },
  {
    id: "orders",
    name: "Orders",
    category: "Store",
    description: "Order management and fulfillment",
    elements: ["Order list", "Status tracking", "Fulfillment", "Export"]
  },
  {
    id: "content",
    name: "Content",
    category: "Marketing",
    description: "AI-generated content management",
    elements: ["Content calendar", "AI generator", "Published posts", "Metrics"]
  },
  {
    id: "ads",
    name: "Ads",
    category: "Marketing",
    description: "Meta and TikTok ad campaign management",
    elements: ["Campaign list", "Create campaign", "Budget/ROAS", "Targeting"]
  },
  {
    id: "analytics",
    name: "Analytics",
    category: "Analytics",
    description: "Store performance and conversion analytics",
    elements: ["Revenue charts", "Traffic sources", "Conversion funnel", "AI insights"]
  },
  {
    id: "automation",
    name: "Automation",
    category: "AI",
    description: "Configure AI automation rules",
    elements: ["Automation rules", "Triggers", "Actions", "AI Agent status"]
  },
  {
    id: "ai-agent",
    name: "AI Agent",
    category: "AI",
    description: "Direct chat with AI assistant",
    elements: ["Chat interface", "Suggestions", "Task history", "AI status"]
  },
  {
    id: "integrations",
    name: "Integrations",
    category: "Settings",
    description: "Manage connected platform integrations",
    elements: ["Platform cards", "Connection status", "API keys", "Webhooks"]
  },
  {
    id: "settings",
    name: "Settings",
    category: "Settings",
    description: "Account settings and preferences",
    elements: ["Profile", "Team", "Billing", "Notifications"]
  }
];

const categories = [...new Set(uiScreens.map(s => s.category))];

// Unique mockup components for each screen
function LoginMockup() {
  return (
    <div className="h-full flex flex-col p-3">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 mb-3 flex items-center justify-center">
          <span className="text-white font-bold text-lg">S</span>
        </div>
        <div className="h-3 w-24 bg-white/20 rounded mb-4" />
        <div className="w-full space-y-2">
          <div className="h-8 bg-white/10 rounded-lg flex items-center px-3">
            <div className="w-4 h-4 rounded-full bg-white/20 mr-2" />
            <div className="h-2 w-20 bg-white/30 rounded" />
          </div>
          <div className="h-8 bg-white/10 rounded-lg flex items-center px-3">
            <div className="w-4 h-4 rounded-full bg-white/20 mr-2" />
            <div className="h-2 w-24 bg-white/30 rounded" />
          </div>
          <div className="h-8 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg flex items-center justify-center">
            <div className="h-2 w-16 bg-white/80 rounded" />
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
            <div className="w-3 h-3 rounded-sm bg-white/40" />
          </div>
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardMockup() {
  return (
    <div className="h-full p-3 space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/30">
          <div className="h-2 w-8 bg-white/40 rounded mb-1" />
          <div className="h-4 w-12 bg-white rounded" />
        </div>
        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
          <div className="h-2 w-8 bg-white/30 rounded mb-1" />
          <div className="h-4 w-10 bg-white/80 rounded" />
        </div>
        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
          <div className="h-2 w-8 bg-white/30 rounded mb-1" />
          <div className="h-4 w-10 bg-white/80 rounded" />
        </div>
      </div>
      <div className="h-16 rounded-lg bg-white/5 border border-white/10 p-2">
        <div className="h-2 w-16 bg-white/40 rounded mb-2" />
        <div className="flex items-end gap-1 h-8">
          {[40, 60, 45, 80, 55, 70, 65].map((h, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-violet-500 to-pink-500 rounded-sm" style={{height: `${h}%`}} />
          ))}
        </div>
      </div>
      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
        <div className="h-2 w-20 bg-white/40 rounded mb-2" />
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="h-2 w-20 bg-white/30 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="h-2 w-16 bg-white/30 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectAccountsMockup() {
  return (
    <div className="h-full p-3 space-y-2">
      <div className="h-2 w-32 bg-white/40 rounded mb-3" />
      <div className="grid grid-cols-3 gap-2">
        {['Shopify', 'AutoDS', 'Meta', 'TikTok', 'YouTube', 'AI'].map((name, i) => (
          <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/10 flex flex-col items-center">
            <div className={`w-6 h-6 rounded-lg mb-1 ${i < 3 ? 'bg-green-500/20' : 'bg-white/10'} flex items-center justify-center`}>
              <div className={`w-3 h-3 rounded-sm ${i < 3 ? 'bg-green-400' : 'bg-white/40'}`} />
            </div>
            <div className="h-1.5 w-8 bg-white/30 rounded" />
            {i < 3 && <div className="mt-1 h-1.5 w-6 bg-green-500/40 rounded-full" />}
          </div>
        ))}
      </div>
      <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/30">
        <div className="h-2 w-24 bg-white/40 rounded mb-1" />
        <div className="h-1.5 w-full bg-white/20 rounded" />
      </div>
    </div>
  );
}

function AIPreferencesMockup() {
  return (
    <div className="h-full p-3 space-y-2">
      <div className="h-2 w-24 bg-white/40 rounded" />
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
          <div className="h-1.5 w-12 bg-white/30 rounded mb-1" />
          <div className="h-6 bg-violet-500/20 rounded border border-violet-500/30 flex items-center px-2">
            <div className="h-1.5 w-16 bg-white/50 rounded" />
          </div>
        </div>
        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
          <div className="h-1.5 w-12 bg-white/30 rounded mb-1" />
          <div className="h-6 bg-white/10 rounded flex items-center px-2">
            <div className="h-1.5 w-14 bg-white/30 rounded" />
          </div>
        </div>
      </div>
      <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/10 border border-violet-500/30">
        <div className="h-2 w-20 bg-white/50 rounded mb-2" />
        <div className="h-1.5 w-full bg-white/20 rounded mb-1" />
        <div className="h-1.5 w-5/6 bg-white/20 rounded mb-1" />
        <div className="h-1.5 w-4/6 bg-white/20 rounded" />
      </div>
      <div className="h-1 w-full bg-white/10 rounded-full">
        <div className="h-1 w-2/3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
      </div>
    </div>
  );
}

function ConnectToolsMockup() {
  return (
    <div className="h-full p-3 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 h-4 rounded bg-green-500/30 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-green-400" />
        </div>
        <div className="h-2 w-24 bg-white/40 rounded" />
      </div>
      {['Shopify API', 'AutoDS API', 'OpenAI API'].map((_, i) => (
        <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-1">
            <div className="h-1.5 w-16 bg-white/40 rounded" />
            <div className="h-1.5 w-8 bg-green-500/40 rounded-full" />
          </div>
          <div className="h-5 bg-white/10 rounded flex items-center px-2">
            <div className="h-1 w-20 bg-white/20 rounded" />
            <div className="ml-auto h-3 w-3 rounded bg-white/20" />
          </div>
        </div>
      ))}
      <div className="p-1.5 rounded bg-violet-500/10 border border-violet-500/20 flex items-center gap-1">
        <div className="w-3 h-3 rounded-full bg-violet-500/40" />
        <div className="h-1.5 w-20 bg-white/30 rounded" />
      </div>
    </div>
  );
}

function ProjectsMockup() {
  return (
    <div className="h-full p-3 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="h-2 w-16 bg-white/40 rounded" />
        <div className="h-5 w-14 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg" />
      </div>
      {[1, 2].map((_, i) => (
        <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/30 to-pink-500/30" />
              <div>
                <div className="h-2 w-20 bg-white/50 rounded mb-1" />
                <div className="h-1 w-14 bg-white/20 rounded" />
              </div>
            </div>
            <div className="h-1.5 w-10 bg-green-500/40 rounded-full" />
          </div>
          <div className="flex gap-2 mt-2">
            <div className="h-1 w-8 bg-white/20 rounded" />
            <div className="h-1 w-8 bg-white/20 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsMockup() {
  return (
    <div className="h-full p-3 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="h-2 w-14 bg-white/40 rounded" />
        <div className="h-5 w-20 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="h-10 bg-white/10 rounded mb-2 flex items-center justify-center">
              <div className="w-6 h-6 rounded bg-white/20" />
            </div>
            <div className="h-1.5 w-full bg-white/30 rounded mb-1" />
            <div className="h-1 w-2/3 bg-white/20 rounded" />
            <div className="mt-1.5 flex items-center justify-between">
              <div className="h-2 w-8 bg-white/40 rounded" />
              <div className="h-3 w-3 rounded-full bg-green-500/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersMockup() {
  return (
    <div className="h-full p-3 space-y-2">
      <div className="h-2 w-12 bg-white/40 rounded mb-2" />
      <div className="space-y-1.5">
        {['#1234', '#1235', '#1236'].map((_, i) => (
          <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
                <div className="w-3 h-3 rounded-sm bg-white/30" />
              </div>
              <div>
                <div className="h-1.5 w-16 bg-white/40 rounded mb-0.5" />
                <div className="h-1 w-12 bg-white/20 rounded" />
              </div>
            </div>
            <div className="h-1.5 w-12 bg-green-500/40 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentMockup() {
  return (
    <div className="h-full p-3 space-y-2">
      <div className="h-2 w-16 bg-white/40 rounded mb-2" />
      <div className="flex gap-2 mb-2">
        {['All', 'Blog', 'Social'].map((_, i) => (
          <div key={i} className={`px-2 py-1 rounded-full ${i === 0 ? 'bg-violet-500/30' : 'bg-white/10'}`}>
            <div className="h-1.5 w-6 bg-white/50 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2].map((_, i) => (
          <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="h-8 bg-white/10 rounded mb-2" />
            <div className="h-1.5 w-full bg-white/30 rounded mb-1" />
            <div className="h-1 w-2/3 bg-white/20 rounded" />
            <div className="mt-2 flex items-center gap-1">
              <div className="h-1 w-8 bg-violet-500/40 rounded-full" />
              <div className="h-1 w-6 bg-white/20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdsMockup() {
  return (
    <div className="h-full p-3 space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div className="h-2 w-10 bg-white/40 rounded" />
        <div className="h-5 w-20 bg-gradient-to-r from-violet-500 to-pink-500 rounded-lg" />
      </div>
      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="h-2 w-20 bg-white/50 rounded" />
          <div className="h-1.5 w-10 bg-green-500/40 rounded-full" />
        </div>
        <div className="flex gap-3">
          <div className="text-center">
            <div className="h-1.5 w-8 bg-white/30 rounded mb-1" />
            <div className="h-2 w-10 bg-white/50 rounded" />
          </div>
          <div className="text-center">
            <div className="h-1.5 w-8 bg-white/30 rounded mb-1" />
            <div className="h-2 w-10 bg-white/50 rounded" />
          </div>
        </div>
      </div>
      <div className="h-12 rounded-lg bg-white/5 border border-white/10 p-2">
        <div className="h-1.5 w-16 bg-white/30 rounded mb-1" />
        <div className="h-1 w-full bg-white/10 rounded-full">
          <div className="h-1 w-3/5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function AnalyticsMockup() {
  return (
    <div className="h-full p-3 space-y-2">
      <div className="h-2 w-16 bg-white/40 rounded mb-2" />
      <div className="grid grid-cols-3 gap-2">
        {['Revenue', 'Orders', 'ROAS'].map((_, i) => (
          <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="h-1 w-10 bg-white/30 rounded mb-1" />
            <div className="h-3 w-12 bg-white/60 rounded" />
            <div className="mt-1 h-1 w-6 bg-green-500/40 rounded-full" />
          </div>
        ))}
      </div>
      <div className="h-14 rounded-lg bg-white/5 border border-white/10 p-2">
        <div className="h-1.5 w-20 bg-white/40 rounded mb-2" />
        <div className="flex items-end gap-1 h-6">
          {[30, 50, 40, 70, 60, 80, 55].map((h, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-violet-500 to-pink-500 rounded-sm" style={{height: `${h}%`}} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AutomationMockup() {
  return (
    <div className="h-full p-3 space-y-2">
      <div className="h-2 w-20 bg-white/40 rounded mb-2" />
      <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/10 border border-violet-500/30">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-violet-500/30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-violet-400" />
          </div>
          <div className="h-2 w-24 bg-white/50 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="px-2 py-1 rounded bg-white/10">
            <div className="h-1 w-8 bg-white/40 rounded" />
          </div>
          <div className="px-2 py-1 rounded bg-white/10">
            <div className="h-1 w-8 bg-white/40 rounded" />
          </div>
        </div>
      </div>
      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center justify-between">
          <div className="h-2 w-20 bg-white/40 rounded" />
          <div className="w-8 h-4 rounded-full bg-violet-500/40 relative">
            <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

function AIAgentMockup() {
  return (
    <div className="h-full flex flex-col p-3">
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex-shrink-0" />
          <div className="flex-1 p-2 rounded-lg bg-white/5 border border-white/10">
            <div className="h-1 w-full bg-white/20 rounded mb-1" />
            <div className="h-1 w-2/3 bg-white/20 rounded" />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <div className="flex-1 p-2 rounded-lg bg-violet-500/20 border border-violet-500/30">
            <div className="h-1 w-full bg-white/30 rounded mb-1" />
            <div className="h-1 w-1/2 bg-white/30 rounded" />
          </div>
          <div className="w-6 h-6 rounded-full bg-white/20 flex-shrink-0" />
        </div>
      </div>
      <div className="mt-2 p-2 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
        <div className="flex-1 h-6 bg-white/10 rounded" />
        <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500" />
      </div>
    </div>
  );
}

function IntegrationsMockup() {
  return (
    <div className="h-full p-3 space-y-2">
      <div className="h-2 w-20 bg-white/40 rounded mb-2" />
      {['Shopify', 'AutoDS', 'Meta Ads', 'TikTok'].map((_, i) => (
        <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-sm bg-white/40" />
            </div>
            <div className="h-2 w-14 bg-white/40 rounded" />
          </div>
          <div className={`h-1.5 w-12 rounded-full ${i < 2 ? 'bg-green-500/40' : 'bg-white/20'}`} />
        </div>
      ))}
    </div>
  );
}

function SettingsMockup() {
  return (
    <div className="h-full p-3 space-y-2">
      <div className="h-2 w-14 bg-white/40 rounded mb-2" />
      <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <div className="flex-1">
          <div className="h-2 w-20 bg-white/50 rounded mb-1" />
          <div className="h-1 w-24 bg-white/20 rounded" />
        </div>
      </div>
      {['Account', 'Billing', 'Notifications'].map((_, i) => (
        <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-white/10" />
            <div className="h-1.5 w-16 bg-white/40 rounded" />
          </div>
          <div className="w-4 h-4 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

const mockupComponents: Record<string, React.FC> = {
  login: LoginMockup,
  dashboard: DashboardMockup,
  'connect-accounts': ConnectAccountsMockup,
  'ai-preferences': AIPreferencesMockup,
  'connect-tools': ConnectToolsMockup,
  projects: ProjectsMockup,
  products: ProductsMockup,
  orders: OrdersMockup,
  content: ContentMockup,
  ads: AdsMockup,
  analytics: AnalyticsMockup,
  automation: AutomationMockup,
  'ai-agent': AIAgentMockup,
  integrations: IntegrationsMockup,
  settings: SettingsMockup,
};

function ScreenMockup({ screenId }: { screenId: string }) {
  const MockupComponent = mockupComponents[screenId] || LoginMockup;
  return (
    <div className="aspect-[4/3] bg-gradient-to-br from-[#0a0a0f] to-[#111118] relative overflow-hidden rounded-t-xl">
      <MockupComponent />
    </div>
  );
}

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

      {/* Screen Grid - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredScreens.map((screen, index) => (
          <div
            key={screen.id}
            onClick={() => setSelectedScreen(screen)}
            className="group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-2xl bg-[#111118] border border-white/10 hover:border-violet-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/10">
              {/* Unique Mockup for each screen */}
              <ScreenMockup screenId={screen.id} />
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <span className="bg-gradient-to-r from-violet-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium">View Details</span>
              </div>
              
              {/* Info */}
              <div className="p-4 bg-[#111118]">
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
                      <span className="font-bold text-white">SHOPP<span className="text-violet-400">DROPP</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-violet-300">AI Ready</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
                    </div>
                  </div>

                  {/* Full Screen Mockup */}
                  <div className="aspect-video">
                    {(() => {
                      const FullMockup = mockupComponents[selectedScreen.id] || LoginMockup;
                      return <FullMockup />;
                    })()}
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