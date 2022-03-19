import { PerformActOnTargetGoal } from "./PerformActOnTargetGoal";

export class HarvestAssignedSourceGoal extends PerformActOnTargetGoal<Source> {
  checkAchieved(creep: Creep): boolean {
    return creep.memory.working
      || !creep.memory.assignedSource
      || creep.store.getFreeCapacity() == 0
      || this.getActionTarget(creep)?.energy == 0;
  }
  getActionTarget(creep: Creep): Source | null {
    if (!creep.memory.assignedSource) {
      return null;
    }

    return Game.getObjectById(creep.memory.assignedSource);
  }
  performAction(creep: Creep, target: Source): ScreepsReturnCode {
    return creep.harvest(target);
  }

  actionDescription: string = "harvest";
  actionTriggersWorking: boolean = false;
}
