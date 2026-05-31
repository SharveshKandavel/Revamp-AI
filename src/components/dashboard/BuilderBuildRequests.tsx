
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardList, Clock, CheckCircle2, RefreshCw, User, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Order } from "@/types/database";
import { toast } from "sonner";

const BuilderBuildRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBuildRequests();
    }
  }, [user]);

  const fetchBuildRequests = async () => {
    setIsLoading(true);
    try {
      // Fetch both unassigned requests and requests assigned to this builder
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`seller_id.eq.${user?.id},seller_id.eq.00000000-0000-0000-0000-000000000000`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err: any) {
      console.error("Error fetching requests:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          seller_id: user?.id,
          status: 'Processing'
        })
        .eq('id', orderId);

      if (error) throw error;
      
      toast.success("Build request accepted!", {
        description: "The client has been notified that you are handling their build."
      });
      fetchBuildRequests();
    } catch (err: any) {
      toast.error("Failed to accept request");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[250px]">
          <RefreshCw className="w-8 h-8 animate-spin text-tech-blue mb-2" />
          <p className="text-sm text-muted-foreground">Checking for build requests...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-tech-blue" />
              Incoming Build Requests
            </CardTitle>
            <CardDescription>Professional assembly requests from clients</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchBuildRequests}>
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">{request.id}</Badge>
                  <Badge className={
                    request.status === 'Pending' ? "bg-amber-100 text-amber-800" :
                    request.status === 'Processing' ? "bg-blue-100 text-blue-800" :
                    "bg-green-100 text-green-800"
                  }>
                    {request.status}
                  </Badge>
                </div>
                <div className="font-bold text-tech-dark text-lg">
                  ₹{request.total_price.toLocaleString()}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{request.customer_name}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-500">
                  <Package className="w-4 h-4 mt-0.5" />
                  <span className="line-clamp-2">{request.items.join(', ')}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                {request.seller_id === "00000000-0000-0000-0000-000000000000" ? (
                  <Button 
                    className="w-full bg-tech-blue hover:bg-tech-blue/90"
                    onClick={() => handleAcceptRequest(request.id)}
                  >
                    Accept Build Request
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Already Assigned
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {requests.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-tech-blue" />
              </div>
              <p className="text-sm font-medium">No pending requests at the moment.</p>
              <p className="text-xs text-muted-foreground mt-1">We'll notify you when new clients request an assembly.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BuilderBuildRequests;
