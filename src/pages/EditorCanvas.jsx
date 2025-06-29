import React, { useState, useRef, useEffect } from "react";
import { ToolsPanel } from "../components/ToolsPanel";
import  DesignCanvas, { getUserObjectsForSaving }  from "../components/DesignCanvas";
import { HorizontalRuler, VerticalRuler } from "../components/Rulers";
import { Button } from "../components/ui/button";
import { Group } from "fabric";
import * as fabric from 'fabric';
import { useLocation, useNavigate } from "react-router-dom";
import {
  Save,
  Download,
  Upload,
  Undo,
  Redo,
  Copy,
  Scissors,
  ClipboardPaste,
  Trash2,
  Printer,
  Calculator,
  X,
} from "lucide-react";
import ShapesPanel from "../components/ShapesPanel";
import Calculate from "../components/Calculate";
import { useTag } from "../utils/TagService/TagHooks/useTag";
import { apiClient } from "../auth/apiClient";
import { useTemplate } from "../context/TemplateContext";

import { addGridAndRulers } from "../components/DesignCanvas";

// // import { PropertiesPanel } from "../components/PropertiesPanel";



// Template sizes in inches
const TEMPLATE_SIZES = {
  "1UP": {
    portrait: { width: 8.5, height: 11 },
    landscape: { width: 11, height: 8.5 }
  },
  "1UP (LEGAL)": {
    portrait: { width: 8.6, height: 14 },
    landscape: { width: 14, height: 8.6 }
  },
  "2UP": {
    portrait: { width: 8.7, height: 5.5 },
    landscape: { width: 5.5, height: 8.7 }
  },
  "4UP": {
    portrait: { width: 4, height: 5 },
    landscape: { width: 5, height: 4 }
  },
  "4UP(4.25 X 5.1)": {
    portrait: { width: 4.25, height: 5.1 },
    landscape: { width: 5.1, height: 4.25 }
  },
  "8UP": {
    portrait: { width: 2, height: 5.5 },
    landscape: { width: 5.5, height: 2 }
  },
  "16UP": {
    portrait: { width: 2, height: 2.7 },
    landscape: { width: 2.7, height: 2 }
  },
  "AVERY 5160": {
    portrait: { width: 1, height: 2.5 },
    landscape: { width: 2.5, height: 1 }
  },
  "AVERY 5163": {
    portrait: { width: 2, height: 4 },
    landscape: { width: 4, height: 2 }
  },
  "TWO PAGE": {
    portrait: { width: 8.3, height: 5.5 },
    landscape: { width: 5.5, height: 8.3 }
  },
  "FULL PAGE": {
    portrait: { width: 10, height: 11 },
    landscape: { width: 11, height: 10 }
  },
};

function EditorCanvas() {
  const location = useLocation();
  const { template, orientation } = location.state || { template: "1UP", orientation: "portrait" };
  const navigate = useNavigate();
  const { setTemplateName: setContextTemplateName, setIsEditMode } = useTemplate();
  
  const [activeTool, setActiveTool] = useState("select");
  const [selectedObject, setSelectedObject] = useState(null);
  const [canvasSize, setCanvasSize] = useState(() => {
    // Convert inches to pixels (assuming 96 DPI)
    const dpi = 96;
    const templateSize = TEMPLATE_SIZES[template] || TEMPLATE_SIZES["1UP"];
    const size = templateSize[orientation] || templateSize.portrait;
    return {
      width: size.width * dpi,
      height: size.height * dpi
    };
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [fillColor, setFillColor] = useState("#000000");
  const [clipboard, setClipboard] = useState(null);
  const [mouseX, setMouseX] = useState(null);
  const [mouseY, setMouseY] = useState(null);
  const [showGuideline, setShowGuideline] = useState(false);
  const containerRef = useRef(null);
  const [settingsIconPosition, setSettingsIconPosition] = useState(null);

  const [showCalculator, setShowCalculator] = useState(false);

  const [strokeColor, setStrokeColor] = useState("#ef4444");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showTemplateNameDialog, setShowTemplateNameDialog] = useState(false);
  const [templateName, setTemplateName] = useState("");

  const { fetchTagById } = useTag("afhstXDev");

  const [initialConfig, setInitialConfig] = useState(null);
// <<<<<<< HEAD
// =======
  const [canvasConfig, setCanvasConfig] = useState(null);

  // Add a state to track if editing or creating
  const isEditMode = Boolean((location.state && (location.state.id || (initialConfig && initialConfig.id))));
// >>>>>>> main

  const handleObjectSelect = (object) => {
    setSelectedObject(object);
  };




  const handleOpenCalculator = () => {
    setShowCalculator(true);
  };

  const handleCloseCalculator = () => {
    setShowCalculator(false);
  };

  const handleSaveCalculator = (calculations) => {
    console.log("Saved Field Calculations from Header:", calculations);
    setShowCalculator(false);
  };

  // Add effect to update canvas size when template or orientation changes
  useEffect(() => {
    const dpi = 96;
    const templateSize = TEMPLATE_SIZES[template] || TEMPLATE_SIZES["1UP"];
    const size = templateSize[orientation] || templateSize.portrait;
    const newSize = {
      width: size.width * dpi,
      height: size.height * dpi
    };
    
    // Only update canvas size if fabricCanvas exists
    if (fabricCanvas) {
      // Store current objects
      const currentObjects = fabricCanvas.getObjects();
      console.log('Current objects before size change:', currentObjects);
      
      // Update canvas dimensions
      fabricCanvas.setDimensions({
        width: newSize.width,
        height: newSize.height
      });
      
      // Do not set background color to white here; let the grid/ruler show through for editing
      
      // Center objects in new canvas size
      currentObjects.forEach(obj => {
        // Calculate new position to keep object centered
        const centerX = newSize.width / 2;
        const centerY = newSize.height / 2;
        
        // If object was previously centered, keep it centered
        if (obj.left === fabricCanvas.width / 2) {
          obj.set('left', centerX);
        }
        if (obj.top === fabricCanvas.height / 2) {
          obj.set('top', centerY);
        }
        
        // Ensure object stays within new canvas bounds
        if (obj.left + obj.width * obj.scaleX > newSize.width) {
          obj.set('left', newSize.width - obj.width * obj.scaleX);
        }
        if (obj.top + obj.height * obj.scaleY > newSize.height) {
          obj.set('top', newSize.height - obj.height * obj.scaleY);
        }
      });
      
      // Update canvas size state
      setCanvasSize(newSize);
      
      // Clear selection and settings panel
      fabricCanvas.discardActiveObject();
      setSelectedObject(null);
      setSettingsIconPosition(null);
      
      // Render the canvas with updated objects
      fabricCanvas.requestRenderAll();
      console.log('Canvas size updated, objects preserved');

      try {
        addGridAndRulers(fabricCanvas);
        fabricCanvas.requestRenderAll();
      } catch (e) {
        console.error('Error adding grid/rulers after resize:', e);
      }
    } else {
      // If no canvas exists, just update the size state
      setCanvasSize(newSize);
    }
  }, [template, orientation]);

  // Cleanup effect for canvas
  useEffect(() => {
    return () => {
      if (fabricCanvas) {
        fabricCanvas.dispose();
        setFabricCanvas(null); // Ensure disposed canvas is not reused
      }
    };
  }, [fabricCanvas]);

  // Initialize canvas when size changes
  useEffect(() => {
    let canvas = null;
    
    try {
      if (!fabricCanvas && canvasSize.width && canvasSize.height) {
        // Wait for the DOM to be ready
        setTimeout(() => {
          const canvasElement = document.getElementById('canvas');
          if (!canvasElement) {
            console.error('Canvas element not found');
            return;
          }

          try {
            canvas = new fabric.Canvas(canvasElement, {
              width: canvasSize.width,
              height: canvasSize.height,
              backgroundColor: '#ffffff',
              selection: true,
              preserveObjectStacking: true,
              renderOnAddRemove: true
            });

            // Initialize history stack
            canvas.history = {
              undo: [],
              redo: []
            };

            setFabricCanvas(canvas);
          } catch (error) {
            console.error('Error initializing canvas:', error);
          }
        }, 0);
      }
    } catch (error) {
      console.error('Error in canvas initialization effect:', error);
    }

    // Cleanup function
    return () => {
      try {
        if (canvas) {
          canvas.dispose();
        }
      } catch (error) {
        console.error('Error disposing canvas:', error);
      }
    };
  }, [canvasSize.width, canvasSize.height]);

  // Update canvas dimensions when size changes
  useEffect(() => {
    if (fabricCanvas && fabricCanvas.lowerCanvasEl) {
      try {
        fabricCanvas.setDimensions({
          width: canvasSize.width,
          height: canvasSize.height
        });
        fabricCanvas.requestRenderAll();
      } catch (error) {
        console.error('Error updating canvas dimensions:', error);
      }
    }
  }, [canvasSize, fabricCanvas]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMouseX(e.clientX - rect.left);
        setMouseY(e.clientY - rect.top);
      }
    };

    const handleMouseEnter = () => setShowGuideline(true);
    const handleMouseLeave = () => setShowGuideline(false);

    const canvasContainer = document.querySelector(".canvas-container-wrapper");
    if (canvasContainer) {
      canvasContainer.addEventListener("mousemove", handleMouseMove);
      canvasContainer.addEventListener("mouseenter", handleMouseEnter);
      canvasContainer.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (canvasContainer) {
        canvasContainer.removeEventListener("mousemove", handleMouseMove);
        canvasContainer.removeEventListener("mouseenter", handleMouseEnter);
        canvasContainer.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const handleRulerMouseMove = (coord, type) => {
    if (type === "x") {
      setMouseX(coord);
    } else {
      setMouseY(coord);
    }
  };

  const handleRulerMouseLeave = () => {
    setShowGuideline(false);
  };

  const handleToolChange = (tool, value, fillColor) => {
    console.log('Tool change:', tool, value);
    setActiveTool(tool);
      
    if (tool === "image") {
      console.log('Setting selected image:', value);
      setSelectedImage(value);
    } else if (tool === "shape") {
      setSelectedShape(value);
      if (fillColor) {
        setFillColor(fillColor);
      }
    }
  };

  // Initialize fabric canvas and event listeners
  useEffect(() => {
    if (!fabricCanvas) return;

    // Initialize canvas event listeners
    const handleSelectionCreated = (e) => {
      const selectedObject = e.selected?.[0];
      setSelectedObject(selectedObject);
      if (selectedObject) {
        setSettingsIconPosition({
          left: selectedObject.getBoundingRect().left + selectedObject.getBoundingRect().width - 12,
          top: selectedObject.getBoundingRect().top - 10
        });
      } else {
        setSettingsIconPosition(null);
      }
    };

    const handleSelectionUpdated = (e) => {
      const selectedObject = e.selected?.[0];
      setSelectedObject(selectedObject);
      if (selectedObject) {
        setSettingsIconPosition({
          left: selectedObject.getBoundingRect().left + selectedObject.getBoundingRect().width - 12,
          top: selectedObject.getBoundingRect().top - 10
        });
      } else {
        setSettingsIconPosition(null);
      }
    };

    const handleSelectionCleared = () => {
      setSelectedObject(null);
      setSettingsIconPosition(null);
    };

    // Add event listeners
    fabricCanvas.on("selection:created", handleSelectionCreated);
    fabricCanvas.on("selection:updated", handleSelectionUpdated);
    fabricCanvas.on("selection:cleared", handleSelectionCleared);

    // Cleanup function
    return () => {
      fabricCanvas.off("selection:created", handleSelectionCreated);
      fabricCanvas.off("selection:updated", handleSelectionUpdated);
      fabricCanvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [fabricCanvas]); // Only re-run when fabricCanvas changes

  const handleDelete = () => {
    if (fabricCanvas) {
      // Get all active objects (works for single or multiple selection)
      const activeObjects = fabricCanvas.getActiveObjects();
      if (activeObjects.length > 0) {
        fabricCanvas.discardActiveObject();
        fabricCanvas.remove(...activeObjects);
        fabricCanvas.requestRenderAll();
        setSelectedObject(null); // Clear the selection
        setSettingsIconPosition(null); // Clear settings icon position
      }
    }
  };

  const handleCopy = () => {
    if (fabricCanvas && selectedObject) {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        if (activeObject.type === 'group' || activeObject.type === 'activeSelection') {
          setClipboard(activeObject.toObject(['objects', 'left', 'top', 'scaleX', 'scaleY', 'angle', 'width', 'height', 'type', 'text', 'fill', 'stroke', 'strokeWidth']));
        } else {
          setClipboard(activeObject.toObject(['left', 'top', 'scaleX', 'scaleY', 'angle', 'width', 'height', 'type', 'text', 'fill', 'stroke', 'strokeWidth']));
        }
      }
    }
  };
  
  const handleCut = () => {
    if (fabricCanvas && selectedObject) {
      const activeObject = fabricCanvas.getActiveObject();
      if (activeObject) {
        if (activeObject.type === 'group' || activeObject.type === 'activeSelection') {
          setClipboard(activeObject.toObject(['objects', 'left', 'top', 'scaleX', 'scaleY', 'angle', 'width', 'height', 'type', 'text', 'fill', 'stroke', 'strokeWidth']));
        } else {
          setClipboard(activeObject.toObject(['left', 'top', 'scaleX', 'scaleY', 'angle', 'width', 'height', 'type', 'text', 'fill', 'stroke', 'strokeWidth']));
        }
        fabricCanvas.remove(activeObject);
        fabricCanvas.requestRenderAll();
        setSelectedObject(null);
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

    setActiveTool("select")

    // Add the object to canvas
    fabricCanvas.add(pastedObject);
    
    // Select the pasted object
    fabricCanvas.setActiveObject(pastedObject);
    fabricCanvas.requestRenderAll();
    
    // Update selected object state
    setSelectedObject(pastedObject);
    console.log("Object pasted successfully");
  };

// <<<<<<< HEAD
//   const handleSave = async () => {
//     if (!fabricCanvas) return;
//     // If editing (coming from List), do not show template name dialog, just save
//     if (location.state && location.state.id && initialConfig) {
// =======
  // Add a handleSaveAsNew function that always prompts for a new name and creates a new template
  const handleSaveAsNew = () => {
    setShowTemplateNameDialog(true);
  };

  // In handleSave, only update if in edit mode, otherwise create new
  const handleSave = async () => {
    if (!fabricCanvas) return;
    if (isEditMode) {
// >>>>>>> main
      // Build config_1 as a stringified object with all canvas info
      const config_1 = JSON.stringify({
        objects: getUserObjectsForSaving(fabricCanvas),
        canvas_width: canvasSize.width,
        canvas_height: canvasSize.height,
        orientation: orientation,
        template: template,
      });
      const payload = {
        company_code: "afhstXDev",
        id: (initialConfig && initialConfig.id) || location.state.id,
        template_name: (initialConfig && initialConfig.template_name) || "",
        page_size: (initialConfig && initialConfig.page_size) || "A4",
        template_html: (initialConfig && initialConfig.template_html) || "",
        created_by: (initialConfig && initialConfig.created_by) || "Admin",
        updated_by: "Admin",
        config_1,
        config_2: (initialConfig && initialConfig.config_2) || "",
      };
      try {
        const response = await apiClient.post("tags/addEdit.php", payload);
        if(response) {
          window.location.href = "/";
        }
      } catch (error) {
        alert("Failed to update template: " + (error.message || "Unknown error"));
      }
      return;
// <<<<<<< HEAD
// =======
    } else {
      setShowTemplateNameDialog(true);
// >>>>>>> main
    }
    // Otherwise, show template name dialog for new templates
    setShowTemplateNameDialog(true);
  };

  const handleDragStart = (tool) => {
    handleToolChange(tool);
  };

  const handleClose = () => {
    // Check if there are any objects on the canvas
    if (fabricCanvas && fabricCanvas.getObjects().length > 0) {
      setShowSaveConfirmation(true);
    } else {
      // If no objects, just close without confirmation
      localStorage.removeItem('selectedTemplate');
      localStorage.removeItem('selectedOrientation');
      window.location.href = '/';
    }
  };

  const handleSaveConfirmation = (shouldSave) => {
    setShowSaveConfirmation(false);
    if (shouldSave) {
      setShowTemplateNameDialog(true);
    } else {
      // Close without saving
      localStorage.removeItem('selectedTemplate');
      localStorage.removeItem('selectedOrientation');
      window.location.href = '/';
    }
  };

  const handleTemplateNameSubmit = async () => {
    if (templateName.trim()) {
      if (fabricCanvas) {
        // Build config_1 as a stringified object with all canvas info
        const config_1 = JSON.stringify({
          objects: getUserObjectsForSaving(fabricCanvas),
          canvas_width: canvasSize.width,
          canvas_height: canvasSize.height,
          orientation: orientation,
          template: template,
        });
        const payload = {
          company_code: "afhstXDev",
          id: 0,
          template_name: templateName,
          page_size: "A4",
          template_html: "",
          created_by: "Admin",
          updated_by: "Admin",
          config_1,
          config_2: "",
        };
        try {
          const data = await apiClient.post("tags/addEdit.php", payload);
          setShowTemplateNameDialog(false);
          setTemplateName("");
          // Update the context to show the saved template name
          setContextTemplateName(templateName);
          setIsEditMode(true);
          navigate("/");
          return;
        } catch (error) {
          alert("Failed to save template: " + (error.message || "Unknown error"));
        }
      }
      localStorage.removeItem('selectedTemplate');
      localStorage.removeItem('selectedOrientation');
    }
  };

  const handleTemplateNameCancel = () => {
    setShowTemplateNameDialog(false);
    setTemplateName("");
  };

  useEffect(() => {
// <<<<<<< HEAD
//     // Only fetch once on mount, not on every location.state change
//     if (location.state && location.state.id) {
//       fetchTagById(location.state.id).then((data) => {
//         console.log(data.records)
// =======
    if (location.state && location.state.templateData) {
      setInitialConfig(location.state.templateData);
    } else if (location.state && location.state.id) {
      fetchTagById(location.state.id).then((data) => {
// >>>>>>> main
        if (data && data.records && data.records[0]) {
          setInitialConfig(data.records[0]);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
// <<<<<<< HEAD
//   }, []); // Empty dependency array to prevent continuous API calls
// =======
  }, [location.state]);

  useEffect(() => {
    if (initialConfig && initialConfig.CanvasConfig) {
      const { ToolbarTitle, Orientation } = initialConfig.CanvasConfig;
      if (ToolbarTitle) {
        localStorage.setItem('selectedTemplate', ToolbarTitle);
      }
      if (Orientation !== undefined) {
        localStorage.setItem('selectedOrientation', Orientation === 1 ? 'portrait' : 'landscape');
      }
    }
  }, [initialConfig]);

  // Update template context when initialConfig changes
  useEffect(() => {
    if (initialConfig) {
      // If we have initialConfig, we're in edit mode
      setIsEditMode(true);
      // Set the template name from the initialConfig
      if (initialConfig.template_name) {
        setContextTemplateName(initialConfig.template_name);
      }
    } else {
      // If no initialConfig, we're creating a new template
      setIsEditMode(false);
      setContextTemplateName('');
    }
  }, [initialConfig, setIsEditMode, setContextTemplateName]);

  // Cleanup effect to reset context when component unmounts
  useEffect(() => {
    return () => {
      // Reset context when component unmounts
      setIsEditMode(false);
      setContextTemplateName('');
    };
  }, [setIsEditMode, setContextTemplateName]);

  // Add this function to handle Print navigation
  const handlePrint = () => {
    if (!fabricCanvas) return;
    const templateJSON = fabricCanvas.toJSON(['name']); // include 'name' property for dynamic fields
    // You may need to collect selected items from your state or props
    const selectedItems = []; // TODO: Replace with actual selected items logic
    navigate('/print', { state: { templateJSON, selectedItems, template, orientation, canvasSize } });
  };

  // Before rendering DesignCanvas, parse config_1 if needed
// <<<<<<< HEAD
//   let canvasConfig = "";
// =======
// >>>>>>> main
  useEffect(() => {
    if (initialConfig?.config_1) {
      try {
        const parsed = JSON.parse(initialConfig.config_1);
        let objects = parsed.objects;
        if (typeof objects === 'string') {
          objects = JSON.parse(objects);
        }
// <<<<<<< HEAD
//         // Validate objects array
// =======
// >>>>>>> main
        if (Array.isArray(objects)) {
          const validObjects = objects
            .filter(obj => obj && obj.type)
            .map(obj => ({ ...obj, type: obj.type.toLowerCase() }));
// <<<<<<< HEAD
//           canvasConfig = { objects: validObjects };
//         } else if (objects && typeof objects === 'object') {
//           canvasConfig = objects;
//         } else {
//           canvasConfig = {};
// =======
          setCanvasConfig({ objects: validObjects });
        } else if (objects && typeof objects === 'object') {
          setCanvasConfig(objects);
        } else {
          setCanvasConfig({});
// >>>>>>> main
        }
        // Update canvas size and orientation if present
        if (parsed.canvas_width && parsed.canvas_height) {
          setCanvasSize({ width: parsed.canvas_width, height: parsed.canvas_height });
        }
// <<<<<<< HEAD
//         if (parsed.orientation) {
//           // Only update if orientation is present
//         }
//       } catch {
//         canvasConfig = initialConfig.config_1;
//       }
//     }
//     // Debug log
//     console.log('canvasConfig to load:', canvasConfig);
// =======
      } catch {
        setCanvasConfig(initialConfig.config_1);
      }
    } else {
      setCanvasConfig(null);
    }
    // Debug log
    // console.log('canvasConfig to load:', canvasConfig);
// >>>>>>> main
  }, [initialConfig]);

  return (
    <>
      <div className="">
        
        <div className="flex items-center space-x-12 ms-24 mt-3">
          <div className="flex items-center space-x-5">
            <div className="flex flex-col items-center space-y-1">
              <Button
                variant="outline"
                className="bg-gray-100 text-gray-700 p-4 rounded-full h-12 w-12 flex items-center justify-center hover:bg-gray-400"
                onClick={handleCopy}
                disabled={!selectedObject}
              >
                <Copy className="scale-150" color={selectedObject ? "black" : "lightgray"} />
              </Button>
              <p className="text-xs">Copy</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Button
                variant="outline"
                className="bg-gray-100 text-gray-700 p-4 rounded-full h-12 w-12 flex items-center justify-center hover:bg-gray-400"
                onClick={handleCut}
                disabled={!selectedObject}
              >
                <Scissors className="scale-150" color={selectedObject ? "black" : "lightgray"} />
              </Button>
              <p className="text-xs">Cut</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Button
                variant="default"
                className="bg-gray-100 text-gray-700 p-4 rounded-full h-12 w-12 flex items-center justify-center hover:bg-gray-400"
                onClick={handlePaste}
                disabled={!clipboard}
              >
                <ClipboardPaste className="scale-150" color={clipboard ? "black" : "lightgray"} />
              </Button>
              <p className="text-xs">Paste</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Button
                variant="outline"
                className="bg-gray-100 text-gray-700 p-4 rounded-full h-12 w-12 flex items-center justify-center hover:bg-gray-400"
                onClick={handleDelete}
                disabled={!selectedObject}
              >
                <Trash2 className="scale-150" color={selectedObject ? "black" : "lightgray"} />
              </Button>
              <p className="text-xs">Delete</p>
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <div className="flex flex-col items-center space-y-1">
              <Button
                variant="outline"
                className="bg-gray-100 text-gray-700 p-4 rounded-full h-12 w-12 flex *:items-center justify-center hover:bg-gray-400"
                onClick={handleSave}
              >
                <Save className="scale-150" color="black" />
                
              </Button>
              <p className="text-xs">Save</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Button
                variant="outline"
                className="bg-gray-100 text-gray-700 p-4 rounded-full h-12 w-12 flex items-center justify-center hover:bg-gray-400"
                onClick={handlePrint}

                // onClick={handleExportPDF}

              >
                <Printer className="scale-150" color="black" />
              </Button>
              <p className="text-xs">Print</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Button
              onClick={handleOpenCalculator}
                variant="outline"
                className="bg-gray-100 text-gray-700 p-4 rounded-full h-12 w-12 flex items-center justify-center hover:bg-gray-400"
              >
                <Calculator  className="scale-150" color="black" />
              </Button>
              <p className="text-xs">Calculations</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Button
                variant="outline"
                className="bg-gray-100 text-gray-700 p-4 rounded-full h-12 w-12 flex items-center justify-center hover:bg-gray-400"
                onClick={handleClose}
              >
                <X className="scale-150" color="black" />
              </Button>
              <p className="text-xs">Close</p>
            </div>
          </div>
        </div>

        <div className="flex w-full">
          {/* Tools Panel */}
          <ToolsPanel
            activeTool={activeTool}
            onToolChange={handleToolChange}
            canvasSize={canvasSize}
            onCanvasSizeChange={setCanvasSize}
            fabricCanvas={fabricCanvas}
            selectedObject={selectedObject}
            onStrokeColorChange={setStrokeColor}
            onStrokeWidthChange={setStrokeWidth}
          />

          {/* Canvas and Rulers Container */}
          <div className="flex flex-col relative w-fit mx-auto mt-5 h-[75vh] overflow-y-auto overflow-x-hidden" ref={containerRef}>
            <HorizontalRuler
              width={canvasSize.width}
              mouseX={mouseX}
              showGuideline={showGuideline}
              onRulerMouseMove={(x) => handleRulerMouseMove(x, "x")}
              onRulerMouseLeave={handleRulerMouseLeave}
            />
            <div className="flex">
              <VerticalRuler
                height={canvasSize.height}
                mouseY={mouseY}
                showGuideline={showGuideline}
                onRulerMouseMove={(y) => handleRulerMouseMove(y, "y")}
                onRulerMouseLeave={handleRulerMouseLeave}
              />
              <div className="flex-1 flex justify-center canvas-container-wrapper"
              //  ref={designCanvasRef}
               >
                <DesignCanvas
                  activeTool={activeTool}
                  canvasSize={canvasSize}
                  onObjectSelect={handleObjectSelect}
                  onToolChange={handleToolChange}
                  selectedImage={selectedImage}
                  onCanvasReady={setFabricCanvas}
                  strokeColor={strokeColor}
                  strokeWidth={strokeWidth}
                  clipboard={clipboard}
                  setClipboard={setClipboard}
// <<<<<<< HEAD
//                   initialConfig={canvasConfig}
// =======
                  initialConfig={canvasConfig || { objects: [] }}
/* >>>>>>> main */
                />
              </div>
            </div>
          </div>
          <ShapesPanel onDragStart={handleDragStart} />
        </div>

        {/* Right Panel - Properties */}
        {/* <PropertiesPanel selectedObject={selectedObject} /> */}

        {/* Save Confirmation Dialog */}
        {showSaveConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Do you wish to save the changes made to the template?</h3>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handleSaveConfirmation(true)}
                  className="px-4 py-2"
                >
                  Yes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSaveConfirmation(false)}
                  className="px-4 py-2"
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Template Name Dialog */}
        {showTemplateNameDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Please enter a name for the new template</h3>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Template name"
              />
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={handleTemplateNameSubmit}
                  className="px-4 py-2"
                  disabled={!templateName.trim()}
                >
                  Ok
                </Button>
                <Button
                  variant="outline"
                  onClick={handleTemplateNameCancel}
                  className="px-4 py-2"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
     <Calculate
        isOpen={showCalculator}
        onClose={handleCloseCalculator}
        onSave={handleSaveCalculator}
      />
    </>

    
  );
}

export default EditorCanvas;
