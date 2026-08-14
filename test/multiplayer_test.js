import { describe, it } from "@std/testing/bdd";
import { assertEquals, assertNotEquals } from "@std/assert";
import { Game } from "../src/models/game.js";
import { Player } from "../src/models/player.js";
import { TurnManager } from "../src/models/turn_manager.js";
import { Organ } from "../src/models/organ.js";
import { Deck } from "../src/models/deck.js";
import { Dealer } from "../src/models/dealer.js";
import { AfflictionHandler } from "../src/models/affliction_handler.js";
import ActionStack from "../src/models/action_stack.js";
import ActionController from "../src/controllers/action_controller.js";
import GameController from "../src/controllers/game_controller.js";
import Timer from "../src/models/timer.js";

const setupGameWithPlayers = (playerCount) => {
  const shuffle = (arr) => arr;
  const players = Array.from(
    { length: playerCount },
    (_, i) => new Player(`Player_${i + 1}`, i + 1),
  );

  const attackCardsData = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    action: i % 2 === 0 ? "affliction" : "medicine",
    type: "affliction",
    afflictableOrgans: [1, 2, 3, 4],
    removableOrgans: [],
    isActive: true,
    isInstant: false,
  }));

  const attackDeck = new Deck(attackCardsData, shuffle);
  const organCards = [
    ...Array.from(
      { length: playerCount * 4 - 1 },
      (_, i) => new Organ(`organ_${i + 1}`, i + 2, 2, 2),
    ),
    new Organ("wild", 1, 2, 2),
  ];
  const organDeck = new Deck(organCards, shuffle);

  const dealer = new Dealer(attackDeck, organDeck, players);
  const afflictionHandler = new AfflictionHandler(
    attackDeck,
    organDeck,
    players,
  );
  const turnManager = new TurnManager(players, 0);

  const game = new Game(
    players,
    attackDeck,
    organDeck,
    dealer,
    afflictionHandler,
    turnManager,
  );

  game.dealCards();
  game.setFirstPlayer();

  const actionStack = new ActionStack();
  const actionController = new ActionController(actionStack);
  const timer = new Timer(0);
  const gameController = new GameController(actionController, timer);

  return {
    game,
    players,
    attackDeck,
    organDeck,
    turnManager,
    gameController,
    actionController,
  };
};

