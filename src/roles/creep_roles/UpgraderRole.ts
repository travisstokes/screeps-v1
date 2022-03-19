import { CREEP_ROLE_CONSTANTS, UPGRADER_ROLE } from "constants/CreepRoleConstants";
import { IBodyMatrixEntry } from "interfaces/IBodyMatrixEntry";
import { GoalBasedRole } from "./GoalBasedRole";
import { CheckFinishedWorkingGoal } from "./goals/CheckFinishedWorkingGoal";
import { CollectStoredEnergyFromNearestGoal } from "./goals/CollectStoredEnergyFromNearestGoal";
import { FinishSpawningGoal } from "./goals/FinishSpawningGoal";
import { HarvestEnergyFromNearestGoal } from "./goals/HarvestEnergyFromNearestGoal";
import { ICreepGoal } from "./goals/ICreepGoal";
import { UpgradeControllerGoal } from "./goals/UpgradeControllerGoal";

export class UpgraderRole extends GoalBasedRole {
  protected roleName: CREEP_ROLE_CONSTANTS = UPGRADER_ROLE;

  protected bodyMatrix: IBodyMatrixEntry[] = [
    {energyRequired: 300, body: [WORK, WORK, CARRY, MOVE]},
    {energyRequired: 400, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]}
  ]

  protected creepGoals: ICreepGoal[] = [
    new FinishSpawningGoal(),
    new CheckFinishedWorkingGoal(),
    new CollectStoredEnergyFromNearestGoal(),
    new HarvestEnergyFromNearestGoal(),
    new UpgradeControllerGoal()
  ];
}
