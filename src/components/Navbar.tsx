import React, { useState } from 'react';
import { ChevronDown, Settings, Sparkles, Moon, Sun, Check, ExternalLink, Key, LayoutDashboard, Terminal, BookOpen, Layers } from 'lucide-react';

export interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenMicroSlatsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
  onToggleDarkMode,
  onOpenMicroSlatsModal,
}) => {
  const [showOrgDropdown, setShowOrgDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Layers, hidden: true },
    { id: 'playground', label: 'Playground', icon: Terminal },
    { id: 'keys', label: 'API Keys', icon: Key },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'docs', label: 'Docs', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#eae8e4] dark:border-[#202533] bg-[#fcfbf9]/90 dark:bg-[#0d0f14]/90 backdrop-blur-md transition-colors">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Left Section: Logo & Organization Switcher */}
        <div className="flex items-center gap-3">
          {/* Groq Logo */}
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-1 group focus:outline-none"
          >
            <span className="font-sans font-black text-2xl tracking-tighter text-[#14151a] dark:text-white group-hover:text-[#f55036] transition-colors">
              gro<span className="text-[#f55036]">q</span>
            </span>
          </button>

          {/* Org & Project Selector */}
          <div className="relative">
            <div className="flex items-center gap-1.5 text-xs text-[#5e6573] dark:text-[#8e97a8] pl-2 border-l border-gray-300 dark:border-gray-700">
              <button
                onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                className="flex items-center gap-1 hover:text-[#111] dark:hover:text-white px-1.5 py-1 rounded transition-colors"
              >
                <span className="font-medium text-[#1c1d22] dark:text-gray-200">Personal</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <button
                onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                className="flex items-center gap-1 hover:text-[#111] dark:hover:text-white px-1.5 py-1 rounded transition-colors"
              >
                <span className="text-gray-600 dark:text-gray-300">Default Project</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
            </div>

            {/* Org Dropdown */}
            {showOrgDropdown && (
              <div className="absolute left-0 top-8 mt-1 w-60 rounded-xl bg-white dark:bg-[#151821] border border-gray-200 dark:border-gray-800 shadow-xl py-2 z-50 animate-popIn">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Organization
                </div>
                <div className="px-3 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer">
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200">Personal (org_01kvav4dhye...)</span>
                  <Check className="w-3.5 h-3.5 text-[#f55036]" />
                </div>
                <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
                <button
                  onClick={() => {
                    onSelectTab('settings');
                    setShowOrgDropdown(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  Organization Settings
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center/Right Section: Nav Links & Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Main Navigation Links */}
          <nav className="flex items-center gap-0.5 sm:gap-1 mr-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'text-[#f55036] font-semibold bg-[#f55036]/10'
                      : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Micro Slats Showcase Pop Button */}
          <button
            onClick={onOpenMicroSlatsModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-600/15 to-pink-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-semibold hover:shadow-md hover:scale-105 active:scale-95 transition-all group"
            title="Open Micro Slats interactive animation studio"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500 group-hover:rotate-12 transition-transform" />
            <span className="hidden md:inline">Micro Slats</span>
          </button>

          {/* Dark / Light Mode Switcher */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Settings gear icon */}
          <button
            onClick={() => onSelectTab('settings')}
            className={`p-2 rounded-lg text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
              currentTab === 'settings' ? 'text-[#f55036] bg-[#f55036]/10' : ''
            }`}
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile Avatar (Green 'B' circle as in video 1) */}
          <div className="relative ml-1">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-7 h-7 rounded-full bg-[#10b981] hover:bg-[#059669] text-white flex items-center justify-center font-bold text-xs shadow-sm transition-transform active:scale-95 focus:outline-none"
              title="Bhavya M Sheth"
            >
              B
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 top-9 mt-1 w-56 rounded-xl bg-white dark:bg-[#151821] border border-gray-200 dark:border-gray-800 shadow-2xl py-2 z-50 animate-popIn">
                <div className="px-3.5 py-2 border-b border-gray-100 dark:border-gray-800">
                  <div className="text-xs font-semibold text-gray-900 dark:text-white">Bhavya M Sheth</div>
                  <div className="text-[11px] text-gray-500 truncate">shethbhavyam211@gmail.com</div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      onSelectTab('settings');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  >
                    Account Settings
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab('keys');
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  >
                    API Keys
                  </button>
                  <button
                    onClick={() => {
                      onOpenMicroSlatsModal();
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-3.5 py-1.5 text-xs text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 flex items-center justify-between"
                  >
                    <span>Micro Slats Studio</span>
                    <Sparkles className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

