import { config } from './config';

// Auth types for backend API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  status: string;
  addresses?: UserAddress[];
}

export interface UserAddress {
  id: number;
  user_id: number;
  type: 'billing' | 'shipping' | 'both';
  is_default: boolean;
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
}

export interface AddAddressRequest {
  type: 'billing' | 'shipping' | 'both';
  is_default?: boolean;
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
}

export interface AuthResponse {
  user: User;
  token?: string; // For future JWT implementation
}

// Cart types for shopping cart functionality
export interface CartItem {
  id: number;
  cart_id: number;
  productId: number;
  variant_id?: number | null;
  custom_design_id?: number | null;
  quantity: number;
  unit_price: string | number;
  total_price: string | number;
  product_name: string;
  product_slug: string;
  is_pre_order: boolean;
  pre_order_message?: string;
  estimated_shipping_date?: string;
  variant_title?: string;
  variant_sku?: string;
  inventory_quantity?: number;
  allow_backorders?: boolean;
  product_image?: string;
  custom_design_name?: string;
  custom_design_image?: string;
  created_at: string;
  updated_at: string;
}

export interface Cart {
  id: number;
  user_id?: number | null;
  session_id?: string | null;
  currency: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  items: CartItem[];
  subtotal: string;
  item_count: number;
  totals?: CartTotals;
}

export interface CartTotals {
  item_count: number;
  total_quantity: number;
  subtotal: string;
  tax: string;
  shipping: string;
  total: string;
  free_shipping_eligible: boolean;
  free_shipping_remaining: string;
}

export interface AddToCartRequest {
  productId: number;
  variant_id?: number | null;
  custom_design_id?: number | null;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// Types based on backend response structure
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  sku: string;
  base_price: number | string; // API might return string
  compare_at_price?: number | string;
  cost_price?: number | string;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  brand: string;
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  is_pre_order: boolean;
  pre_order_message?: string;
  estimated_shipping_date?: string;
  inventory_quantity: number;
  primary_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id?: number;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number | null;
  };
  error?: string;
  message?: string;
}

export interface ProductFilters {
  category_id?: number;
  featured?: boolean;
  active?: boolean;
  pre_order?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.API_URL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        // Handle specific error cases
        if (response.status === 429) {
          throw new Error(`Rate limit exceeded. Please wait a moment before trying again.`);
        }
        
