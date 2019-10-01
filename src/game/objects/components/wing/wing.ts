namespace FireHare.Asteroids.Components {
    export class Wing extends Component {

        public setType() {
            this._eType = Components.Wing;
        }

        ///
        /// PROTECTED
        ///

        protected createOutline() {
            this._liOutline = [];
            this._liOutline.push(new Vector(-5, -32));
            this._liOutline.push(new Vector(0, -30));
            this._liOutline.push(new Vector(20, -15));
            this._liOutline.push(new Vector(30, -5));
            this._liOutline.push(new Vector(30, 0));
            this._liOutline.push(new Vector(0, 0));
        }

        protected afterDraw(cCanvas: Canvas) {
            this.beginDraw(cCanvas);

            cCanvas.setStrokeColour(Colour.Black);	
            cCanvas.setFillColour(this._cSecondaryColour);
            cCanvas.context.lineWidth = 1;
            
            // Highlight Line
            cCanvas.context.beginPath();
            cCanvas.context.moveTo(30, -3);
            cCanvas.context.lineTo(20, -13);
            cCanvas.context.lineTo(0, -28);
            cCanvas.context.lineTo(-5, -30);
            cCanvas.context.lineTo(-5, -32);
            cCanvas.context.lineTo(0, -30);
            cCanvas.context.lineTo(20, -15);
            cCanvas.context.lineTo(30, -5);
            cCanvas.context.closePath();	
            cCanvas.context.stroke();
            cCanvas.context.fill();
            
            cCanvas.setStrokeColour(Colour.Black);
            cCanvas.setFillColour(this._cSecondaryColour);
            
            // Larger Circle
            cCanvas.context.beginPath();
            cCanvas.context.arc(5, -6, 5, 0, 2 * Math.PI);
            cCanvas.context.fill();
            cCanvas.context.stroke();
            cCanvas.context.closePath();	
            
            // Smaller Circle
            cCanvas.context.beginPath();
            cCanvas.context.arc(5, -6, 3, 0, 2 * Math.PI);
            cCanvas.context.fill();
            cCanvas.context.stroke();
            cCanvas.context.closePath();	

            this.endDraw(cCanvas);
        }
    }
}