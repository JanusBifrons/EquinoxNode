/// <reference path="../game/util/messages.ts" />
/// <reference path="../game/player/player.ts" />
/// <reference path="../game/player/serverPlayer.ts" />
/// <reference path="../game/util/args.ts" />
/// <reference path="../core/util/guid.ts" />
/// <reference path="../core/util/common.ts" />
/// <reference path="../game/game.ts" />
/// <reference path="../core/util/string.ts" />
/// <reference path="../core/util/event.ts" />
/// <reference path="../core/util/timer.ts" />

/// DEBUG
/// <reference path="../game/objects/scrap.ts" />
/// <reference path="../game/collisionManager.ts" />

global["SAT"] = require('SAT');

namespace FireHare.Asteroids {
    export class Server {
        private _cExpress = require('express');
        private _cApp = this._cExpress();
        private _cHttp = require('http').Server(this._cApp);
        private _cPath = require('path');
        private _cSocketServer = require('socket.io')(this._cHttp);

        private _liPlayers: ServerPlayer[];
        private _liSockets: SocketIO.Socket[];
        private _cGame: Game;

        constructor() {
            Timer.Init();
            this._liPlayers = [];
            this._liSockets = [];
            this._cGame = new Game();

            // Send everything in the client directory of the dist folder
            this._cApp.use(this._cExpress.static(this._cPath.join(__dirname + '/../client')));

            this._cApp.get('/', (cRequest, cResponse) => {
                cResponse.sendFile(this._cPath.join(__dirname + '/../client/index.html'));
            });

            this._cHttp.listen(5000, () => {
                console.log("Listening on *:5000");
            });

            this._cSocketServer.on('connection', this.onPlayerConnection.bind(this));

            this._cGame.objectDestroyed.addHandler(this.onObjectDestroyed.bind(this));
            this._cGame.objectSpawned.addHandler(this.onObjectSpawned.bind(this));
            this._cGame.objectDamaged.addHandler(this.onObjectDamaged.bind(this));

            this._cGame.generateScrap();
        }

        ///
        /// PUBLIC
        ///

        public update() {
            Timer.TIMER().update();

            if(hasValue(this._cGame)) {
                this._cGame.update();
                this._cGame.collisionDetection();

                this.synchronise();
            }
        }

        ///
        /// PRIVATE
        ///

        private synchronise() {
            this._cSocketServer.emit(Messages.Synchronise, new Args.SynchroniseArgs(this._cGame.gameObjects));
        }

        ///
        /// EVENT HANDLERS
        ///

        private onObjectDamaged(sender: any, cArgs: Args.ObjectDamagedArgs) {
            this._cGame.damageObject(cArgs);

            this._cSocketServer.emit(Messages.ObjectDamaged, cArgs);
        }

        private onObjectSpawned(sender: any, cArgs: Args.ObjectSpawnedArgs) {
            this._cGame.spawnObject(cArgs);

            this._cSocketServer.emit(Messages.ObjectSpawned, cArgs);
        }

        private onObjectDestroyed(sender: any, cArgs: Args.ObjectDestroyedArgs) {
            this._cGame.destroyObject(cArgs);

            this._cSocketServer.emit(Messages.ObjectDestroyed, cArgs);
        }

        private onPlayerConnection(cSocket: SocketIO.Socket) {
            console.log("Player connected");

            let cPlayer: ServerPlayer = new ServerPlayer(cSocket);

            this._liPlayers.push(cPlayer);
            this._liSockets.push(cSocket);

            // Tell all existing players about this new one
            cSocket.broadcast.emit(Messages.PlayerConnected, new Args.PlayerConnectedArgs(cPlayer.identifier, cPlayer.ship.identifier, cPlayer.team));

            // Tell this new player about the existing ones
            cSocket.emit(Messages.PlayerHandshake, new Args.PlayerHandshakeArgs(cPlayer.identifier, cPlayer.ship.identifier, cPlayer.team, this._cGame.gameObjects));

            this._cGame.addGameObject(cPlayer.ship);

            cSocket.on('disconnect', this.onPlayerDisconnected.bind(this, cSocket));
            cSocket.on(Messages.PlayerAction, this.onPlayerAction.bind(this));
        }

        private onPlayerAction(cArgs: Args.PlayerActionArgs) {
            this._cGame.applyAction(cArgs);
        }

        private onPlayerDisconnected(cSocket: SocketIO.Socket) {
            console.log("Player disconnected");

            let cPlayer: ServerPlayer = this._liPlayers[this._liSockets.indexOf(cSocket)];
            cPlayer.socket.broadcast.emit(Messages.PlayerDisconnected, new Args.PlayerDisconnectedArgs(cPlayer.identifier));

            this._cGame.removeGameObject(cPlayer.ship.identifier);
        }
    }
}