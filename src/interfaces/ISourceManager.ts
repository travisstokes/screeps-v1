import { ISourceMetadata } from "./ISourceMetadata";

export interface ISourceManager {
    getContainer(assignedSource: Id<Source>) : StructureContainer | null;
    getAvailableWorkstations(room: Room): number;
    assignSource(creep: Creep): Source | undefined;
    getRecommendedContainerSite(roomName: string, sourceId: Id<Source>): RoomPosition | undefined;
    getRoomSourcesMetadata(roomName: string): ISourceMetadata[];
}
