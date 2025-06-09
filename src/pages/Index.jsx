import { useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { DesignCanvas } from "../components/DesignCanvas";
import { PropertiesPanel } from "../components/PropertiesPanel";
import { ToolsPanel } from "../components/ToolsPanel";

const Index = () => {
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
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Templates & Assets */}
        <Sidebar />
        
        {/* Main Design Area */}
        <div className="flex-1 flex flex-col">
          {/* Tools Panel */}
          <ToolsPanel 
            activeTool={activeTool} 
            onToolChange={handleToolChange}
            canvasSize={canvasSize}
            onCanvasSizeChange={setCanvasSize}
          />
          
          {/* Canvas Container */}
          <div className="flex-1 flex justify-center items-center bg-muted/30 p-8">
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
        <PropertiesPanel selectedObject={selectedObject} />
      </div>
    </div>
  );
};

export default Index;
