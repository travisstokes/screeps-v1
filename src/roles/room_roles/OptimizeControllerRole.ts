import { BUILDER_ROLE, MINER_ROLE_CONSTANTS, UPGRADER_ROLE } from "constants/CreepRoleConstants";
import { NEW_COLONY_ROLE, OPTIMIZE_CONTROLLER_ROLE, ROOM_ROLES_CONSTANT } from "constants/RoomRoleConstants";
import { BaseRoomRole } from "./BaseRoomRole";
import { IRoomGoal } from "./Goals/IRoomGoal";
import { ReachRCLLevel } from "./Goals/ReachRCLLevel";
import { ImpossibleGoal } from "./Goals/ImpossibleGoal";
import { SustainCreepCountGoal } from "./Goals/SustainCreepCountGoal";
import { SustainMaxExtensions } from "./Goals/SustainMaxExtensions";
import { SustainMaximumMiningAssignments } from "./Goals/SustainMaximumMiningAssignments";
import { MaintainSouceContainers } from "./Goals/MaintainSourceContainers";

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
            new MaintainSouceContainers(),
            new SustainMaxExtensions(), // Sustain maximum extensions (achieved when all are built, not necessarily full)
            new ReachRCLLevel(3),
            // Create tower (achieved when built)
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
