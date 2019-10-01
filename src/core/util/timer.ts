namespace FireHare {
    export class Timer {

        ///
        /// SINGLETON
        ///

        static SINGLETON: Timer;
        static TIMER(): Timer {
            if(!hasValue(Timer.SINGLETON))
                Timer.SINGLETON = new Timer();
            
            return Timer.SINGLETON;
        }

        ///
        /// LOCAL
        ///
        private _cNow: number;
        private _cPrevious: number;

        constructor() {
            this._cNow = Date.now();
            this._cPrevious = this._cNow;
            
        }

        ///
        /// PUBLIC
        ///

        public getElapsedTime(): number {
            return this._cNow - this._cPrevious;
        }

        public update() {
            this._cPrevious = this._cNow;

            this._cNow = Date.now();
        }

        ///
        /// STATIC
        ///

        static Init() {
            Timer.TIMER();
        }

        static get ElapsedTime(): number {
            return Timer.TIMER().getElapsedTime();
        }
    }
}