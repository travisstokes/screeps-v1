import { BaseRole } from "./BaseRole";

export class StaticMiner extends BaseRole{
    roleName: string = "static-miner";
    protected performSpawn(spawnerName: string, creepName: string): ScreepsReturnCode {
        return Game.spawns[spawnerName].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], creepName, { memory: { role: this.roleName } });
    }
    run(creep: Creep): void {
        if(!creep.memory.assignedSource) {
            Game.services.sourceManager.assignSource(creep);
        }

        if(!creep.memory.assignedSource) {
            creep.say("Idle");
            return;
        }

        var assignedSource = Game.getObjectById(creep.memory.assignedSource) as Source;

        if(creep.harvest(assignedSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(assignedSource);
        } else {
            creep.drop(RESOURCE_ENERGY);
        }
    }
}

