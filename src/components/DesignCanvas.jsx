import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Rect, Circle, Textbox, Polygon, Path, Line } from "fabric";
import * as fabric from 'fabric';

// Shape definitions
const SHAPES = {
  rectangle: (left, top) => new Rect({
    left,
    top,
    width: 100,
    height: 50,
    fill: "#3b82f6",
    stroke: "#1e40af",
    strokeWidth: 1,
    transparentCorners: false,
    cornerColor: "#3b82f6",
    cornerSize: 10,
    hasRotatingPoint: true,
  }),
  circle: (left, top) => new Circle({
    left,
    top,
    radius: 25,
    fill: "#3b82f6",
    stroke: "#1e40af",
    strokeWidth: 1,
    transparentCorners: false,
    cornerColor: "#3b82f6",
    cornerSize: 10,
    hasRotatingPoint: true,
  }),
  star: (left, top) => {
    const points = [];
    const spikes = 5;
    const outerRadius = 25;
    const innerRadius = 12;
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      points.push({
        x: left + radius * Math.cos(angle),
        y: top + radius * Math.sin(angle)
      });
    }
    return new Polygon(points, {
      fill: "#3b82f6",
      stroke: "#1e40af",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#3b82f6",
      cornerSize: 10,
      hasRotatingPoint: true,
    });
  },
  triangle: (left, top) => {
    const points = [
      { x: left, y: top + 50 },
      { x: left + 50, y: top },
      { x: left + 100, y: top + 50 }
    ];
    return new Polygon(points, {
      fill: "#3b82f6",
      stroke: "#1e40af",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#3b82f6",
      cornerSize: 10,
      hasRotatingPoint: true,
    });
  },
  hexagon: (left, top) => {
    const points = [];
    const sides = 6;
    const radius = 25;
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      points.push({
        x: left + radius * Math.cos(angle),
        y: top + radius * Math.sin(angle)
      });
    }
    return new Polygon(points, {
      fill: "#3b82f6",
      stroke: "#1e40af",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#3b82f6",
      cornerSize: 10,
      hasRotatingPoint: true,
    });
  },
  octagon: (left, top) => {
    const points = [];
    const sides = 8;
    const radius = 25;
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      points.push({
        x: left + radius * Math.cos(angle),
        y: top + radius * Math.sin(angle)
      });
    }
    return new Polygon(points, {
      fill: "#3b82f6",
      stroke: "#1e40af",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#3b82f6",
      cornerSize: 10,
      hasRotatingPoint: true,
    });
  },
  heart: (left, top) => {
    const pathData = `M ${left + 25} ${top + 20} C ${left + 25} ${top + 20}, ${left + 10} ${top}, ${left + 10} ${top + 10} C ${left + 10} ${top + 20}, ${left + 25} ${top + 30}, ${left + 25} ${top + 30} C ${left + 25} ${top + 30}, ${left + 40} ${top + 20}, ${left + 40} ${top + 10} C ${left + 40} ${top}, ${left + 25} ${top + 20}, ${left + 25} ${top + 20} Z`;
    return new Path(pathData, {
      fill: "#3b82f6",
      stroke: "#1e40af",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#3b82f6",
      cornerSize: 10,
      hasRotatingPoint: true,
    });
  },
  diamond: (left, top) => {
    const points = [
      { x: left + 25, y: top },
      { x: left + 50, y: top + 25 },
      { x: left + 25, y: top + 50 },
      { x: left, y: top + 25 }
    ];
    return new Polygon(points, {
      fill: "#3b82f6",
      stroke: "#1e40af",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#3b82f6",
      cornerSize: 10,
      hasRotatingPoint: true,
    });
  },
  plus: (left, top) => {
    const points = [
      { x: left + 20, y: top },
      { x: left + 30, y: top },
      { x: left + 30, y: top + 20 },
      { x: left + 50, y: top + 20 },
      { x: left + 50, y: top + 30 },
      { x: left + 30, y: top + 30 },
      { x: left + 30, y: top + 50 },
      { x: left + 20, y: top + 50 },
      { x: left + 20, y: top + 30 },
      { x: left, y: top + 30 },
      { x: left, y: top + 20 },
      { x: left + 20, y: top + 20 }
    ];
    return new Polygon(points, {
      fill: "#3b82f6",
      stroke: "#1e40af",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#3b82f6",
      cornerSize: 10,
      hasRotatingPoint: true,
    });
  },
  cross: (left, top) => {
    const points = [
      { x: left + 10, y: top },
      { x: left + 20, y: top },
      { x: left + 20, y: top + 10 },
      { x: left + 30, y: top + 10 },
      { x: left + 30, y: top + 20 },
      { x: left + 20, y: top + 20 },
      { x: left + 20, y: top + 30 },
      { x: left + 10, y: top + 30 },
      { x: left + 10, y: top + 20 },
      { x: left, y: top + 20 },
      { x: left, y: top + 10 },
      { x: left + 10, y: top + 10 }
    ];
    return new Polygon(points, {
      fill: "#3b82f6",
      stroke: "#1e40af",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#3b82f6",
      cornerSize: 10,
      hasRotatingPoint: true,
    });
  },
  rightTriangle: (left, top) => {
    const points = [
      { x: left, y: top },
      { x: left + 50, y: top },
      { x: left, y: top + 50 }
    ];
    return new Polygon(points, {
      fill: "#3b82f6",
      stroke: "#1e40af",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#3b82f6",
      cornerSize: 10,
      hasRotatingPoint: true,
    });
  }
};

