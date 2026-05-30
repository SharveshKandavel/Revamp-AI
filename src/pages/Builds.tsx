import React, { useState, useEffect } from "react";
import { BuildProvider } from "@/contexts/BuildContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Heart, Share2, Search, Star, User, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Build } from "@/types/database";

const staticBuilds: Build[] = [
  {
    id: 1,
    user_id: "system",
    title: "Ultimate Gaming Beast",
    description: "High-end gaming build for 4K gaming at 144fps",
    total_price: 180000,
    parts: {} as any,
    performance: "High-End",
    likes: 247,
    created_at: "2024-01-15",
    author: "TechBuilder_Pro",
    image: "/placeholder.svg",
    category: "Gaming",
    specs: ["RTX 4080", "i7-13700K", "32GB DDR5"],
    difficulty: "Advanced",
    rating: 4.9
  },
  {
    id: 2,
    user_id: "system",
    title: "Budget Productivity Workstation",
    description: "Efficient build for office work and light content creation",
    total_price: 65000,
    parts: {} as any,
    performance: "Entry-Level",
    likes: 189,
    created_at: "2024-01-12",
    author: "BudgetBuilder",
    image: "/placeholder.svg",
    category: "Workstation",
    specs: ["GTX 1660 Super", "Ryzen 5 5600", "16GB DDR4"],
    difficulty: "Beginner",
    rating: 4.7
  },
  {
    id: 3,
    user_id: "system",
    title: "Content Creator Pro",
    description: "Perfect balance for streaming, editing, and gaming",
    total_price: 125000,
    parts: {} as any,
    performance: "Mid-Range",
    likes: 312,
    created_at: "2024-01-10",
    author: "StreamMaster",
    image: "/placeholder.svg",
    category: "Creator",
    specs: ["RTX 4070", "Ryzen 7 7700X", "32GB DDR5"],
    difficulty: "Intermediate",
    rating: 4.8
  }
];

const BuildsContent = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("community");
  const [savedBuilds, setSavedBuilds] = useState<Build[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "my-builds" && user) {
      fetchMyBuilds();
    }
  }, [activeTab, user]);

  const fetchMyBuilds = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('builds')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSavedBuilds(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch builds");
      toast.error("Database connection error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (build: Build) => {
    if (activeTab === "community") {
      toast.success("Build added to your favorites!");
      return;
    }

    try {
      const { error } = await supabase
        .from('builds')
        .update({ likes: (build.likes || 0) + 1 })
        .eq('id', build.id);
      
      if (error) throw error;
      setSavedBuilds(savedBuilds.map(b => b.id === build.id ? { ...b, likes: (b.likes || 0) + 1 } : b));
      toast.success("Build liked!");
    } catch (err: any) {
      toast.error("Failed to update likes");
    }
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title,
        text: `Check out this PC build on Revamp AI: ${title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      toast.info("Link copied to clipboard!");
    }
  };

  const displayBuilds: Build[] = activeTab === "community" 
    ? staticBuilds 
    : savedBuilds.map(b => ({
        ...b,
        author: user?.name || "Me",
        difficulty: b.performance === 'High-End' ? 'Advanced' : 'Intermediate',
        category: 'Custom',
        specs: b.parts ? Object.values(b.parts).filter((p: any) => p).map((p: any) => p.name).slice(0, 3) : []
      }));

  const filteredBuilds = displayBuilds.filter(build => {
    const matchesSearch = build.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         build.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (build.specs?.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ?? false);
    const matchesCategory = filterCategory === "all" || build.category?.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-tech-dark mb-2">Build Showcase</h1>
              <p className="text-lg text-gray-600">
                {activeTab === "community" ? "Discover amazing PC builds" : "Your personal collection"}
              </p>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="my-builds">My Builds</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search builds..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-48"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="workstation">Workstation</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error ? (
            <Card className="p-12 text-center border-red-100">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Connection Error</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={fetchMyBuilds} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" /> Retry
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full text-center py-24">
                  <RefreshCw className="w-10 h-10 animate-spin mx-auto text-tech-purple mb-4" />
                  <p className="text-muted-foreground">Fetching your builds from the cloud...</p>
                </div>
              ) : filteredBuilds.map((build, index) => (
                <BuildCard key={build.id} build={build} index={index} onLike={() => handleLike(build)} onShare={() => handleShare(build.title)} isSavedTab={activeTab === 'my-builds'} />
              ))}
            </div>
          )}

          {filteredBuilds.length === 0 && !isLoading && !error && (
            <div className="text-center py-24 bg-white rounded-xl border border-dashed border-gray-200">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No builds found</h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                {activeTab === "my-builds" ? "Start building your dream PC and click 'Save Build'!" : "Try adjusting your filters."}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const BuildCard = ({ build, index, onLike, onShare, isSavedTab }: { build: Build, index: number, onLike: () => void, onShare: () => void, isSavedTab: boolean }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
    <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
        <img src={build.image || "/placeholder.svg"} alt={build.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        {isSavedTab && <div className="absolute top-2 right-2"><Badge className="bg-tech-purple">Cloud Saved</Badge></div>}
      </div>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge className={getDifficultyColor(build.difficulty || 'Intermediate')}>{build.difficulty || 'Intermediate'}</Badge>
          <Badge variant="secondary">{build.category}</Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2">{build.title}</CardTitle>
        <p className="text-sm text-gray-600 line-clamp-2">{build.description}</p>
      </CardHeader>
      <CardContent className="pt-0 flex-grow">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {build.specs?.map((spec, i) => <Badge key={i} variant="outline" className="text-xs">{spec}</Badge>)}
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span>{build.rating || "5.0"}</span></div>
            <div className="flex items-center gap-2"><Heart className="h-4 w-4" /><span>{build.likes || 0}</span></div>
            <div className="flex items-center gap-2 font-bold text-tech-dark"><span>₹{Number(build.total_price || build.price).toLocaleString()}</span></div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t mt-auto">
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><User className="w-3 h-3" /><span>{build.author}</span></div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onLike}><Heart className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" onClick={onShare}><Share2 className="h-4 w-4" /></Button>
              <Button size="sm" className="bg-tech-accent hover:bg-tech-accent/90">View</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-100 text-green-800';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'Advanced': return 'bg-orange-100 text-orange-800';
    case 'Expert': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const Builds = () => (
  <BuildProvider>
    <BuildsContent />
  </BuildProvider>
);

export default Builds;
