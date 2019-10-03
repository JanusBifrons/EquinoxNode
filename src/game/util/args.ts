namespace FireHare.Equinox.Args {

    export class PlayerActionArgs {

        ///
        /// LOCAL
        ///
        public identifier: string;
        public action: PlayerAction;

        constructor(gIdentifier: Guid, eAction: PlayerAction) {
            this.identifier = gIdentifier.toString();
            this.action = eAction;
        }
    }

    export class ObjectDamagedArgs {

        ///
        /// LOCAL
        ///
        public identifier: string;
        public damage: number;

        constructor(gId: Guid,  nDamage: number) {
            this.identifier = gId.toString();
            this.damage = nDamage;
        }
    }

    export class ObjectSpawnedArgs {
        ///
        /// LOCAL
        ///
        public objectId: string;
        public spawnerId: string;
        public objectType: ObjectType;
        public positionX: number;
        public positionY: number;
        public rotation: number;

        constructor(eType: ObjectType, cObject: GameObject, cSpawner?: GameObject) {
            this.objectType = eType;
            this.objectId = cObject.identifier.toString();
            this.positionX = cObject.position.X;
            this.positionY = cObject.position.Y;
            this.rotation = cObject.rotation;

            if(hasValue(cSpawner))
                this.spawnerId = cSpawner.identifier.toString();
            else
                this.spawnerId = String.empty;
        }
    }

    export class SynchroniseArgs {
        ///
        /// LOCAL
        ///
        public objectId: string[];
        public positionX: number[];
        public positionY: number[];
        public rotation: number[];

        constructor(liObjects: GameObject[]) {
            this.objectId = [];
            this.positionX = []
            this.positionY = []
            this.rotation = [];

            for(let i = 0; i < liObjects.length; i++) {
                this.objectId.push(liObjects[i].identifier.toString());
                this.positionX.push(liObjects[i].position.X);
                this.positionY.push(liObjects[i].position.Y);
                this.rotation.push(liObjects[i].rotation);
            }
        }
    }

    export class ObjectDestroyedArgs {
        ///
        /// LOCAL
        ///
        public objectId: string;
        public scrapId: string[];
        public scrapX: number[];
        public scrapY: number[];
        public scrapRotation: number[];

        constructor(gId: Guid, liScrap: GameObject[]) {
            this.objectId = gId.toString();

            this.scrapId = [];
            this.scrapX = []
            this.scrapY = []
            this.scrapRotation = [];

            for(let i = 0; i < liScrap.length; i++) {
                this.scrapId.push(liScrap[i].identifier.toString());
                this.scrapX.push(liScrap[i].position.X);
                this.scrapY.push(liScrap[i].position.Y);
                this.scrapRotation.push(liScrap[i].rotation);
            }
        }
    }

    export class PlayerHandshakeArgs {

        ///
        /// LOCAL
        ///
        public identifier: string;
        public shipIdentifier: string;
        public teamIdentifier: string;
        public objects: string[];
        public objectTypes: ObjectType[];
        public scrapData: any[];
        public positionX: number[];
        public positionY: number[];
        public asteroidData: any[];

        constructor(gId: Guid, gShipId: Guid, gTeam: Guid, liGameObjects: GameObject[]) {
            this.identifier = gId.toString();
            this.shipIdentifier = gShipId.toString();
            this.teamIdentifier = gTeam.toString();

            this.objects = [];
            this.objectTypes = [];
            this.scrapData = [];
            this.asteroidData = [];
            this.positionX = [];
            this.positionY = [];

            for(let i =0 ; i < liGameObjects.length; i++){
                this.objects.push(liGameObjects[i].identifier.toString());

                let aObject: any = liGameObjects[i];
                let eType: ObjectType = GameObject.GetType(aObject);

                // Scrap is special and needs more information
                if(aObject instanceof Scrap){
                    let cComponent: Components.Component = aObject.components[0];

                    this.scrapData.push({
                        team: aObject.team,
                        type: cComponent.type,
                        mirror: cComponent.isMirror,
                        scale: cComponent.scale,
                        xOffset: cComponent.offset.X,
                        yOffset: cComponent.offset.Y
                    });
                }

                if(aObject instanceof Asteroid) {
                    let cAsteroid: Asteroid = aObject;

                    this.asteroidData.push({
                        radius: cAsteroid.radius,
                        outline: JSON.stringify(cAsteroid.outline)
                    });
                }

                this.objectTypes.push(eType);
                this.positionX.push(liGameObjects[i].position.X);
                this.positionY.push(liGameObjects[i].position.Y);
            }
        }
    }

    export class PlayerConnectedArgs {
        
        ///
        /// LOCAL
        ///
        public identifier: string;
        public shipIdentifier: string;
        public teamIdentifier: string;

        constructor(gId: Guid, gShip: Guid, gTeam: Guid){
            this.identifier = gId.toString();
            this.shipIdentifier = gShip.toString();
            this.teamIdentifier = gTeam.toString();
        }
    }

    export class PlayerDisconnectedArgs {
        
        ///
        /// LOCAL
        ///
        public identifier: string;

        constructor(gId: Guid){
            this.identifier = gId.toString();
        }

    }
}