import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Menu } from "lucide-react";

export const OrientationDialog = ({
  isOpen,
  onClose,
  onContinue,
  selectedOrientation,
  onOrientationChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Select Page Orientation
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-3">
          <div className="flex items-center justify-center gap-4">
            <div>
              <Button
                variant={
                  selectedOrientation === "portrait" ? "default" : "outline"
                }
                className={`flex flex-col items-center justify-center rounded-none p-6 ${
                  selectedOrientation === "portrait"
                    ? "bg-[#29a0af] hover:bg-[#43d9ec] "
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => onOrientationChange("portrait")}
              >
                <Menu className={`${selectedOrientation === "portrait" ? "text-white" : "text-black"} rotate-90`}/>
              </Button>
              <span>Portrait</span>
            </div>
            <div>
              <Button
                variant={
                  selectedOrientation === "landscape" ? "default" : "outline"
                }
                className={`flex flex-col items-center justify-center rounded-none p-6 w-fit ${
                  selectedOrientation === "landscape"
                    ? "bg-[#29a0af] hover:bg-[#43d9ec] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => onOrientationChange("landscape")}
              >
                <Menu className={`${selectedOrientation === "landscape" ? "text-white" : "text-black"}`}/>
              </Button>
              <span>Landscape</span>
            </div>
          </div>
          <Button
            className="py-2 px-5 w-fit justify-self-center rounded-none bg-gray-200 text-gray-700 hover:bg-gray-300"
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
