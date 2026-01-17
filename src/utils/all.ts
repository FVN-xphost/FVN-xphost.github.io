import { saveData } from "../store/store";
import { invoke } from "@tauri-apps/api/core";
export async function sleep(second: number) {
  return new Promise((resolve) => setTimeout(resolve, second));
}
export async function init() {
  const savedata = await invoke("get_all_data", {
    galleryCount: 10,
    saveCount: 40,
  });
  saveData.set(JSON.parse(savedata));
}
