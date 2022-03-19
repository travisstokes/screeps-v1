import { PerformActOnTargetGoal } from "./PerformActOnTargetGoal";


export class HarvestEnergyFromNearestGoal extends PerformActOnTargetGoal<Source> {
    actionTriggersWorking: boolean = false;
    checkAchieved(creep: Creep): boolean {
        return creep.memory.working
            || creep.store.getFreeCapacity() == 0
            || !this.getActionTarget(creep);
    }
    getActionTarget(creep: Creep): Source | null {
        return creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    }
    performAction(creep: Creep, target: Source): ScreepsReturnCode {
        return creep.harvest(target);
    }
    actionDescription: string = "harvest";
}
