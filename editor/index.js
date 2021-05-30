import "./style.css";

import example from "./page.imml?raw";
import defaultStyle from "../lib/style.css";

import { render, parse } from "../lib/imml";
import { language, darkTheme, lightTheme } from "./imml.language";

// import * as monaco from "monaco-editor";

import "monaco-editor/esm/vs/editor/browser/controller/coreCommands.js";
import "monaco-editor/esm/vs/editor/contrib/caretOperations/caretOperations.js";
import "monaco-editor/esm/vs/editor/contrib/clipboard/clipboard.js";
// import "monaco-editor/esm/vs/editor/contrib/comment/comment.js";
import "monaco-editor/esm/vs/editor/contrib/find/findController.js";
import "monaco-editor/esm/vs/editor/contrib/folding/folding.js";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";

import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    return new editorWorker();
  },
};

monaco.languages.register({
  id: "imml",
});
monaco.languages.setMonarchTokensProvider("imml", language);

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
  value: example,
  language: "imml",
  theme: "imml-theme",
  lineNumbers: false,
  showFoldingControls: "always",
  wrappingIndent: "same",
  quickSuggestions: false,
  wordWrap: "on",
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

  const currentPosition = editor.getPosition();
  if (window.location.hash) {
    window.location = window.location;
  }
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

// save
document.querySelector("button.save").addEventListener("click", () => {
  const a = document.createElement("a");
  const file = new Blob([editor.getValue()], { type: "text/plain" });

  a.href = URL.createObjectURL(file);
  a.download = "my-imml-site.imml";
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
  const a = document.createElement("a");
  const head = [
    `<head>`,
    `<meta charset="UTF-8">`,
    `<meta http-equiv="X-UA-Compatible" content="IE=edge">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
    `<style>${defaultStyle}</style>`,
    `</head>`,
  ].join("");
  const body = `<body>${document.getElementById("site").innerHTML}</body>`;
  const page = `<!doctype html><html>${head}${body}</html>`;
  const file = new Blob([page], { type: "text/yaml" });

  a.href = URL.createObjectURL(file);
  a.download = "my-imml-site.html";
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
