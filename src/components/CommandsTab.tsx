import React, { useState, useMemo } from 'react';
import {
  Terminal,
  Hammer,
  Search,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  Users,
  Gamepad2,
  Image,
  ScrollText,
  ZoomIn,
  X
} from 'lucide-react';
import { SERVER_COMMANDS, CUSTOM_CRAFT_RECIPES, CommandItem } from '../data/commandsAndCraftsData';
import { CraftRecipe } from '../types';
import { soundManager } from '../utils/sound';

export const CommandsTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'all' | 'commands' | 'crafts'>('all');
  const [commandCategory, setCommandCategory] = useState<'all' | 'decor' | 'teams' | 'games' | 'rp' | 'visual'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [selectedCraft, setSelectedCraft] = useState<CraftRecipe | null>(null);

  const handleCopy = (text: string) => {
    soundManager.playClick();
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => {
      setCopiedCommand(null);
    }, 2000);
  };

  const filteredCommands = useMemo(() => {
    return SERVER_COMMANDS.filter((cmd) => {
      if (commandCategory !== 'all' && cmd.category !== commandCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCmd = cmd.command.toLowerCase().includes(q);
        const matchesSummary = cmd.summary.toLowerCase().includes(q);
        const matchesDetails = cmd.details.toLowerCase().includes(q);
        const matchesTags = cmd.tags.some((t) => t.toLowerCase().includes(q));
        return matchesCmd || matchesSummary || matchesDetails || matchesTags;
      }
      return true;
    });
  }, [commandCategory, searchQuery]);

  const filteredCrafts = useMemo(() => {
    if (!searchQuery.trim()) return CUSTOM_CRAFT_RECIPES;
    const q = searchQuery.toLowerCase();
    return CUSTOM_CRAFT_RECIPES.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.inputDescription.toLowerCase().includes(q) ||
        c.outputDescription.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-amber-300 text-xs font-mono font-semibold mb-3">
          <Terminal className="w-3.5 h-3.5 text-orange-400" />
          <span>Справочник игрока AUTUMN v26.2</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-['Unbounded'] text-stone-100 tracking-tight">
          Команды и крафты
        </h1>
        <p className="mt-3 text-sm sm:text-base text-stone-300 leading-relaxed">
          Полная база игровых команд из кастомных плагинов и иллюстрированная книга уникальных рецептов верстака.
        </p>
      </div>

      {/* Important Alerts / Lore Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bugfix notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 backdrop-blur-md flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                Исправление механики
              </span>
              <span className="px-1.5 py-0.2 rounded-xs text-[9px] font-mono bg-amber-500/20 text-amber-200">
                Баланс
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold font-['Unbounded'] text-stone-100 mt-1">
              Ремонт кастомных предметов
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
              Кастомные артефакты и предметы <strong className="text-amber-300">нельзя чинить рудами или в кузнечном столе</strong>. Это осознанный фикс для поддержания честной экономики сервера.
            </p>
          </div>
        </div>

        {/* NPC Lore notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30 backdrop-blur-md flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-purple-400 font-bold tracking-wider">
                Сюжет и задания
              </span>
              <span className="px-1.5 py-0.2 rounded-xs text-[9px] font-mono bg-purple-500/20 text-purple-200">
                Лор спавна
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold font-['Unbounded'] text-stone-100 mt-1">
              Мистические NPC на спавне
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
              На центральной площади появились загадочные странники. В скором времени с ними можно будет вступать в сюжетные диалоги и выполнять ежедневные задания за щедрые награды.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Section Switcher & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl bg-stone-900/70 border border-stone-800 backdrop-blur-md">
        {/* Main Section buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveSection('all');
            }}
            className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
              activeSection === 'all'
                ? 'bg-orange-600 text-white font-bold shadow-md shadow-orange-600/30'
                : 'bg-stone-800/80 text-stone-300 hover:text-white hover:bg-stone-700'
            }`}
          >
            Все разделы
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveSection('commands');
            }}
            className={`min-h-[42px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
              activeSection === 'commands'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold shadow-md shadow-amber-600/30'
                : 'bg-stone-800/80 text-stone-300 hover:text-white hover:bg-stone-700'
            }`}
          >
            <Terminal className="w-4 h-4 text-amber-400" />
            <span>Команды ({SERVER_COMMANDS.length})</span>
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveSection('crafts');
            }}
            className={`min-h-[42px] flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all shrink-0 cursor-pointer ${
              activeSection === 'crafts'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-md shadow-cyan-600/30'
                : 'bg-stone-800/80 text-stone-300 hover:text-white hover:bg-stone-700'
            }`}
          >
            <Hammer className="w-4 h-4 text-cyan-400" />
            <span>Крафты ({CUSTOM_CRAFT_RECIPES.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск команд, крафтов, тегов..."
            className="w-full pl-10 pr-4 py-2.5 min-h-[42px] rounded-xl bg-stone-950 border border-stone-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 text-base sm:text-xs text-stone-100 placeholder-stone-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* SECTION 1: COMMANDS */}
      {(activeSection === 'all' || activeSection === 'commands') && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Terminal className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Unbounded'] text-stone-100">
                Команды для игроков
              </h2>
            </div>

            {/* Sub-category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {(
                [
                  { id: 'all', label: 'Все' },
                  { id: 'decor', label: 'Декор (/block)' },
                  { id: 'teams', label: 'Отряды (/team)' },
                  { id: 'games', label: 'Игры (/game)' },
                  { id: 'rp', label: 'РП (/status, /lore)' },
                  { id: 'visual', label: 'Картины (/imageframe)' }
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    soundManager.playClick();
                    setCommandCategory(cat.id);
                  }}
                  className={`min-h-[34px] px-3 py-1 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
                    commandCategory === cat.id
                      ? 'bg-stone-200 text-stone-950 font-bold'
                      : 'bg-stone-900 border border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Commands List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredCommands.map((item) => (
              <div
                key={item.command}
                className="p-4 sm:p-5 rounded-xl bg-stone-900/50 border border-stone-800/90 hover:border-orange-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-sm sm:text-base font-bold text-orange-400 bg-stone-950/80 px-2.5 py-1 rounded-md border border-orange-500/30">
                      {item.command}
                    </span>
                    <button
                      onClick={() => handleCopy(item.usage)}
                      title="Скопировать команду"
                      className="min-w-[34px] min-h-[34px] px-2 py-1 rounded-md bg-stone-800/80 hover:bg-orange-600 hover:text-white text-stone-300 transition-colors flex items-center gap-1 text-xs font-mono cursor-pointer active:scale-95"
                    >
                      {copiedCommand === item.usage ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[10px] text-emerald-300">Скопировано!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Копия</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="font-['Unbounded'] text-xs sm:text-sm font-semibold text-stone-200 mb-1.5">
                    {item.summary}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                    {item.details}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-800/70 flex items-center justify-between gap-2 flex-wrap text-[11px] font-mono text-stone-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.tags.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded-xs bg-stone-950 border border-stone-800 text-stone-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-orange-400/80 font-bold">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredCommands.length === 0 && (
            <div className="text-center py-8 text-stone-400 text-sm">
              Команды по заданным фильтрам не найдены.
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: CUSTOM CRAFTS GALLERY */}
      {(activeSection === 'all' || activeSection === 'crafts') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Hammer className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Unbounded'] text-stone-100">
                Галерея кастомных крафтов
              </h2>
            </div>
            <span className="text-xs font-mono text-stone-400 hidden sm:inline">
              Кликните на изображение для увеличения
            </span>
          </div>

          {/* Crafts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCrafts.map((craft) => (
              <div
                key={craft.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCraft(craft);
                }}
                className="group rounded-2xl bg-stone-900/60 border border-stone-800 overflow-hidden hover:border-cyan-500/50 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                {/* Image container */}
                <div className="relative aspect-video bg-stone-950 overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={craft.image}
                    alt={craft.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-stone-950/0 group-hover:bg-stone-950/30 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg bg-stone-950/90 border border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center gap-1.5 shadow-lg">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Увеличить</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-['Unbounded'] text-sm sm:text-base font-bold text-stone-100 group-hover:text-cyan-300 transition-colors">
                    {craft.title}
                  </h3>

                  <div className="text-xs space-y-1 text-stone-300">
                    <p>
                      <strong className="text-stone-400 font-mono">Состав:</strong> {craft.inputDescription}
                    </p>
                    <p>
                      <strong className="text-cyan-400 font-mono">Результат:</strong> {craft.outputDescription}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                    {craft.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-950 border border-stone-800 text-stone-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for Craft Recipe Zoom */}
      {selectedCraft && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedCraft(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-stone-900 border border-stone-700 rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  Кастомный рецепт верстака
                </span>
                <h3 className="text-lg sm:text-2xl font-bold font-['Unbounded'] text-stone-100 mt-0.5">
                  {selectedCraft.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCraft(null);
                }}
                className="w-10 h-10 rounded-xl bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer"
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl bg-stone-950 p-3 sm:p-4 border border-stone-800 flex items-center justify-center max-h-[60vh] overflow-hidden">
              <img
                src={selectedCraft.image}
                alt={selectedCraft.title}
                className="max-h-[55vh] w-auto object-contain rounded-md shadow-md"
              />
            </div>

            <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800 text-xs sm:text-sm text-stone-300 space-y-1.5 font-mono">
              <p>
                <span className="text-stone-400">Рецепт:</span> {selectedCraft.inputDescription}
              </p>
              <p>
                <span className="text-cyan-400">Получение:</span> {selectedCraft.outputDescription}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
