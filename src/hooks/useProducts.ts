import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiService, queryKeys, Product, Category, ApiResponse, ProductFilters } from '@/lib/api';

export function useProducts(
  filters?: ProductFilters,
  options?: UseQueryOptions<ApiResponse<Product[]>, Error>
) {
  return useQuery({
    queryKey: queryKeys.products(filters),
    queryFn: () => apiService.getProducts(filters),
    ...options,
  });
}

export function useFeaturedProducts(
  limit?: number,
  options?: UseQueryOptions<ApiResponse<Product[]>, Error>
) {
  return useQuery({
    queryKey: queryKeys.featuredProducts(limit),
    queryFn: () => apiService.getFeaturedProducts(limit),
    ...options,
  });
}

export function useProduct(
  id: number,
  options?: UseQueryOptions<ApiResponse<Product>, Error>
) {
  return useQuery({
    queryKey: queryKeys.product(id),
    queryFn: () => apiService.getProductById(id),
    enabled: !!id,
    ...options,
  });
}

export function useProductBySlug(
  slug: string,
  options?: UseQueryOptions<ApiResponse<Product>, Error>
) {
  return useQuery({
    queryKey: queryKeys.productBySlug(slug),
    queryFn: () => apiService.getProductBySlug(slug),
    enabled: !!slug,
    ...options,
  });
}

export function useSearchProducts(
  query: string,
  limit?: number,
  offset?: number,
  options?: UseQueryOptions<ApiResponse<Product[]>, Error>
) {
  return useQuery({
    queryKey: queryKeys.searchProducts(query, limit, offset),
    queryFn: () => apiService.searchProducts(query, limit, offset),
    enabled: !!query && query.length > 0,
    ...options,
  });
}

export function useCategories(
  options?: UseQueryOptions<ApiResponse<Category[]>, Error>
) {
  return useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () => apiService.getCategories(),
    ...options,
  });
} 