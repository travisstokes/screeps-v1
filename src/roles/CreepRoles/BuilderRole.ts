import { BUILDER_ROLE, CREEP_ROLE_CONSTANTS } from "constants/CreepRoleConstants";
import { IBodyMatrixEntry } from "interfaces/IBodyMatrixEntry";
import { BaseRole } from "./BaseRole";

export class BuilderRole extends BaseRole {
  roleName: CREEP_ROLE_CONSTANTS = BUILDER_ROLE;

  bodyMatrix: IBodyMatrixEntry[] = [
    {energyRequired: 200, body: [WORK, CARRY, MOVE]},
    {energyRequired: 400, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]}
  ]

  getBuildTarget(creep : Creep): ConstructionSite<BuildableStructureConstant> | undefined {
    return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES) as ConstructionSite<BuildableStructureConstant>;
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
      var buildTarget = this.getBuildTarget(creep);
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

        var collectionSource = _.min(energyStores, struct => creep.pos.getRangeTo(struct));
        if (creep.withdraw(collectionSource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(collectionSource, { visualizePathStyle: { stroke: '#ffaa00' } });
        }
    }
  }
}
