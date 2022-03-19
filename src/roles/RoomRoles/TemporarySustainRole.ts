import { HARVESTER_ROLE, UPGRADER_ROLE } from "constants/CreepRoleConstants";
import { ROOM_ROLES_CONSTANT, TEMP_SUSTAIN_CREEPS } from "constants/RoomRoleConstants";
import { BaseRoomRole } from "./BaseRoomRole";
import { IRoomGoal } from "./Goals/IRoomGoal";
import { SustainCreepCountGoal } from "./OptimizeControllerRole";

export class TempSustainCreeps extends BaseRoomRole {
    protected roomGoals: IRoomGoal[];
    protected evolveRole?: ROOM_ROLES_CONSTANT;
    protected devolveRole?: ROOM_ROLES_CONSTANT;
    protected roleName: string = TEMP_SUSTAIN_CREEPS;

    constructor() {
        super();

        this.roomGoals = [
            new SustainCreepCountGoal(HARVESTER_ROLE, 6),
            new SustainCreepCountGoal(UPGRADER_ROLE, 6)
        ];
    }
}


