import { ISourceMetadata } from "./ISourceMetadata";

export interface SourceContainerData {
    source: Source;
    container: StructureContainer;
}

export interface ISourceManager {
    getSourceContainerData(room: Room): SourceContainerData[];
    getContainer(source: Id<Source>) : StructureContainer | null;
    getAvailableWorkstations(room: Room): number;
    assignSource(creep: Creep): Source | undefined;
    getRecommendedContainerSite(roomName: string, source: Source): RoomPosition | null;
    getRoomSourcesMetadata(roomName: string): ISourceMetadata[];
}
