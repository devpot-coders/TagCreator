import React, { useState } from "react";
import { ToolsPanel } from "../components/ToolsPanel";
import { DesignCanvas } from "../components/DesignCanvas";
import { Button } from "../components/ui/button";
import * as fabric from 'fabric';
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
// import { PropertiesPanel } from "../components/PropertiesPanel";

function EditorCanvas() {
  const [activeTool, setActiveTool] = useState("select");
  const [selectedObject, setSelectedObject] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });
  const [selectedImage, setSelectedImage] = useState(null);
  const [fabricCanvas, setFabricCanvas] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [fillColor, setFillColor] = useState("#000000");
  const [clipboard, setClipboard] = useState(null);

  const handleToolChange = (tool, value, fillColor) => {
    setActiveTool(tool);
    if (tool === "shape" && value) {
      setSelectedShape(value);
      setFillColor(fillColor);
    }
  };

  const handleDelete = () => {
    if (fabricCanvas && selectedObject) {
      fabricCanvas.remove(selectedObject);
      fabricCanvas.requestRenderAll();
      setSelectedObject(null);
    }
  };

  const handleCopy = () => {
    if (fabricCanvas && selectedObject) {
      // Serialize the selected object with all its properties
      const objectData = selectedObject.toObject(['left', 'top', 'scaleX', 'scaleY', 'angle', 'fill', 'stroke', 'strokeWidth', 'width', 'height', 'radius', 'points', 'path', 'rx', 'ry', 'type']);
      setClipboard(objectData);
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
    if (fabricCanvas && clipboard) {
      // Create a new object from the clipboard data
      fabric.util.enlivenObjects([clipboard], (objects) => {
        const pastedObject = objects[0];
        
        // Get the center of the canvas
        const centerX = fabricCanvas.width / 2;
        const centerY = fabricCanvas.height / 2;
        
        // Set the new position and make sure it's interactive
        pastedObject.set({
          left: centerX,
          top: centerY,
          evented: true,
          selectable: true,
          hasControls: true,
          hasBorders: true,
          transparentCorners: false,
          cornerColor: pastedObject.fill || '#15D7FF',
          cornerSize: 10,
          hasRotatingPoint: true,
        });
        
        // Add the object to canvas
        fabricCanvas.add(pastedObject);
        fabricCanvas.setActiveObject(pastedObject);
        fabricCanvas.requestRenderAll();
        
        // Update the selected object
        setSelectedObject(pastedObject);
      });
    }
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
                variant="outline"
                className="bg-gray-100 text-gray-700 p-4 rounded-full h-12 w-12 flex items-center justify-center hover:bg-gray-400"
              >
                <Calculator className="scale-150" color="black" />
              </Button>
              <p className="text-xs">Calculations</p>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Button
                variant="outline"
                className="bg-gray-100 text-gray-700 p-4 rounded-full h-12 w-12 flex items-center justify-center hover:bg-gray-400"
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

          {/* Canvas Container */}
          <div className="flex-1 flex justify-center mt-5 ">
            <DesignCanvas
              activeTool={activeTool}
              canvasSize={canvasSize}
              onObjectSelect={setSelectedObject}
              onToolChange={handleToolChange}
              selectedImage={selectedImage}
              onCanvasReady={setFabricCanvas}
            />
          </div>
        </div>

        {/* Right Panel - Properties */}
        {/* <PropertiesPanel selectedObject={selectedObject} /> */}
      </div>
    </>
  );
}

export default EditorCanvas;
