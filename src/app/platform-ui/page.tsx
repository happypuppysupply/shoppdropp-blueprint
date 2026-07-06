"use client";

import { useState } from "react";

const screens = [
  { id: "login", name: "Login / Sign Up", category: "Auth", desc: "OAuth and email authentication" },
  { id: "onboarding", name: "Onboarding Flow", category: "Auth", desc: "Experience level and business goals" },
  { id: "dashboard", name: "Dashboard", category: "Dashboard", desc: "Stats, activity feed, platform status" },
  { id: "connect", name: "Connect Accounts", category: "Onboarding", desc: "Shopify, AutoDS, Meta integrations" },
  { id: "ai-setup", name: "AI Preferences", category: "Onboarding", desc: "Niche, audience, budget setup" },
  { id: "builder", name: "Store Builder", category: "Dashboard", desc: "AI store building progress with live steps" },
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
          <p className="text-slate-400 text-sm md:text-base">ShoppDropp SaaS interface screens</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium w-fit">
          {screens.length} Screens
        </div>
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
            <div className="overflow-hidden rounded-2xl bg-[#0d0d12] border border-white/10 hover:border-violet-500/50 transition-all hover:shadow-lg hover:shadow-violet-500/10">
              <div className="aspect-[4/3] bg-[#08080c] p-0">
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
          <div className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-[#0a0a0f] rounded-2xl border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="mb-2 px-2 py-1 rounded-md bg-violet-500/20 text-violet-400 text-xs border border-violet-500/30 w-fit">{modal.category}</div>
                <h2 className="text-xl font-bold text-white">{modal.name}</h2>
              </div>
              <button onClick={() => setModal(null)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="rounded-xl bg-[#08080c] overflow-hidden border border-white/10 aspect-video">
                <ScreenRender screen={modal.id} />
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
    case "builder": return <BuilderUI />;
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

function Sidebar() {
  return (
    <div className="w-12 h-full bg-[#0d0d12] border-r border-white/5 flex flex-col py-3">
      <div className="flex items-center justify-center mb-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
          </svg>
        </div>
      </div>
      <div className="flex-1 space-y-1 px-1">
        {[
          {icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', active: false},
          {icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', active: true},
          {icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', active: false},
          {icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', active: false},
          {icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', active: false},
          {icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122', active: false},
        ].map((item, i) => (
          <div key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer ${item.active ? 'bg-violet-500/20 text-violet-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon}/></svg>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoginUI() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#08080c] p-6">
      <div className="w-full max-w-[240px] space-y-5">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 mx-auto mb-3 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Welcome back</h2>
          <p className="text-slate-500 text-xs">Sign in to your AI store</p>
        </div>
        <button className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          <span className="text-white text-xs font-medium">Continue with Google</span>
        </button>
        <button className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.59.11.82-.261.82-.577v-2.235c-3.335.725-4.035-1.415-4.035-1.415-.545-1.385-1.335-1.755-1.335-1.755-1.09-.745.085-.73.085-.73 1.205.085 1.84 1.24 1.84 1.24 1.065 1.83 2.805 1.3 3.49.995.105-.775.42-1.305.765-1.605-2.665-.305-5.47-1.335-5.47-5.93 0-1.31.465-2.38 1.235-3.22-.135-.305-.54-1.525.105-3.175 0 0 1.005-.32 3.3 1.23.955-.265 1.98-.4 3-.405 1.02.005 2.045.14 3.005.405 2.29-1.55 3.3-1.23 3.3-1.23.645 1.65.24 2.87.12 3.175.765.84 1.23 1.905 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.095.81 2.22v3.295c0 .315.225.69.825.57C20.565 21.795 24 17.31 24 12c0-6.63-5.37-12-12-12z"/></svg>
          <span className="text-white text-xs font-medium">Continue with GitHub</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10"/>
          <span className="text-slate-500 text-xs">or</span>
          <div className="flex-1 h-px bg-white/10"/>
        </div>
        <div className="space-y-3">
          <input type="text" readOnly placeholder="hello@example.com" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 outline-none" />
          <input type="password" readOnly placeholder="••••••••••••" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-xs placeholder-slate-500 outline-none" />
        </div>
        <button className="w-full p-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">Sign In</button>
        <p className="text-center text-slate-500 text-xs">Don't have an account? <span className="text-violet-400 cursor-pointer hover:underline">Sign up</span></p>
      </div>
    </div>
  );
}

function OnboardingUI() {
  return (
    <div className="h-full flex flex-col bg-[#08080c] p-5 space-y-4">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 mx-auto mb-3 flex items-center justify-center text-2xl shadow-lg shadow-violet-500/20">🚀</div>
        <h2 className="text-base font-bold text-white mb-1">Tell us about you</h2>
        <p className="text-slate-500 text-xs">Help us personalize your AI experience</p>
      </div>
      <div className="space-y-4 flex-1 overflow-auto">
        <div>
          <label className="text-slate-400 text-xs block mb-2">Experience Level</label>
          <div className="grid grid-cols-3 gap-2">
            {['Beginner', 'Intermediate', 'Expert'].map((l, i) => (
              <button key={l} className={`p-2.5 rounded-lg text-xs font-medium transition-all ${i === 1 ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-lg shadow-violet-500/5' : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'}`}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-slate-400 text-xs block mb-2">Business Goals</label>
          {['Scale existing store', 'Launch new products', 'Automate marketing'].map(g => (
            <label key={g} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5 mb-1.5 cursor-pointer hover:bg-white/[0.07] transition-colors">
              <div className="w-4 h-4 rounded bg-violet-500/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-sm bg-violet-400" />
              </div>
              <span className="text-white text-xs">{g}</span>
            </label>
          ))}
        </div>
      </div>
      <button className="w-full p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/10">Continue</button>
    </div>
  );
}

function DashboardUI() {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Dashboard</h2>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400">AI Online</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[{l:'Revenue',v:'$12.5K',c:'+18.5%'}, {l:'Orders',v:'326',c:'+12.4%'}, {l:'ROAS',v:'3.8x',c:'+22.7%'}].map((s,i) => (
            <div key={i} className={`p-3 rounded-xl ${i===0 ? 'bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/30' : 'bg-white/5 border border-white/5'}`}>
              <p className="text-slate-500 text-[9px] uppercase tracking-wider">{s.l}</p>
              <p className="text-white text-base font-bold">{s.v}</p>
              <span className="text-green-400 text-[10px]">{s.c}</span>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white text-xs font-semibold">Sales Overview</p>
            <span className="text-slate-500 text-[10px]">Last 7 days</span>
          </div>
          <div className="h-14 flex items-end gap-1">
            {[35,55,42,78,62,85,70].map((h,i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-violet-500 to-pink-500 rounded-sm" style={{height:`${h}%`}} />
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <span key={d} className="text-[8px] text-slate-600 flex-1 text-center">{d}</span>)}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <p className="text-white text-xs font-semibold mb-2">Recent Activity</p>
          {[{e:'🤖',t:'AI imported 12 products from AutoDS',tm:'2m ago'}, {e:'✍️',t:'Generated 5 blog posts for SEO',tm:'15m ago'}, {e:'📢',t:'Launched Meta ad campaign',tm:'1h ago'}].map((a,i) => (
            <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0d0d12] mb-1.5">
              <span className="text-sm">{a.e}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs truncate">{a.t}</p>
                <p className="text-slate-500 text-[10px]">{a.tm}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConnectUI() {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <h2 className="text-sm font-bold text-white">Connect Accounts</h2>
        <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center gap-2">
          <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00 2 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          <p className="text-violet-300 text-xs">All credentials are encrypted with AES-256</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[{n:'Shopify',s:'connected'}, {n:'AutoDS',s:'connected'}, {n:'Meta',s:'disconnected'}, {n:'TikTok',s:'disconnected'}, {n:'YouTube',s:'disconnected'}, {n:'AI',s:'connected'}].map((p,i) => (
            <div key={i} className={`p-3 rounded-xl border flex flex-col items-center cursor-pointer hover:border-white/20 transition-colors ${p.s==='connected' ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/5'}`}>
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-lg">{['🛍️','📦','📢','🎵','▶️','🤖'][i]}</div>
                {p.s==='connected' && <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border border-[#08080c] flex items-center justify-center"><svg className="w-1.5 h-1.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg></div>}
              </div>
              <span className="text-white text-[10px] mt-1.5 font-medium">{p.n}</span>
              <span className={`text-[8px] mt-0.5 px-1.5 py-0.5 rounded-full ${p.s==='connected'?'bg-green-500/20 text-green-400':'bg-white/5 text-slate-500'}`}>{p.s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AISetupUI() {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <h2 className="text-sm font-bold text-white">AI Preferences</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-slate-500 text-[10px] mb-1.5">Store Niche</p>
              <div className="p-1.5 rounded-lg bg-violet-500/15 border border-violet-500/30 text-white text-xs font-medium">Electronics</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-slate-500 text-[10px] mb-1.5">Target Audience</p>
              <div className="p-1.5 rounded-lg bg-white/5 text-white text-xs">18-35 Tech</div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/15">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded bg-violet-500/20 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <p className="text-white text-xs font-semibold">AI Strategy Preview</p>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">Auto-import trending products daily, generate SEO blog content, run Meta ads with $50/day budget.</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 text-[10px]">Daily Ad Budget</p>
              <span className="text-white text-sm font-bold">$50</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="w-2/3 h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full"/></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BuilderUI() {
  const steps = [
    {n:'Create Account',desc:'Set up your ShoppDropp profile',s:'completed'},
    {n:'Connect Your Tools',desc:'Link Shopify, AutoDS, Meta',s:'completed'},
    {n:'Review & Confirm',desc:'Verify AI preferences',s:'completed'},
    {n:'Building Your AI Store',desc:'AI is setting up everything',s:'in_progress'},
  ];
  const buildSteps = [
    {id:1,label:'Connecting to Shopify API',status:'completed'},
    {id:2,label:'Setting up AutoDS integration',status:'completed'},
    {id:3,label:'Configuring Meta Ads account',status:'completed'},
    {id:4,label:'Syncing product catalog',status:'in_progress'},
    {id:5,label:'Generating AI product descriptions',status:'pending'},
    {id:6,label:'Creating store theme',status:'pending'},
    {id:7,label:'Setting up analytics',status:'pending'},
    {id:8,label:'Configuring automation rules',status:'pending'},
    {id:9,label:'Optimizing SEO metadata',status:'pending'},
    {id:10,label:'Final launch preparation',status:'pending'},
  ];
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top Progress */}
        <div className="px-4 pt-4 pb-2 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            {steps.map((step,i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${step.s==='completed'?'bg-green-500/20 text-green-400 border border-green-500/30':step.s==='in_progress'?'bg-violet-500 text-white':'bg-white/5 text-slate-500 border border-white/10'}`}>
                  {step.s==='completed'?<svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>:step.s==='in_progress'?<div className="w-2 h-2 rounded-full bg-white animate-pulse"/>:i+1}
                </div>
                <div className="hidden sm:block">
                  <p className={`text-[9px] font-medium ${step.s==='in_progress'?'text-white':'text-slate-500'}`}>{step.n}</p>
                </div>
                {i < steps.length - 1 && <div className="w-4 h-px bg-white/10 ml-1"/>}
              </div>
            ))}
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex gap-3 p-4 overflow-auto">
          <div className="flex-1 space-y-3">
            {/* Progress Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/15 to-pink-500/10 border border-violet-500/20">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Your AI store is being built!</h3>
                  <p className="text-slate-400 text-[10px]">This usually takes 5-10 minutes</p>
                </div>
                <div className="w-12 h-12 relative">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
                    <circle cx="24" cy="24" r="20" fill="none" stroke="url(#grad)" strokeWidth="4" strokeDasharray="126" strokeDashoffset="46" strokeLinecap="round"/>
                    <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">63%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px]">
                <span className="text-slate-400">Elapsed: <span className="text-white font-mono">04:12</span></span>
                <span className="text-slate-400">Est. remaining: <span className="text-white font-mono">02:30</span></span>
              </div>
            </div>
            {/* Build Steps */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-xs font-semibold mb-3">Build Steps</p>
              <div className="space-y-1.5">
                {buildSteps.map((step) => (
                  <div key={step.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0d0d12]">
                    <span className="text-[10px] text-slate-500 w-3">{step.id}</span>
                    {step.status==='completed'?(
                      <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                      </div>
                    ):step.status==='in_progress'?(
                      <div className="w-4 h-4 rounded-full border border-violet-500/50 border-t-violet-500 animate-spin" style={{borderWidth:'2px'}}/>
                    ):<div className="w-4 h-4 rounded-full bg-white/5"/>}
                    <span className={`text-[10px] flex-1 ${step.status==='completed'?'text-slate-500 line-through':step.status==='in_progress'?'text-white font-medium':'text-slate-600'}`}>{step.label}</span>
                    {step.status==='in_progress'&&<span className="text-[9px] text-violet-400 animate-pulse">In progress...</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right Panel */}
          <div className="w-40 space-y-3 hidden md:block">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-[10px] font-semibold mb-2">Store Details</p>
              {[{l:'Store Name',v:'Gadget Hub'}, {l:'Platform',v:'Shopify'}, {l:'Niche',v:'Electronics'}, {l:'Region',v:'US'}].map(d => (
                <div key={d.l} className="flex justify-between items-center mb-1">
                  <span className="text-[9px] text-slate-500">{d.l}</span>
                  <span className="text-[9px] text-white">{d.v}</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-[10px] font-semibold mb-2">Live Activity</p>
              <div className="space-y-1.5">
                {[{t:'Connected to Shopify',c:'green'}, {t:'AutoDS login succeeded',c:'green'}, {t:'Fetching products...',c:'violet'}].map((a,i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className={`w-1 h-1 rounded-full ${a.c==='green'?'bg-green-400':'bg-violet-400 animate-pulse'}`}/>
                    <span className="text-[9px] text-slate-400 truncate">{a.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsUI() {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Projects</h2>
          <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-[10px] font-semibold hover:opacity-90 transition-opacity">+ New Project</button>
        </div>
        <div className="space-y-2">
          {[{n:'Gadget Store',s:'active',r:'$8.2K',i:'⚡',p:24}, {n:'Fashion Hub',s:'paused',r:'$4.3K',i:'👕',p:156}].map((p,i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center text-xl">{p.i}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium truncate">{p.n}</span>
                  <span className={`w-2 h-2 rounded-full ${p.s==='active'?'bg-green-400':'bg-yellow-400'}`}/>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-slate-500 text-[9px]">{p.s}</span>
                  <span className="text-slate-600 text-[9px]">{p.p} products</span>
                </div>
              </div>
              <span className="text-violet-400 text-sm font-bold">{p.r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductsUI() {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Products</h2>
          <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-semibold hover:opacity-90 transition-opacity">+ AutoDS Import</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[{n:'Earbuds Pro',p:'$49.99',st:24,m:'$23.50'}, {n:'Smart Watch',p:'$129.99',st:12,m:'$45.00'}, {n:'Phone Stand',p:'$19.99',st:156,m:'$8.50'}, {n:'LED Lamp',p:'$34.99',st:0,m:'$15.00'}].map((pr,i) => (
            <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="h-14 bg-gradient-to-br from-white/5 to-white/10 rounded-xl mb-2 flex items-center justify-center text-3xl">{['🎧','⌚','📱','💡'][i]}</div>
              <p className="text-white text-xs font-medium truncate">{pr.n}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-violet-400 text-sm font-bold">{pr.p}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${pr.st>0?'bg-green-500/15 text-green-400 border border-green-500/20':'bg-red-500/15 text-red-400 border border-red-500/20'}`}>{pr.st>0?`${pr.st} in stock`:'Out'}</span>
              </div>
              <p className="text-slate-500 text-[9px] mt-1">Margin: {pr.m}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrdersUI() {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <h2 className="text-sm font-bold text-white">Orders</h2>
        <div className="space-y-1.5">
          {[{id:'#1234',c:'John D.',t:'$156.97',s:'fulfilled',items:3}, {id:'#1233',c:'Sarah M.',t:'$49.99',s:'processing',items:1}, {id:'#1232',c:'Mike R.',t:'$89.98',s:'shipped',items:2}, {id:'#1231',c:'Lisa K.',t:'$199.50',s:'fulfilled',items:4}].map((o,i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 hover:border-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-lg">📦</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-semibold">{o.id}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full border ${o.s==='fulfilled'?'bg-green-500/10 text-green-400 border-green-500/20':o.s==='shipped'?'bg-blue-500/10 text-blue-400 border-blue-500/20':'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>{o.s}</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-slate-400 text-xs">{o.c}</p>
                  <span className="text-slate-600 text-[9px]">{o.items} items</span>
                </div>
              </div>
              <span className="text-white text-sm font-semibold">{o.t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentUI() {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <h2 className="text-sm font-bold text-white">Content</h2>
        <div className="flex gap-2">
          {['All','Blog','Social','Ads'].map((t,i) => (
            <button key={t} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${i===0?'bg-violet-500/20 text-violet-300 border border-violet-500/30':'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'}`}>{t}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[{t:'10 Summer Gadgets You Need',s:'published',i:'✍️',d:'2h ago'}, {t:'TikTok Ad Scripts Pack',s:'draft',i:'📱',d:'Saved'}, {t:'Meta Ad Variations',s:'published',i:'📢',d:'1d ago'}].map((c,i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="h-12 bg-gradient-to-br from-white/5 to-white/10 rounded-xl mb-2 flex items-center justify-center text-2xl">{c.i}</div>
              <p className="text-white text-xs font-medium truncate">{c.t}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${c.s==='published'?'bg-green-500/15 text-green-400 border border-green-500/20':'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'}`}>{c.s}</span>
                <span className="text-slate-600 text-[9px]">{c.d}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdsUI() {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Ads Manager</h2>
          <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-semibold hover:opacity-90 transition-opacity">+ Campaign</button>
        </div>
        <div className="space-y-2">
          {[{n:'Summer Sale 2026',pl:'Meta',b:'$50/day',sp:'$1,240',r:'3.2x',p:65}, {n:'Product Launch',pl:'TikTok',b:'$30/day',sp:'$890',r:'2.8x',p:45}].map((c,i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white text-sm font-semibold">{c.n}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400">{c.pl}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  </div>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20">active</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div><p className="text-[9px] text-slate-500">Budget</p><p className="text-white text-xs font-medium">{c.b}</p></div>
                <div><p className="text-[9px] text-slate-500">Spent</p><p className="text-white text-xs font-medium">{c.sp}</p></div>
                <div><p className="text-[9px] text-slate-500">ROAS</p><p className="text-green-400 text-xs font-bold">{c.r}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full"><div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" style={{width:`${c.p}%`}}/></div>
                <span className="text-slate-500 text-[9px]"> {c.p}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsUI() {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <h2 className="text-sm font-bold text-white">Analytics</h2>
        <div className="grid grid-cols-3 gap-2">
          {[{label:'Revenue',value:'$12.5K',change:'+18.5%'}, {label:'Orders',value:'326',change:'+12.4%'}, {label:'Conv. Rate',value:'4.2%',change:'+0.8%'}].map((stat,i) => (
            <div key={i} className={`p-3 rounded-xl text-center ${i===0?'bg-gradient-to-br from-violet-500/15 to-violet-600/10 border border-violet-500/20':'bg-white/5 border border-white/5'}`}>
              <p className="text-[9px] text-slate-500 uppercase">{stat.label}</p>
              <p className="text-white text-base font-bold">{stat.value}</p>
              <span className="text-[9px] text-green-400">{stat.change}</span>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white text-xs font-semibold">Revenue Trend</p>
            <span className="text-slate-500 text-[10px]">12 Months</span>
          </div>
          <div className="h-16 flex items-end gap-0.5">
            {[45,62,48,85,70,92,78,88,95,82,90,100].map((h,i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-violet-500/80 to-pink-500/80 rounded-t" style={{height:`${h}%`}} />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <span key={m} className="text-[7px] text-slate-600 flex-1 text-center">{m}</span>)}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
          <p className="text-white text-xs font-semibold mb-2">Traffic Sources</p>
          {[{source:'Organic Search',pct:45,color:'from-violet-500 to-violet-400'}, {source:'Meta Ads',pct:30,color:'from-pink-500 to-pink-400'}, {source:'Direct',pct:15,color:'from-blue-500 to-blue-400'}, {source:'TikTok',pct:10,color:'from-orange-500 to-orange-400'}].map((item,i) => (
            <div key={i} className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] text-slate-400 w-24">{item.source}</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${item.color} rounded-full`} style={{width:`${item.pct}%`}}/></div>
              <span className="text-[10px] text-white w-8 text-right">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIAgentUI() {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-3 border-b border-white/5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
          </div>
          <div>
            <p className="text-white text-xs font-semibold">ShoppDropp AI</p>
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/><span className="text-[10px] text-green-400">Online</span></div>
          </div>
        </div>
        <div className="flex-1 p-3 space-y-3 overflow-auto">
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex-shrink-0" />
            <div className="flex-1 p-2.5 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-xs leading-relaxed">Hi! I am your AI store assistant. What would you like me to help with today?</p>
            </div>
          </div>
          <div className="flex gap-2.5 justify-end">
            <div className="flex-1 p-2.5 rounded-xl bg-violet-500/15 border border-violet-500/20 max-w-[70%]">
              <p className="text-white text-xs leading-relaxed">Import trending products from AutoDS</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/10 flex-shrink-0" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['Import products', 'Write blog post', 'Create ad', 'Sync inventory'].map(s => (
              <button key={s} className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/5 text-white text-[10px] hover:bg-white/10 transition-colors">{s}</button>
            ))}
          </div>
        </div>
        <div className="p-3 border-t border-white/5">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
            <input type="text" placeholder="Ask me anything..." className="flex-1 bg-transparent text-white text-xs outline-none placeholder:text-slate-600" readOnly />
            <button className="w-7 h-7 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center hover:opacity-90 transition-opacity">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationUI() {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <h2 className="text-sm font-bold text-white">Automation Rules</h2>
        <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/15 to-pink-500/10 border border-violet-500/20">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Auto Product Import</p>
              <p className="text-slate-400 text-[10px]">When: Daily at 9:00 AM</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-white/5 text-white text-[10px] border border-white/10">Trigger: Schedule</span>
            <span className="px-2 py-0.5 rounded-md bg-white/5 text-white text-[10px] border border-white/10">Action: Import Products</span>
            <span className="px-2 py-0.5 rounded-md bg-green-500/15 text-green-400 text-[10px] border border-green-500/20">Status: Active</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </div>
            <div>
              <p className="text-white text-xs font-medium">Price Sync</p>
              <p className="text-slate-500 text-[10px]">Every 2 hours</p>
            </div>
          </div>
          <div className="w-8 h-4 rounded-full bg-violet-500 relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white shadow-sm"/></div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
            </div>
            <div>
              <p className="text-white text-xs font-medium">Ad Optimization</p>
              <p className="text-slate-500 text-[10px]">When ROAS drops below 2.0x</p>
            </div>
          </div>
          <div className="w-8 h-4 rounded-full bg-violet-500 relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white shadow-sm"/></div>
        </div>
      </div>
    </div>
  );
}

function IntegrationsUI() {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <h2 className="text-sm font-bold text-white">Integrations</h2>
        <div className="space-y-2">
          {[{name:'Shopify',status:'connected',icon:'🛍️',desc:'Your eCommerce platform'}, {name:'AutoDS',status:'connected',icon:'📦',desc:'Dropshipping automation'}, {name:'Meta Ads',status:'disconnected',icon:'📢',desc:'Facebook & Instagram ads'}, {name:'TikTok Ads',status:'disconnected',icon:'🎵',desc:'TikTok advertising'}].map((int,i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-xl">{int.icon}</div>
                <div>
                  <p className="text-white text-sm font-medium">{int.name}</p>
                  <p className="text-[10px] text-slate-500">{int.desc}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full mt-1 inline-block ${int.status==='connected'?'bg-green-500/15 text-green-400 border border-green-500/20':'bg-warn-500/15 text-yellow-400 border border-yellow-500/20'}`}>{int.status}</span>
                </div>
              </div>
              <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity hover:opacity-80 ${int.status==='connected'?'bg-white/5 text-slate-400 border border-white/10':'bg-gradient-to-r from-violet-500 to-pink-500 text-white'}`}>
                {int.status==='connected'?'Manage':'Connect'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsUI() {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar />
      <div className="flex-1 p-4 space-y-3 overflow-auto">
        <h2 className="text-sm font-bold text-white">Settings</h2>
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">JS</div>
          <div className="flex-1">
            <p className="text-white text-sm font-semibold">John Smith</p>
            <p className="text-slate-400 text-xs">john@example.com</p>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs hover:bg-white/10 transition-colors">Edit</button>
        </div>
        <div className="space-y-1">
          {[{label:'Account',icon:'👤',desc:'Personal info, password'}, {label:'Team Members',icon:'👥',desc:'Invite and manage team'}, {label:'Billing',icon:'💳',desc:'Subscriptions & payments'}, {label:'Notifications',icon:'🔔',desc:'Email and push alerts'}].map((item,i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <span className="text-white text-sm">{item.label}</span>
                  <p className="text-[10px] text-slate-500">{item.desc}</p>
                </div>
              </div>
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
