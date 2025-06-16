import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  MousePointer, 
  Type, 
  Image, 
  NotebookPen,
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
  Pencil,
  Slash
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export const ToolsPanel = ({ 
  activeTool, 
  onToolChange, 
  canvasSize, 
  onCanvasSizeChange,
  fabricCanvas,
  selectedObject 
}) => {
  const [selectedBasicShape, setSelectedBasicShape] = useState(null);
  const [selectedArrow, setSelectedArrow] = useState(null);
  const [basicShapesOpen, setBasicShapesOpen] = useState(false);
  const [arrowsOpen, setArrowsOpen] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#ef4444"); // Default red color
  const [fillColor, setFillColor] = useState("#15D7FF"); // Default blue color
  const [selectedStrokeThickness, setSelectedStrokeThickness] = useState(2); // New state for stroke thickness

  const colors = [
    "#facc15", // yellow
    "#86efac", // light green
    "#22c55e", // green
    "#93c5fd", // light blue
    "#a855f7", // purple
    "#ec4899", // pink
    "#ef4444", // red
    "#6b7280", // grey
    "#000000", // black
  ];

  const tools = [
    { id: "select", icon: MousePointer, label: "Select" },
    { id: "text", icon: Type, label: "Text" },
    {
      id: "field",
      icon: NotebookPen,
      label: "Field",
      dropdown: (
        <DropdownMenuContent className="h-96 w-56 ms-64 -mt-10 overflow-y-scroll">
          <DropdownMenuLabel className="sticky top-0 z-10 bg-gray-800 text-white">Insert Field</DropdownMenuLabel>
          <DropdownMenuGroup>
            {/* Existing fields */}
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('barcode');
            }}>Barcode</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('qrcode');
            }}>QR Code</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('date');
            }}>Date</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('id');
            }}>ID</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('itemId');
            }}>Item ID</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('modelNumber');
            }}>Model Number</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('descriptionA');
            }}>Description A</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('descriptionB');
            }}>Description B</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('supplierName');
            }}>Supplier Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('itemType');
            }}>Item Type</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('mainCategory');
            }}>Main Category Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('subCategory');
            }}>Sub Category Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('landedCost');
            }}>Landed Cost</DropdownMenuItem>

            {/* Fields from first screenshot */}
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('price1');
            }}>Price 1</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('price2');
            }}>Price 2</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('price3');
            }}>Price 3</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('statusType');
            }}>Status Type</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('qty');
            }}>Qty</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('imageUrl');
            }}>Image URL</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('dimensions');
            }}>Dimensions</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('packageId');
            }}>Package ID</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('packageItems');
            }}>Package Items</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('pay36m');
            }}>Pay 36M</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('pay48m');
            }}>Pay 48M</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('pay60m');
            }}>Pay 60M</DropdownMenuItem>

            {/* Fields from second screenshot */}
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('packageName');
            }}>Package Name</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('packageDescA');
            }}>Package Desc A</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('packageDescB');
            }}>Package Desc B</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('packagePrice1');
            }}>Package Price 1</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('packagePrice2');
            }}>Package Price 2</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('packagePrice3');
            }}>Package Price 3</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('packageImageUrl');
            }}>Package Image URL</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('packagePay36m');
            }}>Package Pay 36M</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('packagePay48m');
            }}>Package Pay 48M</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('packagePay60m');
            }}>Package Pay 60M</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('packageDimensions');
            }}>Package Dimensions</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('locBcl');
            }}>Loc Bcl#</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('notes');
            }}>Notes</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('location');
            }}>Location</DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              onToolChange('field');
              onToolChange('stockId');
            }}>Stock Id</DropdownMenuItem>
          </DropdownMenuGroup>

        </DropdownMenuContent>
      )
    },
    { id: "image", icon: Image, label: "Image" },
    { id: "pencil", icon: Pencil, label: "Draw" },
    { id: "line", icon: Slash, label: "Line" },
    
    { 
      id: "stroke", 
      icon: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-8 h-8 rounded-full cursor-pointer" style={{ backgroundColor: strokeColor }} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 ms-64 -mt-10">
            <DropdownMenuLabel>Select Stroke Color</DropdownMenuLabel>
            <div className="grid grid-cols-5 gap-2 p-2">
              <div
                className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 flex items-center justify-center"
                onClick={() => {
                  if (selectedObject) {
                    const fillColor = selectedObject.fill || '#000000';
                    setStrokeColor(fillColor);
                    selectedObject.set({
                      stroke: fillColor
                    });
                    fabricCanvas.requestRenderAll();
                    onToolChange("stroke", fillColor);
                  }
                }}
              >
                <X className="w-4 h-4 text-gray-500" />
              </div>
              {colors.map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 rounded-full cursor-pointer border border-gray-300"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setStrokeColor(color);
                    if (selectedObject) {
                      selectedObject.set({
                        stroke: color
                      });
                      fabricCanvas.requestRenderAll();
                    }
                    onToolChange("stroke", color);
                  }}
                />
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ), 
      label: "Stroke" 
    },
    { 
      id: "fill", 
      icon: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-8 h-8 rounded-full cursor-pointer" style={{ backgroundColor: fillColor }} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 ms-64 -mt-10">
            <DropdownMenuLabel>Select Fill Color</DropdownMenuLabel>
            <div className="grid grid-cols-5 gap-2 p-2">
              <div
                className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 flex items-center justify-center"
                onClick={() => {
                  if (selectedObject) {
                    setFillColor("#15D7FF");
                    selectedObject.set({
                      fill: "#15D7FF"
                    });
                    fabricCanvas.requestRenderAll();
                    onToolChange("fill", "#15D7FF");
                  }
                }}
              >
                <X className="w-4 h-4 text-gray-500" />
              </div>
              {colors.map((color) => (
                <div
                  key={color}
                  className="w-8 h-8 rounded-full cursor-pointer border border-gray-300"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setFillColor(color);
                    if (selectedObject) {
                      selectedObject.set({
                        fill: color
                      });
                      fabricCanvas.requestRenderAll();
                    }
                    onToolChange("fill", color);
                  }}
                />
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ), 
      label: "Fill" 
    },
    { 
      id: "point", 
      icon: () => (
        <div 
          className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center`}
        >
          <div 
            className="rounded-full bg-gray-600"
            style={{ width: `${selectedStrokeThickness * 2}px`, height: `${selectedStrokeThickness * 2}px` }}
          />
        </div>
      ),
      label: "Point",
      dropdown: (
        <DropdownMenuContent className="w-48 ms-64">
          <DropdownMenuLabel>Select Stroke Thickness</DropdownMenuLabel>
          <DropdownMenuGroup>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((thickness) => (
              <DropdownMenuItem 
                key={thickness}
                onClick={() => {
                  setSelectedStrokeThickness(thickness);
                  if (selectedObject) {
                    selectedObject.set({
                      strokeWidth: thickness
                    });
                    fabricCanvas.requestRenderAll();
                  }
                  onToolChange("point", thickness);
                }}
              >
                <div 
                  className="w-full h-4 flex items-center justify-center"
                >
                  <div 
                    className="rounded-full bg-gray-600"
                    style={{ width: `${thickness * 2}px`, height: `${thickness * 2}px` }}
                  />
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      )
    },
    { id: "starTool", icon: Star, label: "Star" },
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

  const handleShapeClick = (shapeType) => {
    setSelectedBasicShape(shapeType);
    setBasicShapesOpen(false);
    onToolChange("shape", shapeType, fillColor);
  };

  return (
    <div className="border-b bg-background p-4">
      <div className=" mt-">
        <div className="flex flex-col items-end justify-end gap-2 space-x-2">
          {tools.map((tool) => (
            tool.id === "field" || tool.id === "point" ? (
              <DropdownMenu key={tool.id}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={"outline"}
                    size="md"
                    className={`flex items-center space-x-1 rounded-full ${tool.id === "point" ? "p-1" : "p-3"}`}
                  >
                    {typeof tool.icon === "function" ? tool.icon() : <tool.icon className="scale-125" />}
                  </Button>
                </DropdownMenuTrigger>
                {tool.dropdown}
              </DropdownMenu>
            ) : (
             <>
              <Button
                key={tool.id}
                variant={activeTool === tool.id ? "default" : "outline"}
                size="md"
                onClick={() => {
                  if (tool.id === "image") {
                    handleImageClick();
                  } else if (tool.id === "stroke") {
                    onToolChange(tool.id, strokeColor);
                  } else if (tool.id === "fill") {
                    onToolChange(tool.id, fillColor);
                  } else {
                    onToolChange(tool.id);
                  }
                }}
                className={`flex items-center space-x-1 rounded-full ${tool.id === "stroke" || tool.id === "fill" ? "!bg-transparent" : "p-3"}`}
              >
                {typeof tool.icon === "function" ? tool.icon() : <tool.icon className="scale-125" />}
              </Button>
               {tool.id === "stroke" || tool.id === "fill" ? <h1 className="-mt-2 text-xs font-semibold">{tool.id}</h1> : null}
             </>
            )
          ))}
          
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
      {/* Add this block for the Point tool's label */}
    </div>
  );
};
