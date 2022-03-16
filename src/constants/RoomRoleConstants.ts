import _ from "lodash";

declare global {
    type ROOM_ROLES_CONSTANT = OPTIMIZE_CONTROLLER_ROLE | NEW_COLONY_ROLE;
    type OPTIMIZE_CONTROLLER_ROLE = "optimize-controller";
    type NEW_COLONY_ROLE = "new-colony";
    const OPTIMIZE_CONTROLLER_ROLE: OPTIMIZE_CONTROLLER_ROLE;
    const NEW_COLONY_ROLE: NEW_COLONY_ROLE;
}
