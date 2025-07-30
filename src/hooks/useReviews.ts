import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api';

// Types
export interface Review {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  helpful_votes: number;
  created_at: string;
  updated_at: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  five_star: number;
  four_star: number;
  three_star: number;
  two_star: number;
  one_star: number;
}

export interface ReviewData {
  product_id: number;
  rating: number;
  title: string;
  comment: string;
}

// Hooks
export const useProductReviews = (productId: number, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['reviews', productId, page, limit],
    queryFn: async () => {
      const response = await apiService.getProductReviews(productId, page, limit);
      return response.data;
    },
    enabled: !!productId,
  });
};

export const useUserReview = (productId: number | null, userId: number | null) => {
  return useQuery({
    queryKey: ['userReview', productId, userId],
    queryFn: async () => {
      const response = await apiService.getUserReview(productId!, userId!);
      return response.data;
    },
    enabled: !!productId && !!userId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reviewData, userId }: { reviewData: ReviewData; userId: number }) => {
      const response = await apiService.createReview(reviewData, userId);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch reviews for the product
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', variables.reviewData.product_id],
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['userReview', variables.reviewData.product_id],
        exact: false 
      });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reviewId, reviewData, userId }: { reviewId: number; reviewData: ReviewData; userId: number }) => {
      const response = await apiService.updateReview(reviewId, reviewData, userId);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch reviews for the product
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', variables.reviewData.product_id],
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['userReview', variables.reviewData.product_id],
        exact: false 
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reviewId, productId, userId }: { reviewId: number; productId: number; userId: number }) => {
      const response = await apiService.deleteReview(reviewId, productId, userId);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch reviews for the product
      queryClient.invalidateQueries({ 
        queryKey: ['reviews', variables.productId],
        exact: false 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['userReview', variables.productId],
        exact: false 
      });
    },
  });
};

export const useMarkReviewHelpful = () => {
  return useMutation({
    mutationFn: async (reviewId: number) => {
      const response = await apiService.markReviewHelpful(reviewId);
      return response.data;
    },
  });
}; 