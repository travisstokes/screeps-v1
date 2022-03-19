import { PerformActOnTargetGoal } from "./PerformActOnTargetGoal";

export class DepositToNearestStorageGoal extends PerformActOnTargetGoal<StructureStorage> {
  checkAchieved(creep: Creep): boolean {
    return creep.store.energy == 0
      || !creep.room.storage
      || creep.room.storage.store.getFreeCapacity() == 0;
  }
  getActionTarget(creep: Creep): StructureStorage | null {
    return creep.room.storage ?? null;
  }
  performAction(creep: Creep, target: StructureStorage): ScreepsReturnCode {
    return creep.transfer(target, RESOURCE_ENERGY);
  }
  actionDescription: string = "transfer";
  actionTriggersWorking: boolean = true;
}
