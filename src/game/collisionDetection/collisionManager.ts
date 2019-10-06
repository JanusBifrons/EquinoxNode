namespace FireHare.Equinox {
    export class CollisionManager {

        constructor() {            
        }

        public collisionCheck(cObject: GameObject, cOtherObject: GameObject): boolean {

            let cResponse: SAT.Response = new SAT.Response();

            if(cObject.collisionCollection.testCollection(cOtherObject.collisionCollection, cResponse)) {
                let cForce: Vector = Vector.FromSAT(cResponse.overlapV);

                cObject.collision(cForce);
                cOtherObject.collision(cForce.reverse());

                // Object collision handled, return
                return true;
            }

            return false;
        }

        ///
        /// PRIVATE
        ///

        /** Simple method which will test the object radius distances to determine if objects are in range to collide
         * and justify using SAT collision detection which is more expensive.
         */
        private sanityCollisionCheck(cObject: GameObject, cOtherObject: GameObject): boolean {
            let nRadii: number = cObject.radius + cOtherObject.radius;
            let nDistance: number = Vector.Distance(cObject.position, cOtherObject.position);
            let nDifference: number = nDistance - nRadii;

            if(nDifference < 0) {
                return true;
            }

            return false;
        }
    }
}