import { writable, readable } from "svelte/store";
export const saveData = writable<any>({});
export const mounted = writable(false);
export const galleryPage = writable(1);
export const galleryLock = readable<{ id: string; images: string[] }[]>([
  {
    id: "1",
    images: [],
  },
  {
    id: "2",
    images: [],
  },
  {
    id: "3",
    images: [],
  },
  {
    id: "4",
    images: [],
  },
  {
    id: "5",
    images: [],
  },
  {
    id: "6",
    images: [],
  },
]);
