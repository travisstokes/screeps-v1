declare module "creep-memory-extensions" {
  global {
      interface CreepMemory {
        role: string;
        upgrading?: boolean;
        building?: boolean;
        expirationTick?: number;
        room?: string;
        working?: boolean;
        movingToId?: Id<Source> | Id<Creep> | Id<Structure>;
        assignedSource?: Id<Source>;
        preventRespawn?: boolean;
      }
  }
}
