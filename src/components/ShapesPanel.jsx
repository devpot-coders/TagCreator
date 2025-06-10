import React, { useState, useEffect, useRef } from 'react';
import { Canvas as FabricCanvas, Rect, Circle, Textbox, Polygon, Path, Line } from "fabric";
import * as fabric from 'fabric';

const ShapesPanel = ({ onDragStart }) => {
  const [activeTab, setActiveTab] = useState('shapes');
  const previewRefs = useRef({});

     // Increase preview size
  const PREVIEW_SIZE = 100; // Increased from 40
  const PREVIEW_CONTAINER_SIZE = 100; // Increased container size for better visibility

  const shapes = [
    { id: 'rectangle', name: 'Rectangle' },
    { id: 'circle', name: 'Circle' },
    { id: 'triangle', name: 'Triangle' },
    { id: 'star', name: 'Star' },
    { id: 'hexagon', name: 'Hexagon' },
    { id: 'octagon', name: 'Octagon' },
    // { id: 'heart', name: 'Heart' },
    { id: 'diamond', name: 'Diamond' },
    { id: 'plus', name: 'Plus' },
    { id: 'cross', name: 'Cross' },
    { id: 'rightTriangle', name: 'Right Triangle' },
    { id: 'roundedRectangle', name: 'Rounded Rectangle' },
    { id: 'cloud', name: 'Cloud' },
    { id: 'pentagon', name: 'Pentagon' },
    { id: 'heptagon', name: 'Heptagon' },
  ];

  const arrows = [
    { id: 'rightArrow', name: 'Right Arrow' },
    { id: 'leftArrow', name: 'Left Arrow' },
    { id: 'upArrow', name: 'Up Arrow' },
    { id: 'downArrow', name: 'Down Arrow' },
    { id: 'upRightArrow', name: 'Up Right Arrow' },
    { id: 'upLeftArrow', name: 'Up Left Arrow' },
    { id: 'downRightArrow', name: 'Down Right Arrow' },
    { id: 'downLeftArrow', name: 'Down Left Arrow' },
  ];

  const handleDragStart = (e, tool) => {
    e.dataTransfer.setData('tool', tool);
    onDragStart(tool);
  };

  // Create preview canvases for shapes and arrows
  useEffect(() => {
    const createPreview = (id, type) => {
      const canvas = new fabric.Canvas(`preview-${id}`, {
        width: PREVIEW_SIZE,
        height: PREVIEW_SIZE,
        backgroundColor: 'transparent',
        selection: false,
        renderOnAddRemove: true,
      });

      let object;
      if (type === 'shape') {
        object = SHAPES[id](PREVIEW_SIZE/2, PREVIEW_SIZE/2);
        // Special handling for cloud shape
        if (id === 'cloud') {
          object.scale(1.5); // Adjust scale for better visibility
        } else {
          object.scale(1);
        }
      } else {
        object = ARROWS[id](PREVIEW_SIZE/2, PREVIEW_SIZE/2);
        object.scale(0.5);
      }

      object.set({
        selectable: false,
        evented: false,
        hasControls: false,
        hasBorders: false,
      });

      canvas.add(object);
      canvas.centerObject(object);
      canvas.renderAll();

      previewRefs.current[id] = canvas;
    };

    // Cleanup previous canvases
    Object.values(previewRefs.current).forEach(canvas => {
      canvas.dispose();
    });
    previewRefs.current = {};

    // Create previews for the active tab
    if (activeTab === 'shapes') {
      shapes.forEach(shape => createPreview(shape.id, 'shape'));
    } else {
      arrows.forEach(arrow => createPreview(arrow.id, 'arrow'));
    }

    return () => {
      // Cleanup canvases
      Object.values(previewRefs.current).forEach(canvas => {
        canvas.dispose();
      });
    };
  }, [activeTab]);

  return (
    <div className="w-full bg-white border-l border-border p-4 flex flex-col">
      <div className="flex mb-4 border-b border-border">
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'shapes'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('shapes')}
        >
          Shapes
        </button>
        <button
          className={`flex-1 py-2 px-4 text-sm font-medium ${
            activeTab === 'arrows'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('arrows')}
        >
          Arrows
        </button>
      </div>

      <div className=" h-[60vh] grid grid-cols-2 gap-4 overflow-y-scroll">
        {activeTab === 'shapes'
          ? shapes.map((shape) => (
              <div
                key={shape.id}
                draggable
                onDragStart={(e) => handleDragStart(e, shape.id)}
                className="flex flex-col items-center p-3 border border-border rounded hover:bg-gray-50 cursor-move"
              >
                <div className="w-100 h-full mb-1">
                  <canvas 
                    id={`preview-${shape.id}`} 
                    className='pointer-events-none'
                    draggable="false"
                  />
                </div>
                <span className="text-sm text-gray-600">{shape.name}</span>
              </div>
            ))
          : arrows.map((arrow) => (
              <div
                key={arrow.id}
                draggable
                onDragStart={(e) => handleDragStart(e, arrow.id)}
                className="flex flex-col items-center p-3 border border-border rounded hover:bg-gray-50 cursor-move"
              >
                <div className="w-10 h-full mb-1">
                  <canvas 
                    id={`preview-${arrow.id}`} 
                    className='pointer-events-none'
                    draggable="false"
                  />
                </div>
                <span className="text-sm text-gray-600">{arrow.name}</span>
              </div>
            ))}
      </div>
    </div>
  );
};

// Import shape and arrow definitions from DesignCanvas
const SHAPES = {
  rectangle: (left, top) => new Rect({
    left,
    top,
    width: 100,
    height: 50,
    fill: "#15D7FF",
    stroke: "#15D7FF",
    strokeWidth: 1,
    transparentCorners: false,
    cornerColor: "#15D7FF",
    cornerSize: 10,
    hasRotatingPoint: true,
  }),
  circle: (left, top) => new Circle({
    left,
    top,
    radius: 25,
    fill: "#15D7FF",
    stroke: "#15D7FF",
    strokeWidth: 1,
    transparentCorners: false,
    cornerColor: "#15D7FF",
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
      fill: "#15D7FF",
      stroke: "#15D7FF",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#15D7FF",
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
      fill: "#15D7FF",
      stroke: "#15D7FF",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#15D7FF",
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
      fill: "#15D7FF",
      stroke: "#15D7FF",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#15D7FF",
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
      fill: "#15D7FF",
      stroke: "#15D7FF",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#15D7FF",
      cornerSize: 10,
      hasRotatingPoint: true,
    });
  },
//   heart: (left, top) => {
//     const pathData = `M ${left + 25} ${top + 20} C ${left + 25} ${top + 20}, ${left + 10} ${top}, ${left + 10} ${top + 10} C ${left + 10} ${top + 20}, ${left + 25} ${top + 30}, ${left + 25} ${top + 30} C ${left + 25} ${top + 30}, ${left + 40} ${top + 20}, ${left + 40} ${top + 10} C ${left + 40} ${top}, ${left + 25} ${top + 20}, ${left + 25} ${top + 20} Z`;
//     return new Path(pathData, {
//       fill: "#3b82f6",
//       stroke: "#1e40af",
//       strokeWidth: 1,
//       transparentCorners: false,
//       cornerColor: "#3b82f6",
//       cornerSize: 10,
//       hasRotatingPoint: true,
//     });
//   },
  diamond: (left, top) => {
    const points = [
      { x: left + 25, y: top },
      { x: left + 50, y: top + 25 },
      { x: left + 25, y: top + 50 },
      { x: left, y: top + 25 }
    ];
    return new Polygon(points, {
      fill: "#15D7FF",
      stroke: "#15D7FF",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#15D7FF",
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
      fill: "#15D7FF",
      stroke: "#15D7FF",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#15D7FF",
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
      fill: "#15D7FF",
      stroke: "#15D7FF",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#15D7FF",
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
      fill: "#15D7FF",
      stroke: "#15D7FF",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#15D7FF",
      cornerSize: 10,
      hasRotatingPoint: true,
    });
  },
  roundedRectangle: (left, top) => new Rect({
    left,
    top,
    width: 100,
    height: 50,
    fill: "#15D7FF",
    stroke: "#15D7FF",
    strokeWidth: 1,
    rx: 10,
    ry: 10,
    transparentCorners: false,
    cornerColor: "#15D7FF",
    cornerSize: 10,
    hasRotatingPoint: true,
  }),
  cloud: (left, top) => {
    const pathData = `M ${left + 40} ${top + 20}
      C ${left + 25} ${top + 5}, ${left + 5} ${top + 10}, ${left + 10} ${top + 25}
      C ${left + 0} ${top + 35}, ${left + 10} ${top + 45}, ${left + 25} ${top + 40}
      C ${left + 35} ${top + 50}, ${left + 50} ${top + 40}, ${left + 50} ${top + 30}
      C ${left + 55} ${top + 15}, ${left + 40} ${top + 20}, ${left + 40} ${top + 20} Z`;
    return new Path(pathData, {
      fill: "#15D7FF",
      stroke: "#15D7FF",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#15D7FF",
      cornerSize: 10,
      hasRotatingPoint: true,
      scaleX: 1,
      scaleY: 1,
    });
  },
  pentagon: (left, top) => {
    const points = [];
    const sides = 5;
    const radius = 25;
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      points.push({
        x: left + radius * Math.cos(angle),
        y: top + radius * Math.sin(angle)
      });
    }
    return new Polygon(points, {
      fill: "#15D7FF",
      stroke: "#15D7FF",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#15D7FF",
      cornerSize: 10,
      hasRotatingPoint: true,
    });
  },
  heptagon: (left, top) => {
    const points = [];
    const sides = 7;
    const radius = 25;
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides;
      points.push({
        x: left + radius * Math.cos(angle),
        y: top + radius * Math.sin(angle)
      });
    }
    return new Polygon(points, {
      fill: "#15D7FF",
      stroke: "#15D7FF",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#15D7FF",
      cornerSize: 10,
      hasRotatingPoint: true,
    });
  }
};

const ARROWS = {
  config: {
    defaultSize: 100,
    defaultColor: '#15D7FF',
    headLengthRatio: 0.5,
    stemWidthRatio: 0.2,
    diagonalStemWidthRatio: 0.2
  },
  getArrowOptions: function(color) {
    return {
      fill: color,
      stroke: color,
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
    return hex;
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

    const points = [
      { x: left, y: top + headLength },
      { x: left + size / 2, y: top },
      { x: left + size, y: top + headLength },
      { x: left + size / 2 + halfStem, y: top + headLength },
      { x: left + size / 2 + halfStem, y: top + size },
      { x: left + size / 2 - halfStem, y: top + size },
      { x: left + size / 2 - halfStem, y: top + headLength }
    ];

    const cx = left + size / 2;
    const cy = top + size / 2;
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

    const points = [
      { x: left, y: top + headLength },
      { x: left + size / 2, y: top },
      { x: left + size, y: top + headLength },
      { x: left + size / 2 + halfStem, y: top + headLength },
      { x: left + size / 2 + halfStem, y: top + size },
      { x: left + size / 2 - halfStem, y: top + size },
      { x: left + size / 2 - halfStem, y: top + headLength }
    ];

    const cx = left + size / 2;
    const cy = top + size / 2;
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

    const points = [
      { x: left, y: top + size - headLength },
      { x: left + size / 2, y: top + size },
      { x: left + size, y: top + size - headLength },
      { x: left + size / 2 + halfStem, y: top + size - headLength },
      { x: left + size / 2 + halfStem, y: top },
      { x: left + size / 2 - halfStem, y: top },
      { x: left + size / 2 - halfStem, y: top + size - headLength }
    ];

    const cx = left + size / 2;
    const cy = top + size / 2;
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

    const points = [
      { x: left, y: top + size - headLength },
      { x: left + size / 2, y: top + size },
      { x: left + size, y: top + size - headLength },
      { x: left + size / 2 + halfStem, y: top + size - headLength },
      { x: left + size / 2 + halfStem, y: top },
      { x: left + size / 2 - halfStem, y: top },
      { x: left + size / 2 - halfStem, y: top + size - headLength }
    ];

    const cx = left + size / 2;
    const cy = top + size / 2;
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

export default ShapesPanel; 