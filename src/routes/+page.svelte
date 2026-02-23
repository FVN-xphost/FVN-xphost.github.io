<script lang="ts">
    import "../style/index.css";
    import "../style/tailwind.css";
    import { onMount } from "svelte";
    import { saveCount, sleep } from "../utils/all";
    import { init, closeWindow, reset } from "../utils/backend-tauri";
    import { mounted, saveData } from "../store/store";
    import { fade } from "svelte/transition";
    import { router } from "../utils/all";
    import titlejpg from '../assets/Home/title.jpg'
    let o1 = $state(false);
    let o2 = $state(false);
    let o3 = $state(false);
    let o4 = $state(false);
    let o5 = $state(false);
    let o6 = $state(false);
    let isStart = $state<number>(-1);
    // 等待 1200 秒
    async function showStar() {
        let dom = document.getElementById("myBack");
        for (let i = 0; i < 120; i++) {
            let star = document.createElement("div");
            star.style.width = Math.random() / 4 + "vw";
            star.style.height = Math.random() / 4 + "vh";
            star.style.position = "absolute";
            star.style.top = Math.random() * 100 + "vh";
            star.style.left = Math.random() * 100 + "vw";
            star.style.backgroundColor = "white";
            star.style.borderRadius = "50%";
            star.style.opacity = (Math.random() * 0.7 + 0.3).toString();
            star.style.animation = `star ${Math.random() * 2 + 3}s infinite`;
            star.style.zIndex = "-1";
            dom?.appendChild(star);
            await sleep(10);
        }
    }
    onMount(async () => {
        if ($mounted) {
            isStart = 0;
            o1 = true;
            o2 = true;
            o3 = true;
            o4 = true;
            o5 = true;
            o6 = true;
            await sleep(300);
            await showStar();
            return;
        }
        mounted.set(true);
        init();
        o1 = true;
        await sleep(300);
        await showStar();
        o2 = true;
        await sleep(1500);
        isStart = 0;
    });
    async function showStart() {
        if (isStart === 0) {
            isStart = 1;
            await sleep(300);
            o3 = true;
            await sleep(300);
            o4 = true;
            await sleep(300);
            o5 = true;
            await sleep(300);
            o6 = true;
        }
    }
</script>

{#if o1}
    <div
        id="myBack"
        class="fixed w-screen h-screen overflow-hidden bg-img-full bg-[url(/src/assets/Home/back.jpg)]"
        in:fade={{ duration: 1500 }}
        onclick={showStart}
        onkeydown={showStart}
        onkeyup={showStart}
        tabindex="0"
        role="button"
    >
        {#if o2}
            <div
                in:fade={{ duration: 1500 }}
                class="absolute w-screen h-[30vh] top-[20vh] left-0 right-0 flex flex-col items-center overflow-auto"
            >
                <img src={titlejpg} alt="标题图片" class="h-full w-auto shrink-0 max-w-none min-w-screen">
                <!-- <div
                    class="flex-1 w-auto flex flex-col relative before:absolute before:bottom-2 before:-right-12 before:content-['v0.1.0']"
                >
                    <div
                        class="text-black font-bold whitespace-nowrap"
                        style="font-size: 16vh"
                    >
                        第一次离别
                    </div>
                    <div
                        class="flex-1 self-stretch px-2.5 bg-black text-yellow-300 mb-2.5 flex items-center justify-center"
                    >
                        <div
                            class="w-full h-px border border-t-gray-700 border-dashed"
                        ></div>
                    </div>
                </div> -->
            </div>
            {#if isStart === 2}
                <div
                    in:fade={{ duration: 1500 }}
                    out:fade={{ duration: 300 }}
                    class="flex flex-col absolute bottom-[10vh] h-[30vh] gap-1 left-0 right-0 w-[30vw] mx-auto
                    before:content-['主选单/存档'] before:absolute before:text-[0.75rem] before:text-yellow-300 before:-top-6 before:left-0"
                >
                    <div class="flex-3 flex flex-col overflow-auto gap-1">
                        {#each new Array(saveCount).fill(null) as _, index}
                            <button
                                aria-label="存档"
                                class="text-left px-2 w-full h-[6vh] shrink-0 bg-white text-black hover:bg-yellow-300 active:bg-black active:text-white cursor-pointer transition-opacity duration-400"
                                style={$saveData.saveInstance[
                                    `save${index + 1}`
                                ].name
                                    ? `display: flex; align-items: center; justify-content: space-between;`
                                    : ``}
                                onclick={() => {
                                    router.push("/saves/" + (index + 1));
                                }}
                                >{@html `<div>${$saveData.saveInstance["save" + (index + 1)].name ? index + 1 + ". " + $saveData.saveInstance["save" + (index + 1)].name + "</div><div>" + ($saveData.saveInstance["save" + (index + 1)].updateTime ?? "") : index + 1 + ". 空存档"}</div>`}</button
                            >
                        {/each}
                    </div>
                    <button
                        aria-label="返回"
                        class="w-full flex-1 bg-yellow-300 text-black hover:bg-white active:bg-black active:text-white cursor-pointer transition-opacity duration-400"
                        style={`opacity: ${o5 ? "1" : "0"}`}
                        onclick={() => {
                            isStart = 1;
                        }}>返回</button
                    >
                </div>
            {:else if isStart === 1}
                <div
                    in:fade={{ duration: 1500 }}
                    out:fade={{ duration: 300 }}
                    class="flex flex-col absolute border-white border border-solid bottom-[10vh] h-[30vh] p-1 gap-1 left-0 right-0 w-[20vw] mx-auto
                    before:content-['主选单/'] before:absolute before:text-[0.75rem] before:text-yellow-300 before:-top-6 before:left-0"
                >
                    <button
                        aria-label="开始游戏"
                        class="w-full flex-1 bg-yellow-300 text-black hover:bg-white active:bg-black active:text-white cursor-pointer transition-opacity duration-400"
                        style={`opacity: ${o3 ? "1" : "0"}`}
                        onclick={() => {
                            isStart = 2;
                        }}>开始游戏</button
                    >
                    <button
                        aria-label="画廊"
                        class="w-full flex-1 bg-yellow-300 text-black hover:bg-white active:bg-black active:text-white cursor-pointer transition-opacity duration-400"
                        style={`opacity: ${o4 ? "1" : "0"}`}
                        onclick={() => router.push("/gallery")}>画廊</button
                    >
                    <button
                        aria-label="退出游戏"
                        class="w-full flex-1 bg-yellow-300 text-black hover:bg-white active:bg-black active:text-white cursor-pointer transition-opacity duration-400"
                        style={`opacity: ${o5 ? "1" : "0"}`}
                        onclick={() => {
                            closeWindow();
                        }}>退出游戏</button
                    >
                </div>
                <div
                    in:fade={{ duration: 1500 }}
                    out:fade={{ duration: 300 }}
                    class="absolute border border-yellow-300 border-solid p-1 bottom-[10vh] h-[30vh] left-[50vw] right-0 w-[20vw] mx-auto
                    before:content-['制作成员/'] before:absolute before:text-[0.75rem] before:text-yellow-300 before:-top-6 before:left-0"
                >
                    <div
                        class="w-full h-full flex flex-col gap-1 bg-gray-600 transition-opacity duration-400 *:shrink-0 *:text-white overflow-auto"
                        style={`opacity: ${o3 ? "1" : "0"}`}
                    ></div>
                </div>
            {:else if isStart === 0}
                <div
                    in:fade={{ duration: 1500 }}
                    out:fade={{ duration: 300 }}
                    class="animate-bounce text-yellow-300 absolute bottom-[40vh] w-screen flex items-center justify-center"
                >
                    单击以继续
                </div>
            {/if}
            <button class="fixed bottom-10 left-10 w-20 h-10 bg-yellow-300 border-none outline-none cursor-pointer hover:bg-white active:bg-black active:text-white" onclick={() => {
                reset()
            }} aria-labelledby="重置">重置</button>
        {/if}
    </div>
{/if}
