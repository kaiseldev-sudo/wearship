
import React from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useUser, useUserAddresses, useUpdateUser, useAddUserAddress, useSetDefaultAddress } from "@/hooks/useUser";
import { usePhoneValidation } from "@/hooks/usePhoneValidation";
import { AddressSelection } from "@/components/AddressSelection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AddAddressRequest } from "@/lib/api";
import { getPostalCode } from "@/lib/postalCodes";
import { Star, CheckCircle, XCircle, Loader2 } from "lucide-react";

const Profile = () => {
  // Use the improved hook with default options (will redirect to login if not authenticated)
  const { user: authUser } = useRequireAuth();
  const { toast } = useToast();
  
  // Phone validation hooks
  const { 
    validatePhone, 
    clearValidation, 
    isValidating, 
    validationResult, 
    error: validationError, 
    isValid 
  } = usePhoneValidation();

  const { 
    validatePhone: validateAddressPhone, 
    clearValidation: clearAddressValidation, 
    isValidating: isAddressValidating, 
    validationResult: addressValidationResult, 
    error: addressValidationError, 
    isValid: isAddressValid 
  } = usePhoneValidation();
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [newAddress, setNewAddress] = useState({
    type: 'both' as const,
    first_name: "",
    last_name: "",
    phone: "",
    address_line_1: "",
    address_line_2: "",
    region: "",
    province: "",
    city: "",
    postal_code: "",
    country: "Philippines",
    is_default: true,
  });

  // API hooks
  const { data: userResponse, isLoading: userLoading, error: userError } = useUser(
    authUser?.id || 0
  );
  
  const { data: addressesResponse, isLoading: addressesLoading } = useUserAddresses(
    authUser?.id || 0
  );

  const updateUserMutation = useUpdateUser();
  const addAddressMutation = useAddUserAddress();
  const setDefaultAddressMutation = useSetDefaultAddress();

  const user = userResponse?.data;
  const addresses = addressesResponse?.data || [];

  // Debounced phone validation
  const debouncedPhoneValidation = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (phoneNumber: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          validatePhone(phoneNumber);
        }, 500);
      };
    })(),
    [validatePhone]
  );

  // Debounced address phone validation
  const debouncedAddressPhoneValidation = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (phoneNumber: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          validateAddressPhone(phoneNumber);
        }, 500);
      };
    })(),
    [validateAddressPhone]
  );

  // Handle address selection changes
  const handleAddressSelectionChange = useCallback((region: string, province: string, city: string) => {
    const postalCode = getPostalCode(city);
    setNewAddress(prev => ({
      ...prev,
      region,
      province,
      city,
      postal_code: postalCode
    }));
  }, []);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setPhone(user.phone || "");
      
      // Initialize new address form with user's name
      setNewAddress(prev => ({
        ...prev,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
      }));
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authUser?.id) return;
    
    // Validate phone number if provided
    if (phone && phone.trim()) {
      if (isValidating) {
        toast({
          title: "Please wait",
          description: "Phone number validation in progress. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      if (validationResult && !isValid) {
        toast({
          title: "Invalid Philippines mobile number",
          description: "Please enter a valid Philippines mobile number (e.g., 09123456789) before saving.",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      await updateUserMutation.mutateAsync({
        id: authUser.id,
        userData: {
          first_name: firstName,
          last_name: lastName,
          phone: phone || undefined,
        }
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authUser?.id) return;
    
    // Validation
    if (!newAddress.first_name || !newAddress.last_name || !newAddress.address_line_1 || 
        !newAddress.city || !newAddress.province || !newAddress.postal_code) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required address fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number if provided
    if (newAddress.phone && newAddress.phone.trim()) {
      if (isAddressValidating) {
        toast({
          title: "Please wait",
          description: "Phone number validation in progress. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      if (addressValidationResult && !isAddressValid) {
        toast({
          title: "Invalid Philippines mobile number",
          description: "Please enter a valid Philippines mobile number (e.g., 09123456789) before saving.",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      const addressData: AddAddressRequest = {
        type: newAddress.type,
        is_default: newAddress.is_default,
        first_name: newAddress.first_name,
        last_name: newAddress.last_name,
        company: newAddress.address_line_2 || undefined,
        phone: newAddress.phone || undefined,
        address_line_1: newAddress.address_line_1,
        address_line_2: newAddress.address_line_2 || undefined,
        city: newAddress.city,
        province: newAddress.province,
        postal_code: newAddress.postal_code,
        country: newAddress.country,
      };

      await addAddressMutation.mutateAsync({
        id: authUser.id,
        addressData
      });
      
      // Reset form
      setNewAddress({
        type: 'both',
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        phone: "",
        address_line_1: "",
        address_line_2: "",
        region: "",
        province: "",
        city: "",
        postal_code: "",
        country: "Philippines",
        is_default: addresses.length === 0, // First address is default
      });
      
      toast({
        title: "Address added",
        description: "Your address has been added successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding address",
        description: error.message || "Failed to add address",
        variant: "destructive",
      });
    }
  };

  const handleSetDefaultAddress = async (addressId: number) => {
    if (!authUser?.id) return;
    
    try {
      await setDefaultAddressMutation.mutateAsync({
        userId: authUser.id,
        addressId
      });
      
      toast({
        title: "Default address updated",
        description: "This address has been set as your default address.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating default address",
        description: error.message || "Failed to update default address",
        variant: "destructive",
      });
    }
  };

  if (userError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <p className="text-red-600">Error loading profile: {userError.message}</p>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-navy-800">My Profile</h1>
          
          <Tabs defaultValue="personal">
            <TabsList className="mb-8">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  {userLoading ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name *</Label>
                          <Input 
                            id="first-name" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={updateUserMutation.isPending}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name *</Label>
                          <Input 
                            id="last-name" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={updateUserMutation.isPending}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={user?.email || ""} 
                          disabled={true}
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-muted-foreground">
                          Email cannot be changed
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Philippines Mobile Number</Label>
                        <div className="relative">
                        <Input 
                          id="phone" 
                            type="text"
                          value={phone} 
                            onChange={(e) => {
                              const newPhone = e.target.value;
                              setPhone(newPhone);
                              if (newPhone.trim()) {
                                debouncedPhoneValidation(newPhone);
                              } else {
                                clearValidation();
                              }
                            }}
                          disabled={updateUserMutation.isPending}
                            placeholder="09123456789"
                            className={`pr-10 ${
                              phone && !isValidating && validationResult
                                ? isValid 
                                  ? 'border-green-500 focus:border-green-500' 
                                  : 'border-red-500 focus:border-red-500'
                                : ''
                            }`}
                          />
                          {phone && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              {isValidating ? (
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                              ) : validationResult ? (
                                isValid ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )
                              ) : null}
                            </div>
                          )}
                        </div>
                        
                        {/* Validation feedback */}
                        {phone && !isValidating && validationResult && (
                          <div className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                            {isValid ? (
                              <div>
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Valid Philippines mobile number
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Invalid Philippines mobile number
                              </div>
                            )}
                          </div>
                        )}
                        
                        {validationError && (
                          <div className="text-sm text-red-600">
                            {validationError.message}
                          </div>
                        )}
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-navy-800 hover:bg-navy-900"
                        disabled={updateUserMutation.isPending}
                      >
                        {updateUserMutation.isPending ? "Updating..." : "Update Profile"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <div className="space-y-6">
                {/* Existing Addresses */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                      <div>
                        <CardTitle>Your Addresses</CardTitle>
                        <CardDescription>
                          Manage your saved addresses. Click "Set as Default" to change which address is used for billing and shipping.
                        </CardDescription>
                      </div>
                      {addresses.length > 0 && (
                        <Badge variant="outline" className="self-start">
                          {addresses.length} address{addresses.length !== 1 ? 'es' : ''} on file
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {addressesLoading ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="p-4 border rounded-lg">
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-4 w-48 mb-1" />
                            <Skeleton className="h-4 w-40" />
                          </div>
                        ))}
                      </div>
                    ) : addresses.length > 0 ? (
                      <div className="space-y-4">
                        {addresses.map((address) => (
                          <div key={address.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">
                                {address.first_name} {address.last_name}
                              </h4>
                              <div className="flex gap-2 items-center">
                                <Badge variant={address.type === 'both' ? 'default' : 'secondary'}>
                                  {address.type === 'both' ? 'Billing & Shipping' : 
                                   address.type === 'billing' ? 'Billing' : 'Shipping'}
                                </Badge>
                                {address.is_default ? (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                    Default
                                  </Badge>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSetDefaultAddress(address.id)}
                                    disabled={setDefaultAddressMutation.isPending}
                                    className="text-xs h-6 px-2 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-colors"
                                  >
                                    {setDefaultAddressMutation.isPending ? (
                                      <span className="flex items-center gap-1">
                                        <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></span>
                                        Setting...
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1">
                                        <Star className="w-3 h-3" />
                                        Set as Default
                                      </span>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground ">
                              <p>{address.address_line_1}</p>
                              {address.address_line_2 && <p>{address.address_line_2}</p>}
                              <p>{address.city}, {address.state} {address.postal_code}</p>
                              <p>{address.country}</p>
                              <p> {address.phone} </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No addresses saved yet.</p>
                    )}
                  </CardContent>
                </Card>

                {/* Add New Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Add New Address</CardTitle>
                    <CardDescription>Add a new billing or shipping address</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddAddress} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="addr-first-name">First Name *</Label>
                          <Input 
                            id="addr-first-name" 
                            value={newAddress.first_name} 
                            onChange={(e) => setNewAddress(prev => ({...prev, first_name: e.target.value}))}
                            disabled={addAddressMutation.isPending}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="addr-last-name">Last Name *</Label>
                          <Input 
                            id="addr-last-name" 
                            value={newAddress.last_name} 
                            onChange={(e) => setNewAddress(prev => ({...prev, last_name: e.target.value}))}
                            disabled={addAddressMutation.isPending}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address-phone">Philippines Mobile Number *</Label>
                        <div className="relative">
                          <Input 
                            id="address-phone" 
                            type="text"
                            value={newAddress.phone} 
                            onChange={(e) => {
                              const newPhone = e.target.value;
                              setNewAddress(prev => ({...prev, phone: newPhone}));
                              if (newPhone.trim()) {
                                debouncedAddressPhoneValidation(newPhone);
                              } else {
                                clearAddressValidation();
                              }
                            }}
                            placeholder="09123456789"
                            disabled={addAddressMutation.isPending}
                            className={`pr-10 ${
                              newAddress.phone && !isAddressValidating && addressValidationResult
                                ? isAddressValid 
                                  ? 'border-green-500 focus:border-green-500' 
                                  : 'border-red-500 focus:border-red-500'
                                : ''
                            }`}
                          />
                          {newAddress.phone && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              {isAddressValidating ? (
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                              ) : addressValidationResult ? (
                                isAddressValid ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                )
                              ) : null}
                            </div>
                          )}
                        </div>
                        
                        {/* Validation feedback */}
                        {newAddress.phone && !isAddressValidating && addressValidationResult && (
                          <div className={`text-sm ${isAddressValid ? 'text-green-600' : 'text-red-600'}`}>
                            {isAddressValid ? (
                              <div>
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Valid Philippines mobile number
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <XCircle className="h-3 w-3" />
                                Invalid Philippines mobile number
                              </div>
                            )}
                          </div>
                        )}
                        
                        {addressValidationError && (
                          <div className="text-sm text-red-600">
                            {addressValidationError.message}
                          </div>
                        )}
                      </div>

                      {/* Address Selection */}
                      <AddressSelection 
                        onSelectionChange={handleAddressSelectionChange}
                        disabled={addAddressMutation.isPending}
                      />

                      {/* ZIP Code */}
                      <div className="space-y-2">
                        <Label htmlFor="postal-code">ZIP Code *</Label>
                        <Input 
                          id="postal-code" 
                          value={newAddress.postal_code} 
                          onChange={(e) => setNewAddress(prev => ({...prev, postal_code: e.target.value}))}
                          placeholder="Auto-filled based on city selection"
                          disabled={addAddressMutation.isPending}
                          className={newAddress.postal_code ? "bg-green-50 border-green-200" : ""}
                          required
                        />
                        {newAddress.postal_code && (
                          <p className="text-xs text-green-600">
                            ✓ Auto-filled based on city selection
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address-line-1">Street Address *</Label>
                        <Input 
                          id="address-line-1" 
                          value={newAddress.address_line_1} 
                          onChange={(e) => setNewAddress(prev => ({...prev, address_line_1: e.target.value}))}
                          placeholder="123 Main St"
                          disabled={addAddressMutation.isPending}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address-line-2">Apartment, suite, etc.</Label>
                        <Input 
                          id="address-line-2" 
                          value={newAddress.address_line_2} 
                          onChange={(e) => setNewAddress(prev => ({...prev, address_line_2: e.target.value}))}
                          placeholder="Apt 2B"
                          disabled={addAddressMutation.isPending}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-navy-800 hover:bg-navy-900"
                        disabled={addAddressMutation.isPending}
                      >
                        {addAddressMutation.isPending ? "Adding Address..." : "Add Address"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
