namespace FireHare.Equinox.Components {
    export class RearWing extends Component {

        public setType() {
            this._eType = Components.RearWing;
        }

        ///
        /// PROTECTED
        ///

        protected createOutline() {
            this._liOutline = [];
            this._liOutline.push(new Vector(-12, 0));
            this._liOutline.push(new Vector(-19, -26));
            this._liOutline.push(new Vector(-18, -33));
            this._liOutline.push(new Vector(0, -10));
        }

        protected afterDraw(cCanvas: Canvas) {
            this.beginDraw(cCanvas);

            cCanvas.setStrokeColour(Colour.Black);
            cCanvas.setFillColour(this._cSecondaryColour);
	
            // Highlight Line
            cCanvas.context.beginPath();
            cCanvas.context.moveTo(-8, -3);
            cCanvas.context.lineTo(-16, -26);
            cCanvas.context.lineTo(-15, -29);
            cCanvas.context.lineTo(-18, -33);
            cCanvas.context.lineTo(-19, -26);
            cCanvas.context.lineTo(-12, 0);
            cCanvas.context.closePath();	
            cCanvas.context.stroke();
            cCanvas.context.fill();
            
            // Smaller Highlight Line
            cCanvas.context.beginPath();
            cCanvas.context.moveTo(-1, -9);
            cCanvas.context.lineTo(-7, -16);
            cCanvas.context.lineTo(-6, -18);
            cCanvas.context.lineTo(0, -10);
            cCanvas.context.closePath();	
            cCanvas.context.stroke();
            cCanvas.context.fill();

            this.endDraw(cCanvas);
        }
    }
}