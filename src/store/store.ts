import { writable, readable } from "svelte/store";
import Gallery1 from "../assets/gallery/gallery1.png";
import Gallery2 from "../assets/gallery/gallery2.png";
import Gallery3 from "../assets/gallery/gallery3.png";
import Gallery4 from "../assets/gallery/gallery4.png";
export const saveData = writable({
  gallery1: true,
  gallery2: false,
  gallery3: false,
  gallery4: false,
  gallery5: false,
  gallery6: false,
  gallery7: true,
  gallery8: false,
  gallery9: true,
  gallery10: true,
});
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
export const gamelevel = writable(-1);
