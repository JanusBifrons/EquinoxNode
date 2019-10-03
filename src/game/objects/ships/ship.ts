namespace FireHare.Equinox {
    export class Ship extends GameObject {

        ///
        /// LOCAL
        ///

        ///
        /// EVENTS
        ///
        public fired: Event;

        constructor(gTeam?: Guid) {
            super(gTeam);

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
    }
}