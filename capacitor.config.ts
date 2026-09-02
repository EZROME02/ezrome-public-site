import type { CapacitorConfig } from "@capacitor/cli";

const defaultServerUrl = "https://ezromepub-f3hzkejz.manus.space";
const serverUrl = process.env.CAPACITOR_SERVER_URL?.trim() || defaultServerUrl;

const config: CapacitorConfig = {
  appId: "com.ezrome.app",
  appName: "EZROME",
  webDir: "dist/public",
  server: {
    url: serverUrl,
    androidScheme: "https",
    cleartext: false,
  },
};

export default config;
