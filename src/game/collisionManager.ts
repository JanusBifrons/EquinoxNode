namespace FireHare.Equinox {
    export class CollisionManager {

        constructor() {            
        }

        public collisionCheck(cObject: GameObject, cOtherObject: GameObject) {
            if(!this.sanityCollisionCheck(cObject, cOtherObject)) {
                return;
            }

            let cComponents: Components.Component[] = cObject.components;
            let cOtherComponents: Components.Component[] = cOtherObject.components;

            for(let i = 0; i < cComponents.length; i++) {
                let cComponent: Components.Component = cComponents[i];

                for(let j = 0; j < cOtherComponents.length; j++) {
                    let cOtherComponent: Components.Component = cOtherComponents[j];

                    let cResponse: SAT.Response = new SAT.Response();

                    if(SAT.testPolygonPolygon(cComponent.collisionPolygon, cOtherComponent.collisionPolygon, cResponse)){
                        let cForce: Vector = Vector.FromSAT(cResponse.overlapV);

                        cObject.collision(cForce.reverse());
                        cOtherObject.collision(cForce);

                        // Object collision handled, return
                        return;
                    }
                }
            }
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