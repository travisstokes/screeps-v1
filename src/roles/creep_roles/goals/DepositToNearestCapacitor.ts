import { PerformActOnTargetGoal } from "./PerformActOnTargetGoal";


export class DepositToNearestCapacitor extends PerformActOnTargetGoal<AnyOwnedStructure> {
    actionTriggersWorking: boolean = true;
    checkAchieved(creep: Creep): boolean {
        return creep.store.energy == 0
            || this.getActionTarget(creep) == null;
    }
    getActionTarget(creep: Creep): AnyOwnedStructure | null {
        return creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_SPAWN
                    || s.structureType == STRUCTURE_EXTENSION)
                    && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
    }
    performAction(creep: Creep, target: AnyOwnedStructure): ScreepsReturnCode {
        return creep.transfer(target, RESOURCE_ENERGY);
    }
    actionDescription: string = "transfer";
}
