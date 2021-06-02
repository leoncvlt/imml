# `imml`

`imml` (indented markdown markup language) is a markup language and static site generator whose purpose is to create minimalist, blazing fast no-javascript websites from a single, portable plain text file.

The project was born from the desire to have a process to build a personal website which doesn't get more complicated than editing a single text file and calling it a day. Could be the perfect choice for your blog, public brain dump, recipe list, no-fuss portfolio, low-fi zine, or anything you can think of.

### features
- your whole website is a single, portable, offline, private plain text file
- blazing fast to load and build
- no javascript
- it's a [better motherfucking website](http://bettermotherfuckingwebsite.com/)
- makes you understand that _perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away_

### using `imml`
Visit https://leoncvlt.github.io/imml/ for a web-based `imml` editor. Write in the editor on the left side and it will be parsed in real-time into the results shown on the right. The web-based editor saves to localstorage, so feel free to come back to it later on - or you can manually save and load a file by using the toolbar buttons on the top left. The export button exports your site as a single .html file.

Alternatively, write a file locally on your machine and then, with node.js installed, run `npx imml <path to your text file>` to generate a minified html file. Run `npx imml --help` or [click here](#cli) to find out more about the command line tool.

### writing guide
Wrap text between `[square brackets]` to create a page and a link to it, then indent and write markdown to create the content for that page. The first page in the imml document is your home. Nest pages to create a site structure. For more advanced usage, check the [detailed writing guide](https://github.com/leoncvlt/imml/wiki/Writing-Guide) in the wiki.

### using as a library
```js
import { parse, render } from "imml";

// import the default style, or make your own
import "imml/lib/style.css"; 

const text = `
[home]
    Hello World!
    [foo]
        bar
`

const data = parse(text);
render(data, window.document);
```

## Support [![Buy me a coffee](https://img.shields.io/badge/-buy%20me%20a%20coffee-lightgrey?style=flat&logo=buy-me-a-coffee&color=FF813F&logoColor=white "Buy me a coffee")](https://www.buymeacoffee.com/leoncvlt)
If this tool has proven useful to you, consider [buying me a coffee](https://www.buymeacoffee.com/leoncvlt) to support development of this and [many other projects](https://github.com/leoncvlt?tab=repositories).