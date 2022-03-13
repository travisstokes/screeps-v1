import { ISpawnData } from "interfaces/ISpawnData";
import { BaseRole } from "./BaseRole";

export class BuilderRole extends BaseRole {
  roleName: string = "builder";
  getSpawnData(maxEnergy: number): ISpawnData {
      return {body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]};
  }
  run(creep: Creep): void {
    if(creep.spawning) {return;}

    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say('🔄 collect');
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say('🚧 build');
    }

    if (creep.memory.building) {
      var buildTarget = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if (buildTarget) {
        if (creep.build(buildTarget) == ERR_NOT_IN_RANGE) {
          creep.moveTo(buildTarget, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      } else {
        if (creep.room.controller != undefined && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
          creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
    else {
      var energyStores = creep.room
        .find(FIND_STRUCTURES, {
          filter: struct => (struct.structureType == STRUCTURE_CONTAINER
          || struct.structureType == STRUCTURE_STORAGE) && struct.store.energy > 0
        }).map(struct => struct as StructureStorage | StructureContainer)

        var collectionSource = _.min(energyStores, struct => struct.store.energy);
        if (creep.withdraw(collectionSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(collectionSource, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
  }
}
