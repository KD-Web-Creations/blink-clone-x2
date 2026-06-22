# Blink - AI App Builder

A full-featured AI app builder platform clone. Build websites, SaaS, and mobile apps in minutes by chatting with AI. 

## Features

- **AI App Builder** - Describe your app in natural language, get a full-stack application
- **58+ AI Models** - Access GPT-4.1, GPT-5.x, Claude Opus/Sonnet, Gemini 3, Grok 4, and more
- **13 AI Agents** - Hire specialist AI employees (CFO, SDR, Engineer, etc.) that work 24/7
- **Blink Claw** - Managed OpenClaw hosting for autonomous AI agents
- **Built-in Infrastructure** - Database, auth, storage, edge functions, hosting
- **Dark/Light Theme** - Full theme support with system preference detection
- **Responsive Design** - Mobile-first, works on all devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **AI**: z-ai-web-dev-sdk (OpenAI, Anthropic, Google, xAI models)
- **State**: Zustand
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm or bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/simou86hl/blink-clone.git
cd blink-clone

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

See `.env.example` for all available environment variables.

## Project Structure

```
src/
  app/
    api/
      chat/route.ts        - AI chat completions
      agent-chat/route.ts  - Agent-specific chat
      image/route.ts       - AI image generation
      models/route.ts      - Available AI models
    layout.tsx             - Root layout
    page.tsx               - Main page with routing
  components/
    blink/
      hero.tsx             - Landing page hero
      navbar.tsx           - Navigation bar
      features.tsx         - Features grid
      builder.tsx          - AI app builder IDE
      agents.tsx           - AI agents catalog
      claw.tsx             - Blink Claw page
      pricing.tsx          - Pricing plans
      templates.tsx        - App templates
      blog.tsx             - Blog listing
      affiliates.tsx       - Affiliate program
      faq.tsx              - FAQ section
      cta.tsx              - Call to action
      footer.tsx           - Site footer
    ui/                    - shadcn/ui components
  lib/
    page-context.tsx       - Zustand page routing
    utils.ts               - Utility functions
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in [Vercel Dashboard](https://vercel.com/new)
3. Configure environment variables
4. Deploy

The project is pre-configured with `vercel.json` for optimal deployment.

## License

MIT
