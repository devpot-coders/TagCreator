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
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
  
export const Sidebar = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const newOptions = [
    "1UP",
    "1UP (LEGAL)",
    "2UP",
    "4UP",
    "4UP(4.25 X 5.1)",
    "8UP",
    "16UP",
    "16UP",
    "Avery 5160",
    "Avery 5163",
    "Two Page",
    "Full Page",
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
                  New
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 ms-3">
                {newOptions.map((option, idx) => (
                  <DropdownMenuItem 
                    key={option + idx} 
                    className="flex items-center gap-1 text-base py-2.5 hover:bg-[#F09536] hover:text-white transition-colors duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    {option}
                  </DropdownMenuItem>
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
