import { BuilderRole } from "roles/creep_roles/BuilderRole";
import { HarvesterRole } from "roles/creep_roles/HarvesterRole";
import { StaticMinerRole as StaticHarvesterRole } from "roles/creep_roles/StaticMinerRole";
import { UpgraderRole } from "roles/creep_roles/UpgraderRole";
import { ICreepRole } from "../interfaces/ICreepRole";
import { IRoleManager } from "../interfaces/IRoleManager";

export class CreepRoleManager implements IRoleManager<ICreepRole> {
  availableRoles: Map<string, ICreepRole> = new Map<string, ICreepRole>();

  constructor() {
    var harvesterRole = new HarvesterRole();
    var builderRole = new BuilderRole();
    var upgraderRole = new UpgraderRole();
    var staticMinerRole = new StaticHarvesterRole();
    this.availableRoles.set(harvesterRole.roleName, harvesterRole);
    this.availableRoles.set(builderRole.roleName, builderRole);
    this.availableRoles.set(upgraderRole.roleName, upgraderRole);
    this.availableRoles.set(staticMinerRole.roleName, staticMinerRole);
  }

  getByName(name: string): ICreepRole {
    var role = this.availableRoles.get(name);

    if (role == undefined) {
      throw new Error(`Role ${name} not found`);
    }

    return role;
  }

  runAll(): void {
    for (var creepName in Game.creeps) {
      var creep = Game.creeps[creepName];
      var role = this.availableRoles.get(creep.memory.role);

      if (!role) {
        console.log(`No matching role found for ${creep.memory.role}`);
        continue;
      }

      try{
        role.run(creep);
      }
      catch (error) {
        console.log((error as Error).message);
      }
    }
  }
}
