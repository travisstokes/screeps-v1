import { PerformActOnTargetGoal } from "./PerformActOnTargetGoal";

export class CollectStoredEnergyFromNearestGoal extends PerformActOnTargetGoal<AnyStructure> {
    actionTriggersWorking: boolean = false;
    actionDescription: string = "withdraw";

    checkAchieved(creep: Creep): boolean {
        return creep.memory.working || creep.store.getFreeCapacity() == 0;
    }

    getActionTarget(creep: Creep): AnyStructure | null {
        return creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => {
                (s.structureType == STRUCTURE_CONTAINER
                    || s.structureType == STRUCTURE_STORAGE)
                && s.store.energy > 0
            },
            maxRooms: 1
        });
    }
    performAction(creep: Creep, target: AnyStructure): ScreepsReturnCode {
        return creep.withdraw(target, RESOURCE_ENERGY);
    }
}
