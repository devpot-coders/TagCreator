import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  MousePointer, 
  Type, 
  Image, 
  ChevronDown,
  Square,
  Circle,
  Star,
  Triangle,
  Hexagon,
  Octagon,
  Heart,
  Diamond,
  Plus,
  X,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ArrowUpLeft,
  ArrowDownRight,
  ArrowDownLeft,
  Pencil
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export const ToolsPanel = ({ 
  activeTool, 
  onToolChange, 
  canvasSize, 
  onCanvasSizeChange 
}) => {
  const [selectedBasicShape, setSelectedBasicShape] = useState(null);
  const [selectedArrow, setSelectedArrow] = useState(null);
  const [basicShapesOpen, setBasicShapesOpen] = useState(false);
  const [arrowsOpen, setArrowsOpen] = useState(false);

  const tools = [
    { id: "select", icon: MousePointer, label: "Select" },
    { id: "text", icon: Type, label: "Text" },
    { id: "image", icon: Image, label: "Image" },
    { id: "pencil", icon: Pencil, label: "Draw" },
  ];

  const basicShapes = [
    { icon: Square, name: "rectangle" },
    { icon: Circle, name: "circle" },
    { icon: Star, name: "star" },
    { icon: Triangle, name: "triangle" },
    { icon: Hexagon, name: "hexagon" },
    { icon: Octagon, name: "octagon" },
    { icon: Heart, name: "heart" },
    { icon: Diamond, name: "diamond" },
    { icon: Plus, name: "plus" },
    { icon: X, name: "cross" },
    { icon: Triangle, name: "rightTriangle", className: "rotate-45" },
    { icon: Star, name: "star5", className: "star-5" },
    { icon: Star, name: "star6", className: "star-6" },
    { icon: Star, name: "star7", className: "star-7" },
    { icon: Hexagon, name: "pentagon", className: "pentagon" },
    { icon: Octagon, name: "heptagon", className: "heptagon" }
  ];

  const arrows = [
    { icon: ArrowRight, name: "rightArrow" },
    { icon: ArrowLeft, name: "leftArrow" },
    { icon: ArrowUp, name: "upArrow" },
    { icon: ArrowDown, name: "downArrow" },
    { icon: ArrowUpRight, name: "upRightArrow" },
    { icon: ArrowUpLeft, name: "upLeftArrow" },
    { icon: ArrowDownRight, name: "downRightArrow" },
    { icon: ArrowDownLeft, name: "downLeftArrow" }
  ];

  const handleBasicShapeSelect = (shape) => {
    setSelectedBasicShape(shape);
    onToolChange(shape.name);
    setBasicShapesOpen(false);
  };

  const handleArrowSelect = (arrow) => {
    console.log('Arrow selected:', arrow);
    setSelectedArrow(arrow);
    const toolName = arrow.name;
    console.log('Setting tool to:', toolName);
    onToolChange(toolName);
    setArrowsOpen(false);
  };

  const handleImageClick = () => {
    console.log('Image button clicked');
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log('File selected:', file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
          console.log('File read complete, calling onToolChange');
          onToolChange("image", e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  };

  return (
    <div className="border-b bg-background p-4">
      <div className=" mt-8">
        <div className="flex flex-col items-end justify-end gap-3 space-x-2">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "default" : "outline"}
              size="sm"
              onClick={() => tool.id === "image" ? handleImageClick() : onToolChange(tool.id)}
              className="flex items-center space-x-1"
            >
              <tool.icon className="h-4 w-4" />
              {/* <span className="hidden sm:inline">{tool.label}</span> */}
            </Button>
          ))}

          <Separator orientation="vertical" className="h-6" />

          {/* Basic Shapes Dropdown */}
          {/* <DropdownMenu open={basicShapesOpen} onOpenChange={setBasicShapesOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant={selectedBasicShape ? "default" : "outline"}
                size="sm"
                className="flex items-center space-x-1"
              >
                <Square className="h-4 w-4" />
                <span className="hidden sm:inline">Basic Shapes</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Basic Shapes</DropdownMenuLabel>
                <div className="grid grid-cols-2 gap-2 p-2">
                  {basicShapes.map((shape) => (
                    <Button
                      key={shape.name}
                      variant="outline"
                      className="h-16 flex-col"
                      onClick={() => handleBasicShapeSelect(shape)}
                    >
                      <shape.icon className={`h-6 w-6 mb-1 ${shape.className || ''}`} />
                      <span className="text-xs">{shape.name}</span>
                    </Button>
                  ))}
                </div>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* Arrows Dropdown */}
          {/* <DropdownMenu open={arrowsOpen} onOpenChange={setArrowsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant={selectedArrow ? "default" : "outline"}
                size="sm"
                className="flex items-center space-x-1"
              >
                <ArrowRight className="h-4 w-4" />
                <span className="hidden sm:inline">Arrows</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Arrows</DropdownMenuLabel>
                <div className="grid grid-cols-2 gap-2 p-2">
                  {arrows.map((arrow) => (
                    <Button
                      key={arrow.name}
                      variant="outline"
                      className="h-16 flex-col"
                      onClick={() => handleArrowSelect(arrow)}
                    >
                      <arrow.icon className="h-6 w-6 mb-1" />
                      <span className="text-xs">{arrow.name}</span>
                    </Button>
                  ))}
                </div>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu> */}

          <Separator orientation="vertical" className="h-6" />
        </div>

        {/* <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="width" className="text-sm">Width:</Label>
            <Input
              id="width"
              type="number"
              value={canvasSize.width}
              onChange={(e) => onCanvasSizeChange({
                ...canvasSize,
                width: parseInt(e.target.value) || 400
              })}
              className="w-20 h-8"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="height" className="text-sm">Height:</Label>
            <Input
              id="height"
              type="number"
              value={canvasSize.height}
              onChange={(e) => onCanvasSizeChange({
                ...canvasSize,
                height: parseInt(e.target.value) || 300
              })}
              className="w-20 h-8"
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};
