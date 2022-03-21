import { SourceContainerData } from "interfaces/ISourceManager";
import { IRoomGoal } from "./IRoomGoal";


export class MaintainSouceContainers implements IRoomGoal {
    // TODO: Temporary; ideally we'd be able to count on the source manager to cache this stuff correctly like a proper data/service layer.
    private sourceContainerDataHash: {
        [roomName: string]: SourceContainerData[]
    } = {};

    checkAchieved(room: Room): boolean {
        var sourceContainerData = Game.services.sourceManager.getSourceContainerData(room)
        var achieved = _.all(sourceContainerData, data => data.container);

        if(!achieved) {
            this.sourceContainerDataHash[room.name] = sourceContainerData;
        }

        return achieved;
    }
    attemptProgress(room: Room): boolean {
        try {
            var sourceContainerData = this.sourceContainerDataHash[room.name] ?? Game.services.sourceManager.getSourceContainerData(room);
            console.log(JSON.stringify(sourceContainerData));
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
