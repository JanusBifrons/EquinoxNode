/// <reference path="player.ts" />

namespace FireHare.Asteroids {
    export class ServerPlayer extends Player {

        ///
        /// LOCAL
        ///

        private _cSocket: SocketIO.Socket;

        constructor(cSocket: SocketIO.Socket) {
            super(Guid.NewGuid(), Guid.NewGuid(), Guid.NewGuid());

            this._cSocket = cSocket;
        }

        ///
        /// PROPERTIES
        ///

        get socket(): SocketIO.Socket {
            return this._cSocket;
        }
    }
}