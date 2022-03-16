import { IRoomGoal } from "./IRoomGoal";

export class CreateFirstUpgrader implements IRoomGoal {
    checkAchieved(room: Room): boolean {
        return room.countCreeps([UPGRADER_ROLE]) > 0;
    }
    attemptProgress(room: Room): boolean {
        return room.createCreep(UPGRADER_ROLE, 0, false) == OK;
    }
}
