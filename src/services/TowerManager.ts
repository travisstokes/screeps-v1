import { identity } from "lodash";

export interface ITowerManager {
    run(): void;
}

export interface IRepairTarget {
    structure: AnyStructure,
    priority: number
}

export class DefaultTowerManager implements ITowerManager {
    repairPriority: any = {
        [STRUCTURE_SPAWN]: 0,
        [STRUCTURE_EXTENSION]: 100,
        [STRUCTURE_WALL]: 300,
        [STRUCTURE_ROAD]: 400,
        [STRUCTURE_STORAGE]: 500,
    };

    run(): void {
        for(var roomName in Game.rooms) {
            var room = Game.rooms[roomName];

            var towers = room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) && structure.store.energy > 0;
              }
            }).map(t => t as StructureTower);

            var repairTargets = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < structure.hitsMax && (structure.structureType === STRUCTURE_ROAD
                        || structure.structureType === STRUCTURE_WALL)
                }
            });

            repairTargets.concat(room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < structure.hitsMax && (structure.structureType ===  STRUCTURE_STORAGE
                        || structure.structureType === STRUCTURE_EXTENSION
                        || structure.structureType === STRUCTURE_SPAWN)
                }
            }));

            if(repairTargets.length == 0)
            {
                return;
            }

            repairTargets.sort((structA, structB) => {
                return this.repairPriority[structA.structureType] - this.repairPriority[structB.structureType];
            })

            for (var tower of towers){
                if(tower.store.energy == 0) {
                    return;
                }

                if(tower.hits < tower.hitsMax) {
                    tower.repair(tower);
                    continue;
                }

                var result = tower.repair(repairTargets[0]);
                if(result != OK) {
                    console.log(`Repair result: ${result}`);
                }

                if(repairTargets[0].hits == repairTargets[0].hitsMax) {
                    repairTargets.shift();
                }
            }
        }
    }
}

