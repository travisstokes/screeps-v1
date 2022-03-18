import { ROOM_ROLES_CONSTANT } from "constants/RoomRoleConstants";
import { IRoomGoal } from "./Goals/IRoomGoal";
import { IRoomRole } from "./IRoomRole";

// CONTROLLERS

export abstract class BaseRoomRole implements IRoomRole {
    protected abstract roleName: string;
    protected abstract evolveRole?: ROOM_ROLES_CONSTANT;
    protected abstract devolveRole?: ROOM_ROLES_CONSTANT;
    protected abstract roomGoals: IRoomGoal[];

    getRoleName(): string {
        return this.roleName;
    }

    getDevolveRole(): ROOM_ROLES_CONSTANT | undefined {
        return this.devolveRole;
    }
    getEvolveRole(): ROOM_ROLES_CONSTANT | undefined {
        return this.evolveRole;
    }

    run(room: Room): void {
        // TODO: Add dependency tree and async progress support.
        for(var goal of this.roomGoals) {
            if(goal.checkAchieved(room)) {
                continue;
            }

            // TODO: Handle failed progress?
            goal.attemptProgress(room);
            return;
        }

        // All goals achieved.
        if(this.evolveRole) {
            console.log(`Evolving room ${room.name} to ${this.evolveRole}`);
            room.memory.role = this.evolveRole;
        }
    }
}
