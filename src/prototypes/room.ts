import { CREEP_ROLE_CONSTANTS } from "constants/CreepRoleConstants";

declare global {
    interface Room {
        countActiveCreeps(roles: CREEP_ROLE_CONSTANTS[]) : number
        countSpawningCreeps(roles: CREEP_ROLE_CONSTANTS[]) : number
        countCreeps(roles: CREEP_ROLE_CONSTANTS[]) : number
        createCreep(role: CREEP_ROLE_CONSTANTS, maxEnergy: number, allowQueue: boolean): ScreepsReturnCode;
        getAllSpawners(): StructureSpawn[];
        isBeingConstructed(structureType: StructureConstant): boolean;
        placeExtensions(count: number): ScreepsReturnCode;
    }
}

Room.prototype.placeExtensions = function(count: number) {
    var spawners = this.find(FIND_MY_SPAWNS);

    if(!spawners.length) {
        return ERR_INVALID_ARGS;
    }

    var center = spawners[0].pos;
    var ringNumber = 1;

    while(count > 1) {
        for(var x = ringNumber * -1; x <= ringNumber; x +=2 )
        {
            for(var y = ringNumber * -1; y <= ringNumber; y += 2)
            {
                if(this.createConstructionSite(center.x + x, center.y + y, STRUCTURE_EXTENSION) == OK) {
                    count--;
                    if(count == 0) {
                        return OK;
                    }
                }
            }
        }
        ringNumber++;
    }
    return ERR_FULL;
}

Room.prototype.isBeingConstructed = function(structureType: StructureConstant) {
    return this.find(FIND_CONSTRUCTION_SITES, {filter: s => s.my && s.structureType == structureType}).length > 0;
}

Room.prototype.countCreeps = function(roles: CREEP_ROLE_CONSTANTS[]) {
    return this.countActiveCreeps(roles) + this.countSpawningCreeps(roles);
}

Room.prototype.countActiveCreeps = function(roles: CREEP_ROLE_CONSTANTS[]) {
    return this.find(FIND_MY_CREEPS, {
        filter: (creep) => roles.includes(creep.memory.role)
    }).length;
}

Room.prototype.countSpawningCreeps = function(roles: CREEP_ROLE_CONSTANTS[]) {
    return this.find(FIND_MY_SPAWNS, {
        filter: (spawn) => spawn.spawning != undefined && roles.includes(Game.creeps[spawn.spawning?.name].memory.role)
    }).length;
}

var nextId = Game?.time ?? 1;
Room.prototype.createCreep = function(role: CREEP_ROLE_CONSTANTS, maxEnergy: number = 0, allowQueue: boolean = true) {
    var spawnFindOpts = undefined;

    if(!maxEnergy) {
        maxEnergy = this.energyCapacityAvailable;
    }

    if(!allowQueue) {
        spawnFindOpts = {
            filter: (spawn: StructureSpawn) => !spawn.spawning
        }
    }

    var spawners = this.find(FIND_MY_SPAWNS, spawnFindOpts);

    if(!spawners.length) {
        return ERR_BUSY
    }

    var roleObject = Game.services.creepRoleManager.getByName(role);
    var spawnData = roleObject.getSpawnData(maxEnergy);
    var creepInstanceName = `${role}_${nextId++}`;

    var creepMemory = { role: role};

    return spawners[0].spawnCreep(spawnData.body, creepInstanceName, { memory: creepMemory });
}

Room.prototype.getAllSpawners = function() {
    return this.find(FIND_MY_SPAWNS);
}
