import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useWishlist, useRemoveFromWishlist, useClearWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, Heart, Trash2, Package, Clock, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isAddingToCart } = useCart();
  
  const { data: wishlistResponse, isLoading, error } = useWishlist(user?.id || null);
  const removeFromWishlistMutation = useRemoveFromWishlist(user?.id || null);
  const clearWishlistMutation = useClearWishlist(user?.id || null);
  
  const wishlist = wishlistResponse?.data || [];

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlistMutation.mutate({ productId });
  };

  const handleClearWishlist = () => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      clearWishlistMutation.mutate();
    }
  };

  const handleAddToCart = (productId: number, productName: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    addToCart({
      productId: productId,
      quantity: 1,
    }, productName);
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="pt-24 md:pt-28 lg:pt-32 pb-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
              <span className="ml-2 text-navy-600">Loading wishlist...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="pt-24 md:pt-28 lg:pt-32 pb-12">
          <div className="container mx-auto px-6">
            <Alert className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>Error loading wishlist.</strong></p>
                  <p className="text-sm text-gray-600">
                    {error instanceof Error ? error.message : 'Failed to load your wishlist.'}
                  </p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
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
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/shop')}
              className="text-navy-600 hover:text-navy-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-semibold text-navy-800 mb-2">
                  My Wishlist
                </h1>
                <p className="text-navy-600">
                  {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} in your wishlist
                </p>
              </div>
              
              {wishlist.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleClearWishlist}
                  disabled={clearWishlistMutation.isPending}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {clearWishlistMutation.isPending ? 'Clearing...' : 'Clear All'}
                </Button>
              )}
            </div>
          </div>

          {/* Wishlist Items */}
          {wishlist.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-navy-800 mb-2">Your wishlist is empty</h2>
              <p className="text-navy-600 mb-6">Start adding items to your wishlist to see them here.</p>
              <Button onClick={() => navigate('/shop')} className="bg-navy-600 hover:bg-navy-700">
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    {/* Product Image */}
                    <div className="aspect-square bg-white rounded-lg overflow-hidden border border-cream-200 mb-4">
                      <img
                        src={item.primary_image_url || "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop"}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop";
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-navy-800 mb-1 line-clamp-2">
                          {item.product_name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          {Boolean(item.is_pre_order) && (
                            <Badge variant="secondary" className="bg-orange-500 text-white">
                              <Clock className="h-3 w-3 mr-1" />
                              Pre-order
                            </Badge>
                          )}
                          {!Boolean(item.is_pre_order) && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <Package className="h-3 w-3 mr-1" />
                              {item.inventory_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </Badge>
                          )}
                        </div>
                        <p className="text-2xl font-bold text-gold-600">
                          ${formatPrice(item.base_price)}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAddToCart(item.product_id, item.product_name)}
                          disabled={isAddingToCart || (!item.is_pre_order && item.inventory_quantity === 0)}
                          className="flex-1 bg-navy-600 hover:bg-navy-700"
                          size="sm"
                        >
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                        </Button>
                        <Button
                          onClick={() => handleRemoveFromWishlist(item.product_id)}
                          disabled={removeFromWishlistMutation.isPending}
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Wishlist; 