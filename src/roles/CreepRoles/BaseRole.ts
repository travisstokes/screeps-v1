import { ICreepRole } from "../../interfaces/ICreepRole";
import { ISpawnData } from "../../interfaces/ISpawnData";
import { IBodyMatrixEntry } from "../../interfaces/IBodyMatrixEntry";

export abstract class BaseRole implements ICreepRole {
  abstract run(creep: Creep): void;
  abstract roleName: string;
  abstract bodyMatrix: IBodyMatrixEntry[];

  getSpawnData(maxEnergy?: number) : ISpawnData {
    var possibles = _.filter(this.bodyMatrix, entry => entry.energyRequired <= (maxEnergy ?? Number.MAX_VALUE))
    return {
      body: _.max(possibles, entry => entry.energyRequired)?.body
    }
  }
}
