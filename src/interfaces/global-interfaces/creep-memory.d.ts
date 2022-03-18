import { CREEP_ROLE_CONSTANTS } from "constants/CreepRoleConstants";

declare  global {
    interface CreepMemory {
      role: CREEP_ROLE_CONSTANTS;
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
