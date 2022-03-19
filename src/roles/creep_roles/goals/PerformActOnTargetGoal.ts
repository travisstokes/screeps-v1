import { ICreepGoal } from "./ICreepGoal";


export abstract class PerformActOnTargetGoal<T extends _HasRoomPosition & _HasId> implements ICreepGoal {
    abstract checkAchieved(creep: Creep): boolean;
    abstract getActionTarget(creep: Creep): T | null;
    abstract performAction(creep: Creep, target: T): ScreepsReturnCode;
    abstract actionDescription: string;
    abstract actionTriggersWorking: boolean;

    attemptProgress(creep: Creep): boolean {
        var target = this.getActionTarget(creep);

        if (!target) {
            return false;
        }

        var actionResult = this.performAction(creep, target);

        switch (actionResult) {
            case ERR_NOT_IN_RANGE:
                if(creep.fatigue > 0) {
                    return true;
                }

                var moveToResult = creep.moveTo(target);
                if (moveToResult == OK) {
                    return true;
                }

                console.log(`Creep ${creep.id} could not move to ${target.id}. Screeps Error Code: ${moveToResult}`);
                return false;
            case OK:
                if (this.actionTriggersWorking) {
                    creep.memory.working = true;
                }
                return true;
            default:
                console.log(`Creep ${creep.id} could not act (${this.actionDescription}) on ${target.id}. Screeps Error Code: ${actionResult}`);
                return false;
        }
    }
}
