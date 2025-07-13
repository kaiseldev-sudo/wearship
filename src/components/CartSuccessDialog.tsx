import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingBag } from 'lucide-react';

interface CartSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

const CartSuccessDialog: React.FC<CartSuccessDialogProps> = ({
  isOpen,
  onClose,
  productName = 'Item'
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <AlertDialogTitle className="text-xl font-semibold text-navy-800 text-center">
            Successfully Added to Cart!
          </AlertDialogTitle>
          <AlertDialogDescription className="text-navy-600">
            {productName} has been added to your shopping cart.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogAction
            onClick={onClose}
            className="bg-navy-700 hover:bg-navy-800 text-white w-full sm:w-auto"
          >
            Continue Shopping
          </AlertDialogAction>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto border-navy-200 text-navy-700 hover:bg-navy-50"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            View Cart
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CartSuccessDialog; 