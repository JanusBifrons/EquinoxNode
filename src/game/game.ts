namespace FireHare.Equinox {
    export class Game {

        ///
        /// LOCAL
        ///
        private _liGameObjects: GameObject[];
        private _cCollisionManager: CollisionManager;

        ///
        /// EVENTS
        ///

        public objectDestroyed: Event;
        public objectSpawned: Event;
        public objectDamaged: Event;

        constructor() {
            this._cCollisionManager = new CollisionManager();

            this._liGameObjects = [];

            this.objectDestroyed = new Event();
            this.objectSpawned = new Event();
            this.objectDamaged = new Event();
        }

        ///
        /// PRIVATE
        ///

        private getGameObject(gId: Guid): GameObject {
            let cObject: GameObject;

            for(let i = 0; i < this._liGameObjects.length; i++){
                if(this._liGameObjects[i].identifier.equals(gId))
                    cObject = this._liGameObjects[i];
            }

            return cObject;
        }

        private getTeamObjects(gTeam: Guid): GameObject[] {
            let liObjects: GameObject[] = [];

            for(let i = 0; i < this._liGameObjects.length; i++){
                if(this._liGameObjects[i].team.equals(gTeam))
                    liObjects.push(this._liGameObjects[i]);
            } 

            return liObjects;
        }

        private checkForCollisions(cObject: GameObject, liObjects: GameObject[]) {
            for(let i = 0; i < liObjects.length; i++) {
                let cOtherObject: GameObject = liObjects[i];

                if(cObject === cOtherObject)
                    continue;

                if(!cObject.isAlive)
                    return;

                if(!cOtherObject.isAlive)
                    continue;

                if(cObject.team.equals(cOtherObject.team))
                    return;    
                
                if(this._cCollisionManager.collisionCheck(cObject, cOtherObject)) {

                    let eType: ObjectType = GameObject.GetType(cObject);
                    let eOtherType: ObjectType = GameObject.GetType(cOtherObject);
    
                    if(eType == ObjectType.Laser || eOtherType == ObjectType.Laser){
                        cObject.applyDamage(10);
                        cOtherObject.applyDamage(10);
    
                        if(eType != ObjectType.Laser){
                            this.objectDamaged.raise(this, new Args.ObjectDamagedArgs(cObject.identifier, 10));
                            cOtherObject.destroy();
                        }
                            
    
                        if(eOtherType != ObjectType.Laser) {
                            this.objectDamaged.raise(this, new Args.ObjectDamagedArgs(cOtherObject.identifier, 10));
                            cObject.destroy();
                        }
                    }

                    continue;
                }
            }
        }

        ///
        /// PUBLIC
        ///

        public generateShips() {
            let cShip: Havok = new Havok(Guid.NewGuid());

            this.addGameObject(cShip);
        }

        public generateAsteroids(nSize: number = 1) {
            this.addGameObjects(Asteroid.GenerateAsteroidField(nSize));
        }

        public generateScrap() {
            let cShip: Havok = new Havok(Guid.NewGuid());

            this.addGameObject(cShip);

            cShip.destroy();
        }

        public applyAction(cArgs: Args.PlayerActionArgs) {
            let cShip: Ship = this.getGameObject(new Guid(cArgs.identifier)) as Ship;

            if(!hasValue(cShip))
                return;

            switch(cArgs.action) {
                case PlayerAction.Accellerate:
                    cShip.accellerate();
                    break;

                case PlayerAction.Decellerate:
                    cShip.decellerate();
                    break;

                case PlayerAction.TurnToPort:
                    cShip.turnToPort();
                    break;

                case PlayerAction.TurnToStarboard:
                    cShip.turnToStarboard();
                    break;

                case PlayerAction.Fire:
                    cShip.fire();
                    break;

                case PlayerAction.SelfDestruct:
                    cShip.destroy();
                    break;
            }
        }

        public addGameObjects(liGameObject: GameObject[]) {
            for(let i = 0; i < liGameObject.length; i++) {
                this.addGameObject(liGameObject[i]);
            }
        }

        public addGameObject(cGameObject: GameObject) { 
            cGameObject.destroyed.addHandler(() => {
                this.objectDestroyed.raise(this, new Args.ObjectDestroyedArgs(cGameObject.identifier, Scrap.FromGameObject(cGameObject)));
            });

            if(cGameObject instanceof Ship) {
                cGameObject.fired.addHandler(() => {
                    let cLaser: Laser = Laser.FromShip(cGameObject);

                    this.objectSpawned.raise(this, new Args.ObjectSpawnedArgs(ObjectType.Laser, cLaser, cGameObject));
                });
            }

            this._liGameObjects.push(cGameObject);
        }

        public removeGameObject(gId: Guid) {
            let cObject: GameObject = this.getGameObject(gId);

            if(hasValue(cObject))
                this._liGameObjects.remove(cObject);
            
        }

        public removeTeam(gTeam: Guid) {
            let liObjects: GameObject[] = this.getTeamObjects(gTeam);

            for(let i = 0; i < liObjects.length; i++){
                this.removeGameObject(liObjects[i].identifier);
            }
        }

        public synchronise(cArgs: Args.SynchroniseArgs) {
            for(let i =0 ; i < cArgs.objectId.length; i++) {
                let cObject: GameObject = this.getGameObject(new Guid(cArgs.objectId[i]));
                let cPosition: Vector = new Vector(cArgs.positionX[i], cArgs.positionY[i]);

                if(!hasValue(cObject))
                    continue;

                cObject.position = cPosition;
                cObject.rotation = cArgs.rotation[i];
            }
        }

        public damageObject(cArgs: Args.ObjectDamagedArgs) {
            let cObject: GameObject = this.getGameObject(new Guid(cArgs.identifier));

            if(!hasValue(cObject)) {
                console.log("Object does not exist!");
                return;
            }

            cObject.applyDamage(cArgs.damage);
        }

        public destroyObject(cArgs: Args.ObjectDestroyedArgs) {
            let cObject: GameObject = this.getGameObject(new Guid(cArgs.objectId));

            if(!hasValue(cObject)) {
                console.log("Object does not exist!");
                return;
            }

            if(GameObject.GetType(cObject) === ObjectType.Ship) {
                this.addGameObjects(Scrap.FromArgs(cObject, cArgs));
            }

            this.removeGameObject(cObject.identifier);
        }

        public spawnObject(cArgs: Args.ObjectSpawnedArgs) {
            let cObject: GameObject;

            switch(cArgs.objectType) {
                case ObjectType.Laser:
                    let cShip: Ship = this.getGameObject(new Guid(cArgs.spawnerId)) as Ship;

                    if(!hasValue(cShip))
                        return;

                    cObject = Laser.FromShip(cShip);
                    cObject.identifier = new Guid(cArgs.objectId);
                    break;

                    case ObjectType.Asteroid:
                    
                    break;
            }

            this.addGameObject(cObject);
        }

        public update() {
            for(let i = 0; i < this._liGameObjects.length; i++) {
                let cGameObject: GameObject = this._liGameObjects[i];

                if(!cGameObject.isAlive){
                    this._liGameObjects.remove(cGameObject);
                    continue;
                }

                cGameObject.update();
            }

            Log.AddStat(String.format("Game Objects: {0}", this._liGameObjects.length));
        }

        public draw(cCanvas: Canvas) {
            cCanvas.moveToWorldSpace();

            for(let i = 0; i < this._liGameObjects.length; i++) {
                let cGameObject: GameObject = this._liGameObjects[i];

                cGameObject.draw(cCanvas);
            }

            cCanvas.moveToScreenSpace();
        }

        public reset() {
            this._liGameObjects.clear();
        }

        
        public collisionDetection() {
            let liObjects: GameObject[] = this._liGameObjects.slice();

            for(let i = 0; i < this._liGameObjects.length; i++){
                let cObjectA: GameObject = this._liGameObjects[i];

                if(!cObjectA.isAlive)
                    continue;                

                this.checkForCollisions(cObjectA, liObjects);

                // TODO: Can probably remove cObjectA from the liObjects array here (T16)
            }
        }

        ///
        /// PROPERTIES
        ///

        get gameObjects(): GameObject[] {
            return this._liGameObjects;
        }
    }
}