import { writable, readable } from "svelte/store";
import Gallery1 from "../assets/gallery/gallery1.png";
import Gallery2 from "../assets/gallery/gallery2.png";
import Gallery3 from "../assets/gallery/gallery3.png";
import Gallery4 from "../assets/gallery/gallery4.png";
export const saveData = writable({});
export const boardText = writable("");
export const mounted = writable(false);
export const galleryPage = writable(1);
export const galleryLock = readable([
  {
    id: "1",
    images: [Gallery1, Gallery2, Gallery3, Gallery4],
  },
  {
    id: "2",
    images: [Gallery1, Gallery2, Gallery3, Gallery4],
  },
  {
    id: "3",
    images: [Gallery1, Gallery2, Gallery3, Gallery4],
  },
  {
    id: "4",
    images: [Gallery1, Gallery2, Gallery3, Gallery4],
  },
  {
    id: "5",
    images: [Gallery1, Gallery2, Gallery3, Gallery4],
  },
  {
    id: "6",
    images: [Gallery1, Gallery2, Gallery3, Gallery4],
  },
  {
    id: "7",
    images: [Gallery1, Gallery2, Gallery3, Gallery4],
  },
  {
    id: "8",
    images: [Gallery2, Gallery3, Gallery4, Gallery1],
  },
  {
    id: "9",
    images: [Gallery3, Gallery4, Gallery1, Gallery2],
  },
  {
    id: "10",
    images: [Gallery4, Gallery1, Gallery2, Gallery3],
  },
]);
