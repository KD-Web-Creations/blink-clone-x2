'use client';

import { useState, useRef } from 'react';
import { usePageStore } from '@/lib/page-context';
import {
  Monitor,
  Smartphone,
  Globe,
  Wrench,
  Paperclip,
  ChevronDown,
  ArrowRight,
  Bot,
  MoreHorizontal,
  Search,
} from 'lucide-react';

const projectTypes = [
  { id: 'fullstack', label: 'Full Stack App', icon: Monitor },
  { id: 'mobile', label: 'Mobile App', icon: Smartphone },
  { id: 'website', label: 'Website', icon: Globe },
  { id: 'extension', label: 'Chrome Extension', icon: Wrench },
];

const suggestions = [
  'AI Testimonial Wall',
  'AI Product Photo Studio',
  'AI Headshot Generator',
];

interface ModelOption {
  id: string;
  name: string;
  provider: string;
}

const modelGroups: { provider: string; models: ModelOption[] }[] = [
  {
    provider: 'Blink',
    models: [
      { id: 'blink-1.0-lite', name: 'Blink 1.0 Lite', provider: 'Blink' },
      { id: 'blink-1.0', name: 'Blink 1.0', provider: 'Blink' },
      { id: 'blink-1.0-pro', name: 'Blink 1.0 Pro', provider: 'Blink' },
    ],
  },
  {
    provider: 'OpenAI',
    models: [
      { id: 'gpt-5.5', name: 'GPT-5.5', provider: 'OpenAI' },
      { id: 'gpt-5.4', name: 'GPT-5.4', provider: 'OpenAI' },
      { id: 'gpt-5.2', name: 'GPT-5.2', provider: 'OpenAI' },
      { id: 'gpt-5.1', name: 'GPT-5.1', provider: 'OpenAI' },
      { id: 'gpt-5.1-codex', name: 'GPT-5.1 Codex', provider: 'OpenAI' },
      { id: 'gpt-5.1-codex-mini', name: 'GPT-5.1 Codex Mini', provider: 'OpenAI' },
      { id: 'gpt-5-mini', name: 'GPT-5 Mini', provider: 'OpenAI' },
      { id: 'gpt-5-nano', name: 'GPT-5 Nano', provider: 'OpenAI' },
      { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI' },
      { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'OpenAI' },
      { id: 'gpt-4.1-nano', name: 'GPT-4.1 Nano', provider: 'OpenAI' },
    ],
  },
  {
    provider: 'Anthropic',
    models: [
      { id: 'claude-opus-4-7', name: 'Claude Opus 4.7', provider: 'Anthropic' },
      { id: 'claude-opus-4-6', name: 'Claude Opus 4.6', provider: 'Anthropic' },
      { id: 'claude-opus-4-5', name: 'Claude Opus 4.5', provider: 'Anthropic' },
      { id: 'claude-sonnet-4-6', name: 'Claude Sonnet 4.6', provider: 'Anthropic' },
      { id: 'claude-sonnet-4-5', name: 'Claude Sonnet 4.5', provider: 'Anthropic' },
      { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet', provider: 'Anthropic' },
      { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', provider: 'Anthropic' },
    ],
  },
  {
    provider: 'Google',
    models: [
      { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview', provider: 'Google' },
      { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro Preview', provider: 'Google' },
      { id: 'gemini-3-flash', name: 'Gemini 3 Flash', provider: 'Google' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google' },
      { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', provider: 'Google' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'Google' },
    ],
  },
  {
    provider: 'xAI',
    models: [
      { id: 'grok-4-latest', name: 'Grok 4 Latest', provider: 'xAI' },
      { id: 'grok-4-1-fast', name: 'Grok 4.1 Fast', provider: 'xAI' },
    ],
  },
];

const allModels = modelGroups.flatMap((g) => g.models);

export function Hero() {
  const [activeTab, setActiveTab] = useState('fullstack');
  const [inputValue, setInputValue] = useState('');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(allModels[0]);
  const [agentEnabled, setAgentEnabled] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const modelSearchRef = useRef<HTMLInputElement>(null);
  const { navigate, setProjectPrompt, setProjectType, setProjectModel } = usePageStore();

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    setProjectPrompt(inputValue);
    setProjectType(activeTab);
    setProjectModel(selectedModel.id);
    navigate('builder');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSubmit();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(`Build ${text}`);
    inputRef.current?.focus();
  };

  const filteredGroups = modelSearch
    ? modelGroups.map((g) => ({
        ...g,
        models: g.models.filter((m) =>
          m.name.toLowerCase().includes(modelSearch.toLowerCase())
        ),
      })).filter((g) => g.models.length > 0)
    : modelGroups;

  return (
    <section className="pt-20">
      {/* Banner */}
      <div className="text-center pt-4 pb-2 animate-fade-in-up">
        <button
          onClick={() => navigate('claw')}
          className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#216BE4] text-white leading-none">
            NEW
          </span>
          Meet CreAIlity Agents — AI that works 24/7
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Content */}
      <div className="px-6 pt-8 pb-16 text-center">
        <div className="max-w-[720px] mx-auto animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl md:text-[56px] font-extrabold tracking-tight leading-[1.1] mb-10">
            Create ANYTHING...
            <br />
            <span className="inline-flex items-baseline gap-1">
              <span className="text-foreground">with Cre</span>
              <span 
                className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
                style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                AI
              </span>
              <span className="text-foreground">lity!</span>
            </span>
          </h1>

          {/* Project Type Tabs */}
          <div className="flex items-center justify-center gap-1 mb-4 flex-wrap">
            {projectTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`text-sm font-medium px-4 py-2 rounded-full flex items-center gap-1.5 transition-all ${
                    activeTab === type.id
                      ? 'bg-card text-foreground shadow-sm border border-border'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* Create Project Input */}
          <div className="bg-card border border-border rounded-2xl p-1.5 shadow-lg mb-4 transition-shadow focus-within:shadow-xl focus-within:ring-2 focus-within:ring-[#216BE4]/30">
            <div className="flex items-center gap-2 px-4 py-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Build a SaaS app that..."
                className="flex-1 border-none outline-none text-base bg-transparent text-foreground placeholder:text-muted-foreground"
              />
              <button className="p-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Attach file">
                <Paperclip className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-between px-2 py-1 gap-2">
              <div className="relative">
                <button
                  onClick={() => {
                    setShowModelDropdown(!showModelDropdown);
                    setModelSearch('');
                  }}
                  className="text-[13px] font-medium px-3 py-1.5 rounded-md bg-secondary text-muted-foreground hover:bg-border flex items-center gap-1.5 transition-colors"
                >
                  <Bot className="w-4 h-4" />
                  {selectedModel.name}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {showModelDropdown && (
                  <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-xl py-1 min-w-[260px] max-h-[360px] overflow-hidden z-10 flex flex-col">
                    {/* Search */}
                    <div className="p-2 border-b border-border">
                      <div className="flex items-center gap-2 px-2 py-1.5 bg-secondary rounded-md">
                        <Search className="w-3.5 h-3.5 text-muted-foreground" />
                        <input
                          ref={modelSearchRef}
                          type="text"
                          value={modelSearch}
                          onChange={(e) => setModelSearch(e.target.value)}
                          placeholder="Search models..."
                          className="flex-1 bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>
                    {/* Model List */}
                    <div className="overflow-y-auto custom-scrollbar">
                      {filteredGroups.map((group) => (
                        <div key={group.provider}>
                          <div className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-muted-foreground bg-secondary/50 sticky top-0">
                            {group.provider}
                          </div>
                          {group.models.map((model) => (
                            <button
                              key={model.id}
                              onClick={() => {
                                setSelectedModel(model);
                                setShowModelDropdown(false);
                                setModelSearch('');
                              }}
                              className={`w-full text-left text-sm px-3 py-2 hover:bg-secondary transition-colors flex items-center justify-between ${
                                selectedModel.id === model.id ? 'text-[#216BE4] font-medium' : 'text-muted-foreground'
                              }`}
                            >
                              <span>{model.name}</span>
                              {selectedModel.id === model.id && (
                                <span className="text-[10px] font-bold text-[#216BE4]">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      ))}
                      {filteredGroups.length === 0 && (
                        <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                          No models found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setAgentEnabled(!agentEnabled)}
                  className={`text-[13px] font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                    agentEnabled
                      ? 'bg-[#216BE4]/10 text-[#216BE4]'
                      : 'bg-muted/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  Agent
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim()}
                  className="w-10 h-10 rounded-lg bg-[#216BE4] text-white flex items-center justify-center transition-all hover:bg-[#1B5BC7] disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Suggestion Chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {suggestions.map((text) => (
              <button
                key={text}
                onClick={() => handleSuggestionClick(text)}
                className="text-[13px] font-medium px-3.5 py-1.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors whitespace-nowrap"
              >
                {text}
              </button>
            ))}
            <button className="p-1.5 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
