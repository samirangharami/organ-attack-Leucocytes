import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Game } from "../src/models/game.js";
import { Player } from "../src/models/player.js";
import { TurnManager } from "../src/models/turn_manager.js";
import { Organ } from "../src/models/organ.js";

describe("Narcolepsy Card Mechanic Tests", () => {
  it("Narcolepsy should set target player sleep count to 1", () => {
    const p1 = new Player("p1", 1);
    const p2 = new Player("p2", 2);
    p1.addOrgan(new Organ("Heart", 1, 2));
    p2.addOrgan(new Organ("Lungs", 2, 2));

    const turnManager = new TurnManager([p1, p2], 0);
    const game = new Game([p1, p2], null, null, null, null, turnManager);
    game.setFirstPlayer();

    game.applyNarcolepsy(2);
    assertEquals(p2.sleepCount, 1);
    assertEquals(p2.isSleeping(), true);

    game.currentTurnPlayed({
      attackerID: 1,
      card: { action: "narcolepsy", isInstant: false },
      opponentID: 2,
    });
    game.passTurn();

    assertEquals(game.getCurrentPlayerID(), 1); // Player 2 skipped
    assertEquals(p2.sleepCount, 0); // Sleep count decremented
  });

  it("Narcolepsy played on current turn player forces their turn to pass immediately", () => {
    const p1 = new Player("p1", 1);
    const p2 = new Player("p2", 2);
    p1.addOrgan(new Organ("Heart", 1, 2));
    p2.addOrgan(new Organ("Lungs", 2, 2));

    const turnManager = new TurnManager([p1, p2], 0);
    const game = new Game([p1, p2], null, null, null, null, turnManager);
    game.setFirstPlayer();

    // Out-of-turn instant Narcolepsy played by p2 on p1 (the current player)
    game.applyNarcolepsy(1);
    assertEquals(p1.sleepCount, 1);

    game.currentTurnPlayed({
      attackerID: 2,
      card: { action: "narcolepsy", isInstant: true },
      opponentID: 1,
    });

    assertEquals(game.currentPlayedCard, true); // Narcolepsy on current player marks turn played
    game.passTurn();
    assertEquals(game.getCurrentPlayerID(), 2); // Turn passes to Player 2
  });
});
