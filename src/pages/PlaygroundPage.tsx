import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Send, Plus, Copy, Check, Code, ChevronDown, Zap,
  Trash2, X, Loader2, AlertCircle, StopCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGroq } from '../context/GroqContext';
import { streamChatCompletion, ChatMessage } from '../lib/groq';

interface UIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  metrics?: { speed: number; ttft: number; promptTokens: number; completionTokens: number; totalTime: number };
}

export const PlaygroundPage: React.FC = () => {
  const { apiKey, models, modelsLoading } = useGroq();
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'studio'>('chat');
  const [model, setModel] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [codeLang, setCodeLang] = useState<'python' | 'curl' | 'js'>('python');
  const [copiedCode, setCopiedCode] = useState(false);
  const [temperature, setTemperature] = useState(1);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [reasoningEffort, setReasoningEffort] = useState('medium');
  const [stream, setStream] = useState(true);
  const [jsonMode, setJsonMode] = useState(false);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [liveTokensCount, setLiveTokensCount] = useState(0);
  const [liveSpeed, setLiveSpeed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number>(0);
  const firstTokenTimeRef = useRef<number>(0);

  // Auto-select first model when models load
  useEffect(() => {
    if (models.length > 0 && !model) {
      // Prefer a chat model
      const chatModels = models.filter(m =>
        m.id.includes('llama') || m.id.includes('gpt') || m.id.includes('qwen') || m.id.includes('deepseek') || m.id.includes('gemma') || m.id.includes('mixtral')
      );
      setModel(chatModels[0]?.id || models[0].id);
    }
  }, [models, model]);

  const handleStop = () => {
    abortRef.current?.abort();
    setIsGenerating(false);
  };

  const handleSubmit = useCallback(async (textOverride?: string) => {
    const prompt = (textOverride || userPrompt).trim();
    if (!prompt || isGenerating || !apiKey) return;

    setError(null);
    const newUserMsg: UIMessage = { role: 'user', content: prompt };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setUserPrompt('');
    setIsGenerating(true);
    setLiveTokensCount(0);
    setLiveSpeed(0);

    // Build API messages array
    const apiMessages: ChatMessage[] = [];
    if (systemPrompt.trim()) {
      apiMessages.push({ role: 'system', content: systemPrompt.trim() });
    }
    for (const m of newMessages) {
      apiMessages.push({ role: m.role, content: m.content });
    }

    // Add empty assistant slot
    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    startTimeRef.current = performance.now();
    firstTokenTimeRef.current = 0;
    let fullContent = '';
    let usageData: any = null;

    try {
      const gen = streamChatCompletion(apiKey, model, apiMessages, {
        temperature,
        max_completion_tokens: maxTokens,
        reasoning_effort: reasoningEffort,
        response_format: jsonMode ? { type: 'json_object' } : undefined,
      });

      for await (const event of gen) {
        if (event.type === 'delta') {
          if (!firstTokenTimeRef.current) {
            firstTokenTimeRef.current = performance.now();
          }
          fullContent += event.content;

          const elapsed = (performance.now() - startTimeRef.current) / 1000;
          const tokenEstimate = Math.ceil(fullContent.length / 3.8);
          setLiveTokensCount(tokenEstimate);
          setLiveSpeed(elapsed > 0 ? Math.round(tokenEstimate / elapsed) : 0);

          setMessages(prev => {
            const copy = [...prev];
            const last = copy[copy.length - 1];
            if (last?.role === 'assistant') {
              copy[copy.length - 1] = { ...last, content: fullContent };
            }
            return copy;
          });
        } else if (event.type === 'usage') {
          usageData = event.data;
        } else if (event.type === 'done') {
          break;
        }
      }

      // Finalize with real metrics
      const totalElapsed = (performance.now() - startTimeRef.current) / 1000;
      const ttft = firstTokenTimeRef.current
        ? (firstTokenTimeRef.current - startTimeRef.current) / 1000
        : 0;

      setMessages(prev => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last?.role === 'assistant') {
          copy[copy.length - 1] = {
            ...last,
            content: fullContent,
            metrics: {
              speed: usageData
                ? Math.round(usageData.completion_tokens / (usageData.completion_time || totalElapsed))
                : Math.round(Math.ceil(fullContent.length / 3.8) / totalElapsed),
              ttft: parseFloat(ttft.toFixed(3)),
              promptTokens: usageData?.prompt_tokens ?? 0,
              completionTokens: usageData?.completion_tokens ?? Math.ceil(fullContent.length / 3.8),
              totalTime: usageData?.total_time ?? parseFloat(totalElapsed.toFixed(3)),
            },
          };
        }
        return copy;
      });
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err.message || 'Stream failed');
      // Remove empty assistant if error
      setMessages(prev => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last?.role === 'assistant' && !last.content) copy.pop();
        return copy;
      });
    } finally {
      setIsGenerating(false);
    }
  }, [apiKey, model, messages, userPrompt, systemPrompt, temperature, maxTokens, reasoningEffort, jsonMode, isGenerating]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getCodeSnippet = () => {
    const lastUserMsg = userPrompt || messages.findLast(m => m.role === 'user')?.content || 'Hello!';
    if (codeLang === 'python') {
      return `from groq import Groq

client = Groq()
completion = client.chat.completions.create(
    model="${model}",
    messages=[
        ${systemPrompt ? `{"role": "system", "content": "${systemPrompt.replace(/"/g, '\\"')}"},\n        ` : ''}{"role": "user", "content": "${lastUserMsg.replace(/"/g, '\\"')}"}
    ],
    temperature=${temperature},
    max_completion_tokens=${maxTokens},
    stream=${stream ? 'True' : 'False'},
)

for chunk in completion:
    print(chunk.choices[0].delta.content or "", end="")`;
    }
    if (codeLang === 'curl') {
      return `curl "https://api.groq.com/openai/v1/chat/completions" \\
  -H "Authorization: Bearer $GROQ_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "messages": [
      ${systemPrompt ? `{"role": "system", "content": "${systemPrompt.replace(/"/g, '\\"')}"},` : ''}
      {"role": "user", "content": "${lastUserMsg.replace(/"/g, '\\"')}"}
    ],
    "temperature": ${temperature},
    "max_completion_tokens": ${maxTokens},
    "stream": ${stream}
  }'`;
    }
    return `import Groq from "groq-sdk";

const client = new Groq();
const completion = await client.chat.completions.create({
  model: "${model}",
  messages: [
    ${systemPrompt ? `{ role: "system", content: "${systemPrompt.replace(/"/g, '\\"')}" },\n    ` : ''}{ role: "user", content: "${lastUserMsg.replace(/"/g, '\\"')}" }
  ],
  temperature: ${temperature},
  max_completion_tokens: ${maxTokens},
  stream: ${stream},
});

