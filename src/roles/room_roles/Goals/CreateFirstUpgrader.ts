import { UPGRADER_ROLE } from "constants/CreepRoleConstants";
import { IGoalProgress, IRoomGoal } from "./IRoomGoal";

export class CreateFirstUpgrader implements IRoomGoal {
    checkProgress(room: Room): IGoalProgress {
        return { achieved: room.countCreeps([UPGRADER_ROLE]) > 0 }
    }
    attemptProgress(room: Room, progress: IGoalProgress): boolean {
        return room.createCreep(UPGRADER_ROLE, 0, false) == OK;
    }
}
