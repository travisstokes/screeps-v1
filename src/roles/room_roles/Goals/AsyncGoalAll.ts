import { IRoomGoal } from "./IRoomGoal";

export class AsyncGoalAll implements IRoomGoal {
    private goals: IRoomGoal[];

    // TODO: Temporary; ideally we'd be able to count on the source manager to cache this stuff correctly like a proper data/service layer.
    private achievedGoalsHash: {
        [roomName: string]: boolean[]
    } = {};

    constructor(goals: IRoomGoal[]) {
        this.goals = goals;
    }

    checkAchieved(room: Room): boolean {
        this.achievedGoalsHash[room.name] = this.goals.map(g => g.checkAchieved(room));
        return _.all(this.achievedGoalsHash[room.name]);
    }
    attemptProgress(room: Room): boolean {
        var achievedGoalsArray = this.achievedGoalsHash[room.name];

        for(var index in achievedGoalsArray){
            if(achievedGoalsArray[index]) {
                continue;
            }
            this.goals[index].attemptProgress(room);
        }

        return true;
    }
}
