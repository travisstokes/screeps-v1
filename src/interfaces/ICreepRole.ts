import { CREEP_ROLE_CONSTANTS } from "constants/CreepRoleConstants";
import { ISpawnData } from "./ISpawnData";

export interface ICreepRole {
  run(creep: Creep): void;
  getRoleName(): CREEP_ROLE_CONSTANTS;
  getSpawnData(maxEnergy?: number): ISpawnData;
}
