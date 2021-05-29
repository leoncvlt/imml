#! /usr/bin/env node
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require("fs");
const { basename, extname, dirname, join } = require("path");
const { program } = require("commander");
const { JSDOM } = require("jsdom");

const minify = require("html-minifier").minify;

const { parse, render } = require("./dist/imml.umd");

const output = join(process.cwd(), "dist", "<imml file>", "index.html");
const style = join(__dirname, "style.css");

program
  .arguments("<file>")
  .description("generates minimalist, no-JS static sites from a plain text file", {
    file: "imml file to parse",
  })
  .option("-o, --output <directory>", "directory to export the generated html file to", output)
  .option("-s, --style <file>", "stylesheet file to use instead of the default one", style)
  .action((file, options, command) => {
    if (!existsSync(file)) {
      throw `file '${file}' does not exists`;
    }
    const contents = readFileSync(file, { encoding: "utf8", flag: "r" });
    const data = parse(contents);

    const jsdom = new JSDOM(
      [
        `<!doctype html>`,
        `<html>`,
        `<head>`,
        `<meta charset="UTF-8">`,
        `<meta http-equiv="X-UA-Compatible" content="IE=edge">`,
        `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
        `</head>`,
        `<body>`,
        `</body>`,
        `</html>`,
      ].join("")
    );

    if (!existsSync(options.style)) {
      throw `Stylesheet '${file}' does not exists`;
    }
    const style = readFileSync(options.style, { encoding: "utf8", flag: "r" });
    jsdom.window.document.head.insertAdjacentHTML("beforeend", `<style>${style}</style>`);

    const output = options.output.replace("<imml file>", basename(file, extname(file)));

    render(data, jsdom.window.document);
    let serialized = jsdom.serialize();

    serialized = minify(serialized, {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      decodeEntities: true,
      html5: true,
      minifyCSS: true,
      minifyJS: true,
      processConditionalComments: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeTagWhitespace: true,
      sortAttributes: true,
      sortClassName: true,
      trimCustomFragments: true,
      useShortDoctype: true,
    });

    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, serialized);
  });

program.parse();
