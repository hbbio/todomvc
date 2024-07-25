<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { quintOut } from "svelte/easing";
  import { scale } from "svelte/transition";

  import type { ValueCell } from "@okcontract/cells";

  import type { Todo } from "./types";
  const dispatch = createEventDispatcher();

  export let todo: ValueCell<Todo>; // cell for a single todo item
  export let selected;

  // local cell update, no need to have the list in this component
  const toggleTodo = () =>
    todo.update((_todo) => ({ ..._todo, completed: !_todo.completed }));
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="todo-item {$todo.completed ? 'completed' : ''} {$selected?.id ===
  $todo.id
    ? 'selected'
    : ''}"
  on:click={() => dispatch("select", todo)}
  transition:scale={{ delay: 250, duration: 300, easing: quintOut }}
>
  <input
    type="checkbox"
    checked={$todo.completed}
    on:click={() => toggleTodo()}
  />
  <span class="todo-text {$todo.completed ? 'completed-text' : ''}"
    >{$todo.text}</span
  >
  <button
    class="delete-btn"
    on:click|stopPropagation={() => dispatch("delete", $todo.id)}>Delete</button
  >
</div>

<style>
  .todo-item {
    background: white;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
  }

  .todo-item.completed {
    background: linear-gradient(45deg, #d9ead3 50%, #c8d9c3 100%);
    background-size: 10px 20px;
  }

  .selected {
    border: 5px solid #dee;
  }

  .completed-text {
    text-decoration: line-through;
    color: #777;
  }

  .delete-btn {
    margin-left: auto;
    background-color: #d9534f;
  }

  .delete-btn:hover {
    background-color: #c9302c;
  }
</style>
