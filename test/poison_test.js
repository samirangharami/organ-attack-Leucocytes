import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { Game } from "../src/models/game.js";
import { Player } from "../src/models/player.js";
import { Organ } from "../src/models/organ.js";
import { Deck } from "../src/models/deck.js";
import { TurnManager } from "../src/models/turn_manager.js";

describe("Poison Card Mechanic Tests", () => {
  it("Poison should remove target organ from player holding poison", () => {
    const p1 = new Player("p1", 1);
    const p2 = new Player("p2", 2);

    const organ1 = new Organ("Heart", 1, 2);
    const organ2 = new Organ("Lungs", 2, 2);
    p1.addOrgan(organ1);
    p1.addOrgan(organ2);
    p2.addOrgan(new Organ("Kidney", 3, 2));

    const shuffle = (cards) => cards;

    const organDeck = new Deck([], shuffle);

    const turnManager = new TurnManager([p1, p2], 0);

    const game = new Game(
      [p1, p2],
      null,
      organDeck,
      null,
      null,
      turnManager,
    );

    game.setFirstPlayer();

    // Player 1 plays poison on their own organ (id 1)
    game.removeOrgan(1, 1);

    assertEquals(p1.getPlayerDetails().organCards.length, 1);
    assertEquals(p1.getPlayerDetails().organCards[0].id, 2);
  });
});
