interface Room {
    approximateEnergyIncome() : number
    approximateMaintenanceCosts() : number
    countCreeps(roles: CREEP_ROLE_CONSTANTS[]) : number
    createCreep(role: CREEP_ROLE_CONSTANTS, maxEnergy: number, allowQueue: boolean): ScreepsReturnCode;
    getAllSpawners(): StructureSpawn[];
    isBeingConstructed(structureType: StructureConstant): boolean;
}

Room.prototype.isBeingConstructed = function(structureType: StructureConstant) {
    return this.find(FIND_CONSTRUCTION_SITES, {filter: s => s.my && s.structureType == structureType}).length > 0;
}

Room.prototype.approximateEnergyIncome = function() {
    return 0;
}

Room.prototype.approximateEnergyIncome = function() {
    return 0;
}

Room.prototype.countCreeps = function(roles: string[]) {
    var activeCreeps = this.find(FIND_MY_CREEPS, {
        filter: (creep) => roles.includes(creep.memory.role)
    }).length;

    var spawningCreeps = this.find(FIND_MY_SPAWNS, {
        filter: (spawn) => spawn.spawning != undefined && roles.includes(Game.creeps[spawn.spawning?.name].memory.role)
    }).length;

    return activeCreeps + spawningCreeps;
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
