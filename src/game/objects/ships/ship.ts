namespace FireHare.Equinox {
    export class Ship extends GameObject {

        ///
        /// LOCAL
        ///
        private _bIsAccellerating: boolean;
        private _nAccellerationTimer: number;

        ///
        /// EVENTS
        ///
        public fired: Event;

        constructor(gTeam?: Guid) {
            super(gTeam);

            this._bIsAccellerating = false;

            this.fired = new Event();
        }

        ///
        /// PUBLIC
        ///

        public fire() {
            this.fired.raise(this);
        }

        public accellerate() {
            let nX: number = Math.cos(this.rotation) * (this._cStats.accelleration * (Timer.ElapsedTime));
            let nY: number = Math.sin(this.rotation) * (this._cStats.accelleration * (Timer.ElapsedTime));

            this._bIsAccellerating = true;
            this._nAccellerationTimer = 0;

            this.applyForce(new Vector(nX, nY));
        }

        public decellerate() {
            let nX: number = Math.cos(this.rotation) * (this._cStats.accelleration * (Timer.ElapsedTime));
            let nY: number = Math.sin(this.rotation) * (this._cStats.accelleration * (Timer.ElapsedTime));

            this.applyForce(new Vector(-nX, -nY));
        }

        public turnToPort() {
            this._nRotation -= this._cStats.rotationSpeed;
        }

        public turnToStarboard() {
            this._nRotation += this._cStats.rotationSpeed;
        }

        public update() {
            super.update();

            this._nAccellerationTimer += Timer.ElapsedTime;

            if(this._nAccellerationTimer > 500) {
                this._bIsAccellerating = false;
            }
        }

        public draw(cCanvas: Canvas) {
            super.draw(cCanvas);

            cCanvas.drawCircle(this.position, this.radius, Colour.Blue);
      
            let cPosition: Vector = new Vector(this.position.X, this.position.Y + 50);

            Log.AddWorldItem(String.format("Id: {0}", this.identifier), cPosition);
            
            cPosition = cPosition.add(new Vector(0, 10));
            Log.AddWorldItem(String.format("Position: X: {0}", Math.round(this.position.X)), cPosition);
            cPosition = cPosition.add(new Vector(0, 10));
            Log.AddWorldItem(String.format("Position: Y: {0}", Math.round(this.position.Y)), cPosition);

            cPosition = cPosition.add(new Vector(0, 10));
            Log.AddWorldItem(String.format("Shields: {0}", Math.round(this.stats.shields)), cPosition);
            cPosition = cPosition.add(new Vector(0, 10));
            Log.AddWorldItem(String.format("Armour: {0}", Math.round(this.stats.armour)), cPosition);
            cPosition = cPosition.add(new Vector(0, 10));
            Log.AddWorldItem(String.format("Hull: {0}", Math.round(this.stats.hull)), cPosition);

            cPosition = cPosition.add(new Vector(0, 10));
            Log.AddWorldItem(String.format("Is Alive: {0}", this.isAlive), cPosition);
        }

        ///
        /// PROTECTED
        ///

        protected updateMovement() {
            super.updateMovement();

            if(!this._bIsAccellerating) {
                if(this.speed < this.stats.accelleration) {
                    this.stop();
                }
                else
                {
                    let nDirection = Math.atan2(this.velocity.Y, this.velocity.X);
    
                    let nX: number = Math.cos(nDirection) * this.stats.accelleration;
                    let nY: number = Math.sin(nDirection) * this.stats.accelleration;
    
                    let cForce = new Vector(nX, nY).reverse();
    
                    this.applyForce(cForce);
                }
            }
            
        }
    }
}