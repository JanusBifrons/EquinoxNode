namespace FireHare.Equinox.Components {
    export class Shield extends Component {

        ///
        /// LOCAL
        ///
        private _nRadius: number;

        constructor(nRadius: number, cOffset: Vector = Vector.Zero, bMirror: boolean = false) {
            super(cOffset, bMirror, 1);

            this._nRadius = nRadius;
        }

        public setType() {
            this._eType = Components.Shield;
        }

        ///
        /// PROTECTED
        ///

        protected createOutline() {
        }

        protected afterDraw(cCanvas: Canvas) {
            //this.beginDraw(cCanvas);

            //cCanvas.changeContext(this._cPosition, this._nRotation);

            cCanvas.setStrokeColour(Colour.Blue);

            cCanvas.drawCircle(this.position, this._nRadius, Colour.Blue);

            //cCanvas.restoreContext();

            //this.endDraw(cCanvas);
        }

        get collisionItem(): CollisionItem {
            return new CollisionCircle(1, new SAT.Circle(this.position.toSAT(), this._nRadius));
        }
    }
}