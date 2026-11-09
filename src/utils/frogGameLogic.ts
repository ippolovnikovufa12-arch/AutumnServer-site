import { CommandItem } from '../types';

export const FROG_WIN_TARGET_SCORE = 30000;

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Check if the player has reached the 30,000 points threshold for the Herobrine reward.
 */
export function checkFrogWinCondition(score: number): boolean {
  return score >= FROG_WIN_TARGET_SCORE;
}

/**
 * Calculate updated score taking into account delta time, speed and combo multiplier.
 */
export function calculateFrogScore(
  currentScore: number,
  dt: number,
  speed: number,
  comboMultiplier = 1
): number {
  // Base points scale with speed and combo
  const baseRate = 80 + speed * 15;
  const increment = dt * baseRate * Math.max(1, comboMultiplier);
  return currentScore + increment;
}

/**
 * Calculate bonus points earned for clearing an obstacle.
 */
export function calculateDodgeBonus(combo: number): number {
  return Math.min(2500, 250 * Math.max(1, combo));
}

/**
 * Check Axis-Aligned Bounding Box (AABB) collision between frog and obstacle or Herobrine.
 */
export function checkAABBCollision(boxA: BoundingBox, boxB: BoundingBox): boolean {
  return (
    boxA.x < boxB.x + boxB.width &&
    boxA.x + boxA.width > boxB.x &&
    boxA.y < boxB.y + boxB.height &&
    boxA.y + boxA.height > boxB.y
  );
}

/**
 * Herobrine positioning and visual state relative to frog.
 */
export function getHerobrineState(
  elapsedTime: number,
  distanceFactor: number // 0 = far, 1 = touching frog
) {
  // Herobrine floats and bobs behind the frog (x: 10 to 35)
  const baseX = 12 + distanceFactor * 25;
  const bobbingY = Math.sin(elapsedTime * 4) * 4;
  const eyesGlow = Math.sin(elapsedTime * 6) > -0.3; // White eyes pulse with malice
  const particleEmission = Math.random() < 0.6;

  return {
    x: baseX,
    bobbingY,
    eyesGlow,
    particleEmission,
    isDangerouslyClose: distanceFactor > 0.75
  };
}

/**
 * Format the official claim ticket for Discord when 30,000 points are reached.
 */
export function formatFrogVictoryClaim(nickname: string, score: number): { hash: string; text: string } {
  const roundedScore = Math.floor(score);
  const cleanNick = (nickname || 'Player').toUpperCase().replace(/[^A-Z0-9_]/gi, '');
  const hash = `AUTUMN-30K-${roundedScore}-${cleanNick}-10AR`;

  const text = `👑 **ЗАЯВКА НА НАГРАДУ В ИГРЕ "ПЕЩЕРНАЯ ЛЯГУШКА" (30 000+ ОЧКОВ)**
👤 Ник в Minecraft: \`${cleanNick}\`
🏆 Финальный счёт: **${roundedScore.toLocaleString('ru-RU')}** / 30 000 очков
⚡ Повержен противник: **ХЕРОБРИН (HEROBRINE)**
🔐 Проверочный хэш: \`${hash}\`
🎁 Награда: **10 аров от администрации**
🍂 Сервер: **AUTUMN v26.2**`;

  return { hash, text };
}

/**
 * Filter commands by category and search query (including tags and details).
 */
export function filterCommandsList(
  commands: CommandItem[],
  category: string,
  searchQuery: string
): CommandItem[] {
  const query = searchQuery.trim().toLowerCase();
  return commands.filter((cmd) => {
    if (category !== 'all' && cmd.category !== category) return false;
    if (!query) return true;

    const matchesCmd = cmd.command.toLowerCase().includes(query);
    const matchesSummary = cmd.summary.toLowerCase().includes(query);
    const matchesDetails = cmd.details.toLowerCase().includes(query);
    const matchesTags = cmd.tags.some((t) => t.toLowerCase().includes(query));
    return matchesCmd || matchesSummary || matchesDetails || matchesTags;
  });
}

/**
 * Constant secret admin passcode validation without leaking to UI.
 */
export function verifyAdminCode(enteredCode: string, targetCode: string): boolean {
  if (!enteredCode || !targetCode) return false;
  return enteredCode.trim() === targetCode.trim();
}
