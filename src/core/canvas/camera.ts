namespace FireHare {
    export class Camera {

        ///
        /// SINGLETON
        ///

        static SINGLETON: Camera;
        static CAMERA(): Camera {
            return Camera.SINGLETON;
        }
        static INIT(cContext: CanvasRenderingContext2D) {           
            if(hasValue(Camera.SINGLETON))
                throw new Error("Can only have one instance of Camera");

            Camera.SINGLETON = new Camera(cContext);
        }

        ///
        /// LOCAL
        ///
        private _cLookAt: Vector;
        private _cContext: CanvasRenderingContext2D;
        private _nFieldOfView: number = Math.PI / 4.0;
        private _aViewport: any;
        private _nAspectRatio: number;
        private _nDistance: number = 2000.0;
        private _nDesiredDistance: number;
        private _nDistanceSpeed: number = 10;

        constructor(cContext: CanvasRenderingContext2D) {
            this._cContext = cContext;
            this._aViewport = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                width: 0,
                height: 0,
                scale: [1.0, 1.0]
            };

            this._cLookAt = new Vector(0, 0);
            this._nDesiredDistance = this._nDistance;

            this.updateViewport();
        }

        ///
        /// PUBLIC
        ///

        public update() {
            let nDistanceDifference: number = this._nDistance - this._nDesiredDistance;

            if(Math.abs(nDistanceDifference) > 1)
                this._nDistance -= (nDistanceDifference * 0.05);
            else
                this._nDistance = this._nDesiredDistance;

            if(this._nDistance < 500)
                this._nDistance = 500;

            this.updateViewport();
        }

        public updateViewport() {
            this._nAspectRatio = this._cContext.canvas.width / this._cContext.canvas.height;
            this._aViewport.width = this._nDistance * Math.tan(this._nFieldOfView);
            this._aViewport.height = this._aViewport.width / this._nAspectRatio;
            this._aViewport.left = this._cLookAt.X - (this._aViewport.width / 2.0);
            this._aViewport.top = this._cLookAt.Y - (this._aViewport.height / 2.0);
            this._aViewport.right = this._aViewport.left + this._aViewport.width;
            this._aViewport.bottom = this._aViewport.top + this._aViewport.height;
            this._aViewport.scale[0] = this._cContext.canvas.width / this._aViewport.width;
            this._aViewport.scale[1] = this._cContext.canvas.height / this._aViewport.height;
        }

        ///
        /// PRIVATE
        ///

        private applyScale() {
            this._cContext.scale(this._aViewport.scale[0], this._aViewport.scale[1]);
        }

        private applyTranslation() {
            this._cContext.translate(-this._aViewport.left, -this._aViewport.top);
        }

        ///
        /// PUBLIC
        ///

        public changeContext(cPosition: Vector, nRotation: number) {
            this._cContext.save();

            this._cContext.translate(cPosition.X, cPosition.Y);
            this._cContext.rotate(nRotation);
        }

        public begin() {
            this._cContext.save();
            this.applyScale();
            this.applyTranslation();
        }

        public end() {
            this._cContext.restore();
        }

        public zoomIn() {
            this._nDesiredDistance -= this._nDistanceSpeed;
        }

        public zoomOut() {
            this._nDesiredDistance += this._nDistanceSpeed;
        }

        public zoomTo(nZoom: number) {
            this._nDesiredDistance = nZoom;
        }

        public moveTo(cPosition: Vector) {
            this._cLookAt.X = cPosition.X;
            this._cLookAt.Y = cPosition.Y;

            this.updateViewport();
        }

        public screenToWorld(cPosition: Vector): Vector {
            let nX: number = (cPosition.X / this._aViewport.scale[0]) + this._aViewport.left;
            let nY: number = (cPosition.Y / this._aViewport.scale[1]) + this._aViewport.top;

            return new Vector(nX, nY);
        }

        public worldToScreen(cPosition: Vector): Vector {
            let nX: number = (cPosition.X - this._aViewport.left) * (this._aViewport.scale[0]);
            let nY: number = (cPosition.Y - this._aViewport.top) * (this._aViewport.scale[1]);

            return new Vector(nX, nY);
        }

        ///
        /// STATIC
        ///

        static ZoomIn() {
            Camera.CAMERA().zoomIn();
        }

        static ZoomOut() {
            Camera.CAMERA().zoomOut();
        }

        static SetZoom(nZoom: number) {
            Camera.CAMERA().zoomTo(nZoom);
        }

        static WorldToScreen(cPosition: Vector): Vector {
            return Camera.CAMERA().worldToScreen(cPosition);
        }

        static ScreenToWorld(cPosition: Vector): Vector {
            return Camera.CAMERA().screenToWorld(cPosition);
        }
    }
}