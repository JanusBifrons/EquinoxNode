namespace FireHare.Asteroids.Components {
    export class Cockpit extends Component {

        public setType() {
            this._eType = Components.Cockpit;
        }

        ///
        /// PROTECTED
        ///

        protected createOutline() {
            this._liOutline = [];
            this._liOutline.push(new Vector(-1, 1));
            this._liOutline.push(new Vector(-3, 2));
            this._liOutline.push(new Vector(-5, 3));
            this._liOutline.push(new Vector(-7, 4));
            this._liOutline.push(new Vector(-15, 4));
            this._liOutline.push(new Vector(-18, 6));
            this._liOutline.push(new Vector(-25, 8));
            this._liOutline.push(new Vector(-25, -8));
            this._liOutline.push(new Vector(-18, -6));
            this._liOutline.push(new Vector(-15, -4));
            this._liOutline.push(new Vector(-7, -4));
            this._liOutline.push(new Vector(-5, -3));
            this._liOutline.push(new Vector(-3, -2));
            this._liOutline.push(new Vector(-1, -1));
            this._liOutline.push(new Vector(0, 0));
        }

        protected afterDraw(cCanvas: Canvas) {
            this.beginDraw(cCanvas);

            cCanvas.setStrokeColour(Colour.Black);
            cCanvas.setFillColour(this._cSecondaryColour);
	
            // Tip Highlight
            cCanvas.context.beginPath();
            cCanvas.context.moveTo(0, 0);
            cCanvas.context.lineTo(-1, -1);
            cCanvas.context.lineTo(-3, -2);
            cCanvas.context.lineTo(-5, -3);
            cCanvas.context.lineTo(-7, -4);
            cCanvas.context.lineTo(-9, -4);
            cCanvas.context.lineTo(-9, 4);
            cCanvas.context.lineTo(-7, 4);
            cCanvas.context.lineTo(-5, 3);
            cCanvas.context.lineTo(-3, 2);
            cCanvas.context.lineTo(-1, 1);
            cCanvas.context.closePath();	
            cCanvas.context.stroke();
            cCanvas.context.fill();
            
            //cCanvas.setStrokeColour(Colour.Black);
            
            // Tip Highlight Strip
            cCanvas.context.beginPath();
            cCanvas.context.moveTo(-11, -4);
            cCanvas.context.lineTo(-11, 4);
            cCanvas.context.lineTo(-12, 4);
            cCanvas.context.lineTo(-12, -4);
            cCanvas.context.closePath();	
            cCanvas.context.stroke();
            cCanvas.context.fill();

            cCanvas.setStrokeColour(Colour.Black);
            cCanvas.setFillColour(Colour.Green);
            
            // Actual Cockpit
            cCanvas.context.save();
            cCanvas.context.scale(1.75, 1);
            cCanvas.context.beginPath();
            cCanvas.context.arc(-14, 0, 5, 0, Math.PI * 2);
            cCanvas.context.stroke();
            cCanvas.context.fill();
            cCanvas.context.closePath();
            cCanvas.context.restore();

            cCanvas.setStrokeColour(Colour.Black);
            cCanvas.setStrokeColour(this._cSecondaryColour);
            
            // Actual Cockpit Tail Strips
            cCanvas.context.beginPath();
            cCanvas.context.moveTo(-25, -5);
            cCanvas.context.lineTo(-30, 0);
            cCanvas.context.lineTo(-25, 5);
            cCanvas.context.lineTo(-27, 5);
            cCanvas.context.lineTo(-35, 0);
            cCanvas.context.lineTo(-27, -5);
            cCanvas.context.closePath();	
            cCanvas.context.stroke();
            cCanvas.context.fill();

            this.endDraw(cCanvas);
        }
    }
}