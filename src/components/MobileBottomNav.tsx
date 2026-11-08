import React from 'react';
import {
  Gamepad2,
  Terminal,
  Layers,
  Heart,
  Sparkles
} from 'lucide-react';
import { NavTab } from './Navbar';
import { soundManager } from '../utils/sound';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenApplication: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenApplication
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Главная', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'commands', label: 'Команды', icon: <Terminal className="w-4 h-4" /> },
    { id: 'plugins', label: 'Плагины', icon: <Layers className="w-4 h-4" /> },
    { id: 'donate', label: 'Донат', icon: <Heart className="w-4 h-4" /> },
    { id: 'game', label: 'Игра', icon: <span className="text-sm">🐸</span> }
  ];

  const handleTabClick = (tab: NavTab) => {
    soundManager.playClick();
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 border-t border-stone-800 backdrop-blur-lg px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-4px_25px_rgba(0,0,0,0.85)]">
      <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer min-h-[48px] active:scale-95 ${
                isActive
                  ? 'text-orange-400 bg-orange-950/40 border border-orange-500/30'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className={`transition-transform ${isActive ? 'scale-110 text-orange-400' : ''}`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-medium tracking-tight mt-1 ${isActive ? 'font-bold text-amber-300' : 'text-stone-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Quick Join CTA button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenApplication();
          }}
          className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-400 text-stone-950 min-h-[48px] shadow-sm cursor-pointer active:scale-95 transition-transform"
        >
          <Sparkles className="w-4 h-4 text-stone-950 animate-pulse" />
          <span className="text-[10px] font-['Unbounded'] font-black tracking-tight mt-0.5 text-stone-950">
            Заявка
          </span>
        </button>
      </div>
    </div>
  );
};
