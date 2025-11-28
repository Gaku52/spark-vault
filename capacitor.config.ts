import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ogadix.sparkvault',
  appName: 'Spark Vault',
  webDir: 'dist',

  server: {
    androidScheme: 'https',
  },

  ios: {
    contentInset: 'automatic',
    backgroundColor: '#8b5cf6',
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8b5cf6',
      showSpinner: false,
      iosSpinnerStyle: 'large',
      androidSpinnerStyle: 'large',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#8b5cf6',
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true,
    },
    Haptics: {
      enabled: true,
    },
  },
};

export default config;
