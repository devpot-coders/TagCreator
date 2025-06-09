import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Image, 
  Type, 
  ChevronDown,
  Plus,
  Minus,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export const Sidebar = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    { id: 1, name: "Product Tag", size: "4x2 in" },
    { id: 2, name: "Price Tag", size: "3x1.5 in" },
    { id: 3, name: "Name Tag", size: "3.5x2.25 in" },
  ];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Here you can add additional logic to apply the template
    console.log("Selected template:", template);
  };

  return (
    <div className="w-64 border-r bg-background flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Templates Section */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">Templates</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedTemplate ? selectedTemplate.name : "Select Template"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3 flex-col items-start"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="w-full aspect-[2/1] bg-muted rounded mb-2"></div>
                    <div className="text-left">
                      <div className="font-medium text-sm">{template.name}</div>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {template.size}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator />

          {/* Elements Section */}
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-3">Elements</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Type className="h-4 w-4 mr-2" />
                Text
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Image className="h-4 w-4 mr-2" />
                Image
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
