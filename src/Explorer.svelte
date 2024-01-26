<script lang="ts">
  import type { Sheet } from "@okcontract/cells";
  export let sheet: Sheet;

  let current: number = 0;

  $: cell = sheet.get(current);
  $: pointed = cell.pointed;
</script>

<input type="number" bind:value={current} />

<button on:click={() => {}}>refresh</button>
<div>
  Cell #{cell.id}
  {#if pointed}
    {@const pc = sheet.get(pointed)}
    <div>=> {pointed}</div>
    <div>{JSON.stringify(pc.value)}</div>
  {:else}
    <div>{JSON.stringify(cell.value)}</div>
  {/if}
</div>
