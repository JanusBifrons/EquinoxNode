
namespace FireHare.Equinox {
    export class Player {

        ///
        /// LOCAL
        ///
        private _gId: Guid;
        private _gTeam: Guid;
        protected _cShip: Ship;

        constructor(gId: Guid, gShipId: Guid, gTeam: Guid) {
            this._gId = gId;
            this._gTeam = gTeam;
            this._cShip = new Havok(this._gTeam);
            this._cShip.identifier = gShipId;
        }

        ///
        /// PUBLIC
        ///

        public update() {
        }

        public draw(cCanvas: Canvas) {
        }

        ///
        /// PROPERTIES
        ///

        get identifier(): Guid {
            return this._gId;
        }

        get ship(): Ship { 
            return this._cShip;
        }

        get team(): Guid {
            return this._gTeam;
        }
    }
}