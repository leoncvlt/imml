import marked from "marked";

export const tokenize = (data) => {
  const lines = data.split("\n");
  const result = [];

  // holds the last paths recorded at specific intendation level ([level]:[path])
  const paths = {};
  let home = null;

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];

    // fetch the first previous valid (visible in DOM) token
    // if not, use a "dummy" token
    let previousToken = { type: "text", level: 0, path: "", visible: true };
    for (var j = result.length - 1; j >= 0; j--) {
      if (result[j].visible) {
        previousToken = { ...result[j], __index: j };
        break;
      }
    }

    const value = currentLine.trim();

    // exclude any empty lines at the beginning of the file
    if (!result.length && !value) continue;

    // create a basic object for the token, storing its indentation level
    // if the line is empty, default to the indentation level of the previous token
    const level = value.trim() ? currentLine.search(/\S|$/) : result.level;
    const path = paths[level] || "";
    const page = path.split("/")[path.split("/").length - 1];
    let token = { level, path, page };

    // if the line starts with $, it's a data variable in the form of [key]:[value]
    // otherwise, treat it as a simple text token
    if (value.startsWith("$")) {
      const s = value.split(":");
      token = {
        ...token,
        key: s[0].slice(1),
        data: s[s.length - 1].trim(),
        type: "data",
        visible: false,
        global: !home,
      };
    } else {
      token = {
        ...token,
        content: value,
        type: "text",
        visible: true,
      };
    }

    // if the current token is on a higher level than the previous one and
    // the previous valid token uses a portal syntax, turn the previous token
    // into a portal, and update the path for the new indentation level
    if (
      token.level > previousToken.level &&
      // token.visible &&
      previousToken.content?.startsWith("[") &&
      previousToken.content?.endsWith("]")
    ) {
      const portalText = previousToken.content.replace(/[\[\]']+/g, "");
      const newPath = previousToken.path + "/" + portalText;
      !home && (home = portalText);
      paths[token.level] = newPath;
      result[previousToken.__index] = {
        ...previousToken,
        content: portalText,
        link: portalText,
        type: "portal",
        visible: true,
        home: home === portalText,
      };
      token = {
        ...token,
        path: newPath,
      };
    }
    result.push(token);
  }
  return result;
};

const isFieldTrueish = (field) => {
  return field && field.toLowerCase() === "true";
};

export const parse = (tokens) => {
  let data = { pages: {}, options: {} };
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const previousToken = i > 0 ? tokens[i - 1] : { type: null };

    // identify the current page by the current token last path slug
    // cand create and object for it in the data structure if it doesn't exist
    const pathBits = (token.path || "").split("/");
    const currentPage = pathBits[pathBits.length - 1];

    // data tokens are not inserted into pages, but stored in
    // a separate "options" object
    if (token.type === "data" && !currentPage) {
      data = {
        ...data,
        options: { ...data.options, [token.key]: token.data },
      };
    }

    if (!currentPage) continue;

    if (!data.pages[currentPage]) {
      data = {
        ...data,
        pages: {
          ...data.pages,
          [currentPage]: {
            elements: [],
            path: token.path,
            home: !Object.keys(data.pages).length,
          },
        },
      };
      // if (isFieldTrueish(data.options["show-pages-title"])) {
      //   data.pages[currentPage].elements.push({
      //     type: "title",
      //     text: data.pages[currentPage].options?.title || currentPage
      //   });
      // }
    }

    switch (token.type) {
      case "data":
        data = {
          ...data,
          pages: {
            ...data.pages,
            [currentPage]: {
              ...data.pages[currentPage],
              options: { ...data.pages[currentPage].options, [token.key]: token.data },
            },
          },
        };
        break;
      case "text":
        // when parsing a text token, check wether the last element
        // on the current page is a text element - if so append the
        // text to it so it can transformed into a single text block
        if (previousToken.type !== "text" || previousToken.level !== token.level) {
          data.pages[currentPage].elements.push({
            type: "text",
            text: token.content,
          });
        } else {
          const pageElements = data.pages[currentPage].elements;
          //TODO: make this immutable
          data.pages[currentPage].elements[pageElements.length - 1].text += "\n" + token.content;
        }
        break;

      case "portal": {
        data.pages[currentPage].elements.push({
          type: "portal",
          text: token.content,
          to: token.link,
        });
        break;
      }

      default:
        break;
    }
  }

  return data;
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

export const render = (data, document, root = null) => {
  // create the root container for the website structure
  let pages = document.querySelector("#imml .pages");
  const homeId = Object.entries(data.pages).find(([_, page]) => page.home)[0];
  if (!pages) {
    const container = makeElement(document, "div", { id: ["imml"] });
    pages = makeElement(document, "div", { classList: ["pages"] });
    container.appendChild(pages);
    (root || document.body).appendChild(container);
  }
  Object.entries(data.pages).forEach(([pageId, pageData]) => {
    const { elements, path } = pageData;

    // iterate through the pages in the parsed data object
    // and create containers to host their elements
    const page = makeElement(document, "div", {
      classList: ["page"],
      id: pageId,
    });
    pages.appendChild(page);

    const breadcrumbs = makeElement(document, "div", {
      classList: ["breadcrumbs"],
    });
    const slugs = (path || "").split("/").slice(1);
    slugs.forEach((slug, index) => {
      const isLastSlug = index !== slugs.length - 1;
      const breadCrumb = makeElement(document, !isLastSlug ? "span" : "a", {
        textContent: slug,
      });
      breadcrumbs.appendChild(breadCrumb);
      if (isLastSlug) {
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
            textContent: element.text,
            href: `#${element.to}`,
          });
          page.appendChild(portal);
          break;

        case "text":
          const text = marked(element.text, { renderer: markdownRenderer });
          page.insertAdjacentHTML("beforeend", text);
          break;

        case "title":
          const title = makeElement(document, "h1", {
            classList: ["title"],
            textContent: element.text,
          });
          page.appendChild(title);
          break;

        default:
          break;
      }
    });
  });

  // once all pages have been processed, move the home page so that it appears
  // as the last children of the root container, in order to make the css-based
  // target selector page visibility logic work
  const homePage = pages.querySelector(`#${homeId}`);
  pages.removeChild(homePage);
  pages.appendChild(homePage);
};
