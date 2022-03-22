import { IGoalProgress, IRoomGoal } from "./IRoomGoal";


export class ImpossibleGoal implements IRoomGoal {
    checkProgress(room: Room): IGoalProgress {
        return { achieved: false };
    }
    attemptProgress(room: Room, progress: IGoalProgress): boolean {
        return true;
    }
}