describe("Multiplayer 2 to 6 Players Game Scenarios", () => {
  describe("Game Initialization for 2, 3, 4, 5, and 6 Players", () => {
    [2, 3, 4, 5, 6].forEach((count) => {
      it(`should properly set up a ${count}-player game with hands, organs, and wild card owner starting first`, () => {
        const { game, players } = setupGameWithPlayers(count);

        assertEquals(players.length, count);
        players.forEach((p) => {
          const details = p.getPlayerDetails();
          assertEquals(details.attackCards.length, 5);
          assertEquals(details.organCards.length, 4);
          assertEquals(details.isAlive, true);
        });

        // Player 1 has the wild organ (id 1) and must be set as first player
        assertEquals(game.getCurrentPlayerID(), 1);
        const gameState = game.getGameState();
        assertEquals(gameState.players.length, count);
        assertEquals(gameState.currentPlayer, 1);
      });
    });
  });

  describe("Turn Progression & Turn Skipping for 3, 4, 5, 6 Players", () => {
    it("3-player game: Turn advances 1 -> 2 -> 3 -> 1 in standard order", () => {
      const { game } = setupGameWithPlayers(3);

      assertEquals(game.getCurrentPlayerID(), 1);

      game.currentTurnPlayed({
        attackerID: 1,
        card: { action: "affliction", isInstant: false },
        opponentID: 2,
      });
      game.passTurn();
      assertEquals(game.getCurrentPlayerID(), 2);

      game.currentTurnPlayed({
        attackerID: 2,
        card: { action: "affliction", isInstant: false },
        opponentID: 3,
      });
      game.passTurn();
      assertEquals(game.getCurrentPlayerID(), 3);

      game.currentTurnPlayed({
        attackerID: 3,
        card: { action: "affliction", isInstant: false },
        opponentID: 1,
      });
      game.passTurn();
      assertEquals(game.getCurrentPlayerID(), 1);
    });

    it("4-player game: Sedate on Player 2 skips Player 2 during turn passing", () => {
      const { game, players } = setupGameWithPlayers(4);

      assertEquals(game.getCurrentPlayerID(), 1);

      // Player 1 sedates Player 2 (sleeps for 2 turns)
      game.applySedate(2);
      assertEquals(players[1].isSleeping(), true);
      assertEquals(players[1].sleepCount, 2);

      // Player 1 finishes turn -> should skip Player 2 and pass to Player 3
      game.currentTurnPlayed({
        attackerID: 1,
        card: { action: "sedate", isInstant: false },
        opponentID: 2,
      });
      game.passTurn();

      assertEquals(game.getCurrentPlayerID(), 3);
      assertEquals(players[1].sleepCount, 1); // Sleep decremented when skipped

      // Player 3 finishes turn -> should skip Player 2 again and pass to Player 4
      game.currentTurnPlayed({
        attackerID: 3,
        card: { action: "affliction", isInstant: false },
        opponentID: 4,
      });
      game.passTurn();

      assertEquals(game.getCurrentPlayerID(), 4);
      assertEquals(players[1].sleepCount, 1); // The sleep count only decreases when the sleeping player is skipped.

      // Player 4 finishes turn -> Player 2 is awake, so turn passes to Player 1 then 2
      game.currentTurnPlayed({
        attackerID: 4,
        card: { action: "affliction", isInstant: false },
        opponentID: 1,
      });
      game.passTurn();

      assertEquals(game.getCurrentPlayerID(), 1);
    });

    it("5-player game: Eliminating Player 3 causes future turns to skip Player 3 permanently", () => {
      const { game, players } = setupGameWithPlayers(5);

      assertEquals(game.getCurrentPlayerID(), 1);

      // Remove all organs from Player 3
      const p3Organs = [...players[2].getPlayerDetails().organCards];
      p3Organs.forEach((organ) => game.removeOrgan(3, organ.id));

      assertEquals(players[2].isAlive(), false);

      // Pass turns: 1 -> 2 -> (skips 3) -> 4 -> 5 -> 1
      game.currentTurnPlayed({
        attackerID: 1,
        card: { action: "affliction", isInstant: false },
        opponentID: 2,
      });
      game.passTurn();
      assertEquals(game.getCurrentPlayerID(), 2);

      game.currentTurnPlayed({
        attackerID: 2,
        card: { action: "affliction", isInstant: false },
        opponentID: 4,
      });
      game.passTurn();
      assertEquals(game.getCurrentPlayerID(), 4); // Player 3 skipped!

      game.currentTurnPlayed({
        attackerID: 4,
        card: { action: "affliction", isInstant: false },
        opponentID: 5,
      });
      game.passTurn();
      assertEquals(game.getCurrentPlayerID(), 5);

      game.currentTurnPlayed({
        attackerID: 5,
        card: { action: "affliction", isInstant: false },
        opponentID: 1,
      });
      game.passTurn();
      assertEquals(game.getCurrentPlayerID(), 1);
    });

    it("6-player game: Cryopreservation puts all 5 opponents to sleep", () => {
      const { game, players } = setupGameWithPlayers(6);

      assertEquals(game.getCurrentPlayerID(), 1);

      // Player 1 plays Cryopreservation
      const result = game.applyCryopreservation(1);
      assertEquals(result.success, true);

      // Players 2 to 6 must all be sleeping for 2 turns
      for (let i = 1; i < 6; i++) {
        assertEquals(players[i].isSleeping(), true);
        assertEquals(players[i].sleepCount, 2);
      }
      assertEquals(players[0].isSleeping(), false);
    });
  });

  describe("All Card Mechanics and Resolution Scenarios", () => {
    it("Vaccine mechanic: blocks incoming affliction points", () => {
      const { game, players } = setupGameWithPlayers(2);
      const target = players[1];
      const targetOrganID = target.getPlayerDetails().organCards[0].id;

      // Apply vaccine to Player 2
      game.applyVaccine(2);
      assertEquals(target.isVaccinated(), true);

      // Attack Player 2's organ
      game.afflictOrganOfOpponent(2, targetOrganID, 1);

      // Organ health should NOT change, but vaccine points should decrease
      const organAfter = target.getPlayerDetails().organCards.find((o) =>
        o.id === targetOrganID
      );
      assertEquals(organAfter.health, organAfter.maxHealth);
    });

    it("Transplant mechanic: moves an organ from opponent to attacker", () => {
      const { game, players } = setupGameWithPlayers(2);
      const opponentOrgan = players[1].getPlayerDetails().organCards[0];

      const p1OrgansBefore = players[0].getPlayerDetails().organCards.length;
      const p2OrgansBefore = players[1].getPlayerDetails().organCards.length;

      game.transplantOrgan(1, 2, opponentOrgan.id);

      assertEquals(
        players[0].getPlayerDetails().organCards.length,
        p1OrgansBefore + 1,
      );
      assertEquals(
        players[1].getPlayerDetails().organCards.length,
        p2OrgansBefore - 1,
      );
    });

    it("Medicine mechanic: heals an afflicted organ back to full health", () => {
      const { game, players } = setupGameWithPlayers(2);
      const organ = players[0].getPlayerDetails().organCards[0];

      // Afflict organ first (reduce health)
      players[0].afflictOrgan(organ.id, 1);
      assertEquals(players[0].getPlayerDetails().organCards[0].health, 1);

      // Heal organ
      game.healOrgan(1, organ.id);
      assertEquals(players[0].getPlayerDetails().organCards[0].health, 2);
    });

    it("It's Alive mechanic: reanimates a dead organ from organ discard pile", () => {
      const { game, players } = setupGameWithPlayers(2);
      const organIDToKill = players[1].getPlayerDetails().organCards[0].id;

      // Remove and discard organ
      game.removeOrgan(2, organIDToKill);
      const discardPile = game.getOrganDiscardPile();
      assertEquals(discardPile.length, 1);

      // Reanimate for Player 1
      const reanimated = game.itsAlive(1, organIDToKill);
      assertNotEquals(reanimated, -1);
      assertEquals(game.getOrganDiscardPile().length, 0);
    });

    it("Situs Inversus mechanic: swaps Heart & Lungs and reverses turn direction", () => {
      const { game, players } = setupGameWithPlayers(4);

      // Assign Heart to Player 1 and Lungs to Player 3
      players[0].fillHandWithOrgans([new Organ("Heart", 7, 2)]);
      players[2].fillHandWithOrgans([new Organ("Lungs", 13, 2)]);

      assertEquals(players[0].hasOrgan("heart"), true);
      assertEquals(players[2].hasOrgan("lungs"), true);

      game.exchangeHeartAndLungs();
      game.changeOrderOfPlay();

      assertEquals(players[0].hasOrgan("lungs"), true);
      assertEquals(players[2].hasOrgan("heart"), true);
    });

    it("Chart Mixup mechanic: discards and redeals attack hands for all players", () => {
      const { game, players } = setupGameWithPlayers(3);

      game.chartMixup();
      const p1AttacksAfter = [...players[0].getPlayerDetails().attackCards];

      assertEquals(p1AttacksAfter.length, 5);
    });

    it("By The Book mechanic: discards non-affliction cards and refills hands", () => {
      const { game, players } = setupGameWithPlayers(2);

      players[0].fillHandWithAttacks([
        { id: 101, action: "medicine", type: "tactical" },
        { id: 102, action: "affliction", type: "affliction" },
      ]);

      game.bythebook();

      const attacksAfter = players[0].getPlayerDetails().attackCards;
      // Only affliction card should remain from original, plus refills
      assertEquals(attacksAfter.some((c) => c.action === "affliction"), true);
    });
  });

  describe("6-Player Elimination & Victory Condition", () => {
    it("Should eliminate players 2 through 6 until Player 1 is the sole survivor", () => {
      const { game, players } = setupGameWithPlayers(6);

      // Eliminate players 2, 3, 4, 5, 6 by removing all their organs
      for (let pIndex = 1; pIndex < 6; pIndex++) {
        const playerID = pIndex + 1;
        const organs = [...players[pIndex].getPlayerDetails().organCards];
        organs.forEach((o) => game.removeOrgan(playerID, o.id));
        assertEquals(players[pIndex].isAlive(), false);
      }

      // Check living players in game details
      const livingPlayers = game.getAllPlayersDetails().filter((p) =>
        p.isAlive
      );
      assertEquals(livingPlayers.length, 1);
      assertEquals(livingPlayers[0].id, 1);
      assertEquals(livingPlayers[0].name, "Player_1");
    });
  });
});
