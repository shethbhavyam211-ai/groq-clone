import React, { useState } from 'react';
import { Zap, ChevronRight, FlaskConical, BookOpen, Users, Sparkles, Cpu, Check, Loader2 } from 'lucide-react';
import { MicroSlats } from '../components/MicroSlats';
import { useGroq } from '../context/GroqContext';
import confetti from 'canvas-confetti';

interface HomePageProps {
  onNavigate: (tab: string, meta?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { models, modelsLoading, modelsError } = useGroq();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [slatsHeroMode, setSlatsHeroMode] = useState(false);

  // Group models by capability
  const categorize = () => {
    const cats: Record<string, typeof models> = {};
    for (const m of models) {
      const id = m.id.toLowerCase();
      let cat = 'OTHER';
      if (id.includes('whisper')) cat = 'SPEECH TO TEXT';
      else if (id.includes('tts') || id.includes('orpheus')) cat = 'TEXT TO SPEECH';
      else if (id.includes('guard') || id.includes('safety')) cat = 'SAFETY / CONTENT MODERATION';
      else if (id.includes('vision') || id.includes('scout')) cat = 'VISION';
      else if (id.includes('tool') || id.includes('qwen')) cat = 'FUNCTION CALLING / TOOL USE';
      else cat = 'TEXT GENERATION / REASONING';

      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(m);
    }
    return cats;
  };

  const categories = categorize();

  return (
    <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-8 space-y-6 relative z-10">
      {/* Hero */}
      <div className="relative rounded-2xl bg-white dark:bg-[#141720] border border-[#e8e6e1] dark:border-[#222736] p-6 sm:p-8 shadow-sm overflow-hidden transition-all group">
        <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-auto ${slatsHeroMode ? 'opacity-100' : 'opacity-20 hover:opacity-40'}`}>
          <MicroSlats preset="swell" color="#f55036" glintColor="#ffffff" backgroundColor="transparent" slatWidth={8} slatHeight={22} gap={3} speed={0.8} interactive={true} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f55036]/10 dark:bg-[#f55036]/20 border border-[#f55036]/20 flex items-center justify-center shrink-0 shadow-sm groq-pop">
              <Zap className="w-6 h-6 text-[#f55036] fill-[#f55036]" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Build Fast on Groq</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#f55036]/10 text-[#f55036] border border-[#f55036]/20">LPU™ Powered</span>
              </div>
              <p className="text-sm text-[#5f6674] dark:text-[#97a0b3] mt-1.5 max-w-2xl leading-relaxed">
                Fast LLM inference, OpenAI-compatible. Simple to integrate, easy to scale.
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                {modelsLoading ? 'Loading models...' : `${models.length} models available via real API ✓`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <button onClick={() => setSlatsHeroMode(!slatsHeroMode)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-black/40 backdrop-blur hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>{slatsHeroMode ? 'Hide Slats' : 'Interactive Slats FX'}</span>
            </button>
            <button onClick={() => onNavigate('playground')} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#f55036] hover:bg-[#e04229] text-white shadow-md shadow-[#f55036]/20 transition-all hover:scale-105 active:scale-95">
              <span>Try in Playground</span><ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { id: 'playground', title: 'Playground', desc: 'Chat & play around with models', icon: FlaskConical },
          { id: 'docs', title: 'Docs', desc: 'Guides & how-to\'s', icon: BookOpen },
          { id: 'settings', title: 'Manage Team', desc: 'Add users, manage permissions', icon: Users, meta: { section: 'team' } },
        ].map((c) => (
          <div key={c.id} onClick={() => onNavigate(c.id, c.meta)} className="rounded-2xl bg-white dark:bg-[#141720] border border-[#e8e6e1] dark:border-[#222736] p-6 shadow-sm hover:shadow-md transition-all cursor-pointer groq-pop group">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800/80 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-[#f55036]/10 group-hover:text-[#f55036] transition-all">
              <c.icon className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">{c.title}</h3>
                <p className="text-xs text-[#717887] dark:text-[#848d9f] mt-1">{c.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 group-hover:text-[#f55036] transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* The Models — from real API */}
      <div className="rounded-2xl bg-white dark:bg-[#141720] border border-[#e8e6e1] dark:border-[#222736] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-1.5 cursor-pointer hover:text-[#f55036] group" onClick={() => onNavigate('docs', { section: 'models' })}>
            The Models <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-all" />
          </h2>
          {modelsLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </div>

        {/* Announcement */}
        <div className="rounded-xl bg-[#eef7ff] dark:bg-[#112338] border border-[#d2e8ff] dark:border-[#1d3b60] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0"><Sparkles className="w-4 h-4" /></div>
            <div>
              <span className="font-bold text-[#0c4a6e] dark:text-[#7dd3fc]">These are real models from the Groq API</span>
              <p className="text-[#38bdf8]/90 dark:text-gray-300 mt-0.5">Connected live. Click any model to open the Playground with it pre-selected.</p>
            </div>
          </div>
        </div>

        {modelsError && (
          <div className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg px-3 py-2">{modelsError}</div>
        )}

        {/* Model grid from real data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {Object.entries(categories).map(([cat, modelList]) => (
            <div key={cat} className="space-y-3">
              <div className="text-[11px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">{cat}</div>
              <div className="space-y-2">
                {modelList.map((m) => (
                  <div key={m.id} onClick={() => onNavigate('playground', { model: m.id })} className="p-3 rounded-xl bg-gray-50 dark:bg-[#181c26] hover:bg-white dark:hover:bg-[#202534] border border-gray-200/80 dark:border-[#262c3d] hover:border-[#f55036]/40 transition-all cursor-pointer flex items-center justify-between group groq-pop">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gray-200/60 dark:bg-gray-800 group-hover:bg-[#f55036]/10 group-hover:text-[#f55036] flex items-center justify-center transition-colors">
                        <Cpu className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold group-hover:text-[#f55036] transition-colors">{m.id}</div>
                        <div className="text-[10px] text-gray-500">by {m.owned_by}</div>
                      </div>
                    </div>
                    {m.context_window && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-300">
                        {(m.context_window / 1000).toFixed(0)}k ctx
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
          Showing {models.length} models from the live Groq API. Models update in real time.
        </div>
      </div>
    </div>
  );
};
