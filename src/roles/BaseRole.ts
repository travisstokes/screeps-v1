import { IRole } from "../interfaces/IRole";
import { ISpawnData } from "../interfaces/ISpawnData";

export abstract class BaseRole implements IRole {
  abstract run(creep: Creep): void;
  abstract roleName: string;
  abstract getSpawnData(maxEnergy: number): ISpawnData;
}
