craftdle-backend/
├── src/
│   ├── app.module.ts
│   ├── server.ts                   # Szerver inicializáció
│   ├── shared/                     # Közös erőforrásokat tartalmazó mappa
│   │   ├── shared.module.ts        # SharedModule deklaráció
│   │   ├── interfaces/             # Összes olyan interface, amit több modul is használ
│   │   │   └── shared.interface.ts
│   │   ├── entities/               # Összes olyan entity, amit több modul is használ
│   │   │   └── shared.entity.ts
│   │   ├── classes/                # Összes olyan class, amit több modul is használ
│   │   │   └── shared.class.ts
│   │   └── utilities/              # Összes olyan function, amit több modul is használ
│   │       └── shared.function.ts
│   │
│   ├── users/                      # User modul és kapcsolódó fájlok
│   │   ├── users.module.ts
│   │   ├── users.controller.ts     # User modul összes végpontja
│   │   ├── users.service.ts        # User modul fő komponense
│   │   ├── interfaces/
│   │   │   └── users.interface.ts
│   │   ├── entities/
│   │   │   └── users.entity.ts
│   │   ├── classes/
│   │   │   └── users.class.ts
│   │   └── utilities/
│   │       └── users.function.ts
│   │
│   ├── game/
│   │   ├── game.module.ts          # Game modul konfiguráció
│   │   ├── game.controller.ts      # Game modul összes végpontja
│   │   ├── game.service.ts         # Game modul fő logikája
│   │   ├── interfaces/
│   │   │   └── game-gamemode.ts    # IGamemode interface definiálja a játékmodok közös szerkezetét
│   │   ├── entities/
│   │   │   └── game.entity.ts      # Game entitás, adatbázis objektum
│   │   ├── classes/
│   │   │   ├── game-allinone.ts    # All-in-One játékmód absztrakt osztály, magába foglalja összes többi
│   │   │   ├── game-resource.ts    # játékmód absztrakt osztályának a metódusait. Az osztályok bináris fa-ként
│   │   │   ├── game-classic.ts     # öröklődnek egymásból, és minden osztály felülírja a validateRiddle matódust
│   │   │   ├── game-daily.ts       # az játékmód szabályai szerint
│   │   │   ├── game-hardcore.ts
│   │   │   └── game-pocket.ts
│   │   └── utilities/
│   │       └── game.function.ts
│   │
│   ├── riddle/                      # Riddle modul és kapcsolódó fájlok
│   │   ├── users.module.ts
│   │   ├── users.controller.ts     # Riddle modul összes végpontja
│   │   ├── users.service.ts        # Riddle modul fő komponense
│   │   ├── interfaces/
│   │   │   └── riddle.interface.ts
│   │   ├── entities/
│   │   │   └── riddle.entity.ts
│   │   ├── classes/
│   │   │   └── riddle.class.ts
│   │   └── utilities/
│   │       └── riddle.function.ts# Segédfüggvények
│   │
│   ├── admin/                      # Admin modul és kapcsolódó fájlok
│   │   ├── admin.module.ts
│   │   ├── admin.controller.ts     # Admin modul összes végpontja
│   │   ├── admin.service.ts        # Admin modul fő komponense
│   │   ├── entities/
│   │   │   └── admin.entity.ts
│   │   └── utilities/
│   │       └── admin.function.ts
└── ...                             # Egyébb mudoluk, amikkel még nem fárasztom magam pl: maintenance