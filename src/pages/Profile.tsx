
import React from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useUser, useUserAddresses, useUpdateUser, useAddUserAddress, useSetDefaultAddress } from "@/hooks/useUser";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AddAddressRequest } from "@/lib/api";
import { Star } from "lucide-react";

const Profile = () => {
  // Use the improved hook with default options (will redirect to login if not authenticated)
  const { user: authUser } = useRequireAuth();
  const { toast } = useToast();
  
  // Form stateProduct ID is required
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [newAddress, setNewAddress] = useState({
    type: 'both' as const,
    first_name: "",
    last_name: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "United States",
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
        !newAddress.city || !newAddress.state || !newAddress.postal_code) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required address fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const addressData: AddAddressRequest = {
        type: newAddress.type,
        is_default: newAddress.is_default,
        first_name: newAddress.first_name,
        last_name: newAddress.last_name,
        company: newAddress.address_line_2 || undefined,
        address_line_1: newAddress.address_line_1,
        address_line_2: newAddress.address_line_2 || undefined,
        city: newAddress.city,
        state: newAddress.state,
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
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "United States",
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
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          type="tel"
                          value={phone} 
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={updateUserMutation.isPending}
                          placeholder="(555) 123-4567"
                        />
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
                            <div className="text-sm text-muted-foreground">
                              <p>{address.address_line_1}</p>
                              {address.address_line_2 && <p>{address.address_line_2}</p>}
                              <p>{address.city}, {address.state} {address.postal_code}</p>
                              <p>{address.country}</p>
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

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input 
                            id="city" 
                            value={newAddress.city} 
                            onChange={(e) => setNewAddress(prev => ({...prev, city: e.target.value}))}
                            disabled={addAddressMutation.isPending}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <Input 
                            id="state" 
                            value={newAddress.state} 
                            onChange={(e) => setNewAddress(prev => ({...prev, state: e.target.value}))}
                            disabled={addAddressMutation.isPending}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postal-code">ZIP Code *</Label>
                          <Input 
                            id="postal-code" 
                            value={newAddress.postal_code} 
                            onChange={(e) => setNewAddress(prev => ({...prev, postal_code: e.target.value}))}
                            disabled={addAddressMutation.isPending}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input 
                          id="country" 
                          value={newAddress.country} 
                          onChange={(e) => setNewAddress(prev => ({...prev, country: e.target.value}))}
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
