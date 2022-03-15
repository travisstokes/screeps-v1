import { IRoomRole } from "./IRoomRole";

// CONTROLLERS

export abstract class BaseRoomRole implements IRoomRole {
    protected abstract roleName: string;
    protected abstract evolveRole?: ROOM_ROLES_CONSTANT;
    protected abstract devolveRole?: ROOM_ROLES_CONSTANT;

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
        throw new Error("Method not implemented.");
    }
}
