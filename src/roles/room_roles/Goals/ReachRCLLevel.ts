import { IRoomGoal } from "./IRoomGoal";

export class ReachRCLLevel implements IRoomGoal {
    protected level: number;

    constructor(level: number) {
        this.level = level;
    }
    checkAchieved(room: Room): boolean {
        return (room.controller?.level ?? 0) >= this.level;
    }
    attemptProgress(room: Room): boolean {
        return true;
    }
}
