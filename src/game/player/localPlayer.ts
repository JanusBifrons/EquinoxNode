/// <reference path="player.ts" />

namespace FireHare.Asteroids {
    export class LocalPlayer extends Player {

        ///
        /// LOCAL
        ///
        private _cCameraPosition: Vector;

        ///
        /// EVENTS
        ///
        public fired: Event;
        public selfDestruct: Event;
        public turnToPort: Event;
        public turnToStarboard: Event;
        public accellerate: Event;
        public decellerate: Event;

        constructor(gId: Guid, gShipId: Guid, gTeam: Guid) {
            super(gId, gShipId, gTeam);
            
            this.fired = new Event();
            this.selfDestruct = new Event();
            this.turnToPort = new Event();
            this.turnToStarboard = new Event();
            this.accellerate = new Event();
            this.decellerate = new Event();

            this._cShip.position = Vector.Zero;

            Input.INPUT();

            this.initEvents();
        }

        private initEvents() {
            window.addEventListener('touchstart', (e: TouchEvent) => {
                for(let i = 0; i < e.touches.length; i++){
                    let cTouch = e.touches.item(i) as Touch;

                    this._cShip.turnToFace(Camera.ScreenToWorld(new Vector(cTouch.clientX, cTouch.clientY)));
                }

                e.preventDefault();
                e.cancelBubble = true;
            });
        }

        ///
        /// PUBLIC
        ///

        public update() {
            if(this._cShip.isAlive) {
                if(Input.IsKeyDown(Keys.W))
                    this.accellerate.raise(this);

                if(Input.IsKeyDown(Keys.S))
                    this.decellerate.raise(this);

                if(Input.IsKeyDown(Keys.A))
                    this.turnToPort.raise(this);

                if(Input.IsKeyDown(Keys.D))
                    this.turnToStarboard.raise(this);

                if(Input.IsKeyPressed(Keys.Spacebar))
                    this.fired.raise(this);

                if(Input.IsKeyPressed(Keys.Delete))
                    this.selfDestruct.raise(this);
            }
            else {
                if(Input.IsKeyDown(Keys.W))
                    this._cCameraPosition.Y -= 1;

                if(Input.IsKeyDown(Keys.S))
                    this._cCameraPosition.Y += 1;

                if(Input.IsKeyDown(Keys.A))
                    this._cCameraPosition.X -= 1;

                if(Input.IsKeyDown(Keys.D))
                    this._cCameraPosition.X += 1;
            }
        }

        public draw(cCanvas: Canvas) {
            Log.AddScreenItem("LOCAL PLAYER ID: " + this.identifier.toString(), new Vector(500, 25));

            if(this._cShip.isAlive)
                this._cCameraPosition = new Vector(this._cShip.position.X, this._cShip.position.Y);

            cCanvas.moveTo(this._cCameraPosition);

            super.draw(cCanvas);
        }
    }
}