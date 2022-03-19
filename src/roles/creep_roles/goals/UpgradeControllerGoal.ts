import { PerformActOnTargetGoal } from "./PerformActOnTargetGoal";


export class UpgradeControllerGoal extends PerformActOnTargetGoal<StructureController> {
    actionTriggersWorking: boolean = true;
    checkAchieved(creep: Creep): boolean {
        return creep.store.energy == 0;
    }
    getActionTarget(creep: Creep): StructureController | null {
        return creep.room.controller ?? null;
    }
    performAction(creep: Creep, target: StructureController): ScreepsReturnCode {
        return creep.upgradeController(target);
    }
    actionDescription: string = "upgrade";
}
