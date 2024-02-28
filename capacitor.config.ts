import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Fake Wifi',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    cleartext: true
  },

  android: {
    allowMixedContent: true
  },
};

export default config;
