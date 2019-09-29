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
                }
            }
        }
    }
}

// namespace SAT {
//     export class Circle {
//         constructor(cVector: Vector, nRadius: number) {

//         }
//     };
//     export class Vector {
//         constructor(nX: number, nY: number) {

//         }
//     };
//     export function pointInCircle() {};
//     export function testCircleCircle(c1: Circle, c2: Circle, a1: any): any {};
// }