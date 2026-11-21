import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { DocsPage } from './pages/DocsPage';
import { DashboardPage } from './pages/DashboardPage';
import { ApiKeysPage } from './pages/ApiKeysPage';
import { SettingsPage } from './pages/SettingsPage';
import { MicroSlatsStudio } from './components/MicroSlatsStudio';
import { Sparkles, X } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [tabMeta, setTabMeta] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [showMicroSlatsModal, setShowMicroSlatsModal] = useState<boolean>(false);

  useEffect(() => {
    // Check system preference or localStorage
    const savedTheme = localStorage.getItem('groq-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('groq-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('groq-theme', 'light');
    }
  };

  const handleNavigate = (tab: string, meta?: any) => {
    setCurrentTab(tab);
    setTabMeta(meta || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-[#fcfbf9] dark:bg-[#0d0f14] text-[#171920] dark:text-gray-200 transition-colors`}>
      {/* Top Groq Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenMicroSlatsModal={() => setShowMicroSlatsModal(true)}
      />

      {/* Main Page Routing */}
      <main className="w-full">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenMicroSlatsModal={() => setShowMicroSlatsModal(true)}
          />
        )}

        {currentTab === 'playground' && (
          <PlaygroundPage initialModel={tabMeta?.model || 'openai/gpt-oss-120b'} />
        )}

        {currentTab === 'docs' && <DocsPage />}

        {currentTab === 'dashboard' && <DashboardPage />}

        {currentTab === 'keys' && <ApiKeysPage />}

        {currentTab === 'settings' && (
          <SettingsPage initialSection={tabMeta?.section || 'organization'} />
        )}
      </main>

      {/* Floating Micro Slats Quick Launch Button (Pops from bottom right) */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setShowMicroSlatsModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all groq-pop border border-purple-400/30"
        >
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
          <span>Micro Slats Studio</span>
        </button>
      </div>

      {/* Micro Slats Modal from Video 2 */}
      {showMicroSlatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto animate-popIn">
          <div className="relative w-full max-w-5xl my-8">
            <button
              onClick={() => setShowMicroSlatsModal(false)}
              className="absolute -top-3 -right-3 z-50 p-2 rounded-full bg-gray-900 border border-white/20 text-white hover:bg-gray-800 transition-all shadow-lg"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <MicroSlatsStudio onClose={() => setShowMicroSlatsModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

