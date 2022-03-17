import { NEW_COLONY_ROLE, OPTIMIZE_CONTROLLER_ROLE, ROOM_ROLES_CONSTANT } from "constants/RoomRoleConstants";
import { BaseRoomRole } from "./BaseRoomRole";
import { IRoomGoal } from "./Goals/IRoomGoal";


export class OptimizeControllerRole extends BaseRoomRole {
    protected roomGoals: IRoomGoal[] = [];
    protected evolveRole?: ROOM_ROLES_CONSTANT;
    protected devolveRole?: ROOM_ROLES_CONSTANT = NEW_COLONY_ROLE;
    protected roleName: string = OPTIMIZE_CONTROLLER_ROLE;

    // TODO: Implement OptimizeController goals
}
