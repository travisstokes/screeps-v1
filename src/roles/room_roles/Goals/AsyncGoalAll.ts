import { getServers } from "dns";
import { IGoalProgress, IRoomGoal } from "./IRoomGoal";

interface AsyncGoalResult {
    goal: IRoomGoal,
    state: IGoalProgress
}

export class AsyncGoalAll implements IRoomGoal {
    private goals: IRoomGoal[];

    constructor(goals: IRoomGoal[]) {
        this.goals = goals;
    }

    checkProgress(room: Room): IGoalProgress {
        var goalResults = this.goals.map(g => <AsyncGoalResult>{ goal: g, state: g.checkProgress(room) });
        var achieved = _.all(goalResults, result => result.state.achieved);

        return {
            achieved: achieved,
            state: goalResults
        }
    }
    attemptProgress(room: Room, goalProgress: IGoalProgress): boolean {
        var asyncResults = goalProgress.state as AsyncGoalResult[];
        for(var result of asyncResults){
            if(result.state.achieved) {
                continue;
            }

            result.goal.attemptProgress(room, result.state);
        }

        return true;
    }
}
