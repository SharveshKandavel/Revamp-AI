import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.revamp.pcbuilder',
  appName: 'Revamp PC Builder',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0F172A',
      showSpinner: true,
      spinnerColor: '#3B82F6'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0F172A'
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  ios: {
    scheme: 'Revamp PC Builder',
    contentInset: 'always'
  }
};

export default config;