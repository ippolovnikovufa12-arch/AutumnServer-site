import React from 'react';
import {
  RefreshCw,
  ShieldCheck,
  Plus,
  Clock
} from 'lucide-react';
import { ServerUpdate } from '../types';
import { soundManager } from '../utils/sound';

interface UpdatesTabProps {
  updates: ServerUpdate[];
  isAdmin: boolean;
  onOpenAdmin: () => void;
}

export const UpdatesTab: React.FC<UpdatesTabProps> = ({
  updates,
  isAdmin,
  onOpenAdmin
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-amber-300 text-xs font-mono font-semibold mb-3">
          <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
          <span>Дневник разработки • Новости и патчи</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-['Unbounded'] text-stone-100 tracking-tight">
          Обновления сервера
        </h1>
        <p className="mt-3 text-sm sm:text-base text-stone-300 leading-relaxed">
          Мы постоянно улучшаем сервер AUTUMN, добавляя новые механики, настраивая баланс и готовя уникальный контент для игроков.
        </p>

        {isAdmin && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-950/70 border border-amber-500/60 text-amber-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Вы вошли как администратор. Вы можете добавлять и публиковать новые апдейты.</span>
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenAdmin();
              }}
              className="ml-2 underline hover:text-white font-bold"
            >
              Открыть редактор
            </button>
          </div>
        )}
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {updates.map((upd) => (
          <article
            key={upd.id}
            className="p-4 sm:p-6 rounded-2xl bg-stone-900/40 border border-stone-800/80 hover:border-orange-500/40 transition-all duration-200"
          >
            {/* Version & Date */}
            <div className="flex items-center justify-between gap-2 sm:gap-3 flex-wrap mb-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-orange-600 text-white">
                  v{upd.version}
                </span>
                {upd.inProgress && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-amber-300 bg-amber-950/60 border border-amber-500/30">
                    В разработке
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs font-mono text-stone-400">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>{upd.date}</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-lg sm:text-2xl font-bold font-['Unbounded'] text-stone-100">
              {upd.title}
            </h2>

            {/* Description - ONLY what the user specified, nothing more */}
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
              {upd.description}
            </p>

          </article>
        ))}
      </div>

      {/* Admin affordance */}
      <div className="text-center pt-4">
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenAdmin();
          }}
          className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-xs font-mono text-stone-400 hover:text-amber-300 border border-stone-800 hover:border-amber-500/40 transition-all hover:scale-102 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-center">{isAdmin ? 'Опубликовать новое обновление в панели администратора' : 'Редактировать обновления (только для администрации)'}</span>
        </button>
      </div>

    </div>
  );
};
