
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Clock, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  id: string | number;
  name: string;
  price: number;
  image: string;
  verse?: string;
  preOrder?: boolean;
  className?: string;
  viewMode?: "grid" | "list";
  shortDescription?: string;
  inventoryQuantity?: number;
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  image, 
  verse, 
  preOrder = false,
  className,
  viewMode = "grid",
  shortDescription,
  inventoryQuantity = 0
}: ProductCardProps) => {
  const { addToCart, isAddingToCart } = useCart();
  const [isHovering, setIsHovering] = useState(false);

  // Helper function to safely format price
  const formatPrice = (priceValue: number) => {
    const numPrice = typeof priceValue === 'number' ? priceValue : parseFloat(priceValue as string) || 0;
    return numPrice.toFixed(2);
  };

  // Helper function to get stock status
  const getStockStatus = () => {
    if (preOrder) return null; // Don't show stock for pre-order items
    
    if (inventoryQuantity > 10) {
      return { text: "In Stock", color: "text-green-600", bgColor: "bg-green-100" };
    } else if (inventoryQuantity > 0) {
      return { text: `Only ${inventoryQuantity} left`, color: "text-orange-600", bgColor: "bg-orange-100" };
    } else {
      return { text: "Out of Stock", color: "text-red-600", bgColor: "bg-red-100" };
    }
  };

  const handleAddToCart = () => {
    // Validate ID exists
    if (id === null || id === undefined || id === '') {
      console.error('Product ID is null, undefined, or empty:', id);
      return;
    }
    
    // Convert id to number if it's a string
    const productId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    if (isNaN(productId) || productId <= 0) {
      console.error('Invalid product ID after conversion:', productId, 'from original:', id);
      return;
    }
    addToCart({
      productId: productId,
      quantity: 1,
    }, name);
  };

  const stockStatus = getStockStatus();

  if (viewMode === "list") {
    return (
      <div 
        className={cn("group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-lg border border-cream-200 hover:shadow-lg transition-shadow duration-300", className)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-100 w-full md:w-48 aspect-[3/4] md:aspect-square rounded-lg flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/10 transition-colors duration-300" />
          {preOrder && (
            <div className="absolute top-3 left-3 bg-gold-500 text-navy-900 py-1 px-2 rounded-md font-medium text-xs flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Pre-order
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h3 className="text-xl font-serif font-medium text-navy-800 mb-2">{name}</h3>
            {verse ? (
              <p className="text-navy-600 text-sm italic mb-3">"{verse}"</p>
            ) : shortDescription ? (
              <p className="text-navy-600 text-sm mb-3">{shortDescription}</p>
            ) : null}
            <p className="text-2xl font-medium text-gold-600 mb-4">${formatPrice(price)}</p>
            {stockStatus && (
              <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium mb-4", stockStatus.bgColor, stockStatus.color)}>
                <Package className="h-3 w-3" />
                {stockStatus.text}
              </div>
            )}
            {preOrder && (
              <p className="text-navy-500 text-sm mb-4">Ships in 7 days</p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleAddToCart}
              disabled={isAddingToCart || (!preOrder && inventoryQuantity === 0)}
              className="bg-navy-700 hover:bg-navy-800 text-white flex-1 md:flex-none disabled:bg-gray-400"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {isAddingToCart ? 'Adding...' : (preOrder ? "Pre-order Now" : inventoryQuantity === 0 ? "Out of Stock" : "Add to Cart")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn("group overflow-hidden", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-4 rounded-lg">
        <img
          src={image}
          alt={name}
          className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-navy-900/0 group-hover:bg-navy-900/20 transition-colors duration-300" />
        {preOrder && (
          <div className="absolute top-4 left-4 bg-gold-500 text-navy-900 py-1 px-3 rounded-md font-medium text-sm flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Pre-order
          </div>
        )}
        {stockStatus && (
          <div className={cn("absolute top-4 right-4 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1", stockStatus.bgColor, stockStatus.color)}>
            <Package className="h-3 w-3" />
            {stockStatus.text}
          </div>
        )}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <Button 
            onClick={handleAddToCart}
            disabled={isAddingToCart || (!preOrder && inventoryQuantity === 0)}
            className="bg-white text-navy-800 hover:bg-cream-50 font-medium shadow-lg disabled:bg-gray-300 disabled:text-gray-500"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            {isAddingToCart ? 'Adding...' : (preOrder ? "Pre-order Now" : inventoryQuantity === 0 ? "Out of Stock" : "Add to Cart")}
          </Button>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-navy-800 font-serif font-medium text-lg">{name}</h3>
        {verse ? (
          <p className="text-navy-600 text-sm mt-1 italic">"{verse}"</p>
        ) : shortDescription ? (
          <p className="text-navy-600 text-sm mt-1">{shortDescription}</p>
        ) : null}
        <p className="text-gold-600 font-medium mt-2">${formatPrice(price)}</p>
        {stockStatus && (
          <div className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium mt-2", stockStatus.bgColor, stockStatus.color)}>
            <Package className="h-3 w-3" />
            {stockStatus.text}
          </div>
        )}
        {preOrder && (
          <p className="text-navy-500 text-xs mt-1">Ships in 7 days</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
