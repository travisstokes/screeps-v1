import { PerformActOnTargetGoal } from "./PerformActOnTargetGoal";


export class DepositToNearestTowerGoal extends PerformActOnTargetGoal<StructureTower> {
    actionTriggersWorking: boolean = false;
    checkAchieved(creep: Creep): boolean {
        return creep.store.energy == 0
            || this.getActionTarget(creep) == null;
    }
    getActionTarget(creep: Creep): StructureTower | null {
        return creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) =>
                s.structureType == STRUCTURE_TOWER
                && s.store.getFreeCapacity(RESOURCE_ENERGY) >= 50,
            maxRooms: 1
        });
    }
    performAction(creep: Creep, target: StructureTower): ScreepsReturnCode {
        return creep.transfer(target, RESOURCE_ENERGY);
    }
    actionDescription: string = "transfer";
}
