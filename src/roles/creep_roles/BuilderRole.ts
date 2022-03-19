import { BUILDER_ROLE, CREEP_ROLE_CONSTANTS } from "constants/CreepRoleConstants";
import { IBodyMatrixEntry } from "interfaces/IBodyMatrixEntry";
import { GoalBasedRole } from "./GoalBasedRole";
import { CollectStoredEnergyFromNearestGoal } from "./goals/CollectStoredEnergyFromNearestGoal";
import { HarvestEnergyFromNearestGoal } from "./goals/HarvestEnergyFromNearestGoal";
import { DepositToNearestCapacitor as DepositToNearestCapacitorGoal } from "./goals/DepositToNearestCapacitor";
import { ProgressAvailableConstructionGoal } from "./goals/ProgressAvailableConstructionGoal";
import { UpgradeControllerGoal } from "./goals/UpgradeControllerGoal";
import { FinishSpawningGoal } from "./goals/FinishSpawningGoal";
import { ICreepGoal } from "./goals/ICreepGoal";
import { CheckFinishedWorkingGoal } from "./goals/CheckFinishedWorkingGoal";
import { DepositToNearestTowerGoal } from "./goals/DepositToNearestTower";

export class BuilderRole extends GoalBasedRole {
  protected roleName: CREEP_ROLE_CONSTANTS = BUILDER_ROLE;
  protected bodyMatrix: IBodyMatrixEntry[] = [
    {energyRequired: 300, body: [WORK, WORK, CARRY, MOVE]},
    {energyRequired: 400, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]}
  ]

  protected creepGoals: ICreepGoal[] = [
    new FinishSpawningGoal(),
    new CheckFinishedWorkingGoal(),
    new CollectStoredEnergyFromNearestGoal(),
    new HarvestEnergyFromNearestGoal(),
    new DepositToNearestCapacitorGoal(),
    new DepositToNearestTowerGoal(),
    new ProgressAvailableConstructionGoal(),
    new UpgradeControllerGoal()
  ]
}
