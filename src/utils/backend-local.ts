import { saveData } from "../store/store";
import { branchCount, galleryCount, saveCount } from "./all";
export async function init() {
  let savedata = JSON.parse(localStorage.getItem("get_all_data") ?? "{}");
  if (savedata.gallery === undefined) savedata.gallery = {};
  if (savedata.saveInstance === undefined) savedata.saveInstance = {};
  if (savedata.saveObject === undefined) savedata.saveObject = {};
  for (let i = 0; i < galleryCount; i++) {
    if (savedata.gallery[`gallery${i + 1}`] === undefined)
      savedata.gallery[`gallery${i + 1}`] = false;
  }
  for (let i = 0; i < saveCount; i++) {
    if (savedata.saveObject[`save${i + 1}`] === undefined)
      savedata.saveObject[`save${i + 1}`] = {};
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
  localStorage.set("get_all_data", JSON.stringify(savedata));
}
export async function save(
  id: string,
  updateTime: string,
  image: string,
  name: string,
  current: number,
  branches: Array<string>,
) {
  let savedata = JSON.parse(localStorage.getItem("get_all_data") ?? "{}");
  savedata.saveInstance[`save${id}`].current = current;
  savedata.saveInstance[`save${id}`].name = name;
  savedata.saveObject[`save${id}`].remark = "";
  savedata.saveObject[`save${id}`].image = image;
  savedata.saveObject[`save${id}`].remark = "";
  savedata.saveObject[`save${id}`].updateTime = updateTime;
  for (let i = 0; i < branches.length; i++) {
    savedata.saveInstance[`save${id}`][`branch${i + 1}`] = branches[i];
  }
  localStorage.setItem("get_all_data", JSON.stringify(savedata));
}
export async function unlockGallery(id: number) {
  let savedata = JSON.parse(localStorage.getItem("get_all_data") ?? "{}");
  savedata.gallery[`gallery${id}`] = true;
  localStorage.setItem("get_all_data", JSON.stringify(savedata));
}
