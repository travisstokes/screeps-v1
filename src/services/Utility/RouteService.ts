interface StoreRouteNode {
    pos: RoomPosition,
    store: StoreDefinition
  }

  // TODO: WIP
export class RouteService {
    findEnergyEnRoute(creep: Creep, energyRequired: number, destination: Structure) : StoreRouteNode[] {
        var energySources = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) =>
                (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER)
                && structure.store.energy > 0
        }).map(structure => {
            if (structure.structureType == STRUCTURE_STORAGE || structure.structureType == STRUCTURE_CONTAINER) {
                return { pos: structure.pos, store: structure.store };
            }

            return null;
        }).filter(node => node != undefined && node != null);

        var route: StoreRouteNode[] = [];
        var currentPos = creep.pos;
        var destinationPos = destination.pos;
        energyRequired = _.min([energyRequired, creep.store.getCapacity()]); - creep.store.energy;

        while (energyRequired > 0 && energySources.length > 0) {
            var nextTarget = _.max(energySources, source => {
                if (!source) { return 0; }

                return _.min([source.store.energy, energyRequired]) / (source.pos.getRangeTo(currentPos) + source.pos.getRangeTo(destinationPos))
            });

            _.remove(energySources, s => s?.pos == nextTarget?.pos);

            if (nextTarget == null) {
                continue;
            }

            route.push(nextTarget)
            currentPos = nextTarget.pos;
            energyRequired -= nextTarget.store.energy;
        }

        return [];
    }
}
