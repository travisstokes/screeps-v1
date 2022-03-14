import { ISourceMetadata } from "./ISourceMetadata";

export interface ISourceManager {
    assignSource(creep: Creep): Source | undefined;
    getRecommendedContainerSite(roomName: string, sourceId: Id<Source>): RoomPosition | undefined;
    getRoomSourcesMetadata(roomName: string): ISourceMetadata[];
}
