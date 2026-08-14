import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Game } from "../src/models/game.js";
import { Player } from "../src/models/player.js";
import { Deck } from "../src/models/deck.js";
import { Dealer } from "../src/models/dealer.js";
import { AfflictionHandler } from "../src/models/affliction_handler.js";

describe("By The Book Card Mechanic Tests", () => {
  it("Should discard all non-affliction cards from players and refill hand", () => {
    const shuffle = (x) => x;
    const attackCards = new Deck(
      Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        action: "affliction",
        type: "affliction",
        afflictableOrgans: [1],
      })),
      shuffle,
    );
    const organCards = new Deck([], shuffle);

    const p1 = new Player("p1", 1);
    const p2 = new Player("p2", 2);

    p1.fillHandWithAttacks([
      { id: 101, action: "by-the-book", type: "tactical" },
      { id: 102, action: "affliction", type: "affliction" },
    ]);
    p2.fillHandWithAttacks([
      { id: 103, action: "sedate", type: "tactical" },
      { id: 104, action: "affliction", type: "affliction" },
    ]);

    const dealer = new Dealer(attackCards, organCards, [p1, p2]);
    const afflictionHandler = new AfflictionHandler(attackCards, organCards, [
      p1,
      p2,
    ]);

    const game = new Game(
      [p1, p2],
      attackCards,
      organCards,
      dealer,
      afflictionHandler,
    );

    game.bythebook();

    // Non-affliction cards (by-the-book, sedate) are discarded, and hands are refilled with affliction cards
    const p1Cards = p1.getPlayerDetails().attackCards;
    const p2Cards = p2.getPlayerDetails().attackCards;

    assertEquals(p1Cards.some((c) => c.action === "by-the-book"), false);
    assertEquals(p2Cards.some((c) => c.action === "sedate"), false);
  });
});
