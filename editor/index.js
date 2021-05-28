import "./style.css";
import "../lib/style.css";

import test from "./test.imml?raw";
import { preprocess, transform, process, render, parse } from "../lib/imml";

const nodes = preprocess(test);
console.log(nodes);
const tokens = transform(nodes);
console.log(tokens)
const data = process(tokens);
console.log(data)
// const data = parse(test);
render(data, document);
