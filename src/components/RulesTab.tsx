import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  ShieldAlert,
  Flame,
  Lock,
  Swords,
  MessageSquare,
  KeyRound,
  Search,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { CONDENSED_RULES } from '../data/rulesData';

export const RulesTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredRules = useMemo(() => {
    return CONDENSED_RULES.filter(cat => {
      if (selectedCategory !== 'all' && cat.id !== selectedCategory) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesTitle = cat.title.toLowerCase().includes(query);
        const matchesSummary = cat.summary.toLowerCase().includes(query);
        const matchesPoints = cat.keyPoints.some(pt => pt.toLowerCase().includes(query));
        return matchesTitle || matchesSummary || matchesPoints;
      }
      return true;
    });
  }, [selectedCategory, search]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'Lock': return <Lock className="w-5 h-5 text-amber-400" />;
      case 'Swords': return <Swords className="w-5 h-5 text-rose-400" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case 'KeyRound': return <KeyRound className="w-5 h-5 text-emerald-400" />;
      default: return <BookOpen className="w-5 h-5 text-orange-400" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
      {/* Rules Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-amber-300 text-xs font-mono font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5 text-orange-400" />
          <span>Свод правил сервера • Осенний сборник (Сокращенная редакция)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-['Unbounded'] text-stone-100 tracking-tight">
          Правила проекта AUTUMN
        </h1>
        <p className="mt-3 text-sm sm:text-base text-stone-300 leading-relaxed">
          Мы выделили самое главное из официального свода правил: читы, гриферство, воровство, PvP-кодекс, 
          общение и безопасность аккаунтов. Соблюдение этих правил гарантирует честную и уютную игру для всех!
        </p>
      </div>

      {/* Search & Filter Nav */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-stone-900/60 border border-stone-800 backdrop-blur-md">
        
        {/* Category Pills without commas */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-orange-600 text-white font-bold'
                : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
            }`}
          >
            Все разделы
          </button>
          {CONDENSED_RULES.map(cat => {
            const label = (cat.shortLabel || cat.title).replace(/[,.:;]/g, '').trim();
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-orange-600 text-white font-bold'
                    : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по правилам (сундук, читы, pvp...)"
            className="w-full pl-10 pr-4 py-2 min-h-[42px] rounded-xl bg-stone-950 border border-stone-800 focus:border-orange-500 text-base sm:text-xs text-stone-100 placeholder-stone-500 focus:outline-hidden"
          />
        </div>

      </div>

      {/* Key Principle Banner: Chests & Property */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/80 via-stone-900 to-orange-950/80 border border-amber-500/50 shadow-xl flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <div className="p-2.5 sm:p-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
          <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h3 className="font-['Unbounded'] font-bold text-xs sm:text-base text-amber-200">
            Золотое правило имущества AUTUMN:
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
            «Чужая постройка — не бесхозная. Чужой сундук — не общий. Чужая территория — не свободное место. 
            Даже если сундук не защищен регионом или стоит на улице — брать из него ресурсы без согласия владельца строго запрещено!»
          </p>
        </div>
      </div>

      {/* Rules Categories List */}
      <div className="space-y-4">
        {filteredRules.map((category) => (
          <article
            key={category.id}
            className="p-4 sm:p-6 rounded-2xl bg-stone-900/40 border border-stone-800/70 hover:border-orange-500/40 backdrop-blur-xs transition-all duration-200"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-stone-800/70 border border-stone-700/60 flex items-center justify-center">
                {getCategoryIcon(category.iconName)}
              </div>
              <div>
                <span className="text-[10px] font-mono text-orange-400 font-semibold uppercase">
                  Раздел {category.number}
                </span>
                <h2 className="text-base sm:text-lg font-bold font-['Unbounded'] text-stone-100">
                  {category.title}
                </h2>
              </div>
            </div>

            {/* Summary */}
            <p className="text-xs text-amber-200/80 font-medium mb-3">
              {category.summary}
            </p>

            {/* Key Bullet Points */}
            <ul className="space-y-2 my-3">
              {category.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            {/* Warning Callout */}
            {category.warning && (
              <div className="mt-3.5 p-3 rounded-lg bg-red-950/20 border border-red-500/20 flex items-start gap-2 text-xs text-red-300">
                <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-red-200">Ответственность: </strong>
                  {category.warning}
                </div>
              </div>
            )}

          </article>
        ))}
      </div>

      {filteredRules.length === 0 && (
        <div className="text-center py-12 text-stone-400 text-sm">
          Правила по указанному запросу не найдены.
        </div>
      )}

    </div>
  );
};
