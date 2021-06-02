import marked from "marked";

const NEWLINE = "{{NEWLINE}}";

const startsIndentedBlock = (string) =>
  (string.startsWith("[") && string.endsWith("]")) || string.startsWith("$");

/**
 * Preprocess an imml text string into a list of nodes
 * @param {string} text - the string to preprocess
 * @returns a preprocessed imml tokens object to be used by the `transform` function
 */
const preprocess = (text) => {
  const lines = text.split("\n");
  let result = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const node = {
      value: line.trim(),
      rawValue: line,
      indentation: line.search(/\S|$/),
    };

    if (node.value.startsWith("//")) {
      continue;
    }

    const previousNode = result.length ? result[result.length - 1] : { value: "", indentation: 0 };

    if (!node.value && result.length) {
      previousNode.value = previousNode.value + NEWLINE;
      result[result.length - 1] = previousNode;
      continue;
    }
    result.push(node);
  }
  return result;
};

/**
 * Transforms a list of preprocessed imml tokens
 * @param {array} nodes - the list of preprocess tokens, as returned by the `preprocess` function
 * @param {int} level - the current indentation level - used internally for recursion, should be zero
 * @param {int} rawIndentation - number of spaces to be retained on the line, used to correctly parse
 * code blocks and nested list - used internally for recursion, should be zero
 * @returns a transformed imml data object to be used by the `process` function
 */
const transform = (nodes, level = 0, rawIndentation = 0) => {
  const stack = [];
  let indentationLevelGuess = 2;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const nextNode = i < nodes.length - 1 ? nodes[i + 1] : { value: "", indentation: -1 };
    const value = " ".repeat(rawIndentation) + node.value;

    if (node.indentation !== level) {
      if (node.indentation < level) {
        return stack;
      }
      continue;
    }

    if (nextNode.indentation > level) {
      const head = node.value;
      if (startsIndentedBlock(head)) {
        const nextStack = transform(nodes.slice(i + 1), nextNode.indentation);
        stack.push({ [head]: nextStack });
      } else {
        indentationLevelGuess = nextNode.indentation - level;
        stack.push(value);
        const nextStack = transform(
          nodes.slice(i + 1),
          nextNode.indentation,
          rawIndentation + indentationLevelGuess
        );
        stack.push(...nextStack);
      }
    } else if (nextNode.indentation < level) {
      stack.push(value);
      return stack;
    } else {
      stack.push(value);
    }
  }
  return stack;
};

const replaceNewlines = (string, replacement = "") =>
  string.replace(new RegExp(NEWLINE, "g"), replacement);

const isObject = (value) => {
  const type = typeof value;
  return value != null && (type === "object" || type === "function");
};

const isString = (value) => typeof value === "string" || value instanceof String;

const isOption = (node) => {
  let value = isObject(node) ? Object.keys(node)[0] : node;
  return value.startsWith("$");
};

// parses an option ($option) string, either single line or indented one into a [key, value] array
const parseOption = (option) => {
  let key, value;
  if (isObject(option)) {
    key = Object.keys(option)[0].split(":")[0].slice(1);

    const flatten = (string, s) => {
      if (Array.isArray(s)) {
        for (const ss of s) {
          return flatten(string, ss);
        }
      }
      if (isObject(s)) {
        string += Object.keys(s)[0] + "\n";
        return flatten(string, Object.values(s)[0]);
      }
      string += replaceNewlines(s) + "\n";
      return string;
    };

    value = Object.values(option)[0].reduce(flatten, "");
  } else {
    const tokens = option.split(":");
    key = tokens[0].slice(1);
    value = replaceNewlines(tokens.slice(1, tokens.length).join(":")).trim();
  }
  return [key, value.trim()];
};

/**
 * Process a transformed imml object
 * @param {object} source - the imml transformed data object as returned by the `transform` function
 * @param {ojbect} page - the current page being processed - used internally by the function for recursion, should be null.
 * @param {object} data - the final processed data object - used internally by the function, should be null.
 * @returns an object outlining the site structure to be used by the `render` function
 */
