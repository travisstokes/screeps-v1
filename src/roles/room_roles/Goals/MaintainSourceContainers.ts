import { SourceContainerData } from "interfaces/ISourceManager";
import { IGoalProgress, IRoomGoal } from "./IRoomGoal";


export class MaintainSouceContainers implements IRoomGoal {
    // TODO: Temporary; ideally we'd be able to count on the source manager to cache this stuff correctly like a proper data/service layer.
    private sourceContainerDataHash: {
        [roomName: string]: SourceContainerData[]
    } = {};

    checkProgress(room: Room): IGoalProgress {
        var sourceContainerData = Game.services.sourceManager.getSourceContainerData(room)
        var achieved = _.all(sourceContainerData, data => data.container);

        return {
            achieved: achieved,
            state: sourceContainerData
        }
    }
    attemptProgress(room: Room, progress: IGoalProgress): boolean {
        try {
            var sourceContainerData = progress.state as SourceContainerData[];
            for(var data of sourceContainerData)
            {
                if(data.container) {
                    continue;
                }

                var recommendedContainerLocation = Game.services.sourceManager.getRecommendedContainerSite(room.name, data.source)

                if(!recommendedContainerLocation) {
                    console.log(`Failed to find recommended container location for source ${data.source.id}`);
                    return false;
                }

                room.createConstructionSite(recommendedContainerLocation, STRUCTURE_CONTAINER);
            }

            return true;
        } finally {
            delete this.sourceContainerDataHash[room.name];
        }
    }
}
