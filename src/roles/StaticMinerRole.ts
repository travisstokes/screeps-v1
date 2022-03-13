import { ISpawnData } from "interfaces/ISpawnData";
import { BaseRole } from "./BaseRole";

export class StaticMiner extends BaseRole{
    roleName: string = "static-miner";
    getSpawnData(maxEnergy: number): ISpawnData {
        return {body: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE]};
    }
    run(creep: Creep): void {
        if(creep.spawning) {return;}

        if(!creep.memory.assignedSource) {
            Game.services.sourceManager.assignSource(creep);
        }

        if(!creep.memory.assignedSource) {
            creep.say("Idle");
            return;
        }

        if(creep.memory.movingTo && creep.pos.inRangeTo(creep.memory.movingTo, 0)) {
            creep.memory.movingTo = undefined;
        }

        var assignedSource = Game.getObjectById(creep.memory.assignedSource) as Source;
        if(creep.harvest(assignedSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(assignedSource);
        } else {
            creep.drop(RESOURCE_ENERGY);
        }
    }
}
