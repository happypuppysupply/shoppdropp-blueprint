"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

const screens = [
  { id: "login", name: "Login / Sign Up", category: "Auth", desc: "OAuth and email authentication" },
  { id: "onboarding", name: "Onboarding Flow", category: "Auth", desc: "Experience level and business goals" },
  { id: "dashboard", name: "Dashboard", category: "Dashboard", desc: "Stats, activity feed, platform status" },
  { id: "connect", name: "Connect Accounts", category: "Onboarding", desc: "Shopify, AutoDS, Meta integrations" },
  { id: "ai-setup", name: "AI Preferences", category: "Onboarding", desc: "Niche, audience, budget setup" },
  { id: "projects", name: "Projects", category: "Dashboard", desc: "AI store project management" },
  { id: "products", name: "Products", category: "Store", desc: "Product grid and AutoDS import" },
  { id: "orders", name: "Orders", category: "Store", desc: "Order management and fulfillment" },
  { id: "content", name: "Content", category: "Marketing", desc: "AI-generated blog and social content" },
  { id: "ads", name: "Ads Manager", category: "Marketing", desc: "Meta and TikTok campaign management" },
  { id: "analytics", name: "Analytics", category: "Analytics", desc: "Revenue, traffic, conversion metrics" },
  { id: "ai-agent", name: "AI Agent Chat", category: "AI", desc: "Direct AI assistant interface" },
  { id: "automation", name: "Automation Rules", category: "AI", desc: "AI workflow configuration" },
  { id: "integrations", name: "Integrations", category: "Settings", desc: "Connected platforms and APIs" },
  { id: "settings", name: "Settings", category: "Settings", desc: "Account, team, billing preferences" },
];

const categories = ["All", ...new Set(screens.map(s => s.category))];

