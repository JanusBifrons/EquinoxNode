namespace FireHare {
    export class Random {
        static Next(nMin: number = 0, nMax: number = 0): number {
            return Math.random() * (nMax - nMin) + nMin;
        }
    }
}