namespace FireHare.Asteroids {
    export enum ObjectType {
        Ship,
        Laser,
        Scrap,
        Unknown
    }

    export abstract class GameObject {

        ///
        /// LOCAL
        ///
        private _gId: Guid;
        private _gTeam: Guid;
        private _cPosition: Vector;
        private _cVelocity: Vector;
        private _nSpeed: number;
        

        /// 
        /// PROTECTED
        ///
        
        protected _nRadius: number;
        protected _cRotationTarget: Vector;
        protected _liComponents: Components.Component[];
        protected _bIsAlive: boolean;
        protected _nRotation: number;
        protected _cStats: Stats;

        ///
        /// EVENTS
        ///

        public destroyed: Event;

        constructor(gTeam: Guid = Guid.NewGuid()) {
            this._gId = Guid.NewGuid();
            this._gTeam = gTeam;
            //this._cPosition = Vector.Zero;
            this._cPosition = District.RandomSpawn();
            this._cVelocity = new Vector(0, 0);
            this._nRotation = 0;
            this._bIsAlive = true;
            this._nRadius = 60;
            this._liComponents = [];

            this._cStats = new Stats();

            this.destroyed = new Event();
        }

        private rotateToDesiredTarget() {
            let nDesiredRotation: number = Vector.DirectionTo(this.position, this._cRotationTarget);

            let nDiff: number = Helper.WrapRotation(nDesiredRotation - this._nRotation);
            nDiff = Helper.Clamp(nDiff, -this._cStats.rotationSpeed, this._cStats.rotationSpeed);

            if(Math.abs(nDiff) < this._cStats.rotationSpeed)
                this._nRotation = Helper.WrapRotation(nDesiredRotation);
            else
                this._nRotation = Helper.WrapRotation(this._nRotation + nDiff);
        }

        ///
        /// PUBLIC
        ///

        public collision(cForce: Vector) {
            this.onCollision(cForce);
        }

        public applyDamage(nDamage: number) {
            this.onApplyDamage(nDamage);
        }

        public update() {
            this._cStats.update();

            for(let i = 0; i < this._liComponents.length; i++) {
                this._liComponents[i].update(this);
            }

            if(hasValue(this._cRotationTarget))
                this.rotateToDesiredTarget();

            this._nSpeed = this._cVelocity.magnitude;

            if(this._nSpeed > this._cStats.maxSpeed) {
                this._cVelocity.X += (this._cVelocity.X / this._nSpeed) * (this._cStats.maxSpeed - this._nSpeed);
		        this._cVelocity.Y += (this._cVelocity.Y / this._nSpeed) * (this._cStats.maxSpeed - this._nSpeed);
            }

            this._cPosition.X += (this._cVelocity.X * Timer.ElapsedTime);
            this._cPosition.Y += (this._cVelocity.Y * Timer.ElapsedTime);
        }

        public draw(cCanvas: Canvas) {
            if(!this.isAlive)
                return;

            for(let i = 0; i < this._liComponents.length; i++){
                let cComponent: Components.Component = this._liComponents[i];

                cComponent.draw(cCanvas);
            }

            
            cCanvas.drawCircle(this.position, this.radius, Colour.Red);
        }

        public applyForce(cForce: Vector) {
            this.onApplyForce(cForce);
        }

        public stop() {
            this._cVelocity.X = 0;
            this._cVelocity.Y = 0;
        }

        public destroy() {
            if(this._bIsAlive)
                this.onDestroy();
        }

        public turnToFace(cTarget: Vector) {
            this._cRotationTarget = cTarget;
        }

        ///
        /// PRIVATE
        /// 

        ///
        /// STATIC
        ///

        static GetType(cObject: GameObject): ObjectType {
            if(cObject instanceof Ship)
                return ObjectType.Ship;

            if(cObject instanceof Laser)
                return ObjectType.Laser;

            if(cObject instanceof Scrap)
                return ObjectType.Scrap;

            return ObjectType.Unknown;
        }


        ///
        /// EVENT HANDLERS
        ///

        protected onApplyDamage(nTotalDamage: number) {
            Log.AddItem(String.format("Applying {0} damage to {1}", nTotalDamage, this.identifier.toString()));

            if(this._cStats.applyDamage(nTotalDamage))
                this.destroy();
        }

        protected onApplyForce(cForce: Vector) {
            this._cVelocity.X += cForce.X;
            this._cVelocity.Y += cForce.Y;
        }

        protected onCollision(cForce: Vector) {
            //this._cPosition.subtract(cForce);

            this.applyForce(cForce.multiply(0.1));
        }

        protected onDestroy() {
            this._bIsAlive = false;

            this.destroyed.raise(this);
        }

        ///
        /// PROPERTIES
        ///

        get team(): Guid {
            return this._gTeam;
        }

        set team(gTeam: Guid) {
            this._gTeam = gTeam;
        }

        get isAlive(): boolean {
            return this._bIsAlive;
        }

        get identifier(): Guid {
            return this._gId;
        }

        set identifier(gId: Guid) {
            this._gId = gId;
        }

        get position(): Vector {
            return this._cPosition;
        }

        set position(cPosition: Vector) {
            this._cPosition = cPosition;
        }

        get velocity(): Vector {
            return this._cVelocity;
        }

        set velocity(cVector: Vector) {
            this._cVelocity = cVector;
        }

        get rotation(): number {
            return this._nRotation;
        }

        set rotation(nRotation: number) {
            this._nRotation = nRotation;
        }

        get radius(): number {
            return this._nRadius;
        }

        get speed(): number {
            return this._nSpeed;
        }

        get components(): Components.Component[] {
            return this._liComponents;
        }

        get stats(): Stats {
            return this._cStats;
        }
    }
}