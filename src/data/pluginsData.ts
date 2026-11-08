import { PluginItem } from '../types';

export const PLUGINS_DATA: PluginItem[] = [
  // 15 Custom plugins developed for AUTUMN
  {
    id: 'daily-merchant',
    name: 'DailyMerchant',
    isCustom: true,
    description: 'Добавляет нпс торговцев с динамичными диалогами в игру.',
    category: 'economy'
  },
  {
    id: 'dungeon-core',
    name: 'DungeonCore',
    isCustom: true,
    description: 'Добавляет новые дажны в игру',
    category: 'mechanics'
  },
  {
    id: 'global-events',
    name: 'GlobalEvents',
    isCustom: true,
    description: 'Добавляет динамичные погодные ивенты, которые охватывают не только верхний мир.',
    category: 'mechanics'
  },
  {
    id: 'helper-plugin',
    name: 'HelperPlugin',
    isCustom: true,
    description: 'Добавляет двух милых нпс помошников на спавн, в которых можно ознакомиться с лором и с основными механиками.',
    category: 'admin'
  },
  {
    id: 'player-status',
    name: 'PlayerStatus',
    isCustom: true,
    description: 'Позволяет создать игрокам собвствнный статус с описнаием и лором своего персонажа. Статус игрока может просмотреть каждый.',
    category: 'core'
  },
  {
    id: 'team-games',
    name: 'TeamGames',
    isCustom: true,
    description: 'Позволяет создать команды/группы игроков и играть с друзьями в камень ножницы бумагу, крестики нолики и кости прямо в игре.',
    category: 'mechanics'
  },
  {
    id: 'transmutation',
    name: 'Transmutation',
    isCustom: true,
    description: 'Добавляет в мир алтарь трансмутации, позволяющий преобразовывать одни блоки в другие.',
    category: 'mechanics'
  },
  {
    id: 'trial-tools',
    name: 'TrialTools',
    isCustom: true,
    description: 'Добавляет кастомные спавнера и храниляща испытаний.',
    category: 'mechanics'
  },
  {
    id: 'faststats',
    name: 'faststats',
    isCustom: true,
    description: 'Ускоренная обработка и оптимизированный трекинг игровых достижений.',
    category: 'core'
  },
  {
    id: 'local-chat',
    name: 'LocalChat',
    isCustom: true,
    description: 'Разделение глобального и локального чата в радиусе 100 блоков с префиксами.',
    category: 'chat'
  },
  {
    id: 'simple-frames',
    name: 'SimpleFrames',
    isCustom: true,
    description: 'Невидимые рамки и удобное позиционирование выставочных предметов.',
    category: 'visual'
  },
  {
    id: 'top-stats',
    name: 'TopStats',
    isCustom: true,
    description: 'Таблица лидеров сервера по времени в игре, добытым ресурсам и достижениям.',
    category: 'core'
  },
  {
    id: 'trade-manager',
    name: 'TradeManager',
    isCustom: true,
    description: 'Безопасный обмен предметами между игроками без риска обмана.',
    category: 'economy'
  },
  {
    id: 'utils',
    name: 'Utils',
    isCustom: true,
    description: 'Набор вспомогательных утилит для стабильной работы и оптимизации сервера.',
    category: 'core'
  },
  {
    id: 'villager-modifications',
    name: 'VillagerModifications',
    isCustom: true,
    description: 'Балансировка профессий деревенских жителей и защита от абуза торговли.',
    category: 'mechanics'
  },

  // Public / Modrinth plugins with brief descriptions
  {
    id: 'brewery-x',
    name: 'BreweryX',
    isCustom: false,
    description: 'Система реалистичного пивоварения, дистилляции и выдержки в дубовых бочках',
    category: 'mechanics',
    modrinthUrl: 'https://modrinth.com/plugin/breweryx'
  },
  {
    id: 'core-protect',
    name: 'CoreProtect',
    isCustom: false,
    description: 'Логирование действий, инспекция каждого блока и моментальный откат последствий грифа',
    category: 'admin',
    modrinthUrl: 'https://modrinth.com/plugin/coreprotect'
  },
  {
    id: 'voice-chat',
    name: 'voicechat (Simple Voice Chat)',
    isCustom: false,
    description: 'Позиционный объемный 3D-голосовой чат прямо в игровом процессе',
    category: 'chat',
    modrinthUrl: 'https://modrinth.com/plugin/simple-voice-chat'
  },
  {
    id: 'customizable-player-models',
    name: 'CustomizablePlayerModels (CPM)',
    isCustom: false,
    description: 'Поддержка кастомных 3D-моделей скинов, аксессуаров и индивидуальных анимаций',
    category: 'visual',
    modrinthUrl: 'https://modrinth.com/plugin/custom-player-models'
  },
  {
    id: 'gsit',
    name: 'GSit',
    isCustom: false,
    description: 'Позы персонажа: возможность сидеть на ступеньках, лежать на кровати и ползать',
    category: 'visual',
    modrinthUrl: 'https://modrinth.com/plugin/gsit'
  },
  {
    id: 'discord-srv',
    name: 'DiscordSRV',
    isCustom: false,
    description: 'Бесшовная синхронизация игрового чата сервера с каналами Discord',
    category: 'chat',
    modrinthUrl: 'https://modrinth.com/plugin/discordsrv'
  },
  {
    id: 'chunky',
    name: 'Chunky',
    isCustom: false,
    description: 'Предварительная фоновая генерация чанков мира без фризов при исследовании',
    category: 'core',
    modrinthUrl: 'https://modrinth.com/plugin/chunky'
  },
  {
    id: 'image-frame',
    name: 'ImageFrame',
    isCustom: false,
    description: 'Загрузка и рендеринг постеров, картин и карт на рамках в игре',
    category: 'visual',
    modrinthUrl: 'https://modrinth.com/plugin/imageframe'
  },
  {
    id: 'skins-restorer',
    name: 'SkinsRestorer',
    isCustom: false,
    description: 'Отображение и моментальная смена скинов для всех игроков без перезапуска',
    category: 'visual',
    modrinthUrl: 'https://modrinth.com/plugin/skinsrestorer'
  },
  {
    id: 'url-custom-discs',
    name: 'URLCustomDiscs',
    isCustom: false,
    description: 'Проигрывание кастомной музыки и треков на пластинках через веб-ссылки',
    category: 'mechanics',
    modrinthUrl: 'https://modrinth.com/plugin/urlcustomdiscs'
  },
  {
    id: 'luck-perms',
    name: 'LuckPerms',
    isCustom: false,
    description: 'Современная производительная система прав, групп и префиксов',
    category: 'admin',
    modrinthUrl: 'https://modrinth.com/plugin/luckperms'
  },
  {
    id: 'tab',
    name: 'TAB',
    isCustom: false,
    description: 'Информативный список игроков (TabList) с пингом, префиксами и анимациями',
    category: 'visual',
    modrinthUrl: 'https://modrinth.com/plugin/tab'
  },
  {
    id: 'spark',
    name: 'spark',
    isCustom: false,
    description: 'Высокоточный профилировщик производительности, TPS, памяти и загрузки CPU',
    category: 'admin',
    modrinthUrl: 'https://modrinth.com/plugin/spark'
  },
  {
    id: 'wood-cutter',
    name: 'WoodCutter',
    isCustom: false,
    description: 'Обработка любых видов древесины на камнерезе с расширенным выходом досок',
    category: 'mechanics',
    modrinthUrl: 'https://modrinth.com/plugin/woodcutter'
  },
  {
    id: 'fast-leaf-decay',
    name: 'FastLeafDecay',
    isCustom: false,
    description: 'Ускоренное опадание листвы после спиливания ствола дерева',
    category: 'mechanics',
    modrinthUrl: 'https://modrinth.com/plugin/fastleafdecay'
  },
  {
    id: 'easy-armor-stands',
    name: 'EasyArmorStands',
    isCustom: false,
    description: 'Удобное редактирование стоек для брони, позиций рук и создание статуй',
    category: 'visual',
    modrinthUrl: 'https://modrinth.com/plugin/easyarmorstands'
  },
  {
    id: 'pat-pat-plugin',
    name: 'PatPatPlugin',
    isCustom: false,
    description: 'Милые анимации взаимодействия: погладить друга или питомца с частицами',
    category: 'visual',
    modrinthUrl: 'https://modrinth.com/plugin/patpat'
  },
  {
    id: 'head-drop',
    name: 'HeadDrop',
    isCustom: false,
    description: 'Шанс выпадения голов мобов и игроков в качестве памятных трофеев',
    category: 'mechanics',
    modrinthUrl: 'https://modrinth.com/plugin/headdrop'
  },
  {
    id: 'super-vanish',
    name: 'SuperVanish',
    isCustom: false,
    description: 'Невидимость модераторов для незаметного выявления читеров и нарушителей',
    category: 'admin',
    modrinthUrl: 'https://modrinth.com/plugin/supervanish'
  },
  {
    id: 'fawe',
    name: 'FastAsyncWorldEdit',
    isCustom: false,
    description: 'Быстрое асинхронное терраформирование и работа с большими постройками',
    category: 'admin',
    modrinthUrl: 'https://modrinth.com/plugin/fastasyncworldedit'
  },
  {
    id: 'sleeper',
    name: 'Sleeper',
    isCustom: false,
    description: 'Динамический пропуск ночи при сне части игроков на сервере',
    category: 'mechanics',
    modrinthUrl: 'https://modrinth.com/plugin/sleeper'
  },
  {
    id: 'placeholder-api',
    name: 'PlaceholderAPI',
    isCustom: false,
    description: 'Библиотека плейсхолдеров и переменных для отображения статистики',
    category: 'core',
    modrinthUrl: 'https://modrinth.com/plugin/placeholderapi'
  },
  {
    id: 'clear-lag',
    name: 'ClearLag',
    isCustom: false,
    description: 'Умный контроль упавших предметов и оптимизация серверной нагрузки',
    category: 'core',
    modrinthUrl: 'https://modrinth.com/plugin/clearlag'
  },
  {
    id: 'simple-emojis',
    name: 'SimpleEmojis',
    isCustom: false,
    description: 'Использование текстовых эмодзи и символов в сообщениях чата',
    category: 'chat',
    modrinthUrl: 'https://modrinth.com/plugin/simpleemojis'
  },
  {
    id: 'simple-login',
    name: 'SimpleLogin',
    isCustom: false,
    description: 'Быстрая и безопасная авторизация аккаунтов игроков при входе',
    category: 'core',
    modrinthUrl: 'https://modrinth.com/plugin/simplelogin'
  },
  {
    id: 'barrier',
    name: 'Barrier',
    isCustom: false,
    description: 'Ограничение зон спавна и сюжетных локаций невидимыми блоками',
    category: 'core'
  },
  {
    id: 'b-stats',
    name: 'bStats',
    isCustom: false,
    description: 'Метрики и телеметрия производительности сервера',
    category: 'core'
  }
];
