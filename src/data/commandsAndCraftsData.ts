import { CraftRecipe } from '../types';

export interface CommandItem {
  command: string;
  category: 'decor' | 'teams' | 'games' | 'rp' | 'visual';
  summary: string;
  usage: string;
  details: string;
  tags: string[];
}

export const SERVER_COMMANDS: CommandItem[] = [
  {
    command: '/block',
    category: 'decor',
    summary: 'Вращение предмета над блоком для декора',
    usage: '/block',
    details: 'Держа предмет в правой руке и наводясь на блок пропишите эту команду и предмет начнет вращаться на данном блоке! Его нельзя подобрать! Чтобы взять предмет обратно, нажмите Shift + ПКМ по блоку. Отличная фишка для витрин, магазинов и украшения баз.',
    tags: ['декор', 'предметы', 'вращение', 'магазины']
  },
  {
    command: '/team create <название>',
    category: 'teams',
    summary: 'Создание клана или отряда с друзьями',
    usage: '/team create <название команды>',
    details: 'Появилась возможность сделать собственную команду! Пропишите команду /team create <название команды> и добавьте туда своих друзей. Пропишите команду /team чтобы увидеть весь список доступных возможностей отряда.',
    tags: ['команда', 'друзья', 'клан']
  },
  {
    command: '/team chat',
    category: 'teams',
    summary: 'Секретный зашифрованный чат отряда',
    usage: '/team chat <сообщение> или просто /team chat',
    details: 'Командой /team chat вы откроете свой секретный изолированный чат, где сможете приватно обмениваться сообщениями только с членами вашей команды.',
    tags: ['чат', 'команда', 'приватность']
  },
  {
    command: '/team coords & /team death',
    category: 'teams',
    summary: 'Поделиться текущими координатами и точкой смерти',
    usage: '/team coords | /team death',
    details: 'Мгновенная отправка ваших текущих координат всем соклановцам одной кнопкой! Также вы можете поделиться последней точкой смерти с тиммейтами, чтобы они помогли спасти ваши ресурсы.',
    tags: ['координаты', 'навигация', 'смерть', 'помощь']
  },
  {
    command: '/game dice',
    category: 'games',
    summary: 'Бросок игральной шестигранной кости',
    usage: '/game dice',
    details: 'Мини-игры прямо в майнкрафте! Бросайте кубик вместе с друзьями. Если выпадет 6 — вы победили! Результат виден всем участникам партии.',
    tags: ['игры', 'кости', 'удача']
  },
  {
    command: '/game choice [paper|stone|scissors]',
    category: 'games',
    summary: 'Камень, ножницы, бумага',
    usage: '/game choice [paper|stone|scissors]',
    details: 'Классическая дуэль на честность! Партия играется в 3 раунда с автоматическим подсчетом побед и ничьих.',
    tags: ['игры', 'дуэль', 'кнб']
  },
  {
    command: '/game tic tac toe',
    category: 'games',
    summary: 'Крестики-нолики в интерактивном GUI 3х3',
    usage: '/game tic tac toe',
    details: 'Полноценные крестики-нолики в удобном графическом меню сундука 3х3 с живой анимацией ходов соперников.',
    tags: ['игры', 'крестики-нолики', 'интерфейс']
  },
  {
    command: '/status [текст]',
    category: 'rp',
    summary: 'Ролевой статус персонажа в мире',
    usage: '/status [ник] или /status set <ваш статус>',
    details: 'Позволяет игрокам создать собственный статус с кратким описанием своего персонажа. Статус игрока может просмотреть каждый прямо в игре или в чате.',
    tags: ['ролевая игра', 'рп', 'персонаж']
  },
  {
    command: '/lore [текст]',
    category: 'rp',
    summary: 'Индивидуальный лор и биография героя',
    usage: '/lore set <текст вашей истории>',
    details: 'Запишите предысторию вашего скина или поселения. Лор сохраняется в базе сервера и доступен другим жителям для чтения.',
    tags: ['ролевая игра', 'история', 'биография']
  },
  {
    command: '/imageframe create <name> <url> <a x b>',
    category: 'visual',
    summary: 'Создание кастомных постеров и арт-картин',
    usage: '/imageframe create <название> <прямая ссылка> <ширина x высота>',
    details: 'Создание кастомных картин любого разрешения из интернет-ссылок! После создания команды кликните ПКМ по рамке в левом нижнем углу вашей сетки рамок, чтобы полотно автоматически растянулось.',
    tags: ['картины', 'декор', 'арт', 'рамки']
  }
];

export const CUSTOM_CRAFT_RECIPES: CraftRecipe[] = [
  {
    id: 'craft-water-to-ice',
    title: 'Ведро воды в лёд (х8)',
    category: 'ice',
    image: '/assets/aistudio/image_13cbf995.png',
    inputDescription: '1 ведро с водой по центру верстака',
    outputDescription: '8 блоков обычного льда + пустое ведро',
    tags: ['лёд', 'вода', 'строительство', 'быстрый крафт']
  },
  {
    id: 'craft-ice-to-packed',
    title: 'Обычный лёд в плотный лёд (х2)',
    category: 'ice',
    image: '/assets/aistudio/image_ac071350.png',
    inputDescription: '4 блока обычного льда квадратом 2х2',
    outputDescription: '2 блока плотного льда (Packed Ice)',
    tags: ['лёд', 'плотный лёд', 'хайвей', 'лодки']
  },
  {
    id: 'craft-packed-to-blue',
    title: 'Плотный лёд в синий лёд (х2)',
    category: 'ice',
    image: '/assets/aistudio/image_60dbd390.png',
    inputDescription: '4 блока плотного льда квадратом 2х2',
    outputDescription: '2 блока ультраскоростного синего льда (Blue Ice)',
    tags: ['синий лёд', 'магистрали', 'незер']
  },
  {
    id: 'craft-amethyst-relic',
    title: 'Аметистовый артефакт ветра',
    category: 'artifacts',
    image: '/assets/aistudio/image_e2185eb5.png',
    inputDescription: '3 аметистовых друзы сверху + 2 алмаза + 2 стержня бриза/железа',
    outputDescription: 'Мистический кастомный артефакт с тайными свойствами (?)',
    tags: ['артефакт', 'аметист', 'алмазы', 'кастомный предмет']
  },
  {
    id: 'craft-ancient-core',
    title: 'Древнее ядро глубин',
    category: 'artifacts',
    image: '/assets/aistudio/image_5577a4ad.png',
    inputDescription: 'Осколки эха древнего города + аметист + заготовки',
    outputDescription: 'Уникальное ядро для активации алтаря трансмутации',
    tags: ['ядро', 'эхо', 'варден', 'трансмутация']
  },
  {
    id: 'craft-transmutation-mechanism',
    title: 'Алтарь трансмутации блоков',
    category: 'mechanics',
    image: '/assets/aistudio/image_12aef52a.png',
    inputDescription: 'Алмазы, блоки редстоуна и очищенные железные блоки',
    outputDescription: 'Алтарь трансмутации для преобразования редких пород и блоков',
    tags: ['алтарь', 'механизм', 'трансмутация']
  }
];
