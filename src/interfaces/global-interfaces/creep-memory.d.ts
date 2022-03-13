declare module "creep-memory-extensions" {
  global {
      interface CreepMemory {
        role: string;
        upgrading?: boolean;
        building?: boolean;
        expirationTick?: number;
        room?: string;
        working?: boolean;
        movingTo?: RoomPosition;
        assignedSource?: Id<Source>;
        preventRespawn?: boolean;
      }
    }
}
