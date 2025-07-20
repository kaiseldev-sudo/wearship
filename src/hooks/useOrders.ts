import { useQuery } from '@tanstack/react-query';
import { apiService } from '../lib/api';

export const useUserOrders = (userId: number | null, filters?: {
  status?: string;
  payment_status?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ['user-orders', userId, filters],
    queryFn: () => apiService.getUserOrders(userId!, filters),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useOrderById = (orderId: number | null) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => apiService.getOrderById(orderId!),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 