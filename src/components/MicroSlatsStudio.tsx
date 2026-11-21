import React, { useState } from 'react';
import { MicroSlats, MicroSlatsProps } from './MicroSlats';
import { Eye, Code, Copy, Check, RotateCcw, Sparkles, Share2, Heart, Sliders, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

export const MicroSlatsStudio: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [preset, setPreset] = useState<MicroSlatsProps['preset']>('swell');
  const [color, setColor] = useState('#a855f7');
  const [glintColor, setGlintColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#120f17');
  const [slatWidth, setSlatWidth] = useState(10);
  const [slatHeight, setSlatHeight] = useState(25);
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  const presets = [
    { id: 'swell', name: 'Swell' },
    { id: 'wave', name: 'Rolling Wave' },
    { id: 'pulse', name: 'Radial Pulse' },
    { id: 'vortex', name: 'Vortex' },
    { id: 'ripple', name: 'Calm Ripple' },
  ];

  const colorThemes = [
    { label: 'Cyber Violet', color: '#a855f7', bg: '#120f17' },
    { label: 'Groq Speed Orange', color: '#f55036', bg: '#15100f' },
    { label: 'Electric Emerald', color: '#10b981', bg: '#0b1612' },
    { label: 'Hyper Cyan', color: '#06b6d4', bg: '#0a1518' },
    { label: 'Mono Platinum', color: '#9ca3af', bg: '#111215' },
  ];

  const codeSnippet = `<MicroSlats
  preset="${preset}"
  color="${color}"
  glintColor="${glintColor}"
  backgroundColor="${backgroundColor}"
  slatWidth={${slatWidth}}
  slatHeight={${slatHeight}}
  interactive={true}
/>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: [color, '#f55036', '#ffffff']
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0b0c10] text-white rounded-2xl border border-white/10 overflow-hidden shadow-2xl transition-all">
      {/* Studio Header Bar */}
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Micro Slats
              <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                21st.dev Component
              </span>
            </h2>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            A wall of tiny slats that becomes a rolling sea in perspective, with glinting crests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Preview / Code switcher */}
          <div className="flex bg-[#181a20] p-1 rounded-lg border border-white/10 text-xs font-medium">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'preview'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'code'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Code
            </button>
          </div>

          <button
            onClick={() => setLiked(!liked)}
            className={`p-2 rounded-lg border border-white/10 hover:bg-white/10 transition-all ${
              liked ? 'text-red-500 fill-red-500' : 'text-gray-400'
            }`}
            title="Favorite component"
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/15 transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy for AI'}
          </button>
        </div>
      </div>

      {/* Main Canvas / Code Area */}
      <div className="relative h-[420px] w-full overflow-hidden flex items-center justify-center bg-[#120f17]">
        {activeTab === 'preview' ? (
          <>
            <MicroSlats
              preset={preset}
              color={color}
              glintColor={glintColor}
              backgroundColor={backgroundColor}
              slatWidth={slatWidth}
              slatHeight={slatHeight}
              interactive={true}
            />

            {/* Hint overlay */}
            <div className="absolute top-4 left-4 pointer-events-none">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-gray-300 border border-white/10">
                Move cursor over grid to warp wave crests & trigger glints
              </span>
            </div>

            {/* Quick reset button */}
            <button
              onClick={() => {
                setPreset('swell');
                setColor('#a855f7');
                setGlintColor('#ffffff');
                setBackgroundColor('#120f17');
                setSlatWidth(10);
                setSlatHeight(25);
              }}
              className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 hover:bg-black/70 backdrop-blur-md text-gray-300 hover:text-white border border-white/10 transition-all"
              title="Reset Settings"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full h-full p-6 bg-[#0e1015] overflow-auto font-mono text-xs text-gray-200">
            <pre className="p-4 rounded-xl bg-black/50 border border-white/10">
              <code>{codeSnippet}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Customize Control Bar (Exact match to video 2) */}
      <div className="p-5 bg-[#0f1117] border-t border-white/10">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            Customize Controls
          </span>
          <span className="text-[11px] text-gray-500 lowercase">Open in BG Studio</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
          {/* Preset */}
          <div>
            <label className="text-gray-400 block mb-1 text-[11px]">Preset</label>
            <div className="relative">
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value as any)}
                className="w-full bg-[#181a22] text-white border border-white/10 rounded-lg px-2.5 py-1.5 text-xs appearance-none focus:outline-none focus:border-purple-500"
              >
                {presets.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#181a22]">
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-gray-400 block mb-1 text-[11px]">Color</label>
            <div className="flex items-center gap-1.5 bg-[#181a22] px-2 py-1 rounded-lg border border-white/10">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="font-mono text-[11px] text-gray-300 uppercase">{color}</span>
            </div>
          </div>

          {/* Glint Color */}
          <div>
            <label className="text-gray-400 block mb-1 text-[11px]">Glint Color</label>
            <div className="flex items-center gap-1.5 bg-[#181a22] px-2 py-1 rounded-lg border border-white/10">
              <input
                type="color"
                value={glintColor}
                onChange={(e) => setGlintColor(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="font-mono text-[11px] text-gray-300 uppercase">{glintColor}</span>
            </div>
          </div>

          {/* Background */}
          <div>
            <label className="text-gray-400 block mb-1 text-[11px]">Background</label>
            <div className="flex items-center gap-1.5 bg-[#181a22] px-2 py-1 rounded-lg border border-white/10">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
              />
              <span className="font-mono text-[11px] text-gray-300 uppercase">{backgroundColor}</span>
            </div>
          </div>

          {/* Slat Width */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-gray-400 text-[11px]">Slat Width</label>
              <span className="font-mono text-[11px] text-purple-400">{slatWidth}px</span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              value={slatWidth}
              onChange={(e) => setSlatWidth(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Slat Height */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-gray-400 text-[11px]">Slat Height</label>
              <span className="font-mono text-[11px] text-purple-400">{slatHeight}px</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={slatHeight}
              onChange={(e) => setSlatHeight(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Quick color preset chips */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-gray-400">Palettes:</span>
          {colorThemes.map((theme) => (
            <button
              key={theme.label}
              onClick={() => {
                setColor(theme.color);
                setBackgroundColor(theme.bg);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#181a22] hover:bg-white/10 border border-white/5 text-[11px] text-gray-300 transition-all"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.color }}></span>
              {theme.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

