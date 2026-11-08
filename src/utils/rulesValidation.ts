import { ApplicationFormData, QuizQuestion } from '../types';
import { TRICKY_QUIZ_QUESTIONS } from '../data/quizQuestions';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  quizPassed?: boolean;
  explanation?: string;
}

export const MIN_AGE_REQUIRED = 14;

export function validateApplication(data: Partial<ApplicationFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  if (data.age === undefined || data.age === null || Number.isNaN(data.age)) {
    errors.age = 'Укажите ваш возраст';
  } else if (data.age < MIN_AGE_REQUIRED) {
    errors.age = `На сервер принимаются игроки от ${MIN_AGE_REQUIRED} лет`;
  } else if (data.age > 99) {
    errors.age = 'Укажите реальный возраст';
  }

  if (!data.minecraftNick || data.minecraftNick.trim().length < 3) {
    errors.minecraftNick = 'Ник в Minecraft должен содержать не менее 3 символов';
  } else if (!/^[a-zA-Z0-9_]{3,16}$/.test(data.minecraftNick.trim())) {
    errors.minecraftNick = 'Ник может содержать только латинские буквы, цифры и знак подчеркивания (до 16 символов)';
  }

  if (!data.pastServers || data.pastServers.trim().length < 5) {
    errors.pastServers = 'Пожалуйста, опишите ваш опыт игры на подобных серверах';
  }

  if (!data.heldRoles || data.heldRoles.trim().length < 2) {
    errors.heldRoles = 'Укажите должности (или напишите "Обычный игрок")';
  }

  if (!data.pleasantGameplay || data.pleasantGameplay.trim().length < 10) {
    errors.pleasantGameplay = 'Расскажите подробнее, что для вас является приятным геймплеем (минимум 10 символов)';
  }

  if (!data.griefReaction || data.griefReaction.trim().length < 10) {
    errors.griefReaction = 'Опишите ваши действия в случае грифа (минимум 10 символов)';
  }

  let quizPassed = false;
  let explanation = '';

  if (!data.quizQuestionId || data.quizAnswerIndex === null || data.quizAnswerIndex === undefined) {
    errors.quiz = 'Необходимо ответить на контрольный вопрос по правилам';
  } else {
    const question = TRICKY_QUIZ_QUESTIONS.find(q => q.id === data.quizQuestionId);
    if (!question) {
      errors.quiz = 'Вопрос не найден, попробуйте обновить вопрос';
    } else if (data.quizAnswerIndex !== question.correctIndex) {
      errors.quiz = 'Ответ неверный. Пожалуйста, внимательнее ознакомьтесь с правилами сервера!';
      quizPassed = false;
      explanation = question.explanation;
    } else {
      quizPassed = true;
      explanation = question.explanation;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    quizPassed,
    explanation
  };
}

export function formatApplicationForDiscord(data: ApplicationFormData, quizQuestion?: QuizQuestion): string {
  return [
    '```ini',
    `[ ЗАЯВКА НА СЕРВЕР AUTUMN (26.2) ]`,
    '```',
    `**1. Ник в Minecraft:** \`${data.minecraftNick.trim()}\``,
    `**2. Возраст:** ${data.age} лет`,
    `**3. Опыт на аналогичных серверах:**\n> ${data.pastServers.trim()}`,
    `**4. Занимаемые должности:**\n> ${data.heldRoles.trim()}`,
    `**5. Что для вас приятный геймплей:**\n> ${data.pleasantGameplay.trim()}`,
    `**6. Действия в случае грифа:**\n> ${data.griefReaction.trim()}`,
    `**7. Проверка правил:** ✅ Тест на знание правил успешно пройден на сайте (${quizQuestion?.id || 'OK'})`,
    '',
    `_Сгенерировано для подачи на сервере AUTUMN (26.2)_`
  ].join('\n');
}
