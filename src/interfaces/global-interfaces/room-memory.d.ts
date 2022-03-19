import { ROOM_ROLES_CONSTANT } from "constants/RoomRoleConstants";

declare global {
  interface RoomMemory {
    role: ROOM_ROLES_CONSTANT;
  }
}
