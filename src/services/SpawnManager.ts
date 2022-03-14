import { add, NumericDictionary, trim } from "lodash";
import { threadId } from "worker_threads";
import { IRole } from "../interfaces/IRole";

export interface ISpawner {
  addByRole(role: IRole, opts?: ISpawnOpts): void;
  addByRoleName(roleName: string, opts?: ISpawnOpts): void;
  processQueue(): void;
}

interface SpawnQueueEntry {
  roleToSpawn: IRole;
  priority: number;
  energyToUse?: number;
  memory?: CreepMemory;
  ticksToWaitForEnergy: number;
}

interface ISpawnOpts {
  priority?: number,
  memory?: CreepMemory,
  energyToUse?: number
}

interface SpawnQueuePersistenceEntry {
  roleToSpawn: string;
  energyToUse?: number;
  priority: number;
  memory?: CreepMemory;
  ticksToWaitForEnergy?: number;
}

export class StaticSpawner implements ISpawner {
  spawnQueue = new Array<SpawnQueueEntry>();
  nextId: number = Game?.time ?? 1;

  loadQueue() {
    if (Memory.spawnQueue && trim(Memory.spawnQueue)) {
      var persistedQueue = JSON.parse(Memory.spawnQueue) as Array<SpawnQueuePersistenceEntry>;

      if (!persistedQueue) { return; }

      this.spawnQueue = persistedQueue.map<SpawnQueueEntry>(persistedEntry => {
        return {
          roleToSpawn: Game.services.roleManager.byName(persistedEntry.roleToSpawn),
          priority: persistedEntry.priority,
          memory: persistedEntry.memory,
          energyToUse: persistedEntry.energyToUse,
          ticksToWaitForEnergy: persistedEntry.ticksToWaitForEnergy ?? 0
        };
      });
    }
  }

  saveQueue() {
    Memory.spawnQueue = JSON.stringify(
      this.spawnQueue
        .map<SpawnQueuePersistenceEntry>(entry => {
          return {
            roleToSpawn: entry.roleToSpawn.roleName,
            priority: entry.priority,
            memory: entry.memory,
            energyToUse: entry.energyToUse
          };
        })
    );
  }

  addEntry(newEntry: SpawnQueueEntry) {
    var insertIndex = -1;
    if (newEntry.priority > 0) {
      insertIndex = this.spawnQueue.findIndex(entry => entry.priority < newEntry.priority);
    }

    console.log(`Queuing ${newEntry.roleToSpawn.roleName} at index ${insertIndex}`);
    if (insertIndex > -1) {
      this.spawnQueue.splice(insertIndex, 0, newEntry);
      this.saveQueue();
      return;
    }

    this.spawnQueue.push(newEntry);
    this.saveQueue();
  }

  addByRole(role: IRole, opts?: ISpawnOpts) {
    this.addEntry({
      roleToSpawn: role,
      priority: opts?.priority ?? 0,
      energyToUse: opts?.energyToUse,
      memory: opts?.memory,
      ticksToWaitForEnergy: 10
    });
  }

  addByRoleName(roleName: string, opts?: ISpawnOpts) {
    console.log(`Finding role ${roleName}`);
    var role = Game.services.roleManager.byName(roleName);
    if (role) {
      this.addByRole(role, opts);
    }
  }

  processQueue() {
    if (this.spawnQueue.length) {
      var entry = this.spawnQueue.shift() as SpawnQueueEntry;
      if(entry.energyToUse && Game.spawns["Spawn1"].room.energyAvailable < entry.energyToUse) {
        if(entry.ticksToWaitForEnergy-- > 0) {
          this.spawnQueue.unshift();
        } else {
          // Do another pass on the next item.
          this.processQueue();
        }
        return;
      }

      var spawnData = entry.roleToSpawn.getSpawnData(entry.energyToUse);
      console.log(`Spawning new ${entry.roleToSpawn.roleName}`);
      var creepInstanceName = `${entry.roleToSpawn.roleName}_${this.nextId++}`;

      var creepMemory = entry.memory ?? { role: entry.roleToSpawn.roleName };

      if (Game.spawns["Spawn1"].spawnCreep(spawnData.body, creepInstanceName, { memory: creepMemory }) != OK) {
        console.log(`${entry.roleToSpawn.roleName} spawn failed, re-inserting into queue`);
        this.addEntry(entry);
      }

      this.saveQueue();
    }
  }
}
