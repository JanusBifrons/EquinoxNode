/// <reference path="collisionItem.ts" />

namespace FireHare.Equinox {
    export class CollisionPolygon extends CollisionItem {
        constructor(nIndex: number, cCircle: SAT.Polygon) {
            super(nIndex, cCircle, CollisionItemType.Polygon);
        }

        public test(cItem: CollisionItem, cResponse: SAT.Response): boolean {
            switch(cItem.type) {
                case CollisionItemType.Circle:
                    return SAT.testCirclePolygon(cItem.item, this.item, cResponse);

                case CollisionItemType.Polygon:
                    return SAT.testPolygonPolygon(cItem.item, this.item, cResponse);
            }

            return false;
        }
    }
}