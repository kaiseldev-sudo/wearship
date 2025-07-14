import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent } from '../components/ui/dialog';
import { toast } from '../components/ui/use-toast';
import { useUserAddresses } from '../hooks/useUser';

const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const Checkout: React.FC = () => {
  const { cart, totals, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    name: '',
    street: '',
    city: '',
    zip: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);

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

  // Helper: is address valid?
  const isAddressValid = !!defaultAddress || (
    address.name && address.street && address.city && address.zip && address.country
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
              if (totals?.total !== undefined && totals?.total !== null) {
                if (typeof totals.total === 'string') {
                  value = totals.total;
                } else if (typeof totals.total === 'number') {
                  value = Number(totals.total).toFixed(2);
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
              });
            },
            onApprove: (data: any, actions: any) => {
              return actions.order.capture().then(() => {
                setShowConfirmation(true);
                clearCart();
              });
            },
            onError: (err: any) => {
              toast({ title: 'PayPal payment failed', description: err?.message || 'Please try again.' });
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
  }, [isAddressValid, totals?.total]);

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
                {!cart || !cart.items || cart.items.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  <ul className="mb-6 divide-y divide-cream-200">
                    {cart.items.map((item) => {
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
                    <span>${formatPrice(totals?.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${formatPrice(totals?.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{totals?.free_shipping_eligible ? <span className="text-green-600 font-medium">FREE</span> : `$${formatPrice(totals?.shipping)}`}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-3 mt-3 text-lg">
                    <span>Total:</span>
                    <span>${formatPrice(totals?.total)}</span>
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
                  ) : defaultAddress ? (
                    <div className="bg-cream-100 rounded-lg p-4 border border-cream-200">
                      <div className="font-medium text-navy-800 mb-1">
                        {defaultAddress.first_name} {defaultAddress.last_name}
                      </div>
                      <div>{defaultAddress.address_line_1}{defaultAddress.address_line_2 ? `, ${defaultAddress.address_line_2}` : ''}</div>
                      <div>{defaultAddress.city}, {defaultAddress.state} {defaultAddress.postal_code}</div>
                      <div>{defaultAddress.country}</div>
                      <div className="mt-2 text-xs text-navy-500">(Default Shipping Address)</div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={address.name} onChange={handleInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Input id="street" name="street" value={address.street} onChange={handleInputChange} required />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" name="city" value={address.city} onChange={handleInputChange} required />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="zip">ZIP</Label>
                          <Input id="zip" name="zip" value={address.zip} onChange={handleInputChange} required />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" name="country" value={address.country} onChange={handleInputChange} required />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card className="shadow-md -z-50">
                <CardContent className="space-y-4 p-6">
                  <h2 className="text-lg font-serif font-semibold mb-2 text-navy-800">Payment</h2>
                  {isAddressValid && (
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
            <h2 className="text-xl font-bold mb-2">Order Placed!</h2>
            <p>Thank you for your purchase. Your order has been placed successfully.</p>
            <Button onClick={() => navigate('/orders')}>View Orders</Button>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout; 