// Arrow definitions
const ARROWS = {
  config: {
    defaultSize: 100,
    defaultColor: '#3b82f6',
    headLengthRatio: 0.5,
    stemWidthRatio: 0.2,
    diagonalStemWidthRatio: 0.2
  },
  getArrowOptions: function(color) {
    return {
      fill: color,
      stroke: this.darkenColor(color),
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: color,
      cornerSize: 10,
      hasRotatingPoint: true,
      originX: 'left',
      originY: 'top',
      objectCaching: false
    };
  },
  darkenColor: function(hex, amount = 0.2) {
    // Simple color darkening - replace with more robust solution if needed
    return hex; // Placeholder - implement proper color manipulation
  },

  rightArrow: function(left = 0, top = 0, size = this.config.defaultSize, color = this.config.defaultColor) {
    const headLength = size * this.config.headLengthRatio;
    const stemWidth = size * this.config.stemWidthRatio;
    
    const points = [
      { x: left, y: top + size/2 - stemWidth/2 },
      { x: left + size - headLength, y: top + size/2 - stemWidth/2 },
      { x: left + size - headLength, y: top },
      { x: left + size, y: top + size/2 },
      { x: left + size - headLength, y: top + size },
      { x: left + size - headLength, y: top + size/2 + stemWidth/2 },
      { x: left, y: top + size/2 + stemWidth/2 }
    ];
    
    return new Polygon(points, this.getArrowOptions(color));
  },
  leftArrow: function(left = 0, top = 0, size = this.config.defaultSize, color = this.config.defaultColor) {
    const headLength = size * this.config.headLengthRatio;
    const stemWidth = size * this.config.stemWidthRatio;
    
    const points = [
      { x: left + size, y: top + size/2 - stemWidth/2 },
      { x: left + headLength, y: top + size/2 - stemWidth/2 },
      { x: left + headLength, y: top },
      { x: left, y: top + size/2 },
      { x: left + headLength, y: top + size },
      { x: left + headLength, y: top + size/2 + stemWidth/2 },
      { x: left + size, y: top + size/2 + stemWidth/2 }
    ];
    
    return new Polygon(points, this.getArrowOptions(color));
  },
  upArrow: function(left = 0, top = 0, size = this.config.defaultSize, color = this.config.defaultColor) {
    const headLength = size * this.config.headLengthRatio;
    const stemWidth = size * this.config.stemWidthRatio;
    
    const points = [
      { x: left + size/2 - stemWidth/2, y: top + size },
      { x: left + size/2 - stemWidth/2, y: top + headLength },
      { x: left, y: top + headLength },
      { x: left + size/2, y: top },
      { x: left + size, y: top + headLength },
      { x: left + size/2 + stemWidth/2, y: top + headLength },
      { x: left + size/2 + stemWidth/2, y: top + size }
    ];
    
    return new Polygon(points, this.getArrowOptions(color));
  },
  downArrow: function(left = 0, top = 0, size = this.config.defaultSize, color = this.config.defaultColor) {
    const headLength = size * this.config.headLengthRatio;
    const stemWidth = size * this.config.stemWidthRatio;
    
    const points = [
      { x: left + size/2 - stemWidth/2, y: top },
      { x: left + size/2 - stemWidth/2, y: top + size - headLength },
      { x: left, y: top + size - headLength },
      { x: left + size/2, y: top + size },
      { x: left + size, y: top + size - headLength },
      { x: left + size/2 + stemWidth/2, y: top + size - headLength },
      { x: left + size/2 + stemWidth/2, y: top }
    ];
    
    return new Polygon(points, this.getArrowOptions(color));
  },
  upRightArrow: function(left = 0, top = 0, size = this.config.defaultSize, color = this.config.defaultColor) {
    const headLength = size * this.config.headLengthRatio;
    const stemWidth = size * this.config.stemWidthRatio;
    const halfStem = stemWidth / 2;

    // Build original up-arrow points
    const points = [
        { x: left, y: top + headLength },
        { x: left + size / 2, y: top },
        { x: left + size, y: top + headLength },
        { x: left + size / 2 + halfStem, y: top + headLength },
        { x: left + size / 2 + halfStem, y: top + size },
        { x: left + size / 2 - halfStem, y: top + size },
        { x: left + size / 2 - halfStem, y: top + headLength }
    ];

    // Center of rotation — around the center of the arrow box
    const cx = left + size / 2;
    const cy = top + size / 2;

    // Rotate each point by 45°
    const cos = Math.SQRT1_2;
    const sin = Math.SQRT1_2;

    const rotatedPoints = points.map(p => {
        const dx = p.x - cx;
        const dy = p.y - cy;
        return {
            x: cx + (dx * cos - dy * sin),
            y: cy + (dx * sin + dy * cos)
        };
    });

    return new Polygon(rotatedPoints, this.getArrowOptions(color));
},
upLeftArrow: function(left = 0, top = 0, size = this.config.defaultSize, color = this.config.defaultColor) {
  const headLength = size * this.config.headLengthRatio;
  const stemWidth = size * this.config.stemWidthRatio;
  const halfStem = stemWidth / 2;

  // 1. Build regular "up" arrow shape
  const points = [
      // Triangle head
      { x: left, y: top + headLength },
      { x: left + size / 2, y: top },
      { x: left + size, y: top + headLength },

      // Rectangular stem
      { x: left + size / 2 + halfStem, y: top + headLength },
      { x: left + size / 2 + halfStem, y: top + size },
      { x: left + size / 2 - halfStem, y: top + size },
      { x: left + size / 2 - halfStem, y: top + headLength }
  ];

  // 2. Rotation center (middle of the box)
  const cx = left + size / 2;
  const cy = top + size / 2;

  // -45° rotation
  const angle = -Math.PI / 4;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const rotatedPoints = points.map(p => {
      const dx = p.x - cx;
      const dy = p.y - cy;
      return {
          x: cx + dx * cos - dy * sin,
          y: cy + dx * sin + dy * cos
      };
  });

  return new Polygon(rotatedPoints, this.getArrowOptions(color));
},
downRightArrow: function(left = 0, top = 0, size = this.config.defaultSize, color = this.config.defaultColor) {
  const headLength = size * this.config.headLengthRatio;
  const stemWidth = size * this.config.stemWidthRatio;
  const halfStem = stemWidth / 2;

  // 1. Build a vertical down arrow shape (before rotation)
  const points = [
      // Triangle head
      { x: left, y: top + size - headLength },
      { x: left + size / 2, y: top + size },
      { x: left + size, y: top + size - headLength },

      // Rectangular stem
      { x: left + size / 2 + halfStem, y: top + size - headLength },
      { x: left + size / 2 + halfStem, y: top },
      { x: left + size / 2 - halfStem, y: top },
      { x: left + size / 2 - halfStem, y: top + size - headLength }
  ];

  // 2. Rotation center (middle of the arrow box)
  const cx = left + size / 2;
  const cy = top + size / 2;

  // +45° rotation
  const angle = -Math.PI / 4;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const rotatedPoints = points.map(p => {
      const dx = p.x - cx;
      const dy = p.y - cy;
      return {
          x: cx + dx * cos - dy * sin,
          y: cy + dx * sin + dy * cos
      };
  });

  return new Polygon(rotatedPoints, this.getArrowOptions(color));
},

downLeftArrow: function(left = 0, top = 0, size = this.config.defaultSize, color = this.config.defaultColor) {
  const headLength = size * this.config.headLengthRatio;
  const stemWidth = size * this.config.stemWidthRatio;
  const halfStem = stemWidth / 2;

  // 1. Build a vertical down arrow shape (before rotation)
  const points = [
      // Triangle head
      { x: left, y: top + size - headLength },
      { x: left + size / 2, y: top + size },
      { x: left + size, y: top + size - headLength },

      // Rectangular stem
      { x: left + size / 2 + halfStem, y: top + size - headLength },
      { x: left + size / 2 + halfStem, y: top },
      { x: left + size / 2 - halfStem, y: top },
      { x: left + size / 2 - halfStem, y: top + size - headLength }
  ];

  // 2. Rotation center (middle of the arrow box)
  const cx = left + size / 2;
  const cy = top + size / 2;

  // +45° rotation
  const angle = Math.PI / 4;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const rotatedPoints = points.map(p => {
      const dx = p.x - cx;
      const dy = p.y - cy;
      return {
          x: cx + dx * cos - dy * sin,
          y: cy + dx * sin + dy * cos
      };
  });

  return new Polygon(rotatedPoints, this.getArrowOptions(color));
}
};

