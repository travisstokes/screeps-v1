import { ISpawner } from 'managers/SpawnManager';
import { IRoleManager } from "interfaces/IRoleManager";
import { IGarbageCollector } from 'services/Utility/GarbageCollector';
import { ITowerManager } from 'managers/TowerManager';
import { ISourceManager } from 'interfaces/ISourceManager';
import { ICreepRole } from 'interfaces/ICreepRole';

declare interface IGameServices {
  spawnManager: ISpawner,
  creepRoleManager: IRoleManager<ICreepRole>,
  towerManager: ITowerManager,
  garbageCollector: IGarbageCollector,
  sourceManager: ISourceManager
}

declare global {
  interface Game {
    services: IGameServices
  }
}
