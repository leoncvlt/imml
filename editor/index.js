import "./style.css";

import test from "./test.txt?raw";
import { preprocess, transform, process, render } from "../lib/imml";

const nodes = preprocess(test);
const tokens = transform(nodes);
const data = process(tokens);
render(data, document);
