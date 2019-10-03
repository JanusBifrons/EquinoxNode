namespace FireHare.Asteroids.Components {
    export class Asteroid extends Component {

        private _liAsteroidPoints: Vector[];
        private _nRadius: number;

        constructor(nRadius: number) {
            super(Vector.Zero);

            this._nRadius = nRadius;

            this._liAsteroidPoints = [];
            this._bUpdateCenter = false;

            this.generatePoints();
        }

        ///
        /// PRIVATE
        ///

        private generatePoints() {
            const nNumberOfVerts: number = (Math.random() * 6) + 10;
            const liPoints: number[] = [];
        
            for(var i = 0; i < nNumberOfVerts; i++)
            {
                liPoints.push(Math.random() * (Math.PI * 2));
            }
            
            // Sort from lowest to highest
            liPoints.sort((a, b) => {
                return a - b;
            });
            
            for(var i = 0; i < liPoints.length; i++)
            {
                var nX = ((this._nRadius * 0.75) * Math.cos(liPoints[i]));
                var nY = ((this._nRadius * 0.75) * Math.sin(liPoints[i]));
                
                this._liAsteroidPoints.push(new Vector(nX, nY));
            }
        }

        ///
        /// PUBLIC
        ///

        public setType() {
            this._eType = Components.Asteroid;
        }

        ///
        /// PROTECTED
        ///

        protected createOutline() {
            this._liOutline = [];
            
            for(var i = 0; i < this._liAsteroidPoints.length; i++)
            {
                this._liOutline.push(this._liAsteroidPoints[i]);
            }
        }

        protected afterDraw(cCanvas: Canvas) {
            this.beginDraw(cCanvas);

            this.endDraw(cCanvas);
        }
    }
}