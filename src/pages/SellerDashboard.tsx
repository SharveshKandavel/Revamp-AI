
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  PlusCircle,
  Edit,
  Trash,
  Search,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Product, Order } from "@/types/database";

const SellerDashboardContent = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "CPU",
    price: "",
    stock: "",
  });

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await Promise.all([fetchProducts(), fetchOrders()]);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setProducts(data || []);
  };

  const fetchOrders = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.warn("Orders table might be missing:", error.message);
      // We don't throw here to allow products to still show
      return;
    }
    setOrders(data || []);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({ name: "", category: "CPU", price: "", stock: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      toast({ title: "Missing fields", variant: "destructive" });
      return;
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      seller_id: user?.id,
      image_url: "/placeholder.svg"
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        toast({ title: "Product updated" });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
        toast({ title: "Product added" });
      }
      await fetchProducts();
      setIsDialogOpen(false);
    } catch (err: any) {
      toast({ title: "Action failed", description: err.message, variant: "destructive" });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Product deleted" });
      setProducts(products.filter(p => p.id !== id));
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      
      if (error) throw error;
      toast({ title: "Order status updated" });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    }
  };

  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-red-100 shadow-lg">
            <CardHeader className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-xl">Dashboard Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={loadInitialData} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry Loading
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const salesData = [
    { name: 'Jan', sales: 42000 },
    { name: 'Feb', sales: 35000 },
    { name: 'Mar', sales: 58000 },
    { name: 'Apr', sales: 49000 },
    { name: 'May', sales: 62000 },
    { name: 'Jun', sales: 74000 },
  ];

  const revenue = products.reduce((acc, p) => acc + (p.price * p.stock), 0) / 10;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="mb-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-tech-dark mb-4">
              Seller Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Manage your PC parts inventory and track your sales performance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatsCard title="Total Products" value={products.length} icon={<Package className="h-8 w-8 text-tech-purple" />} change="+5%" />
            <StatsCard title="Active Orders" value={orders.length} icon={<ShoppingCart className="h-8 w-8 text-tech-green" />} change="+12%" />
            <StatsCard title="Active Customers" value={847} icon={<Users className="h-8 w-8 text-tech-blue" />} change="+18%" />
            <StatsCard title="Revenue" value={`$${revenue.toLocaleString()}`} icon={<TrendingUp className="h-8 w-8 text-tech-accent" />} change="+3%" />
          </div>

          <Tabs defaultValue="products" className="mb-10">
            <TabsList className="mb-6 bg-white/40 backdrop-blur-md p-1 rounded-xl">
              <TabsTrigger value="products" className="rounded-lg">My Products</TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-lg">Analytics</TabsTrigger>
              <TabsTrigger value="orders" className="rounded-lg">Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <Card className="glass-card border-none shadow-xl">
                <CardHeader>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>Manage your PC parts and components inventory</CardDescription>
                  <div className="flex justify-between items-center mt-4">
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        className="pl-8 bg-white/20 border-white/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleOpenAdd} className="ml-4 bg-tech-dark hover:bg-black text-white rounded-full px-6">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-12">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-tech-purple mb-2" />
                      <p className="text-muted-foreground">Fetching inventory...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-4 px-2">Product</th>
                            <th className="text-left py-4 px-2">Category</th>
                            <th className="text-left py-4 px-2">Price</th>
                            <th className="text-left py-4 px-2">Stock</th>
                            <th className="text-left py-4 px-2">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((product) => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                              <td className="py-4 px-2">
                                <div className="flex items-center">
                                  <img src={product.image_url} alt={product.name} className="w-10 h-10 mr-3 rounded-md object-cover" />
                                  <span>{product.name}</span>
                                </div>
                              </td>
                              <td className="py-4 px-2">{product.category}</td>
                              <td className="py-4 px-2">${product.price.toLocaleString()}</td>
                              <td className="py-4 px-2">
                                <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                                  {product.stock} units
                                </Badge>
                              </td>
                              <td className="py-4 px-2">
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(product)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteProduct(product.id)}>
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {filteredProducts.length === 0 && (
                        <p className="text-center py-8 text-muted-foreground">No products found in your inventory.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                  <CardDescription>View your sales performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Sales']} />
                        <Bar dataKey="sales" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Manage and track your incoming orders</CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="flex items-center justify-center p-12">
                      <div className="text-center">
                        <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No orders yet</h3>
                        <p className="mt-2 text-sm text-muted-foreground">Your real orders will appear here once received.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-4 px-2">Order ID</th>
                            <th className="text-left py-4 px-2">Customer</th>
                            <th className="text-left py-4 px-2">Total</th>
                            <th className="text-left py-4 px-2">Status</th>
                            <th className="text-left py-4 px-2">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id} className="border-b">
                              <td className="py-4 px-2 font-medium">{order.id}</td>
                              <td className="py-4 px-2">{order.customer_name}</td>
                              <td className="py-4 px-2">${order.total_price.toLocaleString()}</td>
                              <td className="py-4 px-2">
                                <Badge className={getStatusColor(order.status)}>
                                  {order.status}
                                </Badge>
                              </td>
                              <td className="py-4 px-2">
                                <Select value={order.status} onValueChange={(val: Order['status']) => handleUpdateOrderStatus(order.id, val)}>
                                  <SelectTrigger className="h-8 w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Processing">Processing</SelectItem>
                                    <SelectItem value="Shipped">Shipped</SelectItem>
                                    <SelectItem value="Delivered">Delivered</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[425px] glass-card border-none shadow-2xl rounded-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold tracking-tight text-tech-dark dark:text-white">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                <DialogDescription className="font-medium text-gray-500">Configure component metadata for the hardware catalog.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-gray-400">Product Designation</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-white/20 border-white/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs font-black uppercase tracking-widest text-gray-400">Inventory Category</Label>
                  <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                    <SelectTrigger className="bg-white/20 border-white/20">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-none">
                      <SelectItem value="CPU">CPU</SelectItem>
                      <SelectItem value="GPU">GPU</SelectItem>
                      <SelectItem value="Motherboard">Motherboard</SelectItem>
                      <SelectItem value="RAM">RAM</SelectItem>
                      <SelectItem value="Storage">Storage</SelectItem>
                      <SelectItem value="Power Supply">Power Supply</SelectItem>
                      <SelectItem value="Case">Case</SelectItem>
                      <SelectItem value="Monitor">Monitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-xs font-black uppercase tracking-widest text-gray-400">Valuation ($)</Label>
                    <Input id="price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="bg-white/20 border-white/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-xs font-black uppercase tracking-widest text-gray-400">Inventory Count</Label>
                    <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="bg-white/20 border-white/20" />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full bg-tech-dark hover:bg-black text-white rounded-full h-12 font-black uppercase tracking-widest text-xs">
                    {editingProduct ? "Update Designation" : "Commit to Inventory"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const StatsCard = ({ title, value, icon, change }: { title: string, value: string | number, icon: React.ReactNode, change: string }) => (
  <Card className="glass-card border-none shadow-lg glass-card-hover">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-400">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-black text-tech-dark dark:text-white">{value}</div>
      <p className="text-[10px] font-black uppercase tracking-widest text-green-500 flex items-center mt-2">
        {change}
        <TrendingUp className="h-3 w-3 ml-1" />
      </p>
    </CardContent>
  </Card>
);

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'Delivered': return "bg-green-100 text-green-800";
    case 'Shipped': return "bg-blue-100 text-blue-800";
    case 'Processing': return "bg-amber-100 text-amber-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const SellerDashboard = () => {
  return (
    <SellerDashboardContent />
  );
};

export default SellerDashboard;
