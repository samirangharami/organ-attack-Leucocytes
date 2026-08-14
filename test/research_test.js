import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Game } from "../src/models/game.js";
import { Player } from "../src/models/player.js";
import { Deck } from "../src/models/deck.js";

describe("Research Card Mechanic Tests", () => {
  it("Research card replaces research card with selected card from attack card discard pile", () => {
    const shuffle = (x) => x;
    const attackDeck = new Deck([
      { id: 99, action: "immunity-boost", type: "instant" },
    ], shuffle);

    // Place card 99 into discard pile
    attackDeck.addToDiscardPile({
      id: 99,
      action: "immunity-boost",
      type: "instant",
    });

    const p1 = new Player("p1", 1);
    p1.fillHandWithAttacks([{ id: 1, action: "research", type: "tactical" }]);

    const game = new Game([p1], attackDeck, null, null, null);

    game.research(1, 99, 1);

    const hand = p1.getPlayerDetails().attackCards;
    assertEquals(hand.some((c) => c.id === 99), true);
    assertEquals(hand.some((c) => c.id === 1), false);
  });
});
