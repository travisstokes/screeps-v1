import { EXTENSION_MAX_COUNT } from "constants/RoomConstants";
import { IGoalProgress, IRoomGoal } from "./IRoomGoal";


export class SustainMaxExtensions implements IRoomGoal {
    constructor() {
    }

    checkProgress(room: Room): IGoalProgress {
        var extensionCount = room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION }).length;
        var maxExtensionCountForRcl = EXTENSION_MAX_COUNT[room.controller?.level ?? 0]
        return { achieved: extensionCount >= maxExtensionCountForRcl };
    }

    attemptProgress(room: Room, progress: IGoalProgress): boolean {
        var currentSites = room.find(FIND_CONSTRUCTION_SITES, {
            filter: site => site.structureType == STRUCTURE_EXTENSION
        }).length;

        var currentExtensions = room.find(FIND_MY_STRUCTURES, { filter: s => s.structureType == STRUCTURE_EXTENSION }).length;
        var totalUpAndInProgress = currentSites + currentExtensions;
        var maxCount = EXTENSION_MAX_COUNT[room.controller?.level ?? 0];

        if (totalUpAndInProgress >= maxCount) {
            return true;
        }

        return room.placeExtensions(maxCount - totalUpAndInProgress) == OK;
    }
}
