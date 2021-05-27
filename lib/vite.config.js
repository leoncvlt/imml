const path = require("path");

module.exports = {
  build: {
    outDir: "./dist",
    lib: {
      entry: path.resolve(__dirname, "imml.js"),
      name: "imml",
    },
  },
};
