import React, { useState } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  ThumbsUp, 
  ThumbsDown, 
  Edit3, 
  Sparkles, 
  Terminal, 
  Code, 
  ChevronRight,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DocsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'responses-api' | 'quickstart' | 'models'>('overview');
  const [activeTab, setActiveTab] = useState<'docs' | 'api-reference'>('docs');
  const [codeLang, setCodeLang] = useState<'python' | 'curl' | 'js'>('python');
  const [copied, setCopied] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);

  const navCategories = [
    {
      group: 'GETTING STARTED',
      items: [
        { id: 'overview', title: 'Overview' },
        { id: 'quickstart', title: 'Quickstart' },
        { id: 'models', title: 'Models' },
        { 
          id: 'openai-compat', 
          title: 'OpenAI Compatibility',
          subItems: [{ id: 'responses-api', title: 'Responses API' }]
        },
        { id: 'rate-limits', title: 'Rate Limits' },
        { id: 'templates', title: 'Templates' },
      ],
    },
    {
      group: 'CORE FEATURES',
      items: [
        { id: 'text-gen', title: 'Text Generation' },
        { id: 'speech-to-text', title: 'Speech to Text' },
        { id: 'text-to-speech', title: 'Text to Speech' },
        { id: 'ocr-vision', title: 'OCR and Image Recognition' },
        { id: 'reasoning', title: 'Reasoning' },
        { id: 'content-mod', title: 'Content Moderation' },
        { id: 'structured-out', title: 'Structured Outputs' },
        { id: 'prompt-cache', title: 'Prompt Caching' },
      ],
    },
    {
      group: 'TOOLS & INTEGRATIONS',
      items: [
        { id: 'tool-use', title: 'Tool Use' },
        { id: 'integrations-catalog', title: 'Integrations Catalog' },
        { id: 'coding-groq', title: 'Coding with Groq' },
      ],
    },
  ];

  const tocItems = [
    'Configuring OpenAI Client for Responses API',
    'Multi-turn Conversations',
    'Image Inputs',
    'Built-in Tools',
    'Structured Outputs',
    'Reasoning',
    'Model Context Protocol (MCP)',
    'Detailed Usage Metrics',
    'Next Steps'
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] bg-[#fcfbf9] dark:bg-[#0d0f14] text-[#171920] dark:text-gray-200 overflow-hidden">
      
      {/* Left Documentation Sidebar (Frame 004 match) */}
      <div className="w-64 border-r border-[#eae8e4] dark:border-[#202533] bg-[#f9f8f5] dark:bg-[#11141c] flex flex-col shrink-0">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-[#eae8e4] dark:border-[#202533]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-white dark:bg-[#181c26] border border-gray-200 dark:border-gray-700/80 rounded-lg pl-8 pr-8 py-1.5 text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#f55036]"
            />
            <span className="text-[10px] text-gray-400 font-mono absolute right-2.5 top-2 border border-gray-200 dark:border-gray-700 rounded px-1">
              ⌘K
            </span>
          </div>

          {/* Docs / API Reference switcher */}
          <div className="flex gap-4 mt-3 pt-2 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('docs')}
              className={`pb-1 border-b-2 transition-colors ${
                activeTab === 'docs'
                  ? 'border-[#f55036] text-[#f55036]'
                  : 'border-transparent text-gray-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Docs
            </button>
            <button
              onClick={() => setActiveTab('api-reference')}
              className={`pb-1 border-b-2 transition-colors ${
                activeTab === 'api-reference'
                  ? 'border-[#f55036] text-[#f55036]'
                  : 'border-transparent text-gray-500 hover:text-black dark:hover:text-white'
              }`}
            >
              API Reference
            </button>
          </div>
        </div>

        {/* Tree Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
          {navCategories.map((group) => (
            <div key={group.group} className="space-y-1.5">
              <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase font-mono">
                {group.group}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id as any)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeSection === item.id
                          ? 'text-[#f55036] font-semibold bg-[#f55036]/10'
                          : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                      }`}
                    >
                      {item.title}
                    </button>

                    {/* Sub items if any */}
                    {item.subItems && (
                      <div className="pl-4 mt-0.5 space-y-0.5 border-l border-gray-200 dark:border-gray-800 ml-2">
                        {item.subItems.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => setActiveSection(sub.id as any)}
                            className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                              activeSection === sub.id
                                ? 'text-[#f55036] font-semibold'
                                : 'text-gray-500 hover:text-black dark:hover:text-white'
                            }`}
                          >
                            {sub.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Main Content Area (Frame 004 & Frame 008 matches) */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8">
        
        {activeSection === 'responses-api' ? (
          /* Responses API View (Frame 008) */
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-extrabold text-[#171920] dark:text-white">
                Responses API
              </h1>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5">
                <span>Copy page</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Groq's Responses API is fully compatible with OpenAI's Responses API, making it easy to integrate advanced conversational AI capabilities into your applications. The Responses API supports both text and image inputs while producing text outputs, stateful conversations, and function calling to connect with external systems.
            </p>

            {/* Beta notification banner */}
            <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
              <span>The Responses API is currently in beta. Please let us know your feedback in our Community.</span>
            </div>

            {/* Configuring OpenAI client section */}
            <div className="space-y-3 pt-4">
              <h2 className="text-lg font-bold text-[#171920] dark:text-white">
                Configuring OpenAI Client for Responses API
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                To use the Responses API with OpenAI's client libraries, configure your client with your Groq API key and set the base URL to <code className="bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded font-mono">https://api.groq.com/openai/v1</code>:
              </p>

              {/* Code Box */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-[#141720] text-gray-200 overflow-hidden font-mono text-xs">
                <div className="px-4 py-2 border-b border-gray-800 flex items-center justify-between bg-black/30">
                  <span className="text-[11px] text-gray-400">Python</span>
                  <button 
                    onClick={() => handleCopy(`import openai\nclient = openai.OpenAI(\n  api_key="your-groq-api-key",\n  base_url="https://api.groq.com/openai/v1"\n)\nresponse = client.responses.create(\n  model="llama-3.3-70b-versatile",\n  input="Tell me a fun fact about the moon in one sentence."\n)\nprint(response.output_text)`)}
                    className="text-gray-400 hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto leading-relaxed">
{`import openai

client = openai.OpenAI(
    api_key="your-groq-api-key",
    base_url="https://api.groq.com/openai/v1"
)

response = client.responses.create(
    model="llama-3.3-70b-versatile",
    input="Tell me a fun fact about the moon in one sentence."
)

print(response.output_text)`}
                </pre>
              </div>
            </div>

            {/* Multi-turn conversations */}
            <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-[#171920] dark:text-white">
                Multi-turn Conversations
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                The Responses API on Groq supports stateful conversation threading. By providing previously generated response IDs, conversational history is cached on the LPU fabric with zero redundant compute.
              </p>
            </div>
          </div>
        ) : (
          /* Overview View (Frame 004 match) */
          <div className="max-w-3xl space-y-6">
            
            {/* Welcome hero block */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#141720] p-6 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 space-y-2">
                <h2 className="text-2xl font-bold text-[#171920] dark:text-white">
                  Welcome
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  Fast LLM inference, OpenAI-compatible. Simple to integrate, easy to scale. Start building in minutes.
                </p>
              </div>

              {/* Code preview on right */}
              <div className="flex-1 rounded-xl bg-[#11131a] text-gray-200 font-mono text-xs overflow-hidden border border-gray-800">
                <div className="px-3.5 py-1.5 border-b border-gray-800 bg-black/40 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">Python</span>
                  <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-white cursor-pointer" />
                </div>
                <pre className="p-3.5 text-[11px] overflow-x-auto text-emerald-400">
{`from openai import OpenAI
import os

client = OpenAI(
  api_key=os.environ.get("GROQ_API_KEY"),
  base_url="https://api.groq.com/openai/v1",
)

response = client.responses.create(
  input="Explain the importance of fast language models",
  model="openai/gpt-oss-20b",
)
print(response.output_text)`}
                </pre>
              </div>
            </div>

            {/* Google Workspace banner */}
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div>
                  <span className="font-bold text-blue-900 dark:text-blue-200">
                    Google Workspace Connectors are now available on Groq
                  </span>
                  <p className="text-blue-700/80 dark:text-blue-400 text-[11px]">
                    Connect your AI agents to Gmail, Google Calendar, and Google Drive with ready-made connectors.
                  </p>
                </div>
              </div>
              <span className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                Learn More &gt;
              </span>
            </div>

            {/* 6 Quick Link Cards (Frame 004) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Quick Start', desc: 'Get started with the Groq API', icon: Sparkles },
                { title: 'Models', desc: 'See all the models Groq offers', icon: Terminal },
                { title: 'API Reference', desc: 'Explore all API endpoints', icon: Code },
                { title: 'Cookbooks', desc: 'See code examples and tutorials', icon: BookOpen },
                { title: 'Rate Limits', desc: 'Reference the model rate limits', icon: Sparkles },
                { title: 'Integrations', desc: 'Connect to external services', icon: ExternalLink },
              ].map((c) => (
                <div
                  key={c.title}
                  className="p-5 rounded-2xl bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800 hover:border-[#f55036]/40 shadow-xs hover:shadow-md transition-all cursor-pointer groq-pop"
                >
                  <c.icon className="w-5 h-5 text-gray-500 mb-3" />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{c.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">{c.desc}</p>
                </div>
              ))}
            </div>

            {/* External API Compatibility */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800 space-y-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">External API Compatibility</h3>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">OpenAI base URL:</span>
                  <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono text-gray-800 dark:text-gray-200">
                    https://api.groq.com/openai/v1
                  </code>
                  <Copy 
                    onClick={() => handleCopy('https://api.groq.com/openai/v1')}
                    className="w-3.5 h-3.5 text-gray-400 hover:text-black dark:hover:text-white cursor-pointer" 
                  />
                </div>
                <span className="text-[#f55036] hover:underline cursor-pointer font-medium">
                  Learn about OpenAI compatibility &gt;
                </span>
              </div>
            </div>

          </div>
        )}

        {/* Helpful Feedback Footer (Frame 004 match) */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>Was this page helpful?</span>
            <button
              onClick={() => {
                setFeedbackGiven('yes');
                confetti({ particleCount: 25, spread: 45 });
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${
                feedbackGiven === 'yes' ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : ''
              }`}
            >
              <ThumbsUp className="w-3 h-3" />
              <span>Yes</span>
            </button>
            <button
              onClick={() => setFeedbackGiven('no')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${
                feedbackGiven === 'no' ? 'bg-red-50 text-red-600 border-red-300' : ''
              }`}
            >
              <ThumbsDown className="w-3 h-3" />
              <span>No</span>
            </button>
          </div>

          <button className="flex items-center gap-1 text-gray-500 hover:text-black dark:hover:text-white">
            <Edit3 className="w-3 h-3" />
            <span>Suggest Edits</span>
          </button>
        </div>

      </div>

      {/* Right Sidebar: "On this page" TOC (Frame 008) */}
      <div className="w-60 border-l border-[#eae8e4] dark:border-[#202533] bg-[#fcfbf9] dark:bg-[#0d0f14] p-5 hidden xl:block shrink-0 overflow-y-auto">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
          On this page
        </div>
        <div className="space-y-2 text-xs">
          {tocItems.map((item, idx) => (
            <a
              key={idx}
              href="#"
              className={`block text-xs leading-relaxed transition-colors ${
                idx === 0
                  ? 'text-[#f55036] font-semibold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {item}
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};

