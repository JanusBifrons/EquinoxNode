namespace FireHare {
    export class Event {

        ///
        /// LOCAL
        ///
        private _liHandlers: any[];

        constructor() {
            this._liHandlers = [];
        }

        ///
        /// PUBLIC
        ///

        public addHandler(aEventHandler: any) {
            this._liHandlers.push(aEventHandler);
        }

        public raise(sender: any, cArgs?: any) {
            for(let i = 0; i < this._liHandlers.length; i++) {
                this._liHandlers[i](sender, cArgs);
            }
        }
    }
}