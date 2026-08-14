import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Game } from "../src/models/game.js";
import { Player } from "../src/models/player.js";
import { TurnManager } from "../src/models/turn_manager.js";
import { Organ } from "../src/models/organ.js";

describe("Sedate Card Mechanic Tests", () => {
  it("Player sleep count should set to 2 and decrement over turns", () => {
    const p1 = new Player("user-1", 1);
    p1.applySleep(2);
    assertEquals(p1.sleepCount, 2);
    assertEquals(p1.isSleeping(), true);

    p1.decreaseSleep();
    assertEquals(p1.sleepCount, 1);
    assertEquals(p1.isSleeping(), true);

    p1.decreaseSleep();
    assertEquals(p1.sleepCount, 0);
    assertEquals(p1.isSleeping(), false);
  });

  it("Applying sedate to opponent through Game model makes opponent sleep for 2 rounds", () => {
    const p1 = new Player("p1", 1);
    const p2 = new Player("p2", 2);
    p1.addOrgan(new Organ("Heart", 1, 2));
    p2.addOrgan(new Organ("Lungs", 2, 2));

    const turnManager = new TurnManager([p1, p2], 0);
    const game = new Game([p1, p2], null, null, null, null, turnManager);
    game.setFirstPlayer();

    const sleepCount = game.applySedate(2);
    assertEquals(sleepCount, 2);
    assertEquals(p2.isSleeping(), true);

    // Player 1 completes turn -> skips Player 2
    game.currentTurnPlayed({
      attackerID: 1,
      card: { action: "sedate", isInstant: false },
      opponentID: 2,
    });
    game.passTurn();

    assertEquals(game.getCurrentPlayerID(), 1); // Turn stays with Player 1 because Player 2 was sleeping
    assertEquals(p2.sleepCount, 1);
  });
});
