import { NEW_COLONY_ROLE, OPTIMIZE_CONTROLLER_ROLE, ROOM_ROLES_CONSTANT } from "constants/RoomRoleConstants";
import { BaseRoomRole } from "./BaseRoomRole";
import { CreateFirstMiner } from "./Goals/CreateFirstMiner";
import { CreateFirstUpgrader } from "./Goals/CreateFirstUpgrader";
import { IRoomGoal } from "./Goals/IRoomGoal";
import { PlaceInitialSpawner } from "./Goals/PlaceInitialSpawner";
import { ReachRCLLevel } from "./Goals/ReachRCLLevel";

export class NewColonyRole extends BaseRoomRole {
    protected roomGoals: IRoomGoal[];
    protected evolveRole?: ROOM_ROLES_CONSTANT = OPTIMIZE_CONTROLLER_ROLE;
    protected devolveRole?: ROOM_ROLES_CONSTANT;
    protected roleName: string = NEW_COLONY_ROLE;

    constructor() {
        super();

        this.roomGoals = [
            new PlaceInitialSpawner(),
            new CreateFirstMiner(),
            new CreateFirstUpgrader(),
            new ReachRCLLevel(2)
        ];
    }
}


