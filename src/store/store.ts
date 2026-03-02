import { writable } from "svelte/store";
export const saveData = writable<any>({});
export const currentSave = writable<any>({});
export const mounted = writable(false);
