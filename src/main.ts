import { IGameServices } from "interfaces/global-interfaces/game";
import { SourceManager } from "managers/SourceManager";
import { DefaultTowerManager } from "managers/TowerManager";
import { ErrorMapper } from "utils/ErrorMapper";
import { GarbageCollector } from "./services/Utility/GarbageCollector";
import { CreepRoleManager } from "./managers/CreepRoleManager";
import { StaticSpawner } from "./managers/SpawnManager";
import { RouteService } from "services/Utility/RouteService";
import { DefaultRoomManager } from "managers/DefaultRoomManager";

import "constants";
import "prototypes";

console.log(`Startup game tick is ${Game.time}`);

function initServices() {
  if(Game.services) {
    return;
  }

  if(initServices.services.spawnManager) {
    Game.services = initServices.services;
    return;
  }

  console.log("Initializing services");

  var spawnManager = new StaticSpawner();
  Game.services = initServices.services = {
    spawnManager: spawnManager,
    creepRoleManager: new CreepRoleManager(),
    garbageCollector: new GarbageCollector(),
    towerManager: new DefaultTowerManager(),
    sourceManager: new SourceManager(),
    routeService: new RouteService(),
    roomManager: new DefaultRoomManager(),
  }

  spawnManager.loadQueue();
}
initServices.services = <IGameServices>{};

export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);
  initServices();

  Game.services.roomManager.runAll();

  Game.services.creepRoleManager.runAll();

  Game.services.towerManager.run();

  Game.services.spawnManager.processQueue();

  Game.services.garbageCollector.cleanCreeps();
});
