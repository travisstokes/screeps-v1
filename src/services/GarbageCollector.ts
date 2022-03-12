export interface IGarbageCollector {
  cleanCreeps(): void;
}

export class GarbageCollector {
  cleanCreeps(): void {
    //if (Game.time % 100 != 0) { return; }
    for (const name in Memory.creeps) {
      if (!(name in Game.creeps)) {
        console.log(`Removing ${name}`);

        if(Memory.creeps[name].role) {
          console.log(`Queueing for respawn`);
          Game.services.spawnManager.addByRoleName(Memory.creeps[name].role);
        }

        delete Memory.creeps[name];
      }
    }
  }
}
