// TODO: Probably want to change the attempt progress result to screep error codes or custom ones to let the room controller figure out what to do.
export interface IGoalProgress {
    achieved: boolean;
    state?: any;
}

export interface IRoomGoal {
    checkProgress(room: Room): IGoalProgress;
    attemptProgress(room: Room, progressState: IGoalProgress): boolean;
}


