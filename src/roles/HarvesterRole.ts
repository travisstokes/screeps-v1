import { IRole } from "interfaces/IRole";
import { createSecurePair } from "tls";
import { BaseRole } from "./BaseRole";

export class HarvesterRole extends BaseRole {
  idleRole?: IRole;
  roleName: string = "harvester";

  constructor(idleRole?: IRole){
    super();
    this.idleRole = idleRole;
  }

  protected performSpawn(spawnerName: string, creepName: string): ScreepsReturnCode {
    return Game.spawns[spawnerName].spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], creepName, { memory: { role: this.roleName } });
  }
  run(creep: Creep): void {
    if ((creep.memory.upgrading || creep.memory.building) && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.memory.building = false;
      creep.say('🔄 harvest mode');
    }

    if (!creep.memory.upgrading && !creep.memory.building && creep.store.getFreeCapacity() > 0) {
      var sources = creep.room.find(FIND_SOURCES);
      var source;

      if(creep.memory.destination && (source = Game.getObjectById(creep.memory.destination))) {
          switch (creep.harvest(source)) {
            case OK:
              return;
            case ERR_NOT_IN_RANGE:
              creep.moveTo(source);
              return;
            default:
              creep.memory.destination = undefined;
              break;
          }
      }

      for(var possibleSource of sources) {
        var result = creep.harvest(possibleSource);

        if(result == ERR_NOT_ENOUGH_RESOURCES) {
          continue;
        }

        if(result == ERR_NOT_IN_RANGE) {
          creep.moveTo(possibleSource, { visualizePathStyle: { stroke: '#ffaa00' } });
          creep.memory.destination = possibleSource.id;
          break;
        }
      }
    }
    else {
      var depositTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });
      if (depositTarget) {
        if (creep.transfer(depositTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(depositTarget, { visualizePathStyle: { stroke: '#ffffff' } });
        }

        return;
      }

      var closestBuildTarget = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, {maxRooms: 1});
      if(closestBuildTarget) {
        creep.memory.building = true;
        creep.say('🚧 build mode');

        if (creep.build(closestBuildTarget) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestBuildTarget, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }

      creep.memory.upgrading = true;
      creep.say('⚡ upgrade mode');
      if (creep.room.controller != undefined && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
  }
}
