import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: "auto",
      manifest: {
        name: "Invoice Generator",
        short_name: "InGen",
        description:
          "This is an invoice generator app which can be used to print digital version of your invoice.",
        start_url: "/home/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
      },
    }),
  ],
});
