import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  Sparkles,
  ExternalLink,
  Bot,
  Wand2,
  Cpu,
  CheckCircle,
  Filter
} from 'lucide-react';
import { PLUGINS_DATA } from '../data/pluginsData';
import { PluginItem } from '../types';
import { soundManager } from '../utils/sound';

export const PluginsTab: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'custom' | 'modrinth'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlugins = useMemo(() => {
    return PLUGINS_DATA.filter(plugin => {
      if (filterType === 'custom' && !plugin.isCustom) return false;
      if (filterType === 'modrinth' && plugin.isCustom) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = plugin.name.toLowerCase().includes(query);
        const matchesDesc = plugin.description ? plugin.description.toLowerCase().includes(query) : false;
        return matchesName || matchesDesc;
      }
      return true;
    });
  }, [filterType, searchQuery]);

  const customCount = PLUGINS_DATA.filter(p => p.isCustom).length;
  const modrinthCount = PLUGINS_DATA.filter(p => !p.isCustom).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-amber-300 text-xs font-mono font-semibold mb-3">
          <Layers className="w-3.5 h-3.5 text-orange-400" />
          <span>Сборка плагинов сервера AUTUMN (26.2)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-['Unbounded'] text-stone-100 tracking-tight">
          Плагины и механики
        </h1>
        <p className="mt-3 text-sm sm:text-base text-stone-300 leading-relaxed">
          На нашем сервере установлено ровно <strong className="text-amber-300">15 эксклюзивных самописных плагинов</strong>, 
          созданных специально для проекта, а также проверенные временем публичные модификации с Modrinth для максимального комфорта и производительности.
        </p>
      </div>

      {/* Featured Server Mechanics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Mechanic 1: NPC */}
        <div className="p-5 rounded-xl bg-stone-900/40 border border-stone-800/80 backdrop-blur-sm flex items-start gap-4 hover:border-orange-500/40 transition-all duration-200">
          <div className="w-10 h-10 rounded-lg bg-stone-800/70 border border-stone-700/60 flex items-center justify-center text-amber-400 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-orange-400 tracking-wider font-semibold">
              Механика сервера
            </span>
            <h3 className="text-base font-bold font-['Unbounded'] text-stone-100 mt-0.5">
              NPC торговец
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed">
              На спавне существует NPC торговец, который выдает ежедневные задания и торгует редкостями.
            </p>
          </div>
        </div>

        {/* Mechanic 2: Custom Items */}
        <div className="p-5 rounded-xl bg-stone-900/40 border border-stone-800/80 backdrop-blur-sm flex items-start gap-4 hover:border-orange-500/40 transition-all duration-200">
          <div className="w-10 h-10 rounded-lg bg-stone-800/70 border border-stone-700/60 flex items-center justify-center text-orange-400 shrink-0">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-orange-400 tracking-wider font-semibold">
              Механика сервера
            </span>
            <h3 className="text-base font-bold font-['Unbounded'] text-stone-100 mt-0.5">
              Кастомные предметы и артефакты
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed">
              Трансмутация сырья, кастомные декоративные рамки, музыкальные пластинки и уникальные предметы в испытаниях.
            </p>
          </div>
        </div>

      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-stone-900/60 border border-stone-800 backdrop-blur-md">
        
        {/* Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap w-full md:w-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              setFilterType('all');
            }}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-orange-600 text-white font-bold shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-102'
                : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white'
            }`}
          >
            Все ({PLUGINS_DATA.length})
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setFilterType('custom');
            }}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              filterType === 'custom'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-102'
                : 'bg-stone-800/80 hover:bg-stone-700 text-amber-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Самописные ({customCount})</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setFilterType('modrinth');
            }}
            className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
              filterType === 'modrinth'
                ? 'bg-emerald-600 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-102'
                : 'bg-stone-800/80 hover:bg-stone-700 text-emerald-300 hover:text-white'
            }`}
          >
            Modrinth ({modrinthCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию..."
            className="w-full pl-10 pr-4 py-2.5 min-h-[42px] rounded-xl bg-stone-950 border border-stone-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 text-base sm:text-xs text-stone-100 placeholder-stone-500 focus:outline-hidden"
          />
        </div>

      </div>

      {/* Plugins Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredPlugins.map((plugin) => (
          <div
            key={plugin.id}
            className={`p-4 rounded-xl border transition-all duration-200 hover:border-orange-500/50 flex flex-col justify-between ${
              plugin.isCustom
                ? 'bg-stone-900/60 border-amber-500/30'
                : 'bg-stone-900/30 border-stone-800/80'
            }`}
          >
            <div>
              {/* Card Header & Badge */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm select-none">
                    {plugin.isCustom ? '🍁' : '📦'}
                  </span>
                  <h3 className="font-['Unbounded'] font-bold text-xs sm:text-sm text-stone-100">
                    {plugin.name}
                  </h3>
                </div>

                {plugin.isCustom ? (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Самописный AUTUMN
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-normal bg-stone-800/80 text-stone-400 border border-stone-700/60">
                    Modrinth
                  </span>
                )}
              </div>

              {/* Plugin Description */}
              {plugin.description && (
                <p className={`text-xs leading-relaxed mt-2 ${plugin.isCustom ? 'text-amber-200/90 font-medium' : 'text-stone-400'}`}>
                  {plugin.description}
                </p>
              )}
            </div>

            {/* Bottom info: category & link */}
            <div className="mt-3 pt-2.5 border-t border-stone-800/60 flex items-center justify-between text-[10px] font-mono text-stone-400">
              <span className="uppercase tracking-wider text-stone-400">
                {plugin.category}
              </span>

              {plugin.modrinthUrl && (
                <a
                  href={plugin.modrinthUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-stone-300 hover:text-orange-400 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Modrinth</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>

          </div>
        ))}
      </div>

      {filteredPlugins.length === 0 && (
        <div className="text-center py-12 text-stone-400 text-sm">
          Плагины по запросу не найдены. Попробуйте изменить параметры поиска.
        </div>
      )}

    </div>
  );
};
