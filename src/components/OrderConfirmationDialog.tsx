
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Calendar, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderDetails: {
    design: string;
    size: string;
    color: string;
    quantity: number;
    customText?: string;
    customNote?: string;
  } | null;
}

const OrderConfirmationDialog = ({ 
  open, 
  onOpenChange,
  orderDetails 
}: OrderConfirmationDialogProps) => {
  const navigate = useNavigate();
  
  if (!orderDetails) return null;
  
  const handleContinueShopping = () => {
    onOpenChange(false);
    navigate("/shop");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2 text-xl">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Pre-Order Confirmed!
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Thank you for your custom t-shirt pre-order.
          </DialogDescription>
        </DialogHeader>
        
        <div className="border-y border-gray-200 py-4 my-2">
          <h4 className="font-medium text-navy-800 mb-3">Order Details:</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted-foreground">Item:</span>
              <span className="font-medium">Custom T-Shirt</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Design:</span>
              <span className="font-medium">
                {orderDetails.design === 'custom' 
                  ? `Custom Text: "${orderDetails.customText || 'None'}"` 
                  : 'Template Design'}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Size:</span>
              <span className="font-medium">{orderDetails.size}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Color:</span>
              <span className="font-medium">{orderDetails.color}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-medium">{orderDetails.quantity}</span>
            </li>
            {orderDetails.customNote && (
              <li className="flex justify-between pt-2 border-t border-dashed border-gray-200">
                <span className="text-muted-foreground">Notes:</span>
                <span className="font-medium text-navy-800 text-right max-w-[200px] break-words">{orderDetails.customNote}</span>
              </li>
            )}
            <li className="flex justify-between pt-2 border-t border-dashed border-gray-200">
              <span className="text-muted-foreground">Expected Shipping:</span>
              <span className="font-medium text-navy-800">Within 7 days</span>
            </li>
          </ul>
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            <Calendar className="h-4 w-4" />
            A confirmation email has been sent to your inbox.
          </p>
        </div>
        
        <DialogFooter className="sm:justify-center gap-4 pt-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Button 
            onClick={handleContinueShopping}
            className="w-full sm:w-auto bg-navy-800 hover:bg-navy-900"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmationDialog;
