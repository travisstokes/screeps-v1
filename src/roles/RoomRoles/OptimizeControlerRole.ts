import { BaseRoomRole } from "./BaseRoomRole";


export class OptimizeControllerRole extends BaseRoomRole {
    protected evolveRole?: ROOM_ROLES_CONSTANT;
    protected devolveRole?: ROOM_ROLES_CONSTANT = NEW_COLONY_ROLE;
    protected roleName: string = OPTIMIZE_CONTROLLER_ROLE;
}
