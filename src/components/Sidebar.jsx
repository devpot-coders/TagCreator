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
  LogOut,
  FilePlus
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
import { Link, NavLink, useNavigate } from "react-router-dom";
import { OrientationDialog } from "./OrientationDialog";

export const Sidebar = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    return localStorage.getItem('selectedTemplate') || null;
  });
  const [selectedOrientation, setSelectedOrientation] = useState(() => {
    return localStorage.getItem('selectedOrientation') || null;
  });
  const [showOrientationDialog, setShowOrientationDialog] = useState(false);
  const navigate = useNavigate();

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
    localStorage.setItem('selectedTemplate', template);
    setShowOrientationDialog(true);
  };

  const handleOrientationContinue = () => {
    setShowOrientationDialog(false);
    // Navigate to editor canvas with the selected template and orientation
    navigate('/editorCanvas', {
      state: {
        template: selectedTemplate,
        orientation: selectedOrientation
      }
    });
  };

  const handleOrientationChange = (orientation) => {
    setSelectedOrientation(orientation);
    localStorage.setItem('selectedOrientation', orientation);
  };

  // Clear selections when logging out
  const handleLogout = () => {
    localStorage.removeItem('selectedTemplate');
    localStorage.removeItem('selectedOrientation');
    setSelectedTemplate(null);
    setSelectedOrientation(null);
  };

  return (

    <div className="w-38 border-r bg-[#F09536] flex flex-col sticky top-0 left-0 z-50">

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
              <DropdownMenuContent className="w-38 ms-3">
                {newOptions.map((option, idx) => (
                  <DropdownMenuItem 
                    key={option + idx} 
                    className="flex items-center gap-1 text-sm py-2 hover:bg-gray-100 hover:text-black transition-colors duration-200"
                    onClick={() => handleTemplateSelect(option)}
                  >
                    <FilePlus className="w-5 h-5" />
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <NavLink to={"/"}>
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
          {selectedTemplate && selectedOrientation && (
            <div>
              <NavLink to={"/editorCanvas"}>
                <Button variant="outline" className="w-full border-none rounded-none bg-[#0000004f] text-lg py-8 text-white hover:bg-[#74747465] hover:text-white">
                  <Pen />
                  Editor
                </Button>
              </NavLink>
            </div>
          )}
          <Separator />
        </div>
      </ScrollArea>
      <div className="p-4">
        <NavLink to={"/login"} onClick={handleLogout}>
          <Button variant="outline" className="w-full border-none rounded-none bg-[#0000004f] text-lg py-8 text-white hover:bg-[#74747465] hover:text-white">
            <LogOut />
            Logout
          </Button>
        </NavLink>
      </div>

      <OrientationDialog
        isOpen={showOrientationDialog}
        onClose={() => setShowOrientationDialog(false)}
        onContinue={handleOrientationContinue}
        selectedOrientation={selectedOrientation}
        onOrientationChange={handleOrientationChange}
      />
    </div>
  );
};
