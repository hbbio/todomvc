<script lang="ts">
  import { instance } from "@viz-js/viz";

  import { Debugger, Sheet } from "@okcontract/cells";

  const sheet = new Sheet(); // global for app
  const debug = new Debugger(sheet);
  // @ts-ignore
  window["debug"] = debug;

  import List from "./List.svelte";

  let graph: HTMLElement;
  const updateGraph = () =>
    instance().then((viz) => {
      const svg = viz.renderSVGElement(debug.dot());
      graph.innerHTML = "";
      graph.appendChild(svg);
    });
</script>

<div class="container">
  <div class="app">
    <List {sheet} {updateGraph} />
  </div>
  <div class="graph">
    <div bind:this={graph} />
    <!-- <Explorer {sheet} /> -->
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-wrap: wrap;
  }

  .app {
    flex: 1;
    min-width: 50%;
  }

  .graph {
    flex: 1;
    width: 100% !important;
    height: auto !important;
    max-width: 100%;
  }

  :global(body) {
    font-family: "Arial", sans-serif;
    background-color: #f4f4f4;
    color: #333;
    padding: 20px;
    margin: 0;
  }

  :global(input[type="text"]) {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ddd;
    margin-right: 5px;
    width: 70%;
  }

  :global(button) {
    padding: 10px 15px;
    background-color: #5cb85c;
    color: white;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }

  :global(button:hover) {
    background-color: #4cae4c;
  }
</style>
