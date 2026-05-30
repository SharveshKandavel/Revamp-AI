import React, { useState } from "react";
import { BuildProvider } from "@/contexts/BuildContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Search, Clock, User, BookOpen, Play, Star, ChevronRight } from "lucide-react";

const GuidesContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  const guides = [
    {
      id: 1,
      title: "Complete PC Building Guide for Beginners",
      description: "Step-by-step tutorial covering everything from choosing parts to first boot",
      category: "Building",
      difficulty: "Beginner",
      readTime: 25,
      author: "TechMaster",
      rating: 4.9,
      views: 15420,
      image: "/placeholder.svg",
      type: "Article",
      isPopular: true
    },
    {
      id: 2,
      title: "How to Choose the Right GPU for Gaming",
      description: "Comprehensive guide to selecting graphics cards based on your needs and budget",
      category: "Components",
      difficulty: "Beginner",
      readTime: 15,
      author: "GamingGuru",
      rating: 4.8,
      views: 12350,
      image: "/placeholder.svg",
      type: "Article",
      isPopular: true
    },
    {
      id: 3,
      title: "Custom Water Cooling Setup",
      description: "Advanced tutorial on planning and installing custom water cooling loops",
      category: "Cooling",
      difficulty: "Expert",
      readTime: 45,
      author: "CoolMaster",
      rating: 4.7,
      views: 8900,
      image: "/placeholder.svg",
      type: "Video",
      isPopular: false
    },
    {
      id: 4,
      title: "Cable Management Best Practices",
      description: "Learn how to organize cables for better airflow and aesthetics",
      category: "Building",
      difficulty: "Intermediate",
      readTime: 20,
      author: "NeatBuilder",
      rating: 4.6,
      views: 9800,
      image: "/placeholder.svg",
      type: "Article",
      isPopular: false
    },
    {
      id: 5,
      title: "Troubleshooting Boot Issues",
      description: "Common PC boot problems and their solutions",
      category: "Troubleshooting",
      difficulty: "Intermediate",
      readTime: 18,
      author: "FixItPro",
      rating: 4.8,
      views: 11200,
      image: "/placeholder.svg",
      type: "Article",
      isPopular: true
    },
    {
      id: 6,
      title: "RGB Lighting Setup Guide",
      description: "Everything you need to know about RGB lighting and synchronization",
      category: "Aesthetics",
      difficulty: "Beginner",
      readTime: 12,
      author: "RGBExpert",
      rating: 4.5,
      views: 7600,
      image: "/placeholder.svg",
      type: "Video",
      isPopular: false
    },
    {
      id: 7,
      title: "Overclocking Your CPU Safely",
      description: "Step-by-step guide to overclocking with safety considerations",
      category: "Performance",
      difficulty: "Advanced",
      readTime: 30,
      author: "OCMaster",
      rating: 4.9,
      views: 13400,
      image: "/placeholder.svg",
      type: "Article",
      isPopular: true
    },
    {
      id: 8,
      title: "Choosing the Perfect Case",
      description: "Factors to consider when selecting a PC case for your build",
      category: "Components",
      difficulty: "Beginner",
      readTime: 10,
      author: "CaseExpert",
      rating: 4.4,
      views: 6800,
      image: "/placeholder.svg",
      type: "Article",
      isPopular: false
    }
  ];

  const categories = [
    "Building", "Components", "Cooling", "Troubleshooting", 
    "Aesthetics", "Performance"
  ];

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || guide.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesDifficulty = filterDifficulty === "all" || guide.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const popularGuides = guides.filter(guide => guide.isPopular).slice(0, 3);

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
              PC Building Guides
            </h1>
            <p className="text-lg text-gray-600">
              Learn from experts with our comprehensive tutorials and guides
            </p>
          </motion.div>

          {/* Popular Guides Section */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-tech-dark mb-6">Popular Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularGuides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                      <img 
                        src={guide.image} 
                        alt={guide.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {guide.type === "Video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full p-3">
                            <Play className="h-6 w-6 text-white fill-white" />
                          </div>
                        </div>
                      )}
                      <Badge className="absolute top-2 left-2 bg-tech-accent text-white">
                        Popular
                      </Badge>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getDifficultyColor(guide.difficulty)}>
                          {guide.difficulty}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {guide.readTime}min
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{guide.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{guide.rating}</span>
                        </div>
                        <Button size="sm" className="bg-tech-accent hover:bg-tech-accent/90">
                          Read More
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search guides..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* All Guides */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-tech-dark">All Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGuides.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                    <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden relative">
                      <img 
                        src={guide.image} 
                        alt={guide.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {guide.type === "Video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full p-3">
                            <Play className="h-6 w-6 text-white fill-white" />
                          </div>
                        </div>
                      )}
                      <Badge className="absolute top-2 right-2" variant="secondary">
                        {guide.category}
                      </Badge>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge className={getDifficultyColor(guide.difficulty)}>
                          {guide.difficulty}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {guide.readTime}min
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{guide.title}</CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-2">{guide.description}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{guide.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{guide.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-xs text-gray-500">{guide.views.toLocaleString()} views</span>
                          <Button size="sm" className="bg-tech-accent hover:bg-tech-accent/90">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {guide.type === "Video" ? "Watch" : "Read"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {filteredGuides.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No guides found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Guides = () => {
  return (
    <BuildProvider>
      <GuidesContent />
    </BuildProvider>
  );
};

export default Guides;