import { StoreRouteNode } from "../services/Utility/RouteService";


export interface IRouteService {
    findPlainNearCenter(positions: RoomPosition[]): RoomPosition | undefined;
    findEnergyEnRoute(creep: Creep, energyRequired: number, destination: Structure): StoreRouteNode[];
}
