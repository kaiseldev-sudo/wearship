
import React, { useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { Package, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { useUserOrders } from "@/hooks/useOrders";

const Orders = () => {
  // Use the improved hook with default options (will redirect to login if not authenticated)
  const { user } = useRequireAuth();
  const { toast } = useToast();
  
  // State to track which orders are expanded
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
  
  // Fetch user orders from database
  const { data: ordersResponse, isLoading, error } = useUserOrders(user?.id);
  const orders = ordersResponse?.data || [];
  
  // Toggle order expansion
  const toggleOrder = (orderId: number) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case "delivered":
        return "bg-green-500";
      case "shipped":
        return "bg-blue-500";
      case "processing":
        return "bg-amber-500";
      case "confirmed":
        return "bg-blue-500";
      case "pending":
        return "bg-gray-500";
      case "cancelled":
        return "bg-red-500";
      case "refunded":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-navy-800">My Orders</h1>
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
              <span className="ml-2 text-navy-600">Loading orders...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-grow">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-navy-800">My Orders</h1>
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">Error loading orders</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  There was an error loading your orders. Please try again later.
                </p>
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
          <h1 className="text-3xl font-bold mb-8 text-navy-800">My Orders</h1>
          
          {orders.length > 0 ? (
            <div className="space-y-8">
              {orders.map((order) => (
                <Collapsible 
                  key={order.id} 
                  open={expandedOrders.has(order.id)}
                  onOpenChange={() => toggleOrder(order.id)}
                >
                  <Card className="overflow-hidden">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {expandedOrders.has(order.id) ? (
                              <ChevronDown size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                            ) : (
                              <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                            )}
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Package size={20} />
                          Order #{order.order_number}
                        </CardTitle>
                        <CardDescription>Placed on {formatDate(order.created_at)}</CardDescription>
                      </div>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <div className="text-sm font-medium text-muted-foreground">
                              ${parseFloat(order.total_amount).toFixed(2)}
                            </div>
                            <div className="flex gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                          {order.payment_status === 'paid' ? 'Paid' : 'Payment Pending'}
                        </Badge>
                            </div>
                      </div>
                    </div>
                  </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground">Items</h3>
                        {order.items && order.items.length > 0 ? (
                          <table className="w-full">
                            <thead className="text-xs text-muted-foreground border-b">
                              <tr>
                                <th className="text-left pb-2">Product</th>
                                <th className="text-center pb-2">Quantity</th>
                                <th className="text-right pb-2">Price</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {order.items.map((item) => (
                                <tr key={item.id} className="text-sm">
                                  <td className="py-3">{item.product_name}</td>
                                  <td className="py-3 text-center">{item.quantity}</td>
                                  <td className="py-3 text-right">${parseFloat(item.unit_price).toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p className="text-sm text-muted-foreground">No items found</p>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">${parseFloat(order.total_amount).toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                    </CollapsibleContent>
                </Card>
                </Collapsible>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No orders yet</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  When you place an order, it will appear here for you to track.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;
