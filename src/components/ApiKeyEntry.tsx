import React, { useState } from 'react';
import { Key, Zap, ExternalLink, AlertCircle, Eye, EyeOff, CheckCircle2, Sparkles } from 'lucide-react';
import { MicroSlats } from './MicroSlats';
import confetti from 'canvas-confetti';

interface ApiKeyEntryProps {
  onSubmit: (key: string) => void;
  error?: string | null;
}

export const ApiKeyEntry: React.FC<ApiKeyEntryProps> = ({ onSubmit, error }) => {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;
    setLoading(true);
    // Small delay for the visual effect
    await new Promise((r) => setTimeout(r, 300));
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.65 } });
    onSubmit(key.trim());
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-[#0b0c10]">
      {/* Full-page animated Micro Slats background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <MicroSlats
          preset="swell"
          color="#a855f7"
          glintColor="#ffffff"
          backgroundColor="#0b0c10"
          slatWidth={10}
          slatHeight={25}
          gap={4}
          speed={0.7}
          intensity={1.0}
          interactive={true}
        />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Entry Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="rounded-2xl bg-[#141720]/90 backdrop-blur-xl border border-white/10 shadow-2xl p-8 space-y-6">
          {/* Logo */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#f55036]/10 border border-[#f55036]/20 shadow-lg shadow-[#f55036]/10">
              <Zap className="w-7 h-7 text-[#f55036] fill-[#f55036]" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">
                gro<span className="text-[#f55036]">q</span>
                <span className="text-sm font-normal text-gray-400 ml-1.5">Console</span>
              </h1>
              <p className="text-xs text-gray-400 mt-1.5">
                Ultra-fast AI inference powered by LPU™ technology
              </p>
            </div>
          </div>

          {/* API Key Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Groq API Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                <input
                  type={showKey ? 'text' : 'password'}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="gsk_xxxxxxxxx..."
                  autoFocus
                  className="w-full bg-[#0d0f14] border border-white/10 hover:border-white/20 focus:border-[#f55036]/60 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#f55036]/30 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!key.trim() || loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#f55036] hover:bg-[#e04229] disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-[#f55036]/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap className="w-4 h-4 fill-white" />
              )}
              <span>{loading ? 'Connecting...' : 'Connect to Groq'}</span>
            </button>
          </form>

          {/* Help link */}
          <div className="text-center space-y-2 pt-2 border-t border-white/5">
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#f55036] transition-colors"
            >
              <span>Get your free API key at console.groq.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-[11px] text-gray-600">
              Your key is stored locally in your browser and never sent to any third-party server.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Sparkles, label: '800+ tok/s' },
              { icon: Zap, label: '<10ms TTFT' },
              { icon: CheckCircle2, label: 'OpenAI compat' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="text-center py-2 rounded-lg bg-white/[0.03] border border-white/5">
                <Icon className="w-4 h-4 mx-auto text-purple-400 mb-1" />
                <span className="text-[10px] text-gray-400 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

