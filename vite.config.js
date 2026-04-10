import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Base path matches the GitHub Pages project URL: https://mshadianto.github.io/servicehpreza/
export default defineConfig({
  plugins: [react()],
  base: "/servicehpreza/",
});
