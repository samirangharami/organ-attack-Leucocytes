import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Game } from "../src/models/game.js";
import { Player } from "../src/models/player.js";
import { Organ } from "../src/models/organ.js";
import { Deck } from "../src/models/deck.js";
import { AfflictionHandler } from "../src/models/affliction_handler.js";

describe("Removal Affliction Card Mechanic Tests", () => {
  it("Removal affliction card removes 2 health points directly from removable organ", () => {
    const p1 = new Player("p1", 1);
    const p2 = new Player("p2", 2);

    const organ = new Organ("Appendix", 1, 2, 2);
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

    game.afflictOrganOfOpponent(2, 1, 2);

    assertEquals(p2.getPlayerDetails().organCards.length, 0);
  });
});
