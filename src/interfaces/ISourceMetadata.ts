import { ICoordinate } from "./ICoordinate";

export interface ISourceMetadata {
    source: Source;
    availableSpaces: ICoordinate[];
    assignedCreeps: Id<Creep>[];
    assignedWorkParts: number;
    containers: Id<Structure>[];
}
