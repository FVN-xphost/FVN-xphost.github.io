<script lang="ts">
    import { sleep } from "../../utils/all";
    import { fade } from "svelte/transition";
    import { router } from "../../utils/all";
    import { saveData } from "../../store/store";
    import { quadInOut } from "svelte/easing";
    import "../../components/input/MyMenuButton";
    import { onMount } from "svelte";
    const saveLength = 4;
    let o1 = $state(false);
    let no = $state(true);
    onMount(async () => {
        o1 = true;
        await sleep(200);
        const backDom = document.querySelector(".allsave");
        for (let i = 0; i < 24; i++) {
            const ashDom = document.createElement("div");
            ashDom.classList.add("ash");
            ashDom.style.position = "fixed";
            ashDom.style.width = "4px";
            ashDom.style.height = "4px";
            ashDom.style.backgroundColor = "darkgray";
            ashDom.style.animation = "ash 6s infinite";
            ashDom.style.borderRadius = "50%";
            ashDom.style.zIndex = "1";
            ashDom.style.top = `${Math.random() * 80 + 20}vh`;
            ashDom.style.left = `${Math.random() * 100}vw`;
            await sleep(250);
            backDom!.appendChild(ashDom);
        }
    });
    let page = $state(1);
    function slideIn(node: HTMLElement) {
        return {
            delay: 0,
            duration: 750,
            easing: quadInOut,
            css: (t: number) => `transform: translateX(${100 - t * 100}vw)`,
        };
    }
    function slideOut(node: HTMLElement) {
        return {
            delay: 0,
            duration: 750,
            easing: quadInOut,
            css: (t: number) => `transform: translateX(-${100 - t * 100}vw)`,
        };
    }
</script>

{#if o1}
    <div
        class="allsave fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-[linear-gradient(to_bottom,gray,black)]"
        in:fade={{ duration: 1500 }}
    >
        <my-menu-button
            click={() => router.push("/")}
            style="position: fixed; right: 10px; bottom: 10px; z-index: 2;"
        >
            返回主菜单
        </my-menu-button>
        <div
            class="fixed top-0 left-0 right-0 bottom-0 m-auto flex flex-col w-100 h-75 gap-2.5 z-2"
        >
            {#if no}
                <div
                    class="flex-1 w-full grid grid-cols-2 grid-rows-2 gap-[5rem,2.5rem]"
                    in:slideIn
                    out:slideOut
                >
                    {#each Object.keys($saveData.saveObject).filter( (_, index) => {
                            const pm = page - 1;
                            return index >= pm * saveLength && index < pm * saveLength + saveLength;
                        }, ) as item}
                        <div
                            class="w-48.75 h-30 bg-[#303030] text-white flex items-center justify-center font-bold cursor-pointer duration-200 transition-[background-color] bg-img-full hover:bg-[#202020]"
                            style={$saveData.saveObject[item].image
                                ? `background-image: url(${$saveData.saveObject[item].image})`
                                : ""}
                            in:slideIn
                            out:slideOut
                            onclick={() =>
                                router.push(
                                    `/saves/${item.replace("save", "")}`,
                                )}
                            aria-label={$saveData.saveObject[item].name ??
                                "暂无存档"}
                            aria-hidden="true"
                        >
                            {$saveData.saveObject[item].image === undefined
                                ? "暂无存档"
                                : ""}
                        </div>
                    {/each}
                </div>
            {/if}
            <div class="h-7.5 flex items-center justify-between">
                {#each Array(Math.ceil(Object.keys($saveData.saveObject).length / 4)) as _, index}
                    <button
                        class="h-full w-auto aspect-square rounded-[50%] border-none cursor-pointer bg-[#303030] text-white flex items-center justify-center hover:bg-[#202020]"
                        aria-label={`第${index + 1}页`}
                        style={page === index + 1
                            ? "background-color: #101010"
                            : ""}
                        onclick={async () => {
                            no = false;
                            page = index + 1;
                            await sleep(350);
                            no = true;
                        }}>{index + 1}</button
                    >
                {/each}
            </div>
        </div>
    </div>
{/if}
