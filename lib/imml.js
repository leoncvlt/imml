import marked from "marked";

const NEWLINE = "{{NEWLINE}}";

const startsIndentedBlock = (string) =>
  (string.startsWith("[") && string.endsWith("]")) || string.startsWith("$");

const preprocess = (data) => {
  const lines = data.split("\n");
  let result = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const node = {
      value: line.trim(),
      rawValue: line,
      indentation: line.search(/\S|$/),
    };
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

const transform = (nodes, level = 0, rawIndentation = 0) => {
  const stack = [];
  let indentationLevelGuess = 2;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const nextNode = i < nodes.length - 1 ? nodes[i + 1] : { indentation: -1 };
    const value = " ".repeat(rawIndentation) + node.value;
    if (node.indentation !== level) {
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

const isObject = (value) => {
  const type = typeof value;
  return value != null && (type === "object" || type === "function");
};

const isString = (value) => typeof value === "string" || value instanceof String;

const isOption = (node) => {
  let value = isObject(node) ? Object.keys(node)[0] : node;
  return value.startsWith("$");
};

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
      string += s.replaceAll(NEWLINE, "") + "\n";
      return string;
    };

    value = Object.values(option)[0].reduce(flatten, "");
  } else {
    const tokens = option.split(":");
    key = tokens[0].slice(1);
    value = tokens.slice(1, tokens.length).join(":").replaceAll(NEWLINE, "").trim();
  }
  return [key, value.trim()];
};

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
        const value = node.replaceAll(NEWLINE, "\n");
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

const parse = (data) => {
  const preprocessed = preprocess(data);
  const transformed = transform(preprocessed);
  const processed = process(transformed);
  return processed;
};

const makeElement = (document, tag, { attributes, ...options } = {}) => {
  const element = Object.assign(document.createElement(tag), { ...options });
  if (attributes) {
    Object.entries(attributes).forEach(([attr, value]) => element.setAttribute(attr, value));
  }
  return element;
};

const markdownRenderer = new marked.Renderer();
markdownRenderer.link = (href, title, text) => {
  if (href.startsWith("#")) {
    return `<a href="${href}">${text}</a>`;
  }
  return `<a target="_blank" href="${href}">${text}</a>`;
};

const immlEscape = (text) => {
  text = text.replace("\\$", "$");
  return text;
};

const render = (data, document, root) => {
  let pages = document.querySelector("#imml .pages");
  const homeId = Object.entries(data.pages).find(([_, page]) => page.home)[0];
  if (!pages) {
    const container = makeElement(document, "div", { id: ["imml"] });
    pages = makeElement(document, "div", { classList: ["pages"] });
    container.appendChild(pages);
    (root || document.body).appendChild(container);
  }

  Object.entries(data.pages).forEach(([pageId, pageData]) => {
    const { elements, path, options } = pageData;
    const page = makeElement(document, "div", {
      classList: ["page"],
      id: pageId,
    });
    pages.appendChild(page);
    console.log(options);
    if (options.style) {
      page.setAttribute("style", options.style);
    }

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
            renderer: markdownRenderer,
            breaks: true,
          });
          page.insertAdjacentHTML("beforeend", text);
          break;

        default:
          break;
      }
    });
  });

  const homePage = pages.querySelector(`#${homeId}`);
  pages.removeChild(homePage);
  pages.appendChild(homePage);

  if (data.options.style) {
    let style = document.head.querySelector("style.imml");
    if (!style) {
      style = makeElement(document, "style", { classList: ["imml"] });
      document.head.appendChild(style);
    }
    style.textContent = data.options.style;
  }
};

export { preprocess, transform, process, parse, render };
