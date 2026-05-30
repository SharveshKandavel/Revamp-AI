
import React, { useState, useEffect } from "react";
import { BuildProvider } from "@/contexts/BuildContext";
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
  Search
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

const SellerDashboardContent = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "CPU",
    price: "",
    stock: "",
  });

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchOrders();
    }
  }, [user]);

  const fetchProducts = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (error) toast({ title: "Error fetching products", description: error.message, variant: "destructive" });
    else setProducts(data || []);
    setLoading(false);
  };

  const fetchOrders = async () => {
    // Note: In a full system, orders would have a join with products/sellers
    // For this portfolio version, we'll simulate orders or read from a mock table
    const { data } = await supabase.from('orders').select('*').limit(10);
    setOrders(data || []);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({ name: "", category: "CPU", price: "", stock: "" });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (product: any) => {
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

    if (editingProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);
      
      if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
      else {
        toast({ title: "Product updated" });
        fetchProducts();
        setIsDialogOpen(false);
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);
      
      if (error) toast({ title: "Insert failed", description: error.message, variant: "destructive" });
      else {
        toast({ title: "Product added" });
        fetchProducts();
        setIsDialogOpen(false);
      }
    }
  };

  const handleDeleteProduct = async (id: number) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Product deleted" });
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter((product: any) => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const salesData = [
    { name: 'Jan', sales: 42000 },
    { name: 'Feb', sales: 35000 },
    { name: 'Mar', sales: 58000 },
    { name: 'Apr', sales: 49000 },
    { name: 'May', sales: 62000 },
    { name: 'Jun', sales: 74000 },
  ];

  const statsCards = [
    { title: "Total Products", value: products.length, icon: <Package className="h-8 w-8 text-tech-purple" />, change: "+5%" },
    { title: "Active Orders", value: orders.length, icon: <ShoppingCart className="h-8 w-8 text-tech-green" />, change: "+12%" },
    { title: "Active Customers", value: 847, icon: <Users className="h-8 w-8 text-tech-blue" />, change: "+18%" },
    { title: "Revenue", value: `₹${(products.reduce((acc, p) => acc + (p.price * p.stock), 0) / 10).toLocaleString()}`, icon: <TrendingUp className="h-8 w-8 text-tech-accent" />, change: "+3%" },
  ];

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
            {statsCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover-scale">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                    {card.icon}
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      {card.change}
                      <TrendingUp className="h-4 w-4 ml-1" />
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Tabs defaultValue="products" className="mb-10">
            <TabsList className="mb-6">
              <TabsTrigger value="products">My Products</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>
                    Manage your PC parts and components inventory
                  </CardDescription>
                  <div className="flex justify-between items-center mt-4">
                    <div className="relative w-full max-w-sm">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search products..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={handleOpenAdd} 
                          className="ml-4 bg-tech-purple hover:bg-tech-purple/90"
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                          <DialogDescription>
                            Enter the details of the PC component here.
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">Category</Label>
                            <Select 
                              value={formData.category} 
                              onValueChange={(val) => setFormData({ ...formData, category: val })}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
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
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Price (₹)</Label>
                            <Input
                              id="price"
                              type="number"
                              value={formData.price}
                              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stock" className="text-right">Stock</Label>
                            <Input
                              id="stock"
                              type="number"
                              value={formData.stock}
                              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                              className="col-span-3"
                            />
                          </div>
                          <DialogFooter>
                            <Button type="submit">{editingProduct ? "Save Changes" : "Add Product"}</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
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
                        {filteredProducts.map((product: any) => (
                          <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="py-4 px-2">
                              <div className="flex items-center">
                                <img 
                                  src={product.image_url || "/placeholder.svg"} 
                                  alt={product.name} 
                                  className="w-10 h-10 mr-3 rounded-md object-cover" 
                                />
                                <span>{product.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-2">{product.category}</td>
                            <td className="py-4 px-2">₹{product.price.toLocaleString()}</td>
                            <td className="py-4 px-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                product.stock > 10 ? 'bg-green-100 text-green-800' : 
                                product.stock > 5 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}>
                                {product.stock} units
                              </span>
                            </td>
                            <td className="py-4 px-2">
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(product)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {loading && <p className="text-center py-4">Loading inventory...</p>}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                  <CardDescription>
                    View your sales performance over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={salesData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Sales']}
                        />
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
                  <CardDescription>
                    Manage and track your incoming orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                      <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">Connect Orders Table</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Your real orders from the Supabase database will appear here.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const SellerDashboard = () => {
  return (
    <BuildProvider>
      <SellerDashboardContent />
    </BuildProvider>
  );
};

export default SellerDashboard;
