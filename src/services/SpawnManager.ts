import { add, NumericDictionary, trim } from "lodash";
import { threadId } from "worker_threads";
import { IRole } from "../interfaces/IRole";

export interface ISpawner {
  addByRole(role: IRole, priority?: number, memory?: CreepMemory) : void;
  addByRoleName(roleName: string, priority?: number, memory?: CreepMemory) : void;
  processQueue(): void;
}

interface SpawnQueueEntry {
  roleToSpawn: IRole;
  priority: number;
  memory?: CreepMemory;
}

interface SpawnQueuePersistenceEntry {
  roleToSpawn: string;
  priority: number;
}

export class StaticSpawner implements ISpawner {
  spawnQueue = new Array<SpawnQueueEntry>();
  nextId: number = Game?.time ?? 1;

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

  addEntry(newEntry: SpawnQueueEntry) {
    var insertIndex = -1;
    if(newEntry.priority > 0)    {
      insertIndex = this.spawnQueue.findIndex(entry => entry.priority < newEntry.priority);
    }

    console.log(`Queuing ${newEntry.roleToSpawn.roleName} at index ${insertIndex}`);
    if(insertIndex > -1) {
      this.spawnQueue.splice(insertIndex, 0, newEntry);
      this.saveQueue();
      return;
    }

    this.spawnQueue.push(newEntry);
    this.saveQueue();
  }

  addByRole(role: IRole, priority: number = 0, memory?: CreepMemory) {
    this.addEntry({ roleToSpawn: role, priority: priority, memory: memory });
  }

  addByRoleName(roleName: string, priority: number = 0, memory?: CreepMemory) {
    console.log(`Finding role ${roleName}`);
    var role = Game.services.roleManager.byName(roleName);
    if(role) {
      this.addByRole(role, priority, memory);
    }
  }

  processQueue() {
    if (this.spawnQueue.length) {
      var entry = this.spawnQueue.shift() as SpawnQueueEntry;
      var spawnData = entry.roleToSpawn.getSpawnData(0);

      console.log(`Spawning new ${entry.roleToSpawn.roleName}`);
      var creepInstanceName = `${entry.roleToSpawn.roleName}_${this.nextId++}`;

      var creepMemory = entry.memory ?? {role: entry.roleToSpawn.roleName};

      if(Game.spawns["Spawn1"].spawnCreep(spawnData.body, creepInstanceName, { memory: creepMemory }) != OK) {
        console.log(`${entry.roleToSpawn.roleName} spawn failed, re-inserting into queue`);
        this.addByRole(entry.roleToSpawn, entry.priority);
      }
      this.saveQueue();
    }
  }
}
