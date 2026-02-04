import { invoke } from "@tauri-apps/api/core";
import { saveData } from "../store/store";
import { branchCount, galleryCount, saveCount } from "./all";

export async function init() {
  const savedata = JSON.parse(
    await invoke("get_all_data", {
      galleryCount: galleryCount,
      saveCount: saveCount,
      branchCount: branchCount,
    }),
  );
  console.log(savedata);
  saveData.set(savedata);
}
export async function save(
  id: string,
  updateTime: string,
  image: string,
  name: string,
  current: number,
  branches: Array<string>,
) {
  await invoke("update_save", {
    id,
    updateTime,
    image,
    name,
    current,
    branches,
  });
}
export async function unlockGallery(id: number) {
  await invoke("update_gallery", { id });
}
