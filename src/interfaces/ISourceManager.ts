import { ISourceMetadata } from "./ISourceMetadata";

export interface ISourceManager {
    assignSource(creep: Creep): void;
    getRecommendedContainerSite(roomName: string, sourceId: Id<Source>): RoomPosition | undefined;
    getSourceMetadata(roomName: string): ISourceMetadata[];
}
