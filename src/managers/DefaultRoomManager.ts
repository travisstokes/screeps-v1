import { IRoleManager } from "interfaces/IRoleManager";
import { NewColonyRole} from "../roles/RoomRoles/NewColonyRole";
import { OptimizeControllerRole } from "../roles/RoomRoles/OptimizeControlerRole";
import { IRoomRole } from "../roles/RoomRoles/IRoomRole";


export class DefaultRoomManager implements IRoleManager<IRoomRole> {
    availableRoles: Map<ROOM_ROLES_CONSTANT, IRoomRole> = new Map<ROOM_ROLES_CONSTANT, IRoomRole>();

    constructor() {
        var optimizeControllerRole = new OptimizeControllerRole();
        var newColonyRole = new NewColonyRole();
        this.availableRoles.set("optimize-controller", optimizeControllerRole);
        this.availableRoles.set(NEW_COLONY_ROLE, newColonyRole);
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
