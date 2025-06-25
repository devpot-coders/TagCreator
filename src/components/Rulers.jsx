import { useEffect, useRef, useState } from "react";

export const HorizontalRuler = ({ width, mouseX, showGuideline, zoom = 1, onRulerMouseMove, onRulerMouseLeave }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = 30 * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = "30px";
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, 30);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, 30);
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 29.5);
    ctx.lineTo(width, 29.5);
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Fixed spacing between major ruler lines (100px)
    const majorRulerUnitPx = 100;
    const minorDivisions = 10;
    const smallestTickPx = majorRulerUnitPx / minorDivisions;

    // Calculate number of major units needed to cover the width
    const numMajorUnits = Math.floor(width / majorRulerUnitPx) ;

    // Loop for major ticks and numbers
    for (let unit = 0; unit <= numMajorUnits; unit++) {
      const x = unit * majorRulerUnitPx;

      ctx.strokeStyle = "black";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(x, 10); // Longest tick
      ctx.lineTo(x, 30);
      
      let textX = x;
      if (unit === 0) {
        textX = x + 5; // Shift '0' slightly right
        ctx.textAlign = "left";
      } else {
        ctx.textAlign = "center";
      }
      ctx.fillText(unit, textX, 5); // Print the unit number
      ctx.textAlign = "center"; // Reset for subsequent numbers
      ctx.stroke();

      // Draw minor ticks within this major unit
      for (let subUnit = 1; subUnit < minorDivisions; subUnit++) {
        const minorX = x + (subUnit * smallestTickPx);
        if (minorX > width + 0.5) continue;

        ctx.beginPath();
        if (subUnit === minorDivisions / 2) { // Half-unit mark
          ctx.moveTo(minorX, 15); // Medium tick
        } else { // Minor tick
          ctx.moveTo(minorX, 20); // Short tick
        }
        ctx.lineTo(minorX, 30);
        ctx.stroke();
      }
    }

    if (showGuideline && mouseX !== null && mouseX >= 0 && mouseX <= width) {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mouseX, 0);
      ctx.lineTo(mouseX, 30);
      ctx.stroke();
    }
  }, [width, mouseX, showGuideline, zoom]);

  return (
    <canvas
      ref={canvasRef}
      className="border-r border-border bg-background ms-[30px]"
      style={{ display: "block" }}
      onMouseMove={e => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.round((e.clientX - rect.left) / zoom);
        onRulerMouseMove && onRulerMouseMove(x);
      }}
      onMouseLeave={onRulerMouseLeave}
    />
  );
};

export const VerticalRuler = ({ height, mouseY, showGuideline, zoom = 1, onRulerMouseMove, onRulerMouseLeave }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 30 * dpr;
    canvas.height = height * dpr;
    canvas.style.width = "30px";
    canvas.style.height = `${height}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, 30, height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 30, height);
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(29.5, 0);
    ctx.lineTo(29.5, height);
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Fixed spacing between major ruler lines (100px)
    const majorRulerUnitPx = 100;
    const minorDivisions = 10;
    const smallestTickPx = majorRulerUnitPx / minorDivisions;

    // Calculate number of major units needed to cover the height
    const numMajorUnits = Math.floor(height / majorRulerUnitPx) + 1;

    for (let unit = 0; unit <= numMajorUnits; unit++) {
      const y = unit * majorRulerUnitPx;

      ctx.strokeStyle = "black";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(10, y); // Longest tick
      ctx.lineTo(30, y);
      
      ctx.save();
      let textY = y;
      if (unit === 0) {
        ctx.translate(5, textY + 5); // Shift '0' slightly down
      } else {
        ctx.translate(5, textY);
      }
      ctx.rotate(-Math.PI / 2); // Rotate text for vertical ruler
      ctx.fillText(unit, 0, 0); // Print the unit number
      ctx.restore();
      ctx.stroke();

      // Draw minor ticks within this major unit
      for (let subUnit = 1; subUnit < minorDivisions; subUnit++) {
        const minorY = y + (subUnit * smallestTickPx);
        if (minorY > height + 0.5) continue; // Prevent drawing beyond ruler height

        ctx.beginPath();
        if (subUnit === minorDivisions / 2) { // Half-unit mark
          ctx.moveTo(15, minorY); // Medium tick
        } else { // Minor tick
          ctx.moveTo(20, minorY); // Short tick
        }
        ctx.lineTo(30, minorY);
        ctx.stroke();
      }
    }

    if (showGuideline && mouseY !== null && mouseY >= 0 && mouseY <= height) {
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mouseY);
      ctx.lineTo(30, mouseY);
      ctx.stroke();
    }
  }, [height, mouseY, showGuideline, zoom]);

  return (
    <canvas
      ref={canvasRef}
      className="border-b border-border bg-background"
      style={{ display: "block" }}
      onMouseMove={e => {
        const rect = canvasRef.current.getBoundingClientRect();
        const y = Math.round((e.clientY - rect.top) / zoom);
        onRulerMouseMove && onRulerMouseMove(y);
      }}
      onMouseLeave={onRulerMouseLeave}
    />
  );
};
