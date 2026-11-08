export interface PluginItem {
  id: string;
  name: string;
  isCustom: boolean; // 15 custom plugins
  description?: string; // Custom or Modrinth description
  category: 'core' | 'mechanics' | 'visual' | 'chat' | 'admin' | 'economy';
  modrinthUrl?: string;
}

export interface RuleCategory {
  id: string;
  number: number;
  title: string;
  shortLabel?: string;
  iconName: string;
  summary: string;
  keyPoints: string[];
  warning?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ServerEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  badge: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface ServerUpdate {
  id: string;
  version: string;
  title: string;
  date: string;
  description: string;
  highlights: string[];
  inProgress: boolean;
}

export interface ApplicationFormData {
  age: number;
  minecraftNick: string;
  pastServers: string;
  heldRoles: string;
  pleasantGameplay: string;
  griefReaction: string;
  quizQuestionId: string;
  quizAnswerIndex: number | null;
}

export interface DonationOrder {
  id: string;
  nickname: string;
  serviceId: string;
  serviceName: string;
  price: number;
  contact: string; // Discord tag or Telegram username
  wishes: string;
  createdAt: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface CraftRecipe {
  id: string;
  title: string;
  category: 'ice' | 'artifacts' | 'mechanics';
  image: string;
  inputDescription: string;
  outputDescription: string;
  tags: string[];
}
