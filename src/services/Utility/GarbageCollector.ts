export interface IGarbageCollector {
  cleanCreeps(): void;
}

export class GarbageCollector {
  cleanCreeps(): void {
    for (const name in Memory.creeps) {
      if (!(name in Game.creeps)) {
        console.log(`Removing ${name}`);

        delete Memory.creeps[name];
      }
    }
  }
}
