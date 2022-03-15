export interface IGarbageCollector {
  cleanCreeps(): void;
}

export class GarbageCollector {
  cleanCreeps(): void {
    for (const name in Memory.creeps) {
      if (!(name in Game.creeps)) {
        console.log(`Removing ${name}`);


        if(Memory.creeps[name].role && !Memory.creeps[name].preventRespawn) {
          console.log(`Queueing for respawn`);
          //Game.services.spawnManager.addByRoleName(Memory.creeps[name].role, 0, Memory.creeps[name]);
          Game.services.spawnManager.addByRoleName(Memory.creeps[name].role);
        }

        delete Memory.creeps[name];
      }
    }
  }
}
