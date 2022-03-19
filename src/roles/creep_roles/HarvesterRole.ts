import { CREEP_ROLE_CONSTANTS, HARVESTER_ROLE } from "constants/CreepRoleConstants";
import { IBodyMatrixEntry } from "interfaces/IBodyMatrixEntry";
import { GetAssignedToSourceGoal } from "./goals/GetAssignedToSourceGoal";
import { GoalBasedRole } from "./GoalBasedRole";
import { CheckFinishedWorkingGoal } from "./goals/CheckFinishedWorkingGoal";
import { DepositToNearestCapacitor } from "./goals/DepositToNearestCapacitor";
import { DepositToNearestTowerGoal } from "./goals/DepositToNearestTower";
import { FinishSpawningGoal } from "./goals/FinishSpawningGoal";
import { ICreepGoal } from "./goals/ICreepGoal";
import { ProgressAvailableConstructionGoal } from "./goals/ProgressAvailableConstructionGoal";
import { UpgradeControllerGoal } from "./goals/UpgradeControllerGoal";
import { HarvestAssignedSourceGoal } from "./goals/HarvestAssignedSourceGoal";
import { DepositToSourceContainerGoal } from "./goals/DepositToSourceContainerGoal";
import { DepositToNearestStorageGoal } from "./goals/DepositToNearestStorageGoal";

export class HarvesterRole extends GoalBasedRole{
  protected roleName: CREEP_ROLE_CONSTANTS = HARVESTER_ROLE;

  protected bodyMatrix: IBodyMatrixEntry[] = [
    {energyRequired: 300, body: [WORK, WORK, CARRY, MOVE]},
    {energyRequired: 400, body: [WORK, WORK, CARRY, CARRY, MOVE, MOVE]}
  ]

  protected creepGoals: ICreepGoal[] = [
    new FinishSpawningGoal(),
    new GetAssignedToSourceGoal(),
    new CheckFinishedWorkingGoal(),
    new HarvestAssignedSourceGoal(),
    new DepositToSourceContainerGoal(),
    new DepositToNearestCapacitor(),
    new DepositToNearestTowerGoal(),
    new DepositToNearestStorageGoal(),
    new ProgressAvailableConstructionGoal(),
    new UpgradeControllerGoal()
  ];

}
