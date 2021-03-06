import { ICoordinate } from "./ICoordinate";

export interface ISourceMetadata {
    source: Source;
    availableSpaces: RoomPosition[];
    assignedCreeps: Id<Creep>[];
    assignedWorkParts: number;
    containers: Id<Structure>[];
}
