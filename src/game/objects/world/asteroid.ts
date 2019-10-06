namespace FireHare.Equinox {
    export class Asteroid extends GameObject {



        constructor(nRadius: number, liOutline: Vector[] = []) {
            super(Guid.NewGuid());

            this._cStats = new Stats(0, 99999, 99999);

            this._nRadius = nRadius;

            this._liComponents.push(new Components.Asteroid(this._nRadius, liOutline));
        }

        ///
        /// PROTECTED
        ///

        protected onCollision() {
            return;
        }

        ///
        /// PROPERTIES
        ///

        get outline(): Vector[] {
            return this._liComponents[0].outline; // TODO: Refactor this (T26)
        }

        ///
        /// STATIC
        ///

        static GenerateAsteroidField(nSize: number = 1): Asteroid[] {
            let liAsteroids: Asteroid[] = [];

            for(let i = 0; i < nSize; i++) {
                liAsteroids.push(new Asteroid(Random.Next(80, 150)));
            }

            return liAsteroids;
        }
    }
}