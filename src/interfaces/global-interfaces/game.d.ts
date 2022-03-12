import { ISpawner } from 'services/SpawnManager';
import { IRoleManager } from "services/RoleManager";
import { IGarbageCollector } from 'services/GarbageCollector';
import { ITowerManager } from 'services/TowerManager';

declare interface IGameServices {
  spawnManager: ISpawner,
  roleManager: IRoleManager,
  towerManager: ITowerManager,
  garbageCollector: IGarbageCollector,
}

declare global {
  interface Game {
    services: IGameServices
  }
}
