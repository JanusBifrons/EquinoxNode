namespace FireHare {
    export class Canvas {

        ///
        /// LOCAL
        ///
        private _cContext: CanvasRenderingContext2D;

        constructor(cContext: CanvasRenderingContext2D) {
            this._cContext = cContext;

            this._cContext.canvas.height = window.innerHeight;
            this._cContext.canvas.width = window.innerWidth;

            Camera.INIT(cContext);

            Camera.CAMERA().zoomTo(2000);

            window.addEventListener("resize", (e: UIEvent) => {
                this._cContext.canvas.height = window.innerHeight;
                this._cContext.canvas.width = window.innerWidth;

                Camera.CAMERA().updateViewport();
            });
        }

        ///
        /// STATIC
        ///

        static get DEFAULT_COLOUR(): Colour {
            return Colour.White;
        }

        ///
        /// PUBLIC
        ///

        public update() {
            Camera.CAMERA().update();
        }

        /**
         * Clears the canvas back to the optional colour specified
         * @param cColour The colour you wish the canvas to clear to (default: black)
         */
        public clear(cColour: Colour = Colour.Black) {
            this._cContext.fillStyle = cColour.toString();
            this._cContext.fillRect(0, 0, this._cContext.canvas.width, this._cContext.canvas.height);
        }

        public setColour(cColour: Colour) {
            this._cContext.fillStyle = cColour.toString();
            this._cContext.strokeStyle = cColour.toString();
        }

        public setStrokeColour(cColour: Colour) {
            this._cContext.strokeStyle = cColour.toString();
        }

        public setFillColour(cColour: Colour) {
            this._cContext.fillStyle = cColour.toString();
        }

        public changeContext(cPosition: Vector, nRotation: number) {
            Camera.CAMERA().changeContext(cPosition, nRotation);
        }

        public restoreContext() {
            Camera.CAMERA().end();
        }

        public moveToWorldSpace() {
            Camera.CAMERA().begin();
        }

        public moveToScreenSpace() {
            Camera.CAMERA().end();
        }

        public moveTo(cPosition: Vector) {
            Camera.CAMERA().moveTo(cPosition);
        }

        public drawArc(cPosition: Vector, nRadius: number, nWidth: number, nStart: number, nEnd: number, cColour: Colour = Canvas.DEFAULT_COLOUR) {
            this._cContext.strokeStyle = cColour.toString();

            // Change line width
            let nLineWidth = this._cContext.lineWidth;

            this._cContext.lineWidth = nWidth;

            this._cContext.beginPath();
            this._cContext.arc(cPosition.X, cPosition.Y, nRadius, nStart, nEnd);
            this._cContext.stroke();
            this._cContext.closePath();

            // Reset line width
            this._cContext.lineWidth = nLineWidth;
        }

        public drawCircle(cPosition: Vector, nRadius: number, cColour: Colour = Canvas.DEFAULT_COLOUR) {
            this._cContext.strokeStyle = cColour.toString();

            this._cContext.beginPath();
            this._cContext.arc(cPosition.X, cPosition.Y, nRadius, 0, Math.PI * 2);
            this._cContext.stroke();
            this._cContext.closePath();
        }

        public drawText(sText: string, cPosition: Vector, cColour: Colour = Canvas.DEFAULT_COLOUR) {
            this._cContext.fillStyle = cColour.toString();

            this._cContext.font = '10px Verdana';
            this._cContext.fillText(sText, cPosition.X, cPosition.Y);
        }

        public drawBox(cPosition: Vector, nWidth: number, nHeight, cColour: Colour = Canvas.DEFAULT_COLOUR) {
            this._cContext.fillRect(cPosition.X, cPosition.Y, nWidth, nHeight);
        }

        public drawPath(liPoints: Vector[], bFill: boolean = true, cColour: Colour = Canvas.DEFAULT_COLOUR) {
            //this._cContext.strokeStyle = cColour.toString();
            this._cContext.fillStyle = cColour.toString();

            this._cContext.beginPath();

            this._cContext.moveTo(liPoints[0].X, liPoints[0].Y);

            for(let i = 1; i < liPoints.length; i++) {
                this._cContext.lineTo(liPoints[i].X, liPoints[i].Y);
            }

            this._cContext.closePath();
            this._cContext.stroke();

            if(bFill)
                this._cContext.fill();
        }

        ///
        /// PROPERTIES
        ///

        get context(): CanvasRenderingContext2D {
            return this._cContext;
        }

        get canvasWidth(): number {
            return this._cContext.canvas.width;
        }

        get canvasHeight(): number {
            return this._cContext.canvas.height;
        }

        get screenCenter(): Vector {
            return new Vector(this.canvasWidth / 2, this.canvasHeight / 2);
        }
    }
}