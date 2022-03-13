import { ISourceManager } from "interfaces/ISourceManager";
import { ICoordinate } from "../interfaces/ICoordinate";
import { ISourceMetadata } from "../interfaces/ISourceMetadata";

const CAPACITY_PER_WORK_PART = 2;
const STANDARD_MAX_CAPACITY = 3000;
const STANDARD_REGEN_TICKS = 300;
const STANDARD_MAX_WORK_PARTS = STANDARD_MAX_CAPACITY / STANDARD_REGEN_TICKS / CAPACITY_PER_WORK_PART;
const ADJACENCY_COORDS : ICoordinate[] = [
    {x: -1, y: -1}, {x: 0, y: -1}, {x:1, y: -1},
    {x: -1, y: 0}, {x: 1, y: 0},
    {x: -1, y: 1}, {x: 0, y: 1,}, {x: 1, y: 1}
]

export class SourceManager implements ISourceManager {
    metadataCache: any;
    persistentCacheLoaded: boolean = false;

    assignSource(creep: Creep): void {
        // TODO: Handle possibility of assigning to a different room than creep's current?
        // TODO: Handle support for creep death.
        var sourceMetaData = this.getSourceMetadata(creep.room.name);

        var creepWorkParts = creep.getActiveBodyparts(WORK);

        var simpleTarget = sourceMetaData.find(source => source.assignedCreeps.length < source.availableSpaces.length && source.assignedWorkParts + creepWorkParts <= STANDARD_MAX_WORK_PARTS);

        if (simpleTarget) {
            creep.memory.assignedSource = simpleTarget.source.id;
            simpleTarget.assignedCreeps.push(creep.id);
            simpleTarget.assignedWorkParts += creepWorkParts;

            return;
        }

        // Handle more complex scenarios like swapping in larger miners for efficiency.

        this.saveCache();
    }

    getNeedsContainer(roomName: string, sourceId: Id<Source>) {
        var sourceMetaData = this.getSourceMetadata(roomName);
        var source = sourceMetaData.find(s => s.source.id == sourceId);

        if (!source) {
            throw new Error("Invalid room source combination");
        }

        return source.containers.length == 0;
    }

    getSourceMetadata(roomName: string): ISourceMetadata[] {
        if(!this.persistentCacheLoaded) {
            this.loadCache();
        }

        if (this.metadataCache[roomName]) {
            return this.metadataCache[roomName];
        }

        const possibleOpenSpacesArray = new Array();
        var sources = Game.rooms[roomName].find(FIND_SOURCES);
        var terrain = Game.rooms[roomName].getTerrain();
        var creeps = Game.rooms[roomName].find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return creep.memory.assignedSource;
            }
        });

        var assignedCreepsBySource = _.groupBy(creeps, (creep) => creep.memory.assignedSource);
        var result = sources.map((source) => {
            var assignedCreeps = assignedCreepsBySource[source.id];
            var assignedWorkParts = _.sum(assignedCreeps, creep => creep.getActiveBodyparts(WORK));
            var coordsToCheck = ADJACENCY_COORDS.map<ICoordinate>((coord) => <ICoordinate>{ x: source.pos.x + coord.x, y: source.pos.y + coord.y });

            var availableSpaces = coordsToCheck.filter(coord => terrain.get(coord.x, coord.y) != TERRAIN_MASK_WALL);
            var containers = Game.rooms[roomName]
                .lookForAtArea(LOOK_STRUCTURES, source.pos.x - 1, source.pos.y - 1, source.pos.x + 1, source.pos.y + 1, true)
                .filter(result => result.structure.structureType == STRUCTURE_CONTAINER)
                .map(result => result.structure.id);

            return <ISourceMetadata>{
                source: source,
                availableSpaces: availableSpaces,
                assignedCreeps: assignedCreeps.map(c => c.id),
                assignedWorkParts: assignedWorkParts,
                containers: containers
            };
        });

        this.metadataCache[roomName] = result;
        return result;
    }

    saveCache(): void {
        Memory.sourceMetadataCache = JSON.stringify(this.metadataCache);
    }

    loadCache(): void {
        this.metadataCache = JSON.parse(Memory.sourceMetadataCache);
        this.persistentCacheLoaded = true;
    }
}

