// Component for editing an existing template (loads and edits existing config)
import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Canvas as FabricCanvas, Rect, Circle, Textbox, Polygon, Path, Line, Group } from "fabric";
import * as fabric from 'fabric';
import { XMLParser } from 'fast-xml-parser';
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import jsPDF from 'jspdf';
import ObjectSettingsPanel from './ObjectSettingsPanel';

// --- SHAPES, ARROWS, parseXamlToFabricObjects, makeAllObjectsEditable, markAllGridObjects ---
// (Full code pasted from DesignCanvas.jsx)

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
  // ... (rest of SHAPES code from DesignCanvas.jsx) ...
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

export function addGridAndRulers(canvas) {
    if (!canvas) return;
  
    // Remove all grid/ruler lines by property (not just isGridOrRuler)
    const gridObjects = canvas.getObjects().filter(obj =>
      (obj.isGridOrRuler === true) ||
      (obj.type === 'line' && obj.stroke === '#9ca3af' && obj.strokeWidth === 0.5) ||
      (obj.type === 'rect' && obj.fill === '#f3f4f6' && (obj.width === 20 || obj.height === 20))
    );
    gridObjects.forEach(obj => canvas.remove(obj));
  
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
      canvas.sendObjectToBack(line)
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
      canvas.sendObjectToBack(line)
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
    canvas.add(horizontalRuler);
    canvas.sendObjectBackwards(horizontalRuler)
    horizontalRuler.isGridOrRuler = true;
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

function markAllGridObjects(canvas) {
  if (!canvas) return;
  canvas.getObjects().forEach(obj => {
    if (
      (obj.type === 'line' && obj.stroke === '#9ca3af' && obj.strokeWidth === 0.5) ||
      (obj.type === 'rect' && obj.fill === '#f3f4f6' && (obj.width === 20 || obj.height === 20))
    ) {
      obj.isGridOrRuler = true;
    }
  });
}

function makeAllObjectsEditable(canvas) {
  if (!canvas) return;
  markAllGridObjects(canvas);
  const setEditable = (obj) => {
    if (!obj) return;
    if (obj.isGridOrRuler) {
      obj.selectable = false;
      obj.evented = false;
      if (obj.type === 'textbox' || obj.type === 'text') obj.editable = false;
      return;
    }
    obj.selectable = true;
    obj.evented = true;
    if (obj.type === 'textbox' || obj.type === 'text') {
      obj.editable = true;
    }
    if (obj.type === 'group' && obj.getObjects) {
      obj.getObjects().forEach(setEditable);
    }
    if (Array.isArray(obj.objects)) {
      obj.objects.forEach(setEditable);
    }
  };
  canvas.getObjects().forEach(setEditable);
}

const EditTemplateCanvas = forwardRef(({
  canvasSize,
  initialConfig,
  onObjectSelect,
  onToolChange,
  strokeColor = "#ef4444",
  strokeWidth = 2,
  clipboard,
  setClipboard,
  selectedImage: selectedImageProp,
  activeTool: activeToolProp,
  selectedShape: selectedShapeProp,
  fillColor: fillColorProp,
  onCanvasReady,
}, ref) => {
  // --- State and refs ---
  const canvasRef = useRef(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [settingsIconPosition, setSettingsIconPosition] = useState(null);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [settingsPanelPosition, setSettingsPanelPosition] = useState(null);
  const [coordLabel, setCoordLabel] = useState(null);
  const coordLabelTimeout = useRef(null);
  const [loading, setLoading] = useState(false);
  const lastLoadedConfig = useRef(null);
  const [textToolUsed, setTextToolUsed] = useState(false);
  // Hybrid controlled/uncontrolled state
  const [internalActiveTool, setInternalActiveTool] = useState("select");
  const [internalSelectedShape, setInternalSelectedShape] = useState("rectangle");
  const [internalFillColor, setInternalFillColor] = useState("#15D7FF");
  const [internalSelectedImage, setInternalSelectedImage] = useState(null);
  const activeTool = typeof activeToolProp !== "undefined" ? activeToolProp : internalActiveTool;
  const selectedShape = typeof selectedShapeProp !== "undefined" ? selectedShapeProp : internalSelectedShape;
  const fillColor = typeof fillColorProp !== "undefined" ? fillColorProp : internalFillColor;
  const selectedImage = typeof selectedImageProp !== "undefined" ? selectedImageProp : internalSelectedImage;

  // Hybrid tool change handler
  const handleToolChange = (tool, value, color) => {
    if (onToolChange) {
      onToolChange(tool, value, color);
    } else {
      setInternalActiveTool(tool);
      if (tool === "shape") {
        setInternalSelectedShape(value);
        if (color) setInternalFillColor(color);
      }
      if (tool === "image") {
        setInternalSelectedImage(value);
      }
    }
  };

  // --- Canvas initialization and loading logic (from DesignCanvas.jsx, but only for editing/loading) ---
  useEffect(() => {
    if (!canvasRef.current) return;
    if (canvasRef.current) {
      if (fabricCanvas) {
        fabricCanvas.dispose();
      }
      const canvas = new FabricCanvas(canvasRef.current, {
        width: canvasSize.width,
        height: canvasSize.height,
        backgroundColor: "#ffffff",
        selection: true,
        preserveObjectStacking: true,
      });
      canvasRef.current.fabricCanvas = canvas;
      window.__fabricCanvasInstance = canvas;
      setFabricCanvas(canvas);
      if (onCanvasReady) {
        onCanvasReady?.(canvas);
      }

      setTimeout(() => {
        addGridAndRulers(canvas);
      }, 50);

      canvas.history = { undo: [], redo: [] };

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

      // Cleanup function
      return () => {
        canvas.dispose();
        if (window.__fabricCanvasInstance === canvas) {
          delete window.__fabricCanvasInstance;
        }
      };
    }
  }, [canvasSize.width, canvasSize.height]);

  // --- All event handlers for editing, selection, movement, scaling, double-click, undo/redo, field insertion, barcode, QR code, etc. (copied from DesignCanvas.jsx) ---
  // ... (Insert all relevant event handler functions here)

  // --- Render part (canvas, overlays, settings panel, etc.) (copied from DesignCanvas.jsx) ---
  // ... (Insert the render JSX from DesignCanvas.jsx, adapted for editing/loading only)

  useEffect(() => {
    if (!fabricCanvas) return;

    // Stringify for a simple deep compare (works for most cases)
    const currentConfigStr = JSON.stringify(initialConfig || {});
    if (lastLoadedConfig.current === currentConfigStr) {
      // Config hasn't changed, don't reload
      return;
    }
    lastLoadedConfig.current = currentConfigStr;

    try {
      // Clear existing objects first, but preserve grid
      try {
        const userObjects = fabricCanvas.getObjects().filter(obj => !obj.isGridOrRuler);
        userObjects.forEach(obj => fabricCanvas.remove(obj));
      } catch (e) {
        console.error('Error clearing canvas:', e);
      }
      
      let loaded = false;
      
      // Helper function to ensure grid exists after loading
      const ensureGridExists = () => {
        const hasGrid = fabricCanvas.getObjects().some(obj => obj.isGridOrRuler);
        if (!hasGrid) {
          addGridAndRulers(fabricCanvas);
        }
        fabricCanvas.requestRenderAll();
      };
      
      // 1. If initialConfig.Content is XAML
      if (
        typeof initialConfig === 'object' &&
        initialConfig.Content &&
        typeof initialConfig.Content === 'string' &&
        initialConfig.Content.trim().startsWith('<DiagramItemCollection')
      ) {
        const shapes = parseXamlToFabricObjects(initialConfig.Content, fabric);
        shapes.forEach(shape => fabricCanvas.add(shape));
        ensureGridExists();
        loaded = true;
      }
      // 2. If initialConfig.Content is Fabric.js JSON
      else if (
        typeof initialConfig === 'object' &&
        initialConfig.Content &&
        typeof initialConfig.Content === 'object' &&
        initialConfig.Content.objects
      ) {
        fabricCanvas.loadFromJSON(initialConfig.Content, () => {
          ensureGridExists();
        });
        loaded = true;
      }
      // 3. If initialConfig is Fabric.js JSON directly
      else if (
        typeof initialConfig === 'object' &&
        initialConfig.objects
      ) {
        let validObjects = initialConfig.objects;
        if (Array.isArray(validObjects)) {
          validObjects = validObjects.filter(obj => obj && obj.type);
        }
        const toLoad = { ...initialConfig, objects: validObjects };
        fabricCanvas.loadFromJSON(toLoad, () => {
          ensureGridExists();
        });
        loaded = true;
      }
      // 3b. If initialConfig is a plain array of objects
      else if (Array.isArray(initialConfig)) {
        fabric.util.enlivenObjects(initialConfig, function(enlivenedObjects) {
          enlivenedObjects.forEach(o => fabricCanvas.add(o));
          ensureGridExists();
        });
        loaded = true;
      }
      // 4. If initialConfig has a CanvasData property (backend format)
      else if (
        typeof initialConfig === 'object' &&
        initialConfig.CanvasData
      ) {
        let canvasData = initialConfig.CanvasData;
        if (typeof canvasData === 'string') {
          try {
            canvasData = JSON.parse(canvasData);
          } catch (e) {
            if (canvasData.trim().startsWith('<DiagramItemCollection')) {
              const shapes = parseXamlToFabricObjects(canvasData, fabric);
              shapes.forEach(shape => fabricCanvas.add(shape));
              ensureGridExists();
              loaded = true;
              return;
            }
          }
        }
        if (typeof canvasData === 'object' && canvasData.objects) {
          fabricCanvas.loadFromJSON(canvasData, () => {
            ensureGridExists();
          });
          loaded = true;
        }
      }
      // 6. If initialConfig has a config_1 property (alternative backend format)
      else if (
        typeof initialConfig === 'object' &&
        initialConfig.config_1
      ) {
        let configData = initialConfig.config_1;
        if (typeof configData === 'string') {
          if (configData.trim().startsWith('<DiagramItemCollection')) {
            const shapes = parseXamlToFabricObjects(configData, fabric);
            shapes.forEach(shape => fabricCanvas.add(shape));
            ensureGridExists();
            loaded = true;
            return;
          }
          try {
            const arr = JSON.parse(configData);
            if (Array.isArray(arr)) {
              fabric.util.enlivenObjects(arr, function(enlivenedObjects) {
                enlivenedObjects.forEach(o => fabricCanvas.add(o));
                ensureGridExists();
              });
              loaded = true;
              return;
            }
            configData = arr;
          } catch (e) {
            ensureGridExists();
            return;
          }
        }
        if (typeof configData === 'object' && configData.objects) {
          fabricCanvas.loadFromJSON(configData, () => {
            ensureGridExists();
          });
          loaded = true;
        }
      }
      // 7. If initialConfig is a string that might be JSON
      else if (typeof initialConfig === 'string') {
        try {
          const parsedConfig = JSON.parse(initialConfig);
          if (parsedConfig.objects) {
            fabricCanvas.loadFromJSON(parsedConfig, () => {
              ensureGridExists();
            });
            loaded = true;
          } else if (parsedConfig.CanvasData) {
            let canvasData = parsedConfig.CanvasData;
            if (typeof canvasData === 'string') {
              try {
                canvasData = JSON.parse(canvasData);
              } catch (e) {}
            }
            if (typeof canvasData === 'object' && canvasData.objects) {
              fabricCanvas.loadFromJSON(canvasData, () => {
                ensureGridExists();
              });
              loaded = true;
            }
          }
        } catch (e) {
          if (initialConfig.trim().startsWith('<DiagramItemCollection')) {
            const shapes = parseXamlToFabricObjects(initialConfig, fabric);
            shapes.forEach(shape => fabricCanvas.add(shape));
            ensureGridExists();
            loaded = true;
          }
        }
      }
      else {
        // Ensure grid exists if no config to load
        ensureGridExists();
      }
      
      setTimeout(() => {
        try {
          makeAllObjectsEditable(fabricCanvas);
          fabricCanvas.requestRenderAll();
          if (onCanvasReady) {
            onCanvasReady(fabricCanvas);
          }
        } catch (e) {
          console.error('Error making objects editable:', e);
        }
      }, 0);
    } catch (error) {
      console.error('Error loading initial config:', error);
      // Ensure grid exists even if loading fails
      const hasGrid = fabricCanvas.getObjects().some(obj => obj.isGridOrRuler);
      if (!hasGrid) {
        addGridAndRulers(fabricCanvas);
      }
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
  
      handleToolChange("select");
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
  
  }, [selectedImage, fabricCanvas, activeTool, canvasSize, handleToolChange]);
  
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleClick = (e) => {
      try {
        // Only create new shapes if there's no active object (match DesignCanvas logic)
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
  }, [activeTool, fabricCanvas, handleToolChange, selectedImage]);

  // Add text tool selection functionality (immediate textbox on tool select)
  // useEffect(() => {
  //   if (!fabricCanvas || activeTool !== "text") return;

  //   let isSelecting = false;
  //   let startPoint = null;
  //   let selectionRect = null;

  //   const handleMouseDown = (e) => {
  //     if (fabricCanvas.getActiveObject()) return;

  //     isSelecting = true;
  //     startPoint = e.pointer;

  //     selectionRect = new fabric.Rect({
  //       left: startPoint.x,
  //       top: startPoint.y,
  //       width: 0,
  //       height: 0,
  //       fill: 'rgba(0, 0, 0, 0.1)',
  //       stroke: '#000',
  //       strokeWidth: 1,
  //       fontSize: 12,
  //       selectable: false,
  //       evented: false
  //     });

  //     fabricCanvas.add(selectionRect);
  //   };

  //   const handleMouseMove = (e) => {
  //     if (!isSelecting || !selectionRect) return;

  //     const current = e.pointer;
  //     const width = Math.abs(current.x - startPoint.x);
  //     const height = Math.abs(current.y - startPoint.y);

  //     console.log('Mouse Move - Selection Dimensions:', {
  //       width,
  //       height,
  //       startPoint,
  //       currentPoint: current
  //     });

  //     selectionRect.set({
  //       width,
  //       height,
  //       left: Math.min(current.x, startPoint.x),
  //       top: Math.min(current.y, startPoint.y)
  //     });

  //     fabricCanvas.requestRenderAll();
  //   };

  //   const handleMouseUp = () => {
  //     handleToolChange("select");
  //     if (!isSelecting || !selectionRect) return;
  //     isSelecting = false;

  //     // Get the actual dimensions from the selection rectangle
  //     const width = Math.max(selectionRect.width, 50); // Minimum width of 10px
  //     const height = Math.max(selectionRect.height, 50); // Minimum height of 10px
  //     const left = selectionRect.left;
  //     const top = selectionRect.top;

  //     fabricCanvas.remove(selectionRect);

  //     // Create a rectangle with the exact selection dimensions
  //     const rect = new fabric.Rect({
  //       left,
  //       top,
  //       width,
  //       height,
  //       fontSize: 15, // Always start at 12
  //       fill: "white",
  //       fontFamily: "Arial",
  //       textAlign: 'left',
  //       originX: 'left',
  //       originY: 'top',
  //       selectable: true,
  //       editable: true,
  //       splitByGrapheme: true,
  //       transparentCorners: false,
  //       cornerColor: "#000",
  //       cornerSize: 10,
  //       hasRotatingPoint: true,
  //       lockScalingX: false,
  //       lockScalingY: false,
  //       lockUniScaling: false,
  //       backgroundColor: 'transparent',
  //       stroke: 'transparent',
  //       strokeWidth: 0,
  //     });
  // // Add text tool selection functionality (immediate textbox on tool select)

  //     fabricCanvas.add(rect);
  //     fabricCanvas.setActiveObject(rect);
  //     fabricCanvas.requestRenderAll();

  //     // Change fill on selection/deselection
  //     rect.on("selected", () => {
  //       rect.set({ fill: "white" });
  //       fabricCanvas.requestRenderAll();
  //     });
  //     rect.on("deselected", () => {
  //       rect.set({ fill: "transparent" });
  //       fabricCanvas.requestRenderAll();
  //     });
  //     // Enter editing mode for the textbox
  //     rect.enterEditing();
  //     setTimeout(() => {
  //       if (rect.hiddenTextarea) {
  //         rect.hiddenTextarea.style.overflowY = 'scroll';
  //         rect.hiddenTextarea.style.height = `${rect.height}px`;
  //       }
  //     }, 0);
      

  //   };

  //   fabricCanvas.on("mouse:down", handleMouseDown);
  //   fabricCanvas.on("mouse:move", handleMouseMove);
  //   fabricCanvas.on("mouse:up", handleMouseUp);

  //   return () => {
  //     fabricCanvas.off("mouse:down", handleMouseDown);
  //     fabricCanvas.off("mouse:move", handleMouseMove);
  //     fabricCanvas.off("mouse:up", handleMouseUp);
  //   };
  // }, [activeTool, fabricCanvas, canvasSize, textToolUsed, handleToolChange]);

  useEffect(() => {
    if (!fabricCanvas) return;
    if (activeTool === "text" && !textToolUsed) {
      // Add a textbox at the top-left (start) of the canvas and enter editing mode
      const textbox = new fabric.Textbox("", {
        left: 20, // Start near the left edge
        top: 20,  // Start near the top edge
        width: 200,
        fontSize: 18,
        fill: "#000000",
        fontFamily: "Arial",
        textAlign: "left",
        originX: "left",
        originY: "top",
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
        backgroundColor: "transparent",
        stroke: "transparent",
        strokeWidth: 0,
      });
      fabricCanvas.add(textbox);
      fabricCanvas.setActiveObject(textbox);
      fabricCanvas.requestRenderAll();
      textbox.enterEditing();
      setTimeout(() => {
        if (textbox.hiddenTextarea) {
          textbox.hiddenTextarea.focus();
        }
      }, 0);
      setTextToolUsed(true);
      // Switch back to select tool after adding textbox
      handleToolChange("select");
    } else if (activeTool !== "text" && textToolUsed) {
      setTextToolUsed(false);
    }
  }, [activeTool, fabricCanvas, canvasSize, textToolUsed, handleToolChange]);
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
        handleToolChange("select");
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
    handleToolChange(tool);
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
      "date", "id", "item_id", "model_no", "description_1", "description_2",
      "supplier_name", "item_type", "main_category_name", "sub_category_name", "landedCost",
      "price_1", "price_2", "price_3", "statusType", "qty", "image_url", "dimensions",
      "package_id", "package_items", "Pay_36M", "Pay_48M", "Pay_60M", "package_name",
      "package_desc1", "package_desc2", "package_price_1", "package_price_2", "package_price_3",
      "package_image_url", "Pkg_Pay_36M", "Pkg_Pay_48M", "Pkg_Pay_60M",

      "pkg_dimensions", "loc_misc_bcl", "notes", "location", "stock_id",
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
        
        handleToolChange("select");

      } catch (e) {
        console.error("Error generating barcode:", e);
        handleToolChange("select"); // Switch back to select tool even if it fails
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
        const text = new fabric.Textbox(`{{${activeTool}}}`, {

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
      handleToolChange("select");
    }

// <<<<<<< HEAD
// =======
    // if (activeTool === "barcode") {
    //   // Create a temporary canvas for JsBarcode
    //   const tempCanvas = document.createElement('canvas');
    //   JsBarcode(tempCanvas, "123456789012", { format: "CODE128" });
    //   const imgSrc = tempCanvas.toDataURL("image/png");

    //   const img = new window.Image();
    //   img.onload = () => {
    //     const fabricImg = new fabric.Image(img, {
    //       left: 100,
    //       top: 100,
    //       scaleX: 1,
    //       scaleY: 1,
    //       selectable: true,
    //       hasControls: true,
    //       hasBorders: true,
    //     });
    //     fabricCanvas.add(fabricImg);
    //     fabricCanvas.setActiveObject(fabricImg);
    //     fabricCanvas.requestRenderAll();
    //     handleToolChange("select");
    //   };
    //   img.src = imgSrc;
    // }

    // if (activeTool === "qrcode") {
    //   // Create a QR code image using qrcode
    //   QRCode.toDataURL("https://example.com", { width: 128 }, (err, url) => {
    //     if (err) return;
    //     const img = new window.Image();
    //     img.onload = () => {
    //       const fabricImg = new fabric.Image(img, {
    //         left: 100,
    //         top: 100,
    //         scaleX: 1,
    //         scaleY: 1,
    //         selectable: true,
    //         hasControls: true,
    //         hasBorders: true,
    //       });
    //       fabricCanvas.add(fabricImg);
    //       fabricCanvas.setActiveObject(fabricImg);
    //       fabricCanvas.requestRenderAll();
    //       handleToolChange("select");
    //     };
    //     img.src = url;
    //   });
    // }

// >>>>>>> main

    if (activeTool === 'qrcode') {
      console.log('QR code tool activated. Generating QR code...');
      const qrCanvas = document.createElement('canvas');
      const startX = 50;
      const startY = 50;
      const qrValue = '{inventory_stock_ids}'; // or any value you want

      QRCode.toCanvas(qrCanvas, qrValue, { width: 120, margin: 0 }, function (error) {
        if (error) {
          console.error("Error generating QR code:", error);
          handleToolChange("select");
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
        handleToolChange("select");
      });
    }
  }, [activeTool, fabricCanvas, handleToolChange]);

  // Cleanup coordinate label timer on unmount
  useEffect(() => {
    return () => {
      if (coordLabelTimeout.current) clearTimeout(coordLabelTimeout.current);
    };
  }, []);

  // Toast function (replace with your own or a library)
  const showToast = (msg, type) => alert(`${type === 'success' ? '✅' : '❌'} ${msg}`);

  // Expose copy, cut, paste, delete methods to parent
  useImperativeHandle(ref, () => ({
    copy: () => {
      if (!fabricCanvas) return;
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        setClipboard(activeObject.toObject(['objects', 'left', 'top', 'scaleX', 'scaleY', 'angle', 'width', 'height', 'type', 'text', 'fill', 'stroke', 'strokeWidth']));
      }
    },
    cut: () => {
      if (!fabricCanvas) return;
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        setClipboard(activeObject.toObject(['objects', 'left', 'top', 'scaleX', 'scaleY', 'angle', 'width', 'height', 'type', 'text', 'fill', 'stroke', 'strokeWidth']));
        fabricCanvas.remove(activeObject);
        fabricCanvas.requestRenderAll();
        onObjectSelect && onObjectSelect(null);
        setSettingsIconPosition(null);
      }
    },
    paste: () => {
      if (!fabricCanvas || !clipboard) return;
      let pastedObject;
      const offset = 20;
      const objectType = clipboard.type ? clipboard.type.toLowerCase() : null;
      switch (objectType) {
        case 'group': {
          function reconstructFabricObject(obj) {
            if (!obj || !obj.type) return null;
            const type = obj.type.toLowerCase();
            switch (type) {
              case 'rect': return new fabric.Rect(obj);
              case 'circle': return new fabric.Circle(obj);
              case 'ellipse': return new fabric.Ellipse(obj);
              case 'polygon': return new fabric.Polygon(obj.points, obj);
              case 'polyline': return new fabric.Polyline(obj.points, obj);
              case 'triangle': return new fabric.Triangle(obj);
              case 'line': return new fabric.Line([obj.x1, obj.y1, obj.x2, obj.y2], obj);
              case 'image': return new fabric.Image(undefined, obj);
              case 'textbox': {
                const { text, type, version, ...options } = obj;
                return new fabric.Textbox(text, options);
              }
              case 'text': {
                const { text, type, version, ...options } = obj;
                return new fabric.Text(text, options);
              }
              case 'path': return new fabric.Path(obj.path, obj);
              case 'group': {
                const nestedChildren = (obj.objects || []).map(reconstructFabricObject).filter(child => child && typeof child.toObject === 'function');
                return new fabric.Group(nestedChildren, obj);
              }
              default:
                return null;
            }
          }
          const children = (clipboard.objects || []).map(reconstructFabricObject).filter(obj => obj && typeof obj.toObject === 'function');
          const { left, top, ...rest } = clipboard;
          pastedObject = new fabric.Group(children, {
            ...rest,
            left: (left || 0) + offset,
            top: (top || 0) + offset,
            evented: true,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          });
          break;
        }
        case 'textbox': {
          const { text, type, version, ...options } = clipboard;
          pastedObject = new fabric.Textbox(text, {
            ...options,
            left: (clipboard.left || 0) + offset,
            top: (clipboard.top || 0) + offset,
            evented: true,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          });
          break;
        }
        case 'text': {
          const { text, type, version, ...options } = clipboard;
          pastedObject = new fabric.Text(text, {
            ...options,
            left: (clipboard.left || 0) + offset,
            top: (clipboard.top || 0) + offset,
            evented: true,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          });
          break;
        }
        case 'image':
          if (!clipboard.src) return;
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            const fabricImage = new fabric.Image(img, {
              left: (clipboard.left || 0) + offset,
              top: (clipboard.top || 0) + offset,
              scaleX: clipboard.scaleX || 1,
              scaleY: clipboard.scaleY || 1,
              angle: clipboard.angle || 0,
              width: clipboard.width || img.width,
              height: clipboard.height || img.height,
              evented: true,
              selectable: true,
              hasControls: true,
              hasBorders: true,
            });
            fabricCanvas.discardActiveObject();
            fabricCanvas.add(fabricImage);
            fabricCanvas.setActiveObject(fabricImage);
            fabricCanvas.requestRenderAll();
            onObjectSelect && onObjectSelect(fabricImage);
          };
          img.src = clipboard.src;
          return;
        case 'rect':
          pastedObject = new fabric.Rect({
            ...clipboard,
            left: (clipboard.left || 0) + offset,
            top: (clipboard.top || 0) + offset,
            evented: true,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          });
          break;
        case 'circle':
          pastedObject = new fabric.Circle({
            ...clipboard,
            left: (clipboard.left || 0) + offset,
            top: (clipboard.top || 0) + offset,
            evented: true,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          });
          break;
        case 'path':
          pastedObject = new fabric.Path(clipboard.path, {
            ...clipboard,
            left: (clipboard.left || 0) + offset,
            top: (clipboard.top || 0) + offset,
            evented: true,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          });
          break;
        case 'polygon':
          pastedObject = new fabric.Polygon(clipboard.points, {
            ...clipboard,
            left: (clipboard.left || 0) + offset,
            top: (clipboard.top || 0) + offset,
            evented: true,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          });
          break;
        case 'polyline':
          pastedObject = new fabric.Polyline(clipboard.points, {
            ...clipboard,
            left: (clipboard.left || 0) + offset,
            top: (clipboard.top || 0) + offset,
            evented: true,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          });
          break;
        case 'line':
          pastedObject = new fabric.Line(
            [clipboard.x1, clipboard.y1, clipboard.x2, clipboard.y2],
            {
              ...clipboard,
              left: (clipboard.left || 0) + offset,
              top: (clipboard.top || 0) + offset,
              evented: true,
              selectable: true,
              hasControls: true,
              hasBorders: true,
            }
          );
          break;
        case 'triangle':
          pastedObject = new fabric.Triangle({
            ...clipboard,
            left: (clipboard.left || 0) + offset,
            top: (clipboard.top || 0) + offset,
            evented: true,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          });
          break;
        case 'ellipse':
          pastedObject = new fabric.Ellipse({
            ...clipboard,
            left: (clipboard.left || 0) + offset,
            top: (clipboard.top || 0) + offset,
            evented: true,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          });
          break;
        default:
          fabric.util.enlivenObjects([clipboard], (objects) => {
            if (objects && objects.length > 0) {
              const obj = objects[0];
              obj.set({
                left: (clipboard.left || 0) + offset,
                top: (clipboard.top || 0) + offset,
                evented: true,
                selectable: true,
                hasControls: true,
                hasBorders: true,
              });
              fabricCanvas.add(obj);
              fabricCanvas.setActiveObject(obj);
              fabricCanvas.requestRenderAll();
              onObjectSelect && onObjectSelect(obj);
            }
          });
          return;
      }
      fabricCanvas.add(pastedObject);
      fabricCanvas.setActiveObject(pastedObject);
      fabricCanvas.requestRenderAll();
      onObjectSelect && onObjectSelect(pastedObject);
    },
    delete: () => {
      if (!fabricCanvas) return;
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        fabricCanvas.remove(activeObject);
        fabricCanvas.requestRenderAll();
        onObjectSelect && onObjectSelect(null);
        setSettingsIconPosition(null);
      }
    }
  }));

  return (
    <div className="flex h-full w-full flex-col">
      {/* ...copy the canvas and overlays from DesignCanvas.jsx... */}
      <div
        className="border border-border rounded-lg shadow-lg bg-white relative flex-1"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const tool = e.dataTransfer.getData("tool");
          if (!fabricCanvas || fabricCanvas._disposed) return;
          if (SHAPES[tool] || ARROWS[tool]) {
            try {
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
              handleToolChange("select");
            } catch (err) {
              console.error('Error during drag-and-drop:', err);
            }
          }
        }}
      >
        <canvas
          ref={canvasRef}
          className="block"
          width={canvasSize.width}
          height={canvasSize.height}
        />
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
              e.stopPropagation();
              setShowSettingsPanel(!showSettingsPanel);
              setSettingsPanelPosition({
                left: settingsIconPosition.left + 24,
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
    </div>
  );
});

export default EditTemplateCanvas; 