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
  X,
  Pen,
  Tag,
  List,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
  
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
    <div className="w-38 border-r bg-[#F09536] flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Templates Section */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full border-none rounded-none bg-[#0000004f] text-lg py-8 text-white hover:bg-[#74747465] hover:text-white">
                  {selectedTemplate ? selectedTemplate.name : "New"}
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
          <div>
              <NavLink to={"/list"}>
                <Button variant="outline" className="w-full border-none rounded-none bg-[#0000004f] text-lg py-8 text-white hover:bg-[#74747465] hover:text-white">
                  <List/>
              List
                </Button>
              </NavLink>
          </div>
          <div>
              <NavLink to={"/storetags"}>
                <Button variant="outline" className="w-full border-none rounded-none bg-[#0000004f] text-lg py-8 text-white hover:bg-[#74747465] hover:text-white">
                  <Tag/>
              Store Tags
                </Button>
              </NavLink>
          </div>
          <div>
                <NavLink to={"/"}>
                  <Button variant="outline" className="w-full border-none rounded-none bg-[#0000004f] text-lg py-8 text-white hover:bg-[#74747465] hover:text-white">
                  <Pen />
                  Editor
                  </Button>
                </NavLink>
          </div>

          <Separator />

        </div>
      </ScrollArea>
        <div className=" p-4">
                <NavLink to={"/login"}>
                  <Button variant="outline" className="w-full border-none rounded-none bg-[#0000004f] text-lg py-8 text-white hover:bg-[#74747465] hover:text-white">
                  <LogOut />
                  Logout
                  </Button>
                </NavLink>
          </div>
    </div>
  );
};
