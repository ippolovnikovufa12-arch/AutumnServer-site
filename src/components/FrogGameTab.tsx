import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Volume2,
  VolumeX,
  Play,
  Skull,
  Flame,
  Award
} from 'lucide-react';
import { soundManager } from '../utils/sound';
import {
  FROG_WIN_TARGET_SCORE,
  checkFrogWinCondition,
  calculateFrogScore,
  calculateDodgeBonus,
  checkAABBCollision,
  getHerobrineState,
  formatFrogVictoryClaim
} from '../utils/frogGameLogic';

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'stalagmite' | 'deepslate' | 'bat' | 'falling_dripstone' | 'double_stalagmite';
  vy?: number;
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
  const [combo, setCombo] = useState(1);
  const [deathCause, setDeathCause] = useState<string>('stalagmite');

  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('autumn_frog_highscore_v2') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedClaim, setCopiedClaim] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active mutable game state in ref
  const gameStateRef = useRef({
    frogY: 160,
    frogVy: 0,
    frogGroundY: 160,
    isJumping: false,
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    speed: 5.0,
    score: 0,
    combo: 1,
    lastDodgeTime: 0,
    lastObstacleTime: 0,
    herobrineDistance: 0.25, // 0 to 1
    wonTriggered: false
  });

  // Save nickname and start
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
      s.frogVy = -10.2; // Crisp responsive jump
      s.isJumping = true;
      if (soundEnabled) soundManager.playClick();

      // Slime jump particles
      for (let i = 0; i < 7; i++) {
        s.particles.push({
          x: 75 + Math.random() * 16,
          y: s.frogGroundY + 18,
          vx: (Math.random() - 0.5) * 3,
          vy: -Math.random() * 2 - 1.5,
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
    setCombo(1);
    setDeathCause('stalagmite');

    const groundY = 160;
    gameStateRef.current = {
      frogY: groundY,
      frogVy: 0,
      frogGroundY: groundY,
      isJumping: false,
      obstacles: [],
      particles: [],
      speed: 5.2,
      score: 0,
      combo: 1,
      lastDodgeTime: performance.now(),
      lastObstacleTime: performance.now(),
      herobrineDistance: 0.25,
      wonTriggered: false
    };
  }, []);

  // Main Canvas Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
      // Base score accumulation scaled with speed and combo multiplier
      s.score = calculateFrogScore(s.score, dt, s.speed, s.combo);
      const currentScoreInt = Math.floor(s.score);
      setScore(currentScoreInt);
      setCombo(s.combo);

      // Speed increases gradually up to a challenging cap
      s.speed = 5.2 + Math.min(currentScoreInt / 2000, 6.5);

      // Herobrine menacingly creeps closer if speed is very high or combo drops
      const herobrineTargetDistance = 0.2 + Math.min(0.55, currentScoreInt / 40000 * 0.4);
      s.herobrineDistance += (herobrineTargetDistance - s.herobrineDistance) * dt * 0.5;

      // Check WIN CONDITION: 50,000 points!
      if (checkFrogWinCondition(currentScoreInt) && !s.wonTriggered) {
        s.wonTriggered = true;
        setIsWon(true);
        setIsPlaying(false);
        if (currentScoreInt > highScore) {
          setHighScore(currentScoreInt);
          try {
            localStorage.setItem('autumn_frog_highscore_v2', currentScoreInt.toString());
          } catch {}
        }
        return;
      }

      // 2. Frog Physics
      const gravity = 27;
      s.frogVy += gravity * dt;
      s.frogY += s.frogVy * 60 * dt;

      if (s.frogY >= s.frogGroundY) {
        s.frogY = s.frogGroundY;
        s.frogVy = 0;
        s.isJumping = false;
      }

      // 3. Spawning Varied Obstacles (Harder!)
      // Shorter intervals as speed builds up
      const minDistanceTime = Math.max(750, 1600 - s.speed * 85);
      if (timestamp - s.lastObstacleTime > minDistanceTime && Math.random() < 0.48) {
        s.lastObstacleTime = timestamp;
        const rand = Math.random();

        if (rand < 0.35) {
          // Sharp stalagmite spike
          s.obstacles.push({
            x: width + 20,
            y: s.frogGroundY + 24 - 34,
            width: 18,
            height: 34,
            type: 'stalagmite'
          });
        } else if (rand < 0.60) {
          // Double spike
          s.obstacles.push({
            x: width + 20,
            y: s.frogGroundY + 24 - 38,
            width: 32,
            height: 38,
            type: 'double_stalagmite'
          });
        } else if (rand < 0.80) {
          // Deepslate block
          s.obstacles.push({
            x: width + 20,
            y: s.frogGroundY + 24 - 26,
            width: 24,
            height: 26,
            type: 'deepslate'
          });
        } else {
          // Flying cave bat (mid-air obstacle!)
          s.obstacles.push({
            x: width + 20,
            y: s.frogGroundY - 26 - Math.random() * 20,
            width: 20,
            height: 16,
            type: 'bat'
          });
        }
      }

      // 4. Move Obstacles & Collision Check
      const frogBox = {
        x: 75 + 4,
        y: s.frogY + 4,
        width: 24,
        height: 20
      };

      for (let i = s.obstacles.length - 1; i >= 0; i--) {
        const obs = s.obstacles[i];
        obs.x -= s.speed * 60 * dt;

        // Flying bat bobbing
        if (obs.type === 'bat') {
          obs.y += Math.sin(timestamp * 0.008 + obs.x) * 0.8;
        }

        const obsBox = {
          x: obs.x,
          y: obs.y,
          width: obs.width,
          height: obs.height
        };

        // Collision Check
        if (checkAABBCollision(frogBox, obsBox)) {
          setIsGameOver(true);
          setIsPlaying(false);
          setDeathCause(obs.type);

          if (currentScoreInt > highScore) {
            setHighScore(currentScoreInt);
            try {
              localStorage.setItem('autumn_frog_highscore_v2', currentScoreInt.toString());
            } catch {}
          }
          return;
        }

        // Passed obstacle reward (Dodge Bonus + Combo increment)
        if (!obs.passed && obs.x + obs.width < frogBox.x) {
          obs.passed = true;
          s.combo = Math.min(10, s.combo + 1);
          const bonus = calculateDodgeBonus(s.combo);
          s.score += bonus;

          // Bonus sparkle particle
          for (let p = 0; p < 4; p++) {
            s.particles.push({
              x: obs.x + obs.width / 2,
              y: obs.y,
              vx: (Math.random() - 0.5) * 2,
              vy: -Math.random() * 2 - 1,
              size: 3,
              color: '#facc15',
              life: 0,
              maxLife: 25
            });
          }
        }

        // Remove offscreen
        if (obs.x + obs.width < -30) {
          s.obstacles.splice(i, 1);
        }
      }

      // Herobrine close check: if herobrine gets too close while frog is trapped
      const heroState = getHerobrineState(timestamp * 0.001, s.herobrineDistance);
      const herobrineBox = {
        x: heroState.x,
        y: s.frogGroundY - 12,
        width: 22,
        height: 38
      };

      if (checkAABBCollision(frogBox, herobrineBox)) {
        setIsGameOver(true);
        setIsPlaying(false);
        setDeathCause('herobrine');
        if (currentScoreInt > highScore) {
          setHighScore(currentScoreInt);
          try {
            localStorage.setItem('autumn_frog_highscore_v2', currentScoreInt.toString());
          } catch {}
        }
        return;
      }

      // 5. Update Particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life >= p.maxLife) {
          s.particles.splice(i, 1);
        }
      }

      // ================= DRAWING CANVAS =================
      ctx.clearRect(0, 0, width, height);

      // Deep dark ominous cave background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#050505');
      bgGrad.addColorStop(0.5, '#0f0d0e');
      bgGrad.addColorStop(1, '#1c1917');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ominous Herobrine purple/red vignette aura on left side
      const auraGrad = ctx.createRadialGradient(heroState.x, s.frogGroundY, 5, heroState.x, s.frogGroundY, 180);
      auraGrad.addColorStop(0, 'rgba(168, 85, 247, 0.18)');
      auraGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.08)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, width, height);

      // Cave ceiling stalactites
      ctx.fillStyle = '#3c3836';
      for (let i = 0; i < width; i += 28) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 14, ((i * 17) % 24) + 14);
        ctx.lineTo(i + 28, 0);
        ctx.fill();
      }

      // Ground (Deepslate & Sculk patches)
      const groundTop = s.frogGroundY + 24;
      ctx.fillStyle = '#141211';
      ctx.fillRect(0, groundTop, width, height - groundTop);

      // Sculk glowing vein on top
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, groundTop, width, 3);
      ctx.fillStyle = '#0d9488';
      for (let x = 0; x < width; x += 32) {
        ctx.fillRect(x + ((timestamp * 0.04) % 32), groundTop, 8, 2);
      }

      // Ground brick pattern
      ctx.fillStyle = '#262220';
      for (let x = 0; x < width; x += 16) {
        ctx.fillRect(x, groundTop + 8, 14, 2);
        ctx.fillRect(x + 8, groundTop + 18, 14, 2);
      }

      // Draw Obstacles
      s.obstacles.forEach((obs) => {
        if (obs.type === 'stalagmite') {
          // Sharp single dripstone
          ctx.fillStyle = '#78716c';
          ctx.beginPath();
          ctx.moveTo(obs.x, groundTop);
          ctx.lineTo(obs.x + obs.width / 2, obs.y);
          ctx.lineTo(obs.x + obs.width, groundTop);
          ctx.fill();

          ctx.fillStyle = '#a8a29e';
          ctx.beginPath();
          ctx.moveTo(obs.x + 2, groundTop);
          ctx.lineTo(obs.x + obs.width / 2, obs.y + 3);
          ctx.lineTo(obs.x + obs.width / 2, groundTop);
          ctx.fill();
        } else if (obs.type === 'double_stalagmite') {
          // Twin jagged stalagmites
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.moveTo(obs.x, groundTop);
          ctx.lineTo(obs.x + 8, obs.y + 6);
          ctx.lineTo(obs.x + 16, groundTop);
          ctx.lineTo(obs.x + 24, obs.y);
          ctx.lineTo(obs.x + obs.width, groundTop);
          ctx.fill();

          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.moveTo(obs.x + 18, groundTop);
          ctx.lineTo(obs.x + 24, obs.y + 3);
          ctx.lineTo(obs.x + 24, groundTop);
          ctx.fill();
        } else if (obs.type === 'deepslate') {
          // Jagged deepslate block
          ctx.fillStyle = '#334155';
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(obs.x + 2, obs.y + 2, obs.width - 4, obs.height - 4);
          ctx.fillStyle = '#475569';
          ctx.fillRect(obs.x + 4, obs.y + 4, 6, 6);
        } else if (obs.type === 'bat') {
          // Flying cave bat with animated wings
          const bx = obs.x;
          const by = obs.y;
          ctx.fillStyle = '#3b2f2f';
          ctx.fillRect(bx + 6, by + 4, 8, 8); // Body

          // Flapping wings
          const wingOffset = Math.sin(timestamp * 0.02) * 5;
          ctx.fillStyle = '#1f1616';
          ctx.beginPath();
          ctx.moveTo(bx + 6, by + 6);
          ctx.lineTo(bx - 2, by + 4 + wingOffset);
          ctx.lineTo(bx + 6, by + 12);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(bx + 14, by + 6);
          ctx.lineTo(bx + 22, by + 4 + wingOffset);
          ctx.lineTo(bx + 14, by + 12);
          ctx.fill();

          // Bat red eyes
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(bx + 8, by + 5, 2, 2);
          ctx.fillRect(bx + 11, by + 5, 2, 2);
        }
      });

      // ================= DRAW HEROBRINE (THE CHASER!) =================
      const hx = heroState.x;
      const hy = s.frogGroundY - 14 + heroState.bobbingY;

      // Herobrine sinister smoke aura
      if (Math.random() < 0.4) {
        s.particles.push({
          x: hx + Math.random() * 20,
          y: hy + Math.random() * 30,
          vx: -Math.random() * 1.5,
          vy: -Math.random() * 1,
          size: Math.random() * 3 + 2,
          color: '#a855f7',
          life: 0,
          maxLife: 18
        });
      }

      // Herobrine Body (Cyan Minecraft Steve shirt: #00a8a8)
      ctx.fillStyle = '#00a8a8';
      ctx.fillRect(hx + 3, hy + 12, 16, 14);

      // Dark Blue Jeans (#1e293b)
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(hx + 4, hy + 26, 6, 12);
      ctx.fillRect(hx + 12, hy + 26, 6, 12);

      // Steve Head (#d4a373)
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(hx + 4, hy, 14, 12);

      // Brown Hair (#3d2314)
      ctx.fillStyle = '#3d2314';
      ctx.fillRect(hx + 4, hy, 14, 4);
      ctx.fillRect(hx + 4, hy + 4, 3, 3);
      ctx.fillRect(hx + 15, hy + 4, 3, 3);

      // ICONIC GLOWING PURE WHITE EYES (#ffffff)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(hx + 6, hy + 5, 3, 3);
      ctx.fillRect(hx + 12, hy + 5, 3, 3);

      // White eyes outer glow
      if (heroState.eyesGlow) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillRect(hx + 5, hy + 4, 5, 5);
        ctx.fillRect(hx + 11, hy + 4, 5, 5);
      }

      // Arms (reaching towards frog!)
      ctx.fillStyle = '#00a8a8';
      ctx.fillRect(hx + 17, hy + 13, 8, 4);
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(hx + 25, hy + 13, 4, 4);

      // Draw Particles
      s.particles.forEach((p) => {
        const alpha = 1 - p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });
      ctx.globalAlpha = 1.0;

      // ================= DRAW 2D PIXEL FROG =================
      const fx = 75;
      const fy = s.frogY;

      // Frog Body
      ctx.fillStyle = '#65a30d';
      ctx.fillRect(fx + 4, fy + 6, 24, 16);

      // Belly
      ctx.fillStyle = '#d9f99d';
      ctx.fillRect(fx + 8, fy + 14, 16, 8);

      // Eyes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(fx + 6, fy + 1, 6, 6);
      ctx.fillRect(fx + 20, fy + 1, 6, 6);

      // Pupils (Black)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(fx + 8, fy + 3, 3, 3);
      ctx.fillRect(fx + 22, fy + 3, 3, 3);

      // Legs
      ctx.fillStyle = '#4d7c0f';
      if (s.isJumping) {
        ctx.fillRect(fx, fy + 14, 6, 12);
        ctx.fillRect(fx + 26, fy + 14, 6, 12);
      } else {
        ctx.fillRect(fx + 1, fy + 18, 6, 6);
        ctx.fillRect(fx + 25, fy + 18, 6, 6);
      }

      // ================= HUD INSIDE CANVAS =================
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(`СЧЕТ: ${currentScoreInt.toLocaleString('ru-RU')} / 30 000`, 16, 24);

      // Combo & Herobrine warning
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`⚠️ ХЕРОБРИН ПРЕСЛЕДУЕТ ЛЯГУШКУ!`, 16, 40);

      if (s.combo > 1) {
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`КОМБО: x${s.combo} 🔥 (+${calculateDodgeBonus(s.combo)} за прыжок)`, width - 230, 24);
      }

      // Progress bar to 30k
      const progressRatio = Math.min(1, currentScoreInt / FROG_WIN_TARGET_SCORE);
      ctx.fillStyle = '#292524';
      ctx.fillRect(16, 48, width - 32, 5);
      ctx.fillStyle = progressRatio >= 1 ? '#22c55e' : '#f97316';
      ctx.fillRect(16, 48, (width - 32) * progressRatio, 5);

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, highScore]);

  // Key Listeners
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

  // Copy Victory Claim for Discord
  const copyVictoryClaim = () => {
    soundManager.playClick();
    const { text } = formatFrogVictoryClaim(nickname, score);
    navigator.clipboard.writeText(text);
    setCopiedClaim(true);
    setTimeout(() => setCopiedClaim(false), 2500);
  };

  const winProgressPercent = Math.min(100, Math.floor((score / FROG_WIN_TARGET_SCORE) * 100));

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-mono font-semibold">
          <Flame className="w-3.5 h-3.5 text-red-400" />
          <span>Легендарное испытание Херобрина v26.2</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black font-['Unbounded'] text-stone-100">
          Пещерная лягушка и Херобрин
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
          За лягушкой по пятам гонится зловещий <strong className="text-red-400">Херобрин</strong>! Уклоняйтесь от сталагмитов, летучих мышей и сланцевых шипов. Наберите <strong className="text-amber-300 font-bold">30 000 очков</strong>, чтобы победить и забрать <strong className="text-cyan-400">10 аров от администрации</strong>!
        </p>
      </div>

      {/* Screen 1: Nickname Input */}
      {!hasStarted ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-stone-900/80 border border-red-500/40 backdrop-blur-md max-w-md mx-auto text-center space-y-5 shadow-2xl relative overflow-hidden">
          {/* Herobrine Eyes Background Silhouette */}
          <div className="absolute top-3 right-4 flex items-center gap-1.5 opacity-80">
            <span className="w-2.5 h-2.5 rounded-xs bg-white shadow-[0_0_8px_#ffffff]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-white shadow-[0_0_8px_#ffffff]" />
          </div>

          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl mx-auto">
            🐸⚡
          </div>

          <div>
            <h2 className="text-lg font-bold font-['Unbounded'] text-stone-100">
              Введите никнейм игрока
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              Ник нужен для фиксации рекорда и выдачи награды за 30 000 очков!
            </p>
          </div>

          <form onSubmit={handleSetNick} className="space-y-4">
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Ваш ник в Minecraft..."
              className="w-full px-4 py-3 rounded-xl bg-stone-950 border border-stone-800 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 text-stone-100 text-center font-mono text-sm placeholder-stone-600 focus:outline-hidden"
            />

            <button
              type="submit"
              className="w-full min-h-[46px] py-3 rounded-xl font-['Unbounded'] font-bold text-xs sm:text-sm text-stone-950 bg-gradient-to-r from-red-500 via-orange-400 to-amber-400 hover:from-red-400 hover:to-amber-300 cursor-pointer shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 text-stone-950 fill-stone-950" />
              <span>Спастись от Херобрина</span>
            </button>
          </form>

          {highScore > 0 && (
            <div className="pt-2 text-xs font-mono text-stone-400 flex items-center justify-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Текущий рекорд: <strong className="text-amber-300">{highScore.toLocaleString('ru-RU')}</strong></span>
            </div>
          )}

          {/* Reward preview box */}
          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-left text-xs space-y-1">
            <span className="text-[10px] uppercase font-mono text-amber-400 font-bold block">
              🎁 Главный приз за 30 000 очков:
            </span>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              • <strong className="text-cyan-400 font-bold">10 аров</strong> от администрации сервера AUTUMN
            </p>
          </div>
        </div>
      ) : (
        /* Screen 2: Game Board Canvas */
        <div className="space-y-4">
          {/* Top Bar with player & stats */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-stone-900/60 border border-stone-800 text-xs font-mono flex-wrap gap-2">
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

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-stone-300">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>Комбо: <strong className="text-yellow-400">x{combo}</strong></span>
              </div>
              <div className="flex items-center gap-1 text-stone-300">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Рекорд: <strong className="text-amber-300">{highScore.toLocaleString('ru-RU')}</strong></span>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1 rounded text-stone-400 hover:text-stone-200 cursor-pointer"
                title="Звук"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-lime-400" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-red-950 shadow-2xl bg-stone-950 touch-none">
            <canvas
              ref={canvasRef}
              onClick={isPlaying ? jump : undefined}
              className="w-full h-auto block aspect-[640/240] cursor-pointer"
            />

            {/* GAME OVER OVERLAY */}
            {isGameOver && (
              <div className="absolute inset-0 bg-stone-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-3 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 text-2xl shadow-lg shadow-red-950">
                  <Skull className="w-6 h-6 text-red-400" />
                </div>

                <h3 className="text-lg sm:text-2xl font-black font-['Unbounded'] text-stone-100">
                  {deathCause === 'herobrine'
                    ? 'Херобрин настиг лягушку!'
                    : deathCause === 'bat'
                    ? 'Летучая мышь сбила лягушку!'
                    : 'Лягушка наткнулась на сталагмиты!'}
                </h3>

                <p className="text-xs text-stone-300 font-mono">
                  Счёт: <span className="text-amber-300 font-bold">{score.toLocaleString('ru-RU')}</span> / 30 000 ({winProgressPercent}%)
                </p>

                <p className="text-[11px] text-stone-400 max-w-sm">
                  Херобрин скрылся во тьме пещеры. Соберитесь с силами и попробуйте дойти до 30 000 очков!
                </p>

                <button
                  onClick={startGame}
                  className="min-h-[42px] px-6 py-2.5 rounded-xl font-['Unbounded'] font-bold text-xs bg-gradient-to-r from-red-500 to-amber-500 text-stone-950 flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg"
                >
                  <RotateCcw className="w-4 h-4 text-stone-950" />
                  <span>Попробовать снова</span>
                </button>
              </div>
            )}

            {/* VICTORY OVERLAY (>= 30,000 PTS) */}
            {isWon && (
              <div className="absolute inset-0 bg-stone-950/95 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-3 animate-in zoom-in-95 duration-300">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 text-3xl shadow-xl shadow-amber-500/30 animate-bounce">
                  👑
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>ЛЕГЕНДАРНЫЙ ПОДВИГ AUTUMN v26.2</span>
                </div>

                <h3 className="text-xl sm:text-3xl font-black font-['Unbounded'] text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200">
                  ХЕРОБРИН ПОВЕРЖЕН!
                </h3>

                <div className="max-w-lg p-4 rounded-xl bg-stone-900 border border-amber-500/50 text-xs text-stone-200 leading-relaxed font-mono space-y-2">
                  <p className="text-cyan-300 font-bold text-sm">
                    🎉 Вы набрали {score.toLocaleString('ru-RU')} очков и спаслись из бездны!
                  </p>
                  <div className="p-2.5 rounded-lg bg-stone-950 border border-stone-800 text-left text-[11px] text-amber-200/90 space-y-1">
                    <strong className="block text-amber-400">🏆 Ваша заслуженная награда:</strong>
                    <div className="text-sm font-bold text-cyan-300">• 10 аров от администрации сервера AUTUMN v26.2</div>
                  </div>
                  <p className="text-stone-400 text-[11px]">
                    Скопируйте заявку ниже и отправьте в наш Discord тикет для мгновенной выдачи администрацией!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1 flex-wrap justify-center">
                  <button
                    onClick={copyVictoryClaim}
                    className="min-h-[42px] px-5 py-2.5 rounded-xl font-['Unbounded'] font-bold text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                  >
                    {copiedClaim ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedClaim ? 'Скопировано!' : 'Скопировать заявку на 30 000 очков'}</span>
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
                    Играть снова
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

            {/* Big Jump Button for Mobile */}
            <button
              onClick={jump}
              disabled={!isPlaying}
              className="w-full sm:w-auto flex-1 min-h-[52px] sm:min-h-[42px] py-3 px-6 rounded-xl font-['Unbounded'] font-black text-sm text-stone-950 bg-gradient-to-r from-red-500 via-amber-400 to-lime-400 shadow-lg active:scale-95 disabled:opacity-40 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="text-base"> прыг! 🐸</span>
              <span>ПРЫЖОК ОТ ХЕРОБРИНА</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
