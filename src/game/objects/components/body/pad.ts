namespace FireHare.Equinox.Components {
    export class Pad extends Component {

        public setType() {
            this._eType = Components.Pad;
        }

        ///
        /// PROTECTED
        ///

        protected createOutline() {
            this._liOutline = [];
            this._liOutline.push(new Vector(2, -5));
            this._liOutline.push(new Vector(10, -7));
            this._liOutline.push(new Vector(20, -12));
            this._liOutline.push(new Vector(25, -10));
            this._liOutline.push(new Vector(27, -5));
            this._liOutline.push(new Vector(20, 0));
            this._liOutline.push(new Vector(0, 0));
        }

        protected afterDraw(cCanvas: Canvas) {
            this.beginDraw(cCanvas);

            cCanvas.setStrokeColour(Colour.Black);	
            cCanvas.setFillColour(this._cSecondaryColour);
            
            // Highlight
            cCanvas.context.beginPath();
            cCanvas.context.moveTo(10, 0);
            cCanvas.context.lineTo(23, -11);
            cCanvas.context.lineTo(20, -12);
            cCanvas.context.lineTo(10, -7);
            cCanvas.context.lineTo(2, -5);
            cCanvas.context.lineTo(0, 0);
            cCanvas.context.closePath();	
            cCanvas.context.stroke();
            cCanvas.context.fill();

            this.endDraw(cCanvas);
        }
    }
}