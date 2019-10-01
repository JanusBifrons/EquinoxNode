namespace FireHare {
    export class Settings {
        ///
        /// SINGLETON
        ///

        static SINGLETON: Settings;
        static SETTINGS(): Settings {
            if(!hasValue(Settings.SINGLETON))
                Settings.SINGLETON = new Settings();
            
            return Settings.SINGLETON;
        }

        ///
        /// LOCAL
        ///
        private _bIsDebug: boolean;

        constructor() {
            this._bIsDebug = true;
        }

        ///
        /// STATIC
        ///

        static get IsDebug(): boolean {
            return Settings.SETTINGS().isDebug;
        }

        ///
        /// PROPERTIES
        ///

        get isDebug(): boolean {
            return this._bIsDebug;
        }

        set isDebug(bIsDebug: boolean) {
            this._bIsDebug = bIsDebug;
        }
    }
}