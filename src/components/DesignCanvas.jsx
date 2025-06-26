import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Rect, Circle, Textbox, Polygon, Path, Line, Group } from "fabric";
import * as fabric from 'fabric';
import ShapesPanel from './ShapesPanel';
import ObjectSettingsPanel from './ObjectSettingsPanel';
import { XMLParser } from 'fast-xml-parser';
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import jsPDF from 'jspdf';

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

// Add this helper function before the DesignCanvas component
function addGridAndRulers(canvas) {
  // Remove any existing grid/ruler objects
  canvas.getObjects().forEach(obj => {
    if (obj.isGridOrRuler) canvas.remove(obj);
  });

  const gridSize = 24;
  const gridColor = "#9ca3af";
  const gridWidth = canvas.width;
  const gridHeight = canvas.height;

  // Draw vertical grid lines
  for (let i = 0; i <= gridWidth; i += gridSize) {
    const line = new fabric.Line([i, 0, i, gridHeight], {
      stroke: gridColor,
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
    });
    line.isGridOrRuler = true;
    canvas.add(line);
  }

  // Draw horizontal grid lines
  for (let i = 0; i <= gridHeight; i += gridSize) {
    const line = new fabric.Line([0, i, gridWidth, i], {
      stroke: gridColor,
      strokeWidth: 0.5,
      selectable: false,
      evented: false,
    });
    line.isGridOrRuler = true;
    canvas.add(line);
  }

  // Horizontal ruler (top)
  const horizontalRuler = new fabric.Rect({
    left: 0,
    top: -20,
    width: gridWidth,
    height: 20,
    fill: "#f3f4f6",
    selectable: false,
    evented: false,
  });
  horizontalRuler.isGridOrRuler = true;
  canvas.add(horizontalRuler);

  // Vertical ruler (left)
  const verticalRuler = new fabric.Rect({
    left: -20,
    top: 0,
    width: 20,
    height: gridHeight,
    fill: "#f3f4f6",
    selectable: false,
    evented: false,
  });
  verticalRuler.isGridOrRuler = true;
  canvas.add(verticalRuler);
}

