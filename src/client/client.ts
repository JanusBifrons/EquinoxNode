/// <reference path="../game/game.ts" />

namespace FireHare.Asteroids {
    export class Client {

        private _cCanvas: Canvas;
        private _cGame: Game;
        private _cSocket: SocketIO.Socket;
        private _cPlayer: LocalPlayer;
        private _liPlayers: Player[];

        constructor(cSocket: SocketIO.Socket, cSAT: any) {
            Timer.Init();

            this._cSocket = cSocket;

            let cCanvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

            let cContext = cCanvas.getContext("2d") as CanvasRenderingContext2D;

            this._cCanvas = new Canvas(cContext);

            this._cSocket.on('disconnect', this.onServerDisconnected.bind(this));
            this._cSocket.on(Messages.PlayerHandshake, this.onPlayerHandshake.bind(this));
            this._cSocket.on(Messages.PlayerConnected, this.onPlayerConnected.bind(this));
            this._cSocket.on(Messages.PlayerDisconnected, this.onPlayerDisconnect.bind(this));
            this._cSocket.on(Messages.Synchronise, this.onSynchronise.bind(this));
            this._cSocket.on(Messages.ObjectDestroyed, this.onObjectDestroyed.bind(this));
            this._cSocket.on(Messages.ObjectSpawned, this.onObjectSpawned.bind(this));
            this._cSocket.on(Messages.ObjectDamaged, this.onObjectDamaged.bind(this));

            this._liPlayers = [];

            this._cGame = new Game();

            this.onRequestAnimationFrame();
        }

        ///
        /// PRIVATE
        ///

        private getPlayer(gPlayer: Guid): Player {
            for(let i = 0; i < this._liPlayers.length; i++){
                if(this._liPlayers[i].identifier.equals(gPlayer))
                    return this._liPlayers[i];
            }
        }

        ///
        /// EVENT HANDLERS
        ///

        private onServerDisconnected() {
            window.location.href = window.location.href;
        }

        private onObjectDamaged(cArgs: Args.ObjectDamagedArgs) {
            this._cGame.damageObject(cArgs);
        }

        private onObjectSpawned(cArgs: Args.ObjectSpawnedArgs) {
            this._cGame.spawnObject(cArgs);
        }

        private onObjectDestroyed(cArgs: Args.ObjectDestroyedArgs) {
            this._cGame.destroyObject(cArgs);
        }

        private onSynchronise(cArgs: Args.SynchroniseArgs) {
            this._cGame.synchronise(cArgs);
        }

        private onPlayerHandshake(cArgs: Args.PlayerHandshakeArgs) {
            Log.AddItem("Player handshake received");

            let gId: Guid = new Guid(cArgs.shipIdentifier);

            this._cPlayer = new LocalPlayer(gId, new Guid(cArgs.shipIdentifier), new Guid(cArgs.teamIdentifier));

            this._cPlayer.accellerate.addHandler(() => {
                this._cSocket.emit(Messages.PlayerAction, new Args.PlayerActionArgs(gId, PlayerAction.Accellerate));
            });

            this._cPlayer.decellerate.addHandler(() => {
                this._cSocket.emit(Messages.PlayerAction, new Args.PlayerActionArgs(gId, PlayerAction.Decellerate));
            });

            this._cPlayer.turnToPort.addHandler(() => {
                this._cSocket.emit(Messages.PlayerAction, new Args.PlayerActionArgs(gId, PlayerAction.TurnToPort));
            });

            this._cPlayer.turnToStarboard.addHandler(() => {
                this._cSocket.emit(Messages.PlayerAction, new Args.PlayerActionArgs(gId, PlayerAction.TurnToStarboard));
            });

            this._cPlayer.selfDestruct.addHandler(() => {
                this._cSocket.emit(Messages.PlayerAction, new Args.PlayerActionArgs(gId, PlayerAction.SelfDestruct));
            });

            this._cPlayer.fired.addHandler(() => {
                this._cSocket.emit(Messages.PlayerAction, new Args.PlayerActionArgs(gId, PlayerAction.Fire));
            });

            this._cGame.addGameObject(this._cPlayer.ship);

            for(let i =0 ; i < cArgs.objects.length; i++) {
                let gId: Guid = new Guid(cArgs.objects[i]);
                let cPosition: Vector = new Vector(cArgs.positionX[i], cArgs.positionY[i]);

                switch(cArgs.objectTypes[i]){
                    case ObjectType.Ship:
                        let cShip: Ship = new Havok();
                        cShip.identifier = gId;
                        cShip.position = cPosition;
    
                        this._cGame.addGameObject(cShip);
                        break;

                    case ObjectType.Laser:
                        let cLaser: Laser = new Laser();
                        cLaser.identifier = gId;
                        cLaser.position = cPosition;

                        this._cGame.addGameObject(cLaser);
                        break;

                    case ObjectType.Scrap:
                        let aData: any = cArgs.scrapData.splice(0, 1)[0];

                        let gTeam: Guid = new Guid(aData['team']);

                        let cScrap: Scrap = new Scrap(gTeam, Components.Component.CreateComponent(aData['type'], aData['mirror'], aData['scale'], new Vector(aData['xOffset'], aData['yOffset'])), Vector.Zero);
                        cScrap.identifier = gId;
                        cScrap.position = cPosition;

                        this._cGame.addGameObject(cScrap);

                        break;
                }
            }
        }

        private onPlayerConnected(cArgs: Args.PlayerConnectedArgs) {
            Log.AddItem(String.format("Player connected ({0}).", cArgs.identifier));

            let cPlayer: Player = new Player(new Guid(cArgs.identifier), new Guid(cArgs.shipIdentifier), new Guid(cArgs.teamIdentifier));

            this._liPlayers.push(cPlayer);            

            this._cGame.addGameObject(cPlayer.ship);
        }

        private onPlayerDisconnect(cArgs: Args.PlayerDisconnectedArgs) {
            let cPlayer: Player = this.getPlayer(new Guid(cArgs.identifier));

            if(!hasValue(cPlayer))  
                return;

            this._cGame.removeGameObject(cPlayer.ship.identifier);

            Log.AddItem("Player disconnected.");
        }

        private onRequestAnimationFrame() {
            Timer.TIMER().update();

            Log.LOG().update();

            this._cCanvas.update();
            
            // Clear the canvas back to black
            this._cCanvas.clear();
            
            if(Input.IsKeyDown(Keys.NumpadPlus)) {
                Camera.ZoomIn();
            }            

            if(Input.IsKeyDown(Keys.NumpadMinus)) {
                Camera.ZoomOut();
            }            

            if(hasValue(this._cPlayer)){
                District.drawGrid(this._cCanvas, this._cPlayer.ship.position);
                
                this._cGame.update();
                this._cPlayer.update();

                //this._cCanvas.moveTo(this._cGame.gameObjects[0].position);
                //this._cCanvas.moveTo(this._cPlayer.ship.position);

                this._cPlayer.draw(this._cCanvas);

                this._cGame.draw(this._cCanvas);
                
            }
            
            // Draw the log on top of everything
            Log.LOG().draw(this._cCanvas);

            Input.Update();

            window.requestAnimationFrame(this.onRequestAnimationFrame.bind(this));
        }
    }
}