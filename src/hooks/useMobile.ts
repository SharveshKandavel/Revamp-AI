import { useState, useEffect } from 'react';
import { Device } from '@capacitor/device';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export const useMobileDevice = () => {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        const info = await Device.getInfo();
        setDeviceInfo(info);
        setIsNative(info.platform !== 'web');
      } catch (error) {
        // Fallback for web
        setIsNative(false);
      }
    };
    
    getDeviceInfo();
  }, []);

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        // Haptics not available
      }
    }
  };

  return {
    deviceInfo,
    isNative,
    triggerHaptic,
    isMobile: deviceInfo?.platform === 'android' || deviceInfo?.platform === 'ios'
  };
};

export const useTouch = () => {
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStartY || !touchEndY) return;
    
    const distance = touchStartY - touchEndY;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    return { isLeftSwipe, isRightSwipe, distance };
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};