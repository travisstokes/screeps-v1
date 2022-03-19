import { CREEP_ROLE_CONSTANTS } from "constants/CreepRoleConstants";
import { isFunction } from "lodash";
import { IRoomGoal } from "./IRoomGoal";

export type GetCreepRoleFunction = (room: Room) => CREEP_ROLE_CONSTANTS;
export abstract class BaseSustainCreepGoal implements IRoomGoal {
    abstract checkAchieved(room: Room): boolean;
    roleAccessor: GetCreepRoleFunction;

    constructor(roleAccessor: CREEP_ROLE_CONSTANTS | GetCreepRoleFunction) {
        if (isFunction(roleAccessor)) {
            this.roleAccessor = roleAccessor;
            return;
        }

        this.roleAccessor = (room: Room) => (roleAccessor as CREEP_ROLE_CONSTANTS);
    }

    attemptProgress(room: Room): boolean {
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
