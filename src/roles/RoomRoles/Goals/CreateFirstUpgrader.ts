import { IRoomGoal } from "./IRoomGoal";

export class CreateFirstUpgrader implements IRoomGoal {
    checkAchieved(room: Room): boolean {
        return room.countCreeps(["upgrader"]) > 0;
    }
    attemptProgress(room: Room): boolean {
        return room.createCreep("upgrader", 0, false) == OK;
    }
}
