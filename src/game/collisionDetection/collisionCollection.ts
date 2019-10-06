namespace FireHare.Equinox {
    export class CollisionCollection {

        ///
        /// LOCAL
        ///
        private _liItems: CollisionItem[];

        constructor(liItems: CollisionItem[] = []) {
            this._liItems = liItems;
        }

        ///
        /// PUBLIC
        ///

        public addItem(cItem: CollisionItem) {
            this._liItems.push(cItem);
        }

        public testCollection(cItemCollection: CollisionCollection, cResponse: SAT.Response): boolean {
            for(const item of cItemCollection.items) {
                if(this.test(item, cResponse)) {
                    return true;
                }
            }

            return false;
        }

        public test(cItem: CollisionItem, cResponse: SAT.Response): boolean {
            this.sortItems();

            for(const cCollisionItem of this._liItems) {
                if(cCollisionItem.test(cItem, cResponse)) {
                    return true;
                }
            }

            return false;
        }

        ///
        /// PRIVATE
        ///

        private sortItems() {
            this._liItems = this._liItems.sort((a: CollisionItem, b: CollisionItem) => {
                return a.index - b.index;
            });
        }

        ///
        /// PROPERTIES
        ///

        get items(): CollisionItem[] {
            return this._liItems;
        }
    }
}