<script lang="ts">
  import {
    type CellArray,
    type Sheet,
    SheetProxy,
    type ValueCell,
    type ValueCellArray,
    sort,
  } from "@okcontract/cells";

  import Item from "./Item.svelte";

  import { getSHA256Hash } from "./hash";
  import type { Todo } from "./types";

  export let sheet: Sheet;
  const proxy = new SheetProxy(sheet); // local for a page/component

  // this is our main list
  export const todos = proxy.new(
    [],
    "todos",
  ) as unknown as ValueCellArray<Todo>;
  // current selected value
  const nullCell = proxy.new<Todo | null>(null, "null");
  const selected = proxy.new(nullCell, "selected");
  // map async function
  const hash = selected.map(
    // @ts-ignore
    async (_todo) => (_todo ? getSHA256Hash(_todo.text) : nullCell),
    "hash",
  );

  // reactive count
  const count = todos.map((l) => l.length, "length", true);
  // reactive sorted list
  const sorted = sort(
    proxy,
    todos as CellArray<Todo>,
    (a, _b) => (a.completed ? 1 : -1),
    true,
  );

  let input = "";

  const newTodo = (input: string) =>
    proxy.new(
      { id: Date.now(), text: input, completed: false } as Todo,
      `item:${input}`,
    );

  const addTodo = () => {
    if (input.trim()) {
      todos.update((_todos) => [..._todos, newTodo(input)]);
      input = "";
    }
  };

  const deleteTodo = (id: number) => {
    if ($selected?.id === id) selected.set(nullCell);
    // @todo collect deleted cell
    todos.update((l) =>
      l.filter((todo: ValueCell<Todo>) => todo?.value?.id !== id),
    );
  };

  export let updateGraph: () => void;
  todos.subscribe(updateGraph);
  selected.subscribe(updateGraph);
</script>

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

<style>
  .hash {
    font-size: 14px;
    color: lightgray;
  }
</style>
