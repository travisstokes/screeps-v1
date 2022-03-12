I should be able to utilize room source surrounding analysis to spawn a number of harvesters equal to the number of available spaces around all sources. The snippet below produces the included return results (in either object form, or, even better for this case, array form as below). It is probably worth expanding this in a later iteration to account for resource respawn rates.

var sourceIdx = 0;
var spawner = Game.spawns["Spawn1"];
JSON.stringify(spawner.room.lookAtArea(spawner.room.find(FIND_SOURCES)[sourceIdx].pos.y-1, spawner.room.find(FIND_SOURCES)[sourceIdx].pos.x-1, spawner.room.find(FIND_SOURCES)[0].pos.y + 1, spawner.room.find(FIND_SOURCES)[sourceIdx].pos.x + 1, true));

{
    "20": {
        "29": [
            {
                "type": "terrain",
                "terrain": "plain"
            }
        ],
        "30": [
            {
                "type": "terrain",
                "terrain": "plain"
            }
        ],
        "31": [
            {
                "type": "terrain",
                "terrain": "plain"
            }
        ]
    },
    "21": {
        "29": [
            {
                "type": "terrain",
                "terrain": "wall"
            }
        ],
        "30": [
            {
                "type": "source",
                "source": {
                    "room": {
                        "name": "W8N3",
                        "energyAvailable": 300,
                        "energyCapacityAvailable": 300,
                        "visual": {
                            "roomName": "W8N3"
                        }
                    },
                    "pos": {
                        "x": 30,
                        "y": 21,
                        "roomName": "W8N3"
                    },
                    "id": "26f20772347f879",
                    "energy": 3000,
                    "energyCapacity": 3000
                }
            },
            {
                "type": "terrain",
                "terrain": "wall"
            }
        ],
        "31": [
            {
                "type": "terrain",
                "terrain": "plain"
            }
        ]
    },
    "22": {
        "29": [
            {
                "type": "terrain",
                "terrain": "wall"
            }
        ],
        "30": [
            {
                "type": "terrain",
                "terrain": "wall"
            }
        ],
        "31": [
            {
                "type": "terrain",
                "terrain": "wall"
            }
        ]
    }
}

[
    {
        "x": 30,
        "y": 21,
        "type": "source",
        "source": {
            "room": {
                "name": "W8N3",
                "energyAvailable": 300,
                "energyCapacityAvailable": 300,
                "visual": {
                    "roomName": "W8N3"
                }
            },
            "pos": {
                "x": 30,
                "y": 21,
                "roomName": "W8N3"
            },
            "id": "26f20772347f879",
            "energy": 3000,
            "energyCapacity": 3000
        }
    },
    {
        "type": "terrain",
        "terrain": "plain",
        "x": 29,
        "y": 20
    },
    {
        "type": "terrain",
        "terrain": "plain",
        "x": 30,
        "y": 20
    },
    {
        "type": "terrain",
        "terrain": "plain",
        "x": 31,
        "y": 20
    },
    {
        "type": "terrain",
        "terrain": "wall",
        "x": 29,
        "y": 21
    },
    {
        "type": "terrain",
        "terrain": "wall",
        "x": 30,
        "y": 21
    },
    {
        "type": "terrain",
        "terrain": "plain",
        "x": 31,
        "y": 21
    },
    {
        "type": "terrain",
        "terrain": "wall",
        "x": 29,
        "y": 22
    },
    {
        "type": "terrain",
        "terrain": "wall",
        "x": 30,
        "y": 22
    },
    {
        "type": "terrain",
        "terrain": "wall",
        "x": 31,
        "y": 22
    }
]


[
    {
        "x": 35,
        "y": 19,
        "type": "creep",
        "creep": {
            "room": {
                "name": "W8N3",
                "energyAvailable": 300,
                "energyCapacityAvailable": 300,
                "visual": {
                    "roomName": "W8N3"
                }
            },
            "pos": {
                "x": 35,
                "y": 19,
                "roomName": "W8N3"
            },
            "id": "622a57d38f05e16ac675fc76",
            "name": "harvester: 170134",
            "body": [
                {
                    "type": "work",
                    "hits": 100
                },
                {
                    "type": "carry",
                    "hits": 100
                },
                {
                    "type": "move",
                    "hits": 100
                }
            ],
            "my": true,
            "owner": {
                "username": "MorosePanda"
            },
            "spawning": false,
            "ticksToLive": 9,
            "carryCapacity": 50,
            "carry": {
                "energy": 50
            },
            "store": {
                "energy": 50
            },
            "fatigue": 0,
            "hits": 300,
            "hitsMax": 300
        }
    },
    {
        "x": 34,
        "y": 19,
        "type": "creep",
        "creep": {
            "room": {
                "name": "W8N3",
                "energyAvailable": 300,
                "energyCapacityAvailable": 300,
                "visual": {
                    "roomName": "W8N3"
                }
            },
            "pos": {
                "x": 34,
                "y": 19,
                "roomName": "W8N3"
            },
            "id": "622a582f8f05e16ac675fc80",
            "name": "harvester: 170249",
            "body": [
                {
                    "type": "work",
                    "hits": 100
                },
                {
                    "type": "carry",
                    "hits": 100
                },
                {
                    "type": "move",
                    "hits": 100
                }
            ],
            "my": true,
            "owner": {
                "username": "MorosePanda"
            },
            "spawning": false,
            "ticksToLive": 124,
            "carryCapacity": 50,
            "carry": {
                "energy": 50
            },
            "store": {
                "energy": 50
            },
            "fatigue": 0,
            "hits": 300,
            "hitsMax": 300
        }
    },
    {
        "x": 34,
        "y": 20,
        "type": "source",
        "source": {
            "room": {
                "name": "W8N3",
                "energyAvailable": 300,
                "energyCapacityAvailable": 300,
                "visual": {
                    "roomName": "W8N3"
                }
            },
            "pos": {
                "x": 34,
                "y": 20,
                "roomName": "W8N3"
            },
            "id": "71ac0772347ffe6",
            "energy": 3000,
            "energyCapacity": 3000
        }
    },
    {
        "type": "terrain",
        "terrain": "plain",
        "x": 33,
        "y": 19
    },
    {
        "type": "terrain",
        "terrain": "plain",
        "x": 34,
        "y": 19
    },
    {
        "type": "terrain",
        "terrain": "plain",
        "x": 35,
        "y": 19
    },
    {
        "type": "terrain",
        "terrain": "plain",
        "x": 33,
        "y": 20
    },
    {
        "type": "terrain",
        "terrain": "wall",
        "x": 34,
        "y": 20
    },
    {
        "type": "terrain",
        "terrain": "wall",
        "x": 35,
        "y": 20
    },
    {
        "type": "terrain",
        "terrain": "plain",
        "x": 33,
        "y": 21
    },
    {
        "type": "terrain",
        "terrain": "wall",
        "x": 34,
        "y": 21
    },
    {
        "type": "terrain",
        "terrain": "wall",
        "x": 35,
        "y": 21
    }
]