function parseXamlToFabricObjects(xamlString, fabric) {
  console.log('Parsing XAML string:', xamlString.substring(0, 200) + '...');
  
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
  });
  
  try {
    const xaml = parser.parse(xamlString);
    const shapes = [];
    
    console.log('Parsed XAML structure:', xaml);
    
    // Parse shapes
    const items = xaml.DiagramItemCollection?.['telerik:RadDiagramShape'];
    if (items) {
      const shapeArray = Array.isArray(items) ? items : [items];
      console.log('Found shapes:', shapeArray.length);
      
      for (const shape of shapeArray) {
        try {
          const geometry = shape.Geometry;
          const x = parseFloat(shape.X || shape['av:Canvas.Left'] || 0);
          const y = parseFloat(shape.Y || shape['av:Canvas.Top'] || 0);
          const width = parseFloat(shape.Width || 100);
          const height = parseFloat(shape.Height || 100);
          
          // Check for av:Viewbox with image
          if (shape['av:Viewbox']) {
            const viewbox = shape['av:Viewbox'];
            let imageSource = null;
            if (viewbox.Image && viewbox.Image.Source) {
              imageSource = viewbox.Image.Source;
            } else if (viewbox.Source) {
              imageSource = viewbox.Source;
            }
            if (imageSource) {
              // Remove file:// if present (optional, may need to handle this differently in production)
              // let src = imageSource.replace(/^file:\/\//, '');
              // Use fabric.Image.fromURL (async)
              fabric.Image.fromURL(imageSource, (img) => {
                img.set({
                  left: x,
                  top: y,
                  width: width,
                  height: height,
                  selectable: true,
                  transparentCorners: false,
                  cornerColor: '#000000',
                  cornerSize: 10,
                  hasRotatingPoint: true,
                });
                if (window.__fabricCanvasInstance) {
                  window.__fabricCanvasInstance.add(img);
                  window.__fabricCanvasInstance.requestRenderAll();
                }
              }, { crossOrigin: 'anonymous' });
              // Continue to next shape, don't add geometry/text for this one
              continue;
            }
          }
          
          // Check if this shape has text content
          const textContent = shape['#text'];
          
          if (geometry) {
            const path = new fabric.Path(geometry, {
              left: x,
              top: y,
              width,
              height,
              fill: shape.Background || '#15D7FF',
              stroke: shape.Stroke || '#000',
              strokeWidth: parseFloat(shape.StrokeThickness || 1),
              selectable: true,
              transparentCorners: false,
              cornerColor: shape.Fill || '#15D7FF',
              cornerSize: 10,
              hasRotatingPoint: true,
            });
            
            // If this shape has text, create a group with shape and text
            if (textContent && textContent.trim()) {
              console.log('Found text in shape:', textContent);
              
              // Reset path position to be relative to the group's center
              path.set({ left: width / 2, top: height / 2, originX: 'center', originY: 'center' });

              const textbox = new fabric.Textbox(textContent, {
                left: width / 2, // Relative to the group
                top: height / 2, // Relative to the group
                fontSize: parseFloat(shape.FontSize || 18),
                fill: shape.Foreground || shape.TextColor || '#000',
                fontFamily: shape.FontFamily || 'Arial',
                fontWeight: shape.FontWeight || 'normal',
                textAlign: 'center',
                originX: 'center',
                originY: 'center',
                selectable: true,
                transparentCorners: false,
                cornerColor: shape.Foreground || shape.TextColor || '#000',
                cornerSize: 10,
                hasRotatingPoint: true,
              });
              
              // Create a group with the shape and text
              const group = new fabric.Group([path, textbox], {
                left: x,
                top: y,
                selectable: true,
                transparentCorners: false,
                cornerColor: shape.Fill || '#15D7FF',
                cornerSize: 10,
                hasRotatingPoint: true,
              });
              
              shapes.push(group);
            } else {
              // No text, just add the shape
              shapes.push(path);
            }
          } else if (textContent && textContent.trim()) {
            // If no geometry but has text, create a text-only element
            console.log('Found text-only shape:', textContent);
            const textbox = new fabric.Textbox(textContent, {
              left: x,
              top: y,
              width: width,
              height: height,
              fontSize: parseFloat(shape.FontSize || 18),
              fill: shape.Foreground || shape.TextColor || '#000',
              fontFamily: shape.FontFamily || 'Arial',
              fontWeight: shape.FontWeight || 'normal',
              textAlign: shape.TextAlign || 'left',
              originX: 'left',
              originY: 'top',
              selectable: true,
              transparentCorners: false,
              cornerColor: shape.Foreground || shape.TextColor || '#000',
              cornerSize: 10,
              hasRotatingPoint: true,
            });
            shapes.push(textbox);
          }
        } catch (shapeError) {
          console.error('Error parsing shape:', shapeError, shape);
        }
      }
    }
    
    // Parse text elements
    const textItems = xaml.DiagramItemCollection?.['telerik:RadDiagramText'];
    if (textItems) {
      const textArray = Array.isArray(textItems) ? textItems : [textItems];
      console.log('Found text items:', textArray.length);
      
      for (const textObj of textArray) {
        try {
          const text = textObj.Text || '';
          const x = parseFloat(textObj.X || textObj['av:Canvas.Left'] || 0);
          const y = parseFloat(textObj.Y || textObj['av:Canvas.Top'] || 0);
          const fontSize = parseFloat(textObj.FontSize || 18);
          const fill = textObj.Foreground || textObj.Fill || '#000';
          const fontFamily = textObj.FontFamily || 'Arial';
          const fontWeight = textObj.FontWeight || 'normal';
          
          const textbox = new fabric.Textbox(text, {
            left: x,
            top: y,
            fontSize,
            fill,
            fontFamily,
            fontWeight,
            selectable: true,
            transparentCorners: false,
            cornerColor: fill,
            cornerSize: 10,
            hasRotatingPoint: true,
          });
          shapes.push(textbox);
        } catch (textError) {
          console.error('Error parsing text:', textError, textObj);
        }
      }
    }
    
    // Parse image elements
    const imageItems = xaml.DiagramItemCollection?.['telerik:RadDiagramImage'];
    if (imageItems) {
      const imageArray = Array.isArray(imageItems) ? imageItems : [imageItems];
      console.log('Found image items:', imageArray.length);
      
      for (const imgObj of imageArray) {
        try {
          const src = imgObj.Source || imgObj.ImageSource;
          const x = parseFloat(imgObj.X || imgObj['av:Canvas.Left'] || 0);
          const y = parseFloat(imgObj.Y || imgObj['av:Canvas.Top'] || 0);
          const width = parseFloat(imgObj.Width || 100);
          const height = parseFloat(imgObj.Height || 100);
          
          if (src) {
            // Use fabric.Image.fromURL (async)
            fabric.Image.fromURL(src, (img) => {
              img.set({ 
                left: x, 
                top: y, 
                width: width,
                height: height,
                selectable: true,
                transparentCorners: false,
                cornerColor: '#000000',
                cornerSize: 10,
                hasRotatingPoint: true,
              });
              // Add to canvas directly since this is async
              if (window.__fabricCanvasInstance) {
                window.__fabricCanvasInstance.add(img);
                window.__fabricCanvasInstance.requestRenderAll();
              }
            }, { crossOrigin: 'anonymous' });
          }
        } catch (imageError) {
          console.error('Error parsing image:', imageError, imgObj);
        }
      }
    }
    
    // Parse line/connection elements
    const lineItems = xaml.DiagramItemCollection?.['telerik:RadDiagramConnection'];
    if (lineItems) {
      const lineArray = Array.isArray(lineItems) ? lineItems : [lineItems];
      console.log('Found line items:', lineArray.length);
      
      for (const lineObj of lineArray) {
        try {
          const x1 = parseFloat(lineObj.StartX || 0);
          const y1 = parseFloat(lineObj.StartY || 0);
          const x2 = parseFloat(lineObj.EndX || 100);
          const y2 = parseFloat(lineObj.EndY || 100);
          
          const line = new fabric.Line([x1, y1, x2, y2], {
            stroke: lineObj.Stroke || '#000',
            strokeWidth: parseFloat(lineObj.StrokeThickness || 2),
            selectable: true,
            transparentCorners: false,
            cornerColor: lineObj.Stroke || '#000',
            cornerSize: 10,
            hasRotatingPoint: true,
          });
          shapes.push(line);
        } catch (lineError) {
          console.error('Error parsing line:', lineError, lineObj);
        }
      }
    }
    
    // Parse arrow elements (as polylines)
    const arrowItems = xaml.DiagramItemCollection?.['telerik:RadDiagramArrow'];
    if (arrowItems) {
      const arrowArray = Array.isArray(arrowItems) ? arrowItems : [arrowItems];
      console.log('Found arrow items:', arrowArray.length);
      
      for (const arrowObj of arrowArray) {
        try {
          // Example: points as string "x1,y1 x2,y2 ..."
          const pointsStr = arrowObj.Points || '';
          const points = pointsStr.split(' ').map(pt => {
            const [x, y] = pt.split(',').map(Number);
            return { x, y };
          });
          
          const polyline = new fabric.Polyline(points, {
            stroke: arrowObj.Stroke || '#000',
            strokeWidth: parseFloat(arrowObj.StrokeThickness || 2),
            fill: arrowObj.Fill || '',
            selectable: true,
            transparentCorners: false,
            cornerColor: arrowObj.Stroke || '#000',
            cornerSize: 10,
            hasRotatingPoint: true,
          });
          shapes.push(polyline);
        } catch (arrowError) {
          console.error('Error parsing arrow:', arrowError, arrowObj);
        }
      }
    }
    
    // Parse rectangle elements
    const rectItems = xaml.DiagramItemCollection?.['telerik:RadDiagramRectangle'];
    if (rectItems) {
      const rectArray = Array.isArray(rectItems) ? rectItems : [rectItems];
      console.log('Found rectangle items:', rectArray.length);
      
      for (const rectObj of rectArray) {
        try {
          const x = parseFloat(rectObj.X || rectObj['av:Canvas.Left'] || 0);
          const y = parseFloat(rectObj.Y || rectObj['av:Canvas.Top'] || 0);
          const width = parseFloat(rectObj.Width || 100);
          const height = parseFloat(rectObj.Height || 50);
          const rx = parseFloat(rectObj.RadiusX || 0);
          const ry = parseFloat(rectObj.RadiusY || 0);
          
          const rect = new fabric.Rect({
            left: x,
            top: y,
            width,
            height,
            rx,
            ry,
            fill: rectObj.Fill || '#15D7FF',
            stroke: rectObj.Stroke || 'transparent',
            strokeWidth: parseFloat(rectObj.StrokeThickness || 1),
            selectable: true,
            transparentCorners: false,
            cornerColor: rectObj.Fill || '#15D7FF',
            cornerSize: 10,
            hasRotatingPoint: true,
          });
          shapes.push(rect);
        } catch (rectError) {
          console.error('Error parsing rectangle:', rectError, rectObj);
        }
      }
    }
    
    // Parse ellipse/circle elements
    const ellipseItems = xaml.DiagramItemCollection?.['telerik:RadDiagramEllipse'];
    if (ellipseItems) {
      const ellipseArray = Array.isArray(ellipseItems) ? ellipseItems : [ellipseItems];
      console.log('Found ellipse items:', ellipseArray.length);
      
      for (const ellipseObj of ellipseArray) {
        try {
          const x = parseFloat(ellipseObj.X || ellipseObj['av:Canvas.Left'] || 0);
          const y = parseFloat(ellipseObj.Y || ellipseObj['av:Canvas.Top'] || 0);
          const width = parseFloat(ellipseObj.Width || 50);
          const height = parseFloat(ellipseObj.Height || 50);
          
          const ellipse = new fabric.Ellipse({
            left: x + width / 2,
            top: y + height / 2,
            rx: width / 2,
            ry: height / 2,
            fill: ellipseObj.Fill || '#15D7FF',
            stroke: ellipseObj.Stroke || 'transparent',
            strokeWidth: parseFloat(ellipseObj.StrokeThickness || 1),
            selectable: true,
            transparentCorners: false,
            cornerColor: ellipseObj.Fill || '#15D7FF',
            cornerSize: 10,
            hasRotatingPoint: true,
          });
          shapes.push(ellipse);
        } catch (ellipseError) {
          console.error('Error parsing ellipse:', ellipseError, ellipseObj);
        }
      }
    }
    
    // Parse RadDiagramTextShape elements
    const textShapeItems = xaml.DiagramItemCollection?.['telerik:RadDiagramTextShape'];
    if (textShapeItems) {
      const textShapeArray = Array.isArray(textShapeItems) ? textShapeItems : [textShapeItems];
      console.log('Found RadDiagramTextShape items:', textShapeArray.length);
      for (const textShape of textShapeArray) {
        try {
          const text = textShape.Text || textShape['#text'] || '';
          const x = parseFloat(textShape.X || textShape['av:Canvas.Left'] || 0);
          const y = parseFloat(textShape.Y || textShape['av:Canvas.Top'] || 0);
          const width = parseFloat(textShape.Width || 100);
          const height = parseFloat(textShape.Height || 30);
          const fontSize = parseFloat(textShape.FontSize || 18);
          const fill = textShape.Foreground || textShape.Fill || '#000';
          const fontFamily = textShape.FontFamily || 'Arial';
          const fontWeight = textShape.FontWeight || 'normal';
          const textAlign = textShape.TextAlign || 'left';
          const textbox = new fabric.Textbox(text, {
            left: x,
            top: y,
            width,
            height,
            fontSize,
            fill,
            fontFamily,
            fontWeight,
            textAlign,
            originX: 'left',
            originY: 'top',
            selectable: true,
            transparentCorners: false,
            cornerColor: fill,
            cornerSize: 10,
            hasRotatingPoint: true,
          });
          shapes.push(textbox);
        } catch (err) {
          console.error('Error parsing RadDiagramTextShape:', err, textShape);
        }
      }
    }
    
    console.log('Total shapes parsed:', shapes.length);
    return shapes;
    
  } catch (error) {
    console.error('Error parsing XAML:', error);
    return [];
  }
}

