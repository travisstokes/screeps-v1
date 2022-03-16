import { IRoomGoal } from "./IRoomGoal";

export class CreateFirstMiner implements IRoomGoal {
    checkAchieved(room: Room): boolean {
        return room.countCreeps(["harvester", "static-miner"]) > 0;
    }
    attemptProgress(room: Room): boolean {
        var result = room.createCreep("harvester", 0, false);

        if(result == OK) {
            return true;
        }

        console.log(result);

        return false;
    }
}
