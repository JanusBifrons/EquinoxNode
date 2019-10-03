namespace FireHare.Equinox {
    export class District {
        static DISTRICT_MIN: Vector = new Vector(0, 0);
        static DISTRICT_MAX: Vector = new Vector(500, 500);

        static LimitPositionToDistrict(cVector: Vector): Vector {
            let nX: number = cVector.X;
            let nY: number = cVector.Y;

            if(cVector.X < District.DISTRICT_MIN.X)
                nX = District.DISTRICT_MAX.X;

            if(cVector.Y < District.DISTRICT_MIN.Y)
                nY = District.DISTRICT_MAX.Y;

            if(cVector.X > District.DISTRICT_MAX.X)
                nX = District.DISTRICT_MIN.X;

            if(cVector.Y > District.DISTRICT_MAX.Y)
                nY = District.DISTRICT_MIN.Y;

            return new Vector(nX, nY);
        }

        static RandomSpawn(): Vector {
            let cPosition: Vector = new Vector(Random.Next(0, District.DISTRICT_MAX.X), Random.Next(0, District.DISTRICT_MAX.Y));
            return cPosition;
        }

        static draw(cCanvas: Canvas) {
            
        }

        static drawGrid(cCanvas: Canvas, cOffset: Vector) {
            let nSize: number = 5000;
            let nGridSize: number = 10;
            let nSmallGridSize: number = 10;
            let nThick: number = 2;
            let nThin: number = 1;

            let nX: number = (Math.round(cOffset.X / nSize) * nSize) - (nSize * (nGridSize / 2));
            let nY: number = (Math.round(cOffset.Y / nSize) * nSize) - (nSize * (nGridSize / 2));
            let nSmallX: number = 0;
            let nSmallY: number = 0;

            let m_kContext: CanvasRenderingContext2D = cCanvas.context;
            
            m_kContext.strokeStyle = 'darkgray';

            // Draw first two lines
            cCanvas.moveToWorldSpace();
            m_kContext.beginPath();
            m_kContext.lineWidth = nThick;
            m_kContext.moveTo(nX, nY);
            m_kContext.lineTo(nX + (nSize * nGridSize), nY);
            m_kContext.moveTo(nX, nY);
            m_kContext.lineTo(nX, nY + (nSize * nGridSize));
            m_kContext.stroke();
            cCanvas.moveToScreenSpace();

            for(var i = 0; i < nGridSize; i++)
            {		
                nSmallX = nX;
                nSmallY = nY;
                
                cCanvas.moveToWorldSpace();
                
                for(var j = 0; j < nSmallGridSize; j++)
                {			
                    m_kContext.beginPath();
                    m_kContext.lineWidth = nThin;
                    m_kContext.moveTo(nSmallX, nSmallY);
                    m_kContext.lineTo(nSmallX + (nSize * nGridSize), nSmallY);
                    m_kContext.stroke();	
                    
                    nSmallY += (nSize / nSmallGridSize);
                }

                nY += nSize;

                m_kContext.beginPath();
                m_kContext.lineWidth = nThick;
                m_kContext.moveTo(nX, nY);
                m_kContext.lineTo(nX + (nSize * nGridSize), nY);
                m_kContext.stroke();
                
                cCanvas.moveToScreenSpace();
            }

            nX = (Math.round(cOffset.X / nSize) * nSize) - (nSize * (nGridSize / 2));
            nY = (Math.round(cOffset.Y / nSize) * nSize) - (nSize * (nGridSize / 2));

            for(var i = 0; i < nGridSize; i++)
            {		
                nSmallX = nX;
                nSmallY = nY;
                
                cCanvas.moveToWorldSpace();
                
                for(var j = 0; j < nSmallGridSize; j++)
                {			
                    m_kContext.beginPath();
                    m_kContext.lineWidth = nThin;
                    m_kContext.moveTo(nSmallX, nSmallY);
                    m_kContext.lineTo(nSmallX, nSmallY + (nSize * nGridSize));
                    m_kContext.stroke();	
                    
                    nSmallX += (nSize / nSmallGridSize);
                }

                nX += nSize;

                m_kContext.beginPath();
                m_kContext.lineWidth = nThick;
                m_kContext.moveTo(nX, nY);
                m_kContext.lineTo(nX, nY + (nSize * nGridSize));
                m_kContext.stroke();
                
                cCanvas.moveToScreenSpace();
            }
        }
    }
}