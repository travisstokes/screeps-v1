import { IBodyMatrixEntry } from "interfaces/IBodyMatrixEntry";
import { BaseRole } from "./BaseRole";

export class UpgraderRole extends BaseRole {
  roleName: string = "upgrader";

  bodyMatrix: IBodyMatrixEntry[] = [
    {energyRequired: 300, body: [WORK, WORK, CARRY, MOVE]},
    {energyRequired: 400, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]},
    {energyRequired: 500, body: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE]},
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
      var energyStores = creep.room
        .find(FIND_STRUCTURES, {
          filter: struct => (struct.structureType == STRUCTURE_CONTAINER
          || struct.structureType == STRUCTURE_STORAGE) && struct.store.energy > 0
        }).map(struct => struct as StructureStorage | StructureContainer)

      var target = _.min(energyStores, struct => struct.store.energy);
      if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
  }
}
