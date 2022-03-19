import { PerformActOnTargetGoal } from "./PerformActOnTargetGoal";


export class DepositToNearestCapacitor extends PerformActOnTargetGoal<AnyStructure> {
    actionTriggersWorking: boolean = false;
    checkAchieved(creep: Creep): boolean {
        return creep.store.energy == 0;
    }
    getActionTarget(creep: Creep): AnyStructure | null {
        return creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => {
                (s.structureType == STRUCTURE_SPAWN
                    || s.structureType == STRUCTURE_EXTENSION)
                    && s.store.energy > 0;
            },
            maxRooms: 1
        });
    }
    performAction(creep: Creep, target: AnyStructure): ScreepsReturnCode {
        return creep.transfer(target, RESOURCE_ENERGY);
    }
    actionDescription: string = "transfer";
}
