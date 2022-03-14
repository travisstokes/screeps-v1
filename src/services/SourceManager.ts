import { ISourceManager } from "interfaces/ISourceManager";
import { trim } from "lodash";
import { ICoordinate } from "../interfaces/ICoordinate";
import { ISourceMetadata } from "../interfaces/ISourceMetadata";

const STANDARD_MAX_WORK_PARTS = SOURCE_ENERGY_CAPACITY / ENERGY_REGEN_TIME / HARVEST_POWER + 1 ;// +1 for a 1 work part buffer for maintaining containers and other overheads
const ADJACENCY_COORDS : ICoordinate[] = [
    {x: -1, y: -1}, {x: 0, y: -1}, {x:1, y: -1},
    {x: -1, y: 0}, {x: 1, y: 0},
    {x: -1, y: 1}, {x: 0, y: 1,}, {x: 1, y: 1}
]

export class SourceManager implements ISourceManager {
    metadataCache: any = {};
    persistentCacheLoaded: boolean = false;

    assignSource(creep: Creep): Source | undefined {
        if(creep.memory.assignedSource) {
            return Game.getObjectById(creep.memory.assignedSource) as Source;
        }

        // TODO: Handle possibility of assigning to a different room than creep's current?
        // TODO: Handle advanced support for creep death to support metadata caching.
        var sourceMetaData = this.getRoomSourcesMetadata(creep.room.name);
        var creepWorkParts = creep.getActiveBodyparts(WORK);

        var simpleTarget = sourceMetaData.find(source => source.assignedCreeps.length < source.availableSpaces.length && source.assignedWorkParts + creepWorkParts <= STANDARD_MAX_WORK_PARTS);

        if (simpleTarget) {
            creep.memory.assignedSource = simpleTarget.source.id;
            simpleTarget.assignedCreeps.push(creep.id);
            simpleTarget.assignedWorkParts += creepWorkParts;

            this.saveCache();
            return simpleTarget.source;
        }

        console.log(`Attempting advanced assignment for creep: ${creep.name}`);
        // Find all sources where the average work parts per assigned worker is less than the current.
        var replacementCandidates = _.filter(sourceMetaData, source => source.assignedWorkParts / source.assignedCreeps.length < creepWorkParts);

        if(replacementCandidates.length == 0) {
            console.log("No replacement found");
            creep.memory.assignedSource = undefined;
            return undefined;
        }

        // Find the one with the most creeps (which should result in the highest retire count).
        var replacementCandidate = _.max(replacementCandidates, candidate => candidate.assignedCreeps.length);
        var assignedCreeps = replacementCandidate.assignedCreeps.map(creepId => {
            var creep = Game.getObjectById(creepId);
            return {value: creep, workers: creep?.getActiveBodyparts(WORK)};
        });

        assignedCreeps = _.sortBy(assignedCreeps, creep => creep.workers);

        var insertIndex = _.findIndex(assignedCreeps, c => c.workers ?? 0 >= creepWorkParts);
        var newAssignment = {value: creep, workers: creepWorkParts};
        if(insertIndex == -1) {
            assignedCreeps.push(newAssignment);
        } else {
            assignedCreeps.splice(insertIndex, 0, newAssignment);
        }

        replacementCandidate.assignedCreeps = [];
        replacementCandidate.assignedWorkParts = 0;

        _.reduceRight(assignedCreeps, (candidate, assignedCreep) => {
            if(!assignedCreep.value || !assignedCreep.workers) {
                return candidate;
            }

            assignedCreep.value.memory.assignedSource = undefined;

            if(candidate.assignedWorkParts + assignedCreep.workers > STANDARD_MAX_WORK_PARTS) {
                return candidate;
            }

            assignedCreep.value.memory.assignedSource = replacementCandidate.source.id;
            candidate.assignedCreeps.push(assignedCreep.value.id);
            candidate.assignedWorkParts += assignedCreep.workers;

            return candidate;
        }, replacementCandidate)

        // Handle more complex scenarios like swapping in larger miners for efficiency.
        this.saveCache();

        if(replacementCandidate.assignedCreeps.includes(creep.id)) {
            return replacementCandidate.source;
        }
        return undefined;
    }

    getRecommendedContainerSite(roomName: string, sourceId: Id<Source>): RoomPosition | undefined {
        // TODO: Finish container site implementation
        var sourceMetaData = this.getRoomSourcesMetadata(roomName);
        var source = sourceMetaData.find(s => s.source.id == sourceId);

        if (!source) {
            throw new Error("Invalid room source combination");
        }

        if(source.containers.length >= source.assignedCreeps.length) {
            return undefined;
        }

        return undefined;
    }

    getRoomSourcesMetadata(roomName: string): ISourceMetadata[] {
        // if(!this.persistentCacheLoaded) {
        //     this.loadCache();
        // }

        // if (this.metadataCache[roomName]) {
        //     return this.metadataCache[roomName];
        // }
        var sources = Game.rooms[roomName].find(FIND_SOURCES);
        var terrain = Game.rooms[roomName].getTerrain();
        var creeps = Game.rooms[roomName].find(FIND_MY_CREEPS, {
            filter: (creep) => {
                return creep.memory.assignedSource;
            }
        });

        var assignedCreepsBySource = _.groupBy(creeps, (creep) => creep.memory.assignedSource);
        var result = sources.map((source) => {
            var assignedCreeps = assignedCreepsBySource[source.id] ?? new Array<Creep>();
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
        // Memory.sourceMetadataCache = JSON.stringify(this.metadataCache);
    }

    loadCache(): void {
        // this.metadataCache = {};
        // if(trim(Memory.sourceMetadataCache)){
        //     this.metadataCache = JSON.parse(Memory.sourceMetadataCache);
        // }
        // this.persistentCacheLoaded = true;
    }
}

