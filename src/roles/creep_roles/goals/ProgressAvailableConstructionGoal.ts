import { PerformActOnTargetGoal } from "./PerformActOnTargetGoal";


export class ProgressAvailableConstructionGoal extends PerformActOnTargetGoal<ConstructionSite> {
    actionTriggersWorking: boolean = true;
    checkAchieved(creep: Creep): boolean {
        return creep.store.energy == 0
            || !this.getActionTarget(creep);
    }
    getActionTarget(creep: Creep): ConstructionSite<BuildableStructureConstant> | null {
        return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
            maxRooms: 1
        });
    }
    performAction(creep: Creep, target: ConstructionSite<BuildableStructureConstant>): ScreepsReturnCode {
        return creep.build(target);
    }
    actionDescription: string = "build";
}
