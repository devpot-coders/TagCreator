import React, { useState, useEffect, useRef } from "react";
import { ActiveSelection } from "fabric";
import * as fabric from "fabric";
import {
  RiAlignItemBottomFill,
  RiAlignItemHorizontalCenterFill,
  RiAlignItemLeftFill,
  RiAlignItemRightFill,
  RiAlignItemTopFill,
  RiAlignItemVerticalCenterFill,
  RiBringToFront,
} from "react-icons/ri";
import { RiBringForward } from "react-icons/ri";
import { RiSendBackward } from "react-icons/ri";
import { RiSendToBack } from "react-icons/ri";
import { BiRotateRight } from "react-icons/bi";
import { BsBorderStyle } from "react-icons/bs";
import {
  BringToFront,
  Clipboard,
  Copy,
  Delete,
  Group,
  Recycle,
  Rotate3D,
  Scissors,
  SendToBack,
  SquareStack,
  Trash2,
  Ungroup,
  //   AlignLeft,
  //   AlignCenterHorizontal,
  //   AlignRight,
  //   AlignTop,
  //   AlignMiddle,
  //   AlignBottom,
  //   SquareStack,
} from "lucide-react";

// Utility to get the correct target for style/text changes
function getTargetTextObject(selectedObject) {
  if (
    selectedObject &&
    selectedObject.type === 'group' &&
    selectedObject.getObjects().length === 2 &&
    selectedObject.getObjects()[0].type === 'textbox' &&
    selectedObject.getObjects()[0].text === '$' &&
    selectedObject.getObjects()[1].type === 'textbox'
  ) {
    // Price group: always use the second textbox (the price value)
    return selectedObject.getObjects()[1];
  }
  // For other groups, fallback to first textbox, else self
  if (selectedObject && selectedObject.type === 'group') {
    return selectedObject.getObjects().find(obj => obj.type === 'textbox') || selectedObject;
  }
  return selectedObject;
}

const ObjectSettingsPanel = ({
  fabricCanvas,
  selectedObject,
  position,
  onClose,
  clipboard,
  setClipboard,
}) => {
  const [activeMainTab, setActiveMainTab] = useState("Home");
  const [activeSubTab, setActiveSubTab] = useState("General");
  const [activeColorSubTab, setActiveColorSubTab] = useState("Color");
  const [activeSubSubTab, setActiveSubSubTab] = useState("Colors");
  const panelRef = useRef(null);
  const [objectWidth, setObjectWidth] = useState(0);
  const [objectHeight, setObjectHeight] = useState(0);
  const [objectX, setObjectX] = useState(0);
  const [objectY, setObjectY] = useState(0);
  const [objectRotation, setObjectRotation] = useState(0);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [opacity, setOpacity] = useState(1);
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [strokeDashArray, setStrokeDashArray] = useState([]);
  const [textValue, setTextValue] = useState('');
  const [fontSize, setFontSize] = useState(15);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [textColor, setTextColor] = useState('#000000');
  const [gradients] = useState([
    {
      name: 'Blood Orange',
      colors: ['#ff4e50', '#f9d423']
    },
    {
      name: 'Deep Purple',
      colors: ['#4776E6', '#8E54E9']
    },
    {
      name: 'Mango Tango',
      colors: ['#F09819', '#EDDE5D']
    },
    {
      name: 'Aqua Marine',
      colors: ['#1A2980', '#26D0CE']
    },
    {
      name: 'Pink Lemonade',
      colors: ['#dd5e89', '#f7bb97']
    },
    {
      name: 'Midnight City',
      colors: ['#232526', '#414345']
    },
    {
      name: 'Electric Violet',
      colors: ['#4776E6', '#7F00FF']
    },
    {
      name: 'Citrus Peel',
      colors: ['#FDC830', '#F37335']
    },
    {
      name: 'Pacific Dream',
      colors: ['#34e89e', '#0f3443']
    },
    {
      name: 'Velvet Sun',
      colors: ['#e1eec3', '#f05053']
    },
    {
      name: 'Frozen Berry',
      colors: ['#403B4A', '#E7E9BB']
    },
    {
      name: 'Mystic',
      colors: ['#757F9A', '#D7DDE8']
    },
    {
      name: 'Firewatch',
      colors: ['#ED213A', '#93291E']
    },
    {
      name: 'Moonlit Asteroid',
      colors: ['#0F2027', '#203A43', '#2C5364']
    },
    {
      name: 'Tropical Sunrise',
      colors: ['#FF416C', '#FF4B2B']
    },
    {
      name: 'Azure Pop',
      colors: ['#EF32D9', '#89FFFD']
    }
  ]);
  const [showBorderDropdown, setShowBorderDropdown] = useState(false);

  const panelWidth = 384; // Corresponds to w-96
  const panelHeight = 450; // Corresponds to h-[450px]

  // Calculate effective left and top to keep the panel within the canvas boundaries
  const effectiveLeft = Math.min(position.left, fabricCanvas ? fabricCanvas.getWidth() - panelWidth : window.innerWidth - panelWidth);
  const effectiveTop = Math.min(position.top, fabricCanvas ? fabricCanvas.getHeight() - panelHeight : window.innerHeight - panelHeight);

  // Ensure left and top are not negative
  const finalLeft = Math.max(0, effectiveLeft);
  const finalTop = Math.max(0, effectiveTop);

  useEffect(() => {
    console.log("Selected object updated in ObjectSettingsPanel:", selectedObject);
    if (selectedObject) {
      setObjectWidth(selectedObject.getScaledWidth().toFixed(1));
      setObjectHeight(selectedObject.getScaledHeight().toFixed(1));
      setObjectX(selectedObject.left.toFixed(1));
      setObjectY(selectedObject.top.toFixed(1));
      setObjectRotation(selectedObject.angle.toFixed(1));

      let targetObjectForStyle = selectedObject;
      if (selectedObject.type === 'group' && selectedObject.getObjects().length > 0) {
        targetObjectForStyle = selectedObject.getObjects()[0]; // Get the first object (the shape)
      }

      setStrokeColor(targetObjectForStyle.stroke || '#000000');
      setOpacity(targetObjectForStyle.opacity || 1);
      setStrokeWidth(targetObjectForStyle.strokeWidth || 1);
      setStrokeDashArray(targetObjectForStyle.strokeDashArray || []);

      if (selectedObject.type === 'textbox') {
        setTextValue(selectedObject.text);
        setFontSize(selectedObject.fontSize);
        setFontFamily(selectedObject.fontFamily);
        setIsBold(selectedObject.fontWeight === 'bold');
        setIsItalic(selectedObject.fontStyle === 'italic');
        setTextAlign(selectedObject.textAlign);
        setTextColor(selectedObject.fill || '#000000');
      } else if (selectedObject.type === 'group') {
        const textObjectInGroup = selectedObject.getObjects().find(obj => obj.type === 'textbox');
        if (textObjectInGroup) {
          setTextValue(textObjectInGroup.text);
          setFontSize(textObjectInGroup.fontSize);
          setFontFamily(textObjectInGroup.fontFamily);
          setIsBold(textObjectInGroup.fontWeight === 'bold');
          setIsItalic(textObjectInGroup.fontStyle === 'italic');
          setTextAlign(textObjectInGroup.textAlign);
          setTextColor(textObjectInGroup.fill || '#000000');
        } else {
          setTextValue('');
          setFontSize(15);
          setFontFamily('Arial');
          setIsBold(false);
          setIsItalic(false);
          setTextAlign('left');
          setTextColor('#000000');
        }
      } else {
        setTextValue('');
        setFontSize(16);
        setFontFamily('Arial');
        setIsBold(false);
        setIsItalic(false);
        setTextAlign('left');
        setTextColor('#000000');
      }
    } else {
      setObjectWidth(0);
      setObjectHeight(0);
      setObjectX(0);
      setObjectY(0);
      setObjectRotation(0);
      setStrokeColor('#000000');
      setOpacity(1);
      setStrokeWidth(1);
      setStrokeDashArray([]);
      setTextValue('');
      setFontSize(15);
      setFontFamily('Arial');
      setIsBold(false);
      setIsItalic(false);
      setTextAlign('left');
      setTextColor('#000000');
    }

    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (position) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [position, onClose, selectedObject]);

  const handleCopy = () => {
    if (selectedObject) {
      // Get the active object and serialize it
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        // For images, we need to ensure we're copying the correct image data
        if (activeObject.type === 'image') {
          const imageData = {
            type: 'image',
            src: activeObject._element.src,
            left: activeObject.left,
            top: activeObject.top,
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY,
            angle: activeObject.angle,
            width: activeObject.width,
            height: activeObject.height,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          };
          setClipboard(imageData);
          console.log("Image copied to clipboard:", imageData);
        } else if (activeObject.type === 'line') {
          // Special handling for lines
          const lineData = {
            type: 'line',
            x1: activeObject.x1,
            y1: activeObject.y1,
            x2: activeObject.x2,
            y2: activeObject.y2,
            stroke: activeObject.stroke,
            strokeWidth: activeObject.strokeWidth,
            left: activeObject.left,
            top: activeObject.top,
            angle: activeObject.angle,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          };
          setClipboard(lineData);
          console.log("Line copied to clipboard:", lineData);
        } else {
          // For other objects, use the standard toObject method
          const objectData = activeObject.toObject();
          setClipboard(objectData);
          console.log("Object copied to clipboard:", objectData);
        }
      }
    }
  };

  const handleCut = () => {
    if (selectedObject) {
      // Get the active object and serialize it
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        // For images, we need to ensure we're copying the correct image data
        if (activeObject.type === 'image') {
          const imageData = {
            type: 'image',
            src: activeObject._element.src,
            left: activeObject.left,
            top: activeObject.top,
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY,
            angle: activeObject.angle,
            width: activeObject.width,
            height: activeObject.height,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          };
          setClipboard(imageData);
          fabricCanvas.remove(activeObject);
          fabricCanvas.requestRenderAll();
          console.log("Image cut to clipboard:", imageData);
        } else if (activeObject.type === 'line') {
          // Special handling for lines
          const lineData = {
            type: 'line',
            x1: activeObject.x1,
            y1: activeObject.y1,
            x2: activeObject.x2,
            y2: activeObject.y2,
            stroke: activeObject.stroke,
            strokeWidth: activeObject.strokeWidth,
            left: activeObject.left,
            top: activeObject.top,
            angle: activeObject.angle,
            selectable: true,
            hasControls: true,
            hasBorders: true,
          };
          setClipboard(lineData);
          fabricCanvas.remove(activeObject);
          fabricCanvas.requestRenderAll();
          console.log("Line cut to clipboard:", lineData);
        } else {
          // For other objects, use the standard toObject method
          const objectData = activeObject.toObject();
          setClipboard(objectData);
          fabricCanvas.remove(activeObject);
          fabricCanvas.requestRenderAll();
          console.log("Object cut to clipboard:", objectData);
        }
      }
    }
  };

  const handlePaste = async () => {
    if (!fabricCanvas || !clipboard) {
      console.log("Cannot paste: No canvas or clipboard data");
      return;
    }
    let pastedObject;
    const offset = 20;
    const objectType = clipboard.type ? clipboard.type.toLowerCase() : null;
    switch (objectType) {
      case 'group': {
        // Manually reconstruct each child object from plain object data, recursively handle nested groups
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
              // Recursively reconstruct nested groups
              const nestedChildren = (obj.objects || []).map(reconstructFabricObject).filter(child => child && typeof child.toObject === 'function');
              return new fabric.Group(nestedChildren, obj);
            }
            default:
              console.warn('Unknown child type in group:', obj.type, obj);
              return null;
          }
        }
        const children = (clipboard.objects || []).map(reconstructFabricObject).filter(obj => obj && typeof obj.toObject === 'function');
        // Debug logs
        console.log('children:', children);
        console.log('types:', children.map(obj => obj && obj.type));
        console.log('are all Fabric objects:', children.every(obj => obj && typeof obj.toObject === 'function'));
        children.forEach((child, idx) => {
          if (!child || typeof child.toObject !== 'function') {
            console.warn(`Child ${idx} is not a valid Fabric object:`, child);
          }
        });
        // Only pass valid group options, not the entire clipboard object
        const {
          left, top, scaleX, scaleY, angle, width, height, fill, stroke, strokeWidth,
          opacity, visible, backgroundColor, skewX, skewY, flipX, flipY, originX, originY
        } = clipboard;
        pastedObject = new fabric.Group(children, {
          left: (left || 0) + offset,
          top: (top || 0) + offset,
          scaleX, scaleY, angle, width, height, fill, stroke, strokeWidth,
          opacity, visible, backgroundColor, skewX, skewY, flipX, flipY, originX, originY,
          evented: true,
          fontSize: 15, 
          selectable: true,
          hasControls: true,
          hasBorders: true,
        });
        break;
      }
      case 'image':
        // For images, we need to load the image first
        if (!clipboard.src) {
          console.error("No image source found in clipboard data");
          return;
        }

        // Create a new image element
        const img = new Image();
        img.crossOrigin = "anonymous";
        
        img.onload = () => {
          // Create a new fabric image
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

          // Remove any existing selection
          fabricCanvas.discardActiveObject();
          
          // Add the new image
          fabricCanvas.add(fabricImage);
          
          // Select only the new image
          fabricCanvas.setActiveObject(fabricImage);
          fabricCanvas.requestRenderAll();
          setSelectedObject(fabricImage);
          console.log("Image pasted successfully");
        };

        img.onerror = (error) => {
          console.error("Error loading image:", error);
        };

        // Set the image source to start loading
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

      case 'text':
        pastedObject = new fabric.Text(clipboard.text, {
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

      case 'textbox':
        pastedObject = new fabric.Textbox(clipboard.text, {
          left: (clipboard.left || 0) + offset,
          top: (clipboard.top || 0) + offset,
          width: clipboard.width,
          height: clipboard.height,
          fontSize: clipboard.fontSize,
          fill: clipboard.fill,
          fontFamily: clipboard.fontFamily,
          fontWeight: clipboard.fontWeight,
          textAlign: clipboard.textAlign,
          // add more properties as needed, but do NOT include 'type'
          evented: true,
          selectable: true,
          hasControls: true,
          hasBorders: true,
        });
        break;


        default:
          // For any other type, try to use enlivenObjects as a fallback
          console.log("default")
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
              setSelectedObject(obj);
            }
          });
          return;
    }

    // Add the object to canvas
    fabricCanvas.add(pastedObject);
    
    // Select the pasted object
    fabricCanvas.setActiveObject(pastedObject);
    fabricCanvas.requestRenderAll();
    
    // Update selected object state
    setSelectedObject(pastedObject);
    console.log("Object pasted successfully");
  };

  const handleDelete = () => {
    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects && activeObjects.length > 0) {
      activeObjects.forEach((obj) => {
        fabricCanvas.remove(obj);
      });
      fabricCanvas.discardActiveObject();
      fabricCanvas.requestRenderAll();
      console.log("Object(s) deleted");
      onClose();
    }
  };

  const handleGroup = () => {
    if (fabricCanvas.getActiveObjects().length > 1) {
      const activeObjects = fabricCanvas.getActiveObjects();
      const group = new ActiveSelection(activeObjects, {
        canvas: fabricCanvas,
      });
      fabricCanvas.setActiveObject(group);
      fabricCanvas.requestRenderAll();
      console.log("Objects grouped");
    }
  };

  const handleUngroup = () => {
    const activeObject = fabricCanvas.getActiveObject();
    if (activeObject && activeObject.type === "activeSelection") {
      activeObject.ungroup();
      fabricCanvas.requestRenderAll();
      console.log("Objects ungrouped");
    }
  };

  const handleSendToBack = () => {
    if (selectedObject) {
      fabricCanvas.sendObjectToBack(selectedObject);
      fabricCanvas.requestRenderAll();
      console.log("Object sent to back");
    }
  };

  const handleSendBackward = () => {
    if (selectedObject) {
      fabricCanvas.sendObjectBackwards(selectedObject);
      fabricCanvas.requestRenderAll();
      console.log("Object sent backward");
    }
  };

  const handleBringForward = () => {
    if (selectedObject) {
      fabricCanvas.bringObjectForward(selectedObject);
      fabricCanvas.requestRenderAll();
      console.log("Object brought forward");
    }
  };

  const handleBringToFront = () => {
    if (selectedObject) {
      fabricCanvas.bringObjectToFront(selectedObject);
      fabricCanvas.requestRenderAll();
      console.log("Object brought to front");
    }
  };

  const handleAlignLeft = () => {
    if (selectedObject) {
      selectedObject.set({ left: 0 });
      fabricCanvas.requestRenderAll();
      console.log("Object aligned left");
    }
  };

  const handleAlignCenterHorizontal = () => {
    if (selectedObject) {
      selectedObject.set({
        left: fabricCanvas.getWidth() / 2 - selectedObject.getScaledWidth() / 2,
      });
      fabricCanvas.requestRenderAll();
      console.log("Object aligned center horizontally");
    }
  };

  const handleAlignRight = () => {
    if (selectedObject) {
      selectedObject.set({
        left: fabricCanvas.getWidth() - selectedObject.getScaledWidth(),
      });
      fabricCanvas.requestRenderAll();
      console.log("Object aligned right");
    }
  };

  const handleAlignTop = () => {
    if (selectedObject) {
      selectedObject.set({ top: 0 });
      fabricCanvas.requestRenderAll();
      console.log("Object aligned top");
    }
  };

  const handleAlignMiddle = () => {
    if (selectedObject) {
      selectedObject.set({
        top:
          fabricCanvas.getHeight() / 2 - selectedObject.getScaledHeight() / 2,
      });
      fabricCanvas.requestRenderAll();
      console.log("Object aligned middle vertically");
    }
  };

  const handleAlignBottom = () => {
    if (selectedObject) {
      selectedObject.set({
        top: fabricCanvas.getHeight() - selectedObject.getScaledHeight(),
      });
      fabricCanvas.requestRenderAll();
      console.log("Object aligned bottom");
    }
  };

  const updateObjectProperty = (property, value) => {
    if (selectedObject) {
      selectedObject.set(property, parseFloat(value));
      fabricCanvas.requestRenderAll();
    }
  };

  const handleWidthChange = (e) => {
    const newWidth = e.target.value;
    setObjectWidth(newWidth);
    updateObjectProperty("width", newWidth);
  };

  const handleHeightChange = (e) => {
    const newHeight = e.target.value;
    setObjectHeight(newHeight);
    updateObjectProperty("height", newHeight);
  };

  const handleXChange = (e) => {
    const newX = e.target.value;
    setObjectX(newX);
    updateObjectProperty("left", newX);
  };

  const handleYChange = (e) => {
    const newY = e.target.value;
    setObjectY(newY);
    updateObjectProperty("top", newY);
  };

  const handleRotationChange = (e) => {
    const newRotation = e.target.value;
    setObjectRotation(newRotation);
    updateObjectProperty("angle", newRotation);
  };

  const incrementProperty = (property, currentValue, step = 0.1) => {
    const newValue = parseFloat(currentValue) + step;
    if (selectedObject) {
      selectedObject.set(property, newValue);
      fabricCanvas.requestRenderAll();
      // Update local state after fabric updates
      if (property === "width") setObjectWidth(newValue.toFixed(1));
      if (property === "height") setObjectHeight(newValue.toFixed(1));
      if (property === "left") setObjectX(newValue.toFixed(1));
      if (property === "top") setObjectY(newValue.toFixed(1));
      if (property === "angle") setObjectRotation(newValue.toFixed(1));
      if (property === "strokeWidth") setStrokeWidth(newValue.toFixed(1));
    }
  };

  const decrementProperty = (property, currentValue, step = 0.1) => {
    const newValue = parseFloat(currentValue) - step;
    if (selectedObject) {
      selectedObject.set(property, newValue);
      fabricCanvas.requestRenderAll();
      // Update local state after fabric updates
      if (property === "width") setObjectWidth(newValue.toFixed(1));
      if (property === "height") setObjectHeight(newValue.toFixed(1));
      if (property === "left") setObjectX(newValue.toFixed(1));
      if (property === "top") setObjectY(newValue.toFixed(1));
      if (property === "angle") setObjectRotation(newValue.toFixed(1));
      if (property === "strokeWidth") setStrokeWidth(newValue.toFixed(1));
    }
  };

  const handleColorChange = (color) => {
    if (selectedObject) {
      let targetObject = getTargetTextObject(selectedObject);
      targetObject.set({
        fill: color,
        stroke: color,
        cornerColor: color
      });
      setStrokeColor(color);
      fabricCanvas.requestRenderAll();
    }
  };

  const handleStrokeColorChange = (color) => {
    if (selectedObject) {
      let targetObject = getTargetTextObject(selectedObject);
      targetObject.set({
        stroke: color
      });
      setStrokeColor(color);
      fabricCanvas.requestRenderAll();
    }
  };

  const handleGradientChange = (colors) => {
    if (selectedObject) {
      let targetObject = getTargetTextObject(selectedObject);
      try {
        // Get the scaled dimensions of the object
        const scaledWidth = targetObject.getScaledWidth();
        const scaledHeight = targetObject.getScaledHeight();

        const gradient = new fabric.Gradient({
          type: 'linear',
          coords: {
            x1: 0,
            y1: 0,
            x2: scaledWidth || 100, // Use scaled width, fallback to 100
            y2: scaledHeight || 100 // Use scaled height, fallback to 100
          },
          colorStops: colors.map((color, index) => ({
            offset: index / (colors.length - 1),
            color: color
          }))
        });

        targetObject.set('fill', gradient);
        fabricCanvas.requestRenderAll();
        console.log('Gradient applied:', gradient);
        console.log('Selected object dimensions (scaled):', scaledWidth, scaledHeight);
      } catch (error) {
        console.error('Error applying gradient:', error);
      }
    }
  };

  const handleOpacityChange = (value) => {
    if (selectedObject) {
      let targetObject = getTargetTextObject(selectedObject);
      const newOpacity = parseFloat(value);
      targetObject.set({
        opacity: newOpacity
      });
      setOpacity(newOpacity);
      fabricCanvas.requestRenderAll();
    }
  };

  const handleStrokeWidthChange = (e) => {
    const newWidth = e.target.value;
    setStrokeWidth(newWidth);
    if (selectedObject) {
      let targetObject = getTargetTextObject(selectedObject);
      targetObject.set("strokeWidth", parseFloat(newWidth));
      fabricCanvas.requestRenderAll();
    }
  };

  const handleStrokeDashArrayChange = (e) => {
    const newDashArray = JSON.parse(e.target.value);
    if (selectedObject) {
      let targetObject = getTargetTextObject(selectedObject);
      targetObject.set({
        strokeDashArray: newDashArray
      });
      setStrokeDashArray(newDashArray);
      fabricCanvas.requestRenderAll();
    }
  };

  const handleTextInputChange = (e) => {
    const newText = e.target.value;
    setTextValue(newText);
    console.log("handleTextInputChange called. newText:", newText);
    console.log("selectedObject:", selectedObject);
    let textObject = getTargetTextObject(selectedObject);
    if (textObject) {
      textObject.set('text', newText);
      fabricCanvas.requestRenderAll();
      console.log("Text object updated.", textObject.text);
    } else {
      console.log("Selected object is not a text type or no object is selected.");
    }
  };

  const handleFontFamilyChange = (e) => {
    const newFontFamily = e.target.value;
    setFontFamily(newFontFamily);
    let textObject = getTargetTextObject(selectedObject);
    if (textObject) {
      textObject.set('fontFamily', newFontFamily);
      fabricCanvas.requestRenderAll();
    }
  };

  const handleFontSizeChange = (e) => {
    const newFontSize = parseFloat(e.target.value);
    setFontSize(newFontSize);
    let textObject = getTargetTextObject(selectedObject);
    if (textObject) {
      textObject.set('fontSize', newFontSize);
      fabricCanvas.requestRenderAll();
    }
  };

  const handleBoldToggle = () => {
    const newIsBold = !isBold;
    setIsBold(newIsBold);
    let textObject = getTargetTextObject(selectedObject);
    if (textObject) {
      textObject.set('fontWeight', newIsBold ? 'bold' : 'normal');
      fabricCanvas.requestRenderAll();
    }
  };

  const handleItalicToggle = () => {
    const newIsItalic = !isItalic;
    setIsItalic(newIsItalic);
    let textObject = getTargetTextObject(selectedObject);
    if (textObject) {
      textObject.set('fontStyle', newIsItalic ? 'italic' : 'normal');
      fabricCanvas.requestRenderAll();
    }
  };

  const handleTextAlignChange = (alignment) => {
    setTextAlign(alignment);
    let textObject = getTargetTextObject(selectedObject);
    if (textObject) {
      textObject.set('textAlign', alignment);
      fabricCanvas.requestRenderAll();
    }
  };

  const handleTextColorChange = (color) => {
    setTextColor(color);
    let textObject = getTargetTextObject(selectedObject);
    if (textObject) {
      textObject.set('fill', color);
      fabricCanvas.requestRenderAll();
    }
  };

  if (!position) return null;

  return (
    <div
      ref={panelRef}
      className="absolute bg-white border border-gray-300 rounded-lg shadow-lg h-[450px] w-96 text-xs"
      style={{
        left: finalLeft,
        top: finalTop,
        zIndex: 9999,
      }}
    >
      <div className="flex border-b border-gray-200">
        <div className="flex flex-1">
          <button
            className={`flex-1 py-2 px-4 font-semibold text-sm ${
              activeMainTab === "Home"
                ? "border-b-2 border-teal-500 text-gray-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveMainTab("Home")}
          >
            Home
          </button>
          <button
            className={`flex-1 py-2 px-4 font-semibold text-sm ${
              activeMainTab === "Size"
                ? "border-b-2 border-teal-500 text-gray-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveMainTab("Size")}
          >
            Size
          </button>
          <button
            className={`flex-1 py-2 px-4 font-semibold text-sm ${
              activeMainTab === "Style"
                ? "border-b-2 border-teal-500 text-gray-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveMainTab("Style")}
          >
            Style
          </button>
          <button
            className={`flex-1 py-2 px-4 font-semibold text-sm ${
              activeMainTab === "Text"
                ? "border-b-2 border-teal-500 text-gray-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => setActiveMainTab("Text")}
          >
            Text
          </button>
        </div>
        <button
          className="p-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
      {activeMainTab === "Home" && (
        <>
          <div className="flex border-b border-gray-200 p-3">
            <button
              className={`flex-1 py-2 px-4 ${
                activeSubTab === "General"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveSubTab("General")}
            >
              General
            </button>
            <button
              className={`flex-1 py-2 px-4 ${
                activeSubTab === "Arrange"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveSubTab("Arrange")}
            >
              Arrange
            </button>
          </div>
          <div className="p-4">
            {activeSubTab === "General" && (
              <>
                <div className="w-full grid grid-cols-4 gap-2 p-5">
                  <div>
                    <button
                      className={`flex flex-col items-center justify-center p-2 rounded ${
                        selectedObject
                          ? "bg-gray-100 hover:bg-gray-300"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={handleCopy}
                      disabled={!selectedObject}
                    >
                      <Copy />
                    </button>
                    <span>copy</span>
                  </div>

                  <div>
                    <button
                      className={`flex flex-col items-center justify-center p-2 rounded ${
                        selectedObject
                          ? "bg-gray-100 hover:bg-gray-300"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={handleCut}
                      disabled={!selectedObject}
                    >
                      <Scissors className="-rotate-90" />
                    </button>
                    <span>cut</span>
                  </div>

                  <div>
                    <button
                      className={`flex flex-col items-center justify-center p-2 rounded ${
                        clipboard
                          ? "bg-gray-100 hover:bg-gray-300"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={handlePaste}
                      disabled={!clipboard}
                    >
                      <Clipboard />
                    </button>
                    <span>paste</span>
                  </div>

                  <div>
                    <button
                      className={`flex flex-col items-center justify-center p-2 rounded ${
                        selectedObject
                          ? "bg-gray-100 hover:bg-gray-300"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                      onClick={handleDelete}
                      disabled={!selectedObject}
                    >
                      <Trash2 />
                    </button>
                    <span>delete</span>
                  </div>
                </div>
                <div className="w-full flex justify-around mt-5">
                  <button
                    className={`flex flex-col items-center justify-center p-2 rounded ${
                      selectedObject &&
                      fabricCanvas.getActiveObjects().length > 1
                        ? "bg-gray-100 hover:bg-gray-300"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleGroup}
                    disabled={
                      !(
                        selectedObject &&
                        fabricCanvas.getActiveObjects().length > 1
                      )
                    }
                  >
                    <Group />
                    <span>group</span>
                  </button>
                  <button
                    className={`flex flex-col items-center justify-center p-2 rounded ${
                      selectedObject &&
                      selectedObject.type === "activeSelection"
                        ? "bg-gray-100 hover:bg-gray-300"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleUngroup}
                    disabled={
                      !(
                        selectedObject &&
                        selectedObject.type === "activeSelection"
                      )
                    }
                  >
                    <Ungroup />
                    <span>ungroup</span>
                  </button>
                </div>
              </>
            )}
            {activeSubTab === "Arrange" && (
              <div className="grid grid-cols-4 gap-2">
                <button
                  className={`flex flex-col items-center justify-center p-2 rounded ${
                    selectedObject
                      ? "bg-gray-100 hover:bg-gray-300"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleSendToBack}
                  disabled={!selectedObject}
                >
                  <RiSendToBack className="rotate-180 text-4xl text-gray-600" />
                  <span>back</span>
                </button>
                <button
                  className={`flex flex-col items-center justify-center p-2 rounded ${
                    selectedObject
                      ? "bg-gray-100 hover:bg-gray-300"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleSendBackward}
                  disabled={!selectedObject}
                >
                  <RiSendBackward className="rotate-180 text-4xl text-gray-600" />
                  <span>backward</span>
                </button>
                <button
                  className={`flex flex-col items-center justify-center p-2 rounded ${
                    selectedObject
                      ? "bg-gray-100 hover:bg-gray-300"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleBringForward}
                  disabled={!selectedObject}
                >
                  <RiBringForward className="rotate-180 text-4xl text-gray-600" />
                  <span>forward</span>
                </button>
                <button
                  className={`flex flex-col items-center justify-center p-2 rounded ${
                    selectedObject
                      ? "bg-gray-100 hover:bg-gray-300"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleBringToFront}
                  disabled={!selectedObject}
                >
                  <RiBringToFront className="text-4xl text-gray-600" />
                  <span>front</span>
                </button>
                <button
                  className={`flex flex-col items-center justify-center p-2 rounded ${
                    selectedObject
                      ? "bg-gray-100 hover:bg-gray-300"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleAlignRight}
                  disabled={!selectedObject}
                >
                  {/* <AlignRight /> */}
                  <RiAlignItemRightFill className="text-4xl text-gray-600" />
                  <span>right</span>
                </button>
                <button
                  className={`flex flex-col items-center justify-center p-2 rounded ${
                    selectedObject
                      ? "bg-gray-100 hover:bg-gray-300"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleAlignCenterHorizontal}
                  disabled={!selectedObject}
                >
                  {/* <AlignCenterHorizontal /> */}
                  <RiAlignItemHorizontalCenterFill className="text-4xl text-gray-600" />
                  <span>center</span>
                </button>
                <button
                  className={`flex flex-col items-center justify-center p-2 rounded ${
                    selectedObject
                      ? "bg-gray-100 hover:bg-gray-300"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleAlignLeft}
                  disabled={!selectedObject}
                >
                  {/* <AlignLeft /> */}
                  <RiAlignItemLeftFill className="text-4xl text-gray-600" />
                  <span>left</span>
                </button>
                <button
                  className={`flex flex-col items-center justify-center p-2 rounded ${
                    selectedObject
                      ? "bg-gray-100 hover:bg-gray-300"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleAlignTop}
                  disabled={!selectedObject}
                >
                  {/* <AlignTop /> */}
                  <RiAlignItemTopFill className="text-4xl text-gray-600" />
                  <span>top</span>
                </button>
                <button
                  className={`flex flex-col items-center justify-center p-2 rounded ${
                    selectedObject
                      ? "bg-gray-100 hover:bg-gray-300"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleAlignMiddle}
                  disabled={!selectedObject}
                >
                  {/* <AlignMiddle /> */}
                  <RiAlignItemVerticalCenterFill className="text-4xl text-gray-600" />
                  <span>middle</span>
                </button>
                <button
                  className={`flex flex-col items-center justify-center p-2 rounded ${
                    selectedObject
                      ? "bg-gray-100 hover:bg-gray-300"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  onClick={handleAlignBottom}
                  disabled={!selectedObject}
                >
                  {/* <AlignBottom /> */}
                  <RiAlignItemBottomFill className="text-4xl text-gray-600" />
                  <span>bottom</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
      {activeMainTab === "Size" && (
        <div className="p-4 flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-8 text-center">
              <span className="text-2xl font-semibold">&#x2194;</span>
            </span>
            <input
              type="number"
              value={objectWidth}
              onChange={handleWidthChange}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-right text-xs"
              disabled={!selectedObject}
            />
            <div className="flex flex-col">
              <button
                className="w-5 h-3.5 bg-gray-200 hover:bg-gray-300 rounded-t-sm flex items-center justify-center text-xs"
                onClick={() => incrementProperty("width", objectWidth)}
                disabled={!selectedObject}
              >
                &#9650;
              </button>
              <button
                className="w-5 h-3.5 bg-gray-200 hover:bg-gray-300 rounded-b-sm flex items-center justify-center text-xs"
                onClick={() => decrementProperty("width", objectWidth)}
                disabled={!selectedObject}
              >
                &#9660;
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-8 text-center">
              <span className="text-2xl font-semibold"> &#x2195;</span>
            </span>
            <input
              type="number"
              value={objectHeight}
              onChange={handleHeightChange}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-right text-xs"
              disabled={!selectedObject}
            />
            <div className="flex flex-col">
              <button
                className="w-5 h-3.5 bg-gray-200 hover:bg-gray-300 rounded-t-sm flex items-center justify-center text-xs"
                onClick={() => incrementProperty("height", objectHeight)}
                disabled={!selectedObject}
              >
                &#9650;
              </button>
              <button
                className="w-5 h-3.5 bg-gray-200 hover:bg-gray-300 rounded-b-sm flex items-center justify-center text-xs"
                onClick={() => decrementProperty("height", objectHeight)}
                disabled={!selectedObject}
              >
                &#9660;
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-8 text-center font-bold">X</span>
            <input
              type="number"
              value={objectX}
              onChange={handleXChange}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-right text-xs"
              disabled={!selectedObject}
            />
            <div className="flex flex-col">
              <button
                className="w-5 h-3.5 bg-gray-200 hover:bg-gray-300 rounded-t-sm flex items-center justify-center text-xs"
                onClick={() => incrementProperty("left", objectX)}
                disabled={!selectedObject}
              >
                &#9650;
              </button>
              <button
                className="w-5 h-3.5 bg-gray-200 hover:bg-gray-300 rounded-b-sm flex items-center justify-center text-xs"
                onClick={() => decrementProperty("left", objectX)}
                disabled={!selectedObject}
              >
                &#9660;
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-8 text-center font-bold">Y</span>
            <input
              type="number"
              value={objectY}
              onChange={handleYChange}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-right text-xs"
              disabled={!selectedObject}
            />
            <div className="flex flex-col">
              <button
                className="w-5 h-3.5 bg-gray-200 hover:bg-gray-300 rounded-t-sm flex items-center justify-center text-xs"
                onClick={() => incrementProperty("top", objectY)}
                disabled={!selectedObject}
              >
                &#9650;
              </button>
              <button
                className="w-5 h-3.5 bg-gray-200 hover:bg-gray-300 rounded-b-sm flex items-center justify-center text-xs"
                onClick={() => decrementProperty("top", objectY)}
                disabled={!selectedObject}
              >
                &#9660;
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="w-8 text-center">
              <BiRotateRight className="ms-2 text-xl" />
            </span>
            <input
              type="number"
              value={objectRotation}
              onChange={handleRotationChange}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-right text-xs"
              disabled={!selectedObject}
            />
            <span className="text-gray-600">°</span>
            <div className="flex flex-col">
              <button
                className="w-5 h-3.5 bg-gray-200 hover:bg-gray-300 rounded-t-sm flex items-center justify-center text-xs"
                onClick={() => incrementProperty("angle", objectRotation)}
                disabled={!selectedObject}
              >
                &#9650;
              </button>
              <button
                className="w-5 h-3.5 bg-gray-200 hover:bg-gray-300 rounded-b-sm flex items-center justify-center text-xs"
                onClick={() => decrementProperty("angle", objectRotation)}
                disabled={!selectedObject}
              >
                &#9660;
              </button>
            </div>
          </div>
        </div>
      )}
      {activeMainTab === "Style" && (
        <>
          <div className="flex border-b border-gray-200 p-3">
            <button
              className={`flex-1 py-2 px-4 ${
                activeColorSubTab === "Color"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveColorSubTab("Color")}
            >
              Color
            </button>
            <button
              className={`flex-1 py-2 px-4 ${
                activeColorSubTab === "Geometry"
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setActiveColorSubTab("Geometry")}
            >
              Geometry
            </button>
          </div>
          <div className="p-4">
            {activeColorSubTab === "Color" && (
              <>
                <div className="flex border-gray-200 p-3">
                  <button
                    className={`flex-1 py-2 px-4 bg-gray-100 ${
                      activeSubSubTab === "Colors"
                        ? "border-b-2 border-teal-500 text-gray-700 "
                        : " text-gray-700"
                    }`}
                    onClick={() => setActiveSubSubTab("Colors")}
                  >
                    Color
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 bg-gray-100 ${
                      activeSubSubTab === "Grediants"
                        ? "border-b-2 border-teal-500 text-gray-700 "
                        : " text-gray-700"
                    }`}
                    onClick={() => setActiveSubSubTab("Grediants")}
                  >
                    Grediants
                  </button>
                </div>
                <div className="h-[25vh] border border-gray-500 w-full grid grid-cols-4 gap-2 overflow-y-scroll overflow-x-hidden ">
                  {activeSubSubTab === "Colors" && (
                    <div className="min-h-[24.8vh] w-[348.5px] p-2 grid grid-cols-6 gap-5 rounded">
                      {[
                        "#FFFFFF", "#5D5D5D" , "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FF5733", "#33FF57", "#3357FF", "#FF33F5", "#33FFF5", "#F5FF33", "#C70039", "#900C3F", "#581845","#FFC300", "#DAF7A6", "#FF5733", "#4A235A","#1B4F72","#0E6251","#7D6608","#784212", "#4D5656",

                        '#FF3333', '#FF6666', '#FF9999', '#FFCCCC', '#FFE5E5', '#990000', '#660000',
                         '#33FF33', '#66FF66', '#99FF99', '#CCFFCC', '#E5FFE5', '#009900', '#006600',
                        '#0000FF', '#3333FF', '#6666FF', '#9999FF', '#CCCCFF', '#E5E5FF', '#000099', '#000066',
                        
                        // Extended Palette (Rainbow + Neutrals)
                        '#FFFF00', '#FFFF33', '#FFFF66', '#FFFF99', '#FFFFCC', '#FFFFE5', '#999900', '#666600',
                        '#FF00FF', '#FF33FF', '#FF66FF', '#FF99FF', '#FFCCFF', '#FFE5FF', '#990099', '#660066','#33FFFF', '#66FFFF', '#99FFFF', '#CCFFFF', '#E5FFFF', '#009999', '#006666',
                        
                        // Earth Tones + Specials
                        '#FFA500', '#FFB733', '#FFC966', '#FFDB99', '#FFEDCC', '#FFF6E5', '#996300', '#663D00',
                        '#800080', '#993399', '#B366B3', '#CC99CC', '#E5CCE5', '#F2E5F2', '#4D004D', '#330033',
                        '#A52A2A', '#B35959', '#C28989', '#D1B2B2', '#E8D9D9', '#F3ECEC', '#5C1616', '#330D0D',
                        
                        // Modern UI Colors
                        '#FF6347', '#FF7F50', '#FF8C69', '#FFA07A', '#FFB6C1', '#FFDAB9', '#CD5C5C', '#E9967A',
                        '#4682B4', '#5F9EA0', '#6495ED', '#7B68EE', '#9370DB', '#BA55D3', '#4169E1', '#6A5ACD',
                        '#2E8B57', '#3CB371', '#20B2AA', '#00CED1', '#40E0D0', '#AFEEEE', '#008080', '#008B8B'
                      ].map((color) => (
                        <button
                          key={color}
                          className={`w-6 h-6 rounded hover:scale-105 transition-transform`}
                          style={{ backgroundColor: `${color}` }}
                          onClick={() => handleColorChange(color)}
                          title={`Color: ${color}`}
                        />
                      ))}
                    </div>
                  )}
                  {activeSubSubTab === "Grediants" && (
                    <div className="min-h-[24.8vh] w-[348.5px] p-2 grid grid-cols-5 gap-5 rounded">
                      {gradients.map((gradient, index) => (
                        <button
                          key={index}
                          className="w-10 h-10 rounded hover:scale-105 transition-transform"
                          style={{ background: `linear-gradient(45deg, ${gradient.colors.join(', ')})` }}
                          onClick={() => handleGradientChange(gradient.colors)}
                          title={`Gradient: ${gradient.name}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-4 p-2 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Stroke Color</span>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={strokeColor}
                        onChange={(e) => handleStrokeColorChange(e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer"
                        disabled={!selectedObject}
                      />
                      <input
                        type="text"
                        value={strokeColor}
                        onChange={(e) => handleStrokeColorChange(e.target.value)}
                        className="ml-2 w-24 px-2 py-1 text-xs border border-gray-300 rounded"
                        disabled={!selectedObject}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Opacity</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={opacity}
                        onChange={(e) => handleOpacityChange(e.target.value)}
                        className="w-32"
                        disabled={!selectedObject}
                      />
                      <span className="text-xs text-gray-600 w-8 text-right">
                        {Math.round(opacity * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
            {activeColorSubTab === "Geometry" && (
              <div className="p-4 flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  
                  <input
                    type="number"
                    value={strokeWidth}
                    onChange={handleStrokeWidthChange}
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-right text-xs"
                    disabled={!selectedObject}
                  />
                  <div className="flex flex-col">
                    <button
                      className="w-5 h-3.5 bg-gray-200 hover:bg-gray-300 rounded-t-sm flex items-center justify-center text-xs"
                      onClick={() => incrementProperty("strokeWidth", strokeWidth)}
                      disabled={!selectedObject}
                    >
                      &#9650;
                    </button>
                    <button
                      className="w-5 h-3.5 bg-gray-200 hover:bg-gray-300 rounded-b-sm flex items-center justify-center text-xs"
                      onClick={() => decrementProperty("strokeWidth", strokeWidth)}
                      disabled={!selectedObject}
                    >
                      &#9660;
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <BsBorderStyle className="text-xl"/>
                  <div className="relative flex-1">
                    <button
                      onClick={() => setShowBorderDropdown(!showBorderDropdown)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-xs flex items-center justify-between"
                      disabled={!selectedObject}
                    >
                      <div className="flex items-center w-full">
                        <div className="w-full h-4 border-b-2 border-black" style={{
                          borderStyle: strokeDashArray.length === 0 ? 'solid' : 
                                     strokeDashArray.join(',') === '5,5' ? 'dashed' :
                                     strokeDashArray.join(',') === '1,5' ? 'dotted' : 'dashed'
                        }}></div>
                      </div>
                      <span className="ml-2">▼</span>
                    </button>
                    {showBorderDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                        <div
                          className="p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            handleStrokeDashArrayChange({ target: { value: '[]' } });
                            setShowBorderDropdown(false);
                          }}
                        >
                          <div className="w-full h-4 border-b-2 border-solid border-black"></div>
                        </div>
                        <div
                          className="p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            handleStrokeDashArrayChange({ target: { value: '[5, 5]' } });
                            setShowBorderDropdown(false);
                          }}
                        >
                          <div className="w-full h-4 border-b-2 border-dashed border-black"></div>
                        </div>
                        <div
                          className="p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            handleStrokeDashArrayChange({ target: { value: '[1, 5]' } });
                            setShowBorderDropdown(false);
                          }}
                        >
                          <div className="w-full h-4 border-b-2 border-dotted border-black"></div>
                        </div>
                        <div
                          className="p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => {
                            handleStrokeDashArrayChange({ target: { value: '[10, 5, 20, 5]' } });
                            setShowBorderDropdown(false);
                          }}
                        >
                          <div className="w-full h-4 border-b-2 border-dashed border-black"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
      {activeMainTab === "Text" && (
        <div className="p-4 flex flex-col space-y-4">
          {/* Text Input */}
          <div className="flex flex-col">
            <label htmlFor="text-value" className="text-sm font-medium text-gray-700 mb-1">
              Text Content
            </label>
            <input
              id="text-value"
              type="text"
              value={textValue}
              onChange={handleTextInputChange}
              className="border border-gray-300 rounded px-2 py-1 text-xs"
              placeholder="Enter text..."
              disabled={!selectedObject || (!(selectedObject.type === 'text' || selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && !(selectedObject.type === 'group' && selectedObject.getObjects().some(obj => obj.type === 'textbox')))}
            />
          </div>

          {/* Font Family */}
          <div className="flex flex-col">
            <label htmlFor="font-family" className="text-sm font-medium text-gray-700 mb-1">
              Font Family
            </label>
            <select
              id="font-family"
              value={fontFamily}
              onChange={handleFontFamilyChange}
              className="border border-gray-300 rounded px-2 py-1 text-xs"
              disabled={!selectedObject || (!(selectedObject.type === 'text' || selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && !(selectedObject.type === 'group' && selectedObject.getObjects().some(obj => obj.type === 'textbox')))}
            >
              <option value="Arial">Default (Arial)</option>
              <option value="Arial Black">Arial Black</option>
              <option value="Arial Narrow">Arial Narrow</option>
              <option value="Book Antiqua">Book Antiqua</option>
              <option value="Bookman Old Style">Bookman Old Style</option>
              <option value="Calibri">Calibri</option>
              <option value="Cambria">Cambria</option>
              <option value="Century Gothic">Century Gothic</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Consolas">Consolas</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Garamond">Garamond</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Impact">Impact</option>
              <option value="Lucida Console">Lucida Console</option>
              <option value="Lucida Sans Unicode">Lucida Sans Unicode</option>
              <option value="Microsoft Sans Serif">Microsoft Sans Serif</option>
              <option value="Monotype Corsiva">Monotype Corsiva</option>
              <option value="Palatino Linotype">Palatino Linotype</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
              <option value="Verdana">Verdana</option>
              <option value="Brush Script MT">Brush Script MT</option>
              <option value="Copperplate Gothic">Copperplate Gothic</option>
              <option value="Franklin Gothic">Franklin Gothic</option>
              <option value="Gill Sans">Gill Sans</option>
              <option value="Segoe UI">Segoe UI</option>
              <option value="Segoe Script">Segoe Script</option>
              <option value="Segoe Print">Segoe Print</option>
              <option value="Rockwell">Rockwell</option>
              <option value="Optima">Optima</option>
              <option value="Perpetua">Perpetua</option>
              <option value="Baskerville">Baskerville</option>
              <option value="Futura">Futura</option>
              <option value="Didot">Didot</option>
              <option value="Bodoni">Bodoni</option>
              <option value="Century">Century</option>
              <option value="Avant Garde">Avant Garde</option>
              <option value="Geneva">Geneva</option>
              <option value="Courier">Courier</option>
              <option value="Monaco">Monaco</option>
              <option value="Andale Mono">Andale Mono</option>
              <option value="Bradley Hand">Bradley Hand</option>
              <option value="Chalkboard">Chalkboard</option>
              <option value="Chalkboard SE">Chalkboard SE</option>
              <option value="Comic Sans">Comic Sans</option>
              <option value="Marker Felt">Marker Felt</option>
              <option value="Menlo">Menlo</option>
              <option value="Papyrus">Papyrus</option>
              <option value="Zapfino">Zapfino</option>
            </select>
          </div>

          {/* Font Size */}
          <div className="flex items-center space-x-2">
            <span className="w-8 text-center text-sm font-medium text-gray-700">Size</span>
            <input
              type="number"
              value={fontSize}
              onChange={handleFontSizeChange}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-right text-xs"
              disabled={!selectedObject || (!(selectedObject.type === 'text' || selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && !(selectedObject.type === 'group' && selectedObject.getObjects().some(obj => obj.type === 'textbox')))}
            />
            <div className="flex flex-col">
              <button
                className="w-5 h-3.5 bg-gray-200 hover:bg-gray-300 rounded-t-sm flex items-center justify-center text-xs"
                onClick={() => handleFontSizeChange({ target: { value: fontSize + 1 } })}
                disabled={!selectedObject || (!(selectedObject.type === 'text' || selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && !(selectedObject.type === 'group' && selectedObject.getObjects().some(obj => obj.type === 'textbox')))}
              >
                &#9650;
              </button>
              <button
                className="w-5 h-3.5 bg-gray-200 hover:bg-gray-300 rounded-b-sm flex items-center justify-center text-xs"
                onClick={() => handleFontSizeChange({ target: { value: fontSize - 1 } })}
                disabled={!selectedObject || (!(selectedObject.type === 'text' || selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && !(selectedObject.type === 'group' && selectedObject.getObjects().some(obj => obj.type === 'textbox')))}
              >
                &#9660;
              </button>
            </div>
          </div>

          {/* Bold, Italic, Alignments */}
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-1 rounded font-bold ${isBold ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={handleBoldToggle}
              disabled={!selectedObject || (!(selectedObject.type === 'text' || selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && !(selectedObject.type === 'group' && selectedObject.getObjects().some(obj => obj.type === 'textbox')))}
            >
              B
            </button>
            <button
              className={`px-3 py-1 rounded italic ${isItalic ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              onClick={handleItalicToggle}
              disabled={!selectedObject || (!(selectedObject.type === 'text' || selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && !(selectedObject.type === 'group' && selectedObject.getObjects().some(obj => obj.type === 'textbox')))}
            >
              I
            </button>
            <div className="flex-1 flex justify-end space-x-1">
              <button
                className={`px-3 py-1 rounded ${textAlign === 'left' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => handleTextAlignChange('left')}
                disabled={!selectedObject || (!(selectedObject.type === 'text' || selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && !(selectedObject.type === 'group' && selectedObject.getObjects().some(obj => obj.type === 'textbox')))}
              >
                Left
              </button>
              <button
                className={`px-3 py-1 rounded ${textAlign === 'center' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => handleTextAlignChange('center')}
                disabled={!selectedObject || (!(selectedObject.type === 'text' || selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && !(selectedObject.type === 'group' && selectedObject.getObjects().some(obj => obj.type === 'textbox')))}
              >
                Center
              </button>
              <button
                className={`px-3 py-1 rounded ${textAlign === 'right' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => handleTextAlignChange('right')}
                disabled={!selectedObject || (!(selectedObject.type === 'text' || selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && !(selectedObject.type === 'group' && selectedObject.getObjects().some(obj => obj.type === 'textbox')))}
              >
                Right
              </button>
            </div>
          </div>
          {/* Text Color Picker */}
          <div className="mt-4 p-2 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-700">Text Color</span>
            <div className="h-[15vh] w-full grid grid-cols-6 gap-2 overflow-y-scroll overflow-x-hidden rounded mt-2">
              {[ 
                "#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FF5733", "#33FF57", "#3357FF", "#FF33F5", "#33FFF5", "#F5FF33", "#C70039", "#900C3F", "#581845","#FFC300", "#DAF7A6", "#FF5733", "#4A235A","#1B4F72","#0E6251","#7D6608","#784212", "#4D5656",
                '#FF3333', '#FF6666', '#FF9999', '#FFCCCC', '#FFE5E5', '#990000', '#660000',
                '#33FF33', '#66FF66', '#99FF99', '#CCFFCC', '#E5FFE5', '#009900', '#006600',
                '#0000FF', '#3333FF', '#6666FF', '#9999FF', '#CCCCFF', '#E5E5FF', '#000099', '#000066',
                '#FFFF00', '#FFFF33', '#FFFF66', '#FFFF99', '#FFFFCC', '#FFFFE5', '#999900', '#666600',
                '#FF00FF', '#FF33FF', '#FF66FF', '#FF99FF', '#FFCCFF', '#FFE5FF', '#990099', '#660066','#33FFFF', '#66FFFF', '#99FFFF', '#CCFFFF', '#E5FFFF', '#009999', '#006666',
                '#FFA500', '#FFB733', '#FFC966', '#FFDB99', '#FFEDCC', '#FFF6E5', '#996300', '#663D00',
                '#800080', '#993399', '#B366B3', '#CC99CC', '#E5CCE5', '#F2E5F2', '#4D004D', '#330033',
                '#A52A2A', '#B35959', '#C28989', '#D1B2B2', '#E8D9D9', '#F3ECEC', '#5C1616', '#330D0D',
                '#FF6347', '#FF7F50', '#FF8C69', '#FFA07A', '#FFB6C1', '#FFDAB9', '#CD5C5C', '#E9967A',
                '#4682B4', '#5F9EA0', '6495ED', '#7B68EE', '#9370DB', '#BA55D3', '#4169E1', '#6A5ACD',
                '#2E8B57', '#3CB371', '#20B2AA', '#00CED1', '#40E0D0', '#AFEEEE', '#008080', '#008B8B'
              ].map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded hover:scale-105 transition-transform ${(!selectedObject || (!(selectedObject.type === 'text' || selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && !(selectedObject.type === 'group' && selectedObject.getObjects().some(obj => obj.type === 'textbox')))) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ backgroundColor: `${color}` }}
                  onClick={() => handleTextColorChange(color)}
                  title={`Color: ${color}`}
                  disabled={!selectedObject || (!(selectedObject.type === 'text' || selectedObject.type === 'i-text' || selectedObject.type === 'textbox') && !(selectedObject.type === 'group' && selectedObject.getObjects().some(obj => obj.type === 'textbox')))}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectSettingsPanel;
