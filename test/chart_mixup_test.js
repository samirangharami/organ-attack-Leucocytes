import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Game } from "../src/models/game.js";
import { Player } from "../src/models/player.js";
import { Deck } from "../src/models/deck.js";
import { Dealer } from "../src/models/dealer.js";
import { AfflictionHandler } from "../src/models/affliction_handler.js";

describe("Chart Mixup Card Mechanic Tests", () => {
  it("Should discard all attack cards and redeal 5 attack cards to each player", () => {
    const shuffle = (x) => x;
    const attackCards = new Deck(
      Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        action: "affliction",
        type: "affliction",
      })),
      shuffle,
    );
    const organCards = new Deck([], shuffle);

    const p1 = new Player("p1", 1);
    const p2 = new Player("p2", 2);

    p1.fillHandWithAttacks([{ id: 101, action: "chart-mixup" }]);
    p2.fillHandWithAttacks([{ id: 102, action: "affliction" }]);

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

    game.chartMixup();

    const p1Cards = p1.getPlayerDetails().attackCards;
    const p2Cards = p2.getPlayerDetails().attackCards;

    assertEquals(p1Cards.length, 5);
    assertEquals(p2Cards.length, 5);
  });
});
