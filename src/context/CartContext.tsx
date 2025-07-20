import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  useAddToCart, 
  useUpdateCartItem, 
  useRemoveCartItem, 
  useClearCart, 
  useTransferGuestCart,
  useCartSummary,
  useCartItemCount
} from '@/hooks/useCart';
import { AddToCartRequest, UpdateCartItemRequest, Cart, CartTotals } from '@/lib/api';
import CartSuccessDialog from '@/components/CartSuccessDialog';

interface CartContextType {
  // Cart data
  cart: Cart | undefined;
  totals: CartTotals | undefined;
  itemCount: number;
  isEmpty: boolean;
  isLoading: boolean;
  error: Error | null;
  
  // Session management
  sessionId: string;
  
  // Cart actions
  addToCart: (item: AddToCartRequest, productName?: string) => void;
  updateCartItem: (itemId: number, quantity: number) => void;
  removeCartItem: (itemId: number) => void;
  clearCart: () => void;
  
  // Loading states
  isAddingToCart: boolean;
  isUpdatingCart: boolean;
  isRemovingFromCart: boolean;
  isClearingCart: boolean;
  
  // Success dialog
  showSuccessDialog: boolean;
  successProductName: string;
  closeSuccessDialog: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Generate a unique session ID for guest users
const generateSessionId = (): string => {
  return 'guest_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

// Get or create session ID from localStorage
const getSessionId = (): string => {
  let sessionId = localStorage.getItem('cart_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('cart_session_id', sessionId);
  }
  return sessionId;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sessionId] = useState<string>(getSessionId);
  const [hasTransferredCart, setHasTransferredCart] = useState<boolean>(false);
  
  // Success dialog state
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [successProductName, setSuccessProductName] = useState<string>('');
  
  // Determine cart identifiers based on auth status
  const userId = user?.id || null;
  const currentSessionId = user ? null : sessionId; // Use sessionId only for guest users
  
  // Cart data hooks
  const {
    cart,
    totals,
    isLoading,
    error,
    itemCount,
    isEmpty
  } = useCartSummary(userId, currentSessionId);
  
  // Cart action hooks
  const addToCartMutation = useAddToCart(userId, currentSessionId);
  const updateCartItemMutation = useUpdateCartItem(userId, currentSessionId);
  const removeCartItemMutation = useRemoveCartItem(userId, currentSessionId);
  const clearCartMutation = useClearCart(userId, currentSessionId);
  const transferGuestCartMutation = useTransferGuestCart();
  
  // Transfer guest cart when user logs in (only once per login session)
  useEffect(() => {
    if (user && sessionId && !hasTransferredCart) {
      // Only transfer if there was a guest session and user just logged in
      const hasGuestCart = localStorage.getItem('cart_session_id');
      if (hasGuestCart && !transferGuestCartMutation.isPending) {
        setHasTransferredCart(true); // Prevent multiple transfer attempts
        
        transferGuestCartMutation.mutate(
          { sessionId, userId: user.id },
          {
            onSuccess: () => {
              // Clear the guest session ID after successful transfer
              localStorage.removeItem('cart_session_id');
            },
            onError: (error) => {
              console.warn('Failed to transfer guest cart:', error);
              // Clear the session ID even if transfer fails to prevent retries
              localStorage.removeItem('cart_session_id');
            },
          }
        );
      }
    }
    
    // Reset transfer flag when user logs out
    if (!user) {
      setHasTransferredCart(false);
    }
  }, [user, sessionId, hasTransferredCart]); // Removed transferGuestCartMutation from dependencies
  
  // Success dialog functions
  const closeSuccessDialog = useCallback(() => {
    setShowSuccessDialog(false);
    setSuccessProductName('');
  }, []);

  // Cart action functions
  const addToCart = useCallback((item: AddToCartRequest, productName?: string) => {
    addToCartMutation.mutate(item, {
      onSuccess: () => {
        // Show success dialog instead of toast
        setSuccessProductName(productName || 'Item');
        setShowSuccessDialog(true);
      }
    });
  }, [addToCartMutation]);
  
  const updateCartItem = useCallback((itemId: number, quantity: number) => {
    updateCartItemMutation.mutate({ itemId, updateData: { quantity } });
  }, [updateCartItemMutation]);
  
  const removeCartItem = useCallback((itemId: number) => {
    removeCartItemMutation.mutate(itemId);
  }, [removeCartItemMutation]);
  
  const clearCart = useCallback(() => {
    clearCartMutation.mutate();
  }, [clearCartMutation]);
  
  const contextValue: CartContextType = {
    // Cart data
    cart,
    totals,
    itemCount,
    isEmpty,
    isLoading,
    error,
    
    // Session management
    sessionId: currentSessionId || '',
    
    // Cart actions
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    
    // Loading states
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingCart: updateCartItemMutation.isPending,
    isRemovingFromCart: removeCartItemMutation.isPending,
    isClearingCart: clearCartMutation.isPending,
    
    // Success dialog
    showSuccessDialog,
    successProductName,
    closeSuccessDialog,
  };
  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
      <CartSuccessDialog
        isOpen={showSuccessDialog}
        onClose={closeSuccessDialog}
        productName={successProductName}
      />
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 