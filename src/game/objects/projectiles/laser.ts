namespace FireHare.Equinox {
    export class Laser extends GameObject {
        constructor() {
            super();

            this._nRadius = 10;

            this._liComponents.push(new Components.Laser());
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