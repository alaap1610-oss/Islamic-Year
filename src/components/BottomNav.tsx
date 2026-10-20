import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Grid, BookOpen, HeartHandshake, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const tabs = [
    { id: 'home', label: 'হোম', icon: Home },
    { id: 'tools', label: 'টুলস', icon: Grid },
    { id: 'quran', label: 'কুরআন', icon: BookOpen },
    { id: 'dua', label: 'দোয়া', icon: HeartHandshake },
    { id: 'more', label: 'অন্যান্য', icon: User }
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 px-2 py-1.5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-all select-none cursor-pointer ${
                isActive ? 'text-emerald-800' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div
                className={`flex items-center justify-center rounded-full transition-all ${
                  isActive
                    ? 'w-10 h-7 bg-emerald-100 text-emerald-800'
                    : 'w-7 h-7'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span
                className={`text-[10px] tracking-tight mt-0.5 ${
                  isActive ? 'font-bold text-emerald-900' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
