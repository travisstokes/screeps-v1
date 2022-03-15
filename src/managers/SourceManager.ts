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
        // TODO: Handle event support for creep death to support metadata cache invalidation.
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
        var sourceAssignmentCandidates = _.filter(sourceMetaData, source => source.assignedWorkParts / source.assignedCreeps.length < creepWorkParts);

        if(sourceAssignmentCandidates.length == 0) {
            console.log("No available source found");
            creep.memory.assignedSource = undefined;
            return undefined;
        }

        // Find the candidate with the most currently assigned creeps (which should result in the highest retire count).
        var targetSourceData = _.max(sourceAssignmentCandidates, candidate => candidate.assignedCreeps.length);
        var assignedCreeps = targetSourceData.assignedCreeps.map(creepId => {
            var creep = Game.getObjectById(creepId);
            return {value: creep, workers: creep?.getActiveBodyparts(WORK)};
        });

        // Sort the currently assigned creeps by number of workers
        assignedCreeps = _.sortBy(assignedCreeps, creep => creep.workers);

        // Inserting our new creep JUST BEFORE creeps of it's size or larger makes it so we don't accidentally swap back and forth on each individual creep's assignment request.
        // For example, if there were 2,2,4 and we are adding a 4 we will "successfully" assign both 4s every time each asks,
        // effectively having both fours and a 2 thinking they are assigned due to loop execution sequencing.
        var insertIndex = _.findIndex(assignedCreeps, c => c.workers ?? 0 >= creepWorkParts);
        var newAssignment = {value: creep, workers: creepWorkParts};
        if(insertIndex == -1) {
            assignedCreeps.push(newAssignment);
        } else {
            assignedCreeps.splice(insertIndex, 0, newAssignment);
        }

        // Clear out the assigned creeps and the total work parts for the
        targetSourceData.assignedCreeps = [];
        targetSourceData.assignedWorkParts = 0;

        // This reduction starts with the largest creeps (right side of the array sorted ascending)
        // For each creep, it clears the assignment. Checks to see if it will fit and assigns it (updating it's memory and the source metadata) if so.
        // This should result in the largest possible creeps being included, but could potentially result in a suboptimal configuration
        // If we have a 5,4,2 for example, it will only include the 5 even through taking the 4/2 instead would result in a more optimal solution.
        // I'm leaning on awareness that my miners are all configured to use 1,2,4 or 6 WORK parts, though, so these edge cases should not occur.
        _.reduceRight(assignedCreeps, (targetSourceData, potentialCreep) => {
            // Probably a better way to manage the type safety here to prevent the need for this check; but it's trivial enough I don't feel like tracking down
            // the proper way to keep undefined from being a possibility.
            if(!potentialCreep.value || !potentialCreep.workers) {
                return targetSourceData;
            }

            // Clear out any existing assignment in case this creep gets dropped.
            potentialCreep.value.memory.assignedSource = undefined;

            // If this creep would put it over the max work parts, just advance the data as is.
            if(targetSourceData.assignedWorkParts + potentialCreep.workers > STANDARD_MAX_WORK_PARTS) {
                return targetSourceData;
            }

            // Update the data to include the creep, and the creep's memory to reflect the assignment.
            potentialCreep.value.memory.assignedSource = targetSourceData.source.id;
            targetSourceData.assignedCreeps.push(potentialCreep.value.id);
            targetSourceData.assignedWorkParts += potentialCreep.workers;

            return targetSourceData;
        }, targetSourceData)

        // Handle more complex scenarios like swapping in larger miners for efficiency.
        this.saveCache();

        if(targetSourceData.assignedCreeps.includes(creep.id)) {
            return targetSourceData.source;
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
        // Caching is currently disabled until I get the creep death event system in place so we can efficiently trigger cache invalidation.

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
        // Caching is currently disabled until I get the creep death event system in place so we can efficiently trigger cache invalidation.

        // Memory.sourceMetadataCache = JSON.stringify(this.metadataCache);
    }

    loadCache(): void {
        // Caching is currently disabled until I get the creep death event system in place so we can efficiently trigger cache invalidation.

        // this.metadataCache = {};
        // if(trim(Memory.sourceMetadataCache)){
        //     this.metadataCache = JSON.parse(Memory.sourceMetadataCache);
        // }
        // this.persistentCacheLoaded = true;
    }
}

