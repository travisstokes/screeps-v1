import { HARVESTER_ROLE, STATIC_MINER_ROLE } from "constants/CreepRoleConstants";
import { IGoalProgress, IRoomGoal } from "./IRoomGoal";

export class CreateFirstMiner implements IRoomGoal {
    checkProgress(room: Room): IGoalProgress {
        return { achieved: room.countCreeps([HARVESTER_ROLE, STATIC_MINER_ROLE]) > 0 };
    }
    attemptProgress(room: Room, progress: IGoalProgress): boolean {
        var result = room.createCreep(HARVESTER_ROLE, 0, false);

        if(result == OK) {
            return true;
        }

        console.log(result);

        return false;
    }
}
