'use client';

import { usePageStore, type PageType } from '@/lib/page-context';

const footerCols = [
  {
    title: 'PRODUCT',
    links: [
      { label: 'AI Agents', page: 'agents' as PageType },
      { label: 'CreAIlity Agents', page: 'claw' as PageType },
      { label: 'Templates', page: 'templates' as PageType },
      { label: 'Explore', page: 'home' as PageType },
      { label: 'Pricing', page: 'pricing' as PageType },
      { label: 'Status', page: 'home' as PageType },
    ],
  },
  {
    title: 'RESOURCES',
    links: [
      { label: 'Blog', page: 'blog' as PageType },
      { label: 'Documentation', page: 'docs' as PageType },
      { label: 'Prompts', page: 'home' as PageType },
      { label: 'Case Studies', page: 'home' as PageType },
      { label: 'FAQ', page: 'home' as PageType },
    ],
  },
  {
    title: 'COMMUNITY',
    links: [
      { label: 'Discord', page: 'home' as PageType },
      { label: 'X / Twitter', page: 'home' as PageType },
      { label: 'Support', page: 'home' as PageType },
      { label: 'Affiliates', page: 'affiliates' as PageType },
    ],
  },
  {
    title: 'LEGAL',
    links: [
      { label: 'Terms of Service', page: 'home' as PageType },
      { label: 'Privacy Policy', page: 'home' as PageType },
      { label: 'Affiliate Terms', page: 'home' as PageType },
    ],
  },
];

export function Footer() {
  const { navigate } = usePageStore();

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-8">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          {/* Brand */}
          <div className="max-w-[240px]">
            <button onClick={() => navigate('home')} className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
              <img src="/images/creality-logo.png" alt="CreAIlity" className="h-8 w-auto" />
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Build websites, SaaS, and mobile apps in minutes by chatting with AI. Everything included.
            </p>
            <div className="flex gap-3 mt-4">
              {/* X/Twitter */}
              <a href="#" className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:bg-border hover:text-foreground transition-colors" title="X / Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              {/* Discord */}
              <a href="#" className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:bg-border hover:text-foreground transition-colors" title="Discord">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:bg-border hover:text-foreground transition-colors" title="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
              {/* Reddit */}
              <a href="#" className="w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:bg-border hover:text-foreground transition-colors" title="Reddit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" /></svg>
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {footerCols.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-bold tracking-widest text-muted-foreground mb-4">
                  {col.title}
                </h4>
                {col.links.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => navigate(link.page)}
                    className="block text-sm text-muted-foreground py-1 hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-border flex justify-start">
          <div className="inline-flex items-center gap-2 text-[13px] text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-dot" />
            All systems normal
          </div>
        </div>
      </div>
    </footer>
  );
}
