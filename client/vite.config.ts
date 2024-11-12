import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { hmrHost, hmrPath, hmrPort, serverUrl } from "./src/utils/environment";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 3000,
    // strictPort: true,
  },
  server: {
    // open: "docs/index.html",
    port: 3000,
    // strictPort: true,

    // host: "0.0.0.0",
    // origin: "http://0.0.0.0:3000",
    // hmr: {
    //   host: "localhost", // || "0.0.0.0", // Set HMR WebSocket host
    //   protocol: "ws",
    //   // port: parseInt(hmrPort) || 0, // Set HMR WebSocket port
    //   // path: hmrPath || "/ws", // Set HMR WebSocket path if needed
    // },
    // proxy: {
    //   "/": {
    //     target: "http://localhost:4000", // Use import.meta.env to access environment variables
    //     ws: true,
    //     //     // changeOrigin: true,
    //     //     secure: false,
    //   },
    // },
    // https: true, // Enable HTTPS for development to mimic production
    // proxy: {
    //   // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
    //   // Exercise caution using `rewriteWsOrigin` as it can leave the proxying open to CSRF attacks.
    //   "/socket.io": {
    //     target: "ws://localhost:4000",
    //     ws: true,
    //     // rewriteWsOrigin: true,
    //   },
    // },
  },
});
