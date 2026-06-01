import React, { Suspense, useState, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { motion } from "framer-motion";
import { RotateCcw, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { useBuildStore } from "@/store/useBuildStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TouchOptimizedButton from "./TouchOptimizedButton";
import { useMobileDevice, useTouch } from "@/hooks/useMobile";
import { ImpactStyle } from "@capacitor/haptics";

// Simplified PC components for mobile performance
const SimplePCCase = ({ selectedParts }: { selectedParts: any }) => {
  const meshRef = useRef<any>();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group>
      {/* Main Case */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      >
        <boxGeometry args={[2, 2.5, 1]} />
        <meshStandardMaterial color={hovered ? "#3B82F6" : "#374151"} />
      </mesh>
      
      {/* Glass Panel */}
      <mesh position={[1, 0, 0]}>
        <boxGeometry args={[0.1, 2.5, 1]} />
        <meshStandardMaterial color="#60A5FA" transparent opacity={0.3} />
      </mesh>
      
      {/* Simplified Internal Components */}
      {selectedParts.CPU && (
        <mesh position={[0, -0.5, 0.2]}>
          <boxGeometry args={[0.3, 0.3, 0.1]} />
          <meshStandardMaterial color="#10B981" />
        </mesh>
      )}
      
      {selectedParts.GPU && (
        <mesh position={[0, 0, 0.3]}>
          <boxGeometry args={[1, 0.2, 0.4]} />
          <meshStandardMaterial color="#EF4444" />
        </mesh>
      )}
      
      {selectedParts.RAM && (
        <mesh position={[-0.6, 0.5, 0.2]}>
          <boxGeometry args={[0.1, 0.8, 0.05]} />
          <meshStandardMaterial color="#8B5CF6" />
        </mesh>
      )}
    </group>
  );
};

const MobileOptimized3D: React.FC = () => {
  const { selectedParts } = useBuildStore();
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { triggerHaptic, isMobile } = useMobileDevice();
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTouch();
  const controlsRef = useRef<any>();

  const handleRotateToggle = useCallback(async () => {
    await triggerHaptic(ImpactStyle.Medium);
    setAutoRotate(!autoRotate);
  }, [autoRotate, triggerHaptic]);

  const handleZoomIn = useCallback(async () => {
    await triggerHaptic(ImpactStyle.Light);
    if (controlsRef.current) {
      controlsRef.current.dollyIn(0.8);
      controlsRef.current.update();
    }
  }, [triggerHaptic]);

  const handleZoomOut = useCallback(async () => {
    await triggerHaptic(ImpactStyle.Light);
    if (controlsRef.current) {
      controlsRef.current.dollyOut(0.8);
      controlsRef.current.update();
    }
  }, [triggerHaptic]);

  const handleFullscreen = useCallback(async () => {
    await triggerHaptic(ImpactStyle.Medium);
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen, triggerHaptic]);

  const containerClass = isFullscreen 
    ? "fixed inset-0 z-50 bg-background"
    : "relative";

  return (
    <motion.div 
      className={containerClass}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={isFullscreen ? "h-full border-0 rounded-none" : "h-[400px]"}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">3D Build Preview</CardTitle>
            <div className="flex gap-2">
              <TouchOptimizedButton
                variant="outline"
                size="sm"
                onClick={handleRotateToggle}
                hapticStyle={ImpactStyle.Light}
              >
                <RotateCcw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
              </TouchOptimizedButton>
              
              {isMobile && (
                <>
                  <TouchOptimizedButton
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    hapticStyle={ImpactStyle.Light}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </TouchOptimizedButton>
                  
                  <TouchOptimizedButton
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    hapticStyle={ImpactStyle.Light}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </TouchOptimizedButton>
                </>
              )}
              
              <TouchOptimizedButton
                variant="outline"
                size="sm"
                onClick={handleFullscreen}
                hapticStyle={ImpactStyle.Medium}
              >
                <Maximize2 className="w-4 h-4" />
              </TouchOptimizedButton>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div 
            className={`bg-gradient-to-br from-background to-muted ${
              isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-[340px]'
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Canvas
              shadows
              camera={{ position: [5, 5, 5], fov: 50 }}
              performance={{ min: 0.5 }} // Optimize for mobile
            >
              <Suspense fallback={null}>
                {/* Optimized lighting for mobile */}
                <ambientLight intensity={0.4} />
                <directionalLight 
                  position={[10, 10, 5]} 
                  intensity={0.8}
                  castShadow={false} // Disable shadows on mobile for performance
                />
                <pointLight position={[-10, -10, -10]} intensity={0.3} />
                
                {/* Simplified PC Case */}
                <SimplePCCase selectedParts={selectedParts} />
                
                {/* Mobile-optimized controls */}
                <OrbitControls
                  ref={controlsRef}
                  autoRotate={autoRotate}
                  autoRotateSpeed={2}
                  enableDamping={true}
                  dampingFactor={0.05}
                  minDistance={3}
                  maxDistance={15}
                  maxPolarAngle={Math.PI / 1.5}
                  enablePan={isMobile}
                  touches={{
                    ONE: 0, // Rotate
                    TWO: 2  // Zoom
                  }}
                />
                
                <PerspectiveCamera makeDefault position={[5, 5, 5]} />
              </Suspense>
            </Canvas>
            
            {/* Loading overlay for mobile */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="bg-background/80 backdrop-blur-sm rounded-lg p-4"
              >
                <p className="text-sm text-muted-foreground">Loading 3D model...</p>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Mobile instructions */}
      {isMobile && !isFullscreen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="mt-2 text-xs text-muted-foreground text-center"
        >
          Touch to rotate • Pinch to zoom • Drag to pan
        </motion.div>
      )}
    </motion.div>
  );
};

export default MobileOptimized3D;