import { IRoomGoal } from "./IRoomGoal";

export class PlaceInitialSpawner implements IRoomGoal {
    checkAchieved(room: Room): boolean {
        return room.getAllSpawners().length > 0;
    }
    attemptProgress(room: Room): boolean {
        if (room.isBeingConstructed(STRUCTURE_SPAWN)) {
            return true;
        }

        var sources = room.find(FIND_SOURCES);

        var positions = [room.controller?.pos as RoomPosition, ...sources.map(s => s.pos)];

        var spawnLocation = Game.services.routeService.findPlainNearCenter(positions);

        if (!spawnLocation) {
            return false;
        }

        return room.createConstructionSite(spawnLocation, STRUCTURE_SPAWN) == OK;
    }
}
