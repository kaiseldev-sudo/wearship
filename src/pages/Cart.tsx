import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const Cart = () => {
  const { 
    cart, 
    totals, 
    itemCount, 
    isEmpty, 
    isLoading, 
    error, 
    updateCartItem, 
    removeCartItem, 
    clearCart,
    isUpdatingCart,
    isRemovingFromCart
  } = useCart();

  // Format price helper
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  // Handle quantity update
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeCartItem(itemId);
    } else {
      updateCartItem(itemId, newQuantity);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="pt-24 md:pt-28 lg:pt-32 pb-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
              <span className="ml-2 text-navy-600">Loading cart...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="pt-24 md:pt-28 lg:pt-32 pb-12">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center py-12">
              <h1 className="text-3xl font-serif font-semibold text-navy-800 mb-4">
                Shopping Cart
              </h1>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800">Failed to load cart. Please try again.</p>
                <p className="text-red-600 text-sm mt-2">{error.message}</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-12">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link to="/shop" className="flex items-center text-navy-600 hover:text-navy-800 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-navy-800">
              Shopping Cart
            </h1>
            <p className="text-navy-600 mt-2">
              {itemCount === 1 ? '1 item' : `${itemCount} items`} in your cart

            </p>
          </div>

          {isEmpty ? (
            /* Empty Cart State */
            <div className="text-center py-16">
              <ShoppingBag className="h-16 w-16 text-navy-300 mx-auto mb-6" />
              <h2 className="text-2xl font-serif font-medium text-navy-800 mb-4">
                Your cart is empty
              </h2>
              <p className="text-navy-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. 
                Browse our collection to find items that inspire your faith.
              </p>
              <Link to="/shop">
                <Button className="bg-navy-700 hover:bg-navy-800 text-white px-8">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            /* Cart Content */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {/* Clear Cart Button */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif font-medium text-navy-800">
                    Cart Items
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearCart}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>

                {/* Cart Items List */}
                {cart?.items?.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden">
                            {item.product_image ? (
                              <img
                                src={item.product_image}
                                alt={item.product_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <ShoppingBag className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-serif font-medium text-navy-800 text-lg mb-2">
                                {item.product_name}
                              </h3>
                              
                              {item.variant_title && (
                                <p className="text-navy-600 text-sm mb-2">
                                  {item.variant_title}
                                </p>
                              )}
                              
                              {item.is_pre_order && (
                                <Badge variant="outline" className="mb-2 border-gold-500 text-gold-700">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Pre-order
                                </Badge>
                              )}
                              
                              <p className="text-gold-600 font-medium text-lg">
                                ${formatPrice(item.unit_price)}
                              </p>
                            </div>

                            {/* Quantity and Remove */}
                            <div className="flex flex-col items-end gap-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  disabled={isUpdatingCart}
                                  className="h-8 w-8 p-0"
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  min="1"
                                  max="99"
                                  value={item.quantity}
                                  onChange={(e) => {
                                    const newQuantity = parseInt(e.target.value, 10);
                                    if (!isNaN(newQuantity) && newQuantity > 0) {
                                      handleQuantityChange(item.id, newQuantity);
                                    }
                                  }}
                                  className="w-16 h-8 text-center"
                                  disabled={isUpdatingCart}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  disabled={isUpdatingCart}
                                  className="h-8 w-8 p-0"
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Remove Button */}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeCartItem(item.id)}
                                disabled={isRemovingFromCart}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="flex justify-between items-center mt-4 pt-4 border-t border-cream-200">
                            <span className="text-navy-600">Item Total:</span>
                            <span className="font-medium text-navy-800">
                              ${formatPrice(item.total_price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-serif font-medium text-navy-800 mb-6">
                      Order Summary
                    </h2>

                    <div className="space-y-4">
                      <div className="flex justify-between text-navy-600">
                        <span>Subtotal ({itemCount} items)</span>
                        <span>${totals?.subtotal || '0.00'}</span>
                      </div>
                      
                      <div className="flex justify-between text-navy-600">
                        <span>Tax</span>
                        <span>${totals?.tax || '0.00'}</span>
                      </div>
                      
                      <div className="flex justify-between text-navy-600">
                        <span>Shipping</span>
                        <span>
                          {totals?.free_shipping_eligible ? (
                            <span className="text-green-600 font-medium">FREE</span>
                          ) : (
                            `$${totals?.shipping || '0.00'}`
                          )}
                        </span>
                      </div>

                      {totals && !totals.free_shipping_eligible && totals.free_shipping_remaining !== '0.00' && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <p className="text-blue-800 text-sm">
                            Add ${totals.free_shipping_remaining} more for free shipping!
                          </p>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between text-lg font-medium text-navy-800">
                        <span>Total</span>
                        <span>${totals?.total || '0.00'}</span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <Link to="/checkout" className="block">
                        <Button className="w-full bg-navy-700 hover:bg-navy-800 text-white py-3">
                          Proceed to Checkout
                        </Button>
                      </Link>
                      <Link to="/shop" className="block">
                        <Button variant="outline" className="w-full border-navy-600 text-navy-800">
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart; 