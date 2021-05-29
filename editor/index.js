import "./style.css";

import example from "./page.imml?raw";

import { render, parse } from "../lib/imml";
import defaultStyle from "../lib/style.css";

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

const editor = monaco.editor.create(document.getElementById("editor"), {
  value: example,
  language: "imml",
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
  const head = `<head><style>${defaultStyle}</style></head>`;
  const body = `<body>${document.getElementById("site").innerHTML}</body>`;
  const page = `<!doctype html><html>${head}${body}</html>`;
  const file = new Blob([page], { type: "text/yaml" });

  a.href = URL.createObjectURL(file);
  a.download = "my-yawml-site.html";
  a.click();

  URL.revokeObjectURL(a.href);
});

// loading screen
const loading = document.getElementById("loading");
loading.addEventListener("transitionend", () => loading.remove());
loading.classList.add("done");