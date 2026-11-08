import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Calendar,
  RefreshCw,
  BookOpen,
  Volume2,
  VolumeX,
  Lock,
  Menu,
  X,
  Gamepad2,
  ShieldCheck,
  Terminal,
  Heart
} from 'lucide-react';
import { soundManager } from '../utils/sound';
import { SERVER_VERSION } from '../data/serverState';

export type NavTab = 'home' | 'commands' | 'plugins' | 'events' | 'updates' | 'rules' | 'donate' | 'game';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenApplication: () => void;
  onOpenAdmin: () => void;
  isAdmin: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenApplication,
  onOpenAdmin,
  isAdmin
}) => {
  const [soundOn, setSoundOn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    soundManager.enabled = nextState;
    if (nextState) soundManager.playClick();
  };

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Главная', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'commands', label: 'Команды', icon: <Terminal className="w-4 h-4" /> },
    { id: 'plugins', label: 'Плагины', icon: <Layers className="w-4 h-4" />, badge: '15' },
    { id: 'donate', label: 'Донат', icon: <Heart className="w-4 h-4" /> },
    { id: 'game', label: 'Лягушка', icon: <span className="text-sm">🐸</span>, badge: 'Приз' },
    { id: 'events', label: 'Ивенты', icon: <Calendar className="w-4 h-4" /> },
    { id: 'updates', label: 'Обновления', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'rules', label: 'Правила', icon: <BookOpen className="w-4 h-4" /> },
  ];

  const handleTabClick = (id: NavTab) => {
    soundManager.playClick();
    onSelectTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/80 backdrop-blur-md border-b border-orange-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo brand */}
          <button
            onClick={() => handleTabClick('home')}
            className="flex items-center gap-3 group text-left transition-transform hover:scale-105"
          >
            <div className="relative w-10 h-10 rounded-sm bg-gradient-to-br from-amber-600 via-orange-600 to-amber-900 p-0.5 border border-orange-400/50 shadow-[0_0_12px_rgba(249,115,22,0.4)] flex items-center justify-center">
              <span className="text-xl">🍂</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Unbounded'] font-black tracking-wider text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-orange-500">
                  AUTUMN
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs bg-orange-950 border border-orange-500/40 text-amber-300">
                  v{SERVER_VERSION}
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-mono hidden sm:block">
                Ламповый ванильный SMP
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 p-1 rounded-lg bg-stone-900/60 border border-stone-800">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)] font-semibold scale-102'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/80 hover:scale-102'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                        active
                          ? 'bg-orange-900/80 text-amber-200 border-amber-300/40'
                          : 'bg-orange-950/60 text-amber-400 border-orange-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions (Sound, Admin, Join CTA) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              title={soundOn ? 'Выключить звуки кликов' : 'Включить звуки кликов'}
              className="min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-2 rounded-lg bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-400 hover:text-orange-400 transition-all flex items-center justify-center cursor-pointer active:scale-95"
              aria-label="Переключить звук"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-orange-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Admin entry button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenAdmin();
              }}
              title={isAdmin ? 'Панель администратора (активна)' : 'Вход для администратора'}
              className={`min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                isAdmin
                  ? 'bg-amber-950/70 border-amber-500/60 text-amber-300'
                  : 'bg-stone-900/80 border-stone-800 text-stone-400 hover:text-amber-300'
              }`}
              aria-label="Вход для администратора"
            >
              {isAdmin ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4" />}
              <span className="hidden md:inline">{isAdmin ? 'Админ' : 'Вход'}</span>
            </button>

            {/* Join Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenApplication();
              }}
              className="min-h-[40px] sm:min-h-[44px] flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg font-['Unbounded'] font-bold text-xs sm:text-sm text-stone-950 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 hover:from-orange-400 hover:to-amber-300 border border-amber-300/40 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-stone-950 shrink-0" />
              <span className="hidden xs:inline sm:inline">Подать заявку</span>
              <span className="xs:hidden sm:hidden">Заявка</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => {
                soundManager.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden min-w-[40px] min-h-[40px] p-2 rounded-lg bg-stone-900 text-stone-300 hover:text-white border border-stone-800 flex items-center justify-center cursor-pointer"
              aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-stone-800/80 flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`min-h-[44px] flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  currentTab === item.id
                    ? 'bg-orange-600 text-white font-semibold'
                    : 'text-stone-300 hover:bg-stone-900 active:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-950 text-amber-300 border border-orange-500/40">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}

            {/* Mobile Drawer CTA & Admin shortcuts */}
            <div className="pt-2 mt-2 border-t border-stone-800/70 flex flex-col gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setMobileMenuOpen(false);
                  onOpenApplication();
                }}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl font-['Unbounded'] font-bold text-xs text-stone-950 bg-gradient-to-r from-orange-500 to-amber-400 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                <span>Заполнить анкету на сервер</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full min-h-[44px] py-2 px-4 rounded-xl text-xs font-mono text-stone-400 hover:text-amber-300 bg-stone-900 border border-stone-800 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-stone-400" />
                <span>Вход для администратора</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
