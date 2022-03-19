import { PerformActOnTargetGoal } from "./PerformActOnTargetGoal";

export class DepositToSourceContainerGoal extends PerformActOnTargetGoal<StructureContainer> {
  checkAchieved(creep: Creep): boolean {
    if (creep.store.energy == 0 || !creep.memory.assignedSource) {
      return true;
    }

    var container = Game.services.sourceManager.getContainer(creep.memory.assignedSource);

    return !container || container.store.getFreeCapacity() == 0;
  }

  getActionTarget(creep: Creep): StructureContainer | null {
    if (!creep.memory.assignedSource) {
      return null;
    }

    return Game.services.sourceManager.getContainer(creep.memory.assignedSource);
  }
  performAction(creep: Creep, target: StructureContainer): ScreepsReturnCode {
    return creep.transfer(target, RESOURCE_ENERGY);
  }
  actionDescription: string = "transfer";
  actionTriggersWorking: boolean = true;
}
