import { add, NumericDictionary, trim } from "lodash";
import { threadId } from "worker_threads";
import { ICreepRole } from "../interfaces/ICreepRole";

export interface ISpawner {
  addByRoleName(roleName: string, opts?: ISpawnOpts): void;
  processQueue(): void;
}

interface ISpawnOpts {
  priority?: number,
  memory?: CreepMemory,
  energyToUse?: number
}

interface SpawnQueueHash {
  [spawnName: string]: SpawnQueueEntry[];
}

interface SpawnQueueEntry {
  roleToSpawn: string;
  energyToUse?: number;
  priority: number;
  memory?: CreepMemory;
  ticksToWaitForEnergy: number;
}

export class StaticSpawner implements ISpawner {
  spawners: SpawnQueueHash = {};
  nextId: number = Game?.time ?? 1;

  loadQueue() {
    if (Memory.spawnQueue && trim(Memory.spawnQueue)) {
      this.spawners = JSON.parse(Memory.spawnQueue) as SpawnQueueHash ?? {};
    } else {
      this.spawners = {};
    }
  }

  saveQueue() {
    Memory.spawnQueue = JSON.stringify(this.spawners);
  }

  addEntry(newEntry: SpawnQueueEntry, spawnerName: string) {
    if(!this.spawners[spawnerName]) {
      this.spawners[spawnerName] = [];
    }

    var spawner = this.spawners[spawnerName];

    var insertIndex = -1;
    if (newEntry.priority > 0) {
      insertIndex = spawner.findIndex(entry => entry.priority < newEntry.priority);
    }

    console.log(`Queuing ${newEntry.roleToSpawn} at index ${insertIndex}`);
    if (insertIndex > -1) {
      spawner.splice(insertIndex, 0, newEntry);
      this.saveQueue();
      return;
    }

    spawner.push(newEntry);
    this.saveQueue();
  }

  addByRoleName(roleName: string, opts?: ISpawnOpts) {
    console.log(`Finding role ${roleName}`);
    this.addEntry({
      roleToSpawn: roleName,
      priority: opts?.priority ?? 0,
      energyToUse: opts?.energyToUse,
      memory: opts?.memory,
      ticksToWaitForEnergy: 10,
    }, "Spawn1");
  }

  processQueue() {
    for(var spawner in this.spawners) {
      if(Game.spawns[spawner].spawning) {
        continue;
      }

      var spawnerQueue = this.spawners[spawner];
      if (spawnerQueue.length) {
        var entry = spawnerQueue.shift() as SpawnQueueEntry;
        if(entry.energyToUse && Game.spawns[spawner].room.energyAvailable < entry.energyToUse) {
          if(entry.ticksToWaitForEnergy-- > 0) {
            spawnerQueue.unshift(entry);
          } else {
            // Do another pass on the next item.
            this.processQueue();
          }
          return;
        }

        var role = Game.services.creepRoleManager.getByName(entry.roleToSpawn);
        var maxEnergy = entry.energyToUse ? _.min([entry.energyToUse, Game.spawns[spawner].room.energyCapacityAvailable]) : Game.spawns[spawner].room.energyCapacityAvailable;
        var spawnData = role.getSpawnData(maxEnergy);
        console.log(`Spawning new ${entry.roleToSpawn}`);
        var creepInstanceName = `${entry.roleToSpawn}_${this.nextId++}`;

        var creepMemory = entry.memory ?? <CreepMemory>{ role: entry.roleToSpawn};

        if (Game.spawns[spawner].spawnCreep(spawnData.body, creepInstanceName, { memory: creepMemory }) != OK) {
          console.log(`${entry.roleToSpawn} spawn failed, re-inserting into queue`);
          this.addEntry(entry, spawner);
        }

        this.saveQueue();
      }
    }
  }
}
