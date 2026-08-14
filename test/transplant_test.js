import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Game } from "../src/models/game.js";
import { Player } from "../src/models/player.js";
import { Organ } from "../src/models/organ.js";

describe("Transplant Card Mechanic Tests", () => {
  it("Transplant transfers targeted organ from opponent to attacker", () => {
    const p1 = new Player("p1", 1);
    const p2 = new Player("p2", 2);

    const organ = new Organ("Kidney", 5, 2, 2);
    p2.addOrgan(organ);

    const game = new Game([p1, p2], null, null, null, null);

    game.transplantOrgan(1, 2, 5);

    assertEquals(p1.getPlayerDetails().organCards.length, 1);
    assertEquals(p1.getPlayerDetails().organCards[0].id, 5);
    assertEquals(p2.getPlayerDetails().organCards.length, 0);
  });
});
