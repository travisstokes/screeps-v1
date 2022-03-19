import { ICreepGoal } from "./ICreepGoal";


export class GetAssignedToSourceGoal implements ICreepGoal {
  checkAchieved(creep: Creep): boolean {
    return !!creep.memory.assignedSource;
  }
  attemptProgress(creep: Creep): boolean {
    Game.services.sourceManager.assignSource(creep);
    return true;
  }
}