export default function PlatformUIPage() {
  const [selCat, setSelCat] = useState("All");
  const [modal, setModal] = useState<typeof screens[0] | null>(null);

  const filtered = selCat === "All" ? screens : screens.filter(s => s.category === selCat);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Platform UI Gallery</h1>
          <p className="text-slate-400 text-sm md:text-base">Real ShoppDropp SaaS interface screens</p>
        </div>
        <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 w-fit">{screens.length} Screens</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setSelCat(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selCat === cat ? "bg-gradient-to-r from-violet-500 to-pink-500 text-white" : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((screen, idx) => (
          <div key={screen.id} onClick={() => setModal(screen)} className="group cursor-pointer">
            <div className="overflow-hidden rounded-2xl bg-[#111118] border border-white/10 hover:border-violet-500/50 transition-all hover:shadow-lg hover:shadow-violet-500/10">
              <div className="aspect-[4/3] bg-[#0a0a0f] p-1">
                <ScreenRender screen={screen.id} />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">{screen.category}</span>
                  <span className="text-xs text-slate-600">#{idx + 1}</span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{screen.name}</h3>
                <p className="text-slate-400 text-xs">{screen.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-[#0a0a0f] rounded-2xl border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <Badge className="mb-2 bg-violet-500/20 text-violet-400 border-violet-500/30">{modal.category}</Badge>
                <h2 className="text-xl font-bold text-white">{modal.name}</h2>
              </div>
              <button onClick={() => setModal(null)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="rounded-xl bg-[#111118] p-4 border border-white/5">
                <div className="bg-[#0a0a0f] rounded-xl overflow-hidden border border-white/10 aspect-video">
                  <ScreenRender screen={modal.id} />
                </div>
              </div>
              <p className="mt-4 text-slate-400">{modal.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScreenRender({ screen }: { screen: string }) {
  switch (screen) {
    case "login": return <LoginUI />;
    case "onboarding": return <OnboardingUI />;
    case "dashboard": return <DashboardUI />;
    case "connect": return <ConnectUI />;
    case "ai-setup": return <AISetupUI />;
    case "projects": return <ProjectsUI />;
    case "products": return <ProductsUI />;
    case "orders": return <OrdersUI />;
    case "content": return <ContentUI />;
    case "ads": return <AdsUI />;
    case "analytics": return <AnalyticsUI />;
    case "ai-agent": return <AIAgentUI />;
    case "automation": return <AutomationUI />;
    case "integrations": return <IntegrationsUI />;
    case "settings": return <SettingsUI />;
    default: return <DashboardUI />;
  }
}

function LoginUI() {
  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>
        <span className="font-bold text-white text-sm">SHOPP<span className="text-violet-400">DROPP</span></span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-[220px] space-y-3">
          <div className="text-center">
            <h2 className="text-base font-bold text-white mb-0.5">Welcome Back</h2>
            <p className="text-slate-400 text-xs">Sign in to your AI store</p>
          </div>
          <button className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            <span className="text-white text-xs font-medium">Continue with Google</span>
          </button>
          <button className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.59.11.82-.261.82-.577v-2.235c-3.335.725-4.035-1.415-4.035-1.415-.545-1.385-1.335-1.755-1.335-1.755-1.09-.745.085-.73.085-.73 1.205.085 1.84 1.24 1.84 1.24 1.065 1.83 2.805 1.3 3.49.995.105-.775.42-1.305.765-1.605-2.665-.305-5.47-1.335-5.47-5.93 0-1.31.465-2.38 1.235-3.22-.135-.305-.54-1.525.105-3.175 0 0 1.005-.32 3.3 1.23.955-.265 1.98-.4 3-.405 1.02.005 2.045.14 3.005.405 2.29-1.55 3.3-1.23 3.3-1.23.645 1.65.24 2.87.12 3.175.765.84 1.23 1.905 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.095.81 2.22v3.295c0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z"/></svg>
            <span className="text-white text-xs font-medium">Continue with GitHub</span>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-white/10"/>
            <span className="text-slate-500 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10"/>
          </div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs">hello@example.com</div>
          <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs">••••••••</div>
          <button className="w-full p-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-semibold">Sign In</button>
          <p className="text-center text-slate-500 text-xs">Don't have an account? <span className="text-violet-400">Sign up</span></p>
        </div>
      </div>
    </div>
  );
}

function OnboardingUI() {
  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] p-4 space-y-3">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 mx-auto mb-2 flex items-center justify-center text-2xl">🚀</div>
        <h2 className="text-base font-bold text-white mb-0.5">Tell us about you</h2>
        <p className="text-slate-400 text-xs">Help us personalize your AI experience</p>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-slate-400 text-xs block mb-1">Experience Level</label>
          <div className="grid grid-cols-3 gap-2">
            {['Beginner', 'Intermediate', 'Expert'].map((l, i) => (
              <button key={l} className={`p-2 rounded-lg text-xs font-medium ${i === 1 ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' : 'bg-white/5 text-slate-400 border border-white/10'}`}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-1">Business Goals</label>
          {['Scale existing store', 'Launch new products', 'Automate marketing'].map(g => (
            <div key={g} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 mb-1">
              <div className="w-4 h-4 rounded bg-violet-500/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-sm bg-violet-400" />
              </div>
              <span className="text-white text-xs">{g}</span>
            </div>
          ))}
        </div>
      </div>
      <button className="mt-auto w-full p-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold">Continue</button>
    </div>
  );
}

function DashboardUI() {
  return (
    <div className="h-full bg-[#0a0a0f] p-3 space-y-3 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Dashboard</h2>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400">AI Online</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[{l:'Revenue',v:'$12.5K',c:'+18.5%'}, {l:'Orders',v:'326',c:'+12.4%'}, {l:'ROAS',v:'3.8x',c:'+22.7%'}].map((s,i) => (
          <div key={i} className={`p-3 rounded-xl ${i===0 ? 'bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/30' : 'bg-white/5 border border-white/10'}`}>
            <p className="text-slate-400 text-[8px] uppercase tracking-wider">{s.l}</p>
            <p className="text-white text-base font-bold">{s.v}</p>
            <span className="text-green-400 text-[10px]">{s.c}</span>
          </div>
        ))}
      </div>
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-white text-xs font-semibold mb-2">Sales Overview</p>
        <div className="h-16 flex items-end gap-1">
          {[35,55,42,78,62,85,70].map((h,i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-violet-500 to-pink-500 rounded-sm" style={{height:`${h}%`}} />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <span key={d} className="text-[8px] text-slate-500 flex-1 text-center">{d}</span>
          ))}
        </div>
      </div>
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-white text-xs font-semibold mb-2">AI Activity Feed</p>
        {[{e:'🤖',t:'AI imported 12 products from AutoDS',tm:'2m ago'}, {e:'✍️',t:'Generated 5 blog posts',tm:'15m ago'}].map((a,i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 mb-1">
            <span className="text-sm">{a.e}</span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs truncate">{a.t}</p>
              <p className="text-slate-500 text-[10px]">{a.tm}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConnectUI() {
  return (
    <div className="h-full bg-[#0a0a0f] p-3 space-y-3 overflow-auto">
      <h2 className="text-sm font-bold text-white">Connect Accounts</h2>
      <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center gap-2">
        <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
        <p className="text-violet-300 text-xs">All credentials are encrypted with AES-256</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[{n:'Shopify',s:'connected'}, {n:'AutoDS',s:'connected'}, {n:'Meta',s:'disconnected'}, {n:'TikTok',s:'disconnected'}, {n:'YouTube',s:'disconnected'}, {n:'AI',s:'connected'}].map((p,i) => (
          <div key={i} className={`p-2 rounded-xl border flex flex-col items-center ${p.s==='connected' ? 'bg-green-500/5 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-lg">{['🛍️','📦','📢','🎵','▶️','🤖'][i]}</div>
              {p.s==='connected' && <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0a0a0f]"/>}
            </div>
            <span className="text-white text-[10px] mt-1">{p.n}</span>
            <span className={`text-[8px] ${p.s==='connected'?'text-green-400':'text-slate-500'}`}>{p.s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AISetupUI() {
  return (
    <div className="h-full bg-[#0a0a0f] p-3 space-y-3 overflow-auto">
      <h2 className="text-sm font-bold text-white">AI Preferences</h2>
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
          <p className="text-slate-400 text-[10px] mb-1">Store Niche</p>
          <div className="p-1.5 rounded-lg bg-violet-500/20 border border-violet-500/30 text-white text-xs">Electronics</div>
        </div>
        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
          <p className="text-slate-400 text-[10px] mb-1">Target Audience</p>
          <div className="p-1.5 rounded-lg bg-white/10 text-white text-xs">18-35 Tech</div>
        </div>
      </div>
      <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20">
        <p className="text-white text-xs font-semibold mb-1">AI Strategy Preview</p>
        <p className="text-slate-400 text-xs leading-relaxed">Auto-import trending products daily, generate SEO blog content, run Meta ads with $50/day budget.</p>
      </div>
      <div>
        <p className="text-slate-400 text-[10px] mb-1">Daily Ad Budget</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full"><div className="w-2/3 h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"/></div>
          <span className="text-white text-xs font-medium">$50</span>
        </div>
      </div>
    </div>
  );
}

function ProjectsUI() {
  return (
    <div className="h-full bg-[#0a0a0f] p-3 space-y-3 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Projects</h2>
        <button className="px-2 py-1 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-[10px] font-semibold">+ New Project</button>
      </div>
      <div className="space-y-2">
        {[{n:'Gadget Store',s:'active',r:'$8.2K',i:'⚡'}, {n:'Fashion Hub',s:'paused',r:'$4.3K',i:'👕'}].map((p,i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center text-xl">{p.i}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm font-medium truncate">{p.n}</span>
                <span className={`w-2 h-2 rounded-full ${p.s==='active'?'bg-green-400':'bg-yellow-400'}`}/>
              </div>
              <span className="text-slate-500 text-xs">{p.s}</span>
            </div>
            <span className="text-violet-400 text-sm font-bold">{p.r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsUI() {
  return (
    <div className="h-full bg-[#0a0a0f] p-3 space-y-3 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Products</h2>
        <button className="px-3 py-1 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-semibold">+ AutoDS Import</button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[{n:'Earbuds Pro',p:'$49.99',st:24}, {n:'Smart Watch',p:'$129.99',st:12}, {n:'Phone Stand',p:'$19.99',st:156}, {n:'LED Lamp',p:'$34.99',st:0}].map((pr,i) => (
          <div key={i} className="p-2 rounded-xl bg-white/5 border border-white/10">
            <div className="h-12 bg-white/10 rounded-xl mb-2 flex items-center justify-center text-2xl">{['🎧','⌚','📱','💡'][i]}</div>
            <p className="text-white text-xs font-medium truncate">{pr.n}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-violet-400 text-sm font-bold">{pr.p}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${pr.st>0?'bg-green-500/20 text-green-400':'bg-red-500/20 text-red-400'}`}>{pr.st>0?`${pr.st} in stock`:'Out'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersUI() {
  return (
    <div className="h-full bg-[#0a0a0f] p-3 space-y-3 overflow-auto">
      <h2 className="text-sm font-bold text-white">Orders</h2>
      <div className="space-y-2">
        {[{id:'#1234',c:'John D.',t:'$156.97',s:'fulfilled'}, {id:'#1233',c:'Sarah M.',t:'$49.99',s:'processing'}, {id:'#1232',c:'Mike R.',t:'$89.98',s:'shipped'}].map((o,i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">📦</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-semibold">{o.id}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${o.s==='fulfilled'?'bg-green-500/20 text-green-400':o.s==='shipped'?'bg-blue-500/20 text-blue-400':'bg-yellow-500/20 text-yellow-400'}`}>{o.s}</span>
              </div>
              <p className="text-slate-400 text-xs">{o.c}</p>
            </div>
            <span className="text-white text-sm font-semibold">{o.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContentUI() {
  return (
    <div className="h-full bg-[#0a0a0f] p-3 space-y-3 overflow-auto">
      <h2 className="text-sm font-bold text-white">Content</h2>
      <div className="flex gap-2">
        {['All','Blog','Social'].map((t,i) => (
          <button key={t} className={`px-3 py-1 rounded-full text-xs ${i===0?'bg-violet-500/20 text-violet-300':'bg-white/5 text-slate-400'}`}>{t}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[{t:'10 Summer Gadgets',s:'published',i:'✍️'}, {t:'TikTok Ad Scripts',s:'draft',i:'📱'}].map((c,i) => (
          <div key={i} className="p-2 rounded-xl bg-white/5 border border-white/10">
            <div className="h-10 bg-white/10 rounded-xl mb-2 flex items-center justify-center text-xl">{c.i}</div>
            <p className="text-white text-xs font-medium truncate">{c.t}</p>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${c.s==='published'?'bg-green-500/20 text-green-400':'bg-yellow-500/20 text-yellow-400'}`}>{c.s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdsUI() {
  return (
    <div className="h-full bg-[#0a0a0f] p-3 space-y-3 overflow-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Ads Manager</h2>
        <button className="px-3 py-1 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-semibold">+ Campaign</button>
      </div>
      <div className="space-y-2">
        {[{n:'Summer Sale 2026',pl:'Meta',b:'$50/day',sp:'$1,240',r:'3.2x'}, {n:'Product Launch',pl:'TikTok',b:'$30/day',sp:'$890',r:'2.8x'}].map((c,i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-white text-sm font-semibold">{c.n}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">{c.pl}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">active</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div><p className="text-[10px] text-slate-400">Budget</p><p className="text-white text-xs font-medium">{c.b}</p></div>
              <div><p className="text-[10px] text-slate-400">Spent</p><p className="text-white text-xs font-medium">{c.sp}</p></div>
              <div><p className="text-[10px] text-slate-400">ROAS</p><p className="text-green-400 text-xs font-bold">{c.r}</p></div>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full"><div className="h-full w-3/5 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"/></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsUI() {
  return (
    <div className="h-full bg-[#0a0a0f] p-3 space-y-3 overflow-auto">
      <h2 className="text-sm font-bold text-white">Analytics</h2>
      <div className="grid grid-cols-3 gap-2">
        {[{label:'Revenue',value:'$12.5K',change:'+18.5%'}, {label:'Orders',value:'326',change:'+12.4%'}, {label:'ROAS',value:'3.8x',change:'+22.7%'}].map((stat,i) => (
          <div key={i} className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
            <p className="text-[9px] text-slate-500 uppercase">{stat.label}</p>
            <p className="text-white text-sm font-bold">{stat.value}</p>
            <span className="text-[9px] text-green-400">{stat.change}</span>
          </div>
        ))}
      </div>
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-white text-xs font-semibold mb-2">Revenue Trend</p>
        <div className="h-16 flex items-end gap-1">
          {[45,62,48,85,70,92,78,88,95,82,90,100].map((h,i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-violet-500/80 to-pink-500/80 rounded-t" style={{height:`${h}%`}} />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {['Jan','Feb','Mar','Apr','May','Jun'].map(m => <span key={m} className="text-[8px] text-slate-500 flex-1 text-center">{m}</span>)}
        </div>
      </div>
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <p className="text-white text-xs font-semibold mb-2">Traffic Sources</p>
        {[{source:'Organic Search',pct:45,color:'from-violet-500 to-violet-400'}, {source:'Meta Ads',pct:30,color:'from-pink-500 to-pink-400'}, {source:'Direct',pct:15,color:'from-blue-500 to-blue-400'}, {source:'TikTok',pct:10,color:'from-orange-500 to-orange-400'}].map((item,i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-slate-400 w-20">{item.source}</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${item.color} rounded-full`} style={{width:`${item.pct}%`}}/></div>
            <span className="text-[10px] text-white w-6 text-right">{item.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIAgentUI() {
  return (
    <div className="h-full flex flex-col bg-[#0a0a0f]">
      <div className="p-3 border-b border-white/10 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
        </div>
        <div>
          <p className="text-white text-xs font-semibold">ShoppDropp AI</p>
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400"/><span className="text-[10px] text-green-400">Online</span></div>
        </div>
      </div>
      <div className="flex-1 p-3 space-y-3 overflow-auto">
        <div className="flex gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex-shrink-0" />
          <div className="flex-1 p-2 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white text-xs">Hi! I'm your AI store assistant. What would you like me to help with today?</p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <div className="flex-1 p-2 rounded-xl bg-violet-500/20 border border-violet-500/30">
            <p className="text-white text-xs">Import trending products from AutoDS</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-white/20 flex-shrink-0" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['Import products', 'Write blog post', 'Create ad', 'Sync inventory'].map(s => (
            <button key={s} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-white text-[10px]">{s}</button>
          ))}
        </div>
      </div>
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
          <input type="text" placeholder="Ask me anything..." className="flex-1 bg-transparent text-white text-xs outline-none placeholder:text-slate-500" readOnly />
          <button className="w-7 h-7 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function AutomationUI() {
  return (
    <div className="h-full bg-[#0a0a0f] p-3 space-y-3 overflow-auto">
      <h2 className="text-sm font-bold text-white">Automation Rules</h2>
      <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/10 border border-violet-500/30">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-violet-500/30 flex items-center justify-center">
            <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Auto Product Import</p>
            <p className="text-slate-400 text-[10px]">When: Daily at 9AM</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px]">Trigger: Schedule</span>
          <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px]">Action: Import</span>
        </div>
      </div>
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          <div>
            <p className="text-white text-xs font-medium">Price Sync</p>
            <p className="text-slate-400 text-[10px]">Every 2 hours</p>
          </div>
        </div>
        <div className="w-8 h-4 rounded-full bg-violet-500 relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white"/></div>
      </div>
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
          <div>
            <p className="text-white text-xs font-medium">Ad Optimization</p>
            <p className="text-slate-400 text-[10px]">When ROAS {'<'} 2.0</p>
          </div>
        </div>
        <div className="w-8 h-4 rounded-full bg-violet-500 relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white"/></div>
      </div>
    </div>
  );
}

function IntegrationsUI() {
  return (
    <div className="h-full bg-[#0a0a0f] p-3 space-y-3 overflow-auto">
      <h2 className="text-sm font-bold text-white">Integrations</h2>
      <div className="space-y-2">
        {[{name:'Shopify',status:'connected',icon:'🛍️'}, {name:'AutoDS',status:'connected',icon:'📦'}, {name:'Meta Ads',status:'disconnected',icon:'📢'}, {name:'TikTok',status:'disconnected',icon:'🎵'}].map((int,i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">{int.icon}</div>
              <div>
                <p className="text-white text-sm font-medium">{int.name}</p>
                <p className={`text-xs ${int.status==='connected'?'text-green-400':'text-slate-500'}`}>{int.status}</p>
              </div>
            </div>
            <button className={`px-3 py-1 rounded-lg text-xs font-medium ${int.status==='connected'?'bg-white/5 text-slate-400':'bg-gradient-to-r from-violet-500 to-pink-500 text-white'}`}>
              {int.status==='connected'?'Manage':'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsUI() {
  return (
    <div className="h-full bg-[#0a0a0f] p-3 space-y-3 overflow-auto">
      <h2 className="text-sm font-bold text-white">Settings</h2>
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <div className="flex-1">
          <p className="text-white text-sm font-semibold">John Smith</p>
          <p className="text-slate-400 text-xs">john@example.com</p>
        </div>
        <button className="px-3 py-1 rounded-lg bg-white/5 text-white text-xs">Edit</button>
      </div>
      <div className="space-y-1">
        {[{label:'Account',icon:'👤'}, {label:'Team Members',icon:'👥'}, {label:'Billing',icon:'💳'}, {label:'Notifications',icon:'🔔'}].map((item,i) => (
          <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span className="text-white text-sm">{item.label}</span>
            </div>
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
          </div>
        ))}
      </div>
    </div>
  );
}