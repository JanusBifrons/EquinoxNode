namespace FireHare.Asteroids {
    export class UI {
        constructor() {

        }

        public drawStatistics(cCanvas: Canvas, cStats: Stats) {        
            
            this.drawStatBar(cCanvas, cStats.shieldPercent, 80, Colour.Blue);
            this.drawStatBar(cCanvas, cStats.armourPercent, 60, Colour.Grey);
            this.drawStatBar(cCanvas, cStats.hullPercent, 40, Colour.Red);
            
            // var _x = (m_kCanvas.width / 2) - 100;
            // var _y = m_kCanvas.height - 30;
            // var _speedPercent = this.m_iSpeed / this.m_iMaxSpeed;
            
            // // Draw the speed
            // m_kContext.lineWidth = 2;
            // m_kContext.fillStyle = 'white';
            
            // // Border and Background
            // m_kContext.fillStyle = 'white';
            // m_kContext.fillRect(_x, _y, 200, 25);
            
            // m_kContext.fillStyle = 'black';
            // m_kContext.fillRect(_x + 2, _y + 2, 194, 21);
            
            // m_kContext.fillStyle = 'purple';
            // m_kContext.fillRect(_x + 2, _y + 2, 194 * _speedPercent, 21);
            
            // var _roundedSpeed = Math.round(this.m_iSpeed * 100) / 100;
            
            // m_kContext.fillStyle = 'white';
            // m_kContext.font="10px Verdana";
            // m_kContext.fillText(_roundedSpeed + " M/S", _x + 90, _y + 15);	
        }

        private drawStatBar(cCanvas: Canvas, nPercent: number, nRadius: number, cColour: Colour) {
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