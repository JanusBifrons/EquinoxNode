/// <reference path="collisionItem.ts" />

namespace FireHare.Equinox {
    export class CollisionCircle extends CollisionItem {
        constructor(nIndex: number, cCircle: SAT.Circle) {
            super(nIndex, cCircle, CollisionItemType.Circle);
        }

        public test(cItem: CollisionItem, cResponse: SAT.Response): boolean {
            switch(cItem.type) {
                case CollisionItemType.Circle:
                    return SAT.testCircleCircle(cItem.item, this.item, cResponse);

                case CollisionItemType.Polygon:
                    return SAT.testCirclePolygon(cItem.item, this.item, cResponse);
            }

            return false;
        }
    }
}