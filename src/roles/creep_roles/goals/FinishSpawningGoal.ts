import { ICreepGoal } from "./ICreepGoal";

export class FinishSpawningGoal implements ICreepGoal{
    checkAchieved(creep: Creep): boolean {
        return !creep.spawning;
    }
    attemptProgress(creep: Creep): boolean {
        return true;
    }

}
