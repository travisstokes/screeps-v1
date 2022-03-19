import { ICreepRole } from "../../interfaces/ICreepRole";
import { ISpawnData } from "../../interfaces/ISpawnData";
import { IBodyMatrixEntry } from "../../interfaces/IBodyMatrixEntry";
import { CREEP_ROLE_CONSTANTS } from "constants/CreepRoleConstants";
import { ICreepGoal } from "./goals/ICreepGoal";

export abstract class GoalBasedRole implements ICreepRole {
  getRoleName(): CREEP_ROLE_CONSTANTS {
    return this.roleName;
  }

  protected abstract roleName: CREEP_ROLE_CONSTANTS;
  protected abstract bodyMatrix: IBodyMatrixEntry[];
  protected abstract creepGoals: ICreepGoal[];

  run(creep: Creep): void {
    for(var goal of this.creepGoals){
      console.log(`Running goal ${goal.constructor.name} for creep ${creep.id}`);
      if(goal.checkAchieved(creep)) {
        continue;
      }

      // TODO: Handle failed progress?
      goal.attemptProgress(creep);
      return;
    }
  }

  getSpawnData(maxEnergy?: number) : ISpawnData {
    var possibles = _.filter(this.bodyMatrix, entry => entry.energyRequired <= (maxEnergy ?? Number.MAX_VALUE))
    return {
      body: _.max(possibles, entry => entry.energyRequired)?.body
    }
  }
}
