import { IRole } from "../interfaces/IRole";


export abstract class BaseRole implements IRole {
  abstract roleName: string;
  protected abstract performSpawn(spawnerName: string, creepName: string): ScreepsReturnCode;
  abstract run(creep: Creep): void;
  nextId: number = Game?.time ?? 1;

  spawn(spawnerName: string, maxEnergy: number): boolean {
    console.log(`Spawning new ${this.roleName}`);
    var creepInstanceName = `${this.roleName}_${this.nextId++}`;

    var result = this.performSpawn(spawnerName, creepInstanceName);

    return result == OK;
  }
}
