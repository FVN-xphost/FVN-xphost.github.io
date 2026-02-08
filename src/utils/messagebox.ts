import { writable } from "svelte/store";

export const messagebox = writable({
  result: "",
  show: false,
});
export function showInputName(): Promise<string> {
  messagebox.set({
    result: "",
    show: true,
  });
  return new Promise((resolve) => {
    const unsubscribe = messagebox.subscribe((state) => {
      if (!state.show) {
        setTimeout(() => {
          resolve(state.result);
          unsubscribe();
        }, 400);
      }
    });
  });
}
