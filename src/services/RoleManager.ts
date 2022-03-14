import { StaticMinerRole as StaticMinerRole } from "roles/StaticMinerRole";
import { IRole } from "../interfaces/IRole";
import { BuilderRole } from "../roles/BuilderRole";
import { HarvesterRole } from "../roles/HarvesterRole";
import { UpgraderRole } from "../roles/UpgraderRole";

export interface IRoleManager {
  byName(name: string): IRole;
  runByRole(name: string): void;
  runAll(): void;
}

export class RoleManager {
  availableRoles: Map<string, IRole> = new Map<string, IRole>();

  constructor() {
    var harvesterRole = new HarvesterRole();
    var builderRole = new BuilderRole();
    var upgraderRole = new UpgraderRole();
    var staticMinerRole = new StaticMinerRole();
    this.availableRoles.set(harvesterRole.roleName, harvesterRole);
    this.availableRoles.set(builderRole.roleName, builderRole);
    this.availableRoles.set(upgraderRole.roleName, upgraderRole);
    this.availableRoles.set(staticMinerRole.roleName, staticMinerRole);
  }

  byName(name: string): IRole {
    var role = this.availableRoles.get(name);

    if (role == undefined) {
      throw new Error("Role not found");
    }

    return role;
  }

  runByRole(name: string): void {
    for (var creepName in Game.creeps) {
      var creep = Game.creeps[creepName];
      if (creep.memory.role == name) {
        this.availableRoles.get(creep.memory.role)?.run(creep);
      }
    }
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
