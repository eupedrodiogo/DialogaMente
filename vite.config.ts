import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/comunicapro/',
  server: {
    host: "0.0.0.0",
    port: 8082,
    strictPort: true,
    hmr: {
      clientPort: 8082
    },
    watch: {
      usePolling: true,
    },
    allowedHosts: ["8082-idl79yiwptn39u77suxmi-f34ccf29.manusvm.computer"],
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
