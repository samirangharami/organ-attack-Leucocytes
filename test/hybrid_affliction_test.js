import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Game } from "../src/models/game.js";
import { Player } from "../src/models/player.js";
import { Organ } from "../src/models/organ.js";
import { Deck } from "../src/models/deck.js";
import { AfflictionHandler } from "../src/models/affliction_handler.js";

describe("Hybrid Affliction Card Mechanic Tests", () => {
  it("Should afflict an organ and reduce health", () => {
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

    game.afflictOrganOfOpponent(2, 1, 1);

    const p2Organs = p2.getPlayerDetails().organCards;
    assertEquals(p2Organs[0].health, 1);
  });
});
