import React, { useEffect, useRef } from 'react';
import jsPDF from 'jspdf';

const CanvasToPDF = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Draw a rectangle on the canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear first (in case of re-renders)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a red rectangle
    ctx.fillStyle = 'red';
    ctx.fillRect(50, 50, 200, 100); // x, y, width, height
  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imageData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('rectangle.pdf');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <canvas
        ref={canvasRef}
        id="myCanvas"
        width={400}
        height={300}
        style={{ border: '1px solid #000' }}
      ></canvas>
      <br />
      <button onClick={handleDownload} style={{ marginTop: '20px' }}>
        Download PDF
      </button>
    </div>
  );
};

export default CanvasToPDF;
