'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePageStore } from '@/lib/page-context';
import {
  ArrowLeft,
  Send,
  Bot,
  ChevronDown,
  FileCode2,
  Eye,
  Code2,
  Settings,
  Loader2,
  PanelLeftClose,
  PanelLeft,
  FolderTree,
  FolderOpen,
  Folder,
  File,
  Sparkles,
  Search,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface GeneratedFile {
  name: string;
  path: string;
  language: string;
}

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

const defaultFileTree: GeneratedFile[] = [
  { name: 'page.tsx', path: 'src/app/page.tsx', language: 'tsx' },
  { name: 'layout.tsx', path: 'src/app/layout.tsx', language: 'tsx' },
  { name: 'globals.css', path: 'src/app/globals.css', language: 'css' },
  { name: 'route.ts', path: 'src/app/api/route.ts', language: 'typescript' },
  { name: 'schema.prisma', path: 'prisma/schema.prisma', language: 'prisma' },
  { name: 'utils.ts', path: 'src/lib/utils.ts', language: 'typescript' },
];

export function Builder() {
  const { navigate, projectPrompt, projectType, projectModel, selectedAgent } = usePageStore();
  const [messages, setMessages] = useState<Message[]>(() => {
    if (projectPrompt) {
      return [{
        id: crypto.randomUUID(),
        role: 'user' as const,
        content: projectPrompt,
      }];
    }
    return [];
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(() => {
    const found = allModels.find((m) => m.id === projectModel);
    return found || allModels[0];
  });
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [modelSearch, setModelSearch] = useState('');
  const [activeView, setActiveView] = useState<'preview' | 'code'>('preview');
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>(defaultFileTree);
  const [selectedFile, setSelectedFile] = useState<string | null>('src/app/page.tsx');
  const [chatOpen, setChatOpen] = useState(true);
  const [fileTreeOpen, setFileTreeOpen] = useState(true);
  const [agentMode, setAgentMode] = useState(!!selectedAgent);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const initialSentRef = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const parseFilesFromResponse = useCallback((content: string) => {
    const codeBlockRegex = /```(\w+)?\s*(?:\/\/\s*)?([^\n]+)\n([\s\S]*?)```/g;
    const newFiles: GeneratedFile[] = [];
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'text';
      const firstLine = match[2].trim();
      const isFilePath = firstLine.includes('/') || firstLine.includes('.') || firstLine.includes('_');

      if (isFilePath) {
        newFiles.push({
          name: firstLine.split('/').pop() || firstLine,
          path: firstLine,
          language,
        });
      }
    }

    if (newFiles.length > 0) {
      setGeneratedFiles((prev) => {
        const existingPaths = new Set(prev.map((f) => f.path));
        const uniqueNew = newFiles.filter((f) => !existingPaths.has(f.path));
        return [...prev, ...uniqueNew];
      });
      setSelectedFile((prev) => prev ?? newFiles[0]?.path ?? null);
    }
  }, []);

  // Simulate streaming effect
  const simulateStreaming = useCallback((content: string) => {
    setIsStreaming(true);
    setStreamingContent('');
    let index = 0;
    const chunkSize = 3;
    const interval = setInterval(() => {
      index += chunkSize;
      if (index >= content.length) {
        setStreamingContent(content);
        setIsStreaming(false);
        clearInterval(interval);
      } else {
        setStreamingContent(content.slice(0, index));
      }
    }, 10);
    return interval;
  }, []);

  const sendToAI = useCallback(async (currentMessages: Message[], currentModel: string) => {
    setIsLoading(true);
    try {
      const apiMessages = currentMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const endpoint = agentMode ? '/api/agent-chat' : '/api/chat';
      const body = agentMode
        ? { messages: apiMessages, model: currentModel, agentId: selectedAgent || 'dev' }
        : { messages: apiMessages, model: currentModel };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      const content = data.message;

      // Simulate streaming
      const streamInterval = simulateStreaming(content);

      // After streaming is done, add the message
      setTimeout(() => {
        clearInterval(streamInterval);
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        parseFilesFromResponse(content);
        setStreamingContent('');
        setIsStreaming(false);
        setIsLoading(false);
      }, Math.min(content.length * 10 / 3 + 100, 3000));
    } catch {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsStreaming(false);
      setIsLoading(false);
    }
  }, [parseFilesFromResponse, simulateStreaming, agentMode, selectedAgent]);

  // Send initial prompt on mount
  useEffect(() => {
    if (projectPrompt && !initialSentRef.current) {
      initialSentRef.current = true;
      const timer = setTimeout(() => {
        sendToAI(messages, projectModel || 'blink-1.0-lite');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [projectPrompt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    sendToAI(newMessages, selectedModel.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const projectTypeLabel = {
    fullstack: 'Full Stack App',
    mobile: 'Mobile App',
    website: 'Website',
    extension: 'Chrome Extension',
  }[projectType] || 'Full Stack App';

  const filteredGroups = modelSearch
    ? modelGroups.map((g) => ({
        ...g,
        models: g.models.filter((m) =>
          m.name.toLowerCase().includes(modelSearch.toLowerCase())
        ),
      })).filter((g) => g.models.length > 0)
    : modelGroups;

  // Group files by directory for tree view
  const fileTree = generatedFiles.reduce<Record<string, GeneratedFile[]>>((acc, file) => {
    const dir = file.path.includes('/') ? file.path.substring(0, file.path.lastIndexOf('/')) : '/';
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(file);
    return acc;
  }, {});

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Bar */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4 flex-shrink-0 bg-background">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#216BE4" />
              <path d="M8 10h6v2H10v3h3v2H10v5H8V10zm9 0h3c2.2 0 4 1.8 4 4s-1.8 4-4 4h-1v4h-2V10zm3 6c1.1 0 2-.9 2-2s-.9-2-2-2h-1v4h1z" fill="white" />
            </svg>
            <span className="text-sm font-semibold">{projectTypeLabel}</span>
            {agentMode && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#216BE4]/10 text-[#216BE4] flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Agent
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Agent Mode Toggle */}
          <button
            onClick={() => setAgentMode(!agentMode)}
            className={`text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
              agentMode
                ? 'bg-[#216BE4]/10 text-[#216BE4]'
                : 'bg-secondary text-muted-foreground hover:bg-border'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Agent
          </button>

          {/* Model selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowModelDropdown(!showModelDropdown);
                setModelSearch('');
              }}
              className="text-xs font-medium px-3 py-1.5 rounded-md bg-secondary text-muted-foreground hover:bg-border flex items-center gap-1.5 transition-colors"
            >
              <Bot className="w-3.5 h-3.5" />
              {selectedModel.name}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showModelDropdown && (
              <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-lg shadow-xl py-1 min-w-[260px] max-h-[320px] overflow-hidden z-10 flex flex-col">
                <div className="p-2 border-b border-border">
                  <div className="flex items-center gap-2 px-2 py-1.5 bg-secondary rounded-md">
                    <Search className="w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      placeholder="Search models..."
                      className="flex-1 bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto custom-scrollbar">
                  {filteredGroups.map((group) => (
                    <div key={group.provider}>
                      <div className="px-3 py-1.5 text-[10px] font-bold tracking-widest text-muted-foreground bg-secondary/50">
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
                          className={`w-full text-left text-xs px-3 py-2 hover:bg-secondary transition-colors flex items-center justify-between ${
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
                </div>
              </div>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-secondary rounded-md p-0.5">
            <button
              onClick={() => setActiveView('preview')}
              className={`p-1.5 rounded flex items-center gap-1 text-xs font-medium transition-colors ${
                activeView === 'preview' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              onClick={() => setActiveView('code')}
              className={`p-1.5 rounded flex items-center gap-1 text-xs font-medium transition-colors ${
                activeView === 'code' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Code
            </button>
          </div>

          <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        {fileTreeOpen && (
          <div className="w-[200px] border-r border-border flex flex-col bg-background flex-shrink-0">
            <div className="h-10 border-b border-border flex items-center justify-between px-3 flex-shrink-0">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <FolderTree className="w-3.5 h-3.5" />
                Files
              </span>
              <button
                onClick={() => setFileTreeOpen(false)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar py-1">
              {Object.entries(fileTree).map(([dir, files]) => (
                <div key={dir}>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground">
                    {dir === '/' ? <FolderOpen className="w-3.5 h-3.5" /> : <Folder className="w-3.5 h-3.5" />}
                    <span className="font-medium truncate">{dir === '/' ? 'root' : dir.split('/').pop()}</span>
                  </div>
                  {files.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file.path)}
                      className={`w-full flex items-center gap-1.5 px-3 pl-6 py-1.5 text-xs transition-colors ${
                        selectedFile === file.path
                          ? 'bg-[#216BE4]/10 text-[#216BE4]'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      <FileCode2 className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {!fileTreeOpen && (
          <button
            onClick={() => setFileTreeOpen(true)}
            className="w-10 border-r border-border flex items-start justify-center pt-3 bg-background text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
          >
            <FolderTree className="w-4 h-4" />
          </button>
        )}

        {/* Chat Panel */}
        {chatOpen && (
          <div className="w-[380px] border-r border-border flex flex-col bg-background flex-shrink-0">
            {/* Chat Header */}
            <div className="h-10 border-b border-border flex items-center justify-between px-4 flex-shrink-0">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                {agentMode ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#216BE4]" />
                    Agent Chat
                  </>
                ) : (
                  'Chat'
                )}
              </span>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
              {messages.length === 0 && !isLoading && (
                <div className="text-center py-12 text-muted-foreground">
                  <Bot className="w-10 h-10 mx-auto mb-3 text-[#216BE4]" />
                  <p className="text-sm font-medium">{agentMode ? 'AI Agent' : 'Blink AI'}</p>
                  <p className="text-xs mt-1">Describe what you want to build</p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-md bg-[#216BE4]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {agentMode ? <Sparkles className="w-4 h-4 text-[#216BE4]" /> : <Bot className="w-4 h-4 text-[#216BE4]" />}
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-[#216BE4] text-white'
                        : 'bg-secondary text-foreground'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-3 [&_pre]:overflow-x-auto [&_code]:text-xs [&_pre_code]:text-xs [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_ul]:text-xs [&_ol]:text-xs [&_li]:text-xs [&_p]:text-sm [&_p]:leading-relaxed">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              {/* Streaming content */}
              {(isStreaming || isLoading) && streamingContent && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-md bg-[#216BE4]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {agentMode ? <Sparkles className="w-4 h-4 text-[#216BE4]" /> : <Bot className="w-4 h-4 text-[#216BE4]" />}
                  </div>
                  <div className="max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed bg-secondary text-foreground">
                    <div className="prose prose-sm dark:prose-invert max-w-none [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:p-3 [&_pre]:overflow-x-auto [&_code]:text-xs [&_pre_code]:text-xs">
                      <ReactMarkdown>{streamingContent}</ReactMarkdown>
                      {isStreaming && <span className="inline-block w-1.5 h-4 bg-[#216BE4] animate-pulse ml-0.5" />}
                    </div>
                  </div>
                </div>
              )}
              {/* Loading dots when no streaming content yet */}
              {(isLoading && !streamingContent) && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-md bg-[#216BE4]/10 flex items-center justify-center flex-shrink-0">
                    {agentMode ? <Sparkles className="w-4 h-4 text-[#216BE4]" /> : <Bot className="w-4 h-4 text-[#216BE4]" />}
                  </div>
                  <div className="bg-secondary rounded-xl px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
                      <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
                      <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={agentMode ? "Ask the AI agent..." : "Describe changes or new features..."}
                  disabled={isLoading}
                  className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#216BE4]/30 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-9 h-9 rounded-lg bg-[#216BE4] text-white flex items-center justify-center transition-all hover:bg-[#1B5BC7] disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="absolute left-4 top-14 z-10 p-2 rounded-md bg-card border border-border shadow-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        {/* Preview / Code Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* File Tabs */}
          {generatedFiles.length > 0 && activeView === 'code' && (
            <div className="h-9 border-b border-border flex items-center px-2 gap-1 overflow-x-auto flex-shrink-0 bg-secondary/30">
              {generatedFiles.slice(0, 8).map((file) => (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file.path)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap transition-colors ${
                    selectedFile === file.path
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  <FileCode2 className="w-3 h-3" />
                  {file.name}
                </button>
              ))}
              {generatedFiles.length > 8 && (
                <span className="text-xs text-muted-foreground px-2">+{generatedFiles.length - 8}</span>
              )}
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {activeView === 'preview' ? (
              <div className="h-full flex items-center justify-center">
                {messages.length === 0 ? (
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#216BE4]/10 flex items-center justify-center mx-auto mb-4">
                      <Bot className="w-8 h-8 text-[#216BE4]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Ready to build</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Describe your app in the chat panel and watch it come to life. The AI will generate code, create files, and build your application in real-time.
                    </p>
                  </div>
                ) : (
                  <div className="w-full max-w-3xl mx-auto">
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                      <div className="h-10 bg-secondary/50 border-b border-border flex items-center px-4 gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400/60" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                          <div className="w-3 h-3 rounded-full bg-green-400/60" />
                        </div>
                        <div className="flex-1 text-center">
                          <span className="text-xs text-muted-foreground">localhost:3000</span>
                        </div>
                      </div>
                      <div className="p-8">
                        {isLoading || isStreaming ? (
                          <div className="text-center py-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#216BE4]/10 text-[#216BE4] text-sm font-medium">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Building your app...
                            </div>
                          </div>
                        ) : messages.length > 1 && messages[messages.length - 1]?.role === 'assistant' ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{messages[messages.length - 1].content}</ReactMarkdown>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#216BE4]/10 text-[#216BE4] text-sm font-medium">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Building your app...
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Generated Files Grid */}
                    {generatedFiles.length > 0 && !isLoading && !isStreaming && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold text-muted-foreground mb-3">Generated Files</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {generatedFiles.map((file) => (
                            <button
                              key={file.path}
                              onClick={() => {
                                setActiveView('code');
                                setSelectedFile(file.path);
                              }}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-secondary transition-colors text-left"
                            >
                              <FileCode2 className="w-4 h-4 text-[#216BE4] flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs font-medium truncate">{file.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{file.path}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full">
                {selectedFile ? (
                  <div className="font-mono text-sm">
                    <div className="bg-secondary/30 border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                        <File className="w-4 h-4 text-[#216BE4]" />
                        <span className="text-xs font-medium text-muted-foreground">{selectedFile}</span>
                      </div>
                      <pre className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {`// ${selectedFile}\n// Generated by Blink AI\n\n// This file was automatically generated based on your prompt.\n// You can edit this code directly or ask the AI to make changes.\n\n`}
                        {messages
                          .filter((m) => m.role === 'assistant')
                          .flatMap((m) => {
                            const regex = /```[\w]*\s*(?:[^\n]*)\n([\s\S]*?)```/g;
                            const blocks: string[] = [];
                            let match;
                            while ((match = regex.exec(m.content)) !== null) {
                              blocks.push(match[1]);
                            }
                            return blocks;
                          })
                          .join('\n\n') || '// Code will appear here once generated'}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    Select a file to view its code
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
