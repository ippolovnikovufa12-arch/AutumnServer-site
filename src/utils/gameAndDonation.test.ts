import test from 'node:test';
import assert from 'node:assert/strict';
import { SERVER_COMMANDS, CUSTOM_CRAFT_RECIPES } from '../data/commandsAndCraftsData';
import { PLUGINS_DATA } from '../data/pluginsData';

test('server commands catalog is complete and valid', () => {
  assert.ok(SERVER_COMMANDS.length >= 8);
  const blockCmd = SERVER_COMMANDS.find((c) => c.command === '/block');
  assert.ok(blockCmd, '/block command must exist');
  assert.match(blockCmd.details, /вращаться на данном блоке/i);

  const teamCmd = SERVER_COMMANDS.find((c) => c.command.includes('/team create'));
  assert.ok(teamCmd, '/team create command must exist');

  const gameCmd = SERVER_COMMANDS.find((c) => c.command === '/game dice');
  assert.ok(gameCmd, '/game dice must exist');
});

test('custom craft recipes are populated and include the 6 custom recipes', () => {
  assert.equal(CUSTOM_CRAFT_RECIPES.length, 6);
  for (const craft of CUSTOM_CRAFT_RECIPES) {
    assert.ok(craft.id);
    assert.ok(craft.title);
    assert.ok(craft.image.startsWith('/assets/aistudio/'));
    assert.ok(craft.inputDescription);
    assert.ok(craft.outputDescription);
  }
});

test('custom plugins contain user descriptions', () => {
  const customPlugins = PLUGINS_DATA.filter((p) => p.isCustom);
  assert.equal(customPlugins.length, 15);

  const dailyMerchant = customPlugins.find((p) => p.name === 'DailyMerchant');
  assert.ok(dailyMerchant?.description);
  assert.match(dailyMerchant.description, /нпс торговцев с динамичными диалогами/i);

  const teamGames = customPlugins.find((p) => p.name === 'TeamGames');
  assert.ok(teamGames?.description);
  assert.match(teamGames.description, /камень ножницы бумагу/i);

  const dungeonCore = customPlugins.find((p) => p.name === 'DungeonCore');
  assert.ok(dungeonCore?.description);
  assert.match(dungeonCore.description, /новые дажны/i);
});
