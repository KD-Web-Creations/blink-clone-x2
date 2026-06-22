'use client';

import { usePageStore } from '@/lib/page-context';
import { Button } from '@/components/ui/button';
import {
  Rocket,
  Server,
  Shield,
  Zap,
  ArrowRight,
  Check,
  X,
  Clock,
  RefreshCw,
  Globe,
  Database,
  Lock,
  BarChart3,
  Bot,
  Cloud,
  Code2,
  Layers,
  MessageSquare,
} from 'lucide-react';

const clawPlans = [
  {
    name: 'Starter',
    price: '$45',
    period: '/month',
    description: 'For individuals and small projects getting started with AI agents.',
    features: [
      '2 AI agents',
      '5GB storage',
      '10k API calls/month',
      'Community support',
      'Basic monitoring',
      '1 custom domain',
    ],
    cta: 'Start with Starter',
    highlighted: false,
  },
  {
    name: 'Standard',
    price: '$90',
    period: '/month',
    description: 'For growing teams that need more power and reliability.',
    features: [
      '5 AI agents',
      '25GB storage',
      '100k API calls/month',
      'Priority support',
      'Advanced monitoring',
      '5 custom domains',
      'Team collaboration',
      'Auto-scaling',
    ],
    cta: 'Go Standard',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '$180',
    period: '/month',
    description: 'For production workloads that demand maximum performance.',
    features: [
      'Unlimited AI agents',
      '100GB storage',
      '1M API calls/month',
      '24/7 dedicated support',
      'Enterprise monitoring',
      'Unlimited domains',
      'SSO / SAML',
      'SLA guarantee',
      'Custom integrations',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
];

const comparisonFeatures = [
  { feature: 'Setup time', selfHosted: '4-8 hours', claw: '60 seconds' },
  { feature: 'SSL certificates', selfHosted: 'Manual config', claw: 'Automatic' },
  { feature: 'Auto-scaling', selfHosted: 'Manual setup', claw: 'Built-in' },
  { feature: 'Monitoring', selfHosted: 'Self-managed', claw: '24/7 included' },
  { feature: 'Updates', selfHosted: 'Manual updates', claw: 'Automatic' },
  { feature: 'Security patches', selfHosted: 'You handle it', claw: 'Managed for you' },
  { feature: 'Backups', selfHosted: 'Configure yourself', claw: 'Automatic daily' },
  { feature: 'Support', selfHosted: 'Community only', claw: 'Priority support' },
];

const integrations = [
  { name: 'Slack', icon: MessageSquare },
  { name: 'GitHub', icon: Code2 },
  { name: 'PostgreSQL', icon: Database },
  { name: 'Stripe', icon: BarChart3 },
  { name: 'Auth0', icon: Lock },
  { name: 'AWS', icon: Cloud },
  { name: 'Vercel', icon: Globe },
  { name: 'Docker', icon: Layers },
];

export function Claw() {
  const { navigate } = usePageStore();

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-[#216BE4]/10 text-[#216BE4] mb-6">
            <Rocket className="w-4 h-4" />
            CreAIlity Agents — Managed AI Agent Hosting
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Deploy AI Agents in{' '}
            <span
              className="bg-gradient-to-br from-[#216BE4] to-[#6366f1] bg-clip-text"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              60 Seconds
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Managed OpenClaw hosting that handles infrastructure, scaling, and security so you can focus on building amazing AI-powered applications.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              onClick={() => navigate('builder')}
              className="bg-[#216BE4] hover:bg-[#1B5BC7] text-white font-semibold px-7 py-3 rounded-lg text-base"
            >
              Deploy Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="font-semibold px-7 py-3 rounded-lg text-base border-border bg-secondary hover:bg-border"
            >
              View Documentation
            </Button>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                icon: Code2,
                title: 'Write Your Agent',
                description: 'Define your AI agent using OpenClaw\'s simple configuration. Specify triggers, actions, and integrations.',
              },
              {
                step: '2',
                icon: Rocket,
                title: 'Deploy to Claw',
                description: 'Push your agent to CreAIlity Agents with a single command. We handle the rest — servers, scaling, and security.',
              },
              {
                step: '3',
                icon: Zap,
                title: 'It Runs 24/7',
                description: 'Your agent is live and working around the clock. Monitor performance, view logs, and iterate as needed.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-card border border-border rounded-xl p-6 text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#216BE4] text-white text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#216BE4]/10 flex items-center justify-center text-[#216BE4] mx-auto mb-4 mt-2">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-10">
            Self-Hosting vs CreAIlity Agents
          </h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 gap-px bg-border">
              <div className="bg-card p-4 font-semibold text-sm">Feature</div>
              <div className="bg-card p-4 font-semibold text-sm text-center flex items-center justify-center gap-2">
                <Server className="w-4 h-4 text-muted-foreground" />
                Self-Hosted
              </div>
              <div className="bg-card p-4 font-semibold text-sm text-center flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-[#216BE4]" />
                CreAIlity Agents
              </div>
            </div>
            {comparisonFeatures.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-3 gap-px bg-border ${i % 2 === 0 ? '' : ''}`}>
                <div className="bg-card p-4 text-sm text-muted-foreground">{row.feature}</div>
                <div className="bg-card p-4 text-sm text-center text-muted-foreground flex items-center justify-center gap-1">
                  {row.selfHosted === 'Manual config' || row.selfHosted === 'Manual setup' || row.selfHosted === 'Self-managed' || row.selfHosted === 'Manual updates' || row.selfHosted === 'You handle it' || row.selfHosted === 'Configure yourself' || row.selfHosted === 'Community only' ? (
                    <>
                      <X className="w-3.5 h-3.5 text-red-400" />
                      {row.selfHosted}
                    </>
                  ) : (
                    row.selfHosted
                  )}
                </div>
                <div className="bg-card p-4 text-sm text-center text-foreground font-medium flex items-center justify-center gap-1">
                  {row.claw === 'Automatic' || row.claw === 'Built-in' || row.claw === '24/7 included' || row.claw === 'Managed for you' || row.claw === 'Automatic daily' || row.claw === 'Priority support' || row.claw === '60 seconds' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      {row.claw}
                    </>
                  ) : (
                    row.claw
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real Scenarios */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-10">Real Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: Bot,
                title: 'AI Customer Support',
                description: 'Deploy a 24/7 support agent that handles tickets, answers FAQs, and escalates complex issues — all on Claw\'s managed infrastructure.',
              },
              {
                icon: BarChart3,
                title: 'Automated Data Pipeline',
                description: 'Run data processing agents that collect, transform, and load data from multiple sources into your warehouse on a schedule.',
              },
              {
                icon: Globe,
                title: 'Content Generation Engine',
                description: 'Power your content strategy with AI agents that research, draft, and publish content across your channels automatically.',
              },
              {
                icon: Shield,
                title: 'Security Monitoring',
                description: 'Deploy security agents that continuously scan for vulnerabilities, monitor access patterns, and alert on suspicious activity.',
              },
            ].map((scenario) => {
              const Icon = scenario.icon;
              return (
                <div key={scenario.title} className="bg-card border border-border rounded-xl p-6">
                  <div className="w-10 h-10 rounded-lg bg-[#216BE4]/10 flex items-center justify-center text-[#216BE4] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold mb-2">{scenario.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{scenario.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-4">Claw Pricing</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">
            Start small and scale as you grow. All plans include managed infrastructure and automatic updates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[960px] mx-auto">
            {clawPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-6 flex flex-col ${
                  plan.highlighted
                    ? 'border-[#216BE4] shadow-lg shadow-[#216BE4]/10 relative'
                    : 'border-border'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#216BE4] text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-[#216BE4] flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => navigate('builder')}
                  className={`w-full font-semibold py-2.5 rounded-lg ${
                    plan.highlighted
                      ? 'bg-[#216BE4] hover:bg-[#1B5BC7] text-white'
                      : 'bg-secondary hover:bg-border text-foreground border border-border'
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* What's Included */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-10">What&apos;s Included</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: 'Enterprise Security', desc: 'SOC 2 compliant, encrypted at rest and in transit' },
              { icon: Clock, title: '99.99% Uptime SLA', desc: 'Redundant infrastructure across multiple regions' },
              { icon: RefreshCw, title: 'Auto-Scaling', desc: 'Scales from zero to millions of requests automatically' },
              { icon: Globe, title: 'Global CDN', desc: 'Deploy to 30+ edge locations worldwide' },
              { icon: Database, title: 'Managed Database', desc: 'PostgreSQL with automatic backups and replication' },
              { icon: Lock, title: 'SSL Certificates', desc: 'Automatic SSL provisioning and renewal' },
              { icon: BarChart3, title: 'Real-time Monitoring', desc: 'Full observability with logs, metrics, and alerts' },
              { icon: Bot, title: 'AI Model Access', desc: 'Access 200+ AI models through our unified gateway' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-card border border-border rounded-xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-[#216BE4]/10 flex items-center justify-center text-[#216BE4] mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integrations */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Integrations</h2>
          <p className="text-muted-foreground mb-8">Connect Claw with your existing tools and services.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {integrations.map((int) => {
              const Icon = int.icon;
              return (
                <div
                  key={int.name}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-[#216BE4]/30 hover:shadow-sm transition-all cursor-pointer"
                >
                  <Icon className="w-4 h-4 text-[#216BE4]" />
                  <span className="text-sm font-medium">{int.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center border-t border-border pt-12">
          <h3 className="text-2xl font-bold mb-3">Ready to deploy your AI agents?</h3>
          <p className="text-muted-foreground mb-6">Get started with CreAIlity Agents in under 60 seconds.</p>
          <Button
            onClick={() => navigate('builder')}
            className="bg-[#216BE4] hover:bg-[#1B5BC7] text-white font-semibold px-7 py-3 rounded-lg text-base"
          >
            Deploy Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
