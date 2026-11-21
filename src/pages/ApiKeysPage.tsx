import React, { useState } from 'react';
import { Key, Plus, Copy, Check, Trash2, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ApiKeysPage: React.FC = () => {
  const [keys, setKeys] = useState([
    {
      id: 'key_1',
      name: 'Default Groq SDK Key',
      key: 'gsk_5y8H91jKLmNoPqRsTuVwXyZaBcDeFgHiJkLmNoPqRsTuVwXyZa',
      created: 'Nov 12, 2026',
      lastUsed: 'Just now',
    },
    {
      id: 'key_2',
      name: 'Production Next.js Backend',
      key: 'gsk_9xL20kK39108aNmZpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUv',
      created: 'Nov 02, 2026',
      lastUsed: '2 hours ago',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return;
    const randomHex = Array.from({ length: 48 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newKey = {
      id: `key_${Date.now()}`,
      name: newKeyName.trim(),
      key: `gsk_${randomHex}`,
      created: 'Just now',
      lastUsed: 'Never',
    };
    setKeys([newKey, ...keys]);
    setNewKeyName('');
    setShowCreateModal(false);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    confetti({ particleCount: 20, spread: 40 });
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setKeys(keys.filter((k) => k.id !== id));
  };

  return (
    <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Key className="w-6 h-6 text-[#f55036]" />
            API Keys
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Manage your Groq API keys. Your API keys grant full access to inference and management endpoints. Keep them safe and never expose them in client-side code.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#f55036] hover:bg-[#e04229] text-white shadow-md shadow-[#f55036]/20 transition-all hover:scale-105 active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create API Key</span>
        </button>
      </div>

      {/* Keys List */}
      <div className="rounded-2xl bg-white dark:bg-[#141720] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 dark:bg-[#181c26] text-gray-500 border-b border-gray-200 dark:border-gray-800 font-mono text-[11px]">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Secret Key</th>
              <th className="p-4">Created</th>
              <th className="p-4">Last Used</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-sans">
            {keys.map((k) => (
              <tr key={k.id} className="hover:bg-gray-50/60 dark:hover:bg-white/[0.02] transition-colors">
                <td className="p-4 font-semibold text-gray-900 dark:text-white">
                  {k.name}
                </td>
                <td className="p-4 font-mono text-gray-600 dark:text-gray-300">
                  <span className="bg-gray-100 dark:bg-black/30 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-800 text-[11px]">
                    {k.key.slice(0, 7)}...{k.key.slice(-4)}
                  </span>
                </td>
                <td className="p-4 text-gray-500 text-[11px] font-mono">{k.created}</td>
                <td className="p-4 text-gray-500 text-[11px] font-mono">{k.lastUsed}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleCopy(k.id, k.key)}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 transition-colors"
                      title="Copy Key"
                    >
                      {copiedKeyId === k.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(k.id)}
                      className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete Key"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Security Tip */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Protect your API keys</span>
          <p className="mt-0.5 opacity-90">
            Never commit keys into public git repositories or client-side web bundles. Always use environment variables (<code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">GROQ_API_KEY</code>) on secure backend servers.
          </p>
        </div>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-popIn">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#151821] border border-gray-200 dark:border-gray-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New API Key</h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Key Name</label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Production Web App"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateKey();
                }}
                className="w-full bg-gray-50 dark:bg-[#181c26] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#f55036]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                disabled={!newKeyName.trim()}
                onClick={handleCreateKey}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#f55036] hover:bg-[#e04229] disabled:opacity-40 text-white shadow-md shadow-[#f55036]/25"
              >
                Generate Key
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

