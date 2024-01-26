<script>
  import { instance } from "@viz-js/viz";

  import { Sheet, SheetProxy, filter } from "@okcontract/cells";
  import { sort } from "./sort";

  const sheet = new Sheet(); // should be global for app
  // const debug = new Debugger(sheet);
  // window["debug"] = debug;
  const proxy = new SheetProxy(sheet); // local for a page/component

  import Item from "./Item.svelte";
  // import Explorer from "./Explorer.svelte";

  // sample async function
  const getSHA256Hash = async (input) => {
    const textAsBuffer = new TextEncoder().encode(input);
    const hashBuffer = await window.crypto.subtle.digest(
      "SHA-256",
      textAsBuffer,
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray
      .map((item) => item.toString(16).padStart(2, "0"))
      .join("");
    return hash;
  };

  // this is our main list
  export const todos = proxy.new([], "todos");
  // current selected value
  const nullCell = proxy.new(null, "null");
  const selected = proxy.new(nullCell, "selected");
  // map async function
  const hash = selected.map(
    async (_todo) => (_todo ? getSHA256Hash(_todo.text) : nullCell),
    "hash",
  );

  // reactive count
  const count = todos.map((l) => l.length, "length");
  // reactive sorted list
  const sorted = sort(proxy, todos, (a, b) => (a.completed ? 1 : -1));

  let input = "";

  const newTodo = (input) =>
    proxy.new(
      { id: Date.now(), text: input, completed: false },
      `item:${input}`,
    );

  const addTodo = () => {
    if (input.trim()) {
      todos.update((_todos) => [..._todos, newTodo(input)]);
      input = "";
    }
  };

  const deleteTodo = (id) => {
    if ($selected?.id === id) selected.set(nullCell);
    filter(todos, (todo) => todo.id !== id);
  };

  let graph;
  const updateGraph = () =>
    instance().then((viz) => {
      const svg = viz.renderSVGElement(sheet.dotGraph);
      graph.innerHTML = "";
      graph.appendChild(svg);
    });
  todos.subscribe(updateGraph);
  selected.subscribe(updateGraph);

  // sorted.subscribe((v) => console.log({ sorted: v }));
  $: ($todos || $selected || $sorted) &&
    console.log({
      sorted: sorted.id,
      pointed: sorted.pointed,
      count: sheet.stats.count,
    });
</script>

<div class="container">
  <div class="app">
    <input
      type="text"
      bind:value={input}
      on:keyup={(e) => e.key === "Enter" && addTodo()}
    />
    <button on:click={addTodo}>Add Todo</button>

    <!-- todo.id is the cell id :) -->
    {#each $sorted as todo (todo.id)}
      <!-- we pass the cell directly -->
      <Item
        {todo}
        {selected}
        on:delete={(ev) => {
          deleteTodo(ev.detail);
        }}
        on:select={(ev) => selected.set(ev.detail)}
      />
    {/each}

    <div>
      {$count} item{#if $count > 1}s{/if}
    </div>

    {#if $selected}
      <div class="hash">Selected ID: {$selected.id}</div>
      <!-- (cell {#key $selected}{selected.pointed}{/key}) -->
      <div class="hash">HASH: {$hash}</div>
    {/if}
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

  .hash {
    font-size: 14px;
    color: lightgray;
  }
</style>
