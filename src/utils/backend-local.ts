import { saveData } from "../store/store";
import { branchCount, galleryCount, globalCount, saveCount } from "./all";
export async function init() {
  let savedata = JSON.parse(localStorage.getItem("spaceport_data") ?? "{}");
  if (savedata.gallery === undefined) savedata.gallery = {};
  if (savedata.saveInstance === undefined) savedata.saveInstance = {};
  if (savedata.globalVariable === undefined) savedata.globalVariable = {};
  for (let i = 1; i <= galleryCount; i++) {
    if (savedata.gallery[`gallery${i}`] === undefined)
      savedata.gallery[`gallery${i}`] = false;
  }
  for (let i = 1; i <= globalCount; i++) {
    if (savedata.globalVariable[`global${i}`] === undefined)
      savedata.globalVariable[`global${i}`] = false;
  }
  for (let i = 1; i <= saveCount; i++) {
    if (savedata.saveInstance[`save${i}`] === undefined)
      savedata.saveInstance[`save${i}`] = { current: 0, name: "", updateTime: "" };
    for (let j = 1; j <= branchCount; j++) {
      if (savedata.saveInstance[`save${i}`][`branch${j}`] === undefined)
        savedata.saveInstance[`save${i}`][`branch${j}`] = "";
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

export async function updateGlobalVariable(id: number, value: string) {
  let savedata = JSON.parse(localStorage.getItem("spaceport_data") ?? "{}");
  savedata.globalVariable[`global${id}`] = value;
  localStorage.setItem("spaceport_data", JSON.stringify(savedata));
}
export function closeWindow() {}
