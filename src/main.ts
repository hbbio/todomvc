import { Debugger, Sheet } from "@okcontract/cells";

import "./app.css";
import App from "./App.svelte";

const sheet = new Sheet(); // global for app
const debug = new Debugger(sheet);
// @ts-ignore
window.debug = debug;

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const target = document.getElementById("app")!;
const app = new App({
	target,
	props: { sheet, debug },
});

export default app;
