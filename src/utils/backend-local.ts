import { saveData } from "../store/store";
import { branchCount, galleryCount, saveCount } from "./all";
export async function init() {
  let savedata = JSON.parse(localStorage.getItem("spaceport_data") ?? "{}");
  if (savedata.gallery === undefined) savedata.gallery = {};
  if (savedata.saveInstance === undefined) savedata.saveInstance = {};
  for (let i = 0; i < galleryCount; i++) {
    if (savedata.gallery[`gallery${i + 1}`] === undefined)
      savedata.gallery[`gallery${i + 1}`] = false;
  }
  for (let i = 0; i < saveCount; i++) {
    if (savedata.saveInstance[`save${i + 1}`] === undefined)
      savedata.saveInstance[`save${i + 1}`] = { current: 0, name: "" };
    for (let j = 0; j < branchCount; j++) {
      if (savedata.saveInstance[`save${i + 1}`][`branch${j + 1}`] === undefined)
        savedata.saveInstance[`save${i + 1}`][`branch${j + 1}`] = "";
    }
  }
  console.log(savedata);
  saveData.set(savedata);
  localStorage.setItem("spaceport_data", JSON.stringify(savedata));
}
export async function save(
  id: string,
  updateTime: string,
  name: string,
  current: number,
  branches: Array<string>,
) {
  let savedata = JSON.parse(localStorage.getItem("spaceport_data") ?? "{}");
  savedata.saveInstance[`save${id}`].current = current;
  savedata.saveInstance[`save${id}`].name = name;
  savedata.saveInstance[`save${id}`].remark = "";
  savedata.saveInstance[`save${id}`].updateTime = updateTime;
  for (let i = 0; i < branches.length; i++) {
    savedata.saveInstance[`save${id}`][`branch${i + 1}`] = branches[i];
  }
  localStorage.setItem("spaceport_data", JSON.stringify(savedata));
}
export async function unlockGallery(id: number) {
  let savedata = JSON.parse(localStorage.getItem("spaceport_data") ?? "{}");
  savedata.gallery[`gallery${id}`] = true;
  localStorage.setItem("spaceport_data", JSON.stringify(savedata));
}
export function closeWindow() {}
