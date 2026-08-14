import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Game } from "../src/models/game.js";
import { Player } from "../src/models/player.js";
import { Organ } from "../src/models/organ.js";

describe("Medicine Card Mechanic Tests", () => {
  it("Should heal damaged organ back to max health", () => {
    const p1 = new Player("p1", 1);
    const organ = new Organ("Heart", 1, 2, 2);
    p1.addOrgan(organ);

    p1.afflictOrgan(1, 1);
    assertEquals(p1.getPlayerDetails().organCards[0].health, 1);

    const game = new Game([p1], null, null, null, null);
    game.healOrgan(1, 1);

    assertEquals(p1.getPlayerDetails().organCards[0].health, 2);
  });
});
