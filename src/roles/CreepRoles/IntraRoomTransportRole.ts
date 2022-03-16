import { IBodyMatrixEntry } from "interfaces/IBodyMatrixEntry";
import { ISpawnData } from "interfaces/ISpawnData";
import { BaseRole } from "./BaseRole";

export class IntraRoomTransportRole extends BaseRole{
    roleName: string = INTRA_ROOM_TRANSPORT_ROLE;

    bodyMatrix: IBodyMatrixEntry[] = [];
    run(creep: Creep): void {
        if(creep.spawning) {return;}
    }
}
