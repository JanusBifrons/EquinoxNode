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
                    if(SAT.testCirclePolygon(this.item, cItem.item, cResponse)) {
                         // HACK: Have to reverse due to reversed parameters
                         // this is going to fix this issue but if in the future
                         // the response variable is used more then this will start to fall apart and need more fixing
                        cResponse.overlapV = cResponse.overlapV.reverse();

                        return true;
                    }
                    
            }

            return false;
        }
    }
}