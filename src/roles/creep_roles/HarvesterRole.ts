import { CREEP_ROLE_CONSTANTS, HARVESTER_ROLE } from "constants/CreepRoleConstants";
import { IBodyMatrixEntry } from "interfaces/IBodyMatrixEntry";
import { BaseRole } from "./BaseRole";

export class HarvesterRole extends BaseRole {
  roleName: CREEP_ROLE_CONSTANTS = HARVESTER_ROLE;

  bodyMatrix: IBodyMatrixEntry[] = [
    {energyRequired: 300, body: [WORK, WORK, CARRY, MOVE]},
    {energyRequired: 400, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]}
  ]

  run(creep: Creep): void {
    if(creep.spawning) {return;}

    var assignedSource = Game.services.sourceManager.assignSource(creep);
    creep.memory.preventRespawn = !creep.memory.assignedSource;

    if ((creep.memory.upgrading || creep.memory.building) && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.memory.building = false;
      creep.say('🔄 harvest mode');
    }

    if (!creep.memory.upgrading && !creep.memory.building && creep.store.getFreeCapacity() > 0 && assignedSource) {

      if(creep.harvest(assignedSource) == ERR_NOT_IN_RANGE)
      {
        creep.moveTo(assignedSource);
      }
      return;
    }
    else {
      // Have to use AnyStructure generic here to support later checks for containers, which are not owned.
      var depositTarget = creep.pos.findClosestByPath<AnyStructure>(FIND_MY_STRUCTURES, {
        filter: (structure) => {
          return (
            (
              (structure.structureType == STRUCTURE_EXTENSION
              || structure.structureType == STRUCTURE_SPAWN)
              && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            )
            || (
              // Keep them from travelling to a tower over a spawn/extension just to drop 10-20 energy in it
              structure.structureType == STRUCTURE_TOWER
              && structure.store.getFreeCapacity(RESOURCE_ENERGY) >= 50
            )
          );
        }
      });

      if(!depositTarget && assignedSource) {
        // Look for containers within range of source
        var targets = assignedSource.pos
          .findInRange<StructureContainer>(FIND_STRUCTURES, 1, {
            filter: (structure) => {
              return (structure.structureType == STRUCTURE_CONTAINER && structure.store.getFreeCapacity() > 50)
            }
          });
        if(targets.length) {
          depositTarget = _.min(targets, target => creep.pos.getRangeTo(target.pos));
        }
      }

      if(!depositTarget && creep.room.storage && creep.room.storage.store.energy < 10000) {
        depositTarget = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_STORAGE) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 50;
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
        creep.say('🚧 build');

        if (creep.build(closestBuildTarget) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestBuildTarget, { visualizePathStyle: { stroke: '#ffffff' } });
        }

        return;
      }

      creep.memory.upgrading = true;
      creep.say('⚡ upgrade');
      if (creep.room.controller != undefined && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
  }
}
