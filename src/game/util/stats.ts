namespace FireHare.Equinox {
    export class Stats {

        ///
        /// LOCAL
        ///

        /// GENERAL
        private _nMinSpeed: number;
        private _nMaxSpeed: number;
        private _nAccelleration: number;
        protected _nRotationSpeed: number;

        /// HEALTH
        private _nShieldRegenerationCap: number;
        private _nShieldRegen: number;
        private _nShieldCap: number;
        private _nShields: number;
        private _nArmourCap: number;
        private _nArmour: number;
        private _nArmourRegen: number;
        private _nHullCap: number;
        private _nHull: number;
        private _nHullRegen: number;

        constructor(nShieldCap: number = 0, nArmourCap: number = 0, nHull: number = 100) {
            // Set general
            this._nAccelleration = 0.001;
            this._nMinSpeed = 0;
            this._nMaxSpeed = 20;
            this._nRotationSpeed = 0.035;

            // Set shields
            this._nShieldRegenerationCap = 20000; // 1s
            this._nShieldRegen = 20000;
            this._nShieldCap = nShieldCap;
            this._nShields = this._nShieldCap;
            
            // Set armour
            this._nArmourCap = nArmourCap;
            this._nArmour = this._nArmourCap;
            this._nArmourRegen = 0;
            
            // Set hull
            this._nHullCap = nHull;
            this._nHull = this._nHullCap;
            this._nHullRegen = 2.5;
        }

        ///
        /// PUBLIC
        ///

        public update() {
            this.regenStats();
        }

        public applyDamage(nTotalDamage: number): boolean {
            Log.AddItem(String.format("Applying {0} damage", nTotalDamage));

            var nDamage = nTotalDamage;

            // Check if hit is on shields	
            if(this._nShields > 0)
            {
                // Impacts on shields
                this._nShields -= nDamage;	
                
                // Reset shield regen timer
                this._nShieldRegen = this._nShieldRegenerationCap;
                
                // Object lives on!
                return false;
            }
            
            if(this._nArmour > 0)
            {
                if(this._nArmour > nDamage)
                {
                    // Impact on the armour
                    this._nArmour -= nDamage;		
                
                    // No damage remaining
                    nDamage -= nTotalDamage;
                }
                else
                {
                    nDamage = nTotalDamage - this._nArmour;
                    
                    this._nArmour -= nDamage;
                }
            }

            //Log.AddItem(String.format("Before applying {0} damage to hull ({1})", nDamage, this._nHull));
            
            if(this._nHull > nDamage)
            {
                // Impact on the health
                this._nHull -= nDamage;

                //Log.AddItem(String.format("After applying {0} damage to hull ({1})", nDamage, this._nHull));
            }
            else
            {
                // KA-BOOM!
                return true; // Object died!
            }
             
            // Reset shield regen timer
            this._nShieldRegen = this._nShieldRegenerationCap;

            return false;
        }

        ///
        /// PRIVATE
        ///

        private regenStats() {
            let nElapsedTime: number = Timer.ElapsedTime;

            // Count Down Shield Regen Timer
            if(this._nShieldRegen > 0)
                this._nShieldRegen -= nElapsedTime;

            // Calculate how much to regen by this frame
            var nHullRegenAmount = (this._nHullRegen / 1000) * nElapsedTime;	
            var nArmourRegenAmount = (this._nArmourRegen / 1000) * nElapsedTime;	
                
            // Regen armour
            if(this._nArmour < this._nArmourCap)
                this._nArmour += nArmourRegenAmount;
                
            // Regen hull
            if(this._nHull < this._nHullCap)
                this._nHull += nHullRegenAmount;
                
            // Check if shields should regen
            if(this._nShieldRegen <= 0 && this._nShields < this._nShieldCap)
            {
                // Regen shields
                this._nShields += (this._nShieldCap / 1000) * nElapsedTime; // Regen in 1 second
                
                // Make sure shields dont overflow
                if(this._nShields > this._nShieldCap)
                    this._nShields = this._nShieldCap;
            }

            // Just to be safe...
            if(this._nShields < 0)
                this._nShields = 0;
                
            // Just to be safe...
            if(this._nShields > this._nShieldCap)
                this._nShields = this._nShieldCap;
                
            // Just to be safe...
            if(this._nArmour < 0)
                this._nArmour = 0;
                
            // Just to be safe...
            if(this._nArmour > this._nArmourCap)
                this._nArmour = this._nArmourCap;
                
            // Just to be safe...
            if(this._nHull < 0)
                this._nHull = 0;
                
            // Just to be safe...
            if(this._nHull > this._nHullCap)
                this._nHull = this._nHullCap;
        }

        ///
        /// PROPERTIES
        ///

        get shieldPercent(): number {
            if(this._nShields === 0)
                return 0;

            return (this._nShields / this._nShieldCap) * 100;
        }

        get armourPercent(): number {
            if(this._nArmour === 0)
                return 0;

            return (this._nArmour / this._nArmourCap) * 100;
        }

        get hullPercent(): number {
            if(this._nHull === 0)
                return 0;

            return (this._nHull / this._nHullCap) * 100;
        }

        get accelleration(): number {
            return this._nAccelleration;
        }

        get rotationSpeed(): number {
            return this._nRotationSpeed;
        }

        get maxSpeed(): number {
            return this._nMaxSpeed;
        }

        get maxShields(): number {
            return this._nShieldCap;
        }

        get shields(): number {
            return this._nShields;
        }

        get maxArmour(): number {
            return this._nArmourCap;
        }

        get armour(): number {
            return this._nArmour;
        }

        get maxHull(): number {
            return this._nHullCap;
        }

        get hull(): number {
            return this._nHull;
        }
    }
}