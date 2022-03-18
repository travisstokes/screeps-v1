import { CREEP_ROLE_CONSTANTS, UPGRADER_ROLE } from "constants/CreepRoleConstants";
import { IBodyMatrixEntry } from "interfaces/IBodyMatrixEntry";
import { BaseRole } from "./BaseRole";

export class UpgraderRole extends BaseRole {
  roleName: CREEP_ROLE_CONSTANTS = UPGRADER_ROLE;

  bodyMatrix: IBodyMatrixEntry[] = [
    {energyRequired: 300, body: [WORK, WORK, CARRY, MOVE]},
    {energyRequired: 400, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]},
    {energyRequired: 550, body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]},
    {energyRequired: 700, body: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]},
  ]

  run(creep: Creep): void {
    if(creep.spawning) {return;}

    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.say('🔄 retrieve');
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      creep.say('⚡ upgrade');
    }

    if (creep.memory.upgrading) {
      if (creep.room.controller != undefined && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
      }
    }
    else {
      var energyStores = creep.room.find(FIND_STRUCTURES, {
        filter: struct => (struct.structureType == STRUCTURE_CONTAINER || struct.structureType == STRUCTURE_STORAGE)
      }).map(struct => struct as StructureStorage | StructureContainer);

      if(energyStores.length) {
        var storesWithEnergy = energyStores.filter(s => s.store.energy > 0);
        var collectionSource = _.min(storesWithEnergy, struct => creep.pos.getRangeTo(struct));
        if(collectionSource) {
          if (creep.withdraw(collectionSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(collectionSource, { visualizePathStyle: { stroke: '#ffaa00' } });
          }

          return;
        }
      } else {
        var closestHarvestSource = creep.pos.findClosestByPath(FIND_SOURCES, {maxRooms: 1, filter: s => s.energy > 0});

        if(closestHarvestSource) {
          if(creep.harvest(closestHarvestSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(closestHarvestSource);
          }
        }
      }
    }
  }
}
