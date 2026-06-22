
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Monitor, Clock, CheckCircle2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Build } from "@/types/database";
import { toast } from "sonner";

const RecentBuilds = () => {
  const { user } = useAuth();
  const [builds, setBuilds] = useState<Build[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecentBuilds();
    }
  }, [user]);

  const fetchRecentBuilds = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('builds')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setBuilds(data || []);
    } catch (err: any) {
      console.error("Error fetching builds:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: number, currentPerformance: string) => {
    // In this simplified schema, we use 'performance' to denote status for demo purposes
    // or we could add a 'status' column to the builds table.
    // For now, let's just show a toast as it's a "Project Management" demo
    toast.info("Status updates for builds are coming in the next version!", {
      description: "Build logic is currently read-only."
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[200px]">
          <RefreshCw className="w-8 h-8 animate-spin text-tech-purple mb-2" />
          <p className="text-sm text-muted-foreground">Syncing projects...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-tech-purple" />
          Recent Build Projects
        </CardTitle>
        <CardDescription>Your latest PC configurations from the cloud</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {builds.map((build) => (
            <div
              key={build.id}
              onClick={() => toggleStatus(build.id, build.performance)}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:border-tech-purple transition-colors cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h3 className="font-medium flex items-center gap-2 line-clamp-1">
                    {build.title}
                    <Badge variant="secondary" className="bg-purple-50 text-tech-purple border-purple-100">
                      {build.performance}
                    </Badge>
                  </h3>
                  <p className="text-xs text-gray-500">
                    Created {new Date(build.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="font-bold text-tech-dark">${build.total_price.toLocaleString()}</div>
            </div>
          ))}
          
          {builds.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No recent builds found.</p>
              <Badge variant="outline" className="mt-2">Start a new build to see it here</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentBuilds;
