import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export const initializeMobileApp = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Configure status bar
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#0F172A' });
      
      // Hide splash screen after app is ready
      setTimeout(async () => {
        await SplashScreen.hide({
          fadeOutDuration: 300
        });
      }, 2000);
      
    } catch (error) {
      console.log('Mobile initialization error:', error);
    }
  }
  
  // Register service worker for PWA features
  if ('serviceWorker' in navigator && !Capacitor.isNativePlatform()) {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  }
};

export const getDeviceType = () => {
  const platform = Capacitor.getPlatform();
  const userAgent = navigator.userAgent.toLowerCase();
  
  return {
    isNative: Capacitor.isNativePlatform(),
    isAndroid: platform === 'android',
    isIOS: platform === 'ios',
    isWeb: platform === 'web',
    isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
    isTablet: /ipad|android(?!.*mobile)|tablet/i.test(userAgent)
  };
};

export const optimizeForMobile = () => {
  const deviceType = getDeviceType();
  
  // Add mobile-specific meta tags
  if (deviceType.isMobile) {
    // Prevent zoom
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      );
    }
    
    // Add mobile web app capabilities
    const meta = document.createElement('meta');
    meta.name = 'mobile-web-app-capable';
    meta.content = 'yes';
    document.head.appendChild(meta);
    
    // Add apple-specific meta tags
    if (deviceType.isIOS || /safari/i.test(navigator.userAgent)) {
      const appleMeta = document.createElement('meta');
      appleMeta.name = 'apple-mobile-web-app-capable';
      appleMeta.content = 'yes';
      document.head.appendChild(appleMeta);
      
      const appleStatus = document.createElement('meta');
      appleStatus.name = 'apple-mobile-web-app-status-bar-style';
      appleStatus.content = 'black-translucent';
      document.head.appendChild(appleStatus);
    }
  }
  
  return deviceType;
};