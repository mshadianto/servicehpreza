import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Custom domain: MaxMobileService.web.id
export default defineConfig({
  plugins: [react()],
  base: "/",
});
