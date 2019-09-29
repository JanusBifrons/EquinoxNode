namespace FireHare {
    export class Log {

        ///
        /// SINGLETON
        ///

        static SINGLETON: Log;
        static LOG(): Log {
            if(!hasValue(Log.SINGLETON))
                Log.SINGLETON = new Log();
            
            return Log.SINGLETON;
        }

        ///
        /// LOCAL
        ///

        private _liMessages: LogItem[];
        private _liStats: LogItem[];
        private _liWorldMessages: LogItem[];
        private _liScreenMessages: LogItem[];

        constructor() {
            this._liMessages = [];
            this._liStats = [];
            this._liWorldMessages = [];
            this._liScreenMessages = [];
        }   

        ///
        /// STATIC
        ///

        static AddItem(sMessage: string) {
            Log.LOG().addMessage(sMessage);
        }

        static AddStat(sStat: string) {
            Log.LOG().addStat(sStat);
        }

        static AddWorldItem(sMessage: string, cPosition: Vector) {
            Log.LOG().addWorldMessage(sMessage, cPosition);
        }

        static AddScreenItem(sMessage: string, cPosition: Vector) {
            Log.LOG().addScreenMessage(sMessage, cPosition);
        }

        ///
        /// PUBLIC
        ///

        public addMessage(sMessage: string) {
            console.log(sMessage);

            this._liMessages.push(new LogItem(sMessage));
        }

        public addStat(sStat: string) {
            this._liStats.push(new LogItem(sStat));
        }

        public addWorldMessage(sMessage: string, cPosition: Vector) {
            this._liWorldMessages.push(new LogItem(sMessage, cPosition));
        }

        public addScreenMessage(sMessage: string, cPosition: Vector) {
            this._liScreenMessages.push(new LogItem(sMessage, cPosition));
        }

        public update() {
            this._liStats = [];
            this._liWorldMessages = [];
            this._liScreenMessages = [];
        }

        public draw(cCanvas: Canvas) {
            cCanvas.moveToScreenSpace();

            for(let i = this._liMessages.length - 1; i > 0; i--) {
                cCanvas.drawText(this._liMessages[i].message, new Vector(25, (i * 10) + 50));
            }

            if(this._liStats.length > 0){
                cCanvas.drawText("-------", new Vector(25, 350));
                cCanvas.drawText("STATS", new Vector(25, 365));
                cCanvas.drawText("-------", new Vector(25, 380));
            }

            for(let i = 0; i < this._liStats.length; i++) {
                cCanvas.drawText(this._liStats[i].message, new Vector(25, (i * 10) + 395));
            }

            cCanvas.moveToWorldSpace();

            for(let i = 0; i < this._liWorldMessages.length; i++) {
                cCanvas.drawText(this._liWorldMessages[i].message, this._liWorldMessages[i].position);
            }

            cCanvas.moveToScreenSpace();

            for(let i = 0; i < this._liScreenMessages.length; i++) {
                cCanvas.drawText(this._liScreenMessages[i].message, this._liScreenMessages[i].position);
            }

            // TODO: Remove this in favour of fading/auto-deleting
            if(this._liMessages.length > 10)
                this._liMessages = this._liMessages.slice(this._liMessages.length - 10);
        }
    }
}