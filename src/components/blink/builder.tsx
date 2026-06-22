// Enhanced builder component with full backend integration
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
  Rocket,
  ExternalLink,
  CheckCircle2,
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
  content?: string;
}

interface ModelOption {
  id: string;
  name: string;
  provider: string;
}

interface Project {
  id: string;
  name: string;
  status: string;
  subdomain?: string;
  deploymentUrl?: string;
  files?: GeneratedFile[];
}

const modelGroups: { provider: string; models: ModelOption[] }[] = [
  {
    provider: 'OpenAI',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
    ],
  },
];

const allModels = modelGroups.flatMap((g) => g.models);

export function Builder() {
  const { navigate, projectPrompt, projectType, projectModel } = usePageStore();
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(allModels[0]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [activeView, setActiveView] = useState<'preview' | 'code'>('preview');
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(true);
  const [fileTreeOpen, setFileTreeOpen] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  
  const initialSentRef = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Create project on mount if we have a prompt
  useEffect(() => {
    if (projectPrompt && !currentProject && !initialSentRef.current) {
      initialSentRef.current = true;
      createProject(projectPrompt);
    }
  }, [projectPrompt]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create a new project
  const createProject = async (prompt: string) => {
    try {
      const response = await fetch('/api/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: prompt.substring(0, 50),
          prompt,
          type: projectType || 'fullstack',
          model: projectModel || 'gpt-4o',
        }),
      });

      const data = await response.json();
      if (data.project) {
        setCurrentProject(data.project);
        
        // Send initial message
        const userMessage: Message = {
          id: crypto.randomUUID(),
          role: 'user',
          content: prompt,
        };
        setMessages([userMessage]);
        await sendToAI([userMessage], data.project.id, false);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  // Parse files from AI response
  const parseFilesFromResponse = useCallback((content: string) => {
    const codeBlockRegex = /```(\w+)?\s*(?:\/\/\s*)?([^\n]+)\n([\s\S]*?)```/g;
    const newFiles: GeneratedFile[] = [];
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'text';
      const firstLine = match[2].trim();
      const code = match[3];
      
      // Check if first line is a file path
      const isFilePath = firstLine.includes('/') || firstLine.includes('.');
      
      if (isFilePath) {
        newFiles.push({
          name: firstLine.split('/').pop() || firstLine,
          path: firstLine,
          language,
          content: code,
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
      return newFiles;
    }
    return [];
  }, []);

  // Send message to AI
  const sendToAI = async (
    currentMessages: Message[],
    projectId: string,
    isIncremental: boolean
  ) => {
    setIsLoading(true);
    try {
      const apiMessages = currentMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          model: selectedModel.id,
          projectId,
          projectType: projectType || 'fullstack',
          isIncremental,
        }),
      });

      const data = await response.json();
      const content = data.message;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content,
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Parse files from response
      const files = parseFilesFromResponse(content);
      
      // Update project with new files
      if (files.length > 0 && projectId) {
        await fetch('/api/project', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            files: [...generatedFiles, ...files],
          }),
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.error('AI request failed:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue,
    };

    setInputValue('');
    setMessages((prev) => [...prev, userMessage]);

    // If no project, create one
    if (!currentProject) {
      await createProject(inputValue);
    } else {
      // Incremental edit mode
      await sendToAI([...messages, userMessage], currentProject.id, true);
    }
  };

  // Deploy to Cloudflare
  const handleDeploy = async () => {
    if (!currentProject || generatedFiles.length === 0) return;

    setIsDeploying(true);
    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: currentProject.id,
          files: generatedFiles,
          projectType: projectType || 'fullstack',
        }),
      });

      const data = await response.json();
      
      if (data.success && data.deployment) {
        setDeploymentUrl(data.deployment.url);
        setCurrentProject({
          ...currentProject,
          status: 'deployed',
          deploymentUrl: data.deployment.url,
          subdomain: data.deployment.subdomain,
        });
      } else {
        alert(`Deployment failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Deployment failed:', error);
      alert('Deployment failed. Please try again.');
    } finally {
      setIsDeploying(false);
    }
  };

  // Group files by directory
  const filesByDirectory = generatedFiles.reduce((acc, file) => {
    const dir = file.path.substring(0, file.path.lastIndexOf('/')) || '/';
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(file);
    return acc;
  }, {} as Record<string, GeneratedFile[]>);

  return (
    <div className="h-screen w-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 flex-shrink-0 bg-background">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/images/creality-logo.png" alt="CreAIlity" className="h-8 w-auto" />
            <div>
              <h1 className="text-sm font-semibold">
                {currentProject?.name || projectType?.replace('-', ' ') || 'Full Stack App'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {currentProject?.status === 'deployed' ? '🟢 Deployed' : '🟡 Building'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Model Selector */}
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary text-sm font-medium hover:bg-border transition-colors"
            >
              <Bot className="w-4 h-4" />
              {selectedModel.name}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            
            {showModelDropdown && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-auto">
                {modelGroups.map((group) => (
                  <div key={group.provider} className="p-2">
                    <div className="text-xs font-semibold text-muted-foreground px-2 py-1">
                      {group.provider}
                    </div>
                    {group.models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model);
                          setShowModelDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-secondary transition-colors"
                      >
                        {model.name}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* View Toggles */}
          <div className="flex items-center bg-secondary rounded-md p-0.5">
            <button
              onClick={() => setActiveView('preview')}
              className={`p-1.5 rounded flex items-center gap-1.5 text-xs font-medium transition-colors ${
                activeView === 'preview'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
            <button
              onClick={() => setActiveView('code')}
              className={`p-1.5 rounded flex items-center gap-1.5 text-xs font-medium transition-colors ${
                activeView === 'code'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Code
            </button>
          </div>

          {/* Deploy Button */}
          {generatedFiles.length > 0 && (
            <button
              onClick={handleDeploy}
              disabled={isDeploying || currentProject?.status === 'deployed'}
              className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#216BE4] text-white text-sm font-semibold hover:bg-[#1B5BC7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deploying...
                </>
              ) : currentProject?.status === 'deployed' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Deployed
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  Deploy
                </>
              )}
            </button>
          )}

          {/* Deployment URL */}
          {deploymentUrl && (
            <a
              href={deploymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-green-500/10 text-green-600 text-sm font-medium hover:bg-green-500/20 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Live
            </a>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        {fileTreeOpen && generatedFiles.length > 0 && (
          <div className="w-60 border-r border-border flex flex-col bg-background flex-shrink-0">
            <div className="h-10 border-b border-border flex items-center justify-between px-4 flex-shrink-0">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Files</span>
              <button
                onClick={() => setFileTreeOpen(false)}
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {Object.entries(filesByDirectory).map(([dir, files]) => (
                <div key={dir}>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground">
                    <Folder className="w-3.5 h-3.5" />
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

        {!fileTreeOpen && generatedFiles.length > 0 && (
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
            <div className="h-10 border-b border-border flex items-center justify-between px-4 flex-shrink-0">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Chat</span>
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
                  <p className="text-sm font-medium">CreAIlity AI</p>
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
                      <Bot className="w-4 h-4 text-[#216BE4]" />
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
                      <div className="prose prose-sm dark:prose-invert max-w-none text-xs">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-md bg-[#216BE4]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-[#216BE4]" />
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-secondary">
                    <Loader2 className="w-4 h-4 animate-spin text-[#216BE4]" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-border p-3 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Describe changes or new features..."
                  className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#216BE4]/50"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 rounded-lg bg-[#216BE4] text-white hover:bg-[#1B5BC7] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
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
                      Describe your app in the chat panel and watch it come to life.
                    </p>
                  </div>
                ) : (
                  <div className="w-full max-w-4xl mx-auto">
                    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                      <div className="h-10 bg-secondary/50 border-b border-border flex items-center px-4 gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-400/60" />
                          <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                          <div className="w-3 h-3 rounded-full bg-green-400/60" />
                        </div>
                        <div className="flex-1 text-center">
                          <span className="text-xs text-muted-foreground">
                            {deploymentUrl || 'localhost:3000'}
                          </span>
                        </div>
                      </div>
                      <div className="p-8 max-h-[600px] overflow-y-auto">
                        {isLoading ? (
                          <div className="text-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-[#216BE4] mx-auto mb-3" />
                            <p className="text-sm text-muted-foreground">Building your app...</p>
                          </div>
                        ) : messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown>{messages[messages.length - 1].content}</ReactMarkdown>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Generated Files */}
                    {generatedFiles.length > 0 && !isLoading && (
                      <div className="mt-6">
                        <h4 className="text-sm font-semibold mb-3">Generated Files ({generatedFiles.length})</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {generatedFiles.map((file) => (
                            <button
                              key={file.path}
                              onClick={() => {
                                setActiveView('code');
                                setSelectedFile(file.path);
                              }}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-secondary transition-colors text-left"
                            >
                              <FileCode2 className="w-4 h-4 text-[#216BE4]" />
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
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <File className="w-4 h-4 text-[#216BE4]" />
                          <span className="text-xs font-medium">{selectedFile}</span>
                        </div>
                      </div>
                      <pre className="text-xs leading-relaxed whitespace-pre-wrap">
                        {generatedFiles.find((f) => f.path === selectedFile)?.content ||
                          '// Code will appear here once generated'}
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