        if (response.status === 0 || errorText.includes('CORS')) {
          throw new Error(`CORS error: Cannot connect to backend server at ${this.baseUrl}. Please ensure the server is running and CORS is configured.`);
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', {
        url: `${this.baseUrl}${endpoint}`,
        error: error instanceof Error ? error.message : 'Unknown error',
        baseUrl: this.baseUrl
      });
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to backend server at ${this.baseUrl}. Please ensure the server is running.`);
      }
      
      throw error;
    }
  }

  private getCartHeaders(userId?: number | null, sessionId?: string | null): Record<string, string> {
    const headers: Record<string, string> = {};
    
    if (userId) {
      headers['x-user-id'] = userId.toString();
    }
    
    if (sessionId) {
      headers['x-session-id'] = sessionId;
    }
    
    return headers;
  }

  // Products API
  async getProducts(filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Product[]>(endpoint);
  }

  async getFeaturedProducts(limit?: number): Promise<ApiResponse<Product[]>> {
    const params = limit ? `?limit=${limit}` : '';
    return this.request<Product[]>(`/products/featured${params}`);
  }

  async getProductById(id: number): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`);
  }

  async getProductBySlug(slug: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/slug/${slug}`);
  }

  async searchProducts(query: string, limit?: number, offset?: number): Promise<ApiResponse<Product[]>> {
    const filters: ProductFilters = {
      search: query,
    };
    if (limit) filters.limit = limit;
    if (offset) filters.offset = offset;
    
    return this.getProducts(filters);
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/products/categories');
  }

  async getProductVariants(productId: number): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/products/${productId}/variants`);
  }

  // Shopping Cart API
  async getCart(userId?: number | null, sessionId?: string | null): Promise<ApiResponse<Cart>> {
    return this.request<Cart>('/cart', {
      headers: this.getCartHeaders(userId, sessionId),
    });
  }

  async addToCart(
    cartData: AddToCartRequest, 
    userId?: number | null, 
    sessionId?: string | null
  ) {
    // Convert camelCase to snake_case
    const payload = {
      product_id: cartData.productId,
      variant_id: cartData.variant_id,
      custom_design_id: cartData.custom_design_id,
      quantity: cartData.quantity,
    };
  
    return this.request('/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getCartHeaders(userId, sessionId),
      },
      body: JSON.stringify(payload),
    });
  }
  
  

  async updateCartItem(
    itemId: number,
    updateData: UpdateCartItemRequest,
    userId?: number | null,
    sessionId?: string | null
  ): Promise<ApiResponse<{ totals: CartTotals }>> {
    return this.request<{ totals: CartTotals }>(`/cart/items/${itemId}`, {
      method: 'PUT',
      headers: this.getCartHeaders(userId, sessionId),
      body: JSON.stringify(updateData),
    });
  }

  async removeCartItem(
    itemId: number,
    userId?: number | null,
    sessionId?: string | null
  ): Promise<ApiResponse<{ totals: CartTotals }>> {
    return this.request<{ totals: CartTotals }>(`/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: this.getCartHeaders(userId, sessionId),
    });
  }

  async clearCart(
    userId?: number | null,
    sessionId?: string | null
  ): Promise<ApiResponse<{ items_removed: number }>> {
    return this.request<{ items_removed: number }>('/cart', {
      method: 'DELETE',
      headers: this.getCartHeaders(userId, sessionId),
    });
  }

  async getCartTotals(
    userId?: number | null,
    sessionId?: string | null
  ): Promise<ApiResponse<CartTotals>> {
    return this.request<CartTotals>('/cart/totals', {
      headers: this.getCartHeaders(userId, sessionId),
    });
  }

  async transferGuestCartToUser(
    sessionId: string,
    userId: number
  ): Promise<ApiResponse<{ cart_id: number }>> {
    return this.request<{ cart_id: number }>('/cart/transfer', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, user_id: userId }),
    });
  }

  // Authentication API
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // User Management API
  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${id}`);
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getUserAddresses(id: number): Promise<ApiResponse<UserAddress[]>> {
    return this.request<UserAddress[]>(`/users/${id}/addresses`);
  }

  async addUserAddress(id: number, addressData: AddAddressRequest): Promise<ApiResponse<UserAddress>> {
    return this.request<UserAddress>(`/users/${id}/addresses`, {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  async updateUserAddress(userId: number, addressId: number, addressData: Partial<AddAddressRequest>): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/users/${userId}/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  }

  async setDefaultUserAddress(userId: number, addressId: number): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/users/${userId}/addresses/${addressId}/set-default`, {
      method: 'PATCH',
    });
  }

  // Health check endpoint
  async checkHealth(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl.replace('/api/v1', '')}/health`);
      if (response.ok) {
        return { status: 'ok', message: 'Backend server is running' };
      } else {
        return { status: 'error', message: `Health check failed: ${response.status}` };
      }
    } catch (error) {
      return { 
        status: 'error', 
        message: `Cannot connect to backend: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}

// Create singleton instance
export const apiService = new ApiService();

// React Query keys
export const queryKeys = {
  products: (filters?: ProductFilters) => ['products', filters],
  featuredProducts: (limit?: number) => ['products', 'featured', limit],
  product: (id: number) => ['product', id],
  productBySlug: (slug: string) => ['product', 'slug', slug],
  searchProducts: (query: string, limit?: number, offset?: number) => ['products', 'search', query, limit, offset],
  categories: () => ['products', 'categories'],
  productVariants: (productId: number) => ['product', productId, 'variants'],
  cart: (userId?: number | null, sessionId?: string | null) => ['cart', userId, sessionId],
  cartTotals: (userId?: number | null, sessionId?: string | null) => ['cart', 'totals', userId, sessionId],
} as const;

export default apiService; 