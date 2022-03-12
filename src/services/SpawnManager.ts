import { NumericDictionary, trim } from "lodash";
import { IRole } from "../interfaces/IRole";

export interface ISpawner {
  addByRole(role: IRole) : void;
  addByRoleName(roleName: string) : void;
  processQueue(): void;
}

interface SpawnQueueEntry {
  roleToSpawn: IRole;
  priority: number;
}

interface SpawnQueuePersistenceEntry {
  roleToSpawn: string;
  priority: number;
}

export class StaticSpawner implements ISpawner {
  spawnQueue = new Array<SpawnQueueEntry>();

  loadQueue() {
    if(Memory.spawnQueue && trim(Memory.spawnQueue)){
      var persistedQueue = JSON.parse(Memory.spawnQueue) as Array<SpawnQueuePersistenceEntry>;

      if(!persistedQueue) { return; }

      this.spawnQueue = persistedQueue.map<SpawnQueueEntry>(persistedEntry => {
          return {roleToSpawn: Game.services.roleManager.byName(persistedEntry.roleToSpawn), priority: persistedEntry.priority};
      });
    }
  }

  saveQueue() {
    Memory.spawnQueue = JSON.stringify(
      this.spawnQueue.map<SpawnQueuePersistenceEntry>(entry => { return {roleToSpawn: entry.roleToSpawn.roleName, priority: entry.priority}; } )
    );
  }

  addByRole(role: IRole, priority: number = 0) {
    var insertIndex = -1;
    if(priority > 0)    {
      insertIndex = this.spawnQueue.findIndex(entry => entry.priority < priority);
    }

    const newQueueEntry = { roleToSpawn: role, priority: priority };

    console.log(`Queuing ${role.roleName} at index ${insertIndex}`);
    if(insertIndex > -1) {
      this.spawnQueue.splice(insertIndex, 0, newQueueEntry);
      this.saveQueue();
      return;
    }

    this.spawnQueue.push(newQueueEntry);
    this.saveQueue();
  }

  addByRoleName(roleName: string, priority: number = 0) {
    console.log(`Finding role ${roleName}`);
    var role = Game.services.roleManager.byName(roleName);
    if(role) {
      this.addByRole(role, priority);
    }
  }

  processQueue() {
    if (this.spawnQueue.length) {
      console.log(`Processing spawn queue (${this.spawnQueue.length} item(s))`);
      var entry = this.spawnQueue.shift()
      if(entry && !entry.roleToSpawn.spawn("Spawn1", 0)) {
        console.log(`${entry.roleToSpawn.roleName} spawn failed, re-inserting into queue`);

        if(entry.priority > 0) {
          this.spawnQueue.unshift(entry);
        }
      }

      this.saveQueue();
    }
  }
}
