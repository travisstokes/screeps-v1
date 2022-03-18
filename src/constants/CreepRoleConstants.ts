export type CREEP_ROLE_CONSTANTS =
    | MINER_ROLE_CONSTANTS
    | typeof BUILDER_ROLE
    | typeof INTRA_ROOM_TRANSPORT_ROLE
    | typeof UPGRADER_ROLE;

export type MINER_ROLE_CONSTANTS =
    typeof HARVESTER_ROLE
    | typeof STATIC_MINER_ROLE

export const HARVESTER_ROLE = "harvester";
export const STATIC_MINER_ROLE = "static-miner";
export const BUILDER_ROLE = "builder";
export const UPGRADER_ROLE = "upgrader";
export const INTRA_ROOM_TRANSPORT_ROLE = "intra-room-transport";

