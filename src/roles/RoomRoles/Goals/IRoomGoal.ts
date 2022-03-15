import { IRoomRole } from "../IRoomRole";

export interface IRoomGoal {
    checkAchieved(room: string): void;
    attemptProgress(room: string): void;
}
