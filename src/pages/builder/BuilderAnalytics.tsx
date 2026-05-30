import React from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, Package, Users, Clock, Star } from "lucide-react";

const BuilderAnalytics = () => {
  const [stats, setStats] = React.useState({
    totalBuilds: 0,
    totalRevenue: 0,
    recentBuilds: []
  });

  React.useEffect(() => {
    const savedBuilds = JSON.parse(localStorage.getItem("saved_builds") || "[]");
    const revenue = savedBuilds.reduce((acc: number, b: any) => acc + (b.price || b.totalPrice || 0), 0);
    
    setStats({
      totalBuilds: savedBuilds.length,
      totalRevenue: revenue,
      recentBuilds: savedBuilds.slice(0, 5)
    });
  }, []);

  // Combined data for charts
  const buildStats = [
    { month: "Jan", builds: 4, revenue: 67500 },
    { month: "Feb", builds: 2, revenue: 78000 },
    { month: "Mar", builds: 3, revenue: 72000 },
    { month: "Apr", builds: 5, revenue: 91500 },
    { month: "May", builds: 6, revenue: 82500 },
    { month: "Jun", builds: stats.totalBuilds || 4, revenue: stats.totalRevenue || 100500 }
  ];

  const categoryData = [
    { name: "Gaming", value: 45, color: "#8b5cf6" },
    { name: "Workstation", value: 25, color: "#3b82f6" },
    { name: "Office", value: 20, color: "#10b981" },
    { name: "Budget", value: 10, color: "#f59e0b" }
  ];

  const performanceMetrics = [
    { metric: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, change: "+12%" },
    { metric: "Active Projects", value: stats.totalBuilds.toString(), change: "+5%" },
    { metric: "Client Growth", value: "96%", change: "+3%" },
    { metric: "Avg. Satisfaction", value: "4.9/5", change: "+2%" }
  ];

  const recentBuildsList = stats.recentBuilds.length > 0 ? stats.recentBuilds : [
    { id: "B001", title: "Ultimate Gaming", author: "John Doe", performance: "High-End", price: 185000, status: "Completed", rating: 5 },
    { id: "B002", title: "Office Workstation", author: "Sarah Wilson", performance: "Mid-Range", price: 125000, status: "In Progress", rating: null },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your performance and gain insights into your PC building business
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceMetrics.map((metric, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription className="text-sm font-medium">{metric.metric}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <Badge 
                    variant={metric.change.startsWith('+') ? "default" : "secondary"}
                    className={metric.change.startsWith('+') ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                  >
                    {metric.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="builds">Build Analytics</TabsTrigger>
            <TabsTrigger value="performance">Revenue</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-tech-purple" />
                    Build Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={buildStats}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="builds" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-tech-blue" />
                    Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="builds" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Build Projects</CardTitle>
                <CardDescription>Your recent PC build projects and their current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBuildsList.map((build: any) => (
                    <div key={build.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-tech-purple/10 flex items-center justify-center text-tech-purple">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium">{build.title || build.client}</div>
                          <div className="text-sm text-muted-foreground">
                            {build.performance || build.type} Build • ₹{(build.price || build.totalPrice || build.budget).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {build.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{build.rating}</span>
                          </div>
                        )}
                        <Badge 
                          variant={build.status === "Completed" ? "default" : "secondary"}
                          className={build.status === "Completed" ? "bg-green-100 text-green-800" : ""}
                        >
                          {build.status || "Planned"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {recentBuildsList.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                      <p className="text-muted-foreground">No build data available yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-tech-green" />
                  Monthly Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={buildStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      dot={{ r: 6, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BuilderAnalytics;