import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  ShieldAlert,
  Coins,
  Flame,
  CheckCircle2,
  Copy,
  ExternalLink,
  CreditCard,
  QrCode,
  Send,
  HelpCircle
} from 'lucide-react';
import { soundManager } from '../utils/sound';
import { DonationOrder } from '../types';

interface DonationItem {
  id: string;
  name: string;
  price: number;
  badge?: string;
  icon: string;
  description: string;
  perks: string[];
  gradient: string;
}

const DONATION_CATALOG: DonationItem[] = [
  {
    id: 'particles',
    name: 'Кастомные партиклы',
    price: 150,
    icon: '✨',
    badge: 'Популярно',
    description: 'Индивидуальный шлейф из частиц вокруг вашего персонажа при ходьбе, беге или в стойке.',
    perks: [
      'Выбор эффекта: осенние листья, руны чар, огонь души, искры или сердечки',
      'Возможность включения и выключения в любой момент',
      'Видимость для всех игроков на сервере'
    ],
    gradient: 'from-amber-600 to-orange-600'
  },
  {
    id: 'pet',
    name: 'Питомец-спутник',
    price: 300,
    icon: '🐝',
    badge: 'Уникально',
    description: 'Милый летающий компаньон, который парит рядом с вашим плечом и следует за вами повсюду.',
    perks: [
      'Доступные питомцы: пчелка, летучая мышь, лягушка, медный голем, мини-блейз, нюхач',
      'Не получает урон и не мешает строительству',
      'Индивидуальное имя для вашего питомца над головой'
    ],
    gradient: 'from-orange-600 to-rose-600'
  },
  {
    id: 'bundle',
    name: 'Набор «Осенний Дуэт» (2-в-1)',
    price: 500,
    icon: '👑',
    badge: 'Выгода 150 ₽',
    description: 'Полный комплект кастомизации: любые кастомные партиклы + летающий питомец-спутник на выбор.',
    perks: [
      'Кастомный партикл-эффект (экономия)',
      'Питомец-спутник с вашим именем',
      'Особый значок мецената в TabList и Discord'
    ],
    gradient: 'from-purple-600 via-pink-600 to-amber-600'
  },
  {
    id: 'unban',
    name: 'Разбан на сервере',
    price: 500,
    icon: '🛡️',
    badge: 'Амнистия',
    description: 'Повторный шанс для игроков, нарушивших правила сервера (за исключением критического намеренного вредительства хостингу).',
    perks: [
      'Снятие блокировки по нику и IP-адресу',
      'Сохранение вашего инвентаря и построек',
      'Рассмотрение в течение 12-24 часов администрацией'
    ],
    gradient: 'from-red-600 to-amber-600'
  }
];

export const DonationTab: React.FC = () => {
  const [selectedService, setSelectedService] = useState<DonationItem>(DONATION_CATALOG[0]);
  const [nickname, setNickname] = useState('');
  const [contact, setContact] = useState('');
  const [wishes, setWishes] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState<DonationOrder | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !contact.trim()) return;

    soundManager.playClick();
    const newOrder: DonationOrder = {
      id: `don_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      nickname: nickname.trim(),
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      price: selectedService.price,
      contact: contact.trim(),
      wishes: wishes.trim(),
      createdAt: new Date().toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'pending'
    };

    try {
      const stored = localStorage.getItem('autumn_donations');
      const list: DonationOrder[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem('autumn_donations', JSON.stringify([newOrder, ...list]));
    } catch {}

    setSubmittedOrder(newOrder);
  };

  const handleCopyDiscordOrder = () => {
    if (!submittedOrder) return;
    const text = `🍁 **Заявка на Донат AUTUMN**
Ник в игре: \`${submittedOrder.nickname}\`
Услуга: **${submittedOrder.serviceName}** (${submittedOrder.price} ₽)
Связь (Discord/TG): \`${submittedOrder.contact}\`
Пожелания/детали: ${submittedOrder.wishes || 'Стандартная выдача'}
ID заявки: \`${submittedOrder.id}\``;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-amber-300 text-xs font-mono font-semibold mb-3">
          <Heart className="w-3.5 h-3.5 text-rose-400" />
          <span>Поддержка развития сервера</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-['Unbounded'] text-stone-100 tracking-tight">
          Донат и услуги
        </h1>
        <p className="mt-3 text-sm sm:text-base text-stone-300 leading-relaxed">
          Все собранные средства на 100% идут на оплату мощного хостинга, защиту от DDoS-атак и разработку новых кастомных плагинов сервера AUTUMN.
        </p>
      </div>

      {/* Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DONATION_CATALOG.map((item) => {
          const isSelected = selectedService.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedService(item);
              }}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-stone-900/90 border-orange-500 shadow-xl shadow-orange-500/20 scale-[1.02]'
                  : 'bg-stone-900/40 border-stone-800/80 hover:border-stone-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl select-none">{item.icon}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        isSelected
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/50 font-bold'
                          : 'bg-stone-800 text-stone-400 border-stone-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-['Unbounded'] font-bold text-base text-stone-100 mb-1">
                  {item.name}
                </h3>

                <div className="text-2xl font-black font-mono text-amber-300 my-2">
                  {item.price} ₽
                </div>

                <p className="text-xs text-stone-300 leading-relaxed mb-4">
                  {item.description}
                </p>

                <ul className="space-y-1.5 text-xs text-stone-400 border-t border-stone-800/70 pt-3">
                  {item.perks.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 mt-0.5">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-800/70">
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl font-['Unbounded'] text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-500 to-amber-400 text-stone-950 shadow-md'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                  }`}
                >
                  {isSelected ? 'Выбрано' : 'Выбрать'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Submission Form & Free Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Card */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-stone-900/70 border border-stone-800 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg sm:text-xl font-bold font-['Unbounded'] text-stone-100">
              Оформление заявки на донат
            </h2>
          </div>

          {!submittedOrder ? (
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-stone-400 uppercase">
                    Выбранная услуга
                  </span>
                  <div className="font-bold text-stone-100 text-sm">
                    {selectedService.name}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black font-mono text-amber-300">
                    {selectedService.price} ₽
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 mb-1">
                  Ваш никнейм в Minecraft <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Например: Steve_Autumn"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 text-sm text-stone-100 placeholder-stone-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 mb-1">
                  Контакт для связи (Discord тег или Telegram) <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Например: discord_user#1234 или @telegram_nick"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 text-sm text-stone-100 placeholder-stone-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-stone-300 mb-1">
                  Пожелания / Детали заказа (тип партиклов, имя питомца)
                </label>
                <textarea
                  rows={3}
                  value={wishes}
                  onChange={(e) => setWishes(e.target.value)}
                  placeholder="Например: хочу эффект опадающей листвы или питомца-лягушку с именем Квак..."
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/40 text-sm text-stone-100 placeholder-stone-600 focus:outline-hidden resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full min-h-[46px] py-3 px-4 rounded-xl font-['Unbounded'] font-bold text-xs sm:text-sm text-stone-950 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 hover:scale-[1.01] active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-stone-950" />
                <span>Сформировать заявку на {selectedService.price} ₽</span>
              </button>
            </form>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-stone-100 text-sm sm:text-base font-['Unbounded']">
                    Заявка #{submittedOrder.id.slice(-6)} успешно создана!
                  </h4>
                  <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                    Данные сохранены. Скопируйте текст заявки ниже и отправьте в тикет Discord для быстрой выдачи услуги администратором.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 font-mono text-xs text-stone-300 space-y-1">
                <div>
                  <span className="text-stone-500">Ник:</span>{' '}
                  <span className="text-amber-300 font-bold">{submittedOrder.nickname}</span>
                </div>
                <div>
                  <span className="text-stone-500">Услуга:</span> {submittedOrder.serviceName} ({submittedOrder.price} ₽)
                </div>
                <div>
                  <span className="text-stone-500">Контакт:</span> {submittedOrder.contact}
                </div>
                {submittedOrder.wishes && (
                  <div>
                    <span className="text-stone-500">Детали:</span> {submittedOrder.wishes}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleCopyDiscordOrder}
                  className="flex-1 min-h-[44px] py-2.5 px-4 rounded-xl font-['Unbounded'] font-bold text-xs bg-gradient-to-r from-orange-500 to-amber-400 text-stone-950 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedText ? 'Скопировано в буфер!' : 'Скопировать текст для Discord'}</span>
                </button>

                <a
                  href="https://discord.gg/CCydRxGBB"
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[44px] px-4 py-2.5 rounded-xl font-mono text-xs text-stone-200 bg-stone-800 hover:bg-stone-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Открыть Discord</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              </div>

              <button
                onClick={() => setSubmittedOrder(null)}
                className="w-full text-center text-xs font-mono text-stone-400 hover:text-stone-200 pt-2 cursor-pointer"
              >
                ← Оформить ещё одну заявку
              </button>
            </div>
          )}
        </div>

        {/* Free Payment Integration Guide */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-stone-900/70 border border-stone-800 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-bold font-['Unbounded'] text-stone-100">
              Способы приёма оплаты
            </h3>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            Для майнкрафт-серверов отлично подходят <strong className="text-amber-300">бесплатные варианты приёма платежей</strong> без регистрации юридического лица:
          </p>

          <div className="space-y-3 text-xs">
            {/* DonationAlerts */}
            <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800">
              <div className="flex items-center justify-between font-bold text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  DonationAlerts
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-amber-500/20 text-amber-300">
                  Рекомендуем
                </span>
              </div>
              <p className="text-stone-400 mt-1">
                Бесплатная именная страница доната (карты, СБП, кошельки). Можно настроить мгновенный вебхук-уведомление в Discord канал администрации.
              </p>
            </div>

            {/* SBP */}
            <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800">
              <div className="flex items-center justify-between font-bold text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-cyan-400" />
                  СБП (Система Быстрых Платежей)
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-cyan-500/20 text-cyan-300">
                  Без комиссии
                </span>
              </div>
              <p className="text-stone-400 mt-1">
                Переводы по номеру телефона или QR-коду напрямую создателям сервера. Быстро, просто и 0% комиссии для администратора.
              </p>
            </div>

            {/* YuMoney */}
            <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800">
              <div className="flex items-center justify-between font-bold text-purple-300">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-purple-400" />
                  ЮMoney визитка / сбор
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-purple-500/20 text-purple-300">
                  Любые карты РФ
                </span>
              </div>
              <p className="text-stone-400 mt-1">
                Бесплатный персональный кошелек со страницей приёма переводов с банковских карт МИР, Visa, Mastercard.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800/80 text-[11px] text-stone-400 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              После согласования заявки в Discord администратор отправит удобную ссылку или реквизиты, а услуга на сервере активируется в течение нескольких минут!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
