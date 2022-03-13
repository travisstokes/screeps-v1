import { ISpawnData } from "./ISpawnData";

export interface IRole {
  run(creep: Creep): void;
  roleName: string;
  getSpawnData(maxEnergy: number): ISpawnData;
}
