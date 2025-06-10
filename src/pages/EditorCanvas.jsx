import React, { useState } from "react";
import { ToolsPanel } from "../components/ToolsPanel";
import { DesignCanvas } from "../components/DesignCanvas";
// import { PropertiesPanel } from "../components/PropertiesPanel";

function EditorCanvas() {
  const [activeTool, setActiveTool] = useState("select");
  const [selectedObject, setSelectedObject] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [selectedImage, setSelectedImage] = useState(null);

  const handleToolChange = (tool, imageData) => {
    // console.log('Tool change:', tool, 'Image data:', imageData);
    if (tool === "image" && imageData) {
      setSelectedImage(imageData);
    }
    setActiveTool(tool);
  };

  return (
    <>
      <div className="flex w-full">
        {/* Tools Panel */}
        <ToolsPanel
          activeTool={activeTool}
          onToolChange={handleToolChange}
          canvasSize={canvasSize}
          onCanvasSizeChange={setCanvasSize}
        />

        {/* Canvas Container */}
        <div className="flex-1 flex justify-center items-center p-8">
          <DesignCanvas
            activeTool={activeTool}
            canvasSize={canvasSize}
            onObjectSelect={setSelectedObject}
            onToolChange={handleToolChange}
            selectedImage={selectedImage}
          />
        </div>
      </div>

      {/* Right Panel - Properties */}
      {/* <PropertiesPanel selectedObject={selectedObject} /> */}
      
    </>
  );
}

export default EditorCanvas;
