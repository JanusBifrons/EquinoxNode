namespace FireHare {
    export class LogItem {

        ///
        /// LOCAL
        ///
        private _sMessage: string;
        private _cPosition: Vector;


        constructor(sMessage: string, cPosition: Vector = Vector.Zero) {
            this._sMessage = sMessage;
            this._cPosition = cPosition;
        }

        ///
        /// PUBLIC
        ///

        private update() {
            // TODO: Fading...
        }


        ///
        /// PROPERTIES
        ///

        get message(): string {
            return this._sMessage;
        }

        get position(): Vector {
            return this._cPosition;
        }
    }
}   