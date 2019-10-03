namespace FireHare.Asteroids {
    export class Asteroid extends GameObject {



        constructor(nRadius: number) {
            super(Guid.NewGuid());

            this._nRadius = nRadius;

            this._liComponents.push(new Components.Asteroid(this._nRadius));
        }

        ///
        /// PROTECTED
        ///

        protected onCollision() {
            return;
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