import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppDroppLogo, ShoppDroppText } from "@/components/logo";

export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <ShoppDroppLogo className="w-12 h-12" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">System Blueprint</h1>
            <p className="text-slate-400 text-sm md:text-base">Autonomous eCommerce Operating System</p>
          </div>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-1.5 w-fit">
          Production Ready
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="System Modules" value="15" subtitle="Core Components" color="violet" />
        <StatCard title="API Endpoints" value="200+" subtitle="REST Endpoints" color="blue" />
        <StatCard title="Database Tables" value="25+" subtitle="Supabase Schema" color="pink" />
        <StatCard title="Job Types" value="30+" subtitle="Worker Pipeline" color="orange" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Architecture Overview */}
        <Card className="lg:col-span-2 bg-[#111118] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500" />
              System Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ArchitectureFlow />
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-[#111118] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Tech Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3">
            <TechBadge name="Next.js 15" category="Frontend" />
            <TechBadge name="NestJS" category="Backend" />
            <TechBadge name="Supabase" category="Database" />
            <TechBadge name="Redis" category="Queue" />
            <TechBadge name="Docker" category="Infra" />
            <TechBadge name="Stripe" category="Billing" />
          </CardContent>
        </Card>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <FeatureCard
          title="Project System"
          description="Complete project lifecycle management with wizard-based onboarding"
          icon="🚀"
          status="Complete"
        />
        <FeatureCard
          title="Worker Execution"
          description="Stateless job execution engine with retry and recovery mechanisms"
          icon="⚙️"
          status="Complete"
        />
        <FeatureCard
          title="Orchestrator"
          description="VPS provisioning, Docker deployment, and worker lifecycle management"
          icon="🖥️"
          status="Complete"
        />
        <FeatureCard
          title="Store Builder"
          description="Autonomous Shopify store creation with AI-powered content generation"
          icon="🛍️"
          status="Complete"
        />
        <FeatureCard
          title="Meta Ads"
          description="Campaign creation, deployment, and optimization via Meta Marketing API"
          icon="📢"
          status="Complete"
        />
        <FeatureCard
          title="AutoDS"
          description="Product sourcing, inventory sync, and dropshipping automation"
          icon="📦"
          status="Complete"
        />
      </div>

      {/* System Status */}
      <Card className="bg-[#111118] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">System Integration Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 p-4 md:p-6">
            <IntegrationNode name="User" type="start" />
            <Arrow />
            <IntegrationNode name="Dashboard" type="app" />
            <Arrow />
            <IntegrationNode name="API" type="service" />
            <Arrow />
            <IntegrationNode name="Supabase" type="database" />
            <Arrow />
            <IntegrationNode name="Orchestrator" type="service" />
            <Arrow />
            <IntegrationNode name="Worker" type="worker" />
            <Arrow />
            <IntegrationNode name="Shopify" type="external" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, subtitle, color }: { title: string; value: string; subtitle: string; color: string }) {
  const colorClasses: Record<string, string> = {
    violet: "from-violet-500/20 to-violet-600/10 border-violet-500/30",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    pink: "from-pink-500/20 to-pink-600/10 border-pink-500/30",
    orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  };

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color]} border`}>
      <CardContent className="p-4 md:p-6">
        <p className="text-slate-400 text-xs md:text-sm">{title}</p>
        <p className="text-2xl md:text-3xl font-bold text-white mt-1">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function ArchitectureFlow() {
  const layers = [
    { name: "Dashboard (Next.js 15)", desc: "User Interface Layer", color: "violet" },
    { name: "API (NestJS)", desc: "Business Logic Layer", color: "blue" },
    { name: "Supabase + Redis", desc: "Data & Queue Layer", color: "pink" },
    { name: "Orchestrator", desc: "Infrastructure Layer", color: "orange" },
    { name: "Worker (Docker)", desc: "Execution Layer", color: "green" },
    { name: "External APIs", desc: "Shopify, Meta, AutoDS", color: "red" },
  ];

  return (
    <div className="space-y-2 md:space-y-3">
      {layers.map((layer, i) => (
        <div key={i} className="flex items-center gap-3 md:gap-4">
          <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-${layer.color}-500 flex-shrink-0`} />
          <div className="flex-1 p-2.5 md:p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="text-white font-medium text-sm">{layer.name}</span>
              <span className="text-xs text-slate-400">{layer.desc}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TechBadge({ name, category }: { name: string; category: string }) {
  return (
    <div className="flex items-center justify-between p-2.5 md:p-3 rounded-lg bg-white/5">
      <span className="text-white font-medium text-sm">{name}</span>
      <span className="text-xs text-slate-400">{category}</span>
    </div>
  );
}

function FeatureCard({ title, description, icon, status }: { title: string; description: string; icon: string; status: string }) {
  return (
    <Card className="bg-[#111118] border-white/10 card-hover">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <span className="text-2xl md:text-3xl">{icon}</span>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">{status}</Badge>
        </div>
        <h3 className="text-white font-semibold mb-1.5 md:mb-2 text-sm md:text-base">{title}</h3>
        <p className="text-xs md:text-sm text-slate-400">{description}</p>
      </CardContent>
    </Card>
  );
}

function IntegrationNode({ name, type }: { name: string; type: string }) {
  const colors: Record<string, string> = {
    start: "bg-green-500/20 border-green-500/50 text-green-400",
    app: "bg-violet-500/20 border-violet-500/50 text-violet-400",
    service: "bg-blue-500/20 border-blue-500/50 text-blue-400",
    database: "bg-pink-500/20 border-pink-500/50 text-pink-400",
    worker: "bg-orange-500/20 border-orange-500/50 text-orange-400",
    external: "bg-red-500/20 border-red-500/50 text-red-400",
  };

  return (
    <div className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg border ${colors[type]} text-xs md:text-sm font-medium`}>
      {name}
    </div>
  );
}

function Arrow() {
  return (
    <svg className="w-4 h-4 md:w-6 md:h-6 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}
