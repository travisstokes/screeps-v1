declare module "creep-role-constants" {
    global {
        type CREEP_ROLE_CONSTANTS = BUILDER_ROLE | HARVESTER_ROLE | INTRA_ROOM_TRANSPORT_ROLE | STATIC_MINER_ROLE | UPGRADER_ROLE;

        type HARVESTER_ROLE = "harvester";
        type STATIC_MINER_ROLE = "static-miner";
        const HARVESTER_ROLE: HARVESTER_ROLE;
        const STATIC_MINER_ROLE: STATIC_MINER_ROLE;

        type BUILDER_ROLE = "builder";
        type UPGRADER_ROLE = "upgrader";
        type INTRA_ROOM_TRANSPORT_ROLE = "intra-room-transport";

        const BUILDER_ROLE: BUILDER_ROLE;
        const UPGRADER_ROLE: UPGRADER_ROLE;
        const INTRA_ROOM_TRANSPORT_ROLE: INTRA_ROOM_TRANSPORT_ROLE;
    }
}