export const DesignCanvas = ({ activeTool, canvasSize, onObjectSelect, onToolChange, selectedImage }) => {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [deleteIconPosition, setDeleteIconPosition] = useState(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
      });

      // Add grid
      const gridSize = 24;
      const gridColor = "#e5e7eb";
      const gridWidth = canvas.width;
      const gridHeight = canvas.height;

      // Draw vertical grid lines
      for (let i = 0; i <= gridWidth; i += gridSize) {
        canvas.add(new Line([i, 0, i, gridHeight], {
          stroke: gridColor,
          selectable: false,
          evented: false,
        }));
      }

      // Draw horizontal grid lines
      for (let i = 0; i <= gridHeight; i += gridSize) {
        canvas.add(new Line([0, i, gridWidth, i], {
          stroke: gridColor,
          selectable: false,
          evented: false,
        }));
      }

      // Add rulers
      const rulerSize = 20;
      const rulerColor = "#9ca3af";
      const rulerBg = "#f3f4f6";

      // Horizontal ruler
      const horizontalRuler = new Rect({
        left: 0,
        top: -rulerSize,
        width: gridWidth,
        height: rulerSize,
        fill: rulerBg,
        selectable: false,
        evented: false,
      });
      canvas.add(horizontalRuler);

      // Vertical ruler
      const verticalRuler = new Rect({
        left: -rulerSize,
        top: 0,
        width: rulerSize,
        height: gridHeight,
        fill: rulerBg,
        selectable: false,
        evented: false,
      });
      canvas.add(verticalRuler);

      // Add ruler measurements
      for (let i = 0; i <= gridWidth; i += gridSize) {
        const text = new Textbox(i.toString(), {
          left: i - 5,
          top: -rulerSize + 5,
          fontSize: 10,
          fill: rulerColor,
          selectable: false,
          evented: false,
          width: 20,
          textAlign: 'center',
        });
        canvas.add(text);
      }

      for (let i = 0; i <= gridHeight; i += gridSize) {
        const text = new Textbox(i.toString(), {
          left: -rulerSize + 5,
          top: i - 5,
          fontSize: 10,
          fill: rulerColor,
          selectable: false,
          evented: false,
          width: 20,
          textAlign: 'center',
        });
        canvas.add(text);
      }

      // Initialize history stack
      canvas.history = {
        undo: [],
        redo: [],
      };

      // Save state to history
      const saveState = () => {
        const json = JSON.stringify(canvas.toJSON());
        canvas.history.undo.push(json);
        canvas.history.redo = [];
        setCanUndo(true);
        setCanRedo(false);
      };

      // Enable object manipulation
      canvas.on("selection:created", (e) => {
        onObjectSelect(e.selected?.[0]);
        if (e.selected?.[0]) {
          const obj = e.selected[0];
          const width = obj.width * (obj.scaleX || 1);
          setDeleteIconPosition({
            left: obj.left + width + 10,
            top: obj.top - 10
          });
        } else {
          setDeleteIconPosition(null);
        }
      });

      canvas.on("selection:updated", (e) => {
        onObjectSelect(e.selected?.[0]);
        if (e.selected?.[0]) {
          const obj = e.selected[0];
          const width = obj.width * (obj.scaleX || 1);
          setDeleteIconPosition({
            left: obj.left + width + 10,
            top: obj.top - 10
          });
        } else {
          setDeleteIconPosition(null);
        }
      });

      canvas.on("selection:cleared", () => {
        onObjectSelect(null);
        setDeleteIconPosition(null);
      });

      // Track all object modifications
      canvas.on("object:modified", (e) => {
        onObjectSelect(e.target);
        if (e.target) {
          const width = e.target.width * (e.target.scaleX || 1);
          setDeleteIconPosition({
            left: e.target.left + width + 10,
            top: e.target.top - 10
          });
        }
        saveState();
      });

      // Track object movement
      canvas.on("object:moving", (e) => {
        if (e.target) {
          saveState();
          if (e.target === canvas.getActiveObject()) {
            const width = e.target.width * (e.target.scaleX || 1);
            setDeleteIconPosition({
              left: e.target.left + width + 10,
              top: e.target.top - 10
            });
          }
        }
      });

      // Track object scaling
      canvas.on("object:scaling", (e) => {
        if (e.target) {
          saveState();
          if (e.target === canvas.getActiveObject()) {
            const width = e.target.width * (e.target.scaleX || 1);
            setDeleteIconPosition({
              left: e.target.left + width + 10,
              top: e.target.top - 10
            });
          }
        }
      });

      // Track object rotation
      canvas.on("object:rotating", (e) => {
        if (e.target) {
          saveState();
          if (e.target === canvas.getActiveObject()) {
            const width = e.target.width * (e.target.scaleX || 1);
            setDeleteIconPosition({
              left: e.target.left + width + 10,
              top: e.target.top - 10
            });
          }
        }
      });

      // Track color changes
      canvas.on("object:changed", (e) => {
        if (e.target && (e.target.fill !== undefined || e.target.stroke !== undefined)) {
          saveState();
        }
      });

      // Save state when objects are added or removed
      canvas.on("object:added", saveState);
      canvas.on("object:removed", saveState);

      // Expose the fabric canvas instance to the canvas element
      canvasRef.current.fabricCanvas = canvas;

      setFabricCanvas(canvas);
    } catch (error) {
      console.error('Error initializing canvas:', error);
    }
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;
    
    fabricCanvas.setDimensions({
      width: canvasSize.width,
      height: canvasSize.height,
    });
  }, [canvasSize, fabricCanvas]);

  useEffect(() => {
    if (!fabricCanvas || !selectedImage || activeTool !== "image") return;
  
    const left = canvasSize.width / 4;
    const top = canvasSize.height / 4;
  
    const imgElement = new Image();
  
    imgElement.onload = () => {
      const fabricImg = new fabric.Image(imgElement, {
        left,
        top,
        transparentCorners: false,
        cornerColor: "#000000",
        cornerSize: 10,
        hasRotatingPoint: true,
        scaleX: 0.2,
        scaleY: 0.2,
        selectable: true,
        evented: true,
      });
  
      fabricCanvas.add(fabricImg);
      fabricCanvas.setActiveObject(fabricImg);
      fabricCanvas.requestRenderAll();
  
      setDeleteIconPosition({
        left: fabricImg.left + (fabricImg.width * fabricImg.scaleX) + 10,
        top: fabricImg.top - 10
      });
  
      onToolChange("select");
    };
  
    imgElement.onerror = () => {
      console.error("Failed to load the image element from base64");
    };
  
    imgElement.src = selectedImage;
  
  }, [selectedImage, fabricCanvas, activeTool, canvasSize, onToolChange]);
  
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleClick = (e) => {
      try {
        // Only create new shapes if there's no active object
        if (fabricCanvas.getActiveObject()) {
          return;
        }
        
        const left = e.pointer.x;
        const top = e.pointer.y;

        if (SHAPES[activeTool]) {
          const shape = SHAPES[activeTool](left - 25, top - 25);
          fabricCanvas.add(shape);
          fabricCanvas.setActiveObject(shape);
        } else if (ARROWS[activeTool]) {
          console.log('Creating arrow:', activeTool);
          const arrow = ARROWS[activeTool](left - 25, top - 25);
          console.log('Arrow created:', arrow);
          if (arrow) {
            fabricCanvas.add(arrow);
            fabricCanvas.setActiveObject(arrow);
            fabricCanvas.requestRenderAll();
          } else {
            console.error('Failed to create arrow');
          }
        } else if (activeTool === "text") {
          const text = new Textbox("Enter text", {
            left: e.pointer.x,
            top: e.pointer.y,
            fontSize: 16,
            fill: "#000000",
            fontFamily: "Arial",
            transparentCorners: false,
            cornerColor: "#000000",
            cornerSize: 10,
            hasRotatingPoint: true,
          });
          fabricCanvas.add(text);
          fabricCanvas.setActiveObject(text);
          text.enterEditing();
        }
      } catch (error) {
        console.error('Error in handleClick:', error);
      }
    };
    
    if (activeTool !== "select") {
      fabricCanvas.on("mouse:down", handleClick);
    }

    return () => {
      fabricCanvas.off("mouse:down", handleClick);
    };
  }, [activeTool, fabricCanvas, onToolChange, selectedImage]);

  // Add keyboard shortcuts for delete and other operations
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObject = fabricCanvas.getActiveObject();
        if (activeObject) {
          fabricCanvas.remove(activeObject);
          fabricCanvas.requestRenderAll();
          onObjectSelect(null);
          setDeleteIconPosition(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fabricCanvas, onObjectSelect]);

  // Add undo/redo methods
  const handleUndo = () => {
    if (!fabricCanvas || !canUndo) return;

    const currentState = JSON.stringify(fabricCanvas.toJSON());
    fabricCanvas.history.redo.push(currentState);
    setCanRedo(true);

    const previousState = fabricCanvas.history.undo.pop();
    if (previousState) {
      fabricCanvas.loadFromJSON(previousState, () => {
        fabricCanvas.requestRenderAll();
        setCanUndo(fabricCanvas.history.undo.length > 0);
      });
    }
  };

  const handleRedo = () => {
    if (!fabricCanvas || !canRedo) return;

    const currentState = JSON.stringify(fabricCanvas.toJSON());
    fabricCanvas.history.undo.push(currentState);
    setCanUndo(true);

    const nextState = fabricCanvas.history.redo.pop();
    if (nextState) {
      fabricCanvas.loadFromJSON(nextState, () => {
        fabricCanvas.requestRenderAll();
        setCanRedo(fabricCanvas.history.redo.length > 0);
      });
    }
  };

  // Expose undo/redo methods to parent components
  useEffect(() => {
    if (fabricCanvas) {
      fabricCanvas.handleUndo = handleUndo;
      fabricCanvas.handleRedo = handleRedo;
      fabricCanvas.canUndo = canUndo;
      fabricCanvas.canRedo = canRedo;
    }
  }, [fabricCanvas, canUndo, canRedo]);

  const handleDeleteClick = () => {
    if (fabricCanvas) {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        fabricCanvas.remove(activeObject);
        fabricCanvas.requestRenderAll();
        onObjectSelect(null);
        setDeleteIconPosition(null);
      }
    }
  };

  return (
    <div className="border border-border rounded-lg shadow-lg bg-white relative">
      <canvas ref={canvasRef} className="block" />
      {deleteIconPosition && (
        <button
          onClick={handleDeleteClick}
          className="absolute z-50 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
          style={{
            left: `${deleteIconPosition.left}px`,
            top: `${deleteIconPosition.top}px`,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
