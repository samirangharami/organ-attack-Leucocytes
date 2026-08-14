import { gameSetup } from "../src/game_setup.js";
import { beforeEach, describe, it } from "@std/testing/bdd";
import { assert, assertEquals, assertInstanceOf } from "@std/assert";
import { Game } from "../src/models/game.js";

describe("Game setup tests", () => {
  let roomID;
  let rooms;
  let games;
  let ctx;
  let players;

  beforeEach(() => {
    roomID = "101";
    players = [{ name: "qwerty", id: 1 }, { name: "asdf", id: 2 }];
    rooms = { [roomID]: { players } };
    games = {};
    ctx = {
      games,
      rooms,
      get(name) {
        return this[name];
      },
      req: {
        json() {
          return { roomID };
        },
      },
      json(json, status) {
        return { body: json, status };
      },
      shuffle(arr) {
        return arr;
      },
      players,
    };
  });

  it("Game setup should create game and return player details", async () => {
    const res = await gameSetup(ctx);

    assertEquals(res.status, 201);
    assert(Object.keys(games).includes("101"));
    assertInstanceOf(games["101"], Game);
    assertEquals(res.body.length, 2);
  });

  it("Game setup with invalid room id should return bad request response", async () => {
    roomID = "invalid_id";
    const res = await gameSetup(ctx);
    assertEquals(res.status, 400);
    assertEquals(res.body, { message: "Invalid roomID" });
  });
});
