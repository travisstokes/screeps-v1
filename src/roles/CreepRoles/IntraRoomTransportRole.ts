import { CREEP_ROLE_CONSTANTS, INTRA_ROOM_TRANSPORT_ROLE } from "constants/CreepRoleConstants";
import { IBodyMatrixEntry } from "interfaces/IBodyMatrixEntry";
import { ISpawnData } from "interfaces/ISpawnData";
import { BaseRole } from "./BaseRole";

export class IntraRoomTransportRole extends BaseRole{
    roleName: CREEP_ROLE_CONSTANTS = INTRA_ROOM_TRANSPORT_ROLE;

    bodyMatrix: IBodyMatrixEntry[] = [];
    run(creep: Creep): void {
        if(creep.spawning) {return;}
    }
}
