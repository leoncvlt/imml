import "./style.css";

import example from "./page.imml?raw";
import baseStyle from "../lib/base.css";
import defaultStyle from "../lib/style.css";

import { render, parse } from "../lib/imml";
import { language, configuration, darkTheme, lightTheme } from "./imml.language";

// import * as monaco from "monaco-editor";

import "monaco-editor/esm/vs/editor/browser/controller/coreCommands.js";
import "monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching.js";
import "monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations.js";
import "monaco-editor/esm/vs/editor/contrib/caretOperations/transpose.js";
import "monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js";
import "monaco-editor/esm/vs/editor/contrib/colorPicker/colorContributions.js";
import "monaco-editor/esm/vs/editor/contrib/comment/comment.js";
import "monaco-editor/esm/vs/editor/contrib/cursorUndo/cursorUndo.js";
import "monaco-editor/esm/vs/editor/contrib/find/findController.js";
import "monaco-editor/esm/vs/editor/contrib/folding/folding.js";
import "monaco-editor/esm/vs/editor/contrib/indentation/indentation.js";
import "monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations.js";
import "monaco-editor/esm/vs/editor/contrib/links/links.js";
import "monaco-editor/esm/vs/editor/contrib/multicursor/multicursor.js";

import "monaco-editor/esm/vs/language/css/monaco.contribution.js";
import "monaco-editor/esm/vs/language/html/monaco.contribution.js";
import "monaco-editor/esm/vs/basic-languages/css/css.contribution.js";
import "monaco-editor/esm/vs/basic-languages/html/html.contribution.js";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    return new editorWorker();
  },
};

monaco.languages.register({ id: "imml" });
monaco.languages.setMonarchTokensProvider("imml", language);
monaco.languages.setLanguageConfiguration("imml", configuration);

const getColorScheme = () => {
  let setting = document.documentElement.getAttribute("theme");
  if (setting) {
    return setting;
  }

  let theme = "light";
  if (localStorage.getItem("theme")) {
    if (localStorage.getItem("theme") == "dark") {
      theme = "dark";
    }
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    theme = "dark";
  }
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
};

monaco.editor.defineTheme("imml-theme", getColorScheme() === "light" ? lightTheme : darkTheme);

const editor = monaco.editor.create(document.getElementById("editor"), {
  value: localStorage.getItem("imml-document") || example,
  language: "imml",
  theme: "imml-theme",
  lineNumbers: false,
  showFoldingControls: "always",
  wrappingIndent: "same",
  quickSuggestions: false,
  wordWrap: "on",
  padding: {
    top: 16,
  },
  minimap: {
    enabled: false,
  },
  automaticLayout: true,
});

const toggleColorScheme = () => {
  const currentColorScheme = getColorScheme();
  if (currentColorScheme === "light") {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
    monaco.editor.defineTheme("imml-theme", darkTheme);
  } else {
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "light");
    monaco.editor.defineTheme("imml-theme", lightTheme);
  }
};

let updateTimeout = null;
const root = document.getElementById("site");
const updateSite = (editor) => {
  clearTimeout(updateTimeout);

  const currentPosition = editor.getPosition();
  const currentScroll = root.scrollTop;

  localStorage.setItem("imml-document", editor.getValue());

  while (root.firstChild) {
    root.removeChild(root.lastChild);
  }

  try {
    const data = parse(editor.getValue());
    render(data, document, root);
  } catch (exception) {
    console.error(exception);
    const error = Object.assign(document.createElement("p"), {
      classList: ["error"],
      textContent: exception,
    });
    root.append(error);
  }

  if (window.location.hash) {
    window.location = window.location;
  }
  root.scrollTo(0, currentScroll);
  editor.setPosition(currentPosition);
  editor.focus();
};

editor.onDidChangeModelContent((event) => {
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(() => {
    updateSite(editor, true);
  }, 1000);
});

editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
  updateSite(editor, true);
});

updateSite(editor);

// infer site name for filename methods
// either the first found $title option, or the first text line, or a generic name
const guessSiteName = () => {
  const siteContent = editor.getValue();
  const titleIndex = siteContent.search(/^\$title/gm);
  if (titleIndex !== -1) {
    const titleStart = siteContent.substring(titleIndex);
    const titleTokens = titleStart.substring(0, titleStart.indexOf("\n")).split(":");
    return titleTokens[titleTokens.length - 1].trim();
  }
  const siteTokens = siteContent.split("\n");
  if (siteTokens.length > 0 && siteTokens[0]) {
    return siteTokens[0].trim();
  }
  return "my-imml-site";
};

// reset
document.querySelector("button.reset").addEventListener("click", () => {
  if (confirm("Clear local storage and reset the imml document?")) {
    localStorage.removeItem("imml-document");
    window.location.reload();
  }
});

// save
document.querySelector("button.save").addEventListener("click", () => {
  const a = document.createElement("a");
  const file = new Blob([editor.getValue()], { type: "text/plain" });

  a.href = URL.createObjectURL(file);
  a.download = `${guessSiteName()}.imml`;
  a.click();

  URL.revokeObjectURL(a.href);
});

// load
const fileinput = document.querySelector("input.load");
document.querySelector("button.load").addEventListener("click", () => fileinput.click());
fileinput.addEventListener("change", function () {
  const reader = new FileReader();
  reader.onload = () => {
    editor.setValue(reader.result);
    updateSite(editor);
    this.value = null;
  };
  reader.readAsText(this.files[0]);
});

// export
document.querySelector("button.export").addEventListener("click", () => {
  const title = document.querySelector("head title");
  const description = document.querySelector("head meta[name='description']");
  const extraStyle = document.querySelector("style.imml");

  const head = [
    `<head>`,
    title?.outerHTML,
    description?.outerHTML,
    `<meta charset="UTF-8">`,
    `<meta http-equiv="X-UA-Compatible" content="IE=edge">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
    `<style>${baseStyle}</style>`,
    `<style>${defaultStyle}</style>`,
    extraStyle?.outerHTML,
    `</head>`,
  ].join("");
  const body = `<body>${document.getElementById("site").innerHTML}</body>`;
  const page = `<!doctype html><html>${head}${body}</html>`;
  const file = new Blob([page], { type: "text/yaml" });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(file);
  a.download = `index.html`;
  a.click();

  URL.revokeObjectURL(a.href);
});

// theme toggle
document.querySelector("button.theme").addEventListener("click", () => {
  toggleColorScheme();
});

// loading screen
const loading = document.getElementById("loading");
loading.addEventListener("transitionend", () => loading.remove());
loading.classList.add("done");
