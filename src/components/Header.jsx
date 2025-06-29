import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, Download, Upload, Undo, Redo } from "lucide-react";
import { useTemplate } from "@/context/TemplateContext";
import { useLocation } from "react-router-dom";

export const Header = () => {
  const { templateName, isEditMode } = useTemplate();
  const location = useLocation();

  const handleUndo = () => {
    const canvas = document.querySelector("canvas");
    if (canvas && canvas.fabricCanvas) {
      canvas.fabricCanvas.handleUndo();
    }
  };

  const handleRedo = () => {
    const canvas = document.querySelector("canvas");
    if (canvas && canvas.fabricCanvas) {
      canvas.fabricCanvas.handleRedo();
    }
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if (e.key === "y" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const canUndo = () => {
    const canvas = document.querySelector("canvas");
    return canvas && canvas.fabricCanvas && canvas.fabricCanvas.canUndo;
  };

  const canRedo = () => {
    const canvas = document.querySelector("canvas");
    return canvas && canvas.fabricCanvas && canvas.fabricCanvas.canRedo;
  };

  // Determine what to display in the header
  const getDisplayName = () => {
    // Only show template name if we're on the EditorCanvas page
    if (location.pathname === "/editorCanvas") {
      if (isEditMode && templateName) {
        return templateName;
      } else if (isEditMode) {
        return "Editing Template";
      } else {
        return "New Template";
      }
    }
    // For other pages, just show "Tag Designer"
    return "";
  };

  return (
    <header className="w-full bg-[#F09536] px-6 py-3" >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-foreground">
            Tag Designer{getDisplayName() ? ` : ${getDisplayName()}` : ""}
          </h1>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleUndo}
              disabled={!canUndo()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRedo}
              disabled={!canRedo()}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        
      </div>
    </header>
  );
};
