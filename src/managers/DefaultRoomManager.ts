import { IRoleManager } from "interfaces/IRoleManager";
import { NewColonyRole} from "../roles/RoomRoles/NewColonyRole";
import { OptimizeControllerRole } from "../roles/RoomRoles/OptimizeControllerRole";
import { IRoomRole } from "../roles/RoomRoles/IRoomRole";
import { NEW_COLONY_ROLE, OPTIMIZE_CONTROLLER_ROLE, ROOM_ROLES_CONSTANT, TEMP_SUSTAIN_CREEPS } from "constants/RoomRoleConstants";
import { TempSustainCreeps } from "roles/RoomRoles/TemporarySustainRole";


export class DefaultRoomManager implements IRoleManager<IRoomRole> {
    availableRoles: Map<ROOM_ROLES_CONSTANT, IRoomRole> = new Map<ROOM_ROLES_CONSTANT, IRoomRole>();

    constructor() {
        var optimizeControllerRole = new OptimizeControllerRole();
        var newColonyRole = new NewColonyRole();
        var tempSustainCreeps = new TempSustainCreeps();
        this.availableRoles.set(OPTIMIZE_CONTROLLER_ROLE, optimizeControllerRole);
        this.availableRoles.set(NEW_COLONY_ROLE, newColonyRole);
        this.availableRoles.set(TEMP_SUSTAIN_CREEPS, tempSustainCreeps);
    }

    getByName(name: ROOM_ROLES_CONSTANT): IRoomRole {
        var role = this.availableRoles.get(name);

        if (role == undefined) {
            throw new Error("Role not found");
        }

        return role;
    }
    runAll(): void {
        for (var roomName in Game.rooms) {
            var room = Game.rooms[roomName];

            if(room.controller?.my && !room.memory.role) {
                room.memory.role = "new-colony";
            }

            var role = this.availableRoles.get(room.memory.role);

            if (!role) {
                console.log(`No matching role (${room.memory.role}) found for ${roomName}`);
                continue;
            }

            try {
                role.run(room);
            }
            catch (error) {
                console.log((error as Error).message);
            }
        }
    }
}
