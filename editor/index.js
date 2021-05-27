import test from "./test.txt?raw";
import { tokenize, parse, render } from "../lib/imml";

const tokens = tokenize(test);
console.log(tokenize(test));

const parsed = parse(tokens);
console.log(parsed);

render(parsed, document);
