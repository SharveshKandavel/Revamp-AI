import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Bookmark, Eye } from "lucide-react";
import { motion } from "framer-motion";
import TouchOptimizedButton from "./TouchOptimizedButton";
import { useMobileDevice } from "@/hooks/useMobile";
import { Share } from "@capacitor/share";
import { ImpactStyle } from "@capacitor/haptics";

interface MobileBuildCardProps {
  build: {
    id: string;
    name: string;
    price: number;
    purpose: string;
    parts: string[];
    image?: string;
  };
  onView?: (buildId: string) => void;
}

const MobileBuildCard: React.FC<MobileBuildCardProps> = ({ build, onView }) => {
  const { triggerHaptic, isNative } = useMobileDevice();

  const handleShare = async () => {
    await triggerHaptic(ImpactStyle.Medium);
    
    if (isNative) {
      try {
        await Share.share({
          title: `Check out this PC build: ${build.name}`,
          text: `${build.name} - $${build.price.toLocaleString()} - Perfect for ${build.purpose}`,
          url: `${window.location.origin}/builds/${build.id}`,
        });
      } catch (error) {
        // Fallback to web share or copy to clipboard
        console.log('Share failed:', error);
      }
    } else {
      // Web fallback
      if (navigator.share) {
        try {
          await navigator.share({
            title: `PC Build: ${build.name}`,
            text: `${build.name} - $${build.price.toLocaleString()}`,
            url: window.location.href,
          });
        } catch (error) {
          // Copy to clipboard as final fallback
          navigator.clipboard.writeText(window.location.href);
        }
      }
    }
  };

  const handleView = async () => {
    await triggerHaptic(ImpactStyle.Light);
    if (onView) {
      onView(build.id);
    }
  };

  const handleBookmark = async () => {
    await triggerHaptic(ImpactStyle.Medium);
    // TODO: Implement bookmark functionality
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
        {build.image && (
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
            <img 
              src={build.image} 
              alt={build.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
        
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold truncate">
                {build.name}
              </CardTitle>
              <p className="text-2xl font-bold text-primary mt-1">
                ${build.price.toLocaleString()}
              </p>
            </div>
            <Badge variant="secondary" className="ml-2 shrink-0">
              {build.purpose}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1 mb-4">
            {build.parts.slice(0, 3).map((part, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {part}
              </Badge>
            ))}
            {build.parts.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{build.parts.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <TouchOptimizedButton
              onClick={handleView}
              className="flex-1"
              size="sm"
              hapticStyle={ImpactStyle.Light}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </TouchOptimizedButton>
            
            <TouchOptimizedButton
              onClick={handleShare}
              variant="outline"
              size="sm"
              hapticStyle={ImpactStyle.Medium}
            >
              <Share2 className="w-4 h-4" />
            </TouchOptimizedButton>
            
            <TouchOptimizedButton
              onClick={handleBookmark}
              variant="outline"
              size="sm"
              hapticStyle={ImpactStyle.Medium}
            >
              <Bookmark className="w-4 h-4" />
            </TouchOptimizedButton>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MobileBuildCard;