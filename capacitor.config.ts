import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'net.sol.app',
  appName: 'sol-app-frontend',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
