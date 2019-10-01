namespace FireHare.Asteroids.Components {
    export abstract class Component {

        ///
        /// PRIVATE
        ///
        private _cOffset: Vector;
        private _cPosition: Vector;
        private _nRotation: number;
        private _cCenter: Vector;
        private _nScale: number;
        private _bMirror: boolean;
        

        ///
        /// PROTECTED
        ///
        protected _eType: Components;
        protected _liOutline: Vector[];
        protected _cPrimaryColour: Colour;
        protected _cSecondaryColour: Colour;

        constructor(cOffset: Vector, bMirror: boolean = false, nScale: number = 1) {
            this._eType = Components.Unknown;

            this._cOffset = cOffset;

            this._liOutline = [];
            this._cPrimaryColour = Colour.White;
            this._cSecondaryColour = Colour.Grey;

            this._cPosition = new Vector(0, 0);
            this._cCenter = new Vector(0, 0);
            this._nRotation = 0;
            this._nScale = nScale;
            this._bMirror = bMirror;

            this.setType();
        }

        abstract setType();

        ///
        /// PRIVATE
        ///

        private updateOffsets(cOwner: GameObject) {
            let nRotationOffset: number = Math.atan2(this._cOffset.Y, this._cOffset.X);
            nRotationOffset += cOwner.rotation;

            let nX: number = this._cOffset.magnitude * Math.cos(nRotationOffset);
            let nY: number = this._cOffset.magnitude * Math.sin(nRotationOffset);

            this._cPosition = new Vector(cOwner.position.X + nX, cOwner.position.Y + nY);
            this._nRotation = cOwner.rotation;
        }

        private updateCenter() {
            let nX: number = 0;
            let nY: number = 0;

            for(let i = 0; i < this._liOutline.length; i++) {
                let cOutline: Vector = this._liOutline[i];

                nX += cOutline.X;
                nY += cOutline.Y;
            }

            nX = nX / this._liOutline.length;
            nY = nY / this._liOutline.length;

            this._cCenter = new Vector(nX, nY);
        }

        private centerOutline() {
            let liAdjusted: Vector[] = [];

            for(let i = 0; i < this._liOutline.length; i++){
                let cPoint: Vector = this._liOutline[i];

                liAdjusted.push(cPoint.subtract(this._cCenter));
            }

            this._liOutline = liAdjusted;
        }

        private scaleOutline() {
            let liAdjusted: Vector[] = [];

            for(let i = 0; i < this._liOutline.length; i++){
                let cPoint: Vector = this._liOutline[i];

                liAdjusted.push(cPoint.multiply(this._nScale));
            }

            this._liOutline = liAdjusted;
        }

        private mirrorOutline() {
            let liMirror: Vector[] = [];
	
            for(var i = 0; i < this._liOutline.length; i++)
            {
                liMirror.push(new Vector(this._liOutline[i].X, this._liOutline[i].Y * -1));
            }
            
            let nIndex: number = this._liOutline.length;

            this._liOutline = [];
            
            // Reinput list from scratch
            for(var i = 0; i < liMirror.length; i++)
            {
                nIndex -= 1;
                
                this._liOutline.push(liMirror[nIndex]);
            }
        }

        ///
        /// PROTECTED
        ///

        protected beginDraw(cCanvas: Canvas, bMirror: boolean = this._bMirror, bCenter: boolean = true) {
            cCanvas.context.save();

            cCanvas.context.translate(this._cPosition.X, this._cPosition.Y);
            cCanvas.context.rotate(this._nRotation);

            if(bCenter)
                cCanvas.context.translate(-this._cCenter.X, -this._cCenter.Y);

            if(bMirror)
                cCanvas.context.scale(1, -1);

            cCanvas.context.scale(this._nScale, this._nScale);
        }

        protected endDraw(cCanvas: Canvas) {
            cCanvas.context.restore();
        }

        protected createOutline() {

        }

        protected afterDraw(cCanvas: Canvas) {
            
        }

        ///
        /// PUBLIC
        ///

        public update(cOwner: GameObject) {
            this.updateOffsets(cOwner);
            
            this.createOutline();

            if(this._bMirror){
                this.mirrorOutline();
            }

            this.scaleOutline();

            this.updateCenter();
            this.centerOutline();
        }

        public draw(cCanvas: Canvas) {
            cCanvas.changeContext(this._cPosition, this._nRotation);

            cCanvas.setStrokeColour(Colour.Black);

            cCanvas.drawPath(this._liOutline, true, Colour.White);

            cCanvas.restoreContext();

            this.afterDraw(cCanvas);
        }

        ///
        /// STATIC
        ///

        static CreateComponent(eType: Components, bMirror: boolean, nScale: number, cOffset: Vector): Component {
            let cComponent: Component;

            switch(eType) {
                case Components.Cockpit:
                    cComponent = new Cockpit(cOffset, bMirror, nScale);
                    break;

                case Components.Pad:
                    cComponent = new Pad(cOffset, bMirror, nScale);
                    break;

                case Components.Wing:
                    cComponent = new Wing(cOffset, bMirror, nScale);
                    break;

                case Components.RearWing:
                    cComponent = new RearWing(cOffset, bMirror, nScale);
                    break;
            }

            return cComponent;
        }

        ///
        /// PROPERTIES
        ///

        get position(): Vector {
            return this._cPosition;
        }

        get offset(): Vector {
            return this._cOffset;
        }

        set offset(cOffset: Vector) {
            this._cOffset = cOffset;
        }

        get rotation(): number {
            return this._nRotation;
        }

        get isMirror(): boolean {
            return this._bMirror;
        }

        get scale(): number {
            return this._nScale;
        }

        get type(): Components {
            return this._eType;
        }
    }
}