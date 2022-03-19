import { CREEP_ROLE_CONSTANTS } from "constants/CreepRoleConstants";
import { BaseSustainCreepGoal } from "./BaseSustainCreepGoal";


export class SustainCreepCountGoal extends BaseSustainCreepGoal {
    amountToSustain: number;

    constructor(role: CREEP_ROLE_CONSTANTS, amountToSustain: number) {
        super(role);
        this.amountToSustain = amountToSustain;
    }

    checkAchieved(room: Room): boolean {
        return room.countActiveCreeps([this.roleAccessor(room)]) >= this.amountToSustain;
    }
}
