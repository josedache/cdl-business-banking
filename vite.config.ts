import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";
import viteSvgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      apis: path.resolve(__dirname, "src/apis"),
      assets: path.resolve(__dirname, "src/assets"),
      components: path.resolve(__dirname, "src/components"),
      configs: path.resolve(__dirname, "src/configs"),
      constants: path.resolve(__dirname, "src/constants"),
      enums: path.resolve(__dirname, "src/enums"),
      modules: path.resolve(__dirname, "src/modules"),
      hooks: path.resolve(__dirname, "src/hooks"),
      libs: path.resolve(__dirname, "src/libs"),
      contexts: path.resolve(__dirname, "src/contexts"),
      utils: path.resolve(__dirname, "src/utils"),
      types: path.resolve(__dirname, "src/types"),
    },
  },
  plugins: [react(), tailwindcss(), tsconfigPaths(), viteSvgr()],
});
