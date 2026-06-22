'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { usePageStore, type PageType } from '@/lib/page-context';
import { Monitor, Sun, Moon, Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks: { label: string; page: PageType; isNew?: boolean }[] = [
  { label: 'Agents', page: 'agents', isNew: true },
  { label: 'Claw', page: 'claw', isNew: true },
  { label: 'Templates', page: 'templates' },
  { label: 'Pricing', page: 'pricing' },
  { label: 'Docs', page: 'docs' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { navigate, currentPage } = usePageStore();

  const handleNavClick = (page: PageType) => {
    navigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 z-50 border-b border-border/50 bg-background/85 backdrop-blur-xl">
        <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between px-6">
          {/* Left */}
          <div className="flex items-center gap-8">
            <button onClick={() => handleNavClick('home')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-black text-sm">C</span>
              </div>
              <span className="text-lg font-bold tracking-tight">
                Cre<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-black">AI</span>lity
              </span>
            </button>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.page)}
                  className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                    currentPage === link.page
                      ? 'text-foreground bg-secondary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {link.isNew && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#216BE4] text-white leading-none">
                      NEW
                    </span>
                  )}
                  {link.page === 'agents' && <Sparkles className="w-3.5 h-3.5" />}
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick('blog')}
                className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                  currentPage === 'blog'
                    ? 'text-foreground bg-secondary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                Blog
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme toggle */}
            <div className="flex items-center bg-secondary rounded-md p-0.5 gap-px">
              <button
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded flex items-center justify-center transition-colors ${
                  theme === 'system' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="System theme"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded flex items-center justify-center transition-colors ${
                  theme === 'light' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Light theme"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded flex items-center justify-center transition-colors ${
                  theme === 'dark' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
                title="Dark theme"
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>

            <button className="text-sm font-medium px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              Log in
            </button>
            <Button
              onClick={() => handleNavClick('builder')}
              className="bg-[#216BE4] hover:bg-[#1B5BC7] text-white font-semibold text-sm px-4 py-2 rounded-md"
            >
              Get started for free
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed top-16 left-0 right-0 bg-background border-b border-border p-4 z-49 flex flex-col gap-1 md:hidden">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.page)}
              className="text-base font-medium px-4 py-3 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors flex items-center gap-2"
            >
              {link.isNew && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#216BE4] text-white leading-none">
                  NEW
                </span>
              )}
              {link.page === 'agents' && <Sparkles className="w-4 h-4" />}
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('blog')}
            className="text-base font-medium px-4 py-3 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            Blog
          </button>
          <button
            onClick={() => handleNavClick('affiliates')}
            className="text-base font-medium px-4 py-3 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            Affiliates
          </button>
          <hr className="border-border my-2" />
          <button className="text-base font-medium px-4 py-3 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            Log in
          </button>
          <Button
            onClick={() => handleNavClick('builder')}
            className="bg-[#216BE4] hover:bg-[#1B5BC7] text-white font-semibold w-full mt-2 py-3 rounded-md"
          >
            Get started for free
          </Button>
        </div>
      )}
    </>
  );
}
