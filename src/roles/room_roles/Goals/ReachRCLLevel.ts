import { IGoalProgress, IRoomGoal } from "./IRoomGoal";

export class ReachRCLLevel implements IRoomGoal {
    protected level: number;

    constructor(level: number) {
        this.level = level;
    }
    checkProgress(room: Room): IGoalProgress {
        return { achieved: (room.controller?.level ?? 0) >= this.level };
    }
    attemptProgress(room: Room, progress: IGoalProgress): boolean {
        return true;
    }
}
