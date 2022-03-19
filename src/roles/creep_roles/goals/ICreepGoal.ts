// TODO: Probably want to change the attempt progress result to screep error codes or custom ones to let the room controller figure out what to do.
export interface ICreepGoal {
    checkAchieved(creep: Creep): boolean;
    attemptProgress(creep: Creep): boolean;
}


