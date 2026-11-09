import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  ShieldCheck,
  Plus,
  Trash2,
  Edit2,
  Save,
  KeyRound,
  LogOut,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Terminal,
  Image as ImageIcon
} from 'lucide-react';
import { DonationOrder, ServerEvent, ServerUpdate } from '../types';
import { soundManager } from '../utils/sound';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLogin: (pass: string) => boolean;
  onLogout: () => void;
  onChangePassword: (oldP: string, newP: string) => boolean;
  events: ServerEvent[];
  updates: ServerUpdate[];
  onAddEvent: (evt: ServerEvent) => void;
  onUpdateEvent: (evt: ServerEvent) => void;
  onDeleteEvent: (id: string) => void;
  onAddUpdate: (upd: ServerUpdate) => void;
  onUpdateUpdate: (upd: ServerUpdate) => void;
  onDeleteUpdate: (id: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onLogin,
  onLogout,
  onChangePassword,
  events,
  updates,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onAddUpdate,
  onUpdateUpdate,
  onDeleteUpdate
}) => {
  // Login state
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin tabs
  const [activeAdminTab, setActiveAdminTab] = useState<'events' | 'updates' | 'donations' | 'commands' | 'security'>('events');

  // Donation orders state
  const [donations, setDonations] = useState<DonationOrder[]>([]);
  const [customCmdCount, setCustomCmdCount] = useState(0);
  const [customCraftCount, setCustomCraftCount] = useState(0);

  React.useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem('autumn_donations');
        if (stored) setDonations(JSON.parse(stored));

        const storedCmds = localStorage.getItem('autumn_custom_commands_v2');
        if (storedCmds) setCustomCmdCount(JSON.parse(storedCmds).length);

        const storedCrafts = localStorage.getItem('autumn_custom_crafts_v2');
        if (storedCrafts) setCustomCraftCount(JSON.parse(storedCrafts).length);
      } catch {}
    }
  }, [isOpen]);

  const handleDeleteDonation = (id: string) => {
    soundManager.playClick();
    const updated = donations.filter((d) => d.id !== id);
    setDonations(updated);
    try {
      localStorage.setItem('autumn_donations', JSON.stringify(updated));
    } catch {}
  };

  const handleToggleDonationStatus = (id: string) => {
    soundManager.playSuccess();
    const updated = donations.map((d) => {
      if (d.id === id) {
        return {
          ...d,
          status: (d.status === 'completed' ? 'pending' : 'completed') as DonationOrder['status']
        };
      }
      return d;
    });
    setDonations(updated);
    try {
      localStorage.setItem('autumn_donations', JSON.stringify(updated));
    } catch {}
  };

  // Password change state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMessage, setPassMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Event editing state
  const [editingEvent, setEditingEvent] = useState<ServerEvent | null>(null);
  const [isNewEvent, setIsNewEvent] = useState(false);

  // Update editing state
  const [editingUpdate, setEditingUpdate] = useState<ServerUpdate | null>(null);
  const [isNewUpdate, setIsNewUpdate] = useState(false);
  const [highlightsInput, setHighlightsInput] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onLogin(passwordInput);
    if (ok) {
      soundManager.playSuccess();
      setLoginError('');
      setPasswordInput('');
    } else {
      soundManager.playError();
      setLoginError('Неверный пароль администратора!');
    }
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPass || newPass.length < 6) {
      setPassMessage({ text: 'Новый пароль должен содержать минимум 6 символов', isError: true });
      return;
    }
    const ok = onChangePassword(oldPass, newPass);
    if (ok) {
      soundManager.playSuccess();
      setPassMessage({ text: 'Пароль успешно изменён!', isError: false });
      setOldPass('');
      setNewPass('');
    } else {
      soundManager.playError();
      setPassMessage({ text: 'Старый пароль указан неверно', isError: true });
    }
  };

  // Event Handlers
  const startCreateEvent = () => {
    soundManager.playClick();
    setIsNewEvent(true);
    setEditingEvent({
      id: `evt-${Date.now()}`,
      title: '',
      date: 'В эту субботу в 18:00 МСК',
      location: 'Спавн',
      description: '',
      badge: 'Новый ивент',
      status: 'upcoming'
    });
  };

  const saveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title) return;
    soundManager.playSuccess();
    if (isNewEvent) {
      onAddEvent(editingEvent);
    } else {
      onUpdateEvent(editingEvent);
    }
    setEditingEvent(null);
    setIsNewEvent(false);
  };

  // Update Handlers
  const startCreateUpdate = () => {
    soundManager.playClick();
    setIsNewUpdate(true);
    setHighlightsInput('');
    setEditingUpdate({
      id: `upd-${Date.now()}`,
      version: '26.2',
      title: '',
      date: 'Сегодня',
      description: '',
      highlights: [],
      inProgress: false
    });
  };

  const saveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUpdate || !editingUpdate.title) return;
    soundManager.playSuccess();
    const highlights = highlightsInput
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const updateToSave = { ...editingUpdate, highlights };
    if (isNewUpdate) {
      onAddUpdate(updateToSave);
    } else {
      onUpdateUpdate(updateToSave);
    }
    setEditingUpdate(null);
    setIsNewUpdate(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[94vh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-stone-950 border border-orange-500/40 shadow-[0_0_50px_rgba(249,115,22,0.3)] p-4 sm:p-8 text-stone-100">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-800 transition-colors cursor-pointer"
          aria-label="Закрыть окно"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5 sm:mb-6 pr-10">
          <div className="flex items-center gap-2 mb-1.5">
            <Lock className="w-4 h-4 text-orange-400" />
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
              Административная панель AUTUMN
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold font-['Unbounded'] text-stone-100">
            {isAdmin ? 'Управление сервером' : 'Вход для администратора'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            {isAdmin
              ? 'Редактируйте события, публикуйте обновления и управляйте безопасностью.'
              : 'Доступ к редактированию ивентов и обновлений защищён паролем.'}
          </p>
        </div>

        {/* Unauthenticated State: Login Form */}
        {!isAdmin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-md mx-auto py-6">
            <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs text-stone-400 leading-relaxed flex items-center gap-3">
              <Lock className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Доступ разрешён только авторизованному администратору сервера AUTUMN. Введите секретный код доступа.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Пароль администратора:
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Введите пароль..."
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-orange-500 text-stone-100 placeholder-stone-500 focus:outline-hidden"
              />
              {loginError && (
                <p className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{loginError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-['Unbounded'] font-bold text-sm text-stone-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4 text-stone-950" />
              <span>Войти в систему</span>
            </button>
          </form>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="space-y-6">
            
            {/* Admin Tabs */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveAdminTab('events');
                    setEditingEvent(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeAdminTab === 'events'
                      ? 'bg-orange-600 text-white font-bold'
                      : 'bg-stone-900 text-stone-300 hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Ивенты ({events.length})</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveAdminTab('updates');
                    setEditingUpdate(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeAdminTab === 'updates'
                      ? 'bg-orange-600 text-white font-bold'
                      : 'bg-stone-900 text-stone-300 hover:text-white'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Обновления ({updates.length})</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveAdminTab('donations');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeAdminTab === 'donations'
                      ? 'bg-orange-600 text-white font-bold'
                      : 'bg-stone-900 text-stone-300 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Донаты ({donations.length})</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveAdminTab('commands');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeAdminTab === 'commands'
                      ? 'bg-orange-600 text-white font-bold'
                      : 'bg-stone-900 text-stone-300 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Команды ({customCmdCount})</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setActiveAdminTab('security');
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeAdminTab === 'security'
                      ? 'bg-orange-600 text-white font-bold'
                      : 'bg-stone-900 text-stone-300 hover:text-white'
                  }`}
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Безопасность</span>
                </button>
              </div>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onLogout();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-mono text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/70 border border-red-500/30 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Выйти</span>
              </button>
            </div>

            {/* TAB 1: EVENTS MANAGEMENT */}
            {activeAdminTab === 'events' && (
              <div className="space-y-4">
                {!editingEvent ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold font-['Unbounded'] text-stone-200">
                        Список активных событий
                      </h3>
                      <button
                        onClick={startCreateEvent}
                        className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold font-['Unbounded'] flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Добавить ивент</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {events.map((evt) => (
                        <div
                          key={evt.id}
                          className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-start justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-950 text-amber-300 border border-orange-500/40">
                                {evt.badge}
                              </span>
                              <span className="text-xs text-stone-400 font-mono">{evt.date}</span>
                            </div>
                            <h4 className="font-['Unbounded'] font-bold text-sm text-stone-100">
                              {evt.title}
                            </h4>
                            <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                              {evt.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                soundManager.playClick();
                                setIsNewEvent(false);
                                setEditingEvent({ ...evt });
                              }}
                              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white"
                              title="Редактировать"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                soundManager.playClick();
                                onDeleteEvent(evt.id);
                              }}
                              className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400 hover:text-red-300"
                              title="Удалить"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Edit Event Form */
                  <form onSubmit={saveEvent} className="space-y-3 p-5 rounded-2xl bg-stone-900/90 border border-stone-800">
                    <h3 className="font-['Unbounded'] font-bold text-sm text-orange-400 mb-2">
                      {isNewEvent ? 'Создание нового ивента' : 'Редактирование ивента'}
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Название события:
                      </label>
                      <input
                        type="text"
                        required
                        value={editingEvent.title}
                        onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                        placeholder="Например: Встреча новичков на спавне"
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Дата и время:
                        </label>
                        <input
                          type="text"
                          required
                          value={editingEvent.date}
                          onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Местоположение:
                        </label>
                        <input
                          type="text"
                          required
                          value={editingEvent.location}
                          onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Бейдж (метка):
                      </label>
                      <input
                        type="text"
                        value={editingEvent.badge}
                        onChange={(e) => setEditingEvent({ ...editingEvent, badge: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Описание события:
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={editingEvent.description}
                        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Сохранить ивент</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingEvent(null)}
                        className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs cursor-pointer"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: UPDATES MANAGEMENT */}
            {activeAdminTab === 'updates' && (
              <div className="space-y-4">
                {!editingUpdate ? (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold font-['Unbounded'] text-stone-200">
                        Список обновлений сервера
                      </h3>
                      <button
                        onClick={startCreateUpdate}
                        className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold font-['Unbounded'] flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-102"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Добавить обновление</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {updates.map((upd) => (
                        <div
                          key={upd.id}
                          className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-start justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-orange-600 text-white font-bold">
                                {upd.version}
                              </span>
                              <span className="text-xs text-stone-400 font-mono">{upd.date}</span>
                            </div>
                            <h4 className="font-['Unbounded'] font-bold text-sm text-stone-100">
                              {upd.title}
                            </h4>
                            <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                              {upd.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                soundManager.playClick();
                                setIsNewUpdate(false);
                                setHighlightsInput(upd.highlights ? upd.highlights.join('\n') : '');
                                setEditingUpdate({ ...upd });
                              }}
                              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white"
                              title="Редактировать"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                soundManager.playClick();
                                onDeleteUpdate(upd.id);
                              }}
                              className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-400 hover:text-red-300"
                              title="Удалить"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Edit Update Form */
                  <form onSubmit={saveUpdate} className="space-y-3 p-5 rounded-2xl bg-stone-900/90 border border-stone-800">
                    <h3 className="font-['Unbounded'] font-bold text-sm text-orange-400 mb-2">
                      {isNewUpdate ? 'Новое обновление' : 'Редактирование обновления'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Версия патча:
                        </label>
                        <input
                          type="text"
                          required
                          value={editingUpdate.version}
                          onChange={(e) => setEditingUpdate({ ...editingUpdate, version: e.target.value })}
                          placeholder="26.2-Patch"
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                          Статус / Дата:
                        </label>
                        <input
                          type="text"
                          required
                          value={editingUpdate.date}
                          onChange={(e) => setEditingUpdate({ ...editingUpdate, date: e.target.value })}
                          placeholder="В разработке"
                          className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Заголовок обновления:
                      </label>
                      <input
                        type="text"
                        required
                        value={editingUpdate.title}
                        onChange={(e) => setEditingUpdate({ ...editingUpdate, title: e.target.value })}
                        placeholder="Например: Разработка механики алхимии и боссов"
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Описание:
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={editingUpdate.description}
                        onChange={(e) => setEditingUpdate({ ...editingUpdate, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-300 mb-1">
                        Ключевые пункты (по одному на строку):
                      </label>
                      <textarea
                        rows={3}
                        value={highlightsInput}
                        onChange={(e) => setHighlightsInput(e.target.value)}
                        placeholder="Кастомные котлы алхимии&#10;Боссы в подземельях&#10;Новые предметы"
                        className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100 resize-none font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Сохранить патч</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingUpdate(null)}
                        className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs cursor-pointer"
                      >
                        Отмена
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: DONATION ORDERS */}
            {activeAdminTab === 'donations' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-['Unbounded'] font-bold text-sm text-stone-100 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Поступившие заявки на донат ({donations.length})</span>
                  </h3>
                  {donations.length > 0 && (
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setDonations([]);
                        try {
                          localStorage.removeItem('autumn_donations');
                        } catch {}
                      }}
                      className="text-xs font-mono text-red-400 hover:text-red-300 underline cursor-pointer"
                    >
                      Очистить все
                    </button>
                  )}
                </div>

                {donations.length === 0 ? (
                  <div className="text-center py-10 rounded-2xl bg-stone-900/40 border border-stone-800 text-stone-400 text-xs font-mono">
                    Заявок на донат пока нет. Когда игроки оформят заказ на сайте, он появится здесь.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {donations.map((don) => (
                      <div
                        key={don.id}
                        className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-300 text-sm">{don.nickname}</span>
                            <span className="px-2 py-0.5 rounded-xs font-mono text-[10px] bg-stone-800 text-stone-300">
                              {don.serviceName} ({don.price} ₽)
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded-xs text-[9px] font-mono ${
                                don.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {don.status === 'completed' ? 'Выдано' : 'Ожидает'}
                            </span>
                          </div>
                          <div className="text-stone-400 font-mono">
                            Связь: <strong className="text-stone-200">{don.contact}</strong> • Дата: {don.createdAt}
                          </div>
                          {don.wishes && (
                            <div className="text-stone-300 text-[11px] bg-stone-950 p-2 rounded-lg border border-stone-800/80">
                              Пожелания: {don.wishes}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleToggleDonationStatus(don.id)}
                            className="px-3 py-1.5 rounded-lg font-mono text-[11px] bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
                          >
                            {don.status === 'completed' ? 'Вернуть в ожидание' : 'Отметить выданным'}
                          </button>
                          <button
                            onClick={() => handleDeleteDonation(don.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Удалить заявку"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: COMMANDS & SCREENSHOTS MANAGEMENT OVERVIEW */}
            {activeAdminTab === 'commands' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-950 border border-orange-500/40 space-y-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-orange-400" />
                    <h3 className="text-sm font-bold font-['Unbounded'] text-stone-100">
                      Управление командами и скриншотами
                    </h3>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Для администраторов прямо в разделе <strong className="text-orange-400">«Команды»</strong> на сайте активирована верхняя панель управления. Вы можете добавлять новые команды для игроков, прикреплять к ним скриншоты, а также загружать скриншоты новых крафтов и механизмов.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800">
                      <span className="text-[10px] font-mono uppercase text-stone-400 block">Кастомные команды</span>
                      <span className="text-xl font-bold font-['Unbounded'] text-orange-400">{customCmdCount}</span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">+ 10 базовых команд</span>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800">
                      <span className="text-[10px] font-mono uppercase text-stone-400 block">Кастомные скриншоты и крафты</span>
                      <span className="text-xl font-bold font-['Unbounded'] text-cyan-400">{customCraftCount}</span>
                      <span className="text-[11px] text-stone-500 block mt-0.5">+ 6 базовых рецептов</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onClose();
                      }}
                      className="px-4 py-2.5 rounded-xl font-['Unbounded'] font-bold text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-stone-950 shadow-md cursor-pointer active:scale-95 flex items-center gap-2"
                    >
                      <Terminal className="w-4 h-4 text-stone-950" />
                      <span>Открыть раздел Команды на сайте</span>
                    </button>

                    {(customCmdCount > 0 || customCraftCount > 0) && (
                      <button
                        onClick={() => {
                          if (window.confirm('Сбросить все кастомные команды и скриншоты к стандартным?')) {
                            soundManager.playClick();
                            localStorage.removeItem('autumn_custom_commands_v2');
                            localStorage.removeItem('autumn_custom_crafts_v2');
                            setCustomCmdCount(0);
                            setCustomCraftCount(0);
                            alert('Кастомные элементы сброшены.');
                          }
                        }}
                        className="px-3.5 py-2.5 rounded-xl text-xs font-mono text-red-400 hover:text-red-300 bg-red-950/40 border border-red-500/30 cursor-pointer"
                      >
                        Сбросить к исходным
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SECURITY & PASSWORD CHANGE */}
            {activeAdminTab === 'security' && (
              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4 max-w-md mx-auto py-3">
                <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 text-xs text-stone-300 leading-relaxed">
                  <span className="font-semibold text-amber-300 block mb-1">
                    Смена пароля администратора
                  </span>
                  Для предотвращения несанкционированного доступа к редактированию событий и обновлений используйте сложный пароль.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Текущий пароль:
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    placeholder="Введите старый пароль"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Новый пароль:
                  </label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Минимум 6 символов"
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-100"
                  />
                </div>

                {passMessage && (
                  <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    passMessage.isError
                      ? 'bg-red-950/60 border border-red-500/40 text-red-300'
                      : 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                  }`}>
                    {passMessage.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    <span>{passMessage.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl font-['Unbounded'] font-bold text-xs text-stone-950 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 transition-all cursor-pointer shadow-sm"
                >
                  Обновить пароль
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