const DesignCanvas = ({
  activeTool,
  canvasSize,
  onObjectSelect,
  onToolChange,
  selectedImage,
  onCanvasReady,
  strokeColor = "#ef4444",
  strokeWidth = 2,
  clipboard,
  setClipboard,
  initialConfig,
}) => {
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [settingsIconPosition, setSettingsIconPosition] = useState(null);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [settingsPanelPosition, setSettingsPanelPosition] = useState(null);
  // --- Coordinate label state ---
  const [coordLabel, setCoordLabel] = useState(null); // { x, y, left, top }
  const coordLabelTimeout = useRef(null);
  const [loading, setLoading] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      // Dispose of existing canvas if it exists
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }

      // Create new canvas
      const canvas = new FabricCanvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: "#ffffff",
        selection: true, // Ensure selection is enabled
        preserveObjectStacking: true,
      });
  
      // Expose the fabric canvas instance to the canvas element
      canvasRef.current.fabricCanvas = canvas;
  
      // Set global reference for async operations
      window.__fabricCanvasInstance = canvas;
  
      // Pass the canvas instance to the parent
      onCanvasReady?.(canvas);
  
      // Add grid and rulers
      addGridAndRulers(canvas);

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
        const selectedObject = e.selected?.[0];
        onObjectSelect(selectedObject);
        if (selectedObject) {
          setSettingsIconPosition({
            left: selectedObject.getBoundingRect().left + selectedObject.getBoundingRect().width - 12,
            top: selectedObject.getBoundingRect().top - 10
          });
        } else {
          setSettingsIconPosition(null);
        }
      });

      canvas.on("selection:updated", (e) => {
        const selectedObject = e.selected?.[0];
        onObjectSelect(selectedObject);
        if (selectedObject) {
          setSettingsIconPosition({
            left: selectedObject.getBoundingRect().left + selectedObject.getBoundingRect().width - 12,
            top: selectedObject.getBoundingRect().top - 10
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
        const modifiedObject = e.target;
        onObjectSelect(modifiedObject);
        if (modifiedObject) {
          setSettingsIconPosition({
            left: modifiedObject.getBoundingRect().left + modifiedObject.getBoundingRect().width - 12,
            top: modifiedObject.getBoundingRect().top - 10
          });
        }
        saveState();
        // --- Show coordinate label ---
        const obj = modifiedObject;
        const rect = obj.getBoundingRect();
        setCoordLabel({
          x: obj.left.toFixed(2),
          y: obj.top.toFixed(2),
          left: rect.left + rect.width / 2,
          top: rect.top + rect.height + 8 // below the object
        });
        if (coordLabelTimeout.current) clearTimeout(coordLabelTimeout.current);
        coordLabelTimeout.current = setTimeout(() => setCoordLabel(null), 0);
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
          // --- Show coordinate label ---
          const obj = e.target;
          const rect = obj.getBoundingRect();
          setCoordLabel({
            x: obj.left.toFixed(2),
            y: obj.top.toFixed(2),
            left: rect.left + rect.width / 2,
            top: rect.top + rect.height + 8 // below the object
          });
          if (coordLabelTimeout.current) clearTimeout(coordLabelTimeout.current);
          coordLabelTimeout.current = setTimeout(() => setCoordLabel(null), 4000);
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

      // Cleanup function
      return () => {
        canvas.dispose();
        // Clean up global reference
        if (window.__fabricCanvasInstance === canvas) {
          delete window.__fabricCanvasInstance;
        }
      };
    }
  }, [canvasSize.width, canvasSize.height]);

  useEffect(() => {
    if (fabricCanvas && initialConfig) {
      console.log('Loading initial config:', initialConfig);
      // Clear existing objects first
      fabricCanvas.clear();
      let loaded = false;
      try {
        // 1. If initialConfig.Content is XAML
        if (
          typeof initialConfig === 'object' &&
          initialConfig.Content &&
          typeof initialConfig.Content === 'string' &&
          initialConfig.Content.trim().startsWith('<DiagramItemCollection')
        ) {
          console.log('Loading XAML content from initialConfig.Content');
          const shapes = parseXamlToFabricObjects(initialConfig.Content, fabric);
          shapes.forEach(shape => fabricCanvas.add(shape));
          addGridAndRulers(fabricCanvas);
          fabricCanvas.requestRenderAll();
          loaded = true;
        }
        // 2. If initialConfig.Content is Fabric.js JSON
        else if (
          typeof initialConfig === 'object' &&
          initialConfig.Content &&
          typeof initialConfig.Content === 'object' &&
          initialConfig.Content.objects
        ) {
          console.log('Loading Fabric.js JSON from initialConfig.Content');
          fabricCanvas.loadFromJSON(initialConfig.Content, () => {
            addGridAndRulers(fabricCanvas);
            fabricCanvas.requestRenderAll();
            console.log('Fabric.js JSON loaded successfully');
            loaded = true;
          });
        }
        // 3. If initialConfig is Fabric.js JSON directly
        else if (
          typeof initialConfig === 'object' &&
          initialConfig.objects
        ) {
          // Validate objects array
          let validObjects = initialConfig.objects;
          if (Array.isArray(validObjects)) {
            validObjects = validObjects.filter(obj => obj && obj.type);
          }
          const toLoad = { ...initialConfig, objects: validObjects };
          console.log('Loading Fabric.js JSON directly from initialConfig (validated):', toLoad);
          fabricCanvas.loadFromJSON(toLoad, () => {
            addGridAndRulers(fabricCanvas);
            fabricCanvas.requestRenderAll();
            console.log('Fabric.js JSON loaded successfully');
            loaded = true;
          });
        }
        // 3b. If initialConfig is a plain array of objects
        else if (Array.isArray(initialConfig)) {
          console.log('Loading from array of objects');
          fabric.util.enlivenObjects(initialConfig, function(enlivenedObjects) {
            enlivenedObjects.forEach(o => fabricCanvas.add(o));
            addGridAndRulers(fabricCanvas);
            fabricCanvas.requestRenderAll();
          });
          loaded = true;
        }
        // 4. If initialConfig has a CanvasData property (backend format)
        else if (
          typeof initialConfig === 'object' &&
          initialConfig.CanvasData
        ) {
          console.log('Loading CanvasData from backend format');
          let canvasData = initialConfig.CanvasData;
          
          // Try to parse if it's a string
          if (typeof canvasData === 'string') {
            try {
              canvasData = JSON.parse(canvasData);
            } catch (e) {
              console.log('CanvasData is not JSON, treating as XAML');
              if (canvasData.trim().startsWith('<DiagramItemCollection')) {
                const shapes = parseXamlToFabricObjects(canvasData, fabric);
                shapes.forEach(shape => fabricCanvas.add(shape));
                addGridAndRulers(fabricCanvas);
                fabricCanvas.requestRenderAll();
                loaded = true;
                return;
              }
            }
          }
          
          // If it's a valid Fabric.js JSON
          if (typeof canvasData === 'object' && canvasData.objects) {
            fabricCanvas.loadFromJSON(canvasData, () => {
              addGridAndRulers(fabricCanvas);
              fabricCanvas.requestRenderAll();
              console.log('CanvasData loaded successfully');
              loaded = true;
            });
          }
        }
        // 6. If initialConfig has a config_1 property (alternative backend format)
        else if (
          typeof initialConfig === 'object' &&
          initialConfig.config_1
        ) {
          console.log('Loading config_1 from backend format');
          let configData = initialConfig.config_1;
          
          // Try to parse if it's a string
          if (typeof configData === 'string') {
            // If it's XAML, keep old logic
            if (configData.trim().startsWith('<DiagramItemCollection')) {
              const shapes = parseXamlToFabricObjects(configData, fabric);
              shapes.forEach(shape => fabricCanvas.add(shape));
              addGridAndRulers(fabricCanvas);
              fabricCanvas.requestRenderAll();
              loaded = true;
              return;
            }
            // Otherwise, try to parse as array
            try {
              const arr = JSON.parse(configData);
              if (Array.isArray(arr)) {
                fabric.util.enlivenObjects(arr, function(enlivenedObjects) {
                  enlivenedObjects.forEach(o => fabricCanvas.add(o));
                  addGridAndRulers(fabricCanvas);
                  fabricCanvas.requestRenderAll();
                  loaded = true;
                });
                return;
              }
              configData = arr;
            } catch (e) {
              // Not JSON, not XAML, do nothing
              addGridAndRulers(fabricCanvas);
              fabricCanvas.requestRenderAll();
              return;
            }
          }
          // If it's a valid Fabric.js JSON
          if (typeof configData === 'object' && configData.objects) {
            fabricCanvas.loadFromJSON(configData, () => {
              addGridAndRulers(fabricCanvas);
              fabricCanvas.requestRenderAll();
              console.log('config_1 loaded successfully');
              loaded = true;
            });
          }
        }
        // 7. If initialConfig is a string that might be JSON
        else if (typeof initialConfig === 'string') {
          console.log('Attempting to parse initialConfig as JSON string');
          try {
            const parsedConfig = JSON.parse(initialConfig);
            if (parsedConfig.objects) {
              fabricCanvas.loadFromJSON(parsedConfig, () => {
                addGridAndRulers(fabricCanvas);
                fabricCanvas.requestRenderAll();
                console.log('Parsed JSON string loaded successfully');
                loaded = true;
              });
            } else if (parsedConfig.CanvasData) {
              // Handle nested CanvasData
              let canvasData = parsedConfig.CanvasData;
              if (typeof canvasData === 'string') {
                try {
                  canvasData = JSON.parse(canvasData);
                } catch (e) {
                  console.log('Nested CanvasData is not JSON');
                }
              }
              if (typeof canvasData === 'object' && canvasData.objects) {
                fabricCanvas.loadFromJSON(canvasData, () => {
                  addGridAndRulers(fabricCanvas);
                  fabricCanvas.requestRenderAll();
                  console.log('Nested CanvasData loaded successfully');
                  loaded = true;
                });
              }
            }
          } catch (e) {
            console.log('initialConfig is not JSON, checking if it\'s XAML');
            if (initialConfig.trim().startsWith('<DiagramItemCollection')) {
              const shapes = parseXamlToFabricObjects(initialConfig, fabric);
              shapes.forEach(shape => fabricCanvas.add(shape));
              addGridAndRulers(fabricCanvas);
              fabricCanvas.requestRenderAll();
              loaded = true;
            }
          }
        }
        else {
          console.log('initialConfig format not recognized:', typeof initialConfig, initialConfig);
          console.log('Available properties:', Object.keys(initialConfig || {}));
          // Always add grid/rulers even if nothing loaded
          addGridAndRulers(fabricCanvas);
          fabricCanvas.requestRenderAll();
        }
      } catch (error) {
        console.error('Error loading initial config:', error);
        // Add grid and rulers even if loading fails
        addGridAndRulers(fabricCanvas);
        fabricCanvas.requestRenderAll();
      }
      // Always add grid/rulers if nothing was loaded or after loading
      addGridAndRulers(fabricCanvas);
      fabricCanvas.requestRenderAll();
    }
  }, [fabricCanvas, initialConfig]);

  useEffect(() => {
    if (!fabricCanvas || !selectedImage || activeTool !== "image") {
      return;
    }
  
    console.log('Starting image load process');
    const left = canvasSize.width / 4;
    const top = canvasSize.height / 4;
  
    const imgElement = new Image();
    imgElement.crossOrigin = "anonymous";
  
    imgElement.onload = () => {
      console.log('Image loaded successfully');
      // Calculate appropriate scale to fit the image within canvas bounds
      const maxWidth = canvasSize.width * 0.8; // 80% of canvas width
      const maxHeight = canvasSize.height * 0.8; // 80% of canvas height
      
      let scaleX = maxWidth / imgElement.width;
      let scaleY = maxHeight / imgElement.height;
      
      // Use the smaller scale to maintain aspect ratio
      const scale = Math.min(scaleX, scaleY);
      
      console.log('Creating fabric image with scale:', scale);
      const fabricImg = new fabric.Image(imgElement, {
        left,
        top,
        transparentCorners: false,
        cornerColor: "#000000",
        cornerSize: 10,
        hasRotatingPoint: true,
        scaleX: scale,
        scaleY: scale,
        selectable: true,
        evented: true,
        originX: 'center',
        originY: 'center',
        centeredScaling: true,
        centeredRotation: true
      });
  
      console.log('Adding image to canvas');
      fabricCanvas.add(fabricImg);
      fabricCanvas.setActiveObject(fabricImg);
      fabricCanvas.requestRenderAll();
  
      setSettingsIconPosition({
        left: fabricImg.getBoundingRect().left + fabricImg.getBoundingRect().width - 12,
        top: fabricImg.getBoundingRect().top - 10
      });
  
      onToolChange("select");
    };
  
    imgElement.onerror = (error) => {
      console.error("Failed to load the image:", error);
    };
  
    try {
      console.log('Setting image source');
      imgElement.src = selectedImage;
    } catch (error) {
      console.error("Error setting image source:", error);
    }
  
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
          const arrow = ARROWS[activeTool].call(ARROWS, left - 25, top - 25);
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
  useEffect(() => {
    if (!fabricCanvas || activeTool !== "text") return;

    let isSelecting = false;
    let startPoint = null;
    let selectionRect = null;

    const handleMouseDown = (e) => {
      if (fabricCanvas.getActiveObject()) return;

      isSelecting = true;
      startPoint = e.pointer;

      selectionRect = new fabric.Rect({
        left: startPoint.x,
        top: startPoint.y,
        width: 0,
        height: 0,
        fill: 'rgba(0, 0, 0, 0.1)',
        stroke: '#000',
        strokeWidth: 1,
        fontSize: 12,
        selectable: false,
        evented: false
      });

      fabricCanvas.add(selectionRect);
    };

    const handleMouseMove = (e) => {
      if (!isSelecting || !selectionRect) return;

      const current = e.pointer;
      const width = Math.abs(current.x - startPoint.x);
      const height = Math.abs(current.y - startPoint.y);

      console.log('Mouse Move - Selection Dimensions:', {
        width,
        height,
        startPoint,
        currentPoint: current
      });

      selectionRect.set({
        width,
        height,
        left: Math.min(current.x, startPoint.x),
        top: Math.min(current.y, startPoint.y)
      });

      fabricCanvas.requestRenderAll();
    };

    const handleMouseUp = () => {
      onToolChange("select");
      if (!isSelecting || !selectionRect) return;
      isSelecting = false;

      // Get the actual dimensions from the selection rectangle
      const width = Math.max(selectionRect.width, 10); // Minimum width of 10px
      const height = Math.max(selectionRect.height, 10); // Minimum height of 10px
      const left = selectionRect.left;
      const top = selectionRect.top;

      fabricCanvas.remove(selectionRect);

      // Create a rectangle with the exact selection dimensions
      const rect = new fabric.Rect({
        left,
        top,
        width,
        height,
        fontSize: 15, // Always start at 12
        fill: "white",
        fontFamily: "Arial",
        textAlign: 'left',
        originX: 'left',
        originY: 'top',
        selectable: true,
        editable: true,
        splitByGrapheme: true,
        transparentCorners: false,
        cornerColor: "#000",
        cornerSize: 10,
        hasRotatingPoint: true,
        lockScalingX: false,
        lockScalingY: false,
        lockUniScaling: false,
        backgroundColor: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
      });

      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
      fabricCanvas.requestRenderAll();

      // Change fill on selection/deselection
      rect.on("selected", () => {
        rect.set({ fill: "white" });
        fabricCanvas.requestRenderAll();
      });
      rect.on("deselected", () => {
        rect.set({ fill: "transparent" });
        fabricCanvas.requestRenderAll();
      });
      // Enter editing mode for the textbox
      rect.enterEditing();
      setTimeout(() => {
        if (rect.hiddenTextarea) {
          rect.hiddenTextarea.style.overflowY = 'scroll';
          rect.hiddenTextarea.style.height = `${rect.height}px`;
        }
      }, 0);
      

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
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        selectable: true,
        transparentCorners: false,
        cornerColor: strokeColor,
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
  }, [activeTool, fabricCanvas, strokeColor, strokeWidth]);

  // Add drawing functionality
  useEffect(() => {
    if (!fabricCanvas) return;

    // Initialize free drawing brush
    fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = strokeColor;
    fabricCanvas.freeDrawingBrush.width = strokeWidth;

    if (activeTool === "pencil") {
      fabricCanvas.isDrawingMode = true;
    } else {
      fabricCanvas.isDrawingMode = false;
    }

    return () => {
      fabricCanvas.isDrawingMode = false;
    };
  }, [activeTool, fabricCanvas, strokeColor, strokeWidth]);

  // Add keyboard shortcuts for delete and other operations
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleKeyDown = (e) => {
      // Check if we're in a text input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const activeObject = fabricCanvas.getActiveObject();
      
      // If we're editing text, don't handle delete/backspace
      if (activeObject && activeObject.isEditing) {
        return;
      }
      if (e.key === "Delete") {
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

  useEffect(() => {
    if (!fabricCanvas) return;

    const handleDoubleClick = (e) => {
      const activeObject = fabricCanvas.getActiveObject();
      if (!activeObject) return;

      // Prevent double-click text addition for field tool objects
      if (activeObject.insertedByFieldTool) return;

      // If it's a price field textbox (e.g., {price1}, {price2}, {price3})
      if (
        activeObject.type === "textbox" &&
        /^\{price[123]\}$/.test(activeObject.text)
      ) {
        // Clear the text and enter editing mode
        activeObject.text = "";
        activeObject.enterEditing();
        setTimeout(() => {
          if (activeObject.hiddenTextarea) {
            activeObject.hiddenTextarea.focus();
          }
        }, 0);
        fabricCanvas.requestRenderAll();
        return;
      }

      // Prevent textbox addition on images
      if (activeObject.type === 'image') {
        return;
      }

      // Prevent double-click action for fields (single textbox with {fieldName} or group with $ and {price_x})
      const isFieldTextbox = (obj) => {
        if (obj.type === 'textbox' && /^\{(date|id|itemId|modelNumber|descriptionA|descriptionB|supplierName|itemType|mainCategory|subCategory|landedCost|price1|price2|price3|statusType|qty|imageUrl|dimensions|packageId|packageItems|pay36m|pay48m|pay60m|packageName|packageDescA|packageDescB|packagePrice1|packagePrice2|packagePrice3|packageImageUrl|packagePay36m|packagePay48m|packagePay60m|packageDimensions|locBcl|notes|location|stockId)\}$/.test(obj.text)) {
          return true;
        }
        return false;
      };
      // Check for price group
      const isPriceGroup = (obj) => {
        if (obj.type === 'group') {
          const objs = obj.getObjects();
          if (objs.length === 2 && objs[0].type === 'textbox' && objs[1].type === 'textbox') {
            const texts = [objs[0].text, objs[1].text];
            return texts.includes('$') && texts.some(t => /^\{price[123]\}$/.test(t));
          }
        }
        return false;
      };
      if (isFieldTextbox(activeObject)) {
        return; // Do nothing on double-click for fields
      }
      if (isPriceGroup(activeObject)) {
        // On double-click, clear the {priceX} textbox and enter editing mode
        const objs = activeObject.getObjects();
        const priceTextbox = objs.find(t => /^\{price[123]\}$/.test(t.text));
        if (priceTextbox) {
          priceTextbox.text = "";
          priceTextbox.enterEditing();
          setTimeout(() => {
            if (priceTextbox.hiddenTextarea) {
              priceTextbox.hiddenTextarea.focus();
            }
          }, 0);
        }
        return;
      }

      // Check if the object is a group and has text
      if (activeObject.type === 'group') {
        const textObject = activeObject.getObjects().find(obj => obj.type === 'textbox');
        if (textObject) {
          // If text exists, make it editable
          textObject.enterEditing();
          textObject.hiddenTextarea.focus();
          return;
        }
      }

      // Get object's current bounding rectangle
      const objRect = activeObject.getBoundingRect();
      const centerX = objRect.left + objRect.width / 2;
      const centerY = objRect.top + objRect.height / 2;

      // If no text exists, create new textbox
      const textbox = new Textbox("", {
        fontSize: 15, // Always start at 12
        fill: "#000000",
        fontFamily: "Arial",
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        selectable: true,
        editable: true,
        splitByGrapheme: true,
        width: objRect.width, // Full width of the bounding box
        height: objRect.height, // Full height of the bounding box
        maxHeight: objRect.height, // Set maxHeight to bounding box
        left: centerX, // Centered X
        top: centerY, // Centered Y
        transparentCorners: false,
        cornerColor: "#000000",
        cornerSize: 10,
        hasRotatingPoint: true,
        lockScalingX: true,
        lockScalingY: true, // Prevent vertical scaling
        lockUniScaling: true,
        backgroundColor: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
      });

      // Create a group with the original object and the text
      const group = new Group([activeObject, textbox], {
        left: activeObject.left,
        top: activeObject.top,
        selectable: true,
        transparentCorners: false,
        cornerColor: "#000000",
        cornerSize: 10,
        hasRotatingPoint: true,
        overflowY : "scroll",
        overflow : "hidden"
      });
      // Add custom scaling behavior
      group.on('scaling', function(e) {
        const scaleX = this.scaleX;
        const scaleY = this.scaleY;
        const width = this.width
        const height = this.height
        // Reset text scaling to maintain original size
        textbox.set({
          scaleX: 1 / scaleX,
          scaleY: 1 / scaleY,
          width : width * scaleX,
          height : height * scaleY
        });
      });

      // Remove the original object and add the group
      fabricCanvas.remove(activeObject);
      fabricCanvas.add(group);
      fabricCanvas.setActiveObject(group);

      // Enter editing mode for the text
      textbox.enterEditing();
      setTimeout(() => {
        if (textbox.hiddenTextarea) {
          textbox.hiddenTextarea.style.overflowY = 'hidden';
          textbox.hiddenTextarea.style.height = `${textbox.height}px`;
          textbox.hiddenTextarea.style.maxHeight = `${textbox.height}px`;
        }
      }, 0);
      // Keep textarea scrollable on text change
      textbox.on("changed", () => {
        if (textbox.hiddenTextarea) {
          textbox.hiddenTextarea.style.overflowY = 'hidden';
          textbox.hiddenTextarea.style.height = `${textbox.height}px`;
          textbox.hiddenTextarea.style.maxHeight = `${textbox.height}px`;
        }
      });

      fabricCanvas.requestRenderAll();
    };

    fabricCanvas.on("mouse:dblclick", handleDoubleClick);

    return () => {
      fabricCanvas.off("mouse:dblclick", handleDoubleClick);
    };
  }, [fabricCanvas]);

  // Add this useEffect to handle field insertion
  useEffect(() => {
    if (!fabricCanvas) return;

    const fieldNames = [
      "date", "id", "itemId", "modelNumber", "descriptionA", "descriptionB",
      "supplierName", "itemType", "mainCategory", "subCategory", "landedCost",
      "price1", "price2", "price3", "statusType", "qty", "imageUrl", "dimensions",
      "packageId", "packageItems", "pay36m", "pay48m", "pay60m", "packageName",
      "packageDescA", "packageDescB", "packagePrice1", "packagePrice2", "packagePrice3",
      "packageImageUrl", "packagePay36m", "packagePay48m", "packagePay60m",

      "packageDimensions", "locBcl", "notes", "location", "stockId",
      "barcode", "inventory_stock_ids"
    ];

    if (activeTool === 'barcode') {
      console.log('Barcode tool activated. Generating barcode...');

      // Create a dummy canvas to generate the barcode
      const barcodeCanvas = document.createElement('canvas');
      
      try {
        // Generate the barcode
        JsBarcode(barcodeCanvas, '{inventory_stock_ids}', {
          format: 'CODE128',
          width: 1.5,
          height: 50,
          displayValue: false, // We will create our own text object
          margin: 0,
        });
        console.log('JsBarcode successfully drew on the temporary canvas.');

        const startX = 50;
        const startY = 50;

        // Create a fabric image directly from the canvas element
        const barcodeImage = new fabric.Image(barcodeCanvas, {
            left: startX,
            top: startY,
            selectable: true,
            hasControls: true,
            hasBorders: true,
        });
        console.log('Fabric.Image created directly from canvas element.');


        // Create the text as a completely separate object
        const text = new fabric.Textbox('{inventory_stock_ids}', {
            left: startX, 
            top: startY + barcodeImage.height + 5, // Position it below the barcode
            fontSize: 18,
            fill: '#000',
            width: "",
            textAlign: 'center',
            selectable: true,
            hasControls: true,
            hasBorders: true,
        });

        barcodeImage.insertedByFieldTool = true;
        text.insertedByFieldTool = true;

        console.log('Adding barcode and text to canvas.');
        // Add both to the canvas as separate objects
        fabricCanvas.add(barcodeImage, text);
        fabricCanvas.setActiveObject(text); // Select the text by default
        fabricCanvas.requestRenderAll();
        
        onToolChange("select");

      } catch (e) {
        console.error("Error generating barcode:", e);
        onToolChange("select"); // Switch back to select tool even if it fails
      }
    }

    if (fieldNames.includes(activeTool) && activeTool !== 'barcode' && activeTool !== 'inventory_stock_ids') {
      if (activeTool.startsWith("price")) {
        // Add $ textbox
        const dollar = new fabric.Textbox("$", {
          left: 100,
          top: 100,

          fontSize: 36,
          fill: "#0090e9",
          fontWeight: "bold",
          selectable: true,
          hasControls: true,
          hasBorders: true,

          editable: false,
          evented: true,
        });
        // Add {priceX} textbox right next to the dollar
        const price = new fabric.Textbox(`{${activeTool}}`, {
          left: 140, // 40px to the right of the dollar
          top: 100,

          fontSize: 36,
          fill: "#0090e9",
          fontWeight: "bold",
          selectable: true,
          hasControls: true,
          hasBorders: true,

          editable: true,
        });
        dollar.insertedByFieldTool = true;
        price.insertedByFieldTool = true;
        fabricCanvas.add(dollar);
        fabricCanvas.add(price);
        fabricCanvas.setActiveObject(price);
        fabricCanvas.requestRenderAll();
        // No grouping!
      } else {
        // Non-price fields: just add the field as an editable textbox
        const text = new fabric.Textbox(`{${activeTool}}`, {

          left: 100,
          top: 100,
          fontSize: 18,
          fill: "#000",
          fontWeight: "normal",
          selectable: true,
          hasControls: true,
          hasBorders: true,

          editable: true,
        });
        text.insertedByFieldTool = true;

        fabricCanvas.add(text);
        fabricCanvas.setActiveObject(text);
        fabricCanvas.requestRenderAll();
      }
      onToolChange("select");
    }


    if (activeTool === 'qrcode') {
      console.log('QR code tool activated. Generating QR code...');
      const qrCanvas = document.createElement('canvas');
      const startX = 50;
      const startY = 50;
      const qrValue = '{inventory_stock_ids}'; // or any value you want

      QRCode.toCanvas(qrCanvas, qrValue, { width: 120, margin: 0 }, function (error) {
        if (error) {
          console.error("Error generating QR code:", error);
          onToolChange("select");
          return;
        }
        const qrImage = new fabric.Image(qrCanvas, {
          left: startX,
          top: startY,
          selectable: true,
          hasControls: true,
          hasBorders: true,
        });
        qrImage.insertedByFieldTool = true;
        fabricCanvas.add(qrImage);
        fabricCanvas.setActiveObject(qrImage);
        fabricCanvas.requestRenderAll();
        onToolChange("select");
      });
    }
  }, [activeTool, fabricCanvas, onToolChange]);

  // Cleanup coordinate label timer on unmount
  useEffect(() => {
    return () => {
      if (coordLabelTimeout.current) clearTimeout(coordLabelTimeout.current);
    };
  }, []);

  // Toast function (replace with your own or a library)
  const showToast = (msg, type) => alert(`${type === 'success' ? '✅' : '❌'} ${msg}`);

  // Export PNG (300 DPI)
  const handleExportPNG = async () => {
    if (!fabricCanvas) return;
    try {
      setLoading(true);
      const multiplier = 3.125;
      const dataURL = fabricCanvas.toDataURL({ format: 'png', multiplier });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'tag-300dpi.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('PNG export successful!', 'success');
    } catch (err) {
      showToast('PNG export failed!', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Export PDF (300 DPI)
  const handleExportPDF = async () => {
    if (!fabricCanvas) return;
    try {
      setLoading(true);
      const multiplier = 3.125;
      const dataURL = fabricCanvas.toDataURL({ format: 'png', multiplier });
      const width = fabricCanvas.getWidth() * multiplier;
      const height = fabricCanvas.getHeight() * multiplier;
      const pxToPt = px => (px * 72) / 300;
      const pdf = new jsPDF({
        orientation: width > height ? 'landscape' : 'portrait',
        unit: 'pt',
        format: [pxToPt(width), pxToPt(height)]
      });
      pdf.addImage(dataURL, 'PNG', 0, 0, pxToPt(width), pxToPt(height));
      pdf.save('tag-300dpi.pdf');
      showToast('PDF export successful!', 'success');
    } catch (err) {
      showToast('PDF export failed!', 'error');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex h-full w-full flex-col">
      {/* {loading && <div className="loading-overlay">Exporting...</div>}
      <div className="mb-2 flex gap-2">
        <button onClick={handleExportPNG} className="px-4 py-2 bg-blue-500 text-white rounded">Export PNG (300 DPI)</button>
        <button onClick={handleExportPDF} className="px-4 py-2 bg-green-500 text-white rounded">Export PDF (300 DPI)</button>
      </div> */}
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
              // Create arrow with default size and color
              const arrow = ARROWS[tool](left - 25, top - 25, ARROWS.config.defaultSize, ARROWS.config.defaultColor);
              fabricCanvas.add(arrow);
              fabricCanvas.setActiveObject(arrow);
            }
            fabricCanvas.requestRenderAll();
            onToolChange("select");
          }
        }}
      >
        <canvas ref={canvasRef} className="block" />
        {/* Coordinate label overlay */}
        {coordLabel && (
          <div
            className="absolute z-50p px-1 py-1 rounded bg-gray-100/90 border border-gray-400 text-black font-mono shadow text-xs"
            style={{
              left: `${coordLabel.left}px`,
              top: `${coordLabel.top}px`,
              pointerEvents: 'none',
              transform: 'translate(-50%, 0)',
            }}
          >
            X:{coordLabel.x} Y:{coordLabel.y}
          </div>
        )}
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
            className="absolute z-50 bg-gray-500 hover:bg-gray-600 text-white rounded-full p-1 shadow-lg transition-colors "
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
            clipboard={clipboard}
            setClipboard={setClipboard}
          />
        )}
      </div>
      {/* <ShapesPanel onDragStart={handleDragStart} /> */}
    </div>
  );
};

export default DesignCanvas;

// Add this utility function to extract only user objects for saving
export function getUserObjectsForSaving(fabricCanvas) {
  if (!fabricCanvas) return '[]';
  // Filter out grid/ruler objects
  const userObjects = fabricCanvas.getObjects().filter(obj => !obj.isGridOrRuler);
  // Convert each object to its serializable representation
  const serialized = userObjects.map(obj => obj.toObject());
  // Return as a stringified array
  return JSON.stringify(serialized);
}


