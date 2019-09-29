namespace FireHare {
    export class Vector {

        ///
        /// LOCAL
        ///
        private _nX: number;
        private _nY: number;

        constructor(nX: number, nY: number) {
            this._nX = nX;
            this._nY = nY;
        }

        ///
        /// STATIC
        ///

        static DirectionFromRotation(nRotation: number, nMagnitude: number = 1) {
            return new Vector(Math.cos(nRotation) * nMagnitude, Math.sin(nRotation) * nMagnitude);
        }

        static get Zero(): Vector {
            return new Vector(0, 0);
        }

        static Magnitude(cVector: Vector): number {
            return Math.sqrt(cVector.X * cVector.X + cVector.Y * cVector.Y);
        }

        static Distance(cVectorA: Vector, cVectorB: Vector): number {
            return Vector.Magnitude(new Vector(cVectorB.X - cVectorA.X, cVectorB.Y - cVectorA.Y));
        }

        static Unit(cVector: Vector): Vector {
            let nLength = Vector.Magnitude(cVector);
	
            let nX: number = cVector.X / nLength;
            let nY: number = cVector.Y / nLength;
            
            return new Vector(nX, nY);
        }

        static DirectionTo(cVectorFrom: Vector, cVectorTo: Vector): number {
            var nX = cVectorTo.X - cVectorFrom.X;
            var nY = cVectorTo.Y - cVectorFrom.Y;
            
            return Math.atan2(nY, nX);
        }

        static FromSAT(cVector: any): Vector {
            return new Vector(cVector.x, cVector.y);
        }

        ///
        /// PUBLIC
        ///

        public add(cVector: Vector): Vector {
            return new Vector(this._nX + cVector.X, this._nY + cVector.Y);
        }

        public subtract(cVector: Vector): Vector {
            return new Vector(this._nX - cVector.X, this._nY - cVector.Y);
        }

        public multiply(nMultiple: number) {
            return new Vector(this._nX * nMultiple, this._nY * nMultiple);
        }

        public equals(cVector: Vector): boolean {
            if(cVector.X == this.X && cVector.Y == this.Y)
                return true;

            return false;
        }

        public limit(nLimit: number) {
            if(this._nX >= nLimit)
                this._nX = nLimit;

            if(this._nX <= -nLimit)
                this._nX = -nLimit;

            if(this._nY >= nLimit)
                this._nY = nLimit;

            if(this._nY <= -nLimit)
                this._nY = -nLimit;
        }

        ///
        /// PROPERTIES
        ///

        get X(): number {
            return this._nX;
        }

        set X(nX: number) {
            this._nX = nX;
        }

        get Y(): number { 
            return this._nY;
        }

        set Y(nY: number) {
            this._nY = nY;
        }

        get magnitude(): number {
            return Math.sqrt(this.X * this.X + this.Y * this.Y);
        }

        get length(): number {
            return Math.atan2(this._nY, this._nX);
        }
    }
}