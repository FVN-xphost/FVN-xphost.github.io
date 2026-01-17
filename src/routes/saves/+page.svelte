<script lang="ts">
    import { onMount } from "svelte";
    import { sleep } from "../../utils/all";
    import { fade } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { saveData } from "../../store/store";
    import { quadInOut } from "svelte/easing";
    import MyMenuButton from "../../components/input/MyMenuButton.svelte";
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
            backDom.appendChild(ashDom);
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
    <div class="allsave" in:fade={{ duration: 1500 }}>
        <MyMenuButton
            onclick={() => goto("/")}
            style="position: fixed; right: 10px; bottom: 10px; z-index: 2;"
        >
            {#snippet children()}
                返回主菜单
            {/snippet}
        </MyMenuButton>
        <div class="flex">
            {#if no}
                <div class="grid" in:slideIn out:slideOut>
                    {#each Object.keys($saveData.saves).filter((_, index) => {
                        const pm = page - 1;
                        return index >= pm * saveLength && index < pm * saveLength + saveLength;
                    }) as item}
                        <div
                            class="save bg-img-full"
                            style="{!item.image
                                ? ''
                                : `background-image: ${item.image}`}}"
                            in:slideIn
                            out:slideOut
                        >
                            {item}
                        </div>
                    {/each}
                </div>
            {/if}
            <div class="pages">
                {#each Array(Math.ceil(Object.keys($saveData.saves).length / 4)) as _, index}
                    <button
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

<style>
    .allsave {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: linear-gradient(to bottom, gray, black);
    }
    .save {
        width: 195px;
        height: 120px;
        background-color: #303030;
        color: #101010;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        cursor: pointer;
        color: white;
        transition: background-color 0.2s;
    }
    .save:hover {
        background-color: #202020;
    }
    .flex {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        display: flex;
        flex-direction: column;
        width: 400px;
        height: 300px;
        gap: 10px;
        z-index: 2;
    }
    .grid {
        flex: 1;
        width: 100%;
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        grid-template-rows: minmax(0, 1fr) minmax(0, 1fr);
        gap: 20px 10px;
    }
    .pages {
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .pages > button {
        height: 100%;
        width: auto;
        aspect-ratio: 1 / 1;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        background-color: #303030;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .pages > button:hover {
        background-color: #202020;
    }
</style>
