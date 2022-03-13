import { ISourceMetadata } from "./ISourceMetadata";

export interface ISourceManager {
    assignSource(creep: Creep): void;
    getNeedsContainer(roomName: string, sourceId: Id<Source>): {};
    getSourceMetadata(roomName: string): ISourceMetadata[];
}
