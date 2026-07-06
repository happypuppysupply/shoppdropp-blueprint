"use client";

import { useState, ReactNode } from "react";

// ============================================
// NAVIGATION STRUCTURE
// ============================================
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
  { id: "projects", label: "Projects", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { id: "products", label: "Products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { id: "orders", label: "Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { id: "content", label: "Content", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
  { id: "ads", label: "Ads", icon: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" },
  { id: "analytics", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id: "ai-agent", label: "AI Agent", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  { id: "automation", label: "Automation", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { id: "integrations", label: "Integrations", icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" },
  { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

// ============================================
// ALL SCREENS REGISTRY
// ============================================
const allScreens = [
  // Auth Flow
  { id: "login", name: "Login", category: "Auth", parent: null },
  { id: "signup", name: "Sign Up", category: "Auth", parent: null },
  { id: "forgot-password", name: "Forgot Password", category: "Auth", parent: null },
  { id: "onboarding-welcome", name: "Onboarding - Welcome", category: "Auth", parent: null },
  { id: "onboarding-experience", name: "Onboarding - Experience", category: "Auth", parent: null },
  { id: "onboarding-goals", name: "Onboarding - Goals", category: "Auth", parent: null },
  { id: "onboarding-connect", name: "Onboarding - Connect", category: "Auth", parent: null },
  { id: "onboarding-ai-setup", name: "Onboarding - AI Setup", category: "Auth", parent: null },
  { id: "onboarding-review", name: "Onboarding - Review", category: "Auth", parent: null },
  { id: "builder", name: "Store Builder", category: "Dashboard", parent: null },
  
  // Dashboard
  { id: "dashboard", name: "Dashboard", category: "Dashboard", parent: null },
  { id: "dashboard-activity", name: "Dashboard - Activity Detail", category: "Dashboard", parent: "dashboard" },
  { id: "notifications", name: "Notifications", category: "Dashboard", parent: null },
  
  // Projects
  { id: "projects", name: "Projects List", category: "Projects", parent: null },
  { id: "project-detail", name: "Project Detail", category: "Projects", parent: "projects" },
  { id: "project-create", name: "Create Project", category: "Projects", parent: "projects" },
  { id: "project-edit", name: "Edit Project", category: "Projects", parent: "projects" },
  { id: "project-settings", name: "Project Settings", category: "Projects", parent: "projects" },
  
  // Products
  { id: "products", name: "Products List", category: "Products", parent: null },
  { id: "product-detail", name: "Product Detail", category: "Products", parent: "products" },
  { id: "product-create", name: "Add Product", category: "Products", parent: "products" },
  { id: "product-edit", name: "Edit Product", category: "Products", parent: "products" },
  { id: "product-import", name: "AutoDS Import", category: "Products", parent: "products" },
  { id: "product-bulk", name: "Bulk Edit", category: "Products", parent: "products" },
  
  // Orders
  { id: "orders", name: "Orders List", category: "Orders", parent: null },
  { id: "order-detail", name: "Order Detail", category: "Orders", parent: "orders" },
  { id: "order-fulfill", name: "Fulfill Order", category: "Orders", parent: "orders" },
  { id: "order-refund", name: "Process Refund", category: "Orders", parent: "orders" },
  { id: "returns", name: "Returns", category: "Orders", parent: null },
  
  // Content
  { id: "content", name: "Content Library", category: "Content", parent: null },
  { id: "content-blog", name: "Blog Posts", category: "Content", parent: "content" },
  { id: "content-social", name: "Social Posts", category: "Content", parent: "content" },
  { id: "content-ads", name: "Ad Creatives", category: "Content", parent: "content" },
  { id: "content-create", name: "Create Content", category: "Content", parent: "content" },
  { id: "content-editor", name: "Content Editor", category: "Content", parent: "content" },
  { id: "content-preview", name: "Content Preview", category: "Content", parent: "content" },
  
  // Ads
  { id: "ads", name: "Campaigns", category: "Ads", parent: null },
  { id: "ads-create", name: "Create Campaign", category: "Ads", parent: "ads" },
  { id: "ads-detail", name: "Campaign Detail", category: "Ads", parent: "ads" },
  { id: "ads-edit", name: "Edit Campaign", category: "Ads", parent: "ads" },
  { id: "ads-audience", name: "Audience Builder", category: "Ads", parent: "ads" },
  { id: "ads-creative", name: "Creative Studio", category: "Ads", parent: "ads" },
  { id: "ads-analytics", name: "Ad Analytics", category: "Ads", parent: "ads" },
  
  // Analytics
  { id: "analytics", name: "Analytics Overview", category: "Analytics", parent: null },
  { id: "analytics-sales", name: "Sales Reports", category: "Analytics", parent: "analytics" },
  { id: "analytics-traffic", name: "Traffic Analysis", category: "Analytics", parent: "analytics" },
  { id: "analytics-products", name: "Product Performance", category: "Analytics", parent: "analytics" },
  { id: "analytics-custom", name: "Custom Reports", category: "Analytics", parent: "analytics" },
  { id: "analytics-export", name: "Export Data", category: "Analytics", parent: "analytics" },
  
  // AI Agent
  { id: "ai-agent", name: "AI Chat", category: "AI Agent", parent: null },
  { id: "ai-history", name: "Chat History", category: "AI Agent", parent: "ai-agent" },
  { id: "ai-tasks", name: "AI Tasks", category: "AI Agent", parent: "ai-agent" },
  { id: "ai-templates", name: "Prompt Templates", category: "AI Agent", parent: "ai-agent" },
  
  // Automation
  { id: "automation", name: "Automation Rules", category: "Automation", parent: null },
  { id: "automation-create", name: "Create Rule", category: "Automation", parent: "automation" },
  { id: "automation-edit", name: "Edit Rule", category: "Automation", parent: "automation" },
  { id: "automation-logs", name: "Execution Logs", category: "Automation", parent: "automation" },
  { id: "workflows", name: "Workflows", category: "Automation", parent: null },
  
  // Integrations
  { id: "integrations", name: "Connected Apps", category: "Integrations", parent: null },
  { id: "integration-shopify", name: "Shopify Settings", category: "Integrations", parent: "integrations" },
  { id: "integration-autods", name: "AutoDS Settings", category: "Integrations", parent: "integrations" },
  { id: "integration-meta", name: "Meta Settings", category: "Integrations", parent: "integrations" },
  { id: "integration-tiktok", name: "TikTok Settings", category: "Integrations", parent: "integrations" },
  { id: "api-keys", name: "API Keys", category: "Integrations", parent: null },
  { id: "webhooks", name: "Webhooks", category: "Integrations", parent: null },
  
  // Settings
  { id: "settings", name: "General Settings", category: "Settings", parent: null },
  { id: "settings-profile", name: "Profile", category: "Settings", parent: "settings" },
  { id: "settings-team", name: "Team Members", category: "Settings", parent: "settings" },
  { id: "settings-billing", name: "Billing", category: "Settings", parent: "settings" },
  { id: "settings-notifications", name: "Notifications", category: "Settings", parent: "settings" },
  { id: "settings-security", name: "Security", category: "Settings", parent: "settings" },
  { id: "settings-billing-history", name: "Billing History", category: "Settings", parent: "settings" },
  { id: "settings-plan", name: "Plan & Usage", category: "Settings", parent: "settings" },
];

const categories = ["All", ...new Set(allScreens.map(s => s.category))];

// ============================================
// LOGO COMPONENT
// ============================================
function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-7 h-7", md: "w-8 h-8", lg: "w-10 h-10" };
  const iconSizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };
  return (
    <div className={`${sizes[size]} rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/20`}>
      <svg className={`${iconSizes[size]} text-white`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
      </svg>
    </div>
  );
}

function LogoWithText({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const textSizes = { sm: "text-sm", md: "text-base", lg: "text-lg" };
  return (
    <div className="flex items-center gap-2">
      <Logo size={size} />
      <span className={`${textSizes[size]} font-bold tracking-tight`}>
        <span className="text-white">SHOPP</span>
        <span className="text-violet-400">DROPP</span>
      </span>
    </div>
  );
}

// ============================================
// SIDEBAR COMPONENT
// ============================================
function Sidebar({ activeId, onNavigate }: { activeId: string; onNavigate: (id: string) => void }) {
  return (
    <div className="w-16 h-full bg-[#0a0a0f] border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="h-14 flex items-center justify-center border-b border-white/5">
        <Logo size="sm" />
      </div>
      
      {/* Nav Items */}
      <div className="flex-1 py-3 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeId === item.id || activeId.startsWith(item.id + "-");
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                isActive 
                  ? "bg-violet-500/20 text-violet-400" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
              title={item.label}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2 : 1.5} d={item.icon} />
              </svg>
              <span className="text-[8px] font-medium truncate w-full text-center px-1">{item.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Bottom Actions */}
      <div className="p-2 border-t border-white/5 space-y-1">
        <button 
          onClick={() => onNavigate("notifications")}
          className="w-full aspect-square rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors relative"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border-2 border-[#0a0a0f]" />
        </button>
        <button 
          onClick={() => onNavigate("settings")}
          className="w-full aspect-square rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center text-xs font-bold text-white">JS</div>
        </button>
      </div>
    </div>
  );
}

// ============================================
// HEADER COMPONENT
// ============================================
function Header({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="h-14 border-b border-white/5 flex items-center justify-between px-4 bg-[#0a0a0f]">
      <div>
        <h1 className="text-sm font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// ============================================
// MAIN PAGE
// ============================================
export default function PlatformUIPage() {
  const [selCat, setSelCat] = useState("All");
  const [currentScreen, setCurrentScreen] = useState<string>("dashboard");
  const [modalScreen, setModalScreen] = useState<string | null>(null);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(["Dashboard"]);

  const filtered = selCat === "All" ? allScreens : allScreens.filter(s => s.category === selCat);

  const handleNavigate = (screenId: string) => {
    setCurrentScreen(screenId);
    const screen = allScreens.find(s => s.id === screenId);
    if (screen) {
      setBreadcrumb(screen.parent ? [screen.parent, screen.name] : [screen.name]);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Platform UI Gallery</h1>
          <p className="text-slate-400 text-sm md:text-base">{allScreens.length} interactive screens — click elements to navigate</p>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium w-fit border border-violet-500/30">
          {allScreens.length} Screens
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
        {filtered.map((screen) => (
          <div key={screen.id} onClick={() => setModalScreen(screen.id)} className="group cursor-pointer">
            <div className="overflow-hidden rounded-2xl bg-[#0d0d12] border border-white/10 hover:border-violet-500/50 transition-all hover:shadow-lg hover:shadow-violet-500/10">
              <div className="aspect-[4/3] bg-[#08080c]">
                <ScreenRender 
                  screen={screen.id} 
                  onNavigate={handleNavigate}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-500">{screen.category}</span>
                  {screen.parent && <span className="text-[10px] text-violet-400">↳ {screen.parent}</span>}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{screen.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalScreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setModalScreen(null)}>
          <div className="w-full max-w-6xl max-h-[90vh] overflow-auto bg-[#0a0a0f] rounded-2xl border border-white/10 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                  {breadcrumb.map((crumb, i) => (
                    <span key={i}>
                      {i > 0 && <span className="mx-2">/</span>}
                      <span className={i === breadcrumb.length - 1 ? "text-white" : ""}>{crumb}</span>
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-bold text-white">{allScreens.find(s => s.id === modalScreen)?.name}</h2>
              </div>
              <button onClick={() => setModalScreen(null)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="aspect-video">
              <ScreenRender screen={modalScreen} onNavigate={handleNavigate} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// SCREEN RENDERER
// ============================================
function ScreenRender({ screen, onNavigate }: { screen: string; onNavigate: (id: string) => void }) {
  switch (screen) {
    // Auth
    case "login": return <LoginScreen onNavigate={onNavigate} />;
    case "signup": return <SignupScreen onNavigate={onNavigate} />;
    case "forgot-password": return <ForgotPasswordScreen onNavigate={onNavigate} />;
    case "onboarding-welcome": return <OnboardingWelcome onNavigate={onNavigate} />;
    case "onboarding-experience": return <OnboardingExperience onNavigate={onNavigate} />;
    case "onboarding-goals": return <OnboardingGoals onNavigate={onNavigate} />;
    case "onboarding-connect": return <OnboardingConnect onNavigate={onNavigate} />;
    case "onboarding-ai-setup": return <OnboardingAISetup onNavigate={onNavigate} />;
    case "onboarding-review": return <OnboardingReview onNavigate={onNavigate} />;
    case "builder": return <BuilderScreen onNavigate={onNavigate} />;
    
    // Dashboard
    case "dashboard": return <DashboardScreen onNavigate={onNavigate} />;
    case "dashboard-activity": return <DashboardActivity onNavigate={onNavigate} />;
    case "notifications": return <NotificationsScreen onNavigate={onNavigate} />;
    
    // Projects
    case "projects": return <ProjectsScreen onNavigate={onNavigate} />;
    case "project-detail": return <ProjectDetail onNavigate={onNavigate} />;
    case "project-create": return <ProjectCreate onNavigate={onNavigate} />;
    case "project-edit": return <ProjectEdit onNavigate={onNavigate} />;
    case "project-settings": return <ProjectSettings onNavigate={onNavigate} />;
    
    // Products
    case "products": return <ProductsScreen onNavigate={onNavigate} />;
    case "product-detail": return <ProductDetail onNavigate={onNavigate} />;
    case "product-create": return <ProductCreate onNavigate={onNavigate} />;
    case "product-edit": return <ProductEdit onNavigate={onNavigate} />;
    case "product-import": return <ProductImport onNavigate={onNavigate} />;
    case "product-bulk": return <ProductBulk onNavigate={onNavigate} />;
    
    // Orders
    case "orders": return <OrdersScreen onNavigate={onNavigate} />;
    case "order-detail": return <OrderDetail onNavigate={onNavigate} />;
    case "order-fulfill": return <OrderFulfill onNavigate={onNavigate} />;
    case "order-refund": return <OrderRefund onNavigate={onNavigate} />;
    case "returns": return <ReturnsScreen onNavigate={onNavigate} />;
    
    // Content
    case "content": return <ContentScreen onNavigate={onNavigate} />;
    case "content-blog": return <ContentBlog onNavigate={onNavigate} />;
    case "content-social": return <ContentSocial onNavigate={onNavigate} />;
    case "content-ads": return <ContentAds onNavigate={onNavigate} />;
    case "content-create": return <ContentCreate onNavigate={onNavigate} />;
    case "content-editor": return <ContentEditor onNavigate={onNavigate} />;
    case "content-preview": return <ContentPreview onNavigate={onNavigate} />;
    
    // Ads
    case "ads": return <AdsScreen onNavigate={onNavigate} />;
    case "ads-create": return <AdsCreate onNavigate={onNavigate} />;
    case "ads-detail": return <AdsDetail onNavigate={onNavigate} />;
    case "ads-edit": return <AdsEdit onNavigate={onNavigate} />;
    case "ads-audience": return <AdsAudience onNavigate={onNavigate} />;
    case "ads-creative": return <AdsCreative onNavigate={onNavigate} />;
    case "ads-analytics": return <AdsAnalytics onNavigate={onNavigate} />;
    
    // Analytics
    case "analytics": return <AnalyticsScreen onNavigate={onNavigate} />;
    case "analytics-sales": return <AnalyticsSales onNavigate={onNavigate} />;
    case "analytics-traffic": return <AnalyticsTraffic onNavigate={onNavigate} />;
    case "analytics-products": return <AnalyticsProducts onNavigate={onNavigate} />;
    case "analytics-custom": return <AnalyticsCustom onNavigate={onNavigate} />;
    case "analytics-export": return <AnalyticsExport onNavigate={onNavigate} />;
    
    // AI Agent
    case "ai-agent": return <AIAgentScreen onNavigate={onNavigate} />;
    case "ai-history": return <AIHistory onNavigate={onNavigate} />;
    case "ai-tasks": return <AITasks onNavigate={onNavigate} />;
    case "ai-templates": return <AITemplates onNavigate={onNavigate} />;
    
    // Automation
    case "automation": return <AutomationScreen onNavigate={onNavigate} />;
    case "automation-create": return <AutomationCreate onNavigate={onNavigate} />;
    case "automation-edit": return <AutomationEdit onNavigate={onNavigate} />;
    case "automation-logs": return <AutomationLogs onNavigate={onNavigate} />;
    case "workflows": return <WorkflowsScreen onNavigate={onNavigate} />;
    
    // Integrations
    case "integrations": return <IntegrationsScreen onNavigate={onNavigate} />;
    case "integration-shopify": return <IntegrationShopify onNavigate={onNavigate} />;
    case "integration-autods": return <IntegrationAutoDS onNavigate={onNavigate} />;
    case "integration-meta": return <IntegrationMeta onNavigate={onNavigate} />;
    case "integration-tiktok": return <IntegrationTikTok onNavigate={onNavigate} />;
    case "api-keys": return <APIKeysScreen onNavigate={onNavigate} />;
    case "webhooks": return <WebhooksScreen onNavigate={onNavigate} />;
    
    // Settings
    case "settings": return <SettingsScreen onNavigate={onNavigate} />;
    case "settings-profile": return <SettingsProfile onNavigate={onNavigate} />;
    case "settings-team": return <SettingsTeam onNavigate={onNavigate} />;
    case "settings-billing": return <SettingsBilling onNavigate={onNavigate} />;
    case "settings-notifications": return <SettingsNotifications onNavigate={onNavigate} />;
    case "settings-security": return <SettingsSecurity onNavigate={onNavigate} />;
    case "settings-billing-history": return <SettingsBillingHistory onNavigate={onNavigate} />;
    case "settings-plan": return <SettingsPlan onNavigate={onNavigate} />;
    
    default: return <DashboardScreen onNavigate={onNavigate} />;
  }
}

// ============================================
// AUTH SCREENS
// ============================================
function LoginScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#08080c] p-6">
      <div className="w-full max-w-[280px] space-y-5">
        <div className="text-center">
          <LogoWithText size="lg" />
          <h2 className="text-lg font-bold text-white mt-4 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-xs">Sign in to your AI store</p>
        </div>
        <button 
          onClick={() => onNavigate("dashboard")}
          className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
        >
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
          <input type="text" placeholder="Email address" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 outline-none focus:border-violet-500/50" />
          <input type="password" placeholder="Password" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 outline-none focus:border-violet-500/50" />
        </div>
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
            <input type="checkbox" className="rounded bg-white/5 border-white/10" />
            Remember me
          </label>
          <button onClick={() => onNavigate("forgot-password")} className="text-violet-400 hover:underline">Forgot password?</button>
        </div>
        <button onClick={() => onNavigate("dashboard")} className="w-full p-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">Sign In</button>
        <p className="text-center text-slate-500 text-xs">Don't have an account? <button onClick={() => onNavigate("signup")} className="text-violet-400 hover:underline">Sign up</button></p>
      </div>
    </div>
  );
}

function SignupScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#08080c] p-6">
      <div className="w-full max-w-[280px] space-y-5">
        <div className="text-center">
          <LogoWithText size="lg" />
          <h2 className="text-lg font-bold text-white mt-4 mb-1">Create account</h2>
          <p className="text-slate-500 text-xs">Start your AI-powered store</p>
        </div>
        <div className="space-y-3">
          <input type="text" placeholder="Full name" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 outline-none focus:border-violet-500/50" />
          <input type="text" placeholder="Email address" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 outline-none focus:border-violet-500/50" />
          <input type="password" placeholder="Password" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 outline-none focus:border-violet-500/50" />
          <input type="password" placeholder="Confirm password" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 outline-none focus:border-violet-500/50" />
        </div>
        <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer">
          <input type="checkbox" className="rounded bg-white/5 border-white/10 mt-0.5" />
          <span>I agree to the <span className="text-violet-400">Terms of Service</span> and <span className="text-violet-400">Privacy Policy</span></span>
        </label>
        <button onClick={() => onNavigate("onboarding-welcome")} className="w-full p-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">Create Account</button>
        <p className="text-center text-slate-500 text-xs">Already have an account? <button onClick={() => onNavigate("login")} className="text-violet-400 hover:underline">Sign in</button></p>
      </div>
    </div>
  );
}

function ForgotPasswordScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#08080c] p-6">
      <div className="w-full max-w-[280px] space-y-5">
        <div className="text-center">
          <LogoWithText size="lg" />
          <h2 className="text-lg font-bold text-white mt-4 mb-1">Reset password</h2>
          <p className="text-slate-500 text-xs">Enter your email to receive reset instructions</p>
        </div>
        <input type="text" placeholder="Email address" className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder-slate-500 outline-none focus:border-violet-500/50" />
        <button onClick={() => onNavigate("login")} className="w-full p-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity">Send Reset Link</button>
        <button onClick={() => onNavigate("login")} className="w-full text-center text-slate-500 text-xs hover:text-white transition-colors">← Back to login</button>
      </div>
    </div>
  );
}

function OnboardingWelcome({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#08080c] p-6">
      <div className="w-full max-w-[320px] text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 mx-auto flex items-center justify-center text-4xl shadow-xl shadow-violet-500/20">🚀</div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Welcome to ShoppDropp!</h2>
          <p className="text-slate-400 text-sm">Let's set up your AI-powered store in just a few minutes. We'll guide you through connecting your tools and configuring your preferences.</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-[10px] text-slate-400">5 min setup</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-2xl mb-1">🤖</div>
            <p className="text-[10px] text-slate-400">AI powered</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="text-2xl mb-1">📈</div>
            <p className="text-[10px] text-slate-400">Auto scale</p>
          </div>
        </div>
        <button onClick={() => onNavigate("onboarding-experience")} className="w-full p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Get Started</button>
      </div>
    </div>
  );
}

function OnboardingExperience({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [selected, setSelected] = useState<string | null>("intermediate");
  return (
    <div className="h-full flex flex-col bg-[#08080c] p-6">
      <div className="flex-1 max-w-[400px] mx-auto w-full space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i === 1 ? "bg-violet-500" : "bg-white/10"}`} />
            ))}
          </div>
          <h2 className="text-lg font-bold text-white mb-1">What's your experience level?</h2>
          <p className="text-slate-400 text-sm">This helps us personalize your AI assistant</p>
        </div>
        <div className="space-y-3">
          {[
            {id: "beginner", title: "Beginner", desc: "New to e-commerce and dropshipping", icon: "🌱"},
            {id: "intermediate", title: "Intermediate", desc: "Some experience with online stores", icon: "📊"},
            {id: "expert", title: "Expert", desc: "Experienced with multiple stores", icon: "🚀"},
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${selected === opt.id ? "bg-violet-500/10 border-violet-500/50" : "bg-white/5 border-white/5 hover:bg-white/10"}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{opt.icon}</span>
                <div>
                  <p className="text-white text-sm font-medium">{opt.title}</p>
                  <p className="text-slate-400 text-xs">{opt.desc}</p>
                </div>
                {selected === opt.id && <div className="ml-auto w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg></div>}
              </div>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => onNavigate("signup")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Back</button>
          <button onClick={() => onNavigate("onboarding-goals")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Continue</button>
        </div>
      </div>
    </div>
  );
}

function OnboardingGoals({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [goals, setGoals] = useState<string[]>(["scale", "automate"]);
  const toggleGoal = (id: string) => {
    setGoals(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };
  return (
    <div className="h-full flex flex-col bg-[#08080c] p-6">
      <div className="flex-1 max-w-[400px] mx-auto w-full space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i <= 2 ? "bg-violet-500" : "bg-white/10"}`} />
            ))}
          </div>
          <h2 className="text-lg font-bold text-white mb-1">What are your goals?</h2>
          <p className="text-slate-400 text-sm">Select all that apply</p>
        </div>
        <div className="space-y-3">
          {[
            {id: "launch", title: "Launch new store", desc: "Start a new dropshipping business", icon: "🚀"},
            {id: "scale", title: "Scale existing store", desc: "Grow revenue and automate operations", icon: "📈"},
            {id: "products", title: "Find winning products", desc: "Use AI to discover trending items", icon: "🎯"},
            {id: "ads", title: "Optimize ads", desc: "Improve ROAS with AI targeting", icon: "📢"},
            {id: "automate", title: "Automate everything", desc: "Let AI handle daily operations", icon: "🤖"},
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => toggleGoal(opt.id)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${goals.includes(opt.id) ? "bg-violet-500/10 border-violet-500/50" : "bg-white/5 border-white/5 hover:bg-white/10"}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{opt.icon}</span>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{opt.title}</p>
                  <p className="text-slate-400 text-xs">{opt.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${goals.includes(opt.id) ? "bg-violet-500 border-violet-500" : "border-white/20"}`}>
                  {goals.includes(opt.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => onNavigate("onboarding-experience")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Back</button>
          <button onClick={() => onNavigate("onboarding-connect")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Continue</button>
        </div>
      </div>
    </div>
  );
}

function OnboardingConnect({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [connected, setConnected] = useState<string[]>(["shopify", "autods"]);
  return (
    <div className="h-full flex flex-col bg-[#08080c] p-6">
      <div className="flex-1 max-w-[400px] mx-auto w-full space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i <= 3 ? "bg-violet-500" : "bg-white/10"}`} />
            ))}
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Connect your tools</h2>
          <p className="text-slate-400 text-sm">Link the platforms you want to automate</p>
        </div>
        <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center gap-2">
          <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00 2 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          <p className="text-violet-300 text-xs">All connections are encrypted with AES-256</p>
        </div>
        <div className="space-y-2">
          {[
            {id: "shopify", name: "Shopify", desc: "Your e-commerce platform", icon: "🛍️"},
            {id: "autods", name: "AutoDS", desc: "Dropshipping automation", icon: "📦"},
            {id: "meta", name: "Meta Ads", desc: "Facebook & Instagram ads", icon: "📢"},
            {id: "tiktok", name: "TikTok Ads", desc: "TikTok advertising", icon: "🎵"},
          ].map(platform => (
            <div key={platform.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl">{platform.icon}</div>
                <div>
                  <p className="text-white text-sm font-medium">{platform.name}</p>
                  <p className="text-slate-500 text-xs">{platform.desc}</p>
                </div>
              </div>
              {connected.includes(platform.id) ? (
                <div className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">Connected</span>
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                  </div>
                </div>
              ) : (
                <button onClick={() => setConnected([...connected, platform.id])} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium">Connect</button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => onNavigate("onboarding-goals")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Back</button>
          <button onClick={() => onNavigate("onboarding-ai-setup")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Continue</button>
        </div>
      </div>
    </div>
  );
}

function OnboardingAISetup({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex flex-col bg-[#08080c] p-6">
      <div className="flex-1 max-w-[400px] mx-auto w-full space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i <= 4 ? "bg-violet-500" : "bg-white/10"}`} />
            ))}
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Configure your AI</h2>
          <p className="text-slate-400 text-sm">Set your preferences for automation</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-xs block mb-2">Store Niche</label>
            <select className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50">
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home & Garden</option>
              <option>Sports</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 text-xs block mb-2">Target Audience</label>
            <select className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-violet-500/50">
              <option>18-35 Tech Enthusiasts</option>
              <option>25-45 Professionals</option>
              <option>18-24 Gen Z</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 text-xs block mb-2">Daily Ad Budget</label>
            <div className="flex items-center gap-3">
              <input type="range" className="flex-1" defaultValue="50" min="10" max="500" />
              <span className="text-white text-sm font-medium w-16">$50</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-pink-500/10 border border-violet-500/20">
            <p className="text-white text-sm font-medium mb-1">🤖 AI Strategy Preview</p>
            <p className="text-slate-400 text-xs">Your AI will auto-import trending products, generate SEO content, and optimize ads daily.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onNavigate("onboarding-connect")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Back</button>
          <button onClick={() => onNavigate("onboarding-review")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Continue</button>
        </div>
      </div>
    </div>
  );
}

function OnboardingReview({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex flex-col bg-[#08080c] p-6">
      <div className="flex-1 max-w-[400px] mx-auto w-full space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex-1 h-1 rounded-full bg-violet-500" />
            ))}
          </div>
          <h2 className="text-lg font-bold text-white mb-1">Ready to launch?</h2>
          <p className="text-slate-400 text-sm">Review your configuration</p>
        </div>
        <div className="space-y-3">
          {[
            {label: "Experience", value: "Intermediate", icon: "📊"},
            {label: "Goals", value: "Scale store, Automate", icon: "🎯"},
            {label: "Connected", value: "Shopify, AutoDS", icon: "🔗"},
            {label: "Niche", value: "Electronics", icon: "🛍️"},
            {label: "Ad Budget", value: "$50/day", icon: "💰"},
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="text-slate-400 text-xs">{item.label}</span>
              </div>
              <span className="text-white text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
          <p className="text-white text-sm font-medium mb-1">⚡ What happens next?</p>
          <p className="text-slate-400 text-xs">Our AI will build your store, import products, and start optimizing. This takes about 5-10 minutes.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onNavigate("onboarding-ai-setup")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Back</button>
          <button onClick={() => onNavigate("builder")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Build My Store</button>
        </div>
      </div>
    </div>
  );
}

function BuilderScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [progress] = useState(63);
  const steps = [
    {id: 1, label: "Authenticating with Shopify", status: "completed"},
    {id: 2, label: "Connecting AutoDS API", status: "completed"},
    {id: 3, label: "Configuring Meta Ads", status: "completed"},
    {id: 4, label: "Syncing product catalog", status: "in_progress"},
    {id: 5, label: "Generating AI descriptions", status: "pending"},
    {id: 6, label: "Creating store theme", status: "pending"},
    {id: 7, label: "Setting up analytics", status: "pending"},
    {id: 8, label: "Configuring automation rules", status: "pending"},
    {id: 9, label: "Optimizing SEO metadata", status: "pending"},
    {id: 10, label: "Final launch preparation", status: "pending"},
  ];
  return (
    <div className="h-full flex bg-[#08080c]">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 py-3 border-b border-white/5 bg-[#0a0a0f]">
          <div className="flex items-center gap-4 max-w-[600px]">
            {[
              {n: "Create Account", s: "completed"},
              {n: "Connect Tools", s: "completed"},
              {n: "Review", s: "completed"},
              {n: "Building", s: "in_progress"},
            ].map((step, i, arr) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${step.s === "completed" ? "bg-green-500/20 text-green-400 border border-green-500/30" : step.s === "in_progress" ? "bg-violet-500 text-white" : "bg-white/5 text-slate-500"}`}>
                  {step.s === "completed" ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg> : i + 1}
                </div>
                <span className={`text-[10px] ${step.s === "in_progress" ? "text-white" : "text-slate-500"}`}>{step.n}</span>
                {i < arr.length - 1 && <div className="w-4 h-px bg-white/10" />}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex gap-4 p-4 overflow-auto">
          <div className="flex-1 space-y-4">
            <div className="p-5 rounded-xl bg-gradient-to-br from-violet-500/15 to-pink-500/10 border border-violet-500/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Your AI store is being built!</h3>
                  <p className="text-slate-400 text-xs">This usually takes 5-10 minutes</p>
                </div>
                <div className="w-14 h-14 relative">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
                    <circle cx="24" cy="24" r="20" fill="none" stroke="url(#grad)" strokeWidth="4" strokeDasharray="126" strokeDashoffset={126 - (126 * progress / 100)} strokeLinecap="round"/>
                    <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#ec4899"/></linearGradient></defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">{progress}%</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span>Elapsed: <span className="text-white font-mono">04:12</span></span>
                <span>Remaining: <span className="text-white font-mono">02:30</span></span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-sm font-medium mb-3">Build Steps</p>
              <div className="space-y-1.5">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center gap-3 p-2 rounded-lg bg-[#0d0d12]">
                    <span className="text-[10px] text-slate-500 w-4">{step.id}</span>
                    {step.status === "completed" ? (
                      <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                      </div>
                    ) : step.status === "in_progress" ? (
                      <div className="w-4 h-4 rounded-full border-2 border-violet-500/30 border-t-violet-500 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-white/5" />
                    )}
                    <span className={`text-[11px] flex-1 ${step.status === "completed" ? "text-slate-500 line-through" : step.status === "in_progress" ? "text-white" : "text-slate-600"}`}>{step.label}</span>
                    {step.status === "in_progress" && <span className="text-[9px] text-violet-400 animate-pulse">Working...</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-48 space-y-4 hidden md:block">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-xs font-medium mb-2">Store Details</p>
              {[{l:"Name",v:"Gadget Hub"}, {l:"Platform",v:"Shopify"}, {l:"Niche",v:"Electronics"}, {l:"Region",v:"US"}].map(d => (
                <div key={d.l} className="flex justify-between items-center py-1">
                  <span className="text-[10px] text-slate-500">{d.l}</span>
                  <span className="text-[10px] text-white">{d.v}</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-xs font-medium mb-2">Live Activity</p>
              <div className="space-y-2">
                {[{t:"Connected to Shopify",c:"green"}, {t:"AutoDS login succeeded",c:"green"}, {t:"Fetching products...",c:"violet"}].map((a,i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${a.c === "green" ? "bg-green-400" : "bg-violet-400 animate-pulse"}`} />
                    <span className="text-[10px] text-slate-400 truncate">{a.t}</span>
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

function DashboardScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="dashboard" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Dashboard" 
          subtitle="Welcome back, John"
          actions={
            <button onClick={() => onNavigate("ai-agent")} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-300 text-xs border border-violet-500/30 hover:bg-violet-500/30 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              AI Online
            </button>
          }
        />
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          <div className="grid grid-cols-3 gap-3">
            {[{l:"Revenue",v:"$12.5K",c:"+18.5%",t:"vs last month"}, {l:"Orders",v:"326",c:"+12.4%",t:"vs last month"}, {l:"ROAS",v:"3.8x",c:"+22.7%",t:"vs last month"}].map((s,i) => (
              <button key={i} onClick={() => onNavigate("analytics")} className={`p-4 rounded-xl text-left transition-all hover:scale-[1.02] ${i===0 ? "bg-gradient-to-br from-violet-500/20 to-violet-600/10 border border-violet-500/30" : "bg-white/5 border border-white/5 hover:border-white/10"}`}>
                <p className="text-slate-500 text-[10px] uppercase tracking-wider">{s.l}</p>
                <p className="text-white text-xl font-bold mt-1">{s.v}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-green-400 text-xs">{s.c}</span>
                  <span className="text-slate-500 text-[10px]">{s.t}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm font-medium">Sales Overview</p>
                <select className="bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400 px-2 py-1">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </div>
              <div className="h-24 flex items-end gap-1">
                {[35,55,42,78,62,85,70].map((h,i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-violet-500 to-pink-500 rounded-t" style={{height:`${h}%`}} />
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <span key={d} className="text-[9px] text-slate-600 flex-1 text-center">{d}</span>)}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm font-medium">AI Activity</p>
                <button onClick={() => onNavigate("dashboard-activity")} className="text-violet-400 text-xs hover:underline">View all</button>
              </div>
              <div className="space-y-2">
                {[{e:"🤖",t:"Imported 12 products from AutoDS",tm:"2m ago"}, {e:"✍️",t:"Generated 5 blog posts for SEO",tm:"15m ago"}, {e:"📢",t:"Launched Meta ad campaign",tm:"1h ago"}, {e:"🎯",t:"Optimized ad targeting",tm:"2h ago"}].map((a,i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0d0d12] hover:bg-white/5 transition-colors cursor-pointer">
                    <span className="text-base">{a.e}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs truncate">{a.t}</p>
                      <p className="text-slate-500 text-[10px]">{a.tm}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <button onClick={() => onNavigate("products")} className="p-4 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
              </div>
              <p className="text-white text-sm font-medium">Products</p>
              <p className="text-slate-500 text-xs">156 active</p>
            </button>
            <button onClick={() => onNavigate("orders")} className="p-4 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
              </div>
              <p className="text-white text-sm font-medium">Orders</p>
              <p className="text-slate-500 text-xs">24 pending</p>
            </button>
            <button onClick={() => onNavigate("ads")} className="p-4 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"/></svg>
              </div>
              <p className="text-white text-sm font-medium">Campaigns</p>
              <p className="text-slate-500 text-xs">4 active</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardActivity({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="dashboard" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Activity Log" subtitle="All AI and user actions" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-2">
            {[
              {e:"🤖",t:"Imported 12 products from AutoDS",d:"Successfully added trending electronics to your catalog",tm:"2m ago",type:"AI Action"},
              {e:"✍️",t:"Generated 5 blog posts for SEO",d:"Content published to your store blog",tm:"15m ago",type:"AI Action"},
              {e:"📢",t:"Launched Meta ad campaign",d:"Summer Sale 2026 campaign is now live",tm:"1h ago",type:"User Action"},
              {e:"🎯",t:"Optimized ad targeting",d:"ROAS improved from 2.8x to 3.2x",tm:"2h ago",type:"AI Action"},
              {e:"📦",t:"Fulfilled order #1234",d:"Products shipped to customer",tm:"3h ago",type:"User Action"},
              {e:"💰",t:"New order received",d:"Order #1235 for $89.99",tm:"4h ago",type:"System"},
            ].map((a,i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                <span className="text-xl">{a.e}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm font-medium">{a.t}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400">{a.type}</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">{a.d}</p>
                  <p className="text-slate-600 text-[10px] mt-2">{a.tm}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Notifications" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-2">
            {[
              {t:"High ROAS Alert",d:"Your Meta campaign ROAS reached 4.5x",time:"5m ago",read:false,type:"success"},
              {t:"Low Stock Warning",d:"Earbuds Pro inventory below 10 units",time:"1h ago",read:false,type:"warning"},
              {t:"Order Shipped",d:"Order #1234 has been delivered",time:"3h ago",read:true,type:"info"},
              {t:"AI Task Complete",d:"Product import finished successfully",time:"5h ago",read:true,type:"success"},
            ].map((n,i) => (
              <div key={i} className={`p-4 rounded-xl border flex items-start gap-3 ${n.read ? "bg-white/5 border-white/5" : "bg-violet-500/5 border-violet-500/20"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${n.type === "success" ? "bg-green-500/20" : n.type === "warning" ? "bg-yellow-500/20" : "bg-blue-500/20"}`}>
                  <span className="text-base">{n.type === "success" ? "✅" : n.type === "warning" ? "⚠️" : "ℹ️"}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-white text-sm font-medium">{n.t}</p>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-violet-500" />}
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">{n.d}</p>
                  <p className="text-slate-600 text-[10px] mt-2">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="projects" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Projects" 
          subtitle="Manage your AI stores"
          actions={
            <button onClick={() => onNavigate("project-create")} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium hover:opacity-90 transition-opacity">
              + New Project
            </button>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-2 gap-3">
            {[
              {n:"Gadget Hub",s:"active",r:"$8.2K",p:24,m:"23%",t:"Electronics",i:"⚡"},
              {n:"Fashion Forward",s:"active",r:"$4.3K",p:156,m:"45%",t:"Fashion",i:"👕"},
              {n:"Home Comfort",s:"paused",r:"$1.2K",p:89,m:"32%",t:"Home",i:"🏠"},
            ].map((proj,i) => (
              <button key={i} onClick={() => onNavigate("project-detail")} className="p-4 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/30 to-pink-500/30 flex items-center justify-center text-2xl">{proj.i}</div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${proj.s==="active"?"bg-green-500/15 text-green-400 border border-green-500/20":"bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"}`}>{proj.s}</span>
                </div>
                <p className="text-white text-sm font-semibold">{proj.n}</p>
                <p className="text-slate-500 text-xs">{proj.t}</p>
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/5">
                  <div>
                    <p className="text-[10px] text-slate-500">Revenue</p>
                    <p className="text-white text-sm font-medium">{proj.r}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Products</p>
                    <p className="text-white text-sm font-medium">{proj.p}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Margin</p>
                    <p className="text-green-400 text-sm font-medium">{proj.m}</p>
                  </div>
                </div>
              </button>
            ))}
            <button onClick={() => onNavigate("project-create")} className="p-4 rounded-xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 hover:border-violet-500/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              </div>
              <span className="text-slate-400 text-xs">Create New Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="projects" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Gadget Hub" 
          subtitle="Electronics store"
          actions={
            <>
              <button onClick={() => onNavigate("project-edit")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Edit</button>
              <button onClick={() => onNavigate("project-settings")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Settings</button>
            </>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[{l:"Revenue",v:"$8.2K",c:"+12%"}, {l:"Orders",v:"142",c:"+8%"}, {l:"Products",v:"24",c:"+5"}, {l:"ROAS",v:"3.2x",c:"+0.4"}].map((s,i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-slate-500 text-[10px] uppercase">{s.l}</p>
                <p className="text-white text-lg font-bold">{s.v}</p>
                <span className="text-green-400 text-[10px]">{s.c}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm font-medium">Recent Orders</p>
                <button onClick={() => onNavigate("orders")} className="text-violet-400 text-xs hover:underline">View all</button>
              </div>
              <div className="space-y-2">
                {[{id:"#1421",amt:"$89.99",s:"fulfilled"}, {id:"#1420",amt:"$156.50",s:"processing"}, {id:"#1419",amt:"$45.00",s:"shipped"}].map(o => (
                  <div key={o.id} className="flex items-center justify-between p-2 rounded-lg bg-[#0d0d12]">
                    <span className="text-white text-xs font-medium">{o.id}</span>
                    <span className="text-white text-xs">{o.amt}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${o.s==="fulfilled"?"bg-green-500/15 text-green-400":o.s==="processing"?"bg-yellow-500/15 text-yellow-400":"bg-blue-500/15 text-blue-400"}`}>{o.s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm font-medium">Top Products</p>
                <button onClick={() => onNavigate("products")} className="text-violet-400 text-xs hover:underline">View all</button>
              </div>
              <div className="space-y-2">
                {[{n:"Wireless Earbuds",s:45}, {n:"Phone Stand",s:32}, {n:"USB-C Cable",s:28}].map((p,i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#0d0d12]">
                    <span className="text-white text-xs flex-1">{p.n}</span>
                    <div className="w-16 h-1.5 bg-white/10 rounded-full"><div className="h-full bg-violet-500 rounded-full" style={{width:`${p.s}%`}}/></div>
                    <span className="text-slate-400 text-[10px] w-6 text-right">{p.s}</span>
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

function ProjectCreate({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="projects" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Create New Project" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="text-slate-400 text-xs block mb-2">Project Name</label>
              <input type="text" placeholder="My AI Store" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-500 outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Store Niche</label>
              <select className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50">
                <option>Select a niche...</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Home & Garden</option>
                <option>Sports</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Platform</label>
              <div className="grid grid-cols-3 gap-2">
                {["Shopify", "WooCommerce", "BigCommerce"].map(p => (
                  <button key={p} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs hover:border-violet-500/30 transition-colors">{p}</button>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
              <p className="text-white text-sm font-medium mb-1">💡 Pro Tip</p>
              <p className="text-slate-400 text-xs">Choose a niche you're familiar with. The AI will research trends and recommend products automatically.</p>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("projects")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("project-detail")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Create Project</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectEdit({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="projects" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Edit Project" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="text-slate-400 text-xs block mb-2">Project Name</label>
              <input type="text" defaultValue="Gadget Hub" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Description</label>
              <textarea defaultValue="AI-powered electronics store focusing on trending gadgets and accessories." rows={3} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 resize-none" />
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("project-detail")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("project-detail")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectSettings({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="projects" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Project Settings" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h3 className="text-white text-sm font-medium mb-3">AI Configuration</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Auto-import products</span>
                  <div className="w-8 h-4 rounded-full bg-violet-500 relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white"/></div>
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Auto-generate content</span>
                  <div className="w-8 h-4 rounded-full bg-violet-500 relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white"/></div>
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">Auto-optimize ads</span>
                  <div className="w-8 h-4 rounded-full bg-white/10 relative"><div className="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-white"/></div>
                </label>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
              <h3 className="text-red-400 text-sm font-medium mb-2">Danger Zone</h3>
              <p className="text-slate-400 text-xs mb-3">Once you delete a project, there is no going back.</p>
              <button className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs border border-red-500/30 hover:bg-red-500/30 transition-colors">Delete Project</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="products" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Products" 
          subtitle="156 products"
          actions={
            <>
              <button onClick={() => onNavigate("product-import")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Import</button>
              <button onClick={() => onNavigate("product-create")} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium hover:opacity-90 transition-opacity">+ Add Product</button>
            </>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-3 gap-3">
            {[
              {id:"1",n:"Wireless Earbuds Pro",p:"$49.99",c:"$23.50",s:24,m:"47%"},
              {id:"2",n:"Smart Watch Series 5",p:"$129.99",c:"$45.00",s:12,m:"65%"},
              {id:"3",n:"Phone Stand Adjustable",p:"$19.99",c:"$8.50",s:156,m:"57%"},
              {id:"4",n:"LED Desk Lamp",p:"$34.99",c:"$15.00",s:0,m:"57%"},
              {id:"5",n:"USB-C Cable 2m",p:"$12.99",c:"$4.50",s:89,m:"65%"},
              {id:"6",n:"Bluetooth Speaker",p:"$59.99",c:"$28.00",s:34,m:"53%"},
            ].map(prod => (
              <button key={prod.id} onClick={() => onNavigate("product-detail")} className="p-3 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-all group">
                <div className="h-20 bg-gradient-to-br from-white/5 to-white/10 rounded-xl mb-3 flex items-center justify-center text-3xl">📦</div>
                <p className="text-white text-xs font-medium truncate">{prod.n}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-violet-400 text-sm font-bold">{prod.p}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${prod.s>0?"bg-green-500/15 text-green-400 border border-green-500/20":"bg-red-500/15 text-red-400 border border-red-500/20"}`}>{prod.s>0?`${prod.s} in stock`:"Out"}</span>
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500">
                  <span>Cost: {prod.c}</span>
                  <span className="text-green-400">Margin {prod.m}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductDetail({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="products" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Wireless Earbuds Pro" 
          subtitle="SKU: WEP-2026-001"
          actions={
            <>
              <button onClick={() => onNavigate("product-edit")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Edit</button>
              <button className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs border border-red-500/30 hover:bg-red-500/30 transition-colors">Delete</button>
            </>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <div className="aspect-square bg-gradient-to-br from-white/5 to-white/10 rounded-xl flex items-center justify-center text-6xl mb-4">📦</div>
              <div className="grid grid-cols-4 gap-2">
                {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-white/5 rounded-lg" />)}
              </div>
            </div>
            <div className="col-span-2 space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-white text-sm font-medium mb-3">Pricing</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div><p className="text-slate-500 text-xs">Price</p><p className="text-white text-lg font-bold">$49.99</p></div>
                  <div><p className="text-slate-500 text-xs">Cost</p><p className="text-white text-lg font-bold">$23.50</p></div>
                  <div><p className="text-slate-500 text-xs">Margin</p><p className="text-green-400 text-lg font-bold">47%</p></div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-white text-sm font-medium mb-3">Inventory</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div><p className="text-slate-500 text-xs">In Stock</p><p className="text-white text-lg font-bold">24</p></div>
                  <div><p className="text-slate-500 text-xs">Reserved</p><p className="text-white text-lg font-bold">3</p></div>
                  <div><p className="text-slate-500 text-xs">Available</p><p className="text-white text-lg font-bold">21</p></div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-white text-sm font-medium mb-2">Description</h3>
                <p className="text-slate-400 text-xs leading-relaxed">Premium wireless earbuds with active noise cancellation, 30-hour battery life, and crystal-clear sound quality. Perfect for commuting, workouts, and everyday use.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCreate({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="products" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Add Product" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs block mb-2">Product Name</label>
                <input type="text" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-2">SKU</label>
                <input type="text" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-slate-400 text-xs block mb-2">Price</label>
                <input type="text" placeholder="$0.00" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-2">Cost</label>
                <input type="text" placeholder="$0.00" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-2">Stock</label>
                <input type="number" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Description</label>
              <textarea rows={4} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 resize-none" />
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("products")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("product-detail")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Create Product</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductEdit({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="products" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Edit Product" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs block mb-2">Product Name</label>
                <input type="text" defaultValue="Wireless Earbuds Pro" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-2">SKU</label>
                <input type="text" defaultValue="WEP-2026-001" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("product-detail")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("product-detail")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductImport({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="products" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="AutoDS Import" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
            </div>
            <div>
              <h3 className="text-white text-lg font-bold mb-2">Import from AutoDS</h3>
              <p className="text-slate-400 text-sm">Connect to your AutoDS account and import products directly to your store.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-left">
              <p className="text-white text-sm font-medium mb-3">Import Options</p>
              <label className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                <input type="checkbox" defaultChecked className="rounded bg-white/5 border-white/10" />
                Import with AI-generated descriptions
              </label>
              <label className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                <input type="checkbox" defaultChecked className="rounded bg-white/5 border-white/10" />
                Auto-optimize pricing
              </label>
              <label className="flex items-center gap-2 text-slate-400 text-xs">
                <input type="checkbox" className="rounded bg-white/5 border-white/10" />
                Import to draft (review before publishing)
              </label>
            </div>
            <div className="flex gap-3">
              <button onClick={() => onNavigate("products")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("products")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Connect AutoDS</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductBulk({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="products" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Bulk Edit" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <p className="text-slate-400 text-sm">Bulk editing 24 selected products</p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-sm font-medium mb-3">Actions</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded bg-white/5 border-white/10" />
                  <span className="text-slate-400 text-xs">Update pricing by</span>
                  <select className="bg-white/5 border border-white/10 rounded-lg text-xs text-white px-2 py-1">
                    <option>+10%</option>
                    <option>-10%</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded bg-white/5 border-white/10" />
                  <span className="text-slate-400 text-xs">Change status to</span>
                  <select className="bg-white/5 border border-white/10 rounded-lg text-xs text-white px-2 py-1">
                    <option>Active</option>
                    <option>Draft</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => onNavigate("products")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("products")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Apply Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="orders" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Orders" 
          subtitle="326 total orders"
          actions={
            <button onClick={() => onNavigate("returns")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Returns</button>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="flex gap-2 mb-4">
            {["All","Pending","Processing","Shipped","Delivered"].map((f,i) => (
              <button key={f} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i===0?"bg-violet-500/20 text-violet-300 border border-violet-500/30":"bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"}`}>{f}</button>
            ))}
          </div>
          <div className="space-y-2">
            {[
              {id:"#1425",c:"Sarah Johnson",t:"$156.97",s:"processing",d:"Today",items:3},
              {id:"#1424",c:"Mike Chen",t:"$89.50",s:"shipped",d:"Yesterday",items:2},
              {id:"#1423",c:"Emily Davis",t:"$245.00",s:"delivered",d:"Jan 5",items:5},
              {id:"#1422",c:"John Smith",t:"$45.99",s:"pending",d:"Jan 5",items:1},
            ].map(o => (
              <button key={o.id} onClick={() => onNavigate("order-detail")} className="w-full p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3 hover:border-white/10 transition-colors text-left">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">📦</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-semibold">{o.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${o.s==="delivered"?"bg-green-500/15 text-green-400 border border-green-500/20":o.s==="shipped"?"bg-blue-500/15 text-blue-400 border border-blue-500/20":o.s==="processing"?"bg-yellow-500/15 text-yellow-400 border border-yellow-500/20":"bg-slate-500/15 text-slate-400 border border-slate-500/20"}`}>{o.s}</span>
                  </div>
                  <p className="text-slate-400 text-xs">{o.c} • {o.items} items</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-semibold">{o.t}</p>
                  <p className="text-slate-500 text-[10px]">{o.d}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderDetail({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="orders" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Order #1425" 
          subtitle="Placed on Jan 6, 2026"
          actions={
            <>
              <button onClick={() => onNavigate("order-fulfill")} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium hover:opacity-90 transition-opacity">Fulfill</button>
              <button onClick={() => onNavigate("order-refund")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Refund</button>
            </>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-white text-sm font-medium mb-3">Items</h3>
                <div className="space-y-3">
                  {[
                    {n:"Wireless Earbuds Pro",p:"$49.99",q:2},
                    {n:"USB-C Cable 2m",p:"$12.99",q:1},
                    {n:"Phone Stand",p:"$29.00",q:1},
                  ].map((item,i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-[#0d0d12]">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">📦</div>
                      <div className="flex-1">
                        <p className="text-white text-xs font-medium">{item.n}</p>
                        <p className="text-slate-500 text-[10px]">Qty: {item.q}</p>
                      </div>
                      <span className="text-white text-sm">{item.p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-white text-sm font-medium mb-3">Timeline</h3>
                <div className="space-y-3">
                  {[
                    {t:"Order placed",d:"Jan 6, 2026 at 2:30 PM",c:"green"},
                    {t:"Payment confirmed",d:"Jan 6, 2026 at 2:32 PM",c:"green"},
                    {t:"Processing started",d:"Jan 6, 2026 at 3:15 PM",c:"yellow"},
                  ].map((e,i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1 ${e.c==="green"?"bg-green-400":"bg-yellow-400"}`} />
                      <div>
                        <p className="text-white text-xs font-medium">{e.t}</p>
                        <p className="text-slate-500 text-[10px]">{e.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-white text-sm font-medium mb-3">Customer</h3>
                <p className="text-white text-sm">Sarah Johnson</p>
                <p className="text-slate-400 text-xs">sarah@example.com</p>
                <p className="text-slate-500 text-[10px] mt-2">5 previous orders</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-white text-sm font-medium mb-3">Shipping</h3>
                <p className="text-white text-xs">123 Main Street</p>
                <p className="text-white text-xs">Apt 4B</p>
                <p className="text-white text-xs">New York, NY 10001</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <h3 className="text-white text-sm font-medium mb-3">Summary</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400"><span>Subtotal</span><span className="text-white">$141.97</span></div>
                  <div className="flex justify-between text-slate-400"><span>Shipping</span><span className="text-white">$10.00</span></div>
                  <div className="flex justify-between text-slate-400"><span>Tax</span><span className="text-white">$5.00</span></div>
                  <div className="flex justify-between text-white font-medium pt-2 border-t border-white/5"><span>Total</span><span>$156.97</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderFulfill({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="orders" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Fulfill Order #1425" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h3 className="text-white text-sm font-medium mb-3">Shipping Method</h3>
              <div className="space-y-2">
                {["Standard Shipping (3-5 days)","Express Shipping (1-2 days)","Overnight"].map((m,i) => (
                  <label key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#0d0d12] cursor-pointer">
                    <input type="radio" name="shipping" defaultChecked={i===0} className="rounded-full bg-white/5 border-white/10" />
                    <span className="text-white text-xs">{m}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h3 className="text-white text-sm font-medium mb-3">Tracking</h3>
              <input type="text" placeholder="Tracking number (optional)" className="w-full p-3 rounded-xl bg-[#0d0d12] border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => onNavigate("order-detail")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("orders")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Mark as Fulfilled</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderRefund({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="orders" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Process Refund #1425" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h3 className="text-white text-sm font-medium mb-3">Refund Amount</h3>
              <div className="flex items-center gap-2">
                <span className="text-white text-lg">$</span>
                <input type="text" defaultValue="156.97" className="flex-1 p-3 rounded-xl bg-[#0d0d12] border border-white/10 text-white text-lg outline-none focus:border-violet-500/50" />
              </div>
              <p className="text-slate-500 text-xs mt-2">Full order amount</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <h3 className="text-white text-sm font-medium mb-3">Reason</h3>
              <select className="w-full p-3 rounded-xl bg-[#0d0d12] border border-white/10 text-white text-sm outline-none focus:border-violet-500/50">
                <option>Customer request</option>
                <option>Product damaged</option>
                <option>Wrong item shipped</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => onNavigate("order-detail")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("orders")} className="flex-1 p-3 rounded-xl bg-red-500/20 text-red-400 font-semibold border border-red-500/30 hover:bg-red-500/30 transition-colors">Process Refund</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReturnsScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="orders" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Returns" subtitle="3 open returns" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-2">
            {[
              {id:"R-1025",o:"#1421",r:"Wrong size",s:"pending"},
              {id:"R-1024",o:"#1418",r:"Defective",s:"approved"},
              {id:"R-1023",o:"#1415",r:"Changed mind",s:"completed"},
            ].map(r => (
              <div key={r.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{r.id}</p>
                  <p className="text-slate-400 text-xs">Order {r.o} • {r.r}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${r.s==="completed"?"bg-green-500/15 text-green-400":r.s==="approved"?"bg-blue-500/15 text-blue-400":"bg-yellow-500/15 text-yellow-400"}`}>{r.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="content" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Content Library" 
          subtitle="156 items"
          actions={
            <button onClick={() => onNavigate("content-create")} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium hover:opacity-90 transition-opacity">+ Create</button>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="flex gap-2 mb-4">
            {["All","Blog","Social","Ads","Email"].map((f,i) => (
              <button key={f} onClick={() => i===1?onNavigate("content-blog"):i===2?onNavigate("content-social"):i===3?onNavigate("content-ads"):null} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i===0?"bg-violet-500/20 text-violet-300 border border-violet-500/30":"bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"}`}>{f}</button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              {t:"10 Summer Gadgets",ty:"blog",s:"published",d:"Jan 6"},
              {t:"New Arrivals Promo",ty:"social",s:"scheduled",d:"Jan 7"},
              {t:"Holiday Sale Ad",ty:"ads",s:"draft",d:"-"},
              {t:"Product Review Guide",ty:"blog",s:"published",d:"Jan 5"},
              {t:"Flash Sale Email",ty:"email",s:"published",d:"Jan 4"},
              {t:"TikTok Script #1",ty:"social",s:"draft",d:"-"},
            ].map((c,i) => (
              <button key={i} onClick={() => onNavigate("content-editor")} className="p-3 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-500 capitalize">{c.ty}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${c.s==="published"?"bg-green-500/15 text-green-400 border border-green-500/20":c.s==="scheduled"?"bg-blue-500/15 text-blue-400 border border-blue-500/20":"bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"}`}>{c.s}</span>
                </div>
                <p className="text-white text-sm font-medium line-clamp-2">{c.t}</p>
                <p className="text-slate-500 text-[10px] mt-2">{c.d}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentBlog({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="content" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Blog Posts" subtitle="24 posts" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-2">
            {[
              {t:"10 Must-Have Summer Gadgets",v:"1.2K",c:"45",s:"published"},
              {t:"How to Choose Wireless Earbuds",v:"890",c:"23",s:"published"},
              {t:"2026 Tech Trends",v:"draft",c:"-",s:"draft"},
            ].map((p,i) => (
              <button key={i} onClick={() => onNavigate("content-editor")} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors text-left">
                <div>
                  <p className="text-white text-sm font-medium">{p.t}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${p.s==="published"?"bg-green-500/15 text-green-400":"bg-yellow-500/15 text-yellow-400"}`}>{p.s}</span>
                    {p.v !== "draft" && <span className="text-slate-500 text-xs">{p.v} views • {p.c} comments</span>}
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentSocial({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="content" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Social Content" subtitle="48 posts" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-2 gap-3">
            {[
              {p:"Instagram",t:"New arrivals! 🎉",s:"scheduled",d:"Tomorrow 9AM"},
              {p:"TikTok",t:"Product demo video",s:"draft",d:"-"},
              {p:"Facebook",t:"Weekend sale",s:"published",d:"Yesterday"},
            ].map((c,i) => (
              <button key={i} onClick={() => onNavigate("content-editor")} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{c.p==="Instagram"?"📸":c.p==="TikTok"?"🎵":"📘"}</span>
                  <span className="text-white text-xs font-medium">{c.p}</span>
                </div>
                <p className="text-white text-sm">{c.t}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${c.s==="published"?"bg-green-500/15 text-green-400":c.s==="scheduled"?"bg-blue-500/15 text-blue-400":"bg-yellow-500/15 text-yellow-400"}`}>{c.s}</span>
                  <span className="text-slate-500 text-[10px]">{c.d}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentAds({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="content" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Ad Creatives" subtitle="12 creatives" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-3 gap-3">
            {[
              {n:"Summer Sale",s:"active",r:"3.2x"},
              {n:"New Arrivals",s:"active",r:"2.8x"},
              {n:"Flash Sale",s:"paused",r:"1.9x"},
            ].map((c,i) => (
              <button key={i} onClick={() => onNavigate("ads-creative")} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <div className="aspect-video bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-lg mb-2 flex items-center justify-center text-2xl">🎯</div>
                <p className="text-white text-xs font-medium">{c.n}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${c.s==="active"?"bg-green-500/15 text-green-400":"bg-yellow-500/15 text-yellow-400"}`}>{c.s}</span>
                  <span className="text-green-400 text-[10px]">ROAS {c.r}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentCreate({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="content" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Create Content" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
            {[
              {t:"Blog Post",d:"AI-powered blog articles",i:"✍️",a:"content-editor"},
              {t:"Social Post",d:"Instagram, TikTok, Facebook",i:"📱",a:"content-editor"},
              {t:"Ad Creative",d:"Meta and TikTok ads",i:"🎯",a:"ads-creative"},
              {t:"Email",d:"Newsletters and campaigns",i:"📧",a:"content-editor"},
            ].map((o,i) => (
              <button key={i} onClick={() => onNavigate(o.a)} className="p-6 rounded-xl bg-white/5 border border-white/5 text-center hover:border-violet-500/30 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-violet-500/30 transition-colors">
                  <span className="text-2xl">{o.i}</span>
                </div>
                <p className="text-white text-sm font-medium">{o.t}</p>
                <p className="text-slate-400 text-xs mt-1">{o.d}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentEditor({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="content" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Edit Content" 
          actions={
            <>
              <button onClick={() => onNavigate("content-preview")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Preview</button>
              <button onClick={() => onNavigate("content")} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium hover:opacity-90 transition-opacity">Publish</button>
            </>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-3xl mx-auto space-y-4">
            <input type="text" defaultValue="10 Must-Have Summer Gadgets" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-lg font-semibold outline-none focus:border-violet-500/50" />
            <div className="flex gap-2">
              <select className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs">
                <option>Blog Post</option>
                <option>Social</option>
              </select>
              <select className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs">
                <option>Electronics</option>
              </select>
            </div>
            <textarea defaultValue="Summer is here, and it's time to upgrade your tech game..." rows={12} className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm leading-relaxed outline-none focus:border-violet-500/50 resize-none" />
            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/30">
              <p className="text-violet-300 text-xs">🤖 AI Suggestions available. Click to generate more content.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentPreview({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="content" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Preview" actions={<button onClick={() => onNavigate("content-editor")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10">← Back to Editor</button>} />
        <div className="flex-1 p-4 overflow-auto bg-white">
          <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">10 Must-Have Summer Gadgets</h1>
            <p className="text-gray-600 leading-relaxed">Summer is here, and it's time to upgrade your tech game. We've curated the best gadgets to keep you cool, connected, and productive all season long.</p>
            <div className="h-48 bg-gray-100 rounded-xl my-6 flex items-center justify-center text-4xl">📸</div>
            <p className="text-gray-600 leading-relaxed">From portable chargers to waterproof speakers, these devices will enhance your summer experience...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdsScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ads" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Campaigns" 
          subtitle="8 campaigns"
          actions={
            <button onClick={() => onNavigate("ads-create")} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium hover:opacity-90 transition-opacity">+ New Campaign</button>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="flex gap-2 mb-4">
            {["All","Active","Paused","Draft"].map((f,i) => (
              <button key={f} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i===0?"bg-violet-500/20 text-violet-300 border border-violet-500/30":"bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10"}`}>{f}</button>
            ))}
          </div>
          <div className="space-y-3">
            {[
              {n:"Summer Sale 2026",pl:"Meta",b:50,sp:1240,r:3.2,s:"active",p:65},
              {n:"Product Launch",pl:"TikTok",b:30,sp:890,r:2.8,s:"active",p:45},
              {n:"Holiday Special",pl:"Meta",b:0,sp:4500,r:4.1,s:"paused",p:100},
            ].map(c => (
              <button key={c.n} onClick={() => onNavigate("ads-detail")} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors text-left">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white text-sm font-semibold">{c.n}</h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${c.s==="active"?"bg-green-500/15 text-green-400 border border-green-500/20":"bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"}`}>{c.s}</span>
                    </div>
                    <p className="text-slate-500 text-xs">{c.pl}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-bold">${c.sp.toLocaleString()}</p>
                    <p className="text-green-400 text-xs">ROAS {c.r}x</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-xs mb-3">
                  <div><span className="text-slate-500">Budget:</span> <span className="text-white">${c.b}/day</span></div>
                  <div><span className="text-slate-500">Impressions:</span> <span className="text-white">{c.sp * 12}</span></div>
                  <div><span className="text-slate-500">Clicks:</span> <span className="text-white">{c.sp * 2}</span></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full"><div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" style={{width:`${c.p}%`}}/></div>
                  <span className="text-slate-500 text-[10px]">{c.p}% of budget</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdsCreate({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ads" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Create Campaign" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
              <div className={`w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center`}>1</div>
              <div className="flex-1 h-px bg-white/10" />
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">2</div>
              <div className="flex-1 h-px bg-white/10" />
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500">3</div>
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Campaign Name</label>
              <input type="text" placeholder="Summer Sale 2026" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Platform</label>
              <div className="grid grid-cols-2 gap-2">
                {["Meta (Facebook/Instagram)","TikTok"].map(p => (
                  <button key={p} className="p-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs text-left hover:border-violet-500/30 transition-colors">{p}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Daily Budget</label>
              <div className="flex items-center gap-2">
                <span className="text-white text-lg">$</span>
                <input type="number" defaultValue={50} className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("ads")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("ads-audience")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdsDetail({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ads" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Summer Sale 2026" 
          subtitle="Meta Campaign"
          actions={
            <>
              <button onClick={() => onNavigate("ads-edit")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Edit</button>
              <button className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 text-xs border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors">Pause</button>
            </>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[{l:"Spend",v:"$1,240"}, {l:"ROAS",v:"3.2x"}, {l:"Impressions",v:"14.8K"}, {l:"Clicks",v:"2,480"}].map((s,i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-slate-500 text-[10px] uppercase">{s.l}</p>
                <p className="text-white text-lg font-bold">{s.v}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-sm font-medium mb-3">Performance</p>
              <div className="h-24 flex items-end gap-1">
                {[40,65,50,80,70,90,85].map((h,i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-violet-500 to-pink-500 rounded-t" style={{height:`${h}%`}} />
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-sm font-medium mb-3">Audience</p>
              <div className="space-y-2">
                {[{l:"Age 18-34",v:"65%"}, {l:"Age 35-54",v:"30%"}, {l:"Age 55+",v:"5%"}].map(a => (
                  <div key={a.l} className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs w-20">{a.l}</span>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full"><div className="h-full bg-violet-500 rounded-full" style={{width:a.v}}/></div>
                    <span className="text-white text-xs w-8 text-right">{a.v}</span>
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

function AdsEdit({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ads" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Edit Campaign" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="text-slate-400 text-xs block mb-2">Campaign Name</label>
              <input type="text" defaultValue="Summer Sale 2026" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Daily Budget</label>
              <input type="number" defaultValue={50} className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("ads-detail")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("ads-detail")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdsAudience({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ads" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Audience Builder" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="text-slate-400 text-xs block mb-2">Age Range</label>
              <div className="flex items-center gap-2">
                <select className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
                  <option>18</option>
                </select>
                <span className="text-slate-400">to</span>
                <select className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
                  <option>65+</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Locations</label>
              <input type="text" placeholder="United States, Canada..." className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Interests</label>
              <div className="flex flex-wrap gap-2">
                {["Technology","Gadgets","Shopping","Mobile"].map(i => (
                  <span key={i} className="px-2 py-1 rounded-lg bg-violet-500/20 text-violet-300 text-xs border border-violet-500/30">{i} ✕</span>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("ads-create")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Back</button>
              <button onClick={() => onNavigate("ads-creative")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdsCreative({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ads" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Creative Studio" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-sm font-medium mb-3">Ad Preview</p>
              <div className="aspect-video bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-xl flex items-center justify-center text-4xl">🎯</div>
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Headline</label>
              <input type="text" defaultValue="Summer Sale - Up to 50% Off!" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Description</label>
              <textarea rows={3} defaultValue="Discover amazing deals on the latest gadgets. Limited time only!" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50 resize-none" />
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("ads-audience")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Back</button>
              <button onClick={() => onNavigate("ads")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Launch Campaign</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdsAnalytics({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ads" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Ad Analytics" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-slate-500 text-xs">Total Spend</p>
              <p className="text-white text-2xl font-bold">$5,230</p>
              <span className="text-green-400 text-xs">+12% vs last month</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-slate-500 text-xs">Avg ROAS</p>
              <p className="text-white text-2xl font-bold">3.4x</p>
              <span className="text-green-400 text-xs">+0.5 vs last month</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-slate-500 text-xs">Conversions</p>
              <p className="text-white text-2xl font-bold">234</p>
              <span className="text-green-400 text-xs">+8% vs last month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="analytics" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Analytics Overview" 
          actions={
            <button onClick={() => onNavigate("analytics-export")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Export</button>
          }
        />
        <div className="flex-1 p-4 overflow-auto space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {[{l:"Revenue",v:"$12.5K",c:"+18.5%"}, {l:"Orders",v:"326",c:"+12.4%"}, {l:"ROAS",v:"3.8x",c:"+22.7%"}, {l:"Conv. Rate",v:"4.2%",c:"+0.8%"}].map((s,i) => (
              <button key={i} onClick={() => i===0?onNavigate("analytics-sales"):i===1?onNavigate("analytics-products"):onNavigate("analytics-traffic")} className="p-4 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-all">
                <p className="text-slate-500 text-[10px] uppercase">{s.l}</p>
                <p className="text-white text-xl font-bold">{s.v}</p>
                <span className="text-green-400 text-xs">{s.c}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-white text-sm font-medium">Revenue Trend</p>
                <select className="bg-white/5 border border-white/10 rounded-lg text-xs text-slate-400 px-2 py-1">
                  <option>Last 30 days</option>
                </select>
              </div>
              <div className="h-32 flex items-end gap-1">
                {[45,62,48,85,70,92,78,88,95,82,90,100].map((h,i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-violet-500/80 to-pink-500/80 rounded-t" style={{height:`${h}%`}} />
                ))}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-sm font-medium mb-3">Traffic Sources</p>
              <div className="space-y-2">
                {[{s:"Organic Search",p:45}, {s:"Meta Ads",p:30}, {s:"Direct",p:15}, {s:"TikTok",p:10}].map(item => (
                  <div key={item.s} className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs w-24">{item.s}</span>
                    <div className="flex-1 h-2 bg-white/10 rounded-full"><div className="h-full bg-violet-500 rounded-full" style={{width:`${item.p}%`}}/></div>
                    <span className="text-white text-xs w-8 text-right">{item.p}%</span>
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

function AnalyticsSales({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="analytics" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Sales Reports" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <p className="text-white text-sm font-medium mb-3">Monthly Sales</p>
            <div className="space-y-2">
              {["January","December","November"].map((m,i) => (
                <div key={m} className="flex items-center justify-between p-3 rounded-lg bg-[#0d0d12]">
                  <span className="text-white text-sm">{m} 2026</span>
                  <span className="text-white font-medium">${[12500,11800,10200][i].toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTraffic({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="analytics" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Traffic Analysis" />
        <div className="flex-1 p-4 overflow-auto">
          <p className="text-slate-400 text-sm">Traffic analysis content...</p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsProducts({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="analytics" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Product Performance" />
        <div className="flex-1 p-4 overflow-auto">
          <p className="text-slate-400 text-sm">Product performance content...</p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCustom({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="analytics" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Custom Reports" />
        <div className="flex-1 p-4 overflow-auto">
          <p className="text-slate-400 text-sm">Custom reports builder...</p>
        </div>
      </div>
    </div>
  );
}

function AnalyticsExport({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="analytics" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Export Data" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-md mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-sm font-medium mb-3">Export Format</p>
              <div className="space-y-2">
                {["CSV","Excel","PDF"].map(f => (
                  <label key={f} className="flex items-center gap-3 p-3 rounded-lg bg-[#0d0d12] cursor-pointer">
                    <input type="radio" name="format" className="rounded-full bg-white/5 border-white/10" />
                    <span className="text-white text-xs">{f}</span>
                  </label>
                ))}
              </div>
            </div>
            <button onClick={() => onNavigate("analytics")} className="w-full p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold">Download Export</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIAgentScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [messages] = useState([
    {role:"ai",text:"Hi! I'm your AI store assistant. What would you like me to help with today?"},
    {role:"user",text:"Import trending products from AutoDS"},
    {role:"ai",text:"I'll import trending products for you. This will take a few minutes. I'll notify you when it's done!"},
  ]);
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ai-agent" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="AI Agent" 
          subtitle="Online"
          actions={
            <>
              <button onClick={() => onNavigate("ai-history")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">History</button>
              <button onClick={() => onNavigate("ai-tasks")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Tasks</button>
            </>
          }
        />
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((m,i) => (
            <div key={i} className={`flex gap-3 ${m.role==="user"?"justify-end": ""}`}>
              {m.role==="ai" && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex-shrink-0" />}
              <div className={`max-w-[70%] p-3 rounded-xl ${m.role==="user"?"bg-violet-500/20 border border-violet-500/30":"bg-white/5 border border-white/5"}`}>
                <p className="text-white text-sm">{m.text}</p>
              </div>
              {m.role==="user" && <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />}
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            {["Import products","Write blog post","Create ad campaign","Sync inventory","Analyze performance"].map(s => (
              <button key={s} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs hover:bg-white/10 transition-colors">{s}</button>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Ask me anything..." className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            <button className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AIHistory({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ai-agent" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Chat History" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-2">
            {["Today","Yesterday","Jan 4"].map((d,i) => (
              <div key={d}>
                <p className="text-slate-500 text-xs mb-2">{d}</p>
                <button onClick={() => onNavigate("ai-agent")} className="w-full p-3 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-colors">
                  <p className="text-white text-sm">Import products and create ads</p>
                  <p className="text-slate-500 text-xs">12 messages</p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AITasks({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ai-agent" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="AI Tasks" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-2">
            {[
              {t:"Import products from AutoDS",s:"in_progress",p:65},
              {t:"Generate blog content",s:"completed",p:100},
              {t:"Optimize ad targeting",s:"pending",p:0},
            ].map(task => (
              <div key={task.t} className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">{task.t}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${task.s==="completed"?"bg-green-500/15 text-green-400":task.s==="in_progress"?"bg-yellow-500/15 text-yellow-400":"bg-slate-500/15 text-slate-400"}`}>{task.s}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full"><div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" style={{width:`${task.p}%`}}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AITemplates({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="ai-agent" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Prompt Templates" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-2 gap-3">
            {["Product Import","Blog Writing","Ad Creation","Analytics Report"].map(t => (
              <button key={t} onClick={() => onNavigate("ai-agent")} className="p-4 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-colors">
                <p className="text-white text-sm font-medium">{t}</p>
                <p className="text-slate-500 text-xs mt-1">Quick template</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="automation" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Automation Rules" 
          subtitle="8 active rules"
          actions={
            <>
              <button onClick={() => onNavigate("workflows")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Workflows</button>
              <button onClick={() => onNavigate("automation-create")} className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium hover:opacity-90 transition-opacity">+ New Rule</button>
            </>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-3">
            {[
              {n:"Auto Product Import",t:"Daily at 9AM",s:"active",tr:"Schedule",a:"Import"},
              {n:"Price Sync",t:"Every 2 hours",s:"active",tr:"Schedule",a:"Update"},
              {n:"Ad Optimization",t:"When ROAS {'<'} 2.0",s:"active",tr:"Condition",a:"Optimize"},
              {n:"Low Stock Alert",t:"When stock {'<'} 10",s:"paused",tr:"Condition",a:"Notify"},
            ].map(rule => (
              <button key={rule.n} onClick={() => onNavigate("automation-edit")} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors text-left">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                      <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{rule.n}</p>
                      <p className="text-slate-500 text-xs">{rule.t}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${rule.s==="active"?"bg-green-500/15 text-green-400 border border-green-500/20":"bg-yellow-500/15 text-yellow-400 border border-yellow-500/20"}`}>{rule.s}</span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 rounded bg-white/5 text-white text-[10px]">Trigger: {rule.tr}</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-white text-[10px]">Action: {rule.a}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationCreate({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="automation" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Create Automation Rule" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="text-slate-400 text-xs block mb-2">Rule Name</label>
              <input type="text" placeholder="My Automation" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">When (Trigger)</label>
              <select className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50">
                <option>Product stock is low</option>
                <option>New order received</option>
                <option>Daily at specific time</option>
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Then (Action)</label>
              <select className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50">
                <option>Send notification</option>
                <option>Import products</option>
                <option>Update pricing</option>
              </select>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("automation")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("automation")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Create Rule</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationEdit({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="automation" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Edit Rule" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div>
              <label className="text-slate-400 text-xs block mb-2">Rule Name</label>
              <input type="text" defaultValue="Auto Product Import" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("automation")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("automation")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AutomationLogs({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="automation" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Execution Logs" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-2">
            {[
              {r:"Auto Product Import",s:"success",t:"2m ago"},
              {r:"Price Sync",s:"success",t:"1h ago"},
              {r:"Ad Optimization",s:"failed",t:"2h ago"},
            ].map((l,i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">{l.r}</p>
                  <p className="text-slate-500 text-xs">{l.t}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${l.s==="success"?"bg-green-500/15 text-green-400":"bg-red-500/15 text-red-400"}`}>{l.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowsScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="automation" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Workflows" />
        <div className="flex-1 p-4 overflow-auto">
          <p className="text-slate-400 text-sm">Workflow builder coming soon...</p>
        </div>
      </div>
    </div>
  );
}

function IntegrationsScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="integrations" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Connected Apps" 
          subtitle="6 integrations"
          actions={
            <button onClick={() => onNavigate("api-keys")} className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">API Keys</button>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-3">
            {[
              {n:"Shopify",s:"connected",d:"Your e-commerce platform",i:"🛍️",a:"integration-shopify"},
              {n:"AutoDS",s:"connected",d:"Dropshipping automation",i:"📦",a:"integration-autods"},
              {n:"Meta Ads",s:"disconnected",d:"Facebook & Instagram ads",i:"📢",a:"integration-meta"},
              {n:"TikTok Ads",s:"disconnected",d:"TikTok advertising",i:"🎵",a:"integration-tiktok"},
            ].map(int => (
              <button key={int.n} onClick={() => onNavigate(int.a)} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-xl">{int.i}</div>
                  <div>
                    <p className="text-white text-sm font-medium">{int.n}</p>
                    <p className="text-slate-500 text-xs">{int.d}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${int.s==="connected"?"bg-green-500/15 text-green-400 border border-green-500/20":"bg-slate-500/15 text-slate-400 border border-slate-500/20"}`}>{int.s}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationShopify({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="integrations" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Shopify Settings" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">🛍️</div>
                <div>
                  <p className="text-white text-sm font-medium">Shopify</p>
                  <p className="text-green-400 text-xs">Connected</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-slate-400 text-xs block mb-1">Store URL</label>
                  <input type="text" defaultValue="my-store.myshopify.com" className="w-full p-2.5 rounded-lg bg-[#0d0d12] border border-white/10 text-white text-sm" />
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">API Key</label>
                  <input type="password" defaultValue="shpat_xxxxxxxx" className="w-full p-2.5 rounded-lg bg-[#0d0d12] border border-white/10 text-white text-sm" />
                </div>
              </div>
            </div>
            <button onClick={() => onNavigate("integrations")} className="w-full p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold">Save Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationAutoDS({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="integrations" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="AutoDS Settings" />
        <div className="flex-1 p-4 overflow-auto">
          <p className="text-slate-400 text-sm">AutoDS integration settings...</p>
        </div>
      </div>
    </div>
  );
}

function IntegrationMeta({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="integrations" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Meta Settings" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto text-center py-8">
            <div className="w-16 h-16 rounded-full bg-slate-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📢</span>
            </div>
            <h3 className="text-white text-lg font-bold mb-2">Connect Meta Ads</h3>
            <p className="text-slate-400 text-sm mb-4">Link your Facebook and Instagram ad accounts</p>
            <button onClick={() => onNavigate("integrations")} className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-400 text-sm border border-blue-500/30 hover:bg-blue-500/30 transition-colors">Connect Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationTikTok({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="integrations" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="TikTok Settings" />
        <div className="flex-1 p-4 overflow-auto">
          <p className="text-slate-400 text-sm">TikTok integration settings...</p>
        </div>
      </div>
    </div>
  );
}

function APIKeysScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="integrations" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="API Keys" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-3">
            {["Production","Development","Testing"].map(k => (
              <div key={k} className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">{k} Key</span>
                  <button className="text-violet-400 text-xs">Regenerate</button>
                </div>
                <code className="text-slate-500 text-xs">shppa_xxxxxxxxxxxxxxxx</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WebhooksScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="integrations" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Webhooks" />
        <div className="flex-1 p-4 overflow-auto">
          <p className="text-slate-400 text-sm">Webhook configuration...</p>
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Settings" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-2">
            {[
              {i:"👤",l:"Profile",d:"Personal information",a:"settings-profile"},
              {i:"👥",l:"Team Members",d:"Manage your team",a:"settings-team"},
              {i:"💳",l:"Billing",d:"Subscriptions and payments",a:"settings-billing"},
              {i:"🔔",l:"Notifications",d:"Email and push preferences",a:"settings-notifications"},
              {i:"🔒",l:"Security",d:"Password and 2FA",a:"settings-security"},
            ].map(item => (
              <button key={item.l} onClick={() => onNavigate(item.a)} className="w-full p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.i}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{item.l}</p>
                    <p className="text-slate-500 text-xs">{item.d}</p>
                  </div>
                </div>
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsProfile({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Profile" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">JS</div>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 text-white text-xs border border-white/10 hover:bg-white/10 transition-colors">Change Avatar</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-xs block mb-2">First Name</label>
                <input type="text" defaultValue="John" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-2">Last Name</label>
                <input type="text" defaultValue="Smith" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Email</label>
              <input type="email" defaultValue="john@example.com" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            </div>
            <div>
              <label className="text-slate-400 text-xs block mb-2">Phone</label>
              <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-violet-500/50" />
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => onNavigate("settings")} className="flex-1 p-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors">Cancel</button>
              <button onClick={() => onNavigate("settings")} className="flex-1 p-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity">Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTeam({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header 
          title="Team Members" 
          subtitle="3 members"
          actions={
            <button className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-medium">+ Invite</button>
          }
        />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-2">
            {[
              {n:"John Smith",e:"john@example.com",r:"Owner"},
              {n:"Sarah Johnson",e:"sarah@example.com",r:"Admin"},
              {n:"Mike Chen",e:"mike@example.com",r:"Editor"},
            ].map(m => (
              <div key={m.n} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs">{m.n.split(" ").map(n=>n[0]).join("")}</div>
                  <div>
                    <p className="text-white text-sm font-medium">{m.n}</p>
                    <p className="text-slate-500 text-xs">{m.e}</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/10">{m.r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsBilling({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Billing" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500/15 to-pink-500/10 border border-violet-500/20">
              <p className="text-violet-300 text-xs mb-1">Current Plan</p>
              <p className="text-white text-lg font-bold">Pro Plan</p>
              <p className="text-slate-400 text-xs">$99/month • Renews Jan 15, 2026</p>
              <button onClick={() => onNavigate("settings-plan")} className="mt-3 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20 transition-colors">Change Plan</button>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-sm font-medium mb-3">Payment Method</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <div className="flex-1">
                  <p className="text-white text-sm">Visa ending in 4242</p>
                  <p className="text-slate-500 text-xs">Expires 12/27</p>
                </div>
                <button className="text-violet-400 text-xs">Update</button>
              </div>
            </div>
            <button onClick={() => onNavigate("settings-billing-history")} className="w-full p-3 rounded-xl bg-white/5 border border-white/5 text-left flex items-center justify-between hover:border-white/10 transition-colors">
              <span className="text-white text-sm">Billing History</span>
              <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsNotifications({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Notifications" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            {[
              {l:"Order notifications",d:"Get notified when you receive orders",e:true},
              {l:"Low stock alerts",d:"Alert when product inventory is low",e:true},
              {l:"AI task completions",d:"Get notified when AI tasks finish",e:true},
              {l:"Weekly reports",d:"Receive weekly performance summaries",e:false},
              {l:"Marketing emails",d:"Product updates and tips",e:false},
            ].map((n,i) => (
              <div key={n.l} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-white text-sm font-medium">{n.l}</p>
                  <p className="text-slate-500 text-xs">{n.d}</p>
                </div>
                <div className={`w-10 h-5 rounded-full ${n.e?"bg-violet-500":"bg-white/10"} relative cursor-pointer`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${n.e?"right-0.5":"left-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsSecurity({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Security" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-white text-sm font-medium mb-3">Change Password</p>
              <div className="space-y-3">
                <input type="password" placeholder="Current password" className="w-full p-3 rounded-xl bg-[#0d0d12] border border-white/10 text-white text-sm" />
                <input type="password" placeholder="New password" className="w-full p-3 rounded-xl bg-[#0d0d12] border border-white/10 text-white text-sm" />
                <input type="password" placeholder="Confirm new password" className="w-full p-3 rounded-xl bg-[#0d0d12] border border-white/10 text-white text-sm" />
              </div>
              <button className="mt-3 w-full p-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-medium">Update Password</button>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Two-Factor Authentication</p>
                  <p className="text-slate-500 text-xs">Add extra security to your account</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs border border-green-500/30">Enabled</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsBillingHistory({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Billing History" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-2">
            {[
              {d:"Jan 1, 2026",a:"$99.00",s:"Paid"},
              {d:"Dec 1, 2025",a:"$99.00",s:"Paid"},
              {d:"Nov 1, 2025",a:"$99.00",s:"Paid"},
            ].map((inv,i) => (
              <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm">Pro Plan</p>
                  <p className="text-slate-500 text-xs">{inv.d}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-medium">{inv.a}</p>
                  <span className="text-green-400 text-xs">{inv.s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPlan({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <div className="h-full flex bg-[#08080c]">
      <Sidebar activeId="settings" onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col min-h-0">
        <Header title="Plan & Usage" />
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-3 gap-4">
            {[
              {n:"Starter",p:"$29/mo",f:["1 store","100 products","Basic AI"]},
              {n:"Pro",p:"$99/mo",f:["5 stores","Unlimited products","Advanced AI"],c:true},
              {n:"Enterprise",p:"$299/mo",f:["Unlimited stores","Unlimited products","Custom AI"]},
            ].map(plan => (
              <div key={plan.n} className={`p-4 rounded-xl border ${plan.c?"bg-violet-500/10 border-violet-500/30":"bg-white/5 border-white/5"}`}>
                <p className="text-white text-sm font-bold">{plan.n}</p>
                <p className="text-violet-400 text-lg font-bold">{plan.p}</p>
                <ul className="mt-3 space-y-1">
                  {plan.f.map(f => (
                    <li key={f} className="text-slate-400 text-xs flex items-center gap-1">✓ {f}</li>
                  ))}
                </ul>
                {plan.c ? (
                  <span className="mt-3 block text-center text-green-400 text-xs">Current Plan</span>
                ) : (
                  <button className="mt-3 w-full py-2 rounded-lg bg-white/5 text-white text-xs hover:bg-white/10 transition-colors">Upgrade</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
