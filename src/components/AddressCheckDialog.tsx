
import React from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Map } from "lucide-react";

interface AddressCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceed: () => void;
}

const AddressCheckDialog = ({ 
  open, 
  onOpenChange,
  onProceed
}: AddressCheckDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Address Required
          </DialogTitle>
          <DialogDescription>
            We need a delivery address for your pre-order. Please add your address before proceeding.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 flex flex-col items-center">
          <div className="bg-amber-50 text-amber-800 p-4 rounded-md mb-4 w-full">
            <p className="text-sm">
              Your pre-order requires a delivery address. Please add your address to your profile before completing your order.
            </p>
          </div>
          
          <div className="flex items-center justify-center rounded-full bg-muted w-16 h-16 mb-4">
            <Map className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            asChild
            className="flex-1 bg-navy-800 hover:bg-navy-900"
          >
            <Link to="/profile">
              Add Address
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 text-amber-600 border-amber-200 hover:bg-amber-50" 
            onClick={onProceed}
          >
            Continue Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddressCheckDialog;