const process = (source, page = null, data = null) => {
  data = data || { pages: {}, options: {} };

  for (const node of source) {
    if (isOption(node)) {
      const [key, value] = parseOption(node);
      (page ? data.pages[page] : data).options[key] = value;
      continue;
    }

    if (isObject(node)) {
      const value = Object.keys(node)[0];
      let pageId = value.replace(/[\[\]']+/g, "");
      let pageLabel = pageId;

      const passthrough = pageId.startsWith(".");
      if (passthrough) {
        continue;
      }

      const labelMatches = pageId.match(/\(([^)]*)\)[^(]*$/);
      if (labelMatches && labelMatches.length) {
        pageLabel = labelMatches[1];
        pageId = pageId.replace(`(${pageLabel})`, "");
      }

      let duplicateTries = 1;
      while (pageId in data.pages) {
        pageId = pageId + duplicateTries;
      }
      duplicateTries++;

      const newPath = (page ? data.pages[page].path : "") + "/" + pageId;
      const isHomePage = Object.keys(data.pages).length === 0;
      const hidden = value.startsWith("[[") && value.endsWith("]]");
      data.pages[pageId] = {
        elements: [],
        options: {},
        home: isHomePage,
        path: newPath,
        label: pageLabel,
      };
      if (page && !hidden) {
        const portal = {
          type: "portal",
          value: pageLabel,
          to: pageId,
        };
        data.pages[page].elements.push(portal);
      }
      process(Object.values(node)[0], pageId, data);
      continue;
    }

    if (Array.isArray(node)) {
      process(node, page, data);
      continue;
    }

    if (isString(node)) {
      if (page) {
        const value = replaceNewlines(node, "\n");
        const pageElements = data.pages[page].elements;
        if (pageElements.length && pageElements[pageElements.length - 1].type === "text") {
          data.pages[page].elements[pageElements.length - 1].value += "\n" + value;
        } else {
          const text = {
            type: "text",
            value,
          };
          data.pages[page].elements.push(text);
        }
      }
    }
  }
  return data;
};

/**
 * Parse a imml text string
 * @param {string} text - the imml text to parse
 * @returns an object outlining the site structure to be used by the `render` function
 */
const parse = (text) => {
  const preprocessed = preprocess(text);
  const transformed = transform(preprocessed);
  const processed = process(transformed);
  return processed;
};

// helper function to streamline DOM element creation
const makeElement = (document, tag, { attributes, ...options } = {}) => {
  const element = Object.assign(document.createElement(tag), { ...options });
  if (attributes) {
    Object.entries(attributes).forEach(([attr, value]) => element.setAttribute(attr, value));
  }
  return element;
};

// a markdown rendererer for marked to customize a few parsing rules
const markedRenderer = new marked.Renderer();

// add target="_blank" to links to external websites
markedRenderer.link = (href, title, text) => {
  if (href.startsWith("#")) {
    return `<a class="portal inline" href="${href}">${text}</a>`;
  }
  return `<a class="external" target="_blank" href="${href}">${text}</a>`;
};

const immlEscape = (text) => {
  text = text.replace("\\$", "$");
  return text;
};

/**
 * Creates the imml site structure in the DOM
 * @param {object} data - the parsed imml data object returned by the `parse` function
 * @param {object} document - the document object, either document.window or a JSDOM
 * @param {HTMLElement} root - the element to create the site under, defaults to document.body
 */
const render = (data, document, root) => {
  let pages = document.querySelector("#imml .pages");
  const homeId = Object.entries(data.pages).find(([_, page]) => page.home)[0];
  if (!pages) {
    const container = makeElement(document, "div", { id: ["imml"] });
    pages = makeElement(document, "div", { classList: ["pages"] });
    container.appendChild(pages);
    (root || document.body).appendChild(container);
  }

  // helper function to check if an option is defined,
  // and execute a callback by destructuring its value appropriately
  const applyOption = (name, callback) => {
    if (name in data.options) {
      const value = data.options[name];
      const valueArray = value.includes(",") ? value.split(",").map((v) => v.trim()) : [value];
      callback(...valueArray);
    }
  };

  Object.entries(data.pages).forEach(([pageId, pageData]) => {
    const { elements, path, options } = pageData;

    // create page
    const page = makeElement(document, "div", {
      classList: ["page"],
      id: pageId,
    });
    pages.appendChild(page);

    // set page-specific options
    //TODO

    // create breadcrumbs
    const breadcrumbs = makeElement(document, "div", {
      classList: ["breadcrumbs"],
    });
    const slugs = path.split("/").slice(1);
    slugs.forEach((slug, index) => {
      const isLastSlug = index === slugs.length - 1;
      const breadCrumb = makeElement(document, isLastSlug ? "span" : "a", {
        textContent: data.pages[slug].label,
      });
      breadcrumbs.appendChild(breadCrumb);
      if (!isLastSlug) {
        breadCrumb.href = `#${slug === homeId ? "" : slug}`;
        breadcrumbs.appendChild(document.createTextNode(" / "));
      }
    });
    page.appendChild(breadcrumbs);

    // create page elements
    elements.forEach((element) => {
      switch (element.type) {
        case "portal":
          const portal = makeElement(document, "a", {
            classList: ["portal"],
            textContent: element.value,
            href: `#${element.to}`,
          });
          page.appendChild(portal);
          break;

        case "text":
          const text = marked(immlEscape(element.value), {
            renderer: markedRenderer,
            breaks: true,
            headerIds: false,
          });
          page.insertAdjacentHTML("beforeend", text);
          break;

        default:
          break;
      }
    });
  });

  // after all pages are generated, move the home page to be the last element in
  // the pages container to make the CSS target-selector page visiblity logic work
  const homePage = pages.querySelector(`#${homeId}`);
  pages.removeChild(homePage);
  pages.appendChild(homePage);

  // set global site options
  applyOption("theme", (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
  });

  applyOption("text-color", (light, dark) => {
    document.documentElement.style.setProperty("--imml-text-light", light);
    document.documentElement.style.setProperty("--imml-text-dark", dark || light);
  });

  applyOption("background-color", (light, dark) => {
    document.documentElement.style.setProperty("--imml-background-light", light);
    document.documentElement.style.setProperty("--imml-background-dark", dark || light);
  });

  applyOption("accent-color", (light, dark) => {
    document.documentElement.style.setProperty("--imml-accent-light", light);
    document.documentElement.style.setProperty("--imml-accent-dark", dark || light);
  });

  applyOption("style", (style) => {
    let siteStyle = style.replace("<style>", "").replace("</style>", "");
    let tag = document.head.querySelector("style.imml");
    if (!tag) {
      tag = makeElement(document, "style", { classList: ["imml"] });
      document.head.appendChild(tag);
    }
    tag.textContent = siteStyle;
  });

  applyOption("title", (title) => {
    document.title = title;
  });

  applyOption("description", (description) => {
    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = makeElement(document, "meta", {
        attributes: { name: "description", content: description },
      });
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", description);
  });
};

export { preprocess, transform, process, parse, render };
