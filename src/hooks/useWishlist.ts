import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService, queryKeys, WishlistItem, WishlistStatus } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Hook for getting user's wishlist
export function useWishlist(userId: number | null) {
  return useQuery({
    queryKey: queryKeys.wishlist(userId!),
    queryFn: () => apiService.getUserWishlist(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook for checking if a product is in wishlist
export function useWishlistStatus(userId: number | null, productId: number | null) {
  return useQuery({
    queryKey: queryKeys.wishlistStatus(userId!, productId!),
    queryFn: () => apiService.checkWishlistStatus(userId!, productId!),
    enabled: !!userId && !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Hook for adding to wishlist
export function useAddToWishlist(userId: number | null) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ productId }: { productId: number }) => 
      apiService.addToWishlist(userId!, productId),
    onSuccess: (data, variables) => {
      // Invalidate and refetch wishlist
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist(userId!) });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.wishlistStatus(userId!, variables.productId) 
      });
      
      toast({
        title: "Added to Wishlist",
        description: "Item has been added to your wishlist.",
      });
    },
    onError: (error: any) => {
      console.error('Error adding to wishlist:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to add to wishlist",
        variant: "destructive",
      });
    },
  });
}

// Hook for removing from wishlist
export function useRemoveFromWishlist(userId: number | null) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ productId }: { productId: number }) => 
      apiService.removeFromWishlist(userId!, productId),
    onSuccess: (data, variables) => {
      // Invalidate and refetch wishlist
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist(userId!) });
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.wishlistStatus(userId!, variables.productId) 
      });
      
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
    },
    onError: (error: any) => {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to remove from wishlist",
        variant: "destructive",
      });
    },
  });
}

// Hook for clearing wishlist
export function useClearWishlist(userId: number | null) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => apiService.clearWishlist(userId!),
    onSuccess: () => {
      // Invalidate and refetch wishlist
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist(userId!) });
      
      toast({
        title: "Wishlist Cleared",
        description: "Your wishlist has been cleared.",
      });
    },
    onError: (error: any) => {
      console.error('Error clearing wishlist:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to clear wishlist",
        variant: "destructive",
      });
    },
  });
} 