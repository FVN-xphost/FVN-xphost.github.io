import { writable } from "svelte/store";

export const messagebox = writable({
  title: "",
  content: "",
  type: "info",
  result: "",
  buttons: <string[]>[],
  show: false,
});
export function showMessageBox(
  title: string,
  content: string,
  type: "info" | "input" = "info",
  buttons: string[] = ["ok"],
): Promise<string> {
  messagebox.set({
    title,
    content,
    type,
    buttons,
    result: "",
    show: true,
  });
  return new Promise((resolve) => {
    const unsubscribe = messagebox.subscribe(async (state) => {
      if (!state.show) {
        setTimeout(() => {
          resolve(state.result);
          unsubscribe();
        }, 400);
      }
    });
  });
}
