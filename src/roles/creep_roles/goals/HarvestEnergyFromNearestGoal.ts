import { PerformActOnTargetGoal } from "./PerformActOnTargetGoal";


export class HarvestEnergyFromNearestGoal extends PerformActOnTargetGoal<Source> {
    actionTriggersWorking: boolean = false;
    checkAchieved(creep: Creep): boolean {
        return creep.memory.working || creep.store.getFreeCapacity() == 0;
    }
    getActionTarget(creep: Creep): Source | null {
        return creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (s) => {
                s.energy > 0;
            },
            maxRooms: 1
        });
    }
    performAction(creep: Creep, target: Source): ScreepsReturnCode {
        return creep.harvest(target);
    }
    actionDescription: string = "harvest";
}
