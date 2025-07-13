import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { apiService, User, UserAddress, UpdateUserRequest, AddAddressRequest, ApiResponse } from '@/lib/api';

// Query keys for user-related data
export const userQueryKeys = {
  user: (id: number) => ['user', id],
  userAddresses: (id: number) => ['user', id, 'addresses'],
} as const;

// Hook to get user profile by ID
export function useUser(
  id: number,
  options?: UseQueryOptions<ApiResponse<User>, Error>
) {
  return useQuery({
    queryKey: userQueryKeys.user(id),
    queryFn: () => apiService.getUserById(id),
    enabled: !!id,
    ...options,
  });
}

// Hook to get user addresses
export function useUserAddresses(
  id: number,
  options?: UseQueryOptions<ApiResponse<UserAddress[]>, Error>
) {
  return useQuery({
    queryKey: userQueryKeys.userAddresses(id),
    queryFn: () => apiService.getUserAddresses(id),
    enabled: !!id,
    ...options,
  });
}

// Hook to update user profile
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: UpdateUserRequest }) =>
      apiService.updateUser(id, userData),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: userQueryKeys.user(id) });
    },
  });
}

// Hook to add user address
export function useAddUserAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, addressData }: { id: number; addressData: AddAddressRequest }) =>
      apiService.addUserAddress(id, addressData),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch user addresses
      queryClient.invalidateQueries({ queryKey: userQueryKeys.userAddresses(id) });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.user(id) });
    },
  });
}

// Hook to update user address
export function useUpdateUserAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      userId, 
      addressId, 
      addressData 
    }: { 
      userId: number; 
      addressId: number; 
      addressData: Partial<AddAddressRequest> 
    }) =>
      apiService.updateUserAddress(userId, addressId, addressData),
    onSuccess: (_, { userId }) => {
      // Invalidate and refetch user addresses
      queryClient.invalidateQueries({ queryKey: userQueryKeys.userAddresses(userId) });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.user(userId) });
    },
  });
}

// Hook to set default address
export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      userId, 
      addressId 
    }: { 
      userId: number; 
      addressId: number; 
    }) =>
      apiService.setDefaultUserAddress(userId, addressId),
    onSuccess: (_, { userId }) => {
      // Invalidate and refetch user addresses
      queryClient.invalidateQueries({ queryKey: userQueryKeys.userAddresses(userId) });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.user(userId) });
    },
  });
} 