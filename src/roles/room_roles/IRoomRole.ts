import { ROOM_ROLES_CONSTANT } from "constants/RoomRoleConstants";

export interface IRoomRole {
    run(room: Room): void;
    getRoleName(): string;
    getDevolveRole(): ROOM_ROLES_CONSTANT | undefined;
    getEvolveRole(): ROOM_ROLES_CONSTANT | undefined;
}
