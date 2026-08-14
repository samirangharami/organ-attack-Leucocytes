import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Game } from "../src/models/game.js";
import { Player } from "../src/models/player.js";
import { Organ } from "../src/models/organ.js";
import { Deck } from "../src/models/deck.js";
import { AfflictionHandler } from "../src/models/affliction_handler.js";

describe("Necrosis Card Mechanic Tests", () => {
  it("Necrosis deals 2 damage and destroys an organ with health 2", () => {
    const p1 = new Player("p1", 1);
    const p2 = new Player("p2", 2);

    const organ = new Organ("Heart", 1, 2, 2);
    p2.addOrgan(organ);

    const attackDeck = new Deck([], (x) => x);
    const organDeck = new Deck([], (x) => x);
    const afflictionHandler = new AfflictionHandler(attackDeck, organDeck, [
      p1,
      p2,
    ]);

    const game = new Game(
      [p1, p2],
      attackDeck,
      organDeck,
      null,
      afflictionHandler,
    );

    // Necrosis deals 2 points of affliction damage
    game.afflictOrganOfOpponent(2, 1, 2);

    // Organ is destroyed and removed
    assertEquals(p2.getPlayerDetails().organCards.length, 0);
    assertEquals(p2.isAlive(), false);
  });
});
