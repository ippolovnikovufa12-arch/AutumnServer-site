import React from 'react';
import {
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Plus,
  ShieldCheck
} from 'lucide-react';
import { ServerEvent } from '../types';
import { soundManager } from '../utils/sound';

interface EventsTabProps {
  events: ServerEvent[];
  isAdmin: boolean;
  onOpenAdmin: () => void;
  onOpenApplication: () => void;
}

export const EventsTab: React.FC<EventsTabProps> = ({
  events,
  isAdmin,
  onOpenAdmin,
  onOpenApplication
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-amber-300 text-xs font-mono font-semibold mb-3">
          <Calendar className="w-3.5 h-3.5 text-orange-400" />
          <span>Жизнь сервера • События и мероприятия</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-['Unbounded'] text-stone-100 tracking-tight">
          Ивенты AUTUMN
        </h1>
        <p className="mt-3 text-sm sm:text-base text-stone-300 leading-relaxed">
          На сервере регулярно проходят сюжетные и ламповые события, фестивали и ярмарки, где можно завести друзей, 
          получить стартовые ресурсы и приятно провести время.
        </p>

        {isAdmin && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-950/70 border border-amber-500/60 text-amber-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Вы вошли как администратор. Вы можете добавлять и редактировать ивенты в панели управления.</span>
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

      {/* Events List */}
      <div className="space-y-4">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="p-4 sm:p-6 rounded-2xl bg-stone-900/40 border border-stone-800/80 hover:border-orange-500/40 transition-all duration-200"
          >
            <div>
              {/* Badge & Status */}
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-medium bg-orange-950/80 text-amber-300 border border-orange-500/30">
                  {evt.badge}
                </span>

                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Актуально</span>
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold font-['Unbounded'] text-stone-100">
                {evt.title}
              </h2>

              {/* Metadata (Date, Location) - clean and minimal, without 'каждую субботу' */}
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-mono text-stone-300">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-800/80 text-stone-300 border border-stone-700/50">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  <span>{evt.date.replace(/каждую субботу\s*(в\s*)?/gi, '').trim()}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-800/80 text-stone-300 border border-stone-700/50">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>{evt.location}</span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl">
                {evt.description}
              </p>

              {/* Action */}
              <div className="mt-5 flex items-center gap-4">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    onOpenApplication();
                  }}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-lg font-['Unbounded'] font-bold text-xs text-stone-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 transition-all hover:scale-102 active:scale-95 cursor-pointer shadow-sm flex items-center justify-center text-center"
                >
                  Подать заявку и прийти
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Admin affordance to add events */}
      <div className="text-center pt-4">
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenAdmin();
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-xs font-mono text-stone-400 hover:text-amber-300 border border-stone-800 hover:border-amber-500/40 transition-all hover:scale-102 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>{isAdmin ? 'Добавить новый ивент в панели администратора' : 'Редактировать события (только для администрации)'}</span>
        </button>
      </div>

    </div>
  );
};
