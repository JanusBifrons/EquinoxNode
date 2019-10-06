/// <reference path="ship.ts" />

namespace FireHare.Equinox {
    export class Havok extends Ship {
        constructor(gTeam?: Guid) {
            super(gTeam);

            this._liComponents.push(new Components.Shield(60));

            this._liComponents.push(new Components.Cockpit(Vector.Zero, false, 1));

            this._liComponents.push(new Components.RearWing(new Vector(-30, -12), false, 1));
            this._liComponents.push(new Components.RearWing(new Vector(-30, 12), true, 1));
            
            this._liComponents.push(new Components.Wing(new Vector(-10, -20), false, 1));
            this._liComponents.push(new Components.Wing(new Vector(-10, 20), true, 1));
            
            this._liComponents.push(new Components.Cockpit(new Vector(40, 0), false, 1.5));

            this._liComponents.push(new Components.Pad(new Vector(0, -8), false, 1.5));
            this._liComponents.push(new Components.Pad(new Vector(0, 8), true, 1.5));
        }
    }
}