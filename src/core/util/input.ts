namespace FireHare {
    export class Input {

        ///
        /// SINGLETON
        ///

        static SINGLETON: Input;
        static INPUT(): Input {
            if(!hasValue(Input.SINGLETON))
                Input.SINGLETON = new Input();
            
            return Input.SINGLETON;
        }

        ///
        /// LOCAL
        ///

        private _liKeysDown: number[];
        private _liKeysDownPrev: number[];
        private _cMousePosition: Vector;
        private _bUpdated: boolean;

        constructor() {
            this._liKeysDown = [];
            this._liKeysDownPrev = [];
            this._bUpdated = false;
            //this._cMousePosition = new Vector(0, 0);

            window.addEventListener('keydown', this.onKeyDown.bind(this));
            window.addEventListener('keyup', this.onKeyUp.bind(this));
            window.addEventListener("mouseenter", this.onMouseMove.bind(this));
            window.addEventListener("mousemove", this.onMouseMove.bind(this));
        }

        ///
        /// PUBLIC
        ///

        public update() {
            if(!this._bUpdated) {
                this._liKeysDownPrev = this._liKeysDown;

                this._bUpdated = true;
            }
        }

        public isKeyDown(eKey: Keys): boolean {
            if(this._liKeysDown.indexOf(eKey) != -1)
                return true;

            return false;
        }

        public isKeyPressed(eKey: Keys): boolean {
            if(this._liKeysDown.indexOf(eKey) != -1)
                if(this._liKeysDownPrev.indexOf(eKey) == -1)
                    return true;

            return false;
        }

        ///
        /// STATIC
        ///

        static Update() {
            Input.INPUT().update();
        }

        static get MousePosition(): Vector {
            return Input.INPUT().mousePosition;
        }

        static IsKeyDown(eKey: Keys): boolean {
            return Input.INPUT().isKeyDown(eKey);
        }

        static IsKeyPressed(eKey: Keys): boolean {
            return Input.INPUT().isKeyPressed(eKey);
        }

        ///
        /// EVENT HANDLER
        ///

        public onMouseMove(e: MouseEvent) {
            this._cMousePosition = new Vector(e.clientX, e.clientY);
        }

        public onKeyDown(e: KeyboardEvent) {
            this._liKeysDownPrev = this._liKeysDown.slice(0);

            if(this._liKeysDown.indexOf(e.keyCode) != -1) {
                return;
            }

            this._liKeysDown.push(e.keyCode);

            this._bUpdated = false;
        }

        public onKeyUp(e: KeyboardEvent) {
            let nIndex: number = this._liKeysDown.indexOf(e.keyCode);

            this._liKeysDown.splice(nIndex, 1);

            this._liKeysDownPrev = this._liKeysDown.slice(0);
        }

        ///
        /// PROPERTIES
        ///

        get mousePosition(): Vector {
            return this._cMousePosition;
        }
    }
}