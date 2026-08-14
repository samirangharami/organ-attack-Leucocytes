import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Game } from "../src/models/game.js";
import { Player } from "../src/models/player.js";

describe("Common Cold Card Mechanic Tests", () => {
  it("Should exchange a card between attacker and opponent", () => {
    const p1 = new Player("p1", 1);
    const p2 = new Player("p2", 2);

    p1.fillHandWithAttacks([
      { id: 1, action: "common-cold" },
      { id: 3, action: "immunity-boost" },
      { id: 4, action: "immunity-boost" },
      { id: 5, action: "immunity-boost" },
      { id: 6, action: "immunity-boost" },
    ]);

    p2.fillHandWithAttacks([
      { id: 2, action: "immunity-boost" },
      { id: 7, action: "narcolepsy" },
      { id: 8, action: "medicine" },
      { id: 9, action: "sedate" },
      { id: 10, action: "chart-mixup" },
    ]);

    const game = new Game([p1, p2], null, null, null, null);

    game.exchangeCard(1, 1, 2);

    const p1Cards = p1.getPlayerDetails().attackCards;

    const p2Cards = p2.getPlayerDetails().attackCards;

    assertEquals(p1Cards.some((c) => [2, 7, 8, 9, 10].includes(c.id)), true);
    assertEquals(p2Cards.some((c) => c.id === 1), true);
  });
});
