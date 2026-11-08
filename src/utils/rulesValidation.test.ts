import test from 'node:test';
import assert from 'node:assert/strict';
import { validateApplication, formatApplicationForDiscord, MIN_AGE_REQUIRED } from './rulesValidation';
import { TRICKY_QUIZ_QUESTIONS } from '../data/quizQuestions';

test('validation rejects age below 14', () => {
  const result = validateApplication({
    age: 13,
    minecraftNick: 'Steve_Craft',
    pastServers: 'Vanilla SMP servers',
    heldRoles: 'Обычный игрок',
    pleasantGameplay: 'Спокойное строительство и общение',
    griefReaction: 'Напишу тикет администрации с координатами',
    quizQuestionId: TRICKY_QUIZ_QUESTIONS[0].id,
    quizAnswerIndex: TRICKY_QUIZ_QUESTIONS[0].correctIndex
  });

  assert.equal(result.isValid, false);
  assert.match(result.errors.age, /14 лет/);
});

test('validation accepts age 14 or above with all valid fields', () => {
  const result = validateApplication({
    age: 15,
    minecraftNick: 'AutumnPlayer',
    pastServers: 'Играл на приватных RP проектах',
    heldRoles: 'Модератор чата',
    pleasantGameplay: 'Уютный совместный быт и торговля в городах',
    griefReaction: 'Зафиксирую логи через CoreProtect и сообщу в тикет',
    quizQuestionId: TRICKY_QUIZ_QUESTIONS[0].id,
    quizAnswerIndex: TRICKY_QUIZ_QUESTIONS[0].correctIndex
  });

  assert.equal(result.isValid, true);
  assert.equal(result.quizPassed, true);
});

test('validation rejects incorrect quiz answer and provides explanation', () => {
  const question = TRICKY_QUIZ_QUESTIONS[0];
  const wrongIndex = (question.correctIndex + 1) % question.options.length;

  const result = validateApplication({
    age: 16,
    minecraftNick: 'AutumnHero',
    pastServers: 'SMP vanilla projects',
    heldRoles: 'Строитель',
    pleasantGameplay: 'Развитие ферм и уютных баз',
    griefReaction: 'Не буду устраивать самосуд, позову админа',
    quizQuestionId: question.id,
    quizAnswerIndex: wrongIndex
  });

  assert.equal(result.isValid, false);
  assert.equal(result.quizPassed, false);
  assert.match(result.errors.quiz, /неверный/i);
  assert.equal(result.explanation, question.explanation);
});

test('formatApplicationForDiscord generates valid markdown', () => {
  const output = formatApplicationForDiscord({
    age: 16,
    minecraftNick: 'Alex_Master',
    pastServers: 'SubShield, SP',
    heldRoles: 'Игрок',
    pleasantGameplay: 'Кооперативная игра и постройки',
    griefReaction: 'Подам жалобу в дискорде с логами',
    quizQuestionId: 'q_chests',
    quizAnswerIndex: 2
  });

  assert.match(output, /Alex_Master/);
  assert.match(output, /16 лет/);
  assert.match(output, /ЗАЯВКА НА СЕРВЕР AUTUMN/);
});
