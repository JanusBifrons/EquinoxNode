namespace FireHare.Equinox {
    export class Helper {
        static WrapRotation(nRotation: number): number {
            while(nRotation < -Math.PI)
            {
                nRotation += (Math.PI * 2);
            }
            
            while(nRotation > Math.PI)
            {
                nRotation -= (Math.PI * 2);
            }
            
            return nRotation;
        }

        static Clamp(nNumber: number, nMin: number, nMax: number): number {
            if(nNumber > nMax)
            {	
                return nMax;
            }
            
            if(nNumber < nMin)
            {	
                return nMin;
            }
            
            return nNumber;
        }
    }
}