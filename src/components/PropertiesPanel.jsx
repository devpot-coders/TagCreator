import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";

export const PropertiesPanel = ({ selectedObject }) => {
  if (!selectedObject) {
    return (
      <div className="w-64 border-l bg-background p-4">
        <div className="text-center text-muted-foreground">
          Select an object to edit properties
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 border-l bg-background flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium">Properties</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Position */}
          <div>
            <h4 className="font-medium text-sm mb-3">Position</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="x" className="text-xs">X</Label>
                <Input
                  id="x"
                  type="number"
                  value={Math.round(selectedObject.left || 0)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="y" className="text-xs">Y</Label>
                <Input
                  id="y"
                  type="number"
                  value={Math.round(selectedObject.top || 0)}
                  className="h-8"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Size */}
          <div>
            <h4 className="font-medium text-sm mb-3">Size</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="width" className="text-xs">Width</Label>
                <Input
                  id="width"
                  type="number"
                  value={Math.round(selectedObject.width * (selectedObject.scaleX || 1))}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-xs">Height</Label>
                <Input
                  id="height"
                  type="number"
                  value={Math.round(selectedObject.height * (selectedObject.scaleY || 1))}
                  className="h-8"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Appearance */}
          <div>
            <h4 className="font-medium text-sm mb-3">Appearance</h4>
            <div className="space-y-3">
              <div>
                <Label htmlFor="fill" className="text-xs">Fill Color</Label>
                <Input
                  id="fill"
                  type="color"
                  value={selectedObject.fill || "#000000"}
                  onChange={(e) => {
                    selectedObject.set('fill', e.target.value);
                    selectedObject.canvas.requestRenderAll();
                  }}
                  className="h-8"
                />
              </div>
              
              <div>
                <Label htmlFor="stroke" className="text-xs">Stroke Color</Label>
                <Input
                  id="stroke"
                  type="color"
                  value={selectedObject.stroke || "#000000"}
                  onChange={(e) => {
                    selectedObject.set('stroke', e.target.value);
                    selectedObject.canvas.requestRenderAll();
                  }}
                  className="h-8"
                />
              </div>
              
              <div>
                <Label htmlFor="opacity" className="text-xs">Opacity</Label>
                <Slider
                  value={[(selectedObject.opacity || 1) * 100]}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          {selectedObject.type === "textbox" && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-sm mb-3">Text</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="fontSize" className="text-xs">Font Size</Label>
                    <Input
                      id="fontSize"
                      type="number"
                      value={selectedObject.fontSize || 16}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fontFamily" className="text-xs">Font Family</Label>
                    <Input
                      id="fontFamily"
                      value={selectedObject.fontFamily || "Arial"}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
