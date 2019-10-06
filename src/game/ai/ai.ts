namespace FireHare.Equinox {
    export class AI {

        ///
        /// LOCAL
        ///
        private _cShip: Ship;

        constructor(cShip: Ship) {
            this._cShip = cShip;
        }

        ///
        /// PUBLIC
        ///

        public update(liShips: Ship[]) {
            if(liShips.length === 0) {
                return;
            }

            let cTarget: Ship;

            for(const cShip of liShips) {
                if(cShip !== this._cShip) {
                    cTarget = cShip;
                }
            }

            if(!hasValue(cTarget)) {
                return;
            }

            let nDesiredRotation: number = Vector.DirectionTo(this._cShip.position, cTarget.position);

            if(this._cShip.rotation > nDesiredRotation){
                this._cShip.turnToPort();
            }
            else{
                this._cShip.turnToStarboard();
            }
        }
    }
}