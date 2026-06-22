
import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useBuildStore } from '@/store/useBuildStore';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Monitor, RotateCw, Pause, Play, ZoomIn, ZoomOut, Move3d } from 'lucide-react';
import * as THREE from 'three';

// Individual PC Components
function Motherboard() {
  return (
    <mesh position={[0, -0.2, 0]}>
      <boxGeometry args={[1.7, 0.1, 0.8]} />
      <meshStandardMaterial color="#1a6c25" />
      {/* CPU */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.3]} />
        <meshStandardMaterial color="#c0c0c0" />
      </mesh>
    </mesh>
  );
}

function GPU() {
  return (
    <mesh position={[-0.5, -0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
      <boxGeometry args={[0.6, 0.05, 0.7]} />
      <meshStandardMaterial color="#111111" />
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[0.5, 0.02, 0.6]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[-0.15, 0.06, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    </mesh>
  );
}

function RAMSticks() {
  return (
    <group position={[0.5, -0.1, 0]}>
      {/* First RAM stick */}
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[0.5, 0.15, 0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      {/* Second RAM stick */}
      <mesh position={[0, 0, -0.15]}>
        <boxGeometry args={[0.5, 0.15, 0.05]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

function PowerSupply() {
  return (
    <mesh position={[0, -1.2, 0]}>
      <boxGeometry args={[1.6, 0.5, 0.8]} />
      <meshStandardMaterial color="#2c2c2c" />
      <mesh position={[0.7, 0, 0]}>
        <boxGeometry args={[0.2, 0.4, 0.7]} />
        <meshStandardMaterial color="#1c1c1c" />
      </mesh>
    </mesh>
  );
}

// PC Case component with rotation and internal parts
function PCCase({ rotate, selectedParts }: { rotate: boolean, selectedParts: any }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const hasParts = Object.values(selectedParts).some(Boolean);
  
  // Apply rotation animation
  useFrame(() => {
    if (rotate && meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* PC Case */}
      <group>
        {/* Main case body */}
        <mesh>
          <boxGeometry args={[2, 3, 1]} />
          <meshStandardMaterial color="#333333" transparent opacity={0.8} />
        </mesh>
        
        {/* Front panel */}
        <mesh position={[0, 0, 0.51]}>
          <boxGeometry args={[1.9, 2.9, 0.05]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        
        {/* Front panel details */}
        <mesh position={[0, 1.2, 0.55]}>
          <boxGeometry args={[1, 0.3, 0.02]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        
        {/* Power button */}
        <mesh position={[0.7, 1.2, 0.56]}>
          <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
          <meshStandardMaterial color={hasParts ? "#2ed671" : "#666666"} />
        </mesh>
        
        {/* Front ventilation */}
        <mesh position={[0, -0.5, 0.55]}>
          <boxGeometry args={[1.4, 1, 0.02]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>
      
      {/* Internal components */}
      {selectedParts.Motherboard && <Motherboard />}
      {selectedParts.GPU && <GPU />}
      {selectedParts.RAM && <RAMSticks />}
      {selectedParts.PowerSupply && <PowerSupply />}
      
      {/* Side panel glass */}
      <mesh position={[-1.01, 0, 0]}>
        <boxGeometry args={[0.02, 2.9, 0.9]} />
        <meshStandardMaterial color={selectedParts.Case ? "#79b8de" : "#79b8de"} transparent opacity={0.3} />
      </mesh>
    </mesh>
  );
}

const BuildVisualizer3D = () => {
  const { selectedParts } = useBuildStore();
  const [autoRotate, setAutoRotate] = useState(true);
  const [initialAnimation, setInitialAnimation] = useState(true);
  const [showControls, setShowControls] = useState(false);

  // Stop initial animation after 10 seconds
  useEffect(() => {
    if (initialAnimation) {
      const timer = setTimeout(() => {
        setInitialAnimation(false);
        setAutoRotate(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [initialAnimation]);

  // Removed early return

  const isVisible = Object.values(selectedParts).filter(Boolean).length >= 1;

  return (
    <div style={{ display: isVisible ? 'block' : 'none' }}>
      <Card className="mb-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-tech-purple" />
            3D Build Preview
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowControls(!showControls)} 
              className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Move3d className="w-4 h-4" /> {showControls ? "Hide" : "Show"} Controls
            </button>
            
            <button 
              onClick={() => setAutoRotate(!autoRotate)} 
              className="flex items-center gap-1 px-2 py-1 text-sm bg-tech-purple text-white rounded-md hover:bg-tech-purple/90 transition-colors"
            >
              {autoRotate ? (
                <>
                  <Pause className="w-4 h-4" /> Stop Rotation
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Start Rotation
                </>
              )}
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px] w-full rounded-lg overflow-hidden bg-gray-900">
          <Canvas camera={{ position: [3, 3, 3] }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[-5, 5, 5]} intensity={0.8} angle={0.2} penumbra={1} />
            <Suspense fallback={null}>
              <PCCase rotate={autoRotate} selectedParts={selectedParts} />
              <OrbitControls 
                enableZoom={true}
                autoRotate={initialAnimation}
                autoRotateSpeed={5}
              />
            </Suspense>
          </Canvas>
          
          {/* Loading instructions overlay that fades after 3 seconds */}
          {initialAnimation && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-70 animate-fade-in">
              <RotateCw className="w-12 h-12 text-tech-purple animate-spin mb-2" />
              <p className="text-xl font-bold">Rendering your custom PC build...</p>
              <p className="text-sm mt-2">You can interact with the 3D model anytime</p>
            </div>
          )}
          
          {/* Controls overlay */}
          {showControls && (
            <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-70 text-white p-3 rounded-md animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <Move3d className="w-5 h-5 mb-1" />
                    <span className="text-xs">Drag to rotate</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <ZoomIn className="w-5 h-5 mb-1" />
                    <span className="text-xs">Scroll to zoom</span>
                  </div>
                </div>
                <div>
                  <button 
                    onClick={() => {
                      setAutoRotate(true);
                      setInitialAnimation(true);
                    }} 
                    className="text-xs bg-tech-purple px-2 py-1 rounded">
                    Reset View
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <RotateCw className="w-4 h-4 text-tech-purple" />
            <span>Click and drag to rotate manually. Use scroll to zoom in/out.</span>
          </p>
        </div>
      </CardContent>
      </Card>
    </div>
  );
};

export default BuildVisualizer3D;
