export const sort = (
  proxy,
  arr,
  compare = (a, b) => (a > b ? 1 : a < b ? -1 : 0),
) => {
  let prev;
  let toDelete = [];

  return proxy.map(
    [arr],
    (cells) => {
      // garbage collector
      if (toDelete.length) {
        console.log("deleting", toDelete, proxy._sheet.dotGraph);
        // proxy._sheet.delete(toDelete);
        // toDelete = [];
        console.log("after deletion", toDelete, proxy._sheet.dotGraph);
      }
      const next = proxy.mapNoPrevious(
        cells,
        (..._cells) =>
          _cells
            .map((_, index) => index)
            .sort((indexA, indexB) => compare(_cells[indexA], _cells[indexB]))
            .map((index) => cells[index]),
        "sort.inner",
      );
      //   console.log({ next });
      if (prev && prev.id !== next.id) {
        console.log("toDelete", { prev: prev.id, next: next.id });
        toDelete.push(prev.id);
      }
      prev = next;
      return next;
    },
    "sort",
  );
};
