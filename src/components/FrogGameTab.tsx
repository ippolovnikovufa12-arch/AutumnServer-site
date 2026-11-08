import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Award,
  Copy,
  Check,
  ExternalLink,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';
import { soundManager } from '../utils/sound';

interface Obstacle {
  x: number;
  width: number;
  height: number;
  type: 'stalagmite' | 'deepslate' | 'bat';
  passed?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export const FrogGameTab: React.FC = () => {
  const [nickname, setNickname] = useState(() => {
    try {
      return localStorage.getItem('autumn_frog_nick') || '';
    } catch {
      return '';
    }
  });
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('autumn_frog_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedClaim, setCopiedClaim] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameStateRef = useRef({
    frogY: 0,
    frogVy: 0,
    frogGroundY: 160,
    isJumping: false,
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    speed: 4,
    score: 0,
    lastObstacleTime: 0,
    animFrame: 0,
    wonTriggered: false
  });

  // Save nickname
  const handleSetNick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    try {
      localStorage.setItem('autumn_frog_nick', nickname.trim());
    } catch {}
    setHasStarted(true);
    startGame();
  };

  const jump = useCallback(() => {
    const s = gameStateRef.current;
    if (!s.isJumping) {
      s.frogVy = -9.2;
      s.isJumping = true;
      if (soundEnabled) soundManager.playClick();

      // Slime jump particles
      for (let i = 0; i < 6; i++) {
        s.particles.push({
          x: 60 + Math.random() * 16,
          y: s.frogGroundY + 18,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 2 - 1,
          size: Math.random() * 3 + 2,
          color: '#84cc16',
          life: 0,
          maxLife: 20
        });
      }
    }
  }, [soundEnabled]);

  const startGame = useCallback(() => {
    soundManager.playClick();
    setIsGameOver(false);
    setIsWon(false);
    setIsPlaying(true);
    setScore(0);

    const groundY = 160;
    gameStateRef.current = {
      frogY: groundY,
      frogVy: 0,
      frogGroundY: groundY,
      isJumping: false,
      obstacles: [],
      particles: [],
      speed: 4.2,
      score: 0,
      lastObstacleTime: performance.now(),
      animFrame: 0,
      wonTriggered: false
    };
  }, []);

  // Main Canvas game loop
  useEffect(() => {
    if (!isPlaying) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Prevent blur on canvas
    const width = 640;
    const height = 240;
    canvas.width = width;
    canvas.height = height;

    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      const s = gameStateRef.current;

      // 1. Update score & speed
      s.score += dt * 45; // ~45 pts per second
      const currentScoreInt = Math.floor(s.score);
      setScore(currentScoreInt);

      // Speed progression
      s.speed = 4.2 + Math.min(currentScoreInt / 200, 4.5);

      // Check win condition (1000 points)
      if (currentScoreInt >= 1000 && !s.wonTriggered) {
        s.wonTriggered = true;
        setIsWon(true);
        setIsPlaying(false);
        if (currentScoreInt > highScore) {
          setHighScore(currentScoreInt);
          try {
            localStorage.setItem('autumn_frog_highscore', currentScoreInt.toString());
          } catch {}
        }
        return;
      }

      // 2. Update Frog Physics
      const gravity = 24;
      s.frogVy += gravity * dt;
      s.frogY += s.frogVy * 60 * dt;

      if (s.frogY >= s.frogGroundY) {
        s.frogY = s.frogGroundY;
        s.frogVy = 0;
        s.isJumping = false;
      }

      // 3. Spawn Obstacles
      const minDistanceTime = Math.max(1100, 2200 - s.speed * 120);
      if (timestamp - s.lastObstacleTime > minDistanceTime && Math.random() < 0.35) {
        s.lastObstacleTime = timestamp;
        const typeRand = Math.random();
        if (typeRand < 0.6) {
          // Stalagmite spike
          s.obstacles.push({
            x: width + 20,
            width: 18,
            height: 28 + Math.random() * 14,
            type: 'stalagmite'
          });
        } else {
          // Deepslate block
          s.obstacles.push({
            x: width + 20,
            width: 24,
            height: 22,
            type: 'deepslate'
          });
        }
      }

      // 4. Move Obstacles & Collision Check
      const frogBox = {
        x: 60 + 4,
        y: s.frogY + 4,
        width: 24,
        height: 20
      };

      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const obs = s.obstacles[i];
        obs.x -= s.speed * 60 * dt;

        // Collision check
        const obsBox = {
          x: obs.x,
          y: s.frogGroundY + 24 - obs.height,
          width: obs.width,
          height: obs.height
        };

        const collision =
          frogBox.x < obsBox.x + obsBox.width &&
          frogBox.x + frogBox.width > obsBox.x &&
          frogBox.y + frogBox.height > obsBox.y &&
          frogBox.y < obsBox.y + obsBox.height;

        if (collision) {
          setIsGameOver(true);
          setIsPlaying(false);
          if (currentScoreInt > highScore) {
            setHighScore(currentScoreInt);
            try {
              localStorage.setItem('autumn_frog_highscore', currentScoreInt.toString());
            } catch {}
          }
          return;
        }

        // Remove offscreen
        if (obs.x + obs.width < -20) {
          s.obstacles.splice(i, 1);
        }
      }

      // 5. Update particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life >= p.maxLife) {
          s.particles.splice(i, 1);
        }
      }

      // ================= DRAWING =================
      ctx.clearRect(0, 0, width, height);

      // Cave Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0c0a09');
      bgGrad.addColorStop(0.7, '#1c1917');
      bgGrad.addColorStop(1, '#292524');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Cave ceiling stalactites
      ctx.fillStyle = '#44403c';
      for (let i = 0; i < width; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 16, ((i * 13) % 20) + 12);
        ctx.lineTo(i + 32, 0);
        ctx.fill();
      }

      // Ground (Deepslate tiles with moss)
      const groundTop = s.frogGroundY + 24;
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, groundTop, width, height - groundTop);

      // Deepslate top moss border
      ctx.fillStyle = '#4d7c0f'; // Glow lichen / moss
      ctx.fillRect(0, groundTop, width, 4);

      // Ground grid details
      ctx.fillStyle = '#292524';
      for (let x = 0; x < width; x += 16) {
        ctx.fillRect(x, groundTop + 8, 14, 2);
        ctx.fillRect(x + 8, groundTop + 18, 14, 2);
      }

      // Draw obstacles
      s.obstacles.forEach((obs) => {
        const obsY = groundTop - obs.height;
        if (obs.type === 'stalagmite') {
          // Sharp rock spike
          ctx.fillStyle = '#78716c';
          ctx.beginPath();
          ctx.moveTo(obs.x, groundTop);
          ctx.lineTo(obs.x + obs.width / 2, obsY);
          ctx.lineTo(obs.x + obs.width, groundTop);
          ctx.fill();

          // Dripstone highlight
          ctx.fillStyle = '#a8a29e';
          ctx.beginPath();
          ctx.moveTo(obs.x + 2, groundTop);
          ctx.lineTo(obs.x + obs.width / 2, obsY + 3);
          ctx.lineTo(obs.x + obs.width / 2, groundTop);
          ctx.fill();
        } else {
          // Deepslate block
          ctx.fillStyle = '#44403c';
          ctx.fillRect(obs.x, obsY, obs.width, obs.height);
          ctx.fillStyle = '#292524';
          ctx.fillRect(obs.x + 2, obsY + 2, obs.width - 4, obs.height - 4);
          ctx.fillStyle = '#78716c';
          ctx.fillRect(obs.x + 4, obsY + 4, 4, 4);
        }
      });

      // Draw Particles
      s.particles.forEach((p) => {
        const alpha = 1 - p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      ctx.globalAlpha = 1.0;

      // Draw 2D Pixel Frog (Minecraft Style)
      const fx = 60;
      const fy = s.frogY;

      // Frog Body (warm green)
      ctx.fillStyle = '#65a30d'; // Lime/frog body
      ctx.fillRect(fx + 4, fy + 6, 24, 16);

      // Belly (warm sand)
      ctx.fillStyle = '#d9f99d';
      ctx.fillRect(fx + 8, fy + 14, 16, 8);

      // Big cute Eyes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fx + 6, fy + 1, 6, 6);
      ctx.fillRect(fx + 20, fy + 1, 6, 6);

      // Pupils (Black)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(fx + 8, fy + 3, 3, 3);
      ctx.fillRect(fx + 22, fy + 3, 3, 3);

      // Legs / Feet
      ctx.fillStyle = '#4d7c0f';
      if (s.isJumping) {
        // Extended jumping legs
        ctx.fillRect(fx, fy + 14, 6, 12);
        ctx.fillRect(fx + 26, fy + 14, 6, 12);
      } else {
        // Squatting idle legs
        ctx.fillRect(fx + 1, fy + 18, 6, 6);
        ctx.fillRect(fx + 25, fy + 18, 6, 6);
      }

      // HUD inside canvas (Score & Target)
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`СЧЕТ: ${currentScoreInt}`, 16, 26);

      ctx.fillStyle = '#a8a29e';
      ctx.font = '11px monospace';
      ctx.fillText(`ЦЕЛЬ: 1000 ОЧКОВ [НАГРАДА: 10 АЛМАЗНЫХ РУД]`, 16, 44);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, highScore]);

  // Key listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (isPlaying) {
          jump();
        } else if (hasStarted && (isGameOver || isWon)) {
          startGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, hasStarted, isGameOver, isWon, jump, startGame]);

  const copyVictoryClaim = () => {
    soundManager.playClick();
    const hash = `AUTUMN-${Math.floor(score)}-${nickname.toUpperCase()}-DIAMONDS`;
    const text = `🐸 **ЗАЯВКА НА НАГРАДУ В ИГРЕ "ПЕЩЕРНАЯ ЛЯГУШКА" (1000+ ОЧКОВ)**
Ник в игре: \`${nickname}\`
Итоговый счёт: **${score}** очков
Код проверки: \`${hash}\`
Награда: **10 блоков глубинной алмазной руды**
Прошу выдать награду на сервере AUTUMN v26.2!`;

    navigator.clipboard.writeText(text);
    setCopiedClaim(true);
    setTimeout(() => setCopiedClaim(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-lime-950/80 border border-lime-500/40 text-lime-300 text-xs font-mono font-semibold">
          <span className="text-sm">🐸</span>
          <span>Официальная аркада сервера AUTUMN</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black font-['Unbounded'] text-stone-100">
          Пещерная лягушка
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
          Перепрыгивайте сталагмиты и сланцевые пики в глубоких пещерах. Наберите <strong className="text-amber-300 font-bold">1000+ очков</strong> и получите <strong className="text-cyan-400">10 блоков глубинной алмазной руды</strong> от администрации!
        </p>
      </div>

      {/* Screen 1: Nickname Input */}
      {!hasStarted ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-stone-900/80 border border-stone-800 backdrop-blur-md max-w-md mx-auto text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-lime-500/10 border border-lime-500/30 flex items-center justify-center text-4xl mx-auto">
            🐸
          </div>

          <div>
            <h2 className="text-lg font-bold font-['Unbounded'] text-stone-100">
              Введите никнейм игрока
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Ник нужен для привязки рекорда и выдачи алмазной руды при победе!
            </p>
          </div>

          <form onSubmit={handleSetNick} className="space-y-4">
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Ваш ник в Minecraft..."
              className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 focus:border-lime-500 focus:ring-1 focus:ring-lime-500/50 text-stone-100 text-center font-mono text-sm placeholder-stone-600 focus:outline-hidden"
            />

            <button
              type="submit"
              className="w-full min-h-[46px] py-3 rounded-xl font-['Unbounded'] font-bold text-xs sm:text-sm text-stone-950 bg-gradient-to-r from-lime-400 to-amber-400 hover:from-lime-300 hover:to-amber-300 cursor-pointer shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-stone-950 fill-stone-950" />
              <span>Начать игру</span>
            </button>
          </form>

          {highScore > 0 && (
            <div className="pt-2 text-xs font-mono text-stone-400 flex items-center justify-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Текущий рекорд: <strong className="text-amber-300">{highScore}</strong></span>
            </div>
          )}
        </div>
      ) : (
        /* Screen 2: Game Board Canvas */
        <div className="space-y-4">
          {/* Top Bar with player & stats */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-stone-400">Игрок:</span>
              <span className="font-bold text-lime-400">{nickname}</span>
              <button
                onClick={() => setHasStarted(false)}
                className="text-[10px] text-stone-400 hover:text-stone-200 underline ml-1 cursor-pointer"
              >
                (сменить)
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-stone-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Рекорд: <strong className="text-amber-300">{highScore}</strong></span>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1 rounded text-stone-400 hover:text-stone-200 cursor-pointer"
                title="Звук прыжка"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-lime-400" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-stone-800 shadow-2xl bg-stone-950 touch-none">
            <canvas
              ref={canvasRef}
              onClick={isPlaying ? jump : undefined}
              className="w-full h-auto block aspect-[640/240] cursor-pointer"
            />

            {/* Game Over Overlay */}
            {isGameOver && (
              <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-3 animate-in fade-in duration-200">
                <div className="text-3xl">💀</div>
                <h3 className="text-xl font-bold font-['Unbounded'] text-stone-100">
                  Лягушка задела сталагмит!
                </h3>
                <p className="text-xs text-stone-300 font-mono">
                  Ваш счёт: <span className="text-amber-300 font-bold">{score}</span> / 1000
                </p>
                <button
                  onClick={startGame}
                  className="min-h-[42px] px-6 py-2.5 rounded-xl font-['Unbounded'] font-bold text-xs bg-gradient-to-r from-orange-500 to-amber-400 text-stone-950 flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Попробовать снова</span>
                </button>
              </div>
            )}

            {/* VICTORY OVERLAY (>= 1000 PTS) */}
            {isWon && (
              <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-3 animate-in zoom-in-95 duration-300">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl shadow-lg shadow-amber-500/30 animate-bounce">
                  🏆
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Официальная Победа AUTUMN</span>
                </div>

                <h3 className="text-lg sm:text-2xl font-black font-['Unbounded'] text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200">
                  Поздравляем, {nickname}!
                </h3>

                <div className="max-w-md p-3 rounded-xl bg-stone-900 border border-amber-500/40 text-xs text-stone-200 leading-relaxed font-mono">
                  <p className="text-cyan-300 font-bold mb-1">
                    🎉 Вы набрали {score} очков и преодолели глубины пещер!
                  </p>
                  <p className="text-stone-300 text-[11px]">
                    Сделай скриншот этого экрана с твоим ником и счетом и отправь в наш Discord сервер, чтобы администрация выдала тебе заслуженную награду в <strong className="text-cyan-400 font-bold">10 штук руды глубинных алмазов</strong>!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    onClick={copyVictoryClaim}
                    className="min-h-[42px] px-5 py-2.5 rounded-xl font-['Unbounded'] font-bold text-xs bg-gradient-to-r from-lime-400 to-amber-400 text-stone-950 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    {copiedClaim ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedClaim ? 'Скопировано!' : 'Скопировать текст для тикета'}</span>
                  </button>

                  <a
                    href="https://discord.gg/CCydRxGBB"
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-[42px] px-4 py-2.5 rounded-xl font-mono text-xs text-stone-200 bg-stone-800 hover:bg-stone-700 flex items-center justify-center gap-1.5"
                  >
                    <span>Открыть Discord</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                  </a>

                  <button
                    onClick={startGame}
                    className="min-h-[42px] px-4 py-2.5 rounded-xl font-mono text-xs text-stone-400 hover:text-stone-200 bg-stone-900 border border-stone-800"
                  >
                    Играть ещё
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Touch & Controls Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-stone-900/40 border border-stone-800">
            <p className="text-xs text-stone-400 font-mono hidden sm:block">
              Управление: <kbd className="px-1.5 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-300">ПРОБЕЛ</kbd> или клик мыши
            </p>

            {/* Big Jump Button for Mobile Phones */}
            <button
              onClick={jump}
              disabled={!isPlaying}
              className="w-full sm:w-auto flex-1 min-h-[52px] sm:min-h-[42px] py-3 px-6 rounded-xl font-['Unbounded'] font-black text-sm text-stone-950 bg-gradient-to-r from-lime-400 via-amber-300 to-lime-400 shadow-lg active:scale-95 disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="text-base"> прыг! 🐸</span>
              <span>ПРЫЖОК</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
