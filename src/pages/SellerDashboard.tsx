
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
  Upload, 
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

const initialProducts = [
  { id: 1, name: "AMD Ryzen 7 5800X", category: "CPU", price: 24999, stock: 15, image: "/placeholder.svg" },
  { id: 2, name: "NVIDIA RTX 3080", category: "GPU", price: 69999, stock: 8, image: "/placeholder.svg" },
  { id: 3, name: "Samsung 970 EVO 1TB", category: "Storage", price: 9999, stock: 24, image: "/placeholder.svg" },
  { id: 4, name: "Corsair Vengeance 32GB", category: "RAM", price: 12999, stock: 30, image: "/placeholder.svg" },
  { id: 5, name: "NZXT H510 Elite", category: "Case", price: 8999, stock: 12, image: "/placeholder.svg" },
];

const initialOrders = [
  { id: "ORD-001", customer: "Rahul Sharma", date: "2024-05-15", status: "Processing", total: 125000, items: ["AMD Ryzen 7", "NVIDIA RTX 3080"] },
  { id: "ORD-002", customer: "Priya Patel", date: "2024-05-14", status: "Shipped", total: 45000, items: ["Samsung 970 EVO", "Corsair RAM"] },
  { id: "ORD-003", customer: "Amit Kumar", date: "2024-05-12", status: "Delivered", total: 8999, items: ["NZXT H510 Elite"] },
];

const SellerDashboardContent = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("seller_products");
    return saved ? JSON.parse(saved) : initialProducts;
  });
  
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("seller_orders");
    return saved ? JSON.parse(saved) : initialOrders;
  });

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
    localStorage.setItem("seller_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("seller_orders", JSON.stringify(orders));
  }, [orders]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (editingProduct) {
      setProducts(products.map((p: any) => 
        p.id === editingProduct.id 
          ? { ...p, ...formData, price: Number(formData.price), stock: Number(formData.stock) } 
          : p
      ));
      toast({ title: "Product updated", description: "Successfully updated product details" });
    } else {
      const newProduct = {
        id: Date.now(),
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: "/placeholder.svg",
      };
      setProducts([newProduct, ...products]);
      toast({ title: "Product added", description: "New product added to inventory" });
    }
    setIsDialogOpen(false);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product: any) => product.id !== id));
    toast({
      title: "Product deleted",
      description: "The product has been removed from your inventory",
    });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map((o: any) => o.id === orderId ? { ...o, status: newStatus } : o));
    toast({ title: "Order Updated", description: `Order ${orderId} is now ${newStatus}` });
  };

  const simulateNewOrder = () => {
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: ["John Doe", "Jane Smith", "Bob Wilson", "Alice Brown"][Math.floor(Math.random() * 4)],
      date: new Date().toISOString().split('T')[0],
      status: "Pending",
      total: Math.floor(5000 + Math.random() * 200000),
      items: ["Custom PC Build"]
    };
    setOrders([newOrder, ...orders]);
    toast({ title: "New Order Received!", description: `Incoming order from ${newOrder.customer}` });
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
    { title: "Total Orders", value: orders.length, icon: <ShoppingCart className="h-8 w-8 text-tech-green" />, change: "+12%" },
    { title: "Active Customers", value: 847, icon: <Users className="h-8 w-8 text-tech-blue" />, change: "+18%" },
    { title: "Revenue", value: `₹${orders.reduce((acc: number, o: any) => acc + o.total, 0).toLocaleString()}`, icon: <TrendingUp className="h-8 w-8 text-tech-accent" />, change: "+3%" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header userType="seller" />
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
                                  src={product.image} 
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
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Order Management</CardTitle>
                      <CardDescription>Track and process your customer orders</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={simulateNewOrder}>
                      Simulate Incoming Order
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-sm">
                          <th className="text-left py-4 px-2">Order ID</th>
                          <th className="text-left py-4 px-2">Customer</th>
                          <th className="text-left py-4 px-2">Items</th>
                          <th className="text-left py-4 px-2">Total</th>
                          <th className="text-left py-4 px-2">Status</th>
                          <th className="text-left py-4 px-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order: any) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50 text-sm">
                            <td className="py-4 px-2 font-medium">{order.id}</td>
                            <td className="py-4 px-2">{order.customer}</td>
                            <td className="py-4 px-2 max-w-[200px] truncate">{order.items.join(", ")}</td>
                            <td className="py-4 px-2">₹{order.total.toLocaleString()}</td>
                            <td className="py-4 px-2">
                              <Badge className={
                                order.status === "Delivered" ? "bg-green-100 text-green-800" :
                                order.status === "Shipped" ? "bg-blue-100 text-blue-800" :
                                order.status === "Processing" ? "bg-amber-100 text-amber-800" :
                                "bg-gray-100 text-gray-800"
                              }>
                                {order.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-2">
                              <Select 
                                value={order.status} 
                                onValueChange={(val) => handleUpdateOrderStatus(order.id, val)}
                              >
                                <SelectTrigger className="h-8 w-[120px]">
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
                  {orders.length === 0 && (
                    <div className="text-center py-12">
                      <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                      <p className="mt-4 text-muted-foreground">No orders found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload Products</CardTitle>
              <CardDescription>
                Add new products to your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">Drag and drop files</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Or browse to choose files
                </p>
                <Button className="mt-6 bg-tech-purple hover:bg-tech-purple/90">
                  Browse files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Wrap the dashboard with BuildProvider to ensure context is available
const SellerDashboard = () => {
  return (
    <BuildProvider>
      <SellerDashboardContent />
    </BuildProvider>
  );
};

export default SellerDashboard;
