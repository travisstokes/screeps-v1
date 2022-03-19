import { IRoomGoal } from "./IRoomGoal";


export class ImpossibleGoal implements IRoomGoal {
    checkAchieved(room: Room): boolean {
        return false;
    }
    attemptProgress(room: Room): boolean {
        return true;
    }
}
