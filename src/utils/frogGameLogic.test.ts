import test from 'node:test';
import assert from 'node:assert/strict';
import {
  FROG_WIN_TARGET_SCORE,
  checkFrogWinCondition,
  calculateFrogScore,
  calculateDodgeBonus,
  checkAABBCollision,
  getHerobrineState,
  formatFrogVictoryClaim,
  filterCommandsList,
  verifyAdminCode
} from './frogGameLogic';
import { CommandItem } from '../types';

test('FROG_WIN_TARGET_SCORE is 50000', () => {
  assert.equal(FROG_WIN_TARGET_SCORE, 50000);
});

test('checkFrogWinCondition correctly identifies 50000 points win', () => {
  assert.equal(checkFrogWinCondition(49999), false);
  assert.equal(checkFrogWinCondition(50000), true);
  assert.equal(checkFrogWinCondition(50500), true);
});

test('calculateFrogScore increments score with dt, speed and combo', () => {
  const initial = 1000;
  const next = calculateFrogScore(initial, 0.1, 4.0, 2);
  assert.ok(next > initial);
  // With combo 2, rate is higher than combo 1
  const nextSingle = calculateFrogScore(initial, 0.1, 4.0, 1);
  assert.ok(next > nextSingle);
});

test('calculateDodgeBonus scales with combo', () => {
  assert.equal(calculateDodgeBonus(1), 250);
  assert.equal(calculateDodgeBonus(2), 500);
  assert.equal(calculateDodgeBonus(10), 2500);
});

test('checkAABBCollision accurately detects box overlaps', () => {
  const boxA = { x: 50, y: 100, width: 20, height: 20 };
  const boxBOverlap = { x: 60, y: 110, width: 20, height: 20 };
  const boxCNoOverlap = { x: 100, y: 200, width: 20, height: 20 };

  assert.equal(checkAABBCollision(boxA, boxBOverlap), true);
  assert.equal(checkAABBCollision(boxA, boxCNoOverlap), false);
});

test('getHerobrineState provides position and danger metrics', () => {
  const stateFar = getHerobrineState(1.5, 0.2);
  const stateClose = getHerobrineState(1.5, 0.85);

  assert.ok(stateFar.x < stateClose.x);
  assert.equal(stateFar.isDangerouslyClose, false);
  assert.equal(stateClose.isDangerouslyClose, true);
});

test('formatFrogVictoryClaim produces ticket with 50000 and Herobrine and 10 AR prize', () => {
  const claim = formatFrogVictoryClaim('Steve', 50420);
  assert.match(claim.hash, /AUTUMN-50K-50420-STEVE-10AR/);
  assert.match(claim.text, /50\s*000/i);
  assert.match(claim.text, /ХЕРОБРИН/i);
  assert.match(claim.text, /10 аров от администрации/i);
});

test('filterCommandsList filters by category and search keyword', () => {
  const sampleCommands: CommandItem[] = [
    {
      command: '/block',
      category: 'decor',
      summary: 'Вращение предмета над блоком',
      usage: '/block',
      details: 'Декоративная витрина',
      tags: ['декор', 'предметы']
    },
    {
      command: '/team create',
      category: 'teams',
      summary: 'Создание клана',
      usage: '/team create <название>',
      details: 'Отряды друзей',
      tags: ['клан', 'друзья']
    }
  ];

  const filteredAll = filterCommandsList(sampleCommands, 'all', '');
  assert.equal(filteredAll.length, 2);

  const filteredCategory = filterCommandsList(sampleCommands, 'decor', '');
  assert.equal(filteredCategory.length, 1);
  assert.equal(filteredCategory[0].command, '/block');

  const filteredSearch = filterCommandsList(sampleCommands, 'all', 'клан');
  assert.equal(filteredSearch.length, 1);
  assert.equal(filteredSearch[0].command, '/team create');
});

test('verifyAdminCode validates secret admin code without exposing it', () => {
  const secret = '061206roM_!';
  assert.equal(verifyAdminCode('061206roM_!', secret), true);
  assert.equal(verifyAdminCode('wrong_pass', secret), false);
  assert.equal(verifyAdminCode('', secret), false);
});
