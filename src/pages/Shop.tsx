
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SlidersHorizontal, Grid, List, Loader2, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { Product, Category, apiService } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Map backend product to frontend format
const mapProductToCard = (product: Product) => {
  // Ensure product.id is valid
  if (!product.id || product.id === null || product.id === undefined) {
    console.error('Product missing ID:', product);
    return null;
  }
  
  const mapped = {
    id: product.id, // Keep as number instead of converting to string
    name: product.name,
    price: typeof product.base_price === 'string' ? parseFloat(product.base_price) || 0 : product.base_price || 0,
    image: product.primary_image_url || "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1964&auto=format&fit=crop",
    verse: undefined, // Backend doesn't have verse field yet
    shortDescription: product.short_description,
    preOrder: product.is_pre_order,
    featured: product.is_featured,
    category: product.category_id?.toString() || "1",
    inventoryQuantity: product.inventory_quantity || 0,
  };
  return mapped;
};

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 60]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 12;

  // Initialize search from URL parameters
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
      // Clear the URL parameter after setting the search
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('search');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Build API filters - NO SEARCH in API to prevent re-fetching
  const apiFilters = useMemo(() => {
    const filters: any = {
      active: true, // Only show active products
      limit: 100, // Get all products for client-side filtering
    };

    if (selectedCategory !== "all") {
      filters.category_id = parseInt(selectedCategory);
    }

    if (showFeaturedOnly) {
      filters.featured = true;
    }

    // Remove search from API - do all search client-side to prevent refreshes

    return filters;
  }, [selectedCategory, showFeaturedOnly]);

  // Fetch products and categories from API
  const { data: productsResponse, isLoading, error, refetch } = useProducts(apiFilters);
  const { data: categoriesResponse, isLoading: categoriesLoading } = useCategories();

  // Build categories list with "All Products" option
  const categories = useMemo(() => {
    const allOption = { id: "all", name: "All Products" };
    if (!categoriesResponse?.data) {
      return [allOption];
    }
    
    const apiCategories = categoriesResponse.data
      .filter(cat => cat.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(cat => ({
        id: cat.id.toString(),
        name: cat.name
      }));
    
    return [allOption, ...apiCategories];
  }, [categoriesResponse]);

  // Client-side filtering and sorting with real-time search
  const filteredAndSortedProducts = useMemo(() => {
    if (!productsResponse?.data) return [];

    let products = productsResponse.data
      .map(mapProductToCard)
      .filter(product => product !== null); // Filter out products with invalid IDs

          // Apply client-side filters
      products = products.filter((product) => {
        // Real-time search filter (searches name, description, short description, and tags)
        const searchTerms = searchQuery.toLowerCase().trim();
        if (!searchTerms) {
          return true; // Show all products when no search query
        }
        
        const matchesSearch = 
          product.name.toLowerCase().includes(searchTerms) ||
          (product.shortDescription && product.shortDescription.toLowerCase().includes(searchTerms));

      // Price filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // Available only filter (exclude pre-order items when enabled)
      const matchesAvailability = !showAvailableOnly || !product.preOrder;

      return matchesSearch && matchesPrice && matchesAvailability;
    });

    // Sort products
    products.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return b.id - a.id;
        default:
          return 0;
      }
    });

    return products;
  }, [productsResponse?.data, searchQuery, priceRange, showAvailableOnly, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceRange, showAvailableOnly, showFeaturedOnly, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange([0, 60]);
    setShowAvailableOnly(false);
    setShowFeaturedOnly(false);
    setSortBy("name");
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategory !== "all",
    priceRange[0] > 0 || priceRange[1] < 60,
    showAvailableOnly, // Count as active filter when hiding pre-orders
    showFeaturedOnly,
  ].filter(Boolean).length;

  // Loading state
  if (isLoading || categoriesLoading) {
    return (
      <div className="overflow-x-hidden">
        <Navbar />
        <div className="pt-24 md:pt-28 lg:pt-32 pb-12">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-3xl md:text-5xl font-serif font-semibold text-navy-800 mb-4">
                Scripture-Inspired Collection
              </h1>
              <p className="text-navy-600">
                Browse our collection of faith-inspired apparel designed to spread God's Word through
                thoughtful, beautiful designs.
              </p>
            </div>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
              <span className="ml-2 text-navy-600">Loading products...</span>
            </div>
          </div>
        </div>
        <Newsletter />
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    const handleHealthCheck = async () => {
      const health = await apiService.checkHealth();
      alert(`Health Check Result:\nStatus: ${health.status}\nMessage: ${health.message}`);
    };

    return (
      <div className="overflow-x-hidden">
        <Navbar />
        <div className="pt-24 md:pt-28 lg:pt-32 pb-12">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-3xl md:text-5xl font-serif font-semibold text-navy-800 mb-4">
                Scripture-Inspired Collection
              </h1>
              <p className="text-navy-600">
                Browse our collection of faith-inspired apparel designed to spread God's Word through
                thoughtful, beautiful designs.
              </p>
            </div>
            <Alert className="max-w-2xl mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>Unable to load products.</strong></p>
                  <p className="text-sm text-gray-600">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
                  <p className="text-sm">Please ensure:</p>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    <li>Backend server is running on <code>http://localhost:3001</code></li>
                    <li>Database is set up and running</li>
                    <li>No firewall blocking the connection</li>
                  </ul>
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                    <p><strong>To start the backend:</strong></p>
                    <p>1. <code>cd server</code></p>
                    <p>2. <code>npm install</code></p>
                    <p>3. <code>npm run db:setup</code> (setup database)</p>
                    <p>4. <code>npm run dev</code> (start server)</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => refetch()} 
                      className="flex-1"
                    >
                      Try Again
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleHealthCheck}
                      className="flex-1"
                    >
                      Check Backend Health
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        </div>
        <Newsletter />
        <Footer />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <div className="pt-24 md:pt-28 lg:pt-32 pb-12">
        {/* Header */}
        <div className="container mx-auto px-6 mb-8">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h1 className="text-3xl md:text-5xl font-serif font-semibold text-navy-800 mb-4">
              Scripture-Inspired Collection
            </h1>
            <p className="text-navy-600">
              Browse our collection of faith-inspired apparel designed to spread God's Word through
              thoughtful, beautiful designs.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy-500" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-navy-600 text-navy-800"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-gold-500 text-navy-900">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="hidden sm:flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-cream-50 border border-cream-200 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <Label className="text-navy-800 font-medium mb-3 block">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-navy-800 font-medium mb-3 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={60}
                    min={0}
                    step={1}
                    className="mt-2"
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="available"
                      checked={showAvailableOnly}
                      onCheckedChange={(checked) => setShowAvailableOnly(checked === true)}
                    />
                    <Label htmlFor="available" className="text-navy-700">
                      Hide pre-order items
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={showFeaturedOnly}
                      onCheckedChange={(checked) => setShowFeaturedOnly(checked === true)}
                    />
                    <Label htmlFor="featured" className="text-navy-700">
                      Featured items only
                    </Label>
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full border-navy-600 text-navy-800"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-navy-600">
              Showing {filteredAndSortedProducts.length} products
              {productsResponse?.data && ` of ${productsResponse.data.length} total`}
            </p>
            
            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={clearFilters} className="text-navy-600 hover:text-navy-800">
                Clear all filters
              </Button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-6">
          {paginatedProducts.length > 0 ? (
            <div className={`grid gap-6 mb-12 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1 lg:grid-cols-2 gap-8"
            }`}>
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id.toString()}
                  {...product}
                  viewMode={viewMode as "grid" | "list"}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 text-navy-300 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-navy-800 mb-2">No products found</h3>
              <p className="text-navy-600 mb-4">Try adjusting your filters or search terms</p>
              <Button onClick={clearFilters} variant="outline" className="border-navy-600 text-navy-800">
                Clear all filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-12">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="border-navy-600 text-navy-800"
              >
                Previous
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className={
                    currentPage === page
                      ? "bg-navy-700 text-white"
                      : "border-navy-600 text-navy-800"
                  }
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="border-navy-600 text-navy-800"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Shop;
