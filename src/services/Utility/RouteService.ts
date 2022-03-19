import path from "path";

export interface StoreRouteNode {
    pos: RoomPosition,
    store: StoreDefinition
  }

interface RangeData {
    PositionA: RoomPosition,
    PositionB: RoomPosition,
    path: PathStep[]
}

function getRangeCenter(roomName: string, data: RangeData): RoomPosition {
    var centerStep = data.path[(data.path.length + 1) / 2];
    return new RoomPosition(centerStep.x, centerStep.y, roomName);
}

function getRangeData(positionA: RoomPosition, positionB: RoomPosition) {
    return <RangeData>{ PositionA: positionA, PositionB: positionB, path: positionA.findPathTo(positionB, {swampCost: 5000, maxRooms: 1})};
}

export class RouteService {
    findPlainNearCenter(positions: RoomPosition[]) : RoomPosition | undefined {
        // c(positions, "Argument null error (positions)");
        // assert(positions.length > 1, "Must provide at least two positions for center finding.");

        var roomName = positions[0].roomName;
        var rangeData = <RangeData[]>[];

        // Generate range data
        while(positions.length > 0) {
            var cur = positions.shift() as RoomPosition;

            if(!cur || cur == undefined) {
                continue;
            }

            var newData = positions.map(p => getRangeData(p, cur));
            rangeData.push(...newData);
        }

        if(!rangeData.length) {
            return undefined;
        }

        if(rangeData.length = 1) {
            return getRangeCenter(roomName, rangeData[0]);
        }

        do {
            rangeData.sort((a,b) => a.path.length - b.path.length);
            var centerA = getRangeCenter(roomName, rangeData.shift() as RangeData);
            var centerB = getRangeCenter(roomName, rangeData.shift() as RangeData);

            var newRangeData = getRangeData(centerA, centerB)  as RangeData;

            rangeData.push(newRangeData);
        } while(rangeData.length > 1)

        return getRangeCenter(roomName, rangeData[0]);
    }

    findEnergyEnRoute(creep: Creep, energyRequired: number, destination: Structure) : StoreRouteNode[] {
        // TODO: WIP
        throw new Error("Not Implemeneted");

        // var energySources = creep.room.find(FIND_STRUCTURES, {
        //     filter: (structure) =>
        //         (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER)
        //         && structure.store.energy > 0
        // }).map(structure => {
        //     if (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) {
        //         return { pos: structure.pos, store: structure.store };
        //     }

        //     return null;
        // }).filter(node => node != undefined && node != null);

        // var route: StoreRouteNode[] = [];
        // var currentPos = creep.pos;
        // var destinationPos = destination.pos;
        // energyRequired = _.min([energyRequired, creep.store.getCapacity()]); - creep.store.energy;

        // while (energyRequired > 0 && energySources.length > 0) {
        //     var nextTarget = _.max(energySources, source => {
        //         if (!source) { return 0; }

        //         return _.min([source.store.energy, energyRequired]) / (source.pos.getRangeTo(currentPos) + source.pos.getRangeTo(destinationPos))
        //     });

        //     _.remove(energySources, s => s?.pos == nextTarget?.pos);

        //     if (nextTarget == null) {
        //         continue;
        //     }

        //     route.push(nextTarget)
        //     currentPos = nextTarget.pos;
        //     energyRequired -= nextTarget.store.energy;
        // }

        // return [];
    }
}
