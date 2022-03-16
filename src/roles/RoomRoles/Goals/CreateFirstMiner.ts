import { IRoomGoal } from "./IRoomGoal";

export class CreateFirstMiner implements IRoomGoal {
    checkAchieved(room: Room): boolean {
        return room.countCreeps([HARVESTER_ROLE, STATIC_MINER_ROLE]) > 0;
    }
    attemptProgress(room: Room): boolean {
        var result = room.createCreep(HARVESTER_ROLE, 0, false);

        if(result == OK) {
            return true;
        }

        console.log(result);

        return false;
    }
}
