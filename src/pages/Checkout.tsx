import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogTitle } from '../components/ui/dialog';
import { toast } from '../components/ui/use-toast';
import { useUserAddresses } from '../hooks/useUser';
import { usePhoneValidation } from '../hooks/usePhoneValidation';
import { AddressSelection } from '../components/AddressSelection';
import { apiService } from '../lib/api';
import { AlertTriangle, XCircle, CheckCircle, Loader2 } from 'lucide-react';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const Checkout: React.FC = () => {
  const { cart, totals, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle buy now product from navigation state
  const buyNowProduct = location.state?.buyNowProduct;
  
  // Create virtual cart data for buy now product
  const virtualCart = buyNowProduct ? {
    id: 0, // Virtual cart ID
    items: [{
      id: 0,
      cart_id: 0,
      productId: buyNowProduct.productId,
      quantity: buyNowProduct.quantity,
      unit_price: buyNowProduct.price.toString(),
      total_price: (buyNowProduct.price * buyNowProduct.quantity).toString(),
      product_name: buyNowProduct.name,
      product_slug: '',
      is_pre_order: buyNowProduct.preOrder,
      product_image: buyNowProduct.image,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }],
    subtotal: (buyNowProduct.price * buyNowProduct.quantity).toString(),
    item_count: 1
  } : null;
  
  // Use virtual cart if buy now product exists, otherwise use regular cart
  const currentCart = buyNowProduct ? virtualCart : cart;
  const currentTotals = buyNowProduct ? {
    item_count: 1,
    total_quantity: buyNowProduct.quantity,
    subtotal: (buyNowProduct.price * buyNowProduct.quantity).toString(),
    tax: ((buyNowProduct.price * buyNowProduct.quantity) * 0.12).toString(), // 12% tax
    shipping: '0.00', // Free shipping for single item
    total: ((buyNowProduct.price * buyNowProduct.quantity) * 1.12).toString(),
    free_shipping_eligible: true,
    free_shipping_remaining: '0.00'
  } : totals;
  const [address, setAddress] = useState({
    name: '',
    street: '',
    region: '',
    province: '',
    city: '',
    zip: '',
    country: 'Philippines',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showCancellation, setShowCancellation] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Phone validation hook
  const { 
    validatePhone, 
    clearValidation, 
    isValidating, 
    validationResult, 
    error: validationError, 
    isValid 
  } = usePhoneValidation();

  // Fetch user addresses
  const userId = user?.id;
  const { data: addresses, isLoading: addressesLoading } = useUserAddresses(userId || 0);

  // Find default shipping or both address
  const defaultAddress = addresses?.data?.find(
    (addr) => addr.is_default && (addr.type === 'shipping' || addr.type === 'both')
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // When addresses are loaded, set selectedAddress to defaultAddress
  useEffect(() => {
    if (defaultAddress) {
      setSelectedAddress(defaultAddress);
    }
  }, [defaultAddress]);

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

  // Handle address selection changes
  const handleAddressSelectionChange = useCallback((region: string, province: string, city: string) => {
    setAddress(prev => ({
      ...prev,
      region,
      province,
      city,
    }));
  }, []);

  // Helper: is address valid?
  const isAddressValid = !!defaultAddress || (
    address.name && address.street && address.city && address.province && address.zip && address.country && address.phone
  );

  useEffect(() => {
    if (
      isAddressValid
    ) {
      const script = document.createElement('script');
      script.id = 'paypal-sdk';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD`;
      script.async = true;
      script.onload = () => {
        // @ts-ignore
        if (window.paypal && paypalRef.current) {
          // @ts-ignore
          (window as any).paypal.Buttons({
            funding: {
              disallowed: [(window as any).paypal.FUNDING.PAYLATER]
            },
            createOrder: (data: any, actions: any) => {
              let value = '0.00';
              if (currentTotals?.total !== undefined && currentTotals?.total !== null) {
                if (typeof currentTotals.total === 'string') {
                  value = currentTotals.total;
                } else if (typeof currentTotals.total === 'number') {
                  value = Number(currentTotals.total).toFixed(2);
                }
              }
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value,
                    },
                  },
                ],
              }).then((order: any) => {
                console.log('PayPal Order Created:', order);
                return order;
              });
            },
            onApprove: async (data: any, actions: any) => {
              try {
                const details = await actions.order.capture();
                console.log('PayPal Order Details:', details);
                console.log('PayPal Order ID:', data.orderID);
                
                // Format address data properly
                const formatAddress = (addr: any) => {
                  if (addr && addr.first_name) {
                    // User address from database
                    return {
                      first_name: addr.first_name,
                      last_name: addr.last_name,
                      company: addr.company || '',
                      address_line_1: addr.address_line_1,
                      address_line_2: addr.address_line_2 || '',
                      city: addr.city,
                      state: addr.state,
                      postal_code: addr.postal_code,
                      country: addr.country,
                      phone: addr.phone || ''
                    };
                  } else {
                    // Manual address entry
                    return {
                      first_name: addr.name || '',
                      last_name: '',
                      company: '',
                      address_line_1: addr.street || '',
                      address_line_2: '',
                      city: addr.city || '',
                      state: addr.province || '',
                      postal_code: addr.zip || '',
                      country: addr.country || 'Philippines',
                      phone: addr.phone || ''
                    };
                  }
                };

                // Create order in database first
                const orderResponse = await apiService.createOrder({
                  cart_id: buyNowProduct ? 0 : cart?.id, // Use 0 for buy now (no cart)
                  user_id: user?.id,
                  email: user?.email || '',
                  billing_address: formatAddress(selectedAddress || address),
                  shipping_address: formatAddress(selectedAddress || address),
                  payment_method: 'paypal',
                  notes: buyNowProduct ? 'Buy Now - PayPal payment' : 'PayPal payment'
                });

                const orderId = orderResponse.data.id;

                // Complete PayPal payment in database
                const paymentResponse = await apiService.completePayPalPayment(orderId, {
                  paypalOrderDetails: details,
                  paypalOrderId: data.orderID
                });

                console.log('Payment completed:', paymentResponse);

                setShowConfirmation(true);
                clearCart();
              } catch (error) {
                console.error('Payment error:', error);
                toast({ 
                  title: 'Payment Failed', 
                  description: error instanceof Error ? error.message : 'There was an error processing your payment. Please try again.',
                  variant: 'destructive'
                });
              }
            },
            onError: (err: any) => {
              toast({ 
                title: 'Payment Failed', 
                description: err?.message || 'There was an error processing your payment. Please try again.',
                variant: 'destructive'
              });
            },
            onCancel: (data: any) => {
              console.log('PayPal payment cancelled:', data);
              setShowCancellation(true);
            },
          }).render(paypalRef.current);
        }
      };
      document.body.appendChild(script);
    }
    // Clean up PayPal button if payment method changes
    return () => {
      if (paypalRef.current) {
        paypalRef.current.innerHTML = '';
      }
      const sdk = document.getElementById('paypal-sdk');
      if (sdk && !isAddressValid) {
        sdk.remove();
      }
    };
    // eslint-disable-next-line
  }, [isAddressValid, currentTotals?.total, showAddressModal]);

  if (!user) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddressValid) {
      toast({ title: 'Please fill in all address fields.' });
      return;
    }

    // Validate phone number if provided
    if (address.phone && address.phone.trim()) {
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
          description: "Please enter a valid Philippines mobile number (e.g., 09123456789) before proceeding.",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowConfirmation(true);
      clearCart();
    }, 1200);
  };

  // Helper for formatting price
  const formatPrice = (value: string | number | undefined) => {
    if (value === undefined) return '0.00';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toFixed(2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Navbar />
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-16 max-w-5xl">
          <h1 className="text-3xl font-bold mb-10 text-navy-800 text-center font-serif">Checkout</h1>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Order Summary */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-serif font-semibold mb-6 text-navy-800">Order Summary</h2>
                {!currentCart || !currentCart.items || currentCart.items.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  <ul className="mb-6 divide-y divide-cream-200">
                    {currentCart.items.map((item) => {
                      const price = typeof item.unit_price === 'string' ? parseFloat(item.unit_price) : item.unit_price;
                      const qty = typeof item.quantity === 'string' ? parseInt(item.quantity as any, 10) : item.quantity;
                      return (
                        <li key={item.id} className="flex justify-between py-2 text-navy-700">
                          <span>{item.product_name} x {qty}</span>
                          <span>${(price * qty).toFixed(2)}</span>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className="space-y-2 text-navy-700">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${formatPrice(currentTotals?.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${formatPrice(currentTotals?.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{currentTotals?.free_shipping_eligible ? <span className="text-green-600 font-medium">FREE</span> : `$${formatPrice(currentTotals?.shipping)}`}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-3 mt-3 text-lg">
                    <span>Total:</span>
                    <span>${formatPrice(currentTotals?.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Shipping & Payment */}
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <Card className="shadow-md">
                <CardContent className="space-y-4 p-6">
                  <h2 className="text-lg font-serif font-semibold mb-2 text-navy-800">Shipping Address</h2>
                  {addressesLoading ? (
                    <div>Loading address...</div>
                  ) : selectedAddress ? (
                    <div className="relative bg-cream-100 rounded-lg p-4 border border-cream-200">
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-blue-600 hover:underline text-sm"
                        onClick={() => setShowAddressModal(true)}
                      >
                        Change
                      </button>
                      <div className="font-medium text-navy-800 mb-1">
                        {selectedAddress.first_name} {selectedAddress.last_name}
                      </div>
                      <div>{selectedAddress.address_line_1}{selectedAddress.address_line_2 ? `, ${selectedAddress.address_line_2}` : ''}</div>
                      <div>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.postal_code}</div>
                      <div>{selectedAddress.country}</div>
                      {selectedAddress.phone && (
                        <div className="text-blue-600 font-medium">
                          📞 {selectedAddress.phone}
                        </div>
                      )}
                      {selectedAddress.is_default && (
                        <div className="mt-2 text-xs text-navy-500">(Default Shipping Address)</div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={address.name} onChange={handleInputChange} required />
                      </div>
                      
                      {/* Address Selection */}
                      <AddressSelection 
                        onSelectionChange={handleAddressSelectionChange}
                        disabled={false}
                      />

                      <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Input id="street" name="street" value={address.street} onChange={handleInputChange} required />
                      </div>

                      {/* ZIP Code */}
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code *</Label>
                        <Input 
                          id="zip" 
                          name="zip" 
                          value={address.zip} 
                          onChange={handleInputChange}
                          placeholder="Auto-filled based on city selection"
                          className={address.zip ? "bg-green-50 border-green-200" : ""}
                          required 
                        />
                        {address.zip && (
                          <p className="text-xs text-green-600">
                            ✓ Auto-filled based on city selection
                          </p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-2">
                        <Label htmlFor="phone">Philippines Mobile Number *</Label>
                        <div className="relative">
                          <Input 
                            id="phone" 
                            name="phone"
                            type="text"
                            value={address.phone} 
                            onChange={(e) => {
                              const newPhone = e.target.value;
                              setAddress(prev => ({...prev, phone: newPhone}));
                              if (newPhone.trim()) {
                                debouncedPhoneValidation(newPhone);
                              } else {
                                clearValidation();
                              }
                            }}
                            placeholder="09123456789"
                            className={`pr-10 ${
                              address.phone && !isValidating && validationResult
                                ? isValid 
                                  ? 'border-green-500 focus:border-green-500' 
                                  : 'border-red-500 focus:border-red-500'
                                : ''
                            }`}
                            required
                          />
                          {address.phone && (
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
                        {address.phone && !isValidating && validationResult && (
                          <div className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                            {isValid ? (
                              <div>
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Valid Philippines mobile number
                                </div>
                                {validationResult.format?.local && (
                                  <div className="text-xs text-gray-600 mt-1">
                                    Format: {validationResult.format.local}
                                  </div>
                                )}
                                {validationResult.carrier && (
                                  <div className="text-xs text-gray-600">
                                    Carrier: {validationResult.carrier}
                                  </div>
                                )}
                                {validationResult.location && (
                                  <div className="text-xs text-gray-600">
                                    Location: {validationResult.location}
                                  </div>
                                )}
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
                    </>
                  )}
                </CardContent>
              </Card>
              <Card className="shadow-md">
                <CardContent className="space-y-4 p-6">
                  <h2 className="text-lg font-serif font-semibold mb-2 text-navy-800">Payment</h2>
                  {isAddressValid && !showAddressModal && (
                    <div className="mt-4" ref={paypalRef}></div>
                  )}
                </CardContent>
              </Card>
              {/* Remove the payment method radio group and all references to 'payment' state.
              // Remove the Place Order button for non-PayPal methods.
              // Only PayPal Buttons are shown for payment. */}
            </form>
          </div>
        </div>
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogTitle>Order Placed!</DialogTitle>
            <p>Thank you for your purchase. Your order has been placed successfully.</p>
            <Button onClick={() => navigate('/orders')}>View Orders</Button>
          </DialogContent>
        </Dialog>
        <Dialog open={showCancellation} onOpenChange={setShowCancellation}>
          <DialogContent className="border-white bg-white">
            <DialogTitle className="text-gray-950 flex items-center gap-2 mx-auto">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
              Payment Cancelled
            </DialogTitle>
            <p className="text-gray-950">Your payment was cancelled. You can try again or return to your cart to review your items.</p>
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCancellation(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Try Again
              </Button>
              <Button 
                onClick={() => navigate('/cart')}
                className="bg-gray-800 hover:bg-gray-900 text-white"
              >
                Return to Cart
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Address Change Modal */}
        <Dialog open={showAddressModal} onOpenChange={setShowAddressModal}>
          <DialogContent>
            <h2 className="text-lg font-bold mb-2">Change Shipping Address</h2>
            {addressesLoading ? (
              <div>Loading addresses...</div>
            ) : addresses?.data?.length ? (
              <div className="space-y-4">
                {addresses.data.map((addr: any) => (
                  <div
                    key={addr.id}
                    className={`border rounded p-3 cursor-pointer ${selectedAddress && selectedAddress.id === addr.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}
                    onClick={() => setSelectedAddress(addr)}
                  >
                    <div className="font-medium">{addr.first_name} {addr.last_name}</div>
                    <div>{addr.address_line_1}{addr.address_line_2 ? `, ${addr.address_line_2}` : ''}</div>
                    <div>{addr.city}, {addr.state} {addr.postal_code}</div>
                    <div>{addr.country}</div>
                    {addr.phone && (
                      <div className="text-blue-600 font-medium text-sm">
                        📞 {addr.phone}
                      </div>
                    )}
                    {addr.is_default && <div className="text-xs text-navy-500">(Default)</div>}
                  </div>
                ))}
              </div>
            ) : (
              <div>No saved addresses found.</div>
            )}
            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddressModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={() => setShowAddressModal(false)} disabled={!selectedAddress}>Use this address</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout; 