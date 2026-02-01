import { goto } from "$app/navigation";
export const branchCount = 7;
export const saveCount = 40;
export const galleryCount = 10;
export async function sleep(second: number) {
  return new Promise((resolve) => setTimeout(resolve, second));
}

export const router = {
  push: (path: string) => goto(path),
  replace: (path: string) => goto(path, { replaceState: true }),
  back: () => window.history.back(),
};
