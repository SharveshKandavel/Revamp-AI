import React, { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Plus, Phone, Mail, Star, DollarSign, Package } from "lucide-react";
import { toast } from "sonner";

const initialClients = [
  {
    id: "C001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+91 98765 43210",
    avatar: null,
    totalBuilds: 3,
    totalSpent: 245000,
    lastBuild: "2024-01-15",
    status: "Active",
    rating: 4.8,
    preferredBudget: "₹80,000 - ₹1,00,000",
    buildType: "Gaming"
  },
  {
    id: "C002", 
    name: "Sarah Wilson",
    email: "sarah.wilson@company.com",
    phone: "+91 87654 32109",
    avatar: null,
    totalBuilds: 2,
    totalSpent: 180000,
    lastBuild: "2024-01-10",
    status: "Active",
    rating: 5.0,
    preferredBudget: "₹1,20,000+",
    buildType: "Workstation"
  },
  {
    id: "C003",
    name: "Mike Johnson", 
    email: "mike.j@email.com",
    phone: "+91 76543 21098",
    avatar: null,
    totalBuilds: 1,
    totalSpent: 45000,
    lastBuild: "2023-12-20",
    status: "Inactive",
    rating: 4.2,
    preferredBudget: "₹40,000 - ₹60,000",
    buildType: "Budget"
  },
  {
    id: "C004",
    name: "Lisa Chen",
    email: "lisa.chen@email.com", 
    phone: "+91 65432 10987",
    avatar: null,
    totalBuilds: 4,
    totalSpent: 320000,
    lastBuild: "2024-01-20",
    status: "VIP",
    rating: 4.9,
    preferredBudget: "₹75,000 - ₹95,000",
    buildType: "Gaming"
  },
  {
    id: "C005",
    name: "David Kumar",
    email: "david.kumar@startup.com",
    phone: "+91 54321 09876", 
    avatar: null,
    totalBuilds: 1,
    totalSpent: 85000,
    lastBuild: "2024-01-08",
    status: "Active",
    rating: 4.5,
    preferredBudget: "₹80,000 - ₹1,00,000",
    buildType: "Office"
  }
];

const BuilderClients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState(initialClients);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  // New Client Form State
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    buildType: "Gaming",
    preferredBudget: "₹40,000 - ₹60,000"
  });

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) {
      toast.error("Name and Email are required");
      return;
    }

    const client = {
      id: `C${String(clients.length + 1).padStart(3, '0')}`,
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone || "N/A",
      avatar: null,
      totalBuilds: 0,
      totalSpent: 0,
      lastBuild: new Date().toISOString().split('T')[0],
      status: "Active",
      rating: 0,
      preferredBudget: newClient.preferredBudget,
      buildType: newClient.buildType
    };

    setClients([client, ...clients]);
    setIsAddClientOpen(false);
    setNewClient({
      name: "",
      email: "",
      phone: "",
      buildType: "Gaming",
      preferredBudget: "₹40,000 - ₹60,000"
    });
    toast.success("Client added successfully!");
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP": return "bg-purple-100 text-purple-800";
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const ClientCard = ({ client }: { client: typeof clients[0] }) => (
    <Card className={`hover:shadow-lg transition-shadow ${client.status === 'VIP' ? 'border-purple-200' : ''} ${client.status === 'Inactive' ? 'opacity-75' : ''}`}>
      <CardHeader className={`pb-4 ${client.status === 'VIP' ? 'bg-purple-50' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className={`w-12 h-12 ${client.status === 'VIP' ? 'ring-2 ring-purple-200' : ''}`}>
              <AvatarImage src={client.avatar || ""} />
              <AvatarFallback className={client.status === 'VIP' ? 'bg-purple-100' : ''}>
                {client.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{client.name}</CardTitle>
              <CardDescription>{client.email}</CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(client.status)}>
            {client.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{client.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{client.rating}/5.0</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted-foreground" />
            <span>{client.totalBuilds} builds</span>
          </div>
          <div className="flex items-center gap-2">  
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span>₹{client.totalSpent.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Preferred Type:</span>
            <span className="font-medium">{client.buildType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Budget Range:</span>
            <span className="font-medium">{client.preferredBudget}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Build:</span>
            <span className="font-medium">{new Date(client.lastBuild).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Mail className="w-4 h-4 mr-2" />
            {client.status === 'VIP' ? 'Priority Contact' : client.status === 'Inactive' ? 'Re-engage' : 'Contact'}
          </Button>
          <Button size="sm" className="flex-1">
            {client.status === 'VIP' ? 'VIP Details' : client.status === 'Inactive' ? 'View History' : 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Client Management
            </h1>
            <p className="text-muted-foreground">
              Manage your PC building clients and their projects
            </p>
          </div>
          
          <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add New Client
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Enter the details of your new client below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="buildType" className="text-right">
                    Type
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={newClient.buildType}
                      onValueChange={(value) => setNewClient({ ...newClient, buildType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select build type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gaming">Gaming</SelectItem>
                        <SelectItem value="Workstation">Workstation</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Budget">Budget</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="budget" className="text-right">
                    Budget
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={newClient.preferredBudget}
                      onValueChange={(value) => setNewClient({ ...newClient, preferredBudget: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under ₹40,000">Under ₹40,000</SelectItem>
                        <SelectItem value="₹40,000 - ₹60,000">₹40,000 - ₹60,000</SelectItem>
                        <SelectItem value="₹60,000 - ₹80,000">₹60,000 - ₹80,000</SelectItem>
                        <SelectItem value="₹80,000 - ₹1,00,000">₹80,000 - ₹1,00,000</SelectItem>
                        <SelectItem value="₹1,00,000+">₹1,00,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddClient}>Save Client</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search clients by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All ({clients.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({clients.filter(c => c.status === "Active").length})</TabsTrigger>
            <TabsTrigger value="vip">VIP ({clients.filter(c => c.status === "VIP").length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({clients.filter(c => c.status === "Inactive").length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
            {filteredClients.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No clients found matching your search.
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredClients.filter(c => c.status === "Active").map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vip">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredClients.filter(c => c.status === "VIP").map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inactive">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredClients.filter(c => c.status === "Inactive").map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BuilderClients;