import { IBodyMatrixEntry } from "interfaces/IBodyMatrixEntry";
import { ISpawnData } from "interfaces/ISpawnData";
import { BaseRole } from "./BaseRole";

export class IntraRoomTransportRole extends BaseRole{
    roleName: string = "intra-room-transport";

    bodyMatrix: IBodyMatrixEntry[] = [];
    run(creep: Creep): void {
        if(creep.spawning) {return;}
    }
}
