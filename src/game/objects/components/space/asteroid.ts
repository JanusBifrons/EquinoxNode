namespace FireHare.Asteroids.Components {
    export class Asteroid extends Component {

        private _liAsteroidVectors: Vector[];
        private _nRadius: number;

        constructor(nRadius: number, liOutline: Vector[] = []) {
            super(Vector.Zero);

            this._nRadius = nRadius;

            this._liAsteroidVectors = [];
            this._bUpdateCenter = false;

            if(liOutline.isEmpty()) {
                this.generateVectors();
            }
            else {
                this._liOutline = liOutline;
            }
        }

        ///
        /// PRIVATE
        ///

        private generateVectors() {
            let liVerts: number[] = this.generateVerts();

            for(var i = 0; i < liVerts.length; i++)
            {
                var nX = ((this._nRadius * 0.75) * Math.cos(liVerts[i]));
                var nY = ((this._nRadius * 0.75) * Math.sin(liVerts[i]));
                
                this._liOutline.push(new Vector(nX, nY));
            }
        }

        private generateVerts(): number[] {
            let liVerts: number[] = [];
            const nNumberOfVerts: number = (Math.random() * 6) + 10;
        
            for(var i = 0; i < nNumberOfVerts; i++)
            {
                liVerts.push(Math.random() * (Math.PI * 2));
            }
            
            // Sort from lowest to highest
            liVerts.sort((a, b) => {
                return a - b;
            });

            return liVerts;
        }

        ///
        /// PUBLIC
        ///

        public setType() {
            this._eType = Components.Asteroid;
        }

        public draw(cCanvas: Canvas) {
            super.draw(cCanvas, Colour.Grey);
        }

        ///
        /// PROTECTED
        ///

        protected createOutline() {
            // EMPTY

            // Outline never changes for asteroid!
        }

        protected afterDraw(cCanvas: Canvas) {
            this.beginDraw(cCanvas);

            this.endDraw(cCanvas);
        }
    }
}