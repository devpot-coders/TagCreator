import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Rect, Circle, Textbox, Polygon, Path, Line } from "fabric";
import * as fabric from 'fabric';
import ShapesPanel from './ShapesPanel';
import ObjectSettingsPanel from './ObjectSettingsPanel';

// Shape definitions
const SHAPES = {
  rectangle: (left, top, fillColor = "#15D7FF") => new Rect({
    left,
    top,
    width: 100,
    height: 50,
    fill: fillColor,
    stroke: 'transparent',
    strokeWidth: 1,
    transparentCorners: false,
    cornerColor: fillColor,
    cornerSize: 10,
    hasRotatingPoint: true,
  }),
  circle: (left, top, fillColor = "#15D7FF") => new Circle({
    left,
    top,
    radius: 25,
    fill: fillColor,
    stroke: 'transparent',
    strokeWidth: 1,
    transparentCorners: false,
    cornerColor: fillColor,
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
  heart: (left, top) => {
    const pathData = `M ${left + 25} ${top + 20} C ${left + 25} ${top + 20}, ${left + 10} ${top}, ${left + 10} ${top + 10} C ${left + 10} ${top + 20}, ${left + 25} ${top + 30}, ${left + 25} ${top + 30} C ${left + 25} ${top + 30}, ${left + 40} ${top + 20}, ${left + 40} ${top + 10} C ${left + 40} ${top}, ${left + 25} ${top + 20}, ${left + 25} ${top + 20} Z`;
    return new Path(pathData, {
      fill: "#15D7FF",
      stroke: "#15D7FF",
      strokeWidth: 1,
      transparentCorners: false,
      cornerColor: "#15D7FF",
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
    const pathData = "M 221.78,92.51 C 205.15,92.51 191.56,106.1 191.56,122.73 C 191.56,123.01 191.59,123.29 191.59,123.57 C 185.06,120.35 178.69,119.78 172.58,121.28 C 163.63,123.51 158.41,130.04 156.44,138.86 C 153.22,136.27 149.33,134.82 145.44,134.82 C 137.66,134.82 131.63,140.85 131.63,148.62 C 131.63,148.62 131.63,148.62 131.63,148.62 C 131.63,156.4 137.66,162.43 145.44,162.43 C 145.44,162.43 145.44,162.43 145.44,162.43 C 153.22,162.43 159.25,156.4 159.25,148.62 C 159.25,148.62 159.25,148.62 159.25,148.62 C 163.63,153.64 169.37,157.6 175.79,157.6 C 183.05,157.6 189.65,152.09 191.56,145.49 C 195.45,147.24 200.73,148.62 206.58,148.62 C 218.42,148.62 228.02,139.02 228.02,127.18 C 228.02,127.18 228.02,127.18 228.02,127.18 C 228.02,115.34 218.42,105.74 206.58,105.74 C 206.58,105.74 206.58,105.74 206.58,105.74 C 214.36,105.74 220.39,99.71 220.39,91.93 C 220.39,91.93 220.39,91.93 220.39,91.93 C 220.39,84.15 214.36,78.12 206.58,78.12 C 206.58,78.12 206.58,78.12 206.58,78.12 C 206.58,70.35 212.61,64.32 220.39,64.32 C 220.39,64.32 220.39,64.32 220.39,64.32 C 228.17,64.32 234.2,70.35 234.2,78.12 C 234.2,78.12 234.2,78.12 234.2,78.12 C 234.2,85.9 228.17,91.93 220.39,91.93 C 220.39,91.93 220.39,91.93 220.39,91.93 Z";
    const scale = 0.2; // Adjust scale as needed
    return new Path(pathData, {
      left,
      top,
      scaleX: scale,
      scaleY: scale,
      fill: "#15D7FF",
      stroke: "#15D7FF",
      strokeWidth: 1 / scale, // Adjust stroke width for scaling
      transparentCorners: false,
      cornerColor: "#15D7FF",
      cornerSize: 10,
      hasRotatingPoint: true,
    });
  },
  cross2: (left, top) => {
    const points = [
      { x: left + 10, y: top },
      { x: left + 15, y: top },
      { x: left + 15, y: top + 10 },
      { x: left + 25, y: top + 10 },
      { x: left + 25, y: top + 15 },
      { x: left + 15, y: top + 15 },
      { x: left + 15, y: top + 25 },
      { x: left + 10, y: top + 25 },
      { x: left + 10, y: top + 15 },
      { x: left, y: top + 15 },
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
    const pathData = "M 221.78,92.51 C 205.15,92.51 191.56,106.1 191.56,122.73 C 191.56,123.01 191.59,123.29 191.59,123.57 C 185.06,120.35 178.69,119.78 172.58,121.28 C 163.63,123.51 158.41,130.04 156.44,138.86 C 153.22,136.27 149.33,134.82 145.44,134.82 C 137.66,134.82 131.63,140.85 131.63,148.62 C 131.63,148.62 131.63,148.62 131.63,148.62 C 131.63,156.4 137.66,162.43 145.44,162.43 C 145.44,162.43 145.44,162.43 145.44,162.43 C 153.22,162.43 159.25,156.4 159.25,148.62 C 159.25,148.62 159.25,148.62 159.25,148.62 C 163.63,153.64 169.37,157.6 175.79,157.6 C 183.05,157.6 189.65,152.09 191.56,145.49 C 195.45,147.24 200.73,148.62 206.58,148.62 C 218.42,148.62 228.02,139.02 228.02,127.18 C 228.02,127.18 228.02,127.18 228.02,127.18 C 228.02,115.34 218.42,105.74 206.58,105.74 C 206.58,105.74 206.58,105.74 206.58,105.74 C 214.36,105.74 220.39,99.71 220.39,91.93 C 220.39,91.93 220.39,91.93 220.39,91.93 C 220.39,84.15 214.36,78.12 206.58,78.12 C 206.58,78.12 206.58,78.12 206.58,78.12 C 206.58,70.35 212.61,64.32 220.39,64.32 C 220.39,64.32 220.39,64.32 220.39,64.32 C 228.17,64.32 234.2,70.35 234.2,78.12 C 234.2,78.12 234.2,78.12 234.2,78.12 C 234.2,85.9 228.17,91.93 220.39,91.93 C 220.39,91.93 220.39,91.93 220.39,91.93 Z";
    const scale = 0.2; // Adjust scale as needed
    return new Path(pathData, {
      left,
      top,
      scaleX: scale,
      scaleY: scale,
      fill: "#15D7FF",
      stroke: "#15D7FF",
      strokeWidth: 1 / scale, // Adjust stroke width for scaling
      transparentCorners: false,
      cornerColor: "#15D7FF",
      cornerSize: 10,
      hasRotatingPoint: true,
    });
  },
  cross2: (left, top) => {
    const points = [
      { x: left + 10, y: top },
      { x: left + 15, y: top },
      { x: left + 15, y: top + 10 },
      { x: left + 25, y: top + 10 },
      { x: left + 25, y: top + 15 },
      { x: left + 15, y: top + 15 },
      { x: left + 15, y: top + 25 },
      { x: left + 10, y: top + 25 },
      { x: left + 10, y: top + 15 },
      { x: left, y: top + 15 },
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
  }
};

// Arrow definitions
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

export const DesignCanvas = ({
  activeTool,
  canvasSize,
  onObjectSelect,
  onToolChange,
  selectedImage,
  onCanvasReady
}) => {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [settingsIconPosition, setSettingsIconPosition] = useState(null);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [settingsPanelPosition, setSettingsPanelPosition] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new FabricCanvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: "#ffffff",
      });
  
      // Expose the fabric canvas instance to the canvas element
      canvasRef.current.fabricCanvas = canvas;
  
      // Pass the canvas instance to the parent
      onCanvasReady?.(canvas);
  
      // Add grid
      const gridSize = 24; // Size of each grid square
      const gridColor = "#e5e7eb"; // Light gray color for grid lines
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
      const rulerSize = 20; // Height of horizontal ruler, width of vertical ruler
      const rulerColor = "#000000"; // Gray color for ruler text
      const rulerBg = "#f3f4f6"; // Light gray background for rulers
  
      // Horizontal ruler (top)
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
  
      // Vertical ruler (left)
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
  
      // Add ruler measurements (numbers)
      // Horizontal ruler numbers
      for (let i = 0; i <= gridWidth; i += gridSize) {
        const text = new Textbox(i.toString(), {
          left: i - 5, // Center the number
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
  
      // Vertical ruler numbers
      for (let i = 0; i <= gridHeight; i += gridSize) {
        const text = new Textbox(i.toString(), {
          left: -rulerSize + 5,
          top: i - 5, // Center the number
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
          setSettingsIconPosition({
            left: obj.getBoundingRect().left + obj.getBoundingRect().width - 12,
            top: obj.getBoundingRect().top - 10
          });
        } else {
          setSettingsIconPosition(null);
        }
      });

      canvas.on("selection:updated", (e) => {
        onObjectSelect(e.selected?.[0]);
        if (e.selected?.[0]) {
          const obj = e.selected[0];
          setSettingsIconPosition({
            left: obj.getBoundingRect().left + obj.getBoundingRect().width - 12,
            top: obj.getBoundingRect().top - 10
          });
        } else {
          setSettingsIconPosition(null);
        }
      });

      canvas.on("selection:cleared", () => {
        onObjectSelect(null);
        setSettingsIconPosition(null);
      });

      // Track all object modifications
      canvas.on("object:modified", (e) => {
        onObjectSelect(e.target);
        if (e.target) {
          setSettingsIconPosition({
            left: e.target.getBoundingRect().left + e.target.getBoundingRect().width - 12,
            top: e.target.getBoundingRect().top - 10
          });
        }
        saveState();
      });

      // Track object movement
      canvas.on("object:moving", (e) => {
        if (e.target) {
          saveState();
          if (e.target === canvas.getActiveObject()) {
            setSettingsIconPosition({
              left: e.target.getBoundingRect().left + e.target.getBoundingRect().width - 12,
              top: e.target.getBoundingRect().top - 10
            });
          }
        }
      });

      // Track object scaling
      canvas.on("object:scaling", (e) => {
        if (e.target) {
          saveState();
          if (e.target === canvas.getActiveObject()) {
            setSettingsIconPosition({
              left: e.target.getBoundingRect().left + e.target.getBoundingRect().width - 12,
              top: e.target.getBoundingRect().top - 10
            });
          }
        }
      });

      // Track object rotation
      canvas.on("object:rotating", (e) => {
        if (e.target) {
          saveState();
          if (e.target === canvas.getActiveObject()) {
            setSettingsIconPosition(null);
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

      setFabricCanvas(canvas);
    }
  }, [canvasSize.width, canvasSize.height]);

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
  
      setSettingsIconPosition({
        left: fabricImg.getBoundingRect().left + fabricImg.getBoundingRect().width - 12,
        top: fabricImg.getBoundingRect().top - 10
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
        }
      } catch (error) {
        console.error('Error in handleClick:', error);
      }
    };
    
    if (activeTool !== "select" && activeTool !== "text") {
      fabricCanvas.on("mouse:down", handleClick);
    }

    return () => {
      fabricCanvas.off("mouse:down", handleClick);
    };
  }, [activeTool, fabricCanvas, onToolChange, selectedImage]);

  // Add text tool selection functionality
  // Update the text tool useEffect in your DesignCanvas component
useEffect(() => {
  if (!fabricCanvas || activeTool !== "text") return;

  let isSelecting = false;
  let startPoint = null;
  let selectionRect = null;

  const handleMouseDown = (e) => {
    if (fabricCanvas.getActiveObject()) return;
    
    isSelecting = true;
    startPoint = e.pointer;
    
    selectionRect = new Rect({
      left: startPoint.x,
      top: startPoint.y,
      width: 0,
      height: 0,
      fill: 'rgba(0, 0, 0, 0.1)',
      stroke: '#000000',
      strokeWidth: 1,
      selectable: false,
      evented: false
    });
    
    fabricCanvas.add(selectionRect);
  };

  const handleMouseMove = (e) => {
    if (!isSelecting || !selectionRect) return;
    
    const currentPoint = e.pointer;
    const width = Math.abs(currentPoint.x - startPoint.x);
    const height = Math.abs(currentPoint.y - startPoint.y);
    
    selectionRect.set({
      width: width,
      height: height,
      left: Math.min(startPoint.x, currentPoint.x),
      top: Math.min(startPoint.y, currentPoint.y)
    });
    
    fabricCanvas.requestRenderAll();
  };

  const handleMouseUp = () => {
    if (!isSelecting || !selectionRect) return;
    
    isSelecting = false;
    
    // Get the exact dimensions of the selection
    const selectedWidth = selectionRect.width;
    const selectedHeight = selectionRect.height;
    const selectedLeft = selectionRect.left;
    const selectedTop = selectionRect.top;
    
    // Remove the selection rectangle
    fabricCanvas.remove(selectionRect);
    
    // Create textbox with fixed dimensions
    const textbox = new Textbox("", {
      left: selectedLeft,
      top: selectedTop,
      width: selectedWidth,
      height: selectedHeight,
      fontSize: 16,
      fill: "#000000",
      fontFamily: "Arial",
      transparentCorners: false,
      cornerColor: "#000000",
      cornerSize: 10,
      hasRotatingPoint: true,
      selectable: true,
      editable: true,
      textAlign: 'left',
      // Critical properties to maintain dimensions:
      lockScalingX: true,       // Prevent horizontal scaling
      lockScalingY: true,       // Prevent vertical scaling
      lockUniScaling: true,     // Prevent uniform scaling
      splitByGrapheme: true,    // Better text handling
      fixedWidth: selectedWidth, // Explicit fixed width
      fixedHeight: selectedHeight, // Explicit fixed height
      autoResize: false,        // Prevent auto-resizing
      // Visual overflow handling:
      overflow: "scroll",      // Hide text that overflows
      clipTo: function(ctx) {   // Clip text to the bounds
        ctx.rect(
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height
        );
      }
    });

    // Force the height immediately after creation
    textbox.set({
      height: selectedHeight,
      scaleY: 1
    });

    // Add event handlers to maintain dimensions
    textbox.on('changed', function() {
      // Force maintain original dimensions
      this.set({
        height: selectedHeight,
        scaleY: 1
      });
    });

    textbox.on('scaling', function() {
      // Immediately reset any scaling attempts
      this.set({
        height: selectedHeight,
        scaleY: 1
      });
    });

    // Add to canvas and set active
    fabricCanvas.add(textbox);
    fabricCanvas.setActiveObject(textbox);
    
    // Switch to select tool and enter editing
    onToolChange("select");
    textbox.enterEditing();
    
    // Focus the textbox immediately
    textbox.hiddenTextarea.focus();
    
    fabricCanvas.requestRenderAll();
  };

  fabricCanvas.on("mouse:down", handleMouseDown);
  fabricCanvas.on("mouse:move", handleMouseMove);
  fabricCanvas.on("mouse:up", handleMouseUp);

  return () => {
    fabricCanvas.off("mouse:down", handleMouseDown);
    fabricCanvas.off("mouse:move", handleMouseMove);
    fabricCanvas.off("mouse:up", handleMouseUp);
  };
}, [activeTool, fabricCanvas]);

  // Add line tool functionality
  useEffect(() => {
    if (!fabricCanvas || activeTool !== "line") return;

    let isDrawing = false;
    let line = null;

    const handleMouseDown = (e) => {
      if (fabricCanvas.getActiveObject()) return;
      
      isDrawing = true;
      const pointer = fabricCanvas.getPointer(e.e);
      
      line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
        stroke: "#15D7FF",
        strokeWidth: 2,
        selectable: true,
        transparentCorners: false,
        cornerColor: "#15D7FF",
        cornerSize: 10,
        hasRotatingPoint: true,
      });
      
      fabricCanvas.add(line);
    };

    const handleMouseMove = (e) => {
      if (!isDrawing || !line) return;
      
      const pointer = fabricCanvas.getPointer(e.e);
      line.set({
        x2: pointer.x,
        y2: pointer.y
      });
      
      fabricCanvas.requestRenderAll();
    };

    const handleMouseUp = () => {
      if (!isDrawing || !line) return;
      
      isDrawing = false;
      
      // If the line is too short, remove it
      const dx = line.x2 - line.x1;
      const dy = line.y2 - line.y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length < 5) {
        fabricCanvas.remove(line);
      } else {
        // Switch to select tool after drawing a valid line
        onToolChange("select");
      }
      
      line = null;
      fabricCanvas.requestRenderAll();
    };

    fabricCanvas.on("mouse:down", handleMouseDown);
    fabricCanvas.on("mouse:move", handleMouseMove);
    fabricCanvas.on("mouse:up", handleMouseUp);

    return () => {
      fabricCanvas.off("mouse:down", handleMouseDown);
      fabricCanvas.off("mouse:move", handleMouseMove);
      fabricCanvas.off("mouse:up", handleMouseUp);
    };
  }, [activeTool, fabricCanvas]);

  // Add drawing functionality
  useEffect(() => {
    if (!fabricCanvas) return;

    // Initialize free drawing brush
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = "#000000";
    fabricCanvas.freeDrawingBrush.width = 2;

    if (activeTool === "pencil") {
      fabricCanvas.isDrawingMode = true;
    } else {
      fabricCanvas.isDrawingMode = false;
    }

    return () => {
      fabricCanvas.isDrawingMode = false;
    };
  }, [activeTool, fabricCanvas]);

  // Add keyboard shortcuts for delete and other operations
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleKeyDown = (e) => {
      const activeObject = fabricCanvas.getActiveObject();
      
      // If we're editing text, don't handle delete/backspace
      if (activeObject && activeObject.isEditing) {
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (activeObject) {
          fabricCanvas.remove(activeObject);
          fabricCanvas.requestRenderAll();
          onObjectSelect(null);
          setSettingsIconPosition(null);
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

  const handleDragStart = (tool) => {
    onToolChange(tool);
  };

  const handleCanvasClick = (e) => {
    if (activeTool === "shape" && selectedShape) {
      const pointer = fabricCanvas.getPointer(e.e);
      const shape = SHAPES[selectedShape](pointer.x, pointer.y, fillColor);
      fabricCanvas.add(shape);
      fabricCanvas.setActiveObject(shape);
      fabricCanvas.requestRenderAll();
    }
  };

  return (
    <div className="flex h-full w-full">
      <div
        className="border border-border rounded-lg shadow-lg bg-white relative flex-1"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const tool = e.dataTransfer.getData("tool");
          if (fabricCanvas && (SHAPES[tool] || ARROWS[tool])) {
            const pointer = fabricCanvas.getPointer(e);
            const left = pointer.x;
            const top = pointer.y;

            if (SHAPES[tool]) {
              const shape = SHAPES[tool](left - 25, top - 25);
              fabricCanvas.add(shape);
              fabricCanvas.setActiveObject(shape);
            } else if (ARROWS[tool]) {
              const arrow = ARROWS[tool](left - 25, top - 25);
              fabricCanvas.add(arrow);
              fabricCanvas.setActiveObject(arrow);
            }
            fabricCanvas.requestRenderAll();
            onToolChange("select");
          }
        }}
      >
        <canvas ref={canvasRef} className="block" />
        {settingsIconPosition && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent canvas selection from clearing
              setShowSettingsPanel(!showSettingsPanel);
              setSettingsPanelPosition({
                left: settingsIconPosition.left + 24, // Position to the right of the icon
                top: settingsIconPosition.top,
              });
            }}
            className="absolute z-50 bg-gray-500 hover:bg-gray-600 text-white rounded-full p-1 shadow-lg transition-colors"
            style={{
              left: `${settingsIconPosition.left}px`,
              top: `${settingsIconPosition.top}px`,
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
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        )}
        {showSettingsPanel && (
          <ObjectSettingsPanel
            fabricCanvas={fabricCanvas}
            selectedObject={fabricCanvas?.getActiveObject()}
            position={settingsPanelPosition}
            onClose={() => setShowSettingsPanel(false)}
          />
        )}
      </div>
      <ShapesPanel onDragStart={handleDragStart} />
    </div>
  );
};
