namespace FireHare.Equinox.Components {
    export class Laser extends Component {

        ///
        /// LOCAL
        ///

        private _nWidth: number = 4;
        private _nHeight: number = 2;

        public setType() {
            this._eType = Components.Cockpit;
        }

        ///
        /// PROTECTED
        ///

        protected createOutline() {
            this._liOutline = [];
            this._liOutline.push(new Vector(-this._nWidth, this._nHeight));
            this._liOutline.push(new Vector(this._nWidth, this._nHeight));
            this._liOutline.push(new Vector(this._nWidth, -this._nHeight));
            this._liOutline.push(new Vector(-this._nWidth, -this._nHeight));
        }

        protected afterDraw(cCanvas: Canvas) {
            this.beginDraw(cCanvas);

            cCanvas.setStrokeColour(Colour.Black);
            cCanvas.setFillColour(Colour.Red);
            
            // Actual Cockpit Tail Strips
            cCanvas.context.beginPath();
            cCanvas.context.moveTo(-this._nWidth, this._nHeight);
            cCanvas.context.lineTo(this._nWidth, this._nHeight);
            cCanvas.context.lineTo(this._nWidth, -this._nHeight);
            cCanvas.context.lineTo(-this._nWidth, -this._nHeight);
            cCanvas.context.closePath();	
            cCanvas.context.stroke();
            cCanvas.context.fill();

            this.endDraw(cCanvas);
        }
    }
}