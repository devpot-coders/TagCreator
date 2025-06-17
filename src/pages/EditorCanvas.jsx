import React, { useState, useRef, useEffect } from "react";
import { ToolsPanel } from "../components/ToolsPanel";
import { DesignCanvas } from "../components/DesignCanvas";
import { HorizontalRuler, VerticalRuler } from "../components/Rulers";
import { Button } from "../components/ui/button";
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
    if (fabricCanvas) {
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

    // Initialize keyboard shortcuts
    const handleKeyDown = (e) => {
      // Don't handle shortcuts if we're editing text
      if (fabricCanvas.getActiveObject()?.isEditing) {
        return;
      }

      // Delete (Delete or Backspace)
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        handleDelete();
      }
    };

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
    window.addEventListener("keydown", handleKeyDown);
    fabricCanvas.on("selection:created", handleSelectionCreated);
    fabricCanvas.on("selection:updated", handleSelectionUpdated);
    fabricCanvas.on("selection:cleared", handleSelectionCleared);

    // Cleanup function
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
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
      const objectData = selectedObject.toObject(['type', 'left', 'top', 'width', 'height', 'scaleX', 'scaleY', 'angle', 'fill', 'stroke', 'strokeWidth', 'fontSize', 'fontFamily', 'textAlign', 'text', 'src', 'filters', 'clipPath', 'originX', 'originY', 'selectable', 'hasControls', 'hasBorders', 'transparentCorners', 'cornerColor', 'cornerSize', 'hasRotatingPoint']);
      setClipboard(objectData);
      console.log("Object copied:", objectData);
    }
  };
  
  const handleCut = () => {
    if (fabricCanvas && selectedObject) {
      // Serialize the selected object with all its properties
      const objectData = selectedObject.toObject(['left', 'top', 'scaleX', 'scaleY', 'angle', 'fill', 'stroke', 'strokeWidth', 'width', 'height', 'radius', 'points', 'path', 'rx', 'ry', 'type']);
      setClipboard(objectData);
      
      // Remove the original object
      fabricCanvas.remove(selectedObject);
      fabricCanvas.requestRenderAll();
      setSelectedObject(null);
    }
  };
  
  const handlePaste = () => {
    if (!fabricCanvas || !clipboard) return;
  
    // Handle both single object and array of objects
    const objectsToPaste = Array.isArray(clipboard) ? clipboard : [clipboard];
  
    fabric.util.enlivenObjects(objectsToPaste, (pastedObjects) => {
      if (!pastedObjects || pastedObjects.length === 0) return;
  
      // Calculate center of canvas for pasting
      const center = {
        left: fabricCanvas.width / 2,
        top: fabricCanvas.height / 2
      };
  
      // Position and add each pasted object
      pastedObjects.forEach((obj, index) => {
        // Offset each object slightly (10px) from the center
        obj.set({
          left: center.left + (index * 10),
          top: center.top + (index * 10),
          evented: true,
          selectable: true,
          hasControls: true,
          hasBorders: true,
        });
  
        fabricCanvas.add(obj);
      });
  
      // Select all pasted objects
      const activeSelection = new fabric.ActiveSelection(pastedObjects, {
        canvas: fabricCanvas,
      });
      fabricCanvas.setActiveObject(activeSelection);
      fabricCanvas.requestRenderAll();
      setSelectedObject(activeSelection);
    }, 'fabric');
  };

  const handleSave = () => {
    if (fabricCanvas) {
      const canvasData = fabricCanvas.toJSON(['type', 'left', 'top', 'width', 'height', 'scaleX', 'scaleY', 'angle', 'fill', 'stroke', 'strokeWidth', 'fontSize', 'fontFamily', 'textAlign', 'text', 'src', 'filters', 'clipPath', 'originX', 'originY', 'selectable', 'hasControls', 'hasBorders', 'transparentCorners', 'cornerColor', 'cornerSize', 'hasRotatingPoint']);
      console.log("Canvas data:", canvasData);
    }
  };

  const handleDragStart = (tool) => {
    handleToolChange(tool);
  };

  const handleClose = () => {
    // Clear template selection from localStorage
    localStorage.removeItem('selectedTemplate');
    localStorage.removeItem('selectedOrientation');
    // Navigate to home page with full reload
    window.location.href = '/';
  };

  return (
    <>
      <div>
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
                className="bg-gray-100 text-gray-700 p-4 rounded-full h-12 w-12 flex items-center justify-center hover:bg-gray-400"
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
          />

          {/* Canvas and Rulers Container */}
          <div className="flex flex-col relative w-fit mx-auto mt-5 h-[75vh] overflow-y-scroll" ref={containerRef}>
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
              <div className="flex-1 flex justify-center canvas-container-wrapper ">
                <DesignCanvas
                  activeTool={activeTool}
                  canvasSize={canvasSize}
                  onObjectSelect={handleObjectSelect}
                  onToolChange={handleToolChange}
                  selectedImage={selectedImage}
                  onCanvasReady={setFabricCanvas}
                />
              </div>
            </div>
          </div>
          <ShapesPanel onDragStart={handleDragStart} />
        </div>

        {/* Right Panel - Properties */}
        {/* <PropertiesPanel selectedObject={selectedObject} /> */}
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
