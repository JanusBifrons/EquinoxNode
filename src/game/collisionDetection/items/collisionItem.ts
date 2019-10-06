namespace FireHare.Equinox {
    export abstract class CollisionItem {
        
        ///
        /// LOCAL
        ///
        protected _eType: CollisionItemType;
        protected _cItem: any;
        private _nIndex: number;

        constructor(nIndex: number, cItem: any, eType: CollisionItemType) {
            if(cItem instanceof SAT.Circle) {
                this._eType = CollisionItemType.Circle;
            } else if (cItem instanceof SAT.Polygon) {
                this._eType = CollisionItemType.Polygon;
            }
            else {
                throw new Error("Unidentified collision item.");
            }

            this._nIndex = nIndex;

            this._cItem = cItem;
        }

        
        ///
        /// abstract
        ///

        abstract test(cItem: CollisionItem, cResponse: SAT.Response): boolean;

        ///
        /// PROPERTIES
        ///

        get index(): number {
            return this._nIndex;
        }

        set index(nIndex: number) {
            this._nIndex = nIndex;
        }

        get type(): CollisionItemType {
            return this._eType;
        }

        get item(): any {
            return this._cItem;
        }
    }
}