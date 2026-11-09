import React from 'react';
import {
  Sparkles,
  Users,
  Compass,
  Cpu,
  HeartHandshake,
  Bot,
  Wand2,
  Mic,
  Shield,
  ArrowRight,
  Flame,
  CheckCircle2,
  CalendarDays,
  FileText,
  Gamepad2
} from 'lucide-react';
import { AutumnLogo3D } from './AutumnLogo3D';
import { soundManager } from '../utils/sound';
import { SERVER_VERSION } from '../data/serverState';

interface HomeTabProps {
  onOpenApplication: () => void;
  onNavigateToPlugins: () => void;
  onNavigateToRules: () => void;
  onNavigateToEvents: () => void;
  onNavigateToCommands?: () => void;
  onNavigateToDonate?: () => void;
  onNavigateToGame?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onOpenApplication,
  onNavigateToPlugins,
  onNavigateToRules,
  onNavigateToEvents,
  onNavigateToCommands,
  onNavigateToDonate,
  onNavigateToGame
}) => {
  return (
    <div className="relative space-y-12 pb-16">
      
      {/* Hero Section with 3D Logo */}
      <section className="relative pt-4 sm:pt-8 flex flex-col items-center text-center">
        <AutumnLogo3D />

        {/* Story Plate: 2 months, 2 founders, appeal for active players */}
        <div className="mt-4 sm:mt-5 max-w-2xl mx-auto px-2 sm:px-4 w-full">
          <div className="relative p-4 sm:p-7 rounded-2xl bg-stone-900/40 border border-stone-800/80 backdrop-blur-md">
            
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-md bg-stone-800/80 text-amber-300 text-[11px] sm:text-xs font-mono font-medium mb-3">
              <CalendarDays className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>Проекту 2 месяца • Создан двумя людьми</span>
            </div>

            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-stone-100 font-['Unbounded'] leading-snug">
              Уютный мир, созданный с душой. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Ждём новых активных игроков!
              </span>
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl mx-auto">
              Сервер <strong className="text-orange-400 font-semibold">AUTUMN</strong> разрабатывается всего двумя людьми уже 2 месяца. 
              Мы написали <strong className="text-amber-300">15 самописных плагинов</strong> на версии <strong className="text-orange-400">{SERVER_VERSION}</strong> и 
              ждём новых активных игроков, которые помогут не умереть данному проекту.
            </p>

            {/* Main CTA Join Button */}
            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onOpenApplication();
                }}
                className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-xl font-['Unbounded'] font-bold text-xs sm:text-sm text-stone-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 shadow-sm border border-amber-300/40 transition-all duration-200 hover:scale-102 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-stone-950" />
                <span>Присоединиться к проекту</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onNavigateToRules();
                }}
                className="w-full sm:w-auto min-h-[44px] px-5 py-3 rounded-xl font-medium text-xs sm:text-sm text-stone-300 hover:text-white bg-stone-900/60 hover:bg-stone-800 border border-stone-800 transition-all duration-200 hover:scale-102 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-orange-400" />
                <span>Свод правил</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Key Highlights Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <span className="text-[11px] uppercase tracking-wider font-mono text-orange-400 font-semibold">
            Особенности сервера
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-100 font-['Unbounded'] mt-0.5">
            Почему вам понравится на AUTUMN
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card 1: 15 Custom Plugins */}
          <div
            onClick={onNavigateToPlugins}
            className="p-5 rounded-xl bg-stone-900/40 border border-stone-800/80 hover:border-orange-500/40 transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-stone-800/70 border border-stone-700/60 flex items-center justify-center text-orange-400 mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-['Unbounded'] font-bold text-sm text-stone-100">
                15 Самописных плагинов
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-800 text-orange-300">
                15 шт
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed mt-1">
              Написанные с нуля серверные модули: глобальные ивенты, торговля, статистика и оптимизация.
            </p>
          </div>

          {/* Card 2: NPC */}
          <div className="p-5 rounded-xl bg-stone-900/40 border border-stone-800/80 hover:border-orange-500/40 transition-all duration-200">
            <div className="w-10 h-10 rounded-lg bg-stone-800/70 border border-stone-700/60 flex items-center justify-center text-amber-400 mb-3">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-['Unbounded'] font-bold text-sm text-stone-100">
                NPC торговец
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-800 text-amber-300">
                Спавн
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed mt-1">
              На спавне существует NPC торговец, который выдает ежедневные задания и торгует редкостями.
            </p>
          </div>

          {/* Card 3: Custom Items & Crafts */}
          <div
            onClick={onNavigateToCommands}
            className="p-5 rounded-xl bg-stone-900/40 border border-stone-800/80 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-stone-800/70 border border-stone-700/60 flex items-center justify-center text-cyan-400 mb-3">
              <Wand2 className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-['Unbounded'] font-bold text-sm text-stone-100">
                Команды и крафты
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-800 text-cyan-300">
                /block, крафты
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed mt-1">
              Кастомные рецепты верстака (лёд, артефакты), команды кланов /team, мини-игры /game и декор /block.
            </p>
          </div>

          {/* Card 4: Voice Chat & Animations */}
          <div className="p-5 rounded-xl bg-stone-900/40 border border-stone-800/80 hover:border-orange-500/40 transition-all duration-200">
            <div className="w-10 h-10 rounded-lg bg-stone-800/70 border border-stone-700/60 flex items-center justify-center text-orange-400 mb-3">
              <Mic className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-['Unbounded'] font-bold text-sm text-stone-100">
                3D Голос и анимации
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-800 text-orange-300">
                Голос
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed mt-1">
              Позиционный 3D-голосовой чат (Simple Voice Chat), позы GSit и кастомные модельки CPM.
            </p>
          </div>

          {/* Card 5: CoreProtect */}
          <div
            onClick={onNavigateToRules}
            className="p-5 rounded-xl bg-stone-900/40 border border-stone-800/80 hover:border-orange-500/40 transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-stone-800/70 border border-stone-700/60 flex items-center justify-center text-emerald-400 mb-3">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-['Unbounded'] font-bold text-sm text-stone-100">
                Защита от грифа
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-800 text-emerald-300">
                CoreProtect
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed mt-1">
              Логирование действий, откат любого ущерба за секунды и строгий бан за кражу и гриф.
            </p>
          </div>

          {/* Card 6: Events */}
          <div
            onClick={onNavigateToEvents}
            className="p-5 rounded-xl bg-stone-900/40 border border-stone-800/80 hover:border-orange-500/40 transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-stone-800/70 border border-stone-700/60 flex items-center justify-center text-amber-400 mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-['Unbounded'] font-bold text-sm text-stone-100">
                Ивенты и встречи
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-stone-800 text-amber-300">
                Ивенты
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed mt-1">
              Встречи новичков на спавне, ярмарки и совместные исследования в дружной компании.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Mini-Game Banner: Frog & Herobrine */}
      {onNavigateToGame && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            onClick={() => {
              soundManager.playClick();
              onNavigateToGame();
            }}
            className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-950/70 via-stone-900 to-amber-950/70 border border-red-500/50 hover:border-amber-400/70 transition-all duration-300 cursor-pointer shadow-xl group flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
                🐸⚡
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                    Официальная мини-игра сервера
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Цель: 50 000 очков
                  </span>
                </div>
                <h3 className="text-lg sm:text-2xl font-black font-['Unbounded'] text-stone-100 mt-0.5 group-hover:text-amber-300 transition-colors">
                  Пещерная лягушка и Херобрин
                </h3>
                <p className="text-xs text-stone-300 mt-1 max-w-xl">
                  Спасайтесь от преследующего Херобрина, перепрыгивайте сталагмиты и летучих мышей. Наберите 50 000 очков и получите 10 аров от администрации!
                </p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                soundManager.playClick();
                onNavigateToGame();
              }}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-amber-400 hover:from-red-400 hover:to-amber-300 text-stone-950 font-['Unbounded'] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
            >
              <Gamepad2 className="w-4 h-4 text-stone-950" />
              <span>Играть в аркаду</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* How to Start Playing Section */}
      <section className="max-w-5xl mx-auto px-2 sm:px-6">
        <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-stone-900/90 via-stone-950 to-orange-950/40 border border-orange-500/30 backdrop-blur-md shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-[11px] sm:text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">
              Быстрый старт
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-stone-100 font-['Unbounded'] mt-1">
              Как начать играть на AUTUMN?
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-2">
              Мы отбираем игроков через удобную анкету, чтобы поддерживать дружелюбную атмосферу и защитить сервер от неадекватов и гриферов.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6">
            
            {/* Step 1 */}
            <div className="p-4 sm:p-5 rounded-xl bg-stone-950/80 border border-stone-800 flex flex-col items-start hover:border-orange-500/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-orange-600/30 border border-orange-500/50 flex items-center justify-center text-orange-400 font-bold font-mono text-sm mb-2.5 sm:mb-3">
                1
              </div>
              <h4 className="font-['Unbounded'] font-bold text-xs sm:text-sm text-stone-200 mb-1">
                Заполните анкету
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Укажите ник, возраст (строго от 14 лет) и ответьте на контрольный вопрос по правилам.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 sm:p-5 rounded-xl bg-stone-950/80 border border-stone-800 flex flex-col items-start hover:border-orange-500/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-orange-600/30 border border-orange-500/50 flex items-center justify-center text-orange-400 font-bold font-mono text-sm mb-2.5 sm:mb-3">
                2
              </div>
              <h4 className="font-['Unbounded'] font-bold text-xs sm:text-sm text-stone-200 mb-1">
                Скопируйте текст
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                После прохождения теста редактор сгенерирует готовую форму заявки в 1 клик.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 sm:p-5 rounded-xl bg-stone-950/80 border border-stone-800 flex flex-col items-start hover:border-orange-500/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-orange-600/30 border border-orange-500/50 flex items-center justify-center text-orange-400 font-bold font-mono text-sm mb-2.5 sm:mb-3">
                3
              </div>
              <h4 className="font-['Unbounded'] font-bold text-xs sm:text-sm text-stone-200 mb-1">
                Вступите в Discord
              </h4>
              <p className="text-xs text-stone-400 leading-relaxed">
                Откроется прямая ссылка на наш Discord-сервер для быстрой отправки заявки и получения вайтлиста.
              </p>
            </div>

          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenApplication();
              }}
              className="w-full sm:w-auto min-h-[48px] px-6 sm:px-8 py-3.5 rounded-xl font-['Unbounded'] font-bold text-xs sm:text-sm text-stone-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 shadow-[0_0_20px_rgba(249,115,22,0.5)] transition-all hover:scale-105 active:scale-95 cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Открыть редактор анкеты</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
