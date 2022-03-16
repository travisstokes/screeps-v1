import {assert} from "chai";
import { DefaultRoomManager } from "managers/DefaultRoomManager";
// import {loop} from "../../src/main"
import "../../src/prototypes";
import "../../src/constants";
import "../../src/interfaces/global-interfaces/room-memory"
import "../../src/interfaces/global-interfaces/creep-memory"

import {Game, Memory} from "./mock"

describe("constant-values", () => {
  it("should recognize values during constructor call", () => {
    assert.isTrue(new DefaultRoomManager() != undefined);
  });
});

// describe("main", () => {
//   before(() => {
//     // runs before all test in this block
//   });

//   beforeEach(() => {
//     // runs before each test in this block
//     // @ts-ignore : allow adding Game to global
//     global.Game = _.clone(Game);
//     // @ts-ignore : allow adding Memory to global
//     global.Memory = _.clone(Memory);
//   });

//   it("should export a loop function", () => {
//     assert.isTrue(typeof loop === "function");
//   });

//   it("should return void when called with no context", () => {
//     assert.isUndefined(loop());
//   });

//   it("Automatically delete memory of missing creeps", () => {
//     Memory.creeps.persistValue = "any value";
//     Memory.creeps.notPersistValue = "any value";

//     Game.creeps.persistValue = "any value";

//     loop();

//     assert.isDefined(Memory.creeps.persistValue);
//     assert.isUndefined(Memory.creeps.notPersistValue);
//   });
// });
