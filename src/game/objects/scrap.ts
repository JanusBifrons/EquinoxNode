/// <reference path="gameObject.ts" />

namespace FireHare.Equinox { 
    export class Scrap extends GameObject {
        constructor(gTeam: Guid, cComponent: Components.Component, cVelocity: Vector) {
            super();

            this.team = gTeam;

            this.position = new Vector(cComponent.position.X, cComponent.position.Y);
            this.rotation = cComponent.rotation;

            this._nRadius = 50;

            cComponent.offset = Vector.Zero;

            let cNudge: Vector = this.randomForce();

            this.velocity = cVelocity.add(cNudge);

            //this.velocity = Vector.Zero;

            //this.velocity = this.randomForce();

            this._liComponents.push(cComponent);
        }

        ///
        /// STATIC
        ///

        static FromGameObject(cObject: GameObject) {
            let liScrap: Scrap[] = [];

            for(let i = 0; i < cObject.components.length; i++) {
                let cScrap: Scrap = new Scrap(cObject.team, cObject.components[i], cObject.velocity);
                liScrap.push(cScrap);
            }

            return liScrap;
        }

        static FromArgs(cObject: GameObject, cArgs: Args.ObjectDestroyedArgs): Scrap[] {
            let liScrap: Scrap[] = [];

            for(let i = 0; i < cObject.components.length; i++) {
                let cScrap: Scrap = new Scrap(cObject.team, cObject.components[i], cObject.velocity);
                let cPosition: Vector = new Vector(cArgs.scrapX[i], cArgs.scrapY[i]);

                cScrap.identifier = new Guid(cArgs.scrapId[i]);
                cScrap.position = cPosition;
                cScrap.rotation = cArgs.scrapRotation[i];

                liScrap.push(cScrap);
            }

            return liScrap;
        }

        ///
        /// PRIVATE
        ///

        private randomForce(): Vector {
            let nX: number = Random.Next(-0.01, 0.01);
            let nY: number = Random.Next(-0.01, 0.01);

            return new Vector(nX, nY);
        }
    }
}