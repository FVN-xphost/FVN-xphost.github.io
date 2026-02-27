<script lang="ts">
    import { currentSave, saveData } from "../../store/store";
    import { branchCount, saveCount, sleep } from "../../utils/all";
    import { save } from "../../utils/backend-tauri";
    import "../../components/input/MyStarBack"
    const { result } = $props();
    let showHint = $state(false);
    function getc(index: number): any {
        return $saveData.saveInstance["save" + (index + 1)];
    }
    function setc(index: number, value: any) {
        saveData.set({
            saveInstance: {
                ...$saveData.saveInstance,
                ["save" + (index + 1)]: value,
            },
        });
    }
    async function saveClick(index: number) {
        const date = new Date();
        const updateTime = `${date.getFullYear()}-${
            date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1
        }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()} ${
            date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
        }:${
            date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
        }:${
            date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
        }`;
        setc(index, { ...$currentSave, updateTime });
        await save(
            (index + 1).toString(),
            updateTime,
            $currentSave["name"],
            parseInt($currentSave["saved"]),
            parseInt($currentSave["current"]),
            new Array(branchCount)
                .fill(null)
                .map((_, index2) => $currentSave[`branch${index2 + 1}`]),
        );
        showHint = true;
        await sleep(3000);
        showHint = false;
    }
</script>

<div class="back bg-img-full bg-[url(/src/assets/Home/back.jpg)] fixed top-0 left-0 w-screen h-screen">
    <my-star-back></my-star-back>
    <div
        class="z-10 absolute top-0 left-0 bottom-0 right-0 m-auto w-[40vw] h-[40vh] flex flex-col gap-1 overflow-y-auto"
    >
        {#each new Array(saveCount).fill(null) as _, index}
            <div
                class="border-white border border-solid active:border-yellow-300 p-1 shrink-0"
            >
                <button
                    class="text-left flex items-center justify-between px-2 w-full h-[10vh] cursor-pointer {getc(
                        index,
                    ).name
                        ? 'bg-yellow-300 text-black hover:bg-white active:bg-black active:text-white'
                        : 'bg-[#FFFFFF4C] hover:bg-[#FFFFFF6C] active:bg-[#FFFFFF8C] text-black'}"
                    onclick={() => saveClick(index)}
                    aria-labelledby="存档"
                    >{@html `<div>${getc(index).name ? index + 1 + ". " + getc(index).name + "</div><div>" + (getc(index).updateTime ?? "") : index + 1 + ". 空存档"}</div>`}</button
                >
            </div>
        {/each}
    </div>
</div>
<button
    aria-labelledby="返回"
    onclick={result}
    class="cursor-pointer absolute bottom-[10vh] h-[10vh] w-[40vw] left-0 right-0 mx-auto bg-yellow-300 text-black hover:bg-white active:bg-black active:text-white"
>
    返回
</button>
<div
    class="bg-black border transition-[max-width] duration-200 whitespace-nowrap text-white border-white border-solid max-w-0 h-[10vh] absolute top-[4vh] left-0 flex items-center justify-start gap-2 overflow-x-hidden"
    style={`max-width: ${showHint ? "30vh" : ""}; font-size: 4vh;`}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-[7vh] h-[7vh] border-none outline-none cursor-pointer ml-2"
        viewBox="0 0 64 64"
        ><path
            fill="#3e4347"
            d="m61.3 9.3l-6.6-6.6c-.4-.4-1.2-.7-1.7-.7H9v4H5V2H3c-.5 0-1 .5-1 1v58c0 .5.5 1 1 1h58c.5 0 1-.5 1-1V11c0-.6-.3-1.3-.7-1.7"
        /><path
            fill="#fff"
            d="M12 62V34c0-1.1.9-2 2-2h36c1.1 0 2 .9 2 2v28z"
        /><path
            fill="#e8e8e8"
            d="M18 2v20c0 1.1.9 2 2 2h30c1.1 0 2-.9 2-2V2z"
        /><path fill="#3e4347" d="M36 6h10v16H36z" /><path
            fill="#fff"
            d="M59 56c0-.6-.5-1-1-1h-2c-.5 0-1 .4-1 1v2c0 .5.5 1 1 1h2c.5 0 1-.5 1-1z"
        /><path
            fill="#f15744"
            d="M12 54h40v8H12zm5-18h30v2H17zm0 6h30v2H17zm0 6h30v2H17z"
        /></svg
    >存档成功！
</div>
