namespace FireHare {
    export class Colour {

        ///
        /// LOCAL
        ///
        private _nR: number;
        private _nG: number;
        private _nB: number;
        private _nA: number;

        constructor(nR: number = 255, nG: number = 255, nB: number = 255, nA: number = 255) {
            this._nR = nR;
            this._nG = nG;
            this._nB = nB;
            this._nA = nA;
        }

        ///
        /// STATIC
        ///

        static get White(): Colour {
            return new Colour(255, 255, 255);
        }

        static get Black(): Colour {  
            return new Colour(0, 0, 0);
        }

        static get Grey(): Colour {
            return new Colour(100, 100, 100);
        }

        static get Red(): Colour {
            return new Colour(255, 0, 0);
        }

        static get Green(): Colour {
            return new Colour(0, 255, 0);
        }

        static get Blue(): Colour {
            return new Colour(0, 0, 255);
        }

        ///
        /// PUBLIC
        ///

        public toString(): string {
            return String.format("rgba({0}, {1}, {2}, {3}", this._nR, this._nG, this._nB, this._nA);
        }

        ///
        /// PROPERTIES
        ///

        get r(): number{
            return this._nR;
        }

        set r(nR: number){
            this._nR = nR;
        }

        get g(): number{
            return this._nG;
        }

        set g(nG: number){
            this._nG = nG;
        }

        get b(): number{
            return this._nB;
        }

        set b(nB: number){
            this._nB = nB;
        }

        get a(): number{
            return this._nA;
        }

        set a(nA: number){
            this._nA = nA;
        }
    }
}