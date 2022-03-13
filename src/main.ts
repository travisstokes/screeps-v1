import { IGameServices } from "interfaces/global-interfaces/game";
import { SourceManager } from "services/SourceManager";
import { DefaultTowerManager } from "services/TowerManager";
import { ErrorMapper } from "utils/ErrorMapper";
import { GarbageCollector } from "./services/GarbageCollector";
import { RoleManager } from "./services/RoleManager";
import { StaticSpawner } from "./services/SpawnManager";

console.log(`Startup game tick is ${Game.time}`);

function initServices() {
  if(Game.services) {
    return;
  }

  if(!initServices.services.spawnManager) {
    console.log("Initializing services");
    var spawnManager = new StaticSpawner();
    initServices.services = {
      spawnManager: spawnManager,
      roleManager: new RoleManager(),
      garbageCollector: new GarbageCollector(),
      towerManager: new DefaultTowerManager(),
      sourceManager: new SourceManager()
    }

    spawnManager.loadQueue();
  }
  Game.services = initServices.services;

}
initServices.services = <IGameServices>{};

export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);
  initServices();

  Game.services.roleManager.runAll();

  Game.services.towerManager.run();

  Game.services.spawnManager.processQueue();

  Game.services.garbageCollector.cleanCreeps();
});
