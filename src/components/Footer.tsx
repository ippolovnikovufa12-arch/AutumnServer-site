import React from 'react';
import { ExternalLink, Heart, ArrowUp } from 'lucide-react';
import { DISCORD_INVITE_URL, SERVER_VERSION } from '../data/serverState';
import { soundManager } from '../utils/sound';

interface FooterProps {
  onOpenApplication: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApplication, onOpenAdmin }) => {
  const scrollToTop = () => {
    soundManager.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-16 sm:mt-20 border-t border-orange-500/20 bg-stone-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍂</span>
              <span className="font-['Unbounded'] font-black text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
                AUTUMN SERVER
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-950 text-amber-300 border border-orange-500/40">
                v{SERVER_VERSION}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md leading-relaxed">
              Ламповый полу-ванильный сервер Minecraft 26.2, разрабатываемый двумя энтузиастами уже 2 месяца. 
              15 авторских плагинов, живая экономика, защита построек и дружное сообщество.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-300/80 font-mono">
              <Heart className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
              <span>Создано игроками для игроков. Ждём вас в нашей осени!</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="font-['Unbounded'] font-bold text-xs uppercase tracking-wider text-orange-400">
              Ссылки
            </h4>
            <ul className="space-y-1 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenApplication();
                  }}
                  className="min-h-[38px] flex items-center hover:text-orange-300 transition-colors cursor-pointer"
                >
                  Подать заявку на сервер
                </button>
              </li>
              <li>
                <a
                  href={DISCORD_INVITE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[38px] flex items-center hover:text-orange-300 transition-colors gap-1.5"
                >
                  <span>Наш Discord сервер</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenAdmin();
                  }}
                  className="min-h-[38px] flex items-center hover:text-orange-300 transition-colors cursor-pointer"
                >
                  Вход для администратора
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-500">
          <div>
            © {new Date().getFullYear()} AUTUMN Minecraft SMP. Не связано с Mojang Studios или Microsoft.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-stone-400 hover:text-orange-400 transition-colors cursor-pointer"
          >
            <span>Наверх</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
