import { BaseRoomRole } from "./BaseRoomRole";
import { CreateFirstMiner } from "./Goals/CreateFirstMiner";
import { CreateFirstUpgrader } from "./Goals/CreateFirstUpgrader";
import { IRoomGoal } from "./Goals/IRoomGoal";
import { PlaceInitialSpawner } from "./Goals/PlaceInitialSpawner";
import { ReachRCLLevel } from "./Goals/ReachRCLLevel";

export class NewColonyRole extends BaseRoomRole {
    protected roomGoals: IRoomGoal[];
    protected evolveRole?: ROOM_ROLES_CONSTANT = "optimize-controller";
    protected devolveRole?: ROOM_ROLES_CONSTANT;
    protected roleName: string = "new-colony";

    constructor() {
        super();
        this.roomGoals = [];
        this.roomGoals.push(...[
            new PlaceInitialSpawner(),
            new CreateFirstMiner(),
            new CreateFirstUpgrader(),
            new ReachRCLLevel(2)
        ]);
    }
}


