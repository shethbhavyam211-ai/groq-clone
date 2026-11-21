import React, { useState } from 'react';
import { 
  BarChart3, 
  RotateCcw, 
  ChevronDown, 
  FileText, 
  Zap, 
  Layers, 
  Download, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Clock,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'usage' | 'logs' | 'batch'>('metrics');
  const [showLimits, setShowLimits] = useState(true);
  const [timeRange, setTimeRange] = useState('Last 30 minutes');
  const [selectedModel, setSelectedModel] = useState('Show all Models');
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mockLogs = [
    { id: 'req_01jf89201', time: '1:39:42 pm', model: 'openai/gpt-oss-120b', status: 200, latency: '42ms', promptTok: 42, compTok: 284, tps: '812 t/s' },
    { id: 'req_01jf89198', time: '1:38:15 pm', model: 'llama-3.3-70b-versatile', status: 200, latency: '65ms', promptTok: 120, compTok: 450, tps: '780 t/s' },
    { id: 'req_01jf89145', time: '1:32:04 pm', model: 'openai/gpt-oss-20b', status: 200, latency: '28ms', promptTok: 18, compTok: 95, tps: '920 t/s' },
    { id: 'req_01jf89088', time: '1:27:10 pm', model: 'qwen-3.8-27b', status: 200, latency: '51ms', promptTok: 64, compTok: 320, tps: '640 t/s' },
    { id: 'req_01jf89012', time: '1:22:45 pm', model: 'openai/gpt-oss-120b', status: 429, latency: '12ms', promptTok: 0, compTok: 0, tps: '0 t/s', error: 'Rate limit exceeded' },
    { id: 'req_01jf88950', time: '1:17:33 pm', model: 'allam-2-7b', status: 200, latency: '35ms', promptTok: 50, compTok: 180, tps: '710 t/s' },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] bg-[#fcfbf9] dark:bg-[#0d0f14] text-[#171920] dark:text-gray-200 overflow-hidden">
      
      {/* Left Subnav Sidebar (Metrics, Usage, Logs, Batch) */}
      <div className="w-48 border-r border-[#eae8e4] dark:border-[#202533] bg-[#f9f8f5] dark:bg-[#11141c] p-4 flex flex-col shrink-0">
        <div className="space-y-1 text-xs font-medium">
          {[
            { id: 'metrics', label: 'Metrics' },
            { id: 'usage', label: 'Usage' },
            { id: 'logs', label: 'Logs' },
            { id: 'batch', label: 'Batch' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'text-[#f55036] font-semibold bg-[#f55036]/10'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
        
        {/* VIEW 1: METRICS */}
        {activeTab === 'metrics' && (
          <div className="space-y-6 max-w-5xl">
            
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Metrics</h1>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                {/* Show Limits toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Show Limits</span>
                  <button
                    onClick={() => setShowLimits(!showLimits)}
                    className={`w-8 h-4 rounded-full transition-colors relative p-0.5 ${
                      showLimits ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white dark:bg-black transition-transform ${
                        showLimits ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Refresh */}
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>

                {/* Time range */}
                <div className="relative">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="appearance-none bg-white dark:bg-[#181c26] border border-gray-200 dark:border-gray-700 rounded-lg pl-2.5 pr-7 py-1.5 text-xs text-gray-800 dark:text-gray-200 focus:outline-none"
                  >
                    <option>Last 30 minutes</option>
                    <option>Last 1 hour</option>
                    <option>Last 24 hours</option>
                    <option>Last 7 days</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                </div>

                {/* Model filter */}
                <div className="relative">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="appearance-none bg-white dark:bg-[#181c26] border border-gray-200 dark:border-gray-700 rounded-lg pl-2.5 pr-7 py-1.5 text-xs text-gray-800 dark:text-gray-200 focus:outline-none"
                  >
                    <option>Show all Models</option>
                    <option>openai/gpt-oss-120b</option>
                    <option>llama-3.3-70b-versatile</option>
                    <option>allam-2-7b</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* HTTP Status Codes Chart (Frame 013) */}
            <div className="rounded-2xl bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">HTTP Status Codes</h3>
                  <span className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-700 text-[9px] flex items-center justify-center text-gray-400">?</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span className="text-gray-600 dark:text-gray-300">HTTP 200</span>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="h-44 w-full relative pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 800 150" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="800" y2="30" stroke="currentColor" strokeOpacity="0.08" />
                  <line x1="0" y1="75" x2="800" y2="75" stroke="currentColor" strokeOpacity="0.08" />
                  <line x1="0" y1="120" x2="800" y2="120" stroke="currentColor" strokeOpacity="0.08" />

                  {/* HTTP 200 Line Path */}
                  <path
                    d="M 0,140 L 50,110 L 100,110 L 150,30 L 200,30 L 250,140 L 300,90 L 350,90 L 400,140 L 450,90 L 500,140 L 600,140 L 700,140 L 800,140"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                  />
                  {/* Fill gradient below path */}
                  <path
                    d="M 0,140 L 50,110 L 100,110 L 150,30 L 200,30 L 250,140 L 300,90 L 350,90 L 400,140 L 450,90 L 500,140 L 600,140 L 700,140 L 800,140 L 800,150 L 0,150 Z"
                    fill="url(#cyanGradient)"
                    opacity="0.12"
                  />
                  <defs>
                    <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* X axis labels */}
                <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-2">
                  <span>1:10pm</span>
                  <span>1:17pm</span>
                  <span>1:25pm</span>
                  <span>1:33pm</span>
                  <span>1:40pm</span>
                </div>
              </div>
            </div>

            {/* Model Breakdown: openai/gpt-oss-120b (Frame 014) */}
            <div className="rounded-2xl bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">openai/gpt-oss-120b</h3>
                <span className="text-xs text-gray-500 font-mono">128k context</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Requests graph */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Requests</span>
                    {showLimits && <span className="text-[10px] text-red-500 font-mono">Rate Limit: 25 req/min</span>}
                  </div>
                  <div className="h-32 w-full relative bg-gray-50 dark:bg-black/20 rounded-xl p-3 flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                      {showLimits && (
                        <line x1="0" y1="65" x2="300" y2="65" stroke="#ef4444" strokeDasharray="3 3" strokeWidth="1.5" />
                      )}
                      <path
                        d="M 0,95 L 80,95 L 120,40 L 140,20 L 160,80 L 190,95 L 300,95"
                        fill="none"
                        stroke="#f55036"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                {/* Total Tokens graph */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Total Tokens</span>
                    {showLimits && <span className="text-[10px] text-red-500 font-mono">Rate Limit: 10K tok/min</span>}
                  </div>
                  <div className="h-32 w-full relative bg-gray-50 dark:bg-black/20 rounded-xl p-3 flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                      {showLimits && (
                        <line x1="0" y1="80" x2="300" y2="80" stroke="#ef4444" strokeDasharray="3 3" strokeWidth="1.5" />
                      )}
                      <path
                        d="M 0,95 L 60,95 L 110,25 L 130,10 L 150,70 L 180,95 L 300,95"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Tokens legend (Frame 014) */}
              <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Cached Input Tokens</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-500" /> Uncached Input Tokens</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#f55036]" /> Output Tokens</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> Total Processed Tokens</span>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 2: LOGS (Frame 016) */}
        {activeTab === 'logs' && (
          <div className="space-y-4 max-w-5xl">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Logs</h1>

              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 dark:text-gray-400">Show Errors Only</span>
                  <button
                    onClick={() => setShowErrorsOnly(!showErrorsOnly)}
                    className={`w-8 h-4 rounded-full transition-colors relative p-0.5 ${
                      showErrorsOnly ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-700'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white transition-transform ${
                        showErrorsOnly ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Logs Table */}
            <div className="rounded-2xl bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-[#181c26] text-gray-500 border-b border-gray-200 dark:border-gray-800 font-mono text-[11px]">
                  <tr>
                    <th className="p-3">Request ID</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Model</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Latency</th>
                    <th className="p-3">Tokens</th>
                    <th className="p-3 text-right">Throughput</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-mono text-xs">
                  {mockLogs
                    .filter((l) => (showErrorsOnly ? l.status !== 200 : true))
                    .map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/80 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="p-3 font-semibold text-gray-800 dark:text-gray-200">{log.id}</td>
                        <td className="p-3 text-gray-500">{log.time}</td>
                        <td className="p-3 text-gray-700 dark:text-gray-300 font-sans">{log.model}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              log.status === 200
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">{log.latency}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">{log.compTok} tokens</td>
                        <td className="p-3 text-right font-semibold text-[#f55036]">{log.tps}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: BATCH (Frame 018) */}
        {activeTab === 'batch' && (
          <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Batch</h1>
              <p className="text-xs text-gray-500 leading-relaxed max-w-lg mx-auto">
                Create large batches of API requests for asynchronous processing. The Batch API returns completions within 24 hours to 7 days for a 50% discount.
              </p>
            </div>

            <div className="py-6 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#f55036]/10 text-[#f55036] flex items-center justify-center shadow-lg shadow-[#f55036]/10">
                <Zap className="w-8 h-8 fill-[#f55036]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Enable Batch Processing
                </h3>
                <p className="text-xs text-gray-500 max-w-md mt-1.5 leading-relaxed">
                  Batch processing allows you to run multiple requests efficiently. Upgrade your plan to unlock this powerful feature.
                </p>
              </div>

              <button
                onClick={() => {
                  confetti({ particleCount: 50, spread: 60 });
                }}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#f55036] hover:bg-[#e04229] text-white shadow-lg shadow-[#f55036]/25 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Upgrade</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: USAGE */}
        {activeTab === 'usage' && (
          <div className="space-y-4 max-w-5xl">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Usage Summary</h1>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800 space-y-4">
              <div className="text-sm font-semibold">Total tokens billed this billing cycle</div>
              <div className="text-3xl font-black text-[#f55036]">248,812 / ∞</div>
              <p className="text-xs text-gray-500">Current tier: Free Tier (Up to 14,400 requests/day)</p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

