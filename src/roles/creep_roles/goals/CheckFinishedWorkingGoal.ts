import { ICreepGoal } from "./ICreepGoal";

export class CheckFinishedWorkingGoal implements ICreepGoal{
    checkAchieved(creep: Creep): boolean {
        if(creep.memory.working && creep.store.energy == 0) {
            creep.memory.working = false;
        }

        return true;
    }
    attemptProgress(creep: Creep): boolean {
        return true;
    }

}
