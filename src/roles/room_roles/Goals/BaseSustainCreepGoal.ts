import { CREEP_ROLE_CONSTANTS } from "constants/CreepRoleConstants";
import { isFunction } from "lodash";
import { IGoalProgress, IRoomGoal } from "./IRoomGoal";

export type GetCreepRoleFunction = (room: Room) => CREEP_ROLE_CONSTANTS;
export abstract class BaseSustainCreepGoal implements IRoomGoal {
    abstract hasSufficientCreeps(room: Room): boolean;
    roleAccessor: GetCreepRoleFunction;

    constructor(roleAccessor: CREEP_ROLE_CONSTANTS | GetCreepRoleFunction) {
        if (isFunction(roleAccessor)) {
            this.roleAccessor = roleAccessor;
            return;
        }

        this.roleAccessor = (room: Room) => (roleAccessor as CREEP_ROLE_CONSTANTS);
    }

    checkProgress(room: Room) : IGoalProgress {
        return { achieved: this.hasSufficientCreeps(room) };
    }

    attemptProgress(room: Room, progress: IGoalProgress): boolean {
        var roleToTarget = this.roleAccessor(room);

        if (room.countSpawningCreeps([roleToTarget]) > 0) {
            return true;
        }

        var result = room.createCreep(roleToTarget, 0, false);

        if (result == OK) {
            return true;
        }

        return false;
    }
}
