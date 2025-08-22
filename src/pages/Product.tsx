import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Newsletter from '@/components/Newsletter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlistStatus, useAddToWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import { useProductReviews, useUserReview } from '@/hooks/useReviews';
import { ShoppingBag, Clock, Package, ArrowLeft, Heart, Share2, Star, Edit } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import ReviewForm from '@/components/ReviewForm';

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isAddingToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Fetch product data
  const { data: productResponse, isLoading, error } = useProduct(
    id ? parseInt(id) : 0
  );

  const product = productResponse?.data;

  // Wishlist functionality
  const { data: wishlistStatusResponse } = useWishlistStatus(user?.id || null, product?.id || null);
  const addToWishlistMutation = useAddToWishlist(user?.id || null);
  const removeFromWishlistMutation = useRemoveFromWishlist(user?.id || null);
  
  const isInWishlist = wishlistStatusResponse?.data?.isInWishlist || false;
  const isWishlistLoading = addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  // Review functionality
  const { data: reviewsResponse, isLoading: reviewsLoading } = useProductReviews(product?.id || 0);
  const { data: userReviewResponse } = useUserReview(product?.id || null, user?.id || null);
  
  const reviews = reviewsResponse?.data?.reviews || [];
  const reviewStats = reviewsResponse?.data?.stats || null;
  const userReview = userReviewResponse?.data || null;
  
  // Debug logging (temporary)
  console.log('Reviews Response:', reviewsResponse);
  console.log('Reviews Array:', reviews);
  console.log('Reviews Length:', reviews.length);
  if (reviews.length > 0) {
    console.log('First Review:', reviews[0]);
    console.log('First Review Keys:', Object.keys(reviews[0]));
  }
  console.log('Review Stats:', reviewStats);
  console.log('User Review:', userReview);
  
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Update quantity when product loads
  React.useEffect(() => {
    if (product) {
      // Always start with 1, regardless of inventory
      setQuantity(1);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!product) return;
    
    addToCart({
      productId: product.id,
      quantity: quantity,
    }, product.name);
  };

  const handleWishlistToggle = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!product) return;
    
    if (isInWishlist) {
      removeFromWishlistMutation.mutate({ productId: product.id });
    } else {
      addToWishlistMutation.mutate({ productId: product.id });
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!product) return;
    
    navigate('/checkout', {
      state: {
        buyNowProduct: {
          productId: product.id,
          quantity: quantity,
          name: product.name,
          price: typeof product.base_price === 'string' ? parseFloat(product.base_price) : product.base_price,
          image: product.images?.[0]?.url || "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop",
          preOrder: product.is_pre_order
        }
      }
    });
  };

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toFixed(2);
  };

  const getStockStatus = () => {
    if (product?.is_pre_order) return null;
    
    if (product?.inventory_quantity > 10) {
      return { text: "In Stock", color: "text-green-600", bgColor: "bg-green-100" };
    } else if (product?.inventory_quantity > 0) {
      return { text: `Only ${product.inventory_quantity} left`, color: "text-orange-600", bgColor: "bg-orange-100" };
    } else {
      return { text: "Out of Stock", color: "text-red-600", bgColor: "bg-red-100" };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="pt-24 md:pt-28 lg:pt-32 pb-12">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
              <span className="ml-2 text-navy-600">Loading product...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="pt-24 md:pt-28 lg:pt-32 pb-12">
          <div className="container mx-auto px-6">
            <Alert className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>Product not found.</strong></p>
                  <p className="text-sm text-gray-600">
                    {error instanceof Error ? error.message : 'The product you are looking for does not exist.'}
                  </p>
                  <Button onClick={() => navigate('/shop')} variant="outline">
                    Back to Shop
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

  // Add error boundary for product data
  if (!product || typeof product !== 'object') {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="pt-24 md:pt-28 lg:pt-32 pb-12">
          <div className="container mx-auto px-6">
            <Alert className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>Invalid product data.</strong></p>
                  <p className="text-sm text-gray-600">
                    The product data is not in the expected format.
                  </p>
                  <Button onClick={() => navigate('/shop')} variant="outline">
                    Back to Shop
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

  const stockStatus = getStockStatus();
  
    // Handle images with better fallback logic
  const images = product?.images || [];
  const thumbnails = product?.thumbnails || [];
  
  // Extract URLs from image objects (backend returns objects with 'url' property)
  const imageUrls = images.map(img => img.url).filter(Boolean);
  
  // Combine thumbnails with images for a complete gallery
  const allImages = [...imageUrls, ...thumbnails].filter(Boolean);
  const uniqueImages = [...new Set(allImages)]; // Remove duplicates
  
  const currentImage = uniqueImages[selectedImage] || uniqueImages[0] || "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop";



  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-12">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/shop')}
              className="text-navy-600 hover:text-navy-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-lg overflow-hidden border border-cream-200">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', currentImage);
                    e.currentTarget.src = "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop";
                  }}
                />
              </div>

              {/* Thumbnail Images */}
              {uniqueImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {uniqueImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                        selectedImage === index ? 'border-navy-600 shadow-lg' : 'border-cream-200 hover:border-navy-400'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Thumbnail image failed to load:', image);
                          e.currentTarget.src = "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Product Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {Boolean(product?.is_featured) && (
                    <Badge variant="secondary" className="bg-gold-500 text-navy-900">
                      Featured
                    </Badge>
                  )}
                  {Boolean(product?.is_pre_order) && (
                    <Badge variant="secondary" className="bg-orange-500 text-white">
                      <Clock className="h-3 w-3 mr-1" />
                      Pre-order
                    </Badge>
                  )}
                  {!Boolean(product?.is_pre_order) && stockStatus && (
                    <Badge variant="secondary" className={stockStatus.bgColor}>
                      <Package className="h-3 w-3 mr-1" />
                      {stockStatus.text}
                    </Badge>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-serif font-semibold text-navy-800 mb-2">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gold-600">
                      ${formatPrice(product.base_price)}
                    </span>
                    {product.compare_at_price && (
                      <span className="text-lg text-gray-500 line-through ml-2">
                        ${formatPrice(product.compare_at_price)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-gold-400 text-gold-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">(4.8)</span>
                  </div>
                </div>
              </div>

              {/* Product Description */}
              <div>
                <h3 className="text-lg font-semibold text-navy-800 mb-2">Description</h3>
                <p className="text-navy-600 leading-relaxed">
                  {product.description || product.short_description}
                </p>
              </div>



              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.inventory_quantity || 1, quantity + 1))}
                    disabled={product.is_pre_order ? false : quantity >= (product.inventory_quantity || 1)}
                  >
                    +
                  </Button>
                </div>
                {!product.is_pre_order && product.inventory_quantity <= 10 && (
                  <p className="text-sm text-orange-600 mt-1">
                    Only {product.inventory_quantity} left in stock
                  </p>
                )}
              </div>

              {/* Available Options - Compact */}
              {product.variants && Array.isArray(product.variants) && product.variants.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-navy-700">Available Sizes</h3>
                    {product.variants.length > 5 && (
                      <span className="text-xs text-navy-500">Scroll for more →</span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-navy-200 scrollbar-track-cream-100 hover:scrollbar-thumb-navy-300 max-w-[calc(5*6rem+1rem)]">
                      {product.variants.map((variant) => (
                        <div key={variant.id} className="flex-shrink-0 w-24 border border-cream-200 rounded-lg p-2 text-center hover:border-navy-300 transition-colors">
                          <div className="text-xs font-medium text-navy-800 mb-1">{variant.title}</div>
                          <div className="text-xs text-navy-600 mb-1">${formatPrice(variant.price || product.base_price)}</div>
                                                  <Badge 
                          variant={variant.inventory_quantity > 0 ? "default" : "secondary"} 
                          className="text-[10px] px-1.5 py-0.5"
                        >
                          {variant.inventory_quantity > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                        </div>
                      ))}
                    </div>
                    {product.variants.length > 5 && (
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-cream-50 to-transparent pointer-events-none"></div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleBuyNow}
                  disabled={isAddingToCart || (!product.is_pre_order && product.inventory_quantity === 0)}
                  className="w-full bg-gold-600 hover:bg-gold-700 text-white font-medium py-3"
                >
                  {isAddingToCart ? 'Processing...' : (product.is_pre_order ? "Buy Now" : product.inventory_quantity === 0 ? "Out of Stock" : "Buy Now")}
                </Button>
                
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || (!product.is_pre_order && product.inventory_quantity === 0)}
                  variant="outline"
                  className="w-full border-navy-600 text-navy-800 hover:bg-navy-50"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  {isAddingToCart ? 'Adding...' : (product.is_pre_order ? "Add to Cart" : product.inventory_quantity === 0 ? "Out of Stock" : "Add to Cart")}
                </Button>
              </div>

              {/* Additional Actions */}
              <div className="flex items-center gap-4 pt-4 border-t border-cream-200">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${isInWishlist ? 'text-red-600' : 'text-navy-600'} hover:text-red-600`}
                  onClick={handleWishlistToggle}
                  disabled={isWishlistLoading}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isInWishlist ? 'fill-current' : ''}`} />
                  {isWishlistLoading ? 'Loading...' : (isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist')}
                </Button>
                <Button variant="ghost" size="sm" className="text-navy-600">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
          </div>

          
        {/* Detailed Product Information */}
        <div className="mt-16 px-6 py-8 bg-white rounded-lg border border-cream-200">
          <Separator className="mb-8" />
          <h2 className="text-2xl font-serif font-semibold text-navy-800 mb-6">Product Details</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Product Specifications */}
            <div className="space-y-6">
              <div className="bg-cream-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-navy-800 mb-4">Specifications</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-cream-200">
                    <span className="font-medium text-navy-700">SKU</span>
                    <span className="text-navy-600">{product.sku}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-cream-200">
                    <span className="font-medium text-navy-700">Category</span>
                    <span className="text-navy-600">{product.category_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-cream-200">
                    <span className="font-medium text-navy-700">Brand</span>
                    <span className="text-navy-600">{product.brand}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-cream-200">
                    <span className="font-medium text-navy-700">Material</span>
                    <span className="text-navy-600">100% Premium Cotton</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-cream-200">
                    <span className="font-medium text-navy-700">Weight</span>
                    <span className="text-navy-600">{product.weight || '0.25'} lbs</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-cream-200">
                    <span className="font-medium text-navy-700">Care Instructions</span>
                    <span className="text-navy-600">Machine wash cold, tumble dry low</span>
                  </div>
                  {Boolean(product.is_pre_order) ? (
                    <div className="flex justify-between py-2 border-b border-cream-200">
                      <span className="font-medium text-navy-700">Shipping</span>
                      <span className="text-navy-600">7-10 business days</span>
                    </div>
                  ) : (
                    <div className="flex justify-between py-2 border-b border-cream-200">
                      <span className="font-medium text-navy-700">Availability</span>
                      <span className="text-navy-600">{product.inventory_quantity} in stock</span>
                    </div>
                  )}
                </div>
              </div>

              {/* I am goint to delete this later on */}

              {/* Tags */}
              {product.tags && (
                <div className="bg-cream-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-navy-800 mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      try {
                        const tags = typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags;
                        return Array.isArray(tags) ? tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-navy-100 text-navy-700">
                            {tag}
                          </Badge>
                        )) : null;
                      } catch (error) {
                        console.error('Error parsing tags:', error);
                        return null;
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Product Features */}
            <div className="space-y-6">
              <div className="bg-cream-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-navy-800 mb-4">Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-navy-700">Premium quality cotton fabric for ultimate comfort</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-navy-700">Faith-inspired design with modern typography</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-navy-700">Durable construction that lasts through countless washes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-navy-700">Available in multiple sizes and colors</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-navy-700">Perfect for daily wear and worship expression</span>
                  </li>
                </ul>
              </div>

              {/* Shipping & Returns */}
              <div className="bg-cream-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-navy-800 mb-4">Shipping & Returns</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-navy-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-navy-700">Free Shipping</div>
                      <div className="text-sm text-navy-600">Free standard shipping on orders over $75</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-navy-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-navy-700">Fast Delivery</div>
                      <div className="text-sm text-navy-600">Standard shipping: 3-5 business days</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 text-navy-600 mt-0.5 flex-shrink-0">↩</div>
                    <div>
                      <div className="font-medium text-navy-700">Easy Returns</div>
                      <div className="text-sm text-navy-600">30-day return policy, no questions asked</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
            <div className="mt-16 px-6 py-8 bg-white rounded-lg border border-cream-200">
              <Separator className="mb-8" />
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-semibold text-navy-800">Customer Reviews</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-navy-600"
              onClick={() => setShowReviewForm(true)}
            >
              {userReview ? <Edit className="h-4 w-4 mr-2" /> : null}
              {userReview ? 'Edit Review' : 'Write a Review'}
            </Button>
          </div>
          
          {/* Review Summary */}
          {reviewStats && (
            <div className="bg-cream-50 rounded-lg border border-cream-200 p-8 mb-8">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-navy-800">
                    {reviewStats.average_rating ? reviewStats.average_rating.toFixed(1) : '0.0'}
                      </div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-gold-400 text-gold-400" />
                    ))}
                  </div>
                  <div className="text-sm text-navy-600 mt-1">
                    Based on {reviewStats.total_reviews} reviews
                  </div>
                </div>
                <div className="flex-1">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = rating === 5 ? reviewStats.five_star :
                                   rating === 4 ? reviewStats.four_star :
                                   rating === 3 ? reviewStats.three_star :
                                   rating === 2 ? reviewStats.two_star :
                                   reviewStats.one_star;
                      const percentage = reviewStats.total_reviews > 0 ? 
                        (count / reviewStats.total_reviews) * 100 : 0;
                      
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-sm text-navy-600 w-8">{rating} stars</span>
                          <div className="flex-1 bg-cream-100 rounded-full h-2">
                            <div 
                              className="bg-gold-400 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-navy-600 w-12">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-8">
            {reviewsLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-navy-600 mx-auto mb-4" />
                <p className="text-navy-600">Loading reviews...</p>
              </div>
            ) : reviews && reviews.length > 0 ? (
              <>
                <div className="text-sm text-gray-500 mb-4">
                  Debug: Rendering {reviews.length} reviews
                </div>
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg border border-cream-200 p-8">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center">
                        <span className="text-navy-700 font-medium text-sm">
                          {review.first_name?.[0]}{review.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-navy-800">
                          {review.first_name} {review.last_name}
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`h-3 w-3 ${star <= review.rating ? 'fill-gold-400 text-gold-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-navy-600">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                      {review.is_verified_purchase && (
                        <div className="text-xs text-green-600 mt-1">✓ Verified Purchase</div>
                      )}
                    </div>
                  </div>
                  {review.title && (
                    <h4 className="font-semibold text-navy-800 mb-2">{review.title}</h4>
                  )}
                  <p className="text-navy-700 leading-relaxed">{review.comment}</p>
                  {review.helpful_votes > 0 && (
                    <div className="text-sm text-navy-600 mt-3">
                      {review.helpful_votes} people found this helpful
                    </div>
                  )}
                </div>
              ))}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-navy-600">No reviews yet. Be the first to review this product!</p>
                <p className="text-sm text-gray-500 mt-2">
                  Debug: reviews.length = {reviews?.length || 'undefined'}, 
                  reviewsLoading = {reviewsLoading ? 'true' : 'false'}
                </p>
              </div>
            )}
            
            {/* Debug Section - Remove this in production */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h4 className="font-semibold mb-2">Debug Info:</h4>
                <p><strong>Reviews Count:</strong> {reviews.length}</p>
                <p><strong>Reviews Loading:</strong> {reviewsLoading ? 'Yes' : 'No'}</p>
                <p><strong>Product ID:</strong> {product?.id}</p>
                <p><strong>User ID:</strong> {user?.id}</p>
                <p><strong>Raw Reviews Response:</strong></p>
                <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(reviewsResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          productId={product.id}
          productName={product.name}
          existingReview={userReview}
          onClose={() => setShowReviewForm(false)}
          onSuccess={() => {
            setShowReviewForm(false);
            // The reviews will be automatically refetched due to query invalidation
          }}
        />
      )}
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Product; 