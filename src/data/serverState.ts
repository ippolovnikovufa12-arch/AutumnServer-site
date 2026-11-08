import { ServerEvent, ServerUpdate } from '../types';

export const INITIAL_EVENTS: ServerEvent[] = [
  {
    id: 'evt-1',
    title: 'Встреча новичков на спавне',
    date: '18:00 МСК',
    location: 'Центральная площадь Спавна',
    description: 'Встреча новоприбывших игроков проекта AUTUMN. Экскурсия по ключевым городам сервера, выдача приветственного стартового набора для комфортного выживания и знакомство с комьюнити.',
    badge: 'Главный ивент',
    status: 'upcoming'
  }
];

export const INITIAL_UPDATES: ServerUpdate[] = [
  {
    id: 'upd-1',
    version: '26.2',
    title: 'Разработка механики алхимии и боссов для сервера',
    date: 'В разработке',
    description: 'Алхимия добавит отдельную ветку геймплея, а боссы дадут новый опыт игры.',
    highlights: [],
    inProgress: true
  }
];

export const DISCORD_INVITE_URL = 'https://discord.gg/CCydRxGBB';
export const SERVER_VERSION = '26.2';
export const ADMIN_DEFAULT_PASSWORD = 'autumn2026admin';