for await (const chunk of completion) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      {/* Playground toolbar */}
      <div className="h-12 border-b border-[#eae8e4] dark:border-[#202533] px-4 sm:px-6 flex items-center justify-between shrink-0 bg-white/70 dark:bg-[#12151d]/70 backdrop-blur-sm relative z-10">
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm">Playground</span>
          <div className="flex bg-[#f3f1ec] dark:bg-[#1a1e29] p-0.5 rounded-lg text-xs font-medium">
            <button onClick={() => setActiveSubTab('chat')} className={`px-3 py-1 rounded-md transition-all ${activeSubTab === 'chat' ? 'bg-white dark:bg-[#252b3b] text-[#111] dark:text-white shadow-xs font-semibold' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>Chat</button>
            <button onClick={() => setActiveSubTab('studio')} className={`px-3 py-1 rounded-md transition-all ${activeSubTab === 'studio' ? 'bg-white dark:bg-[#252b3b] text-[#111] dark:text-white shadow-xs font-semibold' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>Studio</button>
          </div>
        </div>

        {/* Model selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select value={model} onChange={(e) => setModel(e.target.value)} className="appearance-none bg-white dark:bg-[#181c26] border border-gray-200 dark:border-gray-700 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium focus:outline-none focus:border-[#f55036] min-w-[200px]">
              {modelsLoading && <option>Loading models...</option>}
              {models.map((m) => (
                <option key={m.id} value={m.id}>{m.id} ({m.context_window ? `${(m.context_window / 1000).toFixed(0)}k ctx` : ''})</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setShowCode(!showCode)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${showCode ? 'bg-[#f55036]/10 border-[#f55036]/30 text-[#f55036]' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
            <Code className="w-3.5 h-3.5" />
            <span>{showCode ? 'Hide code' : 'View code'}</span>
          </button>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">Parameters</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* System prompt */}
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-800 p-3 bg-gray-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500 font-mono">SYSTEM</span>
                <span className="text-[10px] text-gray-400">Optional</span>
              </div>
              <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} placeholder="Enter system message (Optional)" rows={1} className="w-full bg-transparent text-xs placeholder-gray-400 focus:outline-none resize-none" />
            </div>

            {/* Messages */}
            {messages.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#f55036]/10 text-[#f55036] flex items-center justify-center"><Zap className="w-6 h-6 fill-[#f55036]" /></div>
                <div>
                  <h3 className="text-base font-bold">Connected to Groq LPU™</h3>
                  <p className="text-xs text-gray-500 max-w-md mt-1">Select a model, enter your prompt, and experience real ultra-low latency inference.</p>
                  <p className="text-[11px] text-emerald-500 font-semibold mt-2">{models.length} models available • Real API connected ✓</p>
                </div>
                <div className="flex flex-col gap-2 max-w-xl w-full pt-2">
                  <span className="text-[11px] font-medium text-gray-400 text-left">Try:</span>
                  {["Explain how Groq's LPU architecture achieves 800+ tokens/sec.", "Write a Python function to call the Groq API with async streaming.", "What makes Groq different from GPU-based inference providers?"].map((ex, i) => (
                    <button key={i} onClick={() => handleSubmit(ex)} className="text-left text-xs p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151923] hover:border-[#f55036]/40 transition-all groq-pop flex items-center justify-between">
                      <span className="truncate">{ex}</span>
                      <Send className="w-3 h-3 text-[#f55036] shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500 font-mono">{msg.role}</span>
                    {msg.metrics && (
                      <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        <Zap className="w-3 h-3 fill-current" />
                        <span>{msg.metrics.speed} tok/s</span>
                        <span>•</span>
                        <span>TTFT: {msg.metrics.ttft}s</span>
                        <span>•</span>
                        <span>{msg.metrics.completionTokens} tokens</span>
                        <span>•</span>
                        <span>{msg.metrics.totalTime.toFixed(2)}s total</span>
                      </div>
                    )}
                  </div>
                  <div className={`p-4 rounded-xl text-xs leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-white dark:bg-[#171b26] border border-gray-200 dark:border-gray-800' : 'bg-gray-50 dark:bg-[#141721] border border-gray-200 dark:border-gray-800/60'}`}>
                    {msg.content}
                    {isGenerating && idx === messages.length - 1 && msg.role === 'assistant' && (
                      <span className="inline-block w-2 h-4 ml-1 bg-[#f55036] animate-pulse align-middle" />
                    )}
                  </div>
                </div>
              ))
            )}

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="p-4 border-t border-[#eae8e4] dark:border-[#202533] bg-white dark:bg-[#12151d] space-y-3 relative z-10">
            <textarea value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleSubmit(); }} placeholder="Enter user message... (⌘+Enter to submit)" rows={2} className="w-full bg-gray-50 dark:bg-[#191d29] border border-gray-200 dark:border-gray-700/80 rounded-xl p-3 text-xs placeholder-gray-400 focus:outline-none focus:border-[#f55036] resize-none" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={() => { setMessages([]); setUserPrompt(''); setError(null); }} className="p-1.5 rounded-lg text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 text-xs flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" /><span>Clear</span></button>
              </div>
              {isGenerating && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#f55036] animate-pulse flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-[#f55036]" />
                    {liveSpeed} tok/s • {liveTokensCount} tokens
                  </span>
                  <button onClick={handleStop} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs font-medium hover:bg-red-500/20">
                    <StopCircle className="w-3.5 h-3.5" /><span>Stop</span>
                  </button>
                </div>
              )}
              <button disabled={isGenerating || !userPrompt.trim()} onClick={() => handleSubmit()} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all ${isGenerating || !userPrompt.trim() ? 'opacity-40 cursor-not-allowed bg-gray-200 dark:bg-gray-800 text-gray-500' : 'bg-[#f55036] hover:bg-[#e04229] text-white shadow-md shadow-[#f55036]/25 hover:scale-105 active:scale-95'}`}>
                <span>Submit</span>
                <span className="text-[10px] opacity-75 font-mono">⌘↵</span>
              </button>
            </div>
          </div>
        </div>

        {/* Code panel */}
        {showCode && (
          <div className="w-96 border-l border-[#eae8e4] dark:border-[#202533] bg-[#f9f8f5] dark:bg-[#10121a] flex flex-col shrink-0 animate-popIn">
            <div className="h-10 border-b border-[#eae8e4] dark:border-[#202533] px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(['python','curl','js'] as const).map(l => (
                  <button key={l} onClick={() => setCodeLang(l)} className={`text-xs font-medium px-2 py-0.5 rounded ${codeLang === l ? 'bg-black/10 dark:bg-white/10 text-black dark:text-white' : 'text-gray-400'}`}>{l === 'js' ? 'Node.js' : l === 'curl' ? 'cURL' : 'Python'}</button>
                ))}
              </div>
              <button onClick={handleCopyCode} className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-black dark:hover:text-white">
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex-1 p-4 overflow-auto font-mono text-[11px] leading-relaxed">
              <pre className="whitespace-pre-wrap select-all"><code>{getCodeSnippet()}</code></pre>
            </div>
          </div>
        )}

        {/* Parameters sidebar */}
        <div className="w-72 border-l border-[#eae8e4] dark:border-[#202533] bg-white dark:bg-[#12151d] p-5 space-y-6 overflow-y-auto shrink-0">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5"><label className="font-medium">Temperature</label><span className="font-mono text-gray-500">{temperature}</span></div>
            <input type="range" min="0" max="2" step="0.05" value={temperature} onChange={(e) => setTemperature(parseFloat(e.target.value))} className="w-full accent-[#f55036]" />
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5"><label className="font-medium">Max Completion Tokens</label><span className="font-mono text-gray-500">{maxTokens}</span></div>
            <input type="range" min="64" max="32768" step="64" value={maxTokens} onChange={(e) => setMaxTokens(parseInt(e.target.value))} className="w-full accent-[#f55036]" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Reasoning</label>
            <select value={reasoningEffort} onChange={(e) => setReasoningEffort(e.target.value)} className="w-full bg-gray-50 dark:bg-[#191d29] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs appearance-none focus:outline-none">
              <option value="low">low</option><option value="medium">medium</option><option value="high">high</option>
            </select>
          </div>
          <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">Stream</span>
              <button onClick={() => setStream(!stream)} className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${stream ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white dark:bg-black transition-transform ${stream ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">JSON Mode</span>
              <button onClick={() => setJsonMode(!jsonMode)} className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${jsonMode ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'}`}>
                <div className={`w-4 h-4 rounded-full bg-white dark:bg-black transition-transform ${jsonMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
          <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Custom function tools</span>
            <button className="w-full py-2 px-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5"><Plus className="w-3.5 h-3.5" /><span>Add Function</span></button>
          </div>
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">MCP Servers</span>
            <button className="w-full py-2 px-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5"><Plus className="w-3.5 h-3.5" /><span>Add MCP Server</span></button>
          </div>
        </div>
      </div>
    </div>
  );
};
