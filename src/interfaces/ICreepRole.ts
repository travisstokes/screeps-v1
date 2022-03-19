import { ISpawnData } from "./ISpawnData";

export interface ICreepRole {
  run(creep: Creep): void;
  roleName: string;
  getSpawnData(maxEnergy?: number): ISpawnData;
}
