import { ISpawner } from 'services/SpawnManager';
import { IRoleManager } from "services/RoleManager";
import { IGarbageCollector } from 'services/GarbageCollector';
import { ITowerManager } from 'services/TowerManager';
import { ISourceManager } from 'interfaces/ISourceManager';

declare interface IGameServices {
  spawnManager: ISpawner,
  roleManager: IRoleManager,
  towerManager: ITowerManager,
  garbageCollector: IGarbageCollector,
  sourceManager: ISourceManager
}

declare global {
  interface Game {
    services: IGameServices
  }
}
