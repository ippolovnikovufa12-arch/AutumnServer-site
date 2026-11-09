import React, { useState, useMemo, useEffect } from 'react';
import {
  Terminal,
  Hammer,
  Search,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  ZoomIn,
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload,
  Shield,
  Eye,
  Lock,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { SERVER_COMMANDS, CUSTOM_CRAFT_RECIPES } from '../data/commandsAndCraftsData';
import { CraftRecipe, CommandItem } from '../types';
import { soundManager } from '../utils/sound';
import { filterCommandsList } from '../utils/frogGameLogic';

interface CommandsTabProps {
  isAdmin?: boolean;
  onOpenAdmin?: () => void;
}

export const CommandsTab: React.FC<CommandsTabProps> = ({
  isAdmin = false,
  onOpenAdmin
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'commands' | 'crafts'>('all');
  const [commandCategory, setCommandCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  // Lightbox Zoom Modal
  const [selectedCraft, setSelectedCraft] = useState<CraftRecipe | null>(null);
  const [previewImage, setPreviewImage] = useState<{ title: string; image: string; desc?: string } | null>(null);

  // Custom Commands State (persisted in localStorage)
  const [customCommands, setCustomCommands] = useState<CommandItem[]>(() => {
    try {
      const stored = localStorage.getItem('autumn_custom_commands_v2');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Custom Crafts / Screenshots State (persisted in localStorage)
  const [customCrafts, setCustomCrafts] = useState<CraftRecipe[]>(() => {
    try {
      const stored = localStorage.getItem('autumn_custom_crafts_v2');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Modals for Admin Creation
  const [isAddCommandOpen, setIsAddCommandOpen] = useState(false);
  const [isAddCraftOpen, setIsAddCraftOpen] = useState(false);

  // New Command Form State
  const [newCmd, setNewCmd] = useState({
    command: '',
    category: 'custom' as 'decor' | 'teams' | 'games' | 'rp' | 'visual' | 'custom',
    summary: '',
    usage: '',
    details: '',
    tags: '',
    image: ''
  });

  // New Craft Form State
  const [newCraft, setNewCraft] = useState({
    title: '',
    category: 'mechanics' as 'ice' | 'artifacts' | 'mechanics' | 'showcase',
    inputDescription: '',
    outputDescription: '',
    tags: '',
    image: ''
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('autumn_custom_commands_v2', JSON.stringify(customCommands));
    } catch {
      // storage quota or private browsing
    }
  }, [customCommands]);

  useEffect(() => {
    try {
      localStorage.setItem('autumn_custom_crafts_v2', JSON.stringify(customCrafts));
    } catch {
      // storage quota
    }
  }, [customCrafts]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleCopy = (text: string) => {
    soundManager.playClick();
    navigator.clipboard.writeText(text);
    setCopiedCommand(text);
    setTimeout(() => {
      setCopiedCommand(null);
    }, 2000);
  };

  // Combined lists
  const allCommands = useMemo(() => {
    return [...customCommands, ...SERVER_COMMANDS];
  }, [customCommands]);

  const allCrafts = useMemo(() => {
    return [...customCrafts, ...CUSTOM_CRAFT_RECIPES];
  }, [customCrafts]);

  const filteredCommands = useMemo(() => {
    return filterCommandsList(allCommands, commandCategory, searchQuery);
  }, [allCommands, commandCategory, searchQuery]);

  const filteredCrafts = useMemo(() => {
    if (!searchQuery.trim()) return allCrafts;
    const q = searchQuery.toLowerCase();
    return allCrafts.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.inputDescription.toLowerCase().includes(q) ||
        c.outputDescription.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [allCrafts, searchQuery]);

  // Image Upload Handler (converts chosen file to Data URL)
  const handleImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Размер файла превышает 2 МБ. Пожалуйста, выберите изображение меньшего размера.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setter(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit New Command
  const handleCreateCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCmd.command.trim() || !newCmd.summary.trim()) return;

    soundManager.playClick();
    const tagsArray = newCmd.tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const created: CommandItem = {
      id: `custom-cmd-${Date.now()}`,
      command: newCmd.command.trim(),
      category: newCmd.category,
      summary: newCmd.summary.trim(),
      usage: newCmd.usage.trim() || newCmd.command.trim(),
      details: newCmd.details.trim() || newCmd.summary.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['команда', 'сервер'],
      image: newCmd.image.trim() || undefined,
      isCustom: true
    };

    setCustomCommands((prev) => [created, ...prev]);
    setIsAddCommandOpen(false);
    setNewCmd({
      command: '',
      category: 'custom',
      summary: '',
      usage: '',
      details: '',
      tags: '',
      image: ''
    });
    showToast('Команда успешно добавлена в справочник!');
  };

  // Submit New Craft / Screenshot
  const handleCreateCraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCraft.title.trim() || !newCraft.image.trim()) {
      alert('Пожалуйста, укажите название и прикрепите изображение или скриншот.');
      return;
    }

    soundManager.playClick();
    const tagsArray = newCraft.tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const created: CraftRecipe = {
      id: `custom-craft-${Date.now()}`,
      title: newCraft.title.trim(),
      category: newCraft.category,
      image: newCraft.image.trim(),
      inputDescription: newCraft.inputDescription.trim() || 'Скриншот механики сервера',
      outputDescription: newCraft.outputDescription.trim() || 'Кастомная механика AUTUMN 26.2',
      tags: tagsArray.length > 0 ? tagsArray : ['скриншот', 'механика'],
      isCustom: true
    };

    setCustomCrafts((prev) => [created, ...prev]);
    setIsAddCraftOpen(false);
    setNewCraft({
      title: '',
      category: 'mechanics',
      inputDescription: '',
      outputDescription: '',
      tags: '',
      image: ''
    });
    showToast('Скриншот/крафт успешно добавлен в галерею!');
  };

  // Delete Custom Command
  const handleDeleteCustomCommand = (id?: string, commandName?: string) => {
    if (!window.confirm(`Удалить команду "${commandName}"?`)) return;
    soundManager.playClick();
    setCustomCommands((prev) => prev.filter((c) => (id ? c.id !== id : c.command !== commandName)));
    showToast('Команда удалена.');
  };

  // Delete Custom Craft
  const handleDeleteCustomCraft = (id: string, title: string) => {
    if (!window.confirm(`Удалить скриншот/крафт "${title}"?`)) return;
    soundManager.playClick();
    setCustomCrafts((prev) => prev.filter((c) => c.id !== id));
    showToast('Скриншот/крафт удален.');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 border border-emerald-500/60 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{notification}</span>
        </div>
      )}

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
          Полная база игровых команд из кастомных плагинов и иллюстрированная галерея рецептов верстака со скриншотами.
        </p>
      </div>

      {/* ADMIN CONTROL BAR (Visible when logged in as admin) */}
      {isAdmin ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-950/70 via-stone-900/90 to-amber-950/70 border border-orange-500/50 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-400">
                  Панель администратора
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Доступ активен
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 mt-0.5">
                Вы можете добавлять новые команды для игроков и загружать скриншоты крафтов.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
            <button
              onClick={() => {
                soundManager.playClick();
                setIsAddCommandOpen(true);
              }}
              className="flex-1 md:flex-none min-h-[42px] px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-stone-950 font-['Unbounded'] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-stone-950" />
              <span>Добавить команду</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setIsAddCraftOpen(true);
              }}
              className="flex-1 md:flex-none min-h-[42px] px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-['Unbounded'] font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-cyan-200" />
              <span>Добавить скриншот / крафт</span>
            </button>
          </div>
        </div>
      ) : (
        /* Prompt for admin login if user is admin */
        onOpenAdmin && (
          <div className="p-3.5 rounded-xl bg-stone-900/40 border border-stone-800 flex items-center justify-between text-xs text-stone-400 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span>Вы администратор сервера? Войдите, чтобы добавлять новые команды и скриншоты.</span>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenAdmin();
              }}
              className="text-orange-400 hover:text-orange-300 font-mono font-semibold underline cursor-pointer"
            >
              Вход для администрации
            </button>
          </div>
        )
      )}

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
            <span>Команды ({allCommands.length})</span>
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
            <span>Крафты и скриншоты ({allCrafts.length})</span>
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
                  { id: 'visual', label: 'Картины (/imageframe)' },
                  { id: 'custom', label: 'Кастомные' }
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
            {filteredCommands.map((item, idx) => (
              <div
                key={item.id || item.command + idx}
                className="p-4 sm:p-5 rounded-xl bg-stone-900/50 border border-stone-800/90 hover:border-orange-500/40 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm sm:text-base font-bold text-orange-400 bg-stone-950/80 px-2.5 py-1 rounded-md border border-orange-500/30">
                        {item.command}
                      </span>
                      {item.isCustom && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                          Кастомная
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Copy Command */}
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

                      {/* Admin Delete Action */}
                      {isAdmin && item.isCustom && (
                        <button
                          onClick={() => handleDeleteCustomCommand(item.id, item.command)}
                          title="Удалить команду"
                          className="min-w-[34px] min-h-[34px] px-2 py-1 rounded-md bg-red-950/60 hover:bg-red-800 text-red-300 transition-colors flex items-center justify-center cursor-pointer active:scale-95 border border-red-500/40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="font-['Unbounded'] text-xs sm:text-sm font-semibold text-stone-200 mb-1.5">
                    {item.summary}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                    {item.details}
                  </p>

                  {/* Screenshot Thumbnail if Command has an Image */}
                  {item.image && (
                    <div className="mt-3 pt-3 border-t border-stone-800/60">
                      <div
                        onClick={() => {
                          soundManager.playClick();
                          setPreviewImage({
                            title: `Скриншот: ${item.command}`,
                            image: item.image!,
                            desc: item.summary
                          });
                        }}
                        className="relative rounded-lg overflow-hidden border border-stone-800 hover:border-orange-500/50 cursor-pointer group/img aspect-video bg-stone-950 max-h-36"
                      >
                        <img
                          src={item.image}
                          alt={item.command}
                          className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-mono">
                          <Eye className="w-4 h-4 text-orange-400" />
                          <span>Просмотр скриншота</span>
                        </div>
                        <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-stone-950/80 text-[10px] font-mono text-stone-300 border border-stone-700 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3 text-orange-400" />
                          <span>Скриншот</span>
                        </span>
                      </div>
                    </div>
                  )}
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

      {/* SECTION 2: CUSTOM CRAFTS & SCREENSHOTS GALLERY */}
      {(activeSection === 'all' || activeSection === 'crafts') && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Hammer className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Unbounded'] text-stone-100">
                Галерея кастомных крафтов и скриншотов
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
                className="group rounded-2xl bg-stone-900/60 border border-stone-800 overflow-hidden hover:border-cyan-500/50 transition-all duration-200 cursor-pointer flex flex-col justify-between relative"
              >
                {/* Admin Delete button for custom crafts */}
                {isAdmin && craft.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCustomCraft(craft.id, craft.title);
                    }}
                    title="Удалить этот скриншот/крафт"
                    className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-lg bg-red-950/80 hover:bg-red-800 text-red-300 border border-red-500/40 flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

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
                  {craft.isCustom && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-500/40">
                      Скриншот от админа
                    </span>
                  )}
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
                      <strong className="text-stone-400 font-mono">Результат:</strong>{' '}
                      {craft.outputDescription === '???' ? (
                        <span className="font-bold text-amber-400 font-mono tracking-widest bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/40">
                          ???
                        </span>
                      ) : (
                        craft.outputDescription
                      )}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                    {craft.tags.map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded-xs bg-stone-950 border border-stone-800 text-[10px] font-mono text-cyan-400">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD NEW COMMAND (ADMIN) */}
      {isAddCommandOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-stone-900 border border-orange-500/50 p-6 sm:p-7 shadow-2xl space-y-5">
            <button
              onClick={() => setIsAddCommandOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-['Unbounded'] text-stone-100">
                  Добавить новую команду
                </h3>
                <p className="text-xs text-stone-400">
                  Команда появится в справочнике игроков сервера AUTUMN
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateCommand} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Синтаксис команды (например: /sit или /trade &lt;ник&gt;): *
                </label>
                <input
                  type="text"
                  required
                  placeholder="/mycommand"
                  value={newCmd.command}
                  onChange={(e) => setNewCmd({ ...newCmd, command: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-orange-500 font-mono text-stone-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Категория:
                  </label>
                  <select
                    value={newCmd.category}
                    onChange={(e) => setNewCmd({ ...newCmd, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-orange-500 text-stone-100"
                  >
                    <option value="custom">Кастомная (custom)</option>
                    <option value="decor">Декор (/block)</option>
                    <option value="teams">Отряды (/team)</option>
                    <option value="games">Игры (/game)</option>
                    <option value="rp">РП (/status, /lore)</option>
                    <option value="visual">Картины и арт</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 font-semibold mb-1">
                    Использование (usage):
                  </label>
                  <input
                    type="text"
                    placeholder="/mycommand [параметры]"
                    value={newCmd.usage}
                    onChange={(e) => setNewCmd({ ...newCmd, usage: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-orange-500 font-mono text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Краткое назначение: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Быстрый обмен предметами между игроками"
                  value={newCmd.summary}
                  onChange={(e) => setNewCmd({ ...newCmd, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-orange-500 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Подробное описание механики:
                </label>
                <textarea
                  rows={3}
                  placeholder="Опишите, как работает команда, что происходит в мире..."
                  value={newCmd.details}
                  onChange={(e) => setNewCmd({ ...newCmd, details: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 focus:border-orange-500 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Теги (через запятую):
                </label>
                <input
                  type="text"
                  placeholder="обмен, торговля, игроки, предметы"
                  value={newCmd.tags}
                  onChange={(e) => setNewCmd({ ...newCmd, tags: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 focus:border-orange-500 text-stone-100"
                />
              </div>

              {/* Screenshot Attachment */}
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2.5">
                <label className="block text-stone-300 font-semibold flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-orange-400" />
                    <span>Скриншот или иллюстрация к команде (необязательно):</span>
                  </span>
                  {newCmd.image && (
                    <button
                      type="button"
                      onClick={() => setNewCmd({ ...newCmd, image: '' })}
                      className="text-red-400 text-[10px] hover:underline"
                    >
                      Очистить
                    </button>
                  )}
                </label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 min-h-[38px] px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 hover:border-orange-500 text-stone-300 flex items-center justify-center gap-2 cursor-pointer transition-colors text-[11px]">
                    <Upload className="w-3.5 h-3.5 text-orange-400" />
                    <span>Загрузить с устройства</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileChange(e, (url) => setNewCmd({ ...newCmd, image: url }))}
                    />
                  </label>

                  <input
                    type="text"
                    placeholder="или ссылка/путь к изображению..."
                    value={newCmd.image}
                    onChange={(e) => setNewCmd({ ...newCmd, image: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs"
                  />
                </div>

                {newCmd.image && (
                  <div className="relative aspect-video max-h-36 bg-stone-900 rounded-lg overflow-hidden border border-orange-500/40">
                    <img src={newCmd.image} alt="Предпросмотр" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCommandOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-['Unbounded'] font-bold text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-stone-950 shadow-md active:scale-95 cursor-pointer"
                >
                  Опубликовать команду
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW CRAFT / SCREENSHOT (ADMIN) */}
      {isAddCraftOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-stone-900 border border-cyan-500/50 p-6 sm:p-7 shadow-2xl space-y-5">
            <button
              onClick={() => setIsAddCraftOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-['Unbounded'] text-stone-100">
                  Добавить скриншот или кастомный крафт
                </h3>
                <p className="text-xs text-stone-400">
                  Загрузите скриншот рецепта верстака или игровой механики
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateCraft} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Название крафта / скриншота: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Например: Магический алтарь трансмутации"
                  value={newCraft.title}
                  onChange={(e) => setNewCraft({ ...newCraft, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Категория:
                </label>
                <select
                  value={newCraft.category}
                  onChange={(e) => setNewCraft({ ...newCraft, category: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100"
                >
                  <option value="mechanics">Кастомные механики (mechanics)</option>
                  <option value="ice">Лёд и магистрали (ice)</option>
                  <option value="artifacts">Уникальные артефакты (artifacts)</option>
                  <option value="showcase">Демонстрация и витрина (showcase)</option>
                </select>
              </div>

              {/* Image upload */}
              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2.5">
                <label className="block text-stone-300 font-semibold flex items-center justify-between">
                  <span>Скриншот верстака или постройки: *</span>
                  {newCraft.image && (
                    <button
                      type="button"
                      onClick={() => setNewCraft({ ...newCraft, image: '' })}
                      className="text-red-400 text-[10px] hover:underline"
                    >
                      Очистить
                    </button>
                  )}
                </label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="flex-1 min-h-[38px] px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 hover:border-cyan-500 text-stone-300 flex items-center justify-center gap-2 cursor-pointer transition-colors text-[11px]">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Выбрать файл с ПК / телефона</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileChange(e, (url) => setNewCraft({ ...newCraft, image: url }))}
                    />
                  </label>

                  <input
                    type="text"
                    placeholder="или ссылка/путь к скриншоту..."
                    value={newCraft.image}
                    onChange={(e) => setNewCraft({ ...newCraft, image: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-200 text-xs"
                  />
                </div>

                {newCraft.image && (
                  <div className="relative aspect-video max-h-44 bg-stone-900 rounded-lg overflow-hidden border border-cyan-500/40">
                    <img src={newCraft.image} alt="Предпросмотр крафта" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Состав / ингредиенты:
                </label>
                <input
                  type="text"
                  placeholder="Например: 4 блока обсидиана + 4 алмаза + незеритовый слиток"
                  value={newCraft.inputDescription}
                  onChange={(e) => setNewCraft({ ...newCraft, inputDescription: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Результат крафта:
                </label>
                <input
                  type="text"
                  placeholder="Например: 1 кастомный предмет с уникальным эффектом"
                  value={newCraft.outputDescription}
                  onChange={(e) => setNewCraft({ ...newCraft, outputDescription: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Теги:
                </label>
                <input
                  type="text"
                  placeholder="крафт, алтарь, незерит, алмазы"
                  value={newCraft.tags}
                  onChange={(e) => setNewCraft({ ...newCraft, tags: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 focus:border-cyan-500 text-stone-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCraftOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-['Unbounded'] font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md active:scale-95 cursor-pointer"
                >
                  Сохранить скриншот
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX ZOOM MODAL (FOR CRAFTS) */}
      {selectedCraft && (
        <div
          onClick={() => setSelectedCraft(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full rounded-3xl bg-stone-900 border border-cyan-500/50 p-4 sm:p-6 shadow-2xl space-y-4"
          >
            <button
              onClick={() => setSelectedCraft(null)}
              className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg sm:text-xl font-bold font-['Unbounded'] text-stone-100 pr-10">
              {selectedCraft.title}
            </h3>

            <div className="aspect-video bg-stone-950 rounded-2xl overflow-hidden flex items-center justify-center border border-stone-800 p-2">
              <img
                src={selectedCraft.image}
                alt={selectedCraft.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-xs sm:text-sm space-y-1.5 text-stone-300 font-mono bg-stone-950/60 p-4 rounded-xl border border-stone-800">
              <p>
                <strong className="text-cyan-400">Состав:</strong> {selectedCraft.inputDescription}
              </p>
              <p>
                <strong className="text-cyan-400">Результат:</strong>{' '}
                {selectedCraft.outputDescription === '???' ? (
                  <span className="font-bold text-amber-400 font-mono tracking-widest bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                    ???
                  </span>
                ) : (
                  selectedCraft.outputDescription
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL FOR COMMAND SCREENSHOT */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full rounded-3xl bg-stone-900 border border-orange-500/50 p-4 sm:p-6 shadow-2xl space-y-4"
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3.5 right-3.5 p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg sm:text-xl font-bold font-['Unbounded'] text-stone-100 pr-10">
              {previewImage.title}
            </h3>

            <div className="aspect-video bg-stone-950 rounded-2xl overflow-hidden flex items-center justify-center border border-stone-800 p-2">
              <img
                src={previewImage.image}
                alt={previewImage.title}
                className="w-full h-full object-contain"
              />
            </div>

            {previewImage.desc && (
              <p className="text-xs sm:text-sm text-stone-300 font-mono bg-stone-950/60 p-3 rounded-xl border border-stone-800">
                {previewImage.desc}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
