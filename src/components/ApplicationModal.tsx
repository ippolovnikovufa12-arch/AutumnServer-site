import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  HelpCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Send,
  User,
  ShieldAlert,
  Flame
} from 'lucide-react';
import { ApplicationFormData, QuizQuestion } from '../types';
import { TRICKY_QUIZ_QUESTIONS, getRandomQuizQuestion } from '../data/quizQuestions';
import { validateApplication, formatApplicationForDiscord, MIN_AGE_REQUIRED } from '../utils/rulesValidation';
import { soundManager } from '../utils/sound';
import { DISCORD_INVITE_URL } from '../data/serverState';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose }) => {
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion>(TRICKY_QUIZ_QUESTIONS[0]);
  const [formData, setFormData] = useState<ApplicationFormData>({
    age: 16,
    minecraftNick: '',
    pastServers: '',
    heldRoles: '',
    pleasantGameplay: '',
    griefReaction: '',
    quizQuestionId: TRICKY_QUIZ_QUESTIONS[0].id,
    quizAnswerIndex: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [quizFailedMessage, setQuizFailedMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Initialize random tricky question on open
  useEffect(() => {
    if (isOpen) {
      const q = getRandomQuizQuestion();
      setCurrentQuiz(q);
      setFormData(prev => ({
        ...prev,
        quizQuestionId: q.id,
        quizAnswerIndex: null
      }));
      setErrors({});
      setQuizFailedMessage(null);
      setIsSuccess(false);
      setCopiedText(false);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isUnderage = formData.age !== undefined && formData.age !== null && formData.age < MIN_AGE_REQUIRED;

  const handleInputChange = (field: keyof ApplicationFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSelectQuizOption = (index: number) => {
    soundManager.playClick();
    setFormData(prev => ({ ...prev, quizAnswerIndex: index }));
    if (errors.quiz) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.quiz;
        return copy;
      });
    }
  };

  const handleShuffleQuiz = () => {
    soundManager.playClick();
    const nextQ = getRandomQuizQuestion(currentQuiz.id);
    setCurrentQuiz(nextQ);
    setFormData(prev => ({
      ...prev,
      quizQuestionId: nextQ.id,
      quizAnswerIndex: null
    }));
    setQuizFailedMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isUnderage) {
      soundManager.playError();
      setErrors({ age: `На сервер принимаются игроки от ${MIN_AGE_REQUIRED} лет. Заполнение недоступно.` });
      return;
    }

    const validation = validateApplication(formData);

    if (!validation.isValid) {
      soundManager.playError();
      setErrors(validation.errors);

      // If quiz failed specifically, change the question to another one from the pool
      if (validation.quizPassed === false && validation.errors.quiz) {
        setQuizFailedMessage(
          `Неверный ответ! ${validation.explanation || ''} Для повторной попытки мы заменили вопрос на другой.`
        );
        // Switch to a different question
        setTimeout(() => {
          const nextQ = getRandomQuizQuestion(currentQuiz.id);
          setCurrentQuiz(nextQ);
          setFormData(prev => ({
            ...prev,
            quizQuestionId: nextQ.id,
            quizAnswerIndex: null
          }));
        }, 300);
      }
      return;
    }

    // Success!
    soundManager.playSuccess();
    setErrors({});
    setQuizFailedMessage(null);
    setIsSuccess(true);
  };

  const handleCopyDiscordText = () => {
    soundManager.playClick();
    const text = formatApplicationForDiscord(formData, currentQuiz);
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[94vh] sm:max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl bg-stone-950 border border-orange-500/40 shadow-[0_0_50px_rgba(249,115,22,0.3)] p-4 sm:p-8 text-stone-100">
        
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
            <span className="text-xl">🍂</span>
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest text-orange-400 uppercase">
              Вступление на сервер AUTUMN
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold font-['Unbounded'] text-stone-100">
            {isSuccess ? 'Анкета сформирована!' : 'Анкета кандидата'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            {isSuccess
              ? 'Скопируйте сгенерированный текст и отправьте его в канал #заявки нашего Discord-сервера.'
              : 'Заполните форму ниже, ответьте на контрольный вопрос по правилам и получите доступ в Discord.'}
          </p>
        </div>

        {/* Success Screen */}
        {isSuccess ? (
          <div className="space-y-5 sm:space-y-6 animate-in zoom-in-95 duration-200">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-['Unbounded'] font-bold text-xs sm:text-sm text-emerald-300">
                  Тест пройден! Анкета готова к отправке
                </h4>
                <p className="text-xs text-emerald-200/80 mt-1">
                  Вы правильно ответили на вопрос по правилам сервера. Скопируйте текст заявки и перейдите в Discord.
                </p>
              </div>
            </div>

            {/* Formatted Text Box */}
            <div className="relative">
              <label className="block text-xs font-mono text-stone-400 mb-2">
                Сгенерированный текст для Discord:
              </label>
              <pre className="p-4 rounded-xl bg-stone-900/90 border border-stone-800 text-xs sm:text-sm font-mono text-amber-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-60">
                {formatApplicationForDiscord(formData, currentQuiz)}
              </pre>
            </div>

            {/* Actions: Copy & Go to Discord */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleCopyDiscordText}
                className="flex-1 py-3.5 px-6 rounded-xl font-['Unbounded'] font-bold text-sm bg-stone-800 hover:bg-stone-700 text-white border border-stone-600 hover:border-orange-500 transition-all flex items-center justify-center gap-2 hover:scale-102 active:scale-95 cursor-pointer shadow-md"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Текст скопирован!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-orange-400" />
                    <span>Скопировать анкету</span>
                  </>
                )}
              </button>

              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundManager.playClick()}
                className="flex-1 py-3.5 px-6 rounded-xl font-['Unbounded'] font-bold text-sm text-stone-950 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 hover:from-orange-400 hover:to-amber-300 shadow-[0_0_25px_rgba(249,115,22,0.6)] transition-all flex items-center justify-center gap-2 hover:scale-105 active:scale-95 text-center cursor-pointer border border-amber-300/40"
              >
                <span>Перейти в Discord</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setIsSuccess(false)}
                className="text-xs text-stone-400 hover:text-orange-400 underline cursor-pointer"
              >
                ← Вернуться и отредактировать ответы
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Age Question with Strict Gate */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs sm:text-sm font-semibold text-stone-200 flex items-center gap-1.5">
                  <span>1. Сколько вам лет?</span>
                  <span className="text-orange-400">*</span>
                </label>
                <span className="text-[11px] font-mono text-stone-400">
                  Ограничение: от 14 лет
                </span>
              </div>
              <input
                type="number"
                min="1"
                max="99"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                placeholder="Например: 16"
                className={`w-full px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl bg-stone-900 border text-base sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-hidden focus:ring-2 transition-all ${
                  isUnderage || errors.age
                    ? 'border-red-500/80 focus:ring-red-500/50 bg-red-950/20'
                    : 'border-stone-800 focus:border-orange-500 focus:ring-orange-500/40'
                }`}
              />
              {isUnderage && (
                <div className="mt-2 p-3 rounded-xl bg-red-950/50 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-300 animate-in fade-in duration-200">
                  <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Возрастное ограничение</strong>
                    К сожалению, на сервер AUTUMN принимаются игроки исключительно от 14 лет. 
                    Заполнение анкеты заблокировано.
                  </div>
                </div>
              )}
              {errors.age && !isUnderage && (
                <p className="mt-1 text-xs text-red-400">{errors.age}</p>
              )}
            </div>

            {/* Minecraft Nickname */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-stone-200 mb-1.5">
                2. Ник в Minecraft <span className="text-orange-400">*</span>
              </label>
              <input
                type="text"
                disabled={isUnderage}
                value={formData.minecraftNick}
                onChange={(e) => handleInputChange('minecraftNick', e.target.value)}
                placeholder="Ваш точный игровой никнейм"
                className={`w-full px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl bg-stone-900 border text-base sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-hidden focus:ring-2 transition-all disabled:opacity-50 ${
                  errors.minecraftNick
                    ? 'border-red-500/80 focus:ring-red-500/50'
                    : 'border-stone-800 focus:border-orange-500 focus:ring-orange-500/40'
                }`}
              />
              {errors.minecraftNick && (
                <p className="mt-1 text-xs text-red-400">{errors.minecraftNick}</p>
              )}
            </div>

            {/* Past Servers */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-stone-200 mb-1.5">
                3. Играли ли вы когда-нибудь на подобных серверах, если да, то каких? <span className="text-orange-400">*</span>
              </label>
              <input
                type="text"
                disabled={isUnderage}
                value={formData.pastServers}
                onChange={(e) => handleInputChange('pastServers', e.target.value)}
                placeholder="Приватные SMP, ванильные проекты, ролевые сервера или первый опыт"
                className={`w-full px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl bg-stone-900 border text-base sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-hidden focus:ring-2 transition-all disabled:opacity-50 ${
                  errors.pastServers
                    ? 'border-red-500/80 focus:ring-red-500/50'
                    : 'border-stone-800 focus:border-orange-500 focus:ring-orange-500/40'
                }`}
              />
              {errors.pastServers && (
                <p className="mt-1 text-xs text-red-400">{errors.pastServers}</p>
              )}
            </div>

            {/* Held Roles */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-stone-200 mb-1.5">
                4. Какие должности занимали? <span className="text-orange-400">*</span>
              </label>
              <input
                type="text"
                disabled={isUnderage}
                value={formData.heldRoles}
                onChange={(e) => handleInputChange('heldRoles', e.target.value)}
                placeholder="Обычный игрок, мэр города, строитель, куратор, модератор..."
                className={`w-full px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl bg-stone-900 border text-base sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-hidden focus:ring-2 transition-all disabled:opacity-50 ${
                  errors.heldRoles
                    ? 'border-red-500/80 focus:ring-red-500/50'
                    : 'border-stone-800 focus:border-orange-500 focus:ring-orange-500/40'
                }`}
              />
              {errors.heldRoles && (
                <p className="mt-1 text-xs text-red-400">{errors.heldRoles}</p>
              )}
            </div>

            {/* Pleasant Gameplay */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-stone-200 mb-1.5">
                5. Что для вас приятный геймплей? <span className="text-orange-400">*</span>
              </label>
              <textarea
                rows={2}
                disabled={isUnderage}
                value={formData.pleasantGameplay}
                onChange={(e) => handleInputChange('pleasantGameplay', e.target.value)}
                placeholder="Что вам больше всего нравится в Minecraft: уютное строительство, торговля, ивенты, общение..."
                className={`w-full px-3.5 sm:px-4 py-2.5 rounded-xl bg-stone-900 border text-base sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-hidden focus:ring-2 transition-all resize-none disabled:opacity-50 ${
                  errors.pleasantGameplay
                    ? 'border-red-500/80 focus:ring-red-500/50'
                    : 'border-stone-800 focus:border-orange-500 focus:ring-orange-500/40'
                }`}
              />
              {errors.pleasantGameplay && (
                <p className="mt-1 text-xs text-red-400">{errors.pleasantGameplay}</p>
              )}
            </div>

            {/* Grief Situation Reaction */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-stone-200 mb-1.5">
                6. Представим ситуацию: вас загриферили, что вы сделаете? <span className="text-orange-400">*</span>
              </label>
              <textarea
                rows={2}
                disabled={isUnderage}
                value={formData.griefReaction}
                onChange={(e) => handleInputChange('griefReaction', e.target.value)}
                placeholder="Опишите ваши действия (например: зафиксирую координаты, напишу тикет в Discord, не буду мстить)..."
                className={`w-full px-3.5 sm:px-4 py-2.5 rounded-xl bg-stone-900 border text-base sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-hidden focus:ring-2 transition-all resize-none disabled:opacity-50 ${
                  errors.griefReaction
                    ? 'border-red-500/80 focus:ring-red-500/50'
                    : 'border-stone-800 focus:border-orange-500 focus:ring-orange-500/40'
                }`}
              />
              {errors.griefReaction && (
                <p className="mt-1 text-xs text-red-400">{errors.griefReaction}</p>
              )}
            </div>

            {/* Tricky Rules Question with Multiple Choice */}
            <div className="pt-2 p-4 sm:p-5 rounded-2xl bg-orange-950/25 border border-orange-500/30">
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="font-['Unbounded'] font-bold text-xs sm:text-sm text-amber-200">
                    7. Контрольный вопрос на знание правил
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleShuffleQuiz}
                  className="min-h-[36px] text-stone-400 hover:text-orange-300 p-1.5 rounded-md text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  title="Сменить вопрос"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-mono hidden sm:inline">Другой вопрос</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-stone-200 font-medium mb-3 leading-relaxed">
                {currentQuiz.question}
              </p>

              <div className="space-y-2">
                {currentQuiz.options.map((option, idx) => {
                  const isSelected = formData.quizAnswerIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isUnderage}
                      onClick={() => handleSelectQuizOption(idx)}
                      className={`w-full min-h-[46px] text-left p-3 sm:p-3.5 rounded-xl border text-xs sm:text-sm transition-all duration-200 flex items-start gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-orange-600/30 border-orange-500 text-amber-100 shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                          : 'bg-stone-900/80 hover:bg-stone-800/80 border-stone-800 hover:border-orange-500/40 text-stone-300'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center text-[10px] ${
                          isSelected
                            ? 'border-orange-400 bg-orange-500 text-stone-950 font-bold'
                            : 'border-stone-600'
                        }`}
                      >
                        {isSelected && '✓'}
                      </span>
                      <span className="leading-tight">{option}</span>
                    </button>
                  );
                })}
              </div>

              {quizFailedMessage && (
                <div className="mt-3 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 animate-in fade-in duration-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>{quizFailedMessage}</div>
                </div>
              )}

              {errors.quiz && !quizFailedMessage && (
                <p className="mt-2 text-xs text-red-400">{errors.quiz}</p>
              )}
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isUnderage}
                className="w-full min-h-[48px] sm:min-h-[52px] py-3.5 sm:py-4 px-4 rounded-xl font-['Unbounded'] font-bold text-xs sm:text-sm md:text-base text-stone-950 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 hover:from-orange-400 hover:to-amber-300 shadow-[0_0_25px_rgba(249,115,22,0.6)] hover:shadow-[0_0_35px_rgba(249,115,22,0.8)] border border-amber-300/40 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-stone-950" />
                <span>Проверить и сформировать анкету</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
