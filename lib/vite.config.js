import { defineConfig } from "vite";

const path = require("path");

export default defineConfig({
  build: {
    outDir: "./dist",
    lib: {
      entry: path.resolve(__dirname, "imml.js"),
      name: "imml",
    },
  },
});
