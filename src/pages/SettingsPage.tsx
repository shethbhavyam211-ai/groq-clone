import React, { useState } from 'react';
import { Copy, Check, QrCode, Sparkles, User, Shield, CreditCard, Users, Gauge, FileCode, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface SettingsPageProps {
  initialSection?: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ initialSection = 'organization' }) => {
  const [activeSub, setActiveSub] = useState(initialSection);
  const [orgName, setOrgName] = useState('Personal');
  const [name, setName] = useState('Bhavya M Sheth');
  const [email] = useState('shethbhavyam211@gmail.com');
  const [copiedOrg, setCopiedOrg] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [savedOrg, setSavedOrg] = useState(false);
  const [savedProfile, setSavedProfile] = useState(false);

  const orgId = 'org_01kvav4dhyeaabncj51a2zye10';

  const handleCopyOrgId = () => {
    navigator.clipboard.writeText(orgId);
    setCopiedOrg(true);
    confetti({ particleCount: 30, spread: 50 });
    setTimeout(() => setCopiedOrg(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] bg-[#fcfbf9] dark:bg-[#0d0f14] text-[#171920] dark:text-gray-200 overflow-hidden">
      
      {/* Settings Navigation Sidebar (Frame 021 match) */}
      <div className="w-56 border-r border-[#eae8e4] dark:border-[#202533] bg-[#f9f8f5] dark:bg-[#11141c] p-4 flex flex-col shrink-0 overflow-y-auto space-y-6 text-xs">
        
        {/* ORGANIZATION */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">
            ORGANIZATION
          </div>
          {[
            { id: 'organization', label: 'General' },
            { id: 'billing', label: 'Billing' },
            { id: 'team', label: 'Team' },
            { id: 'profile', label: 'Profile' },
            { id: 'limits', label: 'Limits' },
            { id: 'usage', label: 'Usage' },
            { id: 'terms', label: 'Model Terms' },
            { id: 'projects', label: 'Projects' },
            { id: 'controls', label: 'Data Controls' },
            { id: 'audit', label: 'Audit Logs' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSub(item.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                activeSub === item.id
                  ? 'text-[#f55036] font-semibold bg-[#f55036]/10'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* PROJECT */}
        <div className="space-y-1 pt-2 border-t border-gray-200 dark:border-gray-800">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">
            PROJECT
          </div>
          {[
            { id: 'proj-general', label: 'General' },
            { id: 'proj-limits', label: 'Limits' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSub(item.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                activeSub === item.id
                  ? 'text-[#f55036] font-semibold bg-[#f55036]/10'
                  : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>

      {/* Main Settings Content */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-10">
        
        {/* ORGANIZATION GENERAL (Frame 021 match) */}
        {activeSub === 'organization' && (
          <div className="max-w-xl space-y-8">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Organization</h1>

            {/* Organization Name */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200">
                Organization name
              </label>
              <p className="text-xs text-gray-500">
                This is the name of your organization. It is not unique in GroqCloud.
              </p>
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="flex-1 bg-white dark:bg-[#181c26] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#f55036]"
                />
                <button
                  onClick={() => {
                    setSavedOrg(true);
                    setTimeout(() => setSavedOrg(false), 2000);
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {savedOrg ? 'Saved!' : 'Save'}
                </button>
              </div>
            </div>

            {/* Organization ID */}
            <div className="space-y-2 pt-4">
              <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200">
                Organization ID
              </label>
              <p className="text-xs text-gray-500">
                Your organization ID is the unique identifier of your organization. It will be used in invoices and communications. You do not need to use it in any API calls.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 bg-gray-50 dark:bg-[#181c26] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs font-mono text-gray-700 dark:text-gray-300 select-all">
                  {orgId}
                </div>
                <button
                  onClick={handleCopyOrgId}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  title="Copy Org ID"
                >
                  {copiedOrg ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  title="QR code"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* PROFILE SECTION (Frame 024 match) */}
        {activeSub === 'profile' && (
          <div className="max-w-xl space-y-8">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h1>

            {/* Avatar */}
            <div>
              <div className="w-16 h-16 rounded-full bg-[#10b981] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                B
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200">
                Name
              </label>
              <p className="text-xs text-gray-500">
                The name associated with your account
              </p>
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-white dark:bg-[#181c26] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#f55036]"
                />
                <button
                  onClick={() => {
                    setSavedProfile(true);
                    setTimeout(() => setSavedProfile(false), 2000);
                  }}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {savedProfile ? 'Saved!' : 'Save'}
                </button>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200">
                Email
              </label>
              <p className="text-xs text-gray-500">
                The email associated with your account
              </p>
              <input
                type="email"
                disabled
                value={email}
                className="w-full bg-gray-100 dark:bg-[#141721] border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Developer News */}
            <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <label className="block text-xs font-semibold text-gray-800 dark:text-gray-200">
                Developer News
              </label>
              <p className="text-xs text-gray-500">
                Sign up for the latest product updates and app showcases
              </p>
              <button
                onClick={() => {
                  setSubscribed(!subscribed);
                  if (!subscribed) confetti({ particleCount: 30, spread: 50 });
                }}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  subscribed
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                    : 'bg-white dark:bg-[#181c26] border-gray-200 dark:border-gray-700 hover:bg-gray-50 text-gray-700 dark:text-gray-300'
                }`}
              >
                {subscribed ? 'Subscribed ✓' : 'Subscribe'}
              </button>
            </div>

          </div>
        )}

        {/* TEAM / OTHER SECTIONS */}
        {activeSub === 'team' && (
          <div className="max-w-xl space-y-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Team Management</h1>
            <p className="text-xs text-gray-500">Manage member permissions and roles for your organization.</p>
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white dark:bg-[#141720] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#10b981] text-white flex items-center justify-center font-bold text-xs">B</div>
                <div>
                  <div className="text-xs font-semibold">Bhavya M Sheth (You)</div>
                  <div className="text-[11px] text-gray-500">shethbhavyam211@gmail.com</div>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-[#f55036] bg-[#f55036]/10 px-2 py-0.5 rounded">Owner</span>
            </div>
          </div>
        )}

        {/* BILLING SECTION */}
        {activeSub === 'billing' && (
          <div className="max-w-xl space-y-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Billing & Payments</h1>
            <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#141720] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Current Plan:</span>
                <span className="font-semibold text-gray-900 dark:text-white">Free Developer Plan</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Total Billed:</span>
                <span className="font-semibold text-gray-900 dark:text-white">$0.00</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

