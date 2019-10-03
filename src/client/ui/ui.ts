namespace FireHare.Equinox {
    export class UI {
        constructor() {

        }

        public static DrawServerDisconnect(cCanvas: Canvas) {
            cCanvas.moveToScreenSpace();

            cCanvas.drawText("SERVER DISCONNECTED", cCanvas.screenCenter, Colour.White);
        }

        public static DrawStatistics(cCanvas: Canvas, cStats: Stats) {        
            UI.DrawStatBar(cCanvas, cStats.shieldPercent, 80, Colour.Blue);
            UI.DrawStatBar(cCanvas, cStats.armourPercent, 60, Colour.Grey);
            UI.DrawStatBar(cCanvas, cStats.hullPercent, 40, Colour.Red);
        }

        public static DrawStatBar(cCanvas: Canvas, nPercent: number, nRadius: number, cColour: Colour) {
            const nX: number = cCanvas.canvasWidth / 2;
            const nY: number = cCanvas.canvasHeight;

            const cStatPosition: Vector = new Vector(nX, nY);
            
            // Border
            cCanvas.drawArc(cStatPosition, nRadius, 23, Math.PI, Math.PI * 2, Colour.White);
            
            // Background
            cCanvas.drawArc(cStatPosition, nRadius, 20, Math.PI, Math.PI * 2, Colour.Black);
            
            // Stat
            cCanvas.drawArc(cStatPosition, nRadius, 20, Math.PI, Math.PI + (Math.PI * (nPercent / 100)), cColour);
        }
    }
}