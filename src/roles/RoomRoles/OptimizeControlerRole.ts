import { BaseRoomRole } from "./BaseRoomRole";
import { IRoomGoal } from "./Goals/IRoomGoal";


export class OptimizeControllerRole extends BaseRoomRole {
    protected roomGoals: IRoomGoal[] = [];
    protected evolveRole?: ROOM_ROLES_CONSTANT;
    protected devolveRole?: ROOM_ROLES_CONSTANT = "new-colony";
    protected roleName: string = "optimize-controller";

    // TODO: Implement OptimizeController goals
}
