
import React from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/lib/api";

// Map backend product to frontend format (same as Shop page)
const mapProductToCard = (product: Product) => {
  // Ensure product.id is valid
  if (!product.id || product.id === null || product.id === undefined) {
    console.error('FeaturedProducts: Product missing ID:', product);
    return null;
  }
  
  const mapped = {
    id: product.id.toString(),
    name: product.name,
    price: typeof product.base_price === 'string' ? parseFloat(product.base_price) || 0 : product.base_price || 0,
    image: product.primary_image_url || "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop",
    verse: undefined, // Backend doesn't have verse field yet
    shortDescription: product.short_description,
    preOrder: product.is_pre_order,
    featured: product.is_featured,
    category: product.category_id?.toString() || "1",
  };
  return mapped;
};

const FeaturedProducts = () => {
  // Fetch featured products from API
  const { data: productsResponse, isLoading, error } = useProducts({
    active: true,
    featured: true,
    limit: 4, // Only show 4 featured products
  });

  // Loading state
  if (isLoading) {
    return (
      <section className="section-padding bg-cream-50">
        <div className="container mx-auto container-padding">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-gold-600 font-medium">Featured Collection</span>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-navy-800 mt-2 mb-4">
              Scripture-Inspired Designs
            </h2>
            <p className="text-navy-600">
              Our most beloved designs, crafted with care to inspire faith and share God's Word through
              thoughtfully created apparel.
            </p>
          </div>

          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
            <span className="ml-2 text-navy-600">Loading featured products...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state - show fallback content
  if (error || !productsResponse?.data) {
    return (
      <section className="section-padding bg-cream-50">
        <div className="container mx-auto container-padding">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-gold-600 font-medium">Featured Collection</span>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-navy-800 mt-2 mb-4">
              Scripture-Inspired Designs
            </h2>
            <p className="text-navy-600">
              Our most beloved designs, crafted with care to inspire faith and share God's Word through
              thoughtfully created apparel.
            </p>
          </div>

          <div className="text-center py-8">
            <p className="text-navy-600 mb-4">Unable to load featured products at the moment.</p>
            <Link to="/shop">
              <Button variant="outline" className="border-navy-600 text-navy-800 hover:bg-navy-50 px-8 py-6">
                Browse All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Map products to frontend format
  const featuredProducts = productsResponse.data
    .slice(0, 4)
    .map(mapProductToCard)
    .filter(product => product !== null); // Filter out products with invalid IDs

  return (
    <section className="section-padding bg-cream-50">
      <div className="container mx-auto container-padding">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-gold-600 font-medium">Featured Collection</span>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-navy-800 mt-2 mb-4">
            Scripture-Inspired Designs
          </h2>
          <p className="text-navy-600">
            Our most beloved designs, crafted with care to inspire faith and share God's Word through
            thoughtfully created apparel.
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mb-10">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            <div className="text-center">
              <Link to="/shop">
                <Button variant="outline" className="border-navy-600 text-navy-800 hover:bg-navy-50 px-8 py-6">
                  View All Products <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-navy-600 mb-4">No featured products available at the moment.</p>
            <Link to="/shop">
              <Button variant="outline" className="border-navy-600 text-navy-800 hover:bg-navy-50 px-8 py-6">
                Browse All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
