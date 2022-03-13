import { createPrivateKey } from "crypto";
import { IRole } from "interfaces/IRole";
import { ISpawnData } from "interfaces/ISpawnData";
import { BaseRole } from "./BaseRole";

export class HarvesterRole extends BaseRole {
  roleName: string = "harvester";

  getSpawnData(maxEnergy: number): ISpawnData {
      return {body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]};
  }

  run(creep: Creep): void {
    if(creep.spawning) {return;}

    if(!creep.memory.assignedSource) {
      console.log("attempting source assign");
      Game.services.sourceManager.assignSource(creep);
    }

    creep.memory.preventRespawn = !creep.memory.assignedSource;

    if ((creep.memory.upgrading || creep.memory.building) && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.memory.building = false;
      creep.say('🔄 harvest mode');
    }

    if (!creep.memory.upgrading && !creep.memory.building && creep.store.getFreeCapacity() > 0) {
      if(creep.memory.movingTo) {
        console.log("Moving to is set");
        if(!creep.pos.inRangeTo(creep.memory.movingTo, 1)) {
          console.log(`Not in range, moving to: ${JSON.stringify(creep.memory.movingTo)}`);
          console.log(`Move result: ${creep.moveTo(creep.memory.movingTo.x, creep.memory.movingTo.y, { visualizePathStyle: { stroke: '#ffaa00' } })}`);
          return;
        }
        creep.memory.movingTo = undefined;
      }

      if(creep.memory.assignedSource) {
          var assignedSource = Game.getObjectById(creep.memory.assignedSource) as Source;
          if(creep.harvest(assignedSource) == ERR_NOT_IN_RANGE)
          {
            creep.moveTo(assignedSource);
          }
          return;
      }

      var sources = creep.room.find(FIND_SOURCES, { filter: (s) => s.energy > 0 });
      var source = _.min(sources, s => creep.pos.getRangeTo(s.pos));

      if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
        return;
      }
    }
    else {
      var depositTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) &&
            (structure.store.energy == 0 || structure.store.getFreeCapacity(RESOURCE_ENERGY) >= creep.store.energy); // Keep them from travelling to a store just to drop 10-20 energy in it
        }
      });

      if(!depositTarget && (!creep.room.storage || creep.room.storage.store.energy < 10000)) {
        depositTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_STORAGE) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
          }
        });
      }

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
