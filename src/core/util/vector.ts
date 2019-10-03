namespace FireHare {
    export class Vector {

        constructor(public X: number, public Y: number) {
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

        static FromSAT(cVector: SAT.Vector): Vector {
            return new Vector(cVector.x, cVector.y);
        }

        ///
        /// PUBLIC
        ///

        public add(cVector: Vector): Vector {
            return new Vector(this.X + cVector.X, this.Y + cVector.Y);
        }

        public subtract(cVector: Vector): Vector {
            return new Vector(this.X - cVector.X, this.Y - cVector.Y);
        }

        public multiply(nMultiple: number): Vector {
            return new Vector(this.X * nMultiple, this.Y * nMultiple);
        }

        public equals(cVector: Vector): boolean {
            if(cVector.X == this.X && cVector.Y == this.Y)
                return true;

            return false;
        }

        public reverse(): Vector {
            return this.multiply(-1);
        }

        public limit(nLimit: number) {
            if(this.X >= nLimit)
                this.X = nLimit;

            if(this.X <= -nLimit)
                this.X = -nLimit;

            if(this.Y >= nLimit)
                this.Y = nLimit;

            if(this.Y <= -nLimit)
                this.Y = -nLimit;
        }

        public toSAT(): SAT.Vector {
            return new SAT.Vector(this.X, this.Y);
        }

        ///
        /// PROPERTIES
        ///

        get magnitude(): number {
            return Math.sqrt(this.X * this.X + this.Y * this.Y);
        }

        get length(): number {
            return Math.atan2(this.Y, this.X);
        }
    }
}