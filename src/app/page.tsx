import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">ShoppDropp Blueprint</h1>
          <p className="text-slate-400">Autonomous eCommerce Operating System - Technical Specification</p>
        </div>
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-1.5">
          Production Ready
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="System Modules" value="14" subtitle="Core Components" color="purple" />
        <StatCard title="API Endpoints" value="200+" subtitle="REST Endpoints" color="blue" />
        <StatCard title="Database Tables" value="25+" subtitle="Supabase Schema" color="pink" />
        <StatCard title="Job Types" value="30+" subtitle="Worker Pipeline" color="orange" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Architecture Overview */}
        <Card className="lg:col-span-2 bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              System Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ArchitectureFlow />
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-slate-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Tech Stack</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      <Card className="bg-slate-900/50 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">System Integration Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-4 p-6">
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
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    pink: "from-pink-500/20 to-pink-600/10 border-pink-500/30",
    orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
  };

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color]} border`}>
      <CardContent className="p-6">
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function ArchitectureFlow() {
  const layers = [
    { name: "Dashboard (Next.js 15)", desc: "User Interface Layer", color: "purple" },
    { name: "API (NestJS)", desc: "Business Logic Layer", color: "blue" },
    { name: "Supabase + Redis", desc: "Data & Queue Layer", color: "pink" },
    { name: "Orchestrator", desc: "Infrastructure Layer", color: "orange" },
    { name: "Worker (Docker)", desc: "Execution Layer", color: "green" },
    { name: "External APIs", desc: "Shopify, Meta, AutoDS", color: "red" },
  ];

  return (
    <div className="space-y-3">
      {layers.map((layer, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className={`w-3 h-3 rounded-full bg-${layer.color}-500`} />
          <div className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">{layer.name}</span>
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
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
      <span className="text-white font-medium">{name}</span>
      <span className="text-xs text-slate-400">{category}</span>
    </div>
  );
}

function FeatureCard({ title, description, icon, status }: { title: string; description: string; icon: string; status: string }) {
  return (
    <Card className="bg-slate-900/50 border-white/10 card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="text-3xl">{icon}</span>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{status}</Badge>
        </div>
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </CardContent>
    </Card>
  );
}

function IntegrationNode({ name, type }: { name: string; type: string }) {
  const colors: Record<string, string> = {
    start: "bg-green-500/20 border-green-500/50 text-green-400",
    app: "bg-purple-500/20 border-purple-500/50 text-purple-400",
    service: "bg-blue-500/20 border-blue-500/50 text-blue-400",
    database: "bg-pink-500/20 border-pink-500/50 text-pink-400",
    worker: "bg-orange-500/20 border-orange-500/50 text-orange-400",
    external: "bg-red-500/20 border-red-500/50 text-red-400",
  };

  return (
    <div className={`px-4 py-2 rounded-lg border ${colors[type]} text-sm font-medium`}>
      {name}
    </div>
  );
}

function Arrow() {
  return (
    <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  );
}
