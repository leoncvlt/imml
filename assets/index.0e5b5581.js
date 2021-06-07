var e=Object.defineProperty,t=Object.getOwnPropertySymbols,n=Object.prototype.hasOwnProperty,o=Object.prototype.propertyIsEnumerable,a=(t,n,o)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:o}):t[n]=o;import{m as i,W as s,l,e as r,K as d,a as c}from"./editor.worker.5a1d613e.js";var m="#imml a.portal:not(.inline) {\n  display: block;\n}\n\n#imml .pages > .page:target ~ .page:last-child,\n#imml .pages > .page {\n  display: none;\n}\n\n/* :last-child works, but for some reason .page:last-child will not */\n#imml .pages > :last-child,\n#imml .pages > .page:target {\n  display: block;\n}\n\n#imml .pages > :last-child .breadcrumbs {\n  visibility: hidden;\n}\n";const h=(e,t=0,n=0)=>{const o=[];let a=2;for(let s=0;s<e.length;s++){const l=e[s],r=s<e.length-1?e[s+1]:{value:"",indentation:-1},d=" ".repeat(n)+l.value;if(l.indentation===t)if(r.indentation>t){const c=l.value;if((i=c).startsWith("[")&&i.endsWith("]")||i.startsWith("$")){const t=h(e.slice(s+1),r.indentation);o.push({[c]:t})}else{a=r.indentation-t,o.push(d);const i=h(e.slice(s+1),r.indentation,n+a);o.push(...i)}}else{if(r.indentation<t)return o.push(d),o;o.push(d)}else if(l.indentation<t)return o}var i;return o},p=(e,t="")=>e.replace(new RegExp("{{NEWLINE}}","g"),t),u=e=>{const t=typeof e;return null!=e&&("object"===t||"function"===t)},g=e=>(u(e)?Object.keys(e)[0]:e).startsWith("$"),b=e=>{let t,n;if(u(e)){t=Object.keys(e)[0].split(":")[0].slice(1);const o=(e,t)=>{if(Array.isArray(t))for(const n of t)return o(e,n);return u(t)?(e+=Object.keys(t)[0]+"\n",o(e,Object.values(t)[0])):e+=p(t)+"\n"};n=Object.values(e)[0].reduce(o,"")}else{const o=e.split(":");t=o[0].slice(1),n=p(o.slice(1,o.length).join(":")).trim()}return[t,n.trim()]},f=(e,t=null,n=null)=>{n=n||{pages:{},options:{}};for(const a of e)if(g(a)){const[e,o]=b(a);(t?n.pages[t]:n).options[e]=o}else if(u(a)){const e=Object.keys(a)[0];let o=e.replace(/[\[\]']+/g,""),i=o;if(o.startsWith("."))continue;const s=o.match(/\(([^)]*)\)[^(]*$/);s&&s.length&&(i=s[1],o=o.replace(`(${i})`,""));let l=1;for(;o in n.pages;)o+=l;l++;const r=(t?n.pages[t].path:"")+"/"+o,d=0===Object.keys(n.pages).length,c=e.startsWith("[[")&&e.endsWith("]]");if(n.pages[o]={elements:[],options:{},home:d,path:r,label:i},t&&!c){const e={type:"portal",value:i,to:o};n.pages[t].elements.push(e)}f(Object.values(a)[0],o,n)}else if(Array.isArray(a))f(a,t,n);else if(("string"==typeof(o=a)||o instanceof String)&&t){const e=p(a,"\n"),o=n.pages[t].elements;if(o.length&&"text"===o[o.length-1].type)n.pages[t].elements[o.length-1].value+="\n"+e;else{const o={type:"text",value:e};n.pages[t].elements.push(o)}}var o;return n},y=(e,i,s={})=>{var l=s,{attributes:r}=l,d=((e,a)=>{var i={};for(var s in e)n.call(e,s)&&a.indexOf(s)<0&&(i[s]=e[s]);if(null!=e&&t)for(var s of t(e))a.indexOf(s)<0&&o.call(e,s)&&(i[s]=e[s]);return i})(l,["attributes"]);const c=Object.assign(e.createElement(i),((e,i)=>{for(var s in i||(i={}))n.call(i,s)&&a(e,s,i[s]);if(t)for(var s of t(i))o.call(i,s)&&a(e,s,i[s]);return e})({},d));return r&&Object.entries(r).forEach((([e,t])=>c.setAttribute(e,t))),c},w=new i.Renderer;w.link=(e,t,n)=>e.startsWith("#")?`<a class="portal inline" href="${e}">${n}</a>`:`<a class="external" target="_blank" href="${e}">${n}</a>`;const k=e=>({base:e,inherit:!0,rules:[{token:"imml.page",foreground:"d45434",fontStyle:"bold"}],colors:{}}),v=k("vs"),x=k("vs-dark");self.MonacoEnvironment={getWorker:(e,t)=>new s},l.register({id:"imml"}),l.setMonarchTokensProvider("imml",{defaultToken:"",tokenPostfix:".imml",control:/[\\`*_\[\]{}()#+\-\.!]/,noncontrol:/[^\\`*_\[\]{}()#+\-\.!]/,escapes:/\\(?:@control)/,jsescapes:/\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,empty:["area","base","basefont","br","col","frame","hr","img","input","isindex","link","meta","param"],tokenizer:{root:[[/^(\s{0,})(#+)((?:[^\\#]|@escapes)+)((?:#+)?)/,["white","keyword","keyword","keyword"]],[/^\s*(=+|\-+)\s*$/,"keyword"],[/^\s*((\*[ ]?)+)\s*$/,"meta.separator"],[/^\s*>+/,"comment"],[/^\s*([\*\-+:]|\d+\.)\s/,"keyword"],[/^\s*~~~\s*((?:\w|[\/\-#])+)?\s*$/,{token:"string",next:"@codeblock"}],[/^\s*```\s*((?:\w|[\/\-#])+)\s*$/,{token:"string",next:"@codeblockgh",nextEmbedded:"$1"}],[/^\s*```\s*$/,{token:"string",next:"@codeblock"}],{include:"@linecontent"},[/(^\$.*)((?::))(.*)/,["keyword","keyword","variable.source"]]],codeblock:[[/^\s*~~~\s*$/,{token:"string",next:"@pop"}],[/^\s*```\s*$/,{token:"string",next:"@pop"}],[/.*$/,"variable.source"]],codeblockgh:[[/```\s*$/,{token:"variable.source",next:"@pop",nextEmbedded:"@pop"}],[/[^`]+/,"variable.source"]],linecontent:[[/&\w+;/,"string.escape"],[/@escapes/,"escape"],[/\b__([^\\_]|@escapes|_(?!_))+__\b/,"strong"],[/\*\*([^\\*]|@escapes|\*(?!\*))+\*\*/,"strong"],[/\b_[^_]+_\b/,"emphasis"],[/\*([^\\*]|@escapes)+\*/,"emphasis"],[/`([^\\`]|@escapes)+`/,"variable"],[/\{+[^}]+\}+/,"string.target"],[/(!?\[)((?:[^\]\\]|@escapes)*)(\]\([^\)]+\))/,["string.link","","string.link"]],[/(!?\[[^.])((?:[^\]\\]|@escapes)*)(\]{0,2})/,"imml.page"],[/(!?\[\.)((?:[^\]\\]|@escapes)*)(\]{0,2})/,"comment"],[/\/\*/,"comment","@comment"],[/\/\/.*$/,"comment"],{include:"html"}],html:[[/\t<(\w+)\/>/,"tag"],[/<(\w+)/,{cases:{"@empty":{token:"tag",next:"@tag.$1"},"@default":{token:"tag",next:"@tag.$1"}}}],[/<\/(\w+)\s*>/,{token:"tag"}],[/<!--/,"comment","@comment"]],comment:[[/[^<\-]+/,"comment.content"],[/-->/,"comment","@pop"],[/<!--/,"comment.content.invalid"],[/[<\-]/,"comment.content"]],tag:[[/[ \t\r\n]+/,"white"],[/(type)(\s*=\s*)(")([^"]+)(")/,["attribute.name.html","delimiter.html","string.html",{token:"string.html",switchTo:"@tag.$S2.$4"},"string.html"]],[/(type)(\s*=\s*)(')([^']+)(')/,["attribute.name.html","delimiter.html","string.html",{token:"string.html",switchTo:"@tag.$S2.$4"},"string.html"]],[/(\w+)(\s*=\s*)("[^"]*"|'[^']*')/,["attribute.name.html","delimiter.html","string.html"]],[/\w+/,"attribute.name.html"],[/\/>/,"tag","@pop"],[/>/,{cases:{"$S2==style":{token:"tag",switchTo:"embeddedStyle",nextEmbedded:"text/css"},"$S2==script":{cases:{$S3:{token:"tag",switchTo:"embeddedScript",nextEmbedded:"$S3"},"@default":{token:"tag",switchTo:"embeddedScript",nextEmbedded:"text/javascript"}}},"@default":{token:"tag",next:"@pop"}}}]],embeddedStyle:[[/[^<]+/,""],[/<\/style\s*>/,{token:"@rematch",next:"@pop",nextEmbedded:"@pop"}],[/</,""]],embeddedScript:[[/[^<]+/,""],[/<\/script\s*>/,{token:"@rematch",next:"@pop",nextEmbedded:"@pop"}],[/</,""]]}}),l.setLanguageConfiguration("imml",{comments:{lineComment:"//",blockComment:["/*","*/"]},autoClosingPairs:[{open:"{",close:"}"},{open:"[",close:"]"},{open:"(",close:")"},{open:'"',close:'"',notIn:["string"]},{open:"'",close:"'",notIn:["string","comment"]},{open:"`",close:"`",notIn:["string","comment"]},{open:"/**",close:" */",notIn:["string"]}]});const A=()=>{let e=document.documentElement.getAttribute("theme");if(e)return e;let t="light";return localStorage.getItem("theme")?"dark"==localStorage.getItem("theme")&&(t="dark"):window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches&&(t="dark"),document.documentElement.setAttribute("data-theme",t),t};r.defineTheme("imml-theme","light"===A()?v:x);const S=r.create(document.getElementById("editor"),{value:localStorage.getItem("imml-document")||"$title: imml\n$description: generate static site from a single plain text file\n\n[home]\n    <img class=\"site-logo\" src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAICAYAAADjoT9jAAAAVElEQVQ4T7WSQQoAIAgE11/7BH9dKCUSCR7Uk9SwgxlhuAjAOg7tu8ozX8G9yESRrzD0FYgImNkCYg/A+QqjfDZB23lb0LNLe2qdclSgks6f8136Bh9eL5/EVkSDAAAAAElFTkSuQmCC'/>\n\n    `imml` (indented markdown markup language) is a markup language and static site generator whose purpose is to create minimalist, blazing fast no-javascript websites from a single, portable plain text file.\n\n    The project was born from the desire to have a process to build a personal website which doesn't get more complicated than editing a single text file and calling it a day. Could be the perfect choice for your blog, public brain dump, recipe list, no-fuss portfolio, low-fi zine, or anything you can think of.\n\n    ### features\n    - your whole website is a single, portable, offline, private plain text file\n    - blazing fast to load and build\n    - no javascript\n    - it's a [better motherfucking website](http://bettermotherfuckingwebsite.com/)\n    - makes you understand that _perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away_\n\n    ### using `imml`\n    Write in the editor on the left side and it will be parsed in real-time into the results shown on the right. Try that now! \n    \n    // That's it, try editing something below this line! (P.S. this is a comment and will be ignored!)\n    \n    The web-based editor saves to localstorage, so feel free to come back to it later on - or you can manually save and load a file by using the toolbar buttons on the top left. The export button exports your site as a single .html file.\n  \n    Alternatively, write a file locally on your machine and then, with node.js installed, run `npx imml <path to your text file>` to generate a minified html file. Run `npx imml --help` or [click here](#cli) to find out more about the command line tool.\n\n    ### basic writing guide\n    Wrap text between `[square brackets]` to create a page and a link to it, then indent and write markdown to create the content for that page. The first page in the imml document is your home. Nest pages to create a site structure.\n\n    [markdown(markdown showcase)]\n        ## Writing Markdown\n        Make words **bold** by wrapping them in `**` or *italic* by wrapping them in `*`. Add [inline links](http://github.com/leoncvlt) with this syntax: `[link text](url)`.\n        Insert a newline for a manual line break...\n\n        ...or more than one. Whatever flows your boat!\n\n        Start lines with a `#` to create headings. Multiple `##` in a row denote smaller heading sizes:\n\n        ### This is a third-tier heading\n\n        You can use one `#` all the way up to `######` six for different heading sizes.\n\n        To insert a quote, start lines with a `>`:\n\n        > Coffee. The finest organic suspension ever devised... I beat the Borg with it.\n        > - Captain Janeway\n\n        Make ordered lists by starting lines with numbers:\n\n        1. One\n        2. Two\n        3. Three\n\n        Or, to make unordered, bullet lists:\n\n        * Start a line with a star\n        * Keep listing\n\n        - Dashes work just as well\n        - To make sub-points, add two spaces before the next item:\n            - Like this\n            - And this\n\n        Add a separator with three  or more hyphens `---`:\n\n        ---\n\n        Wrap `code` in back-ticks `` ` `` to render code inline. Alternatively, fence a block of text with three back-ticks ` ``` ` to render a block of code:\n        ```\n        float Q_rsqrt( float number )\n        {\n            long i;\n            float x2, y;\n            const float threehalfs = 1.5F;\n\n            x2 = number * 0.5F;\n            y  = number;\n            i  = * ( long * ) &y;                       // evil floating point bit level hacking\n            i  = 0x5f3759df - ( i >> 1 );               // what the fuck? \n            y  = * ( float * ) &i;\n            y  = y * ( threehalfs - ( x2 * y * y ) );   // 1st iteration\n            y  = y * ( threehalfs - ( x2 * y * y ) );   // 2nd iteration, this can be removed\n\n            return y;\n        }\n        ```\n\n        Add images with this syntax: `![alt text](image_url)`\n        \n        ![Akira](https://i.pinimg.com/originals/39/95/0b/39950b377c4890460964775594a7c717.gif)\n\n        Add tables by using three or more hyphens `---` to create each column’s header, and use pipes `|` to separate each column:\n\n        | Title                 | Author                | Year\n        | --------------------- | --------------------- | ----\n        | The Forever War       | Joe Haldeman          | 1974\n        | Starship Troopers     | Robert A. Heinlein    | 1959\n        | Flowers for Algernon  | Daniel Keyes          | 1966\n        | Childhood's End       | Arthur C. Clarke      | 1953\n\n        You can also write html directly if you need to embed videos / iframes or create elements with specific classes:\n\n        <video controls src=\"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4\" style=\"width:100%;\"/>\n        \n\n    [guide(detailed writing guide)]\n        ### Pages\n        Wrap text between square brackets `[example]`, then indent the next line to create a new page. Anything you write in that indented block will then be part of this new page. All text inside pages is parsed as [markdown](#markdown).\n\n        When a page is created, its ID / hash `#` is inferred from the text inside the square brackets. As you can see from the address bar above, hashes are used to dictate which page is currently being displayed - this is achieved purely via CSS with the `target` selector.\n\n        ### Home page\n        The first page you create in the file is considered the home page of your site and will be displayed when no hash is specified. Anything before that is not rendered into the website - use that space for comments, attributions, or global `$options` (more on this later).\n\n        ### Nested pages\n        You can keep creating square-bracketed text in your page and indent again to create nested pages. When a page is created inside a page, a link to the new page is automatically added to the page at the position where the new indented nested block starts:\n\n        [newpage(Nested page)]\n            This page exists just to show an example of a nested page. There's really nothing else to see here! Use the breadcrumbs link at the top of the page to navigate back to a previous page.\n\n        Duplicated hashes / pages are automatically taken care of for you. If you create two pages `[page]` and `[page]`, the second one will be assigned a hash of `#page2`, but still be rendered as `page`.\n\n        ### Pages with label\n        If you want to use specify a label for the auto-generated link, include the label text between round brackets immediately before closing the square brackets: `[newpage(Fancy new page)]` will create a page with the hash `#newpage`, but the link to it will display `Fancy new page`.\n            \n        ### Hidden pages\n        If you prefer to not create a link automatically, wrap the text with double square brackets `[[example]]`. The page will still be created and inserted in the document structure, but it will be up to you to link your visitors to it. You can do so by creating a markdown link to the page hash: `[Link to the page](#hiddenpage)`. If your page ID has spaces in it, wrap the markdown link in `< >`: `[Link to the page](<#hidden page>)`\n\n        Note that when creating a hidden page, its location in the site still follows the indentation rules and will be reflected in the breadcrumbs at the top of the page.\n\n        ### Comments / draft pages\n        Any line that starts with `//` is a comment and won't be parsed. Any page that that starts with `.` (i.e.  `[.page]`) won't be parsed, nor inserted in the document structure. Good for drafts.\n\n        ### Options\n        Any line that starts with `$` is considered an `option` and is not displayed in the document structure, but it will be parsed and used under the bonnet to change the generated site appeareances / behaviour. \n        \n        Options ar written in the `$[option] : [value]` format, or can precede indented blocks for options with multi-line values, like the `$style` option:\n        ```\n        \\$style:\n            body {\n                background: red;\n            }\n        ```\n\n        When an `$option` is added before the home page / at indentation zero, its effect will be applied to the whole website. Otherwise, it's applied to the parent page. Note that some options are only valid in a context or the other.\n\n        For a full list of options and their effects, [click here](#options).\n\n        [[options]]\n            - `$background-color: <color> || <color-light>,<color-dark>`\n            Sets the color used for the page background. Can be a comma-separate set of two values, where the first value be used for the light theme and the second value for the dark theme. If a single value is supplied, it will be used on both themes.\n\n            - `$text-color: <color> || <color-light>,<color-dark>`\n            Sets the color used for the page text. Can be a comma-separate set of two values, where the first value be used for the light theme and the second value for the dark theme. If a single value is supplied, it will be used on both themes.\n            \n            - `$accent-color: <color> || <color-light>,<color-dark>`\n            Sets the color for links. Can be a comma-separate set of two values, where the first value be used for the light theme and the second value for the dark theme. If a single value is supplied, it will be used on both themes.\n\n            - `$theme: <light || dark>`\n            By default, sites will use the `prefers-color-scheme` query to resolve the theme based on the user's preference. Set this option to always force a specific theme.\n\n            - `$title: <title>`\n            Sets the site title and the content of the `title` head tag.\n\n            - `$description: <description>`\n            Sets the content of the `description` head meta tag.\n            \n            - `$style: <style rules>`\n            The value of this option will be appended as a `<style>` tag on the page. Can be set as an indented block to support multi-line text. for example, the following option will set the will set the page background to red:\n            ```\n            \\$style:\n                <style>\n                body {\n                    background: red;\n                }\n                </style>\n            ```\n            Note that it's not necessary to add the `<style></style>` tag, but doing so will enable css syntax highlighting.<br>\n            When set before the home page, the style will be applied to the same site. When set under a page, each rule will be prepended with the page ID so that the rules will only apply to that specific page.\n\n    [cli(command line interface)]\n        If you prefer to write locally, you can use the `imml` command line interface to generate the static html file.\n\n        With node.js installed, run `npx imml <path to your text file>`. By default it will create the file in a `dist` folder in your current working directory.\n        \n        The cli supports the following options:\n        ```\n        -o, --output <directory>  directory to export the generated html file to\n        -s, --style <file>        stylesheet file to use instead of the default one\n        -h, --help                display help for command\n        ```\n    \n    <br>\n\n    [madewith(made with imml)]\n        If you're using `imml` for a personal website, feel free to submit a pull request and add a link to your site. \n        \n        - [leoncvlt.com](https://leoncvlt.com)\n        - [mikroskeem.eu](https://mikroskeem.eu)\n        \n    ---\n\n    Made with ❤ by [leoncvlt](https://github.com/leoncvlt)\n\n$style:\n    <style>\n    img.site-logo {\n        height: 16px;\n        image-rendering: pixelated;\n    }\n    @media (prefers-color-scheme: dark) {\n        img.site-logo { \n            filter: invert(); \n        }\n    }\n    [data-theme=\"light\"] img.site-logo { \n        filter: none; \n    }\n    [data-theme=\"dark\"] img.site-logo { \n        filter: invert(); \n    }\n    a.external:after {\n        content: \" ↗\";\n    }\n    </style>",language:"imml",theme:"imml-theme",lineNumbers:!1,showFoldingControls:"always",wrappingIndent:"same",quickSuggestions:!1,wordWrap:"on",padding:{top:16},minimap:{enabled:!1},automaticLayout:!0});let $=null;const E=document.getElementById("site"),C=e=>{clearTimeout($);const t=e.saveViewState(),n=E.scrollTop;for(localStorage.setItem("imml-document",e.getValue());E.firstChild;)E.removeChild(E.lastChild);try{((e,t,n)=>{let o=t.querySelector("#imml .pages");const a=Object.entries(e.pages).find((([e,t])=>t.home))[0];if(!o){const e=y(t,"div",{id:["imml"]});o=y(t,"div",{classList:["pages"]}),e.appendChild(o),(n||t.body).appendChild(e)}const s=(t,n)=>{if(t in e.options){const o=e.options[t];n(...o.includes(",")?o.split(",").map((e=>e.trim())):[o])}};Object.entries(e.pages).forEach((([n,s])=>{const{elements:l,path:r,options:d}=s,c=y(t,"div",{classList:["page"],id:n});o.appendChild(c);const m=y(t,"div",{classList:["breadcrumbs"]}),h=r.split("/").slice(1);h.forEach(((n,o)=>{const i=o===h.length-1,s=y(t,i?"span":"a",{textContent:e.pages[n].label});m.appendChild(s),i||(s.href=`#${n===a?"":n}`,m.appendChild(t.createTextNode(" / ")))})),c.appendChild(m),l.forEach((e=>{switch(e.type){case"portal":const n=y(t,"a",{classList:["portal"],textContent:e.value,href:`#${e.to}`});c.appendChild(n);break;case"text":const o=i((e=>e.replace("\\$","$"))(e.value),{renderer:w,breaks:!0,headerIds:!1});c.insertAdjacentHTML("beforeend",o)}}))}));const l=o.querySelector(`#${a}`);o.removeChild(l),o.appendChild(l);const r=y(t,"style",{textContent:m});t.head.appendChild(r),s("theme",(e=>{t.documentElement.setAttribute("data-theme",e)})),s("text-color",((e,n)=>{t.documentElement.style.setProperty("--imml-text-light",e),t.documentElement.style.setProperty("--imml-text-dark",n||e)})),s("background-color",((e,n)=>{t.documentElement.style.setProperty("--imml-background-light",e),t.documentElement.style.setProperty("--imml-background-dark",n||e)})),s("accent-color",((e,n)=>{t.documentElement.style.setProperty("--imml-accent-light",e),t.documentElement.style.setProperty("--imml-accent-dark",n||e)})),s("style",(e=>{let n=e.replace("<style>","").replace("</style>",""),o=t.head.querySelector("style.imml");o||(o=y(t,"style",{classList:["imml"]}),t.head.appendChild(o)),o.textContent=n})),s("title",(e=>{t.title=e})),s("description",(e=>{let n=t.querySelector('meta[name="description"]');n||(n=y(t,"meta",{attributes:{name:"description",content:e}}),t.head.appendChild(n)),n.setAttribute("content",e)}))})((e=>{const t=(e=>{const t=e.split("\n");let n=[];for(let o=0;o<t.length;o++){const e=t[o],a={value:e.trim(),rawValue:e,indentation:e.search(/\S|$/)};if(a.value.startsWith("//"))continue;const i=n.length?n[n.length-1]:{value:"",indentation:0};a.value||!n.length?n.push(a):(i.value=i.value+"{{NEWLINE}}",n[n.length-1]=i)}return n})(e),n=h(t);return f(n)})(e.getValue()),document,E)}catch(o){console.error(o);const e=Object.assign(document.createElement("p"),{classList:["error"],textContent:o});E.append(e)}window.location.hash&&(window.location=window.location),E.scrollTo(0,n),e.restoreViewState(t),e.focus()};S.onDidChangeModelContent((e=>{clearTimeout($),$=setTimeout((()=>{C(S)}),1e3)})),S.addCommand(d.CtrlCmd|c.KEY_S,(()=>{C(S)})),C(S);document.querySelector("button.reset").addEventListener("click",(()=>{confirm("Clear local storage and reset the imml document?")&&(localStorage.removeItem("imml-document"),window.location.reload())})),document.querySelector("button.save").addEventListener("click",(()=>{const e=document.createElement("a"),t=new Blob([S.getValue()],{type:"text/plain"});e.href=URL.createObjectURL(t),e.download=`${(()=>{const e=S.getValue(),t=e.search(/^\$title/gm);if(-1!==t){const n=e.substring(t),o=n.substring(0,n.indexOf("\n")).split(":");return o[o.length-1].trim()}const n=e.split("\n");return n.length>0&&n[0]?n[0].trim():"my-imml-site"})()}.imml`,e.click(),URL.revokeObjectURL(e.href)}));const T=document.querySelector("input.load");document.querySelector("button.load").addEventListener("click",(()=>T.click())),T.addEventListener("change",(function(){const e=new FileReader;e.onload=()=>{S.setValue(e.result),C(S),this.value=null},e.readAsText(this.files[0])})),document.querySelector("button.export").addEventListener("click",(()=>{const e=document.querySelector("head title"),t=document.querySelector("head meta[name='description']"),n=document.querySelector("style.imml"),o=["<head>",null==e?void 0:e.outerHTML,null==t?void 0:t.outerHTML,'<meta charset="UTF-8">','<meta http-equiv="X-UA-Compatible" content="IE=edge">','<meta name="viewport" content="width=device-width, initial-scale=1.0">',`<style>${m}</style>`,"<style>:root {\n  --imml-text-light: #333333;\n  --imml-text-dark: #eeeeee;\n  --imml-background-light: #ffffff;\n  --imml-background-dark: #121212;\n  --imml-accent-light: dodgerblue;\n  --imml-accent-dark: dodgerblue;\n}\n\n:root {\n  --imml-background: var(--imml-background-light);\n  --imml-text: var(--imml-text-light);\n  --imml-text-inverse: var(--imml-text-dark);\n  --imml-accent: var(--imml-accent-light);\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --imml-background: var(--imml-background-dark);\n    --imml-text: var(--imml-text-dark);\n    --imml-text-inverse: var(--imml-text-light);\n    --imml-accent: var(--imml-accent-dark);\n  }\n}\n\nbody,\nhtml {\n  height: 100%;\n  width: 100%;\n  margin: 0;\n}\n\nbody {\n  font-family: sans-serif;\n  min-height: 100%;\n  color: var(--imml-text);\n  background: var(--imml-background);\n}\n\n.pages {\n  margin: 0 auto;\n  max-width: 600px;\n  padding-left: 1em;\n  padding-right: 1em;\n}\n\n.pages .page {\n  padding-top: 2em;\n  padding-bottom: 10em;\n}\n\n.page .breadcrumbs {\n  font-family: monospace;\n  text-transform: uppercase;\n  font-size: small;\n}\n\np {\n  line-height: 22px;\n}\n\na {\n  width: fit-content;\n  color: var(--imml-accent);\n  border-bottom: 1px dotted var(--imml-accent);\n  text-decoration: none;\n}\n\nhr {\n  border-style: solid;\n  border-bottom: 1px;\n  margin-top: 1em;\n  margin-bottom: 1em;\n}\n\nblockquote {\n  border-left: 0.5em solid var(--imml-text-inverse);\n  padding: 0 1em;\n}\n\nblockquote p {\n  font-style: italic;\n}\n\ncode {\n  background: var(--imml-text-inverse);\n  border-radius: 0.25em;\n  padding: 0em 0.25em;\n  font-family: monospace;\n  display: inline-block;\n}\npre code {\n  padding: 0.5em 0.5em;\n}\npre {\n  overflow-x: auto;\n}\n\nimg {\n  max-width: 100%;\n}\n\ntable {\n  margin-top: 0.25em;\n  border-collapse: collapse;\n  width: 100%;\n}\nthead {\n  text-align: left;\n  font-weight: bold;\n}\nthead tr {\n  border-bottom: 1px solid;\n}\ntr {\n  border-bottom: 1px dashed;\n}\ntd,\nth {\n  padding: 4px;\n}\n</style>",null==n?void 0:n.outerHTML,"</head>"].join(""),a=`<body>${document.getElementById("site").innerHTML}</body>`,i=new Blob([`<!doctype html><html>${o}${a}</html>`],{type:"text/yaml"}),s=document.createElement("a");s.href=URL.createObjectURL(i),s.download="index.html",s.click(),URL.revokeObjectURL(s.href)})),document.querySelector("button.theme").addEventListener("click",(()=>{"light"===A()?(localStorage.setItem("theme","dark"),document.documentElement.setAttribute("data-theme","dark"),r.defineTheme("imml-theme",x)):(localStorage.setItem("theme","light"),document.documentElement.setAttribute("data-theme","light"),r.defineTheme("imml-theme",v))}));const j=document.getElementById("loading");j.addEventListener("transitionend",(()=>j.remove())),j.classList.add("done");