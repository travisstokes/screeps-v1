A given role is simply a series of goals. Those goals are fulfilled in order, or, where possible, asynchronously.
As goals are fulfilled, new goals are unlocked. Eventually, to manage complexity, the final goal of each role is either "sustain" or "evolve".
Sustain just keeps its people doing what it's doing, refreshing as needed possibly waiting on triggers to swap roles. "evolve" is room/goal driven conversion of the room's role without the room overseer deciding it.

A given role should have minimum structural requirements (including RCL/GCL) or production requirements (ie, X spawn rate determined by total number of spawners,
    X mining rate determined by existing (or queued) miners, etc), but probably shouldn't be explicitly dependent upon exact screep composition as that will get complicated.

We might be able to determine things like upgrade rate, transport rate, etc based on screep composition, but that's not the same as 'Need to have x static miners, y builders', etc...
that requires the goals to have too much knowledge of the screep roles.

An example combat role might be:
    "Defense": building out walls, ramparts, and towers
    "Scouting": building up movers and directing them to look for enemy rooms/creeps, but not necessarily building up attackers
    "Offense": building up and coordinating attack squads

Econ roles are things like
    "InitializeColony": first starting with a new spawn at 300 energy),
    "ControllerFocus": Basic mining established, build up intraroom energy flow and push as much upgrade energy as possible to unlock controller features.
    "Colonization": Scouts out and deploys colonizer creeps to new rooms
    "Production": Building out factories, labs, and spawners to increase support for more advanced units, commodities, etc. Likely supported by outposts.
    "MiningOutpost": Focus on miner optimization and delivery of energy to other rooms. Doesn't need a high RCL, just enough to make the necessary extensions for miners.

There will likely be some overlap, so all roles are supported by "Actions" that help encapsulate things the roles can do. For example, both "Colonization" and "Production" may
benefit from sending colony scouts out and various levels of the econ roles may benefit from building walls and towers, if not quite as aggressively as "Defense".


