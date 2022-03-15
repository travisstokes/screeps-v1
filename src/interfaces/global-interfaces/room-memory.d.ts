import { ROOM_ROLES_CONSTANT } from 'roles/RoomRoles/NewColonyRole';

declare global {
    interface RoomMemory {
      role: ROOM_ROLES_CONSTANT;
    }
}
