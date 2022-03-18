import { BUILDER_ROLE, CREEP_ROLE_CONSTANTS, HARVESTER_ROLE, MINER_ROLE_CONSTANTS, STATIC_MINER_ROLE, UPGRADER_ROLE } from "constants/CreepRoleConstants";
import { EXTENSION_MAX_COUNT } from "constants/RoomConstants";
import { NEW_COLONY_ROLE, OPTIMIZE_CONTROLLER_ROLE, ROOM_ROLES_CONSTANT } from "constants/RoomRoleConstants";
import { isFunction } from "lodash";
import { BaseRoomRole } from "./BaseRoomRole";
import { IRoomGoal } from "./Goals/IRoomGoal";
import { ReachRCLLevel } from "./Goals/ReachRCLLevel";



export class OptimizeControllerRole extends BaseRoomRole {
    protected roomGoals: IRoomGoal[];
    protected evolveRole?: ROOM_ROLES_CONSTANT;
    protected devolveRole?: ROOM_ROLES_CONSTANT = NEW_COLONY_ROLE;
    protected roleName: string = OPTIMIZE_CONTROLLER_ROLE;

    constructor() {
        super();
        this.roomGoals = [
            new SustainCreepCountGoal(UPGRADER_ROLE, 1),
            new SustainMaximumMiningAssignments(),
            new SustainCreepCountGoal(BUILDER_ROLE, 2),
            new SustainMaxExtensions(), // Sustain maximum extensions (achieved when all are built, not necessarily full)
            new ReachRCLLevel(3),
            // Create tower (achieved when built)
            // Create 1 container per source for miners (achieved when built)
            // Create storage between sources and controller (achieved when built)
            // Develop source roads (source to storage)
            // Develop controller roads (storage to controller)
            // Develop extension/spawn roads (storage to spawn/extension network)
            // Develop tower roads (storage to tower)
            // Sustain source -> storage and storage -> controller transport creeps
            // Ramp miners to static profile
            new ImpossibleGoal(),
            new SustainCreepCountGoal(UPGRADER_ROLE, 6), // Sustain X upgraders (need to think about / play with X to determine the right balance)
            new ReachRCLLevel(6) // Need to fine tune desired RCL level here before evolving into factory mode.
        ];
    }

    // Coming in to Optimize, we have 1 low level miner, 1 low level upgrader and RCL 2
    // Sustain maximum mining assignment // TODO: Update miners to prioritize source adjacent containers over spawners/extensions and let builders transport in early stages
    // Sustain 2 upgraders
    // Sustain 2 builders // TODO: Add support for builders transporting energy from source to buildings (extensions, spawn, ).

    // TODO: Implement OptimizeController goals
}

type GetCreepRoleFunction = (room: Room) => CREEP_ROLE_CONSTANTS;

export class ImpossibleGoal implements IRoomGoal {
    checkAchieved(room: Room): boolean {
        return false;
    }
    attemptProgress(room: Room): boolean {
        return true;
    }
}

export class SustainMaxExtensions implements IRoomGoal {
    constructor() {
    }

    checkAchieved(room: Room): boolean {
        return room.find(FIND_MY_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_EXTENSION}).length == EXTENSION_MAX_COUNT[room.controller?.level ?? 0];
    }
    attemptProgress(room: Room): boolean {
        var currentSites = room.find(FIND_CONSTRUCTION_SITES, {
            filter: site => site.structureType == STRUCTURE_EXTENSION
        }).length;

        if(currentSites > 0) {
            return true;
        }

        return room.placeExtensions(EXTENSION_MAX_COUNT[room.controller?.level ?? 0] - currentSites) == OK;
    }
}

export abstract class BaseSustainCreepGoal implements IRoomGoal{
    abstract checkAchieved(room: Room) : boolean;
    roleAccessor: GetCreepRoleFunction;

    constructor(roleAccessor: CREEP_ROLE_CONSTANTS | GetCreepRoleFunction) {
        if(isFunction(roleAccessor)){
            this.roleAccessor = roleAccessor;
            return;
        }

        this.roleAccessor = (room: Room) => (roleAccessor as CREEP_ROLE_CONSTANTS);
    }

    attemptProgress(room: Room): boolean {
        var roleToTarget = this.roleAccessor(room);

        if(room.countSpawningCreeps([roleToTarget]) > 0) {
            return true;
        }

        var result = room.createCreep(roleToTarget, 0, false);

        if(result == OK) {
            return true;
        }

        return false;
    }
}

export class SustainCreepCountGoal extends BaseSustainCreepGoal {
    amountToSustain: number;

    constructor(role: CREEP_ROLE_CONSTANTS, amountToSustain: number) {
        super(role);
        this.amountToSustain = amountToSustain;
    }

    checkAchieved(room: Room): boolean {
        return room.countActiveCreeps([this.roleAccessor(room)]) >= this.amountToSustain;
    }
}

export class SustainMaximumMiningAssignments extends BaseSustainCreepGoal {
    constructor() {
        // If we have static miners, let's assume we've hit that stage and prioritize them.
        var roleAccessor = (room: Room) => room.countCreeps([STATIC_MINER_ROLE]) > 0 ? STATIC_MINER_ROLE : HARVESTER_ROLE;
        super(roleAccessor);
    }

    checkAchieved(room: Room): boolean {
        return Game.services.sourceManager.getAvailableWorkstations(room) == 0
    }
}
