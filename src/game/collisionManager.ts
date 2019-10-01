namespace FireHare.Asteroids {
    export class CollisionManager {

        constructor() {            
        }

        public collisionCheck(cObject: GameObject, cOtherObject: GameObject) {
            let cComponents: Components.Component[] = cObject.components;
            let cOtherComponents: Components.Component[] = cOtherObject.components;

            for(let i = 0; i < cComponents.length; i++) {
                let cComponent: Components.Component = cComponents[i];

                for(let j = 0; j < cOtherComponents.length; j++) {
                    let cOtherComponent: Components.Component = cOtherComponents[j];

                    let cResponse: SAT.Response = new SAT.Response();

                    if(SAT.testPolygonPolygon(cComponent.collisionPolygon, cOtherComponent.collisionPolygon, cResponse)){
                        cObject.collision(Vector.FromSAT(cResponse.overlapV.reverse()));
                    }
                }
            }
        }
    }
}