import { IGameServices } from "interfaces/global-interfaces/game";
import { SourceManager } from "managers/SourceManager";
import { DefaultTowerManager } from "managers/TowerManager";
import { ErrorMapper } from "utils/ErrorMapper";
import { GarbageCollector } from "./services/Utility/GarbageCollector";
import { CreepRoleManager } from "./managers/CreepRoleManager";
import { StaticSpawner } from "./managers/SpawnManager";

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
    sourceManager: new SourceManager()
  }

  spawnManager.loadQueue();
}
initServices.services = <IGameServices>{};

export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);
  initServices();

  Game.services.creepRoleManager.runAll();

  Game.services.towerManager.run();

  Game.services.spawnManager.processQueue();

  Game.services.garbageCollector.cleanCreeps();
});
