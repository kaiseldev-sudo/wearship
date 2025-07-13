
import React from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Package } from "lucide-react";

// Sample order data (in a real app, this would come from the database)
const sampleOrders = [
  {
    id: "ORD-001-2025",
    date: "April 2, 2025",
    status: "delivered",
    items: [
      { id: 1, name: "Classic White T-Shirt", quantity: 2, price: 29.99 },
      { id: 2, name: "Navy Blue Slim Fit Jeans", quantity: 1, price: 59.99 }
    ],
    total: 119.97
  },
  {
    id: "ORD-002-2025",
    date: "March 28, 2025",
    status: "processing",
    items: [
      { id: 3, name: "Gray Hoodie", quantity: 1, price: 49.99 }
    ],
    total: 49.99
  }
];

const Orders = () => {
  // Use the improved hook with default options (will redirect to login if not authenticated)
  const { user } = useRequireAuth();
  const { toast } = useToast();
  
  const getStatusColor = (status) => {
    switch(status) {
      case "delivered":
        return "bg-green-500";
      case "processing":
        return "bg-amber-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex-grow">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-navy-800">My Orders</h1>
          
          {sampleOrders.length > 0 ? (
            <div className="space-y-8">
              {sampleOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-muted/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Package size={20} />
                          Order #{order.id}
                        </CardTitle>
                        <CardDescription>Placed on {order.date}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm text-muted-foreground">Items</h3>
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
                                <td className="py-3">{item.name}</td>
                                <td className="py-3 text-center">{item.quantity}</td>
                                <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-medium">Total</span>
                        <span className="font-bold">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
