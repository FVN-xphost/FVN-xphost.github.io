import { invoke } from "@tauri-apps/api/core";
import { saveData } from "../store/store";
import { window } from "@tauri-apps/api";
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
  name: string,
  current: number,
  branches: Array<string>,
) {
  await invoke("update_save", {
    id,
    updateTime,
    name,
    current,
    branches,
  });
}
export async function unlockGallery(id: number) {
  await invoke("update_gallery", { id });
}

export function closeWindow() {
  window.getCurrentWindow().close();
}
