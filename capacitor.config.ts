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
    backgroundColor: '#FFFFFF',
    scheme: 'Spark Vault',
  },

  server: {
    hostname: 'spark.ogadix.com',
    androidScheme: 'https',
    iosScheme: 'https',
  },

  plugins: {
    App: {
      appUrlOpen: {
        universalLinks: ['spark.ogadix.com'],
      },
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FFFFFF',
      showSpinner: false,
      iosSpinnerStyle: 'large',
      androidSpinnerStyle: 'large',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#FFFFFF',
    },
    Keyboard: {
      resize: 'native',
      style: 'dark',
      resizeOnFullScreen: true,
      scrollAssist: true,
    },
    Haptics: {
      enabled: true,
    },
  },
};

export default config;
