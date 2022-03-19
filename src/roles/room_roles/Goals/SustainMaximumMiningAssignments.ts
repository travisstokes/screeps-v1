import { HARVESTER_ROLE, STATIC_MINER_ROLE } from "constants/CreepRoleConstants";
import { BaseSustainCreepGoal } from "./BaseSustainCreepGoal";


export class SustainMaximumMiningAssignments extends BaseSustainCreepGoal {
    constructor() {
        // If we have static miners, let's assume we've hit that stage and prioritize them.
        var roleAccessor = (room: Room) => room.countCreeps([STATIC_MINER_ROLE]) > 0 ? STATIC_MINER_ROLE : HARVESTER_ROLE;
        super(roleAccessor);
    }

    checkAchieved(room: Room): boolean {
        return Game.services.sourceManager.getAvailableWorkstations(room) == 0;
    }
}
