import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { apiService, queryKeys, Cart, CartTotals, AddToCartRequest, UpdateCartItemRequest, CartItem, ApiResponse } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Hook for getting cart data
export function useCart(
  userId?: number | null, 
  sessionId?: string | null,
  options?: UseQueryOptions<ApiResponse<Cart>, Error>
) {
  return useQuery({
    queryKey: queryKeys.cart(userId, sessionId),
    queryFn: () => apiService.getCart(userId, sessionId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
}

// Hook for getting cart totals
export function useCartTotals(
  userId?: number | null,
  sessionId?: string | null,
  options?: UseQueryOptions<ApiResponse<CartTotals>, Error>
) {
  return useQuery({
    queryKey: queryKeys.cartTotals(userId, sessionId),
    queryFn: () => apiService.getCartTotals(userId, sessionId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  });
}

// Hook for adding items to cart
export function useAddToCart(
  userId?: number | null,
  sessionId?: string | null
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (cartData: AddToCartRequest) => 
      apiService.addToCart(cartData, userId, sessionId),
    onSuccess: (data, variables) => {
      // Invalidate and refetch cart queries
      queryClient.invalidateQueries({ queryKey: queryKeys.cart(userId, sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cartTotals(userId, sessionId) });
      
      // Note: Success notification is now handled by the CartContext
      // which shows an alert dialog instead of a toast
    },
    onError: (error: Error) => {
      // Show error toast
      toast({
        title: "Failed to add to cart",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Hook for updating cart item quantity
export function useUpdateCartItem(
  userId?: number | null,
  sessionId?: string | null
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ itemId, updateData }: { itemId: number; updateData: UpdateCartItemRequest }) =>
      apiService.updateCartItem(itemId, updateData, userId, sessionId),
    onSuccess: () => {
      // Invalidate and refetch cart queries
      queryClient.invalidateQueries({ queryKey: queryKeys.cart(userId, sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cartTotals(userId, sessionId) });
      
      // Show success toast
      toast({
        title: "Cart updated!",
        description: "Item quantity has been updated.",
      });
    },
    onError: (error: Error) => {
      // Show error toast
      toast({
        title: "Failed to update cart",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Hook for removing items from cart
export function useRemoveCartItem(
  userId?: number | null,
  sessionId?: string | null
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (itemId: number) =>
      apiService.removeCartItem(itemId, userId, sessionId),
    onSuccess: () => {
      // Invalidate and refetch cart queries
      queryClient.invalidateQueries({ queryKey: queryKeys.cart(userId, sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cartTotals(userId, sessionId) });
      
      // Show success toast
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    },
    onError: (error: Error) => {
      // Show error toast
      toast({
        title: "Failed to remove item",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Hook for clearing entire cart
export function useClearCart(
  userId?: number | null,
  sessionId?: string | null
) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () =>
      apiService.clearCart(userId, sessionId),
    onSuccess: (data) => {
      // Invalidate and refetch cart queries
      queryClient.invalidateQueries({ queryKey: queryKeys.cart(userId, sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cartTotals(userId, sessionId) });
      
      // Show success toast
      toast({
        title: "Cart cleared",
        description: `Removed ${data.data.items_removed} items from your cart.`,
      });
    },
    onError: (error: Error) => {
      // Show error toast
      toast({
        title: "Failed to clear cart",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Hook for transferring guest cart to user (used during login)
export function useTransferGuestCart() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ sessionId, userId }: { sessionId: string; userId: number }) =>
      apiService.transferGuestCartToUser(sessionId, userId),
    retry: (failureCount, error) => {
      // Retry up to 2 times for network errors, but not for CORS or rate limit errors
      if (failureCount < 2 && error instanceof Error) {
        const isRetryableError = !error.message.includes('CORS') && 
                                 !error.message.includes('Rate limit') &&
                                 !error.message.includes('429');
        return isRetryableError;
      }
      return false;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    onSuccess: (data, variables) => {
      // Invalidate guest cart queries and refetch user cart
      queryClient.invalidateQueries({ queryKey: queryKeys.cart(null, variables.sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart(variables.userId, null) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cartTotals(null, variables.sessionId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.cartTotals(variables.userId, null) });
      
      // Show success toast
      toast({
        title: "Cart transferred",
        description: "Your cart items have been saved to your account.",
      });
    },
    onError: (error: Error) => {
      console.warn('Cart transfer failed:', error.message);
      
      // Show user-friendly error message for specific cases
      if (error.message.includes('Rate limit')) {
        toast({
          title: "Please wait",
          description: "Too many requests. Your cart will sync automatically.",
          variant: "destructive",
        });
      } else if (error.message.includes('CORS')) {
        toast({
          title: "Connection issue",
          description: "Unable to sync cart. Please refresh the page.",
          variant: "destructive",
        });
      }
      // Don't show toast for other cart transfer failures as they're not critical
    },
  });
}

// Helper hook for getting cart item count
export function useCartItemCount(
  userId?: number | null,
  sessionId?: string | null
) {
  const { data: cartTotals } = useCartTotals(userId, sessionId);

  return cartTotals?.data?.item_count || 0;
}

// Helper hook for getting cart summary
export function useCartSummary(
  userId?: number | null,
  sessionId?: string | null
) {
  const { data: cart, isLoading: cartLoading, error: cartError } = useCart(userId, sessionId);
  const { data: totals, isLoading: totalsLoading, error: totalsError } = useCartTotals(userId, sessionId);

  return {
    cart: cart?.data,
    totals: totals?.data,
    isLoading: cartLoading || totalsLoading,
    error: cartError || totalsError,
    itemCount: totals?.data?.item_count || 0,
    isEmpty: (totals?.data?.item_count || 0) === 0,
  };
} 