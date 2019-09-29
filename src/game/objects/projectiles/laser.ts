namespace FireHare.Asteroids {
    export class Laser extends GameObject {
        constructor() {
            super();

            this._nRadius = 1;
        }

        ///
        /// STATIC
        ///

        static FromShip(cShip: Ship): Laser {
            let cLaser: Laser = new Laser();
            cLaser.team = cShip.team;
            cLaser.position = new Vector(cShip.position.X, cShip.position.Y);
            cLaser.rotation = cShip.rotation;
            cLaser.applyForce(Vector.DirectionFromRotation(cShip.rotation, 3));
            cLaser.applyForce(cShip.velocity.multiply(3));
            return cLaser;
        }

        ///
        /// PUBLIC
        ///

        public draw(cCanvas: Canvas) {
            cCanvas.drawCircle(this.position, 2, Colour.Red);

            super.draw(cCanvas);
        }

        ///
        /// EVENT HANDLERS
        ///

        protected onApplyDamage(nDamage: number) {
            this.destroy();
        }

        protected onCollision(cForce: Vector) {
            this.destroy();
        }
    }
}