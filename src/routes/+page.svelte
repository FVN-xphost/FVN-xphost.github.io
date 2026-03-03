<script lang="ts">
    import "../style/index.css";
    import "../style/tailwind.css";
    import { onMount } from "svelte";
    import { branchCount, saveCount, sleep } from "../utils/all";
    import { init, closeWindow, reset } from "../utils/backend-tauri";
    import { currentSave, mounted, saveData } from "../store/store";
    import { fade } from "svelte/transition";
    import { router } from "../utils/all";
    import titlejpg from "../assets/Home/title.jpg";
    import MyStarBack from "../components/svelte/MyStarBack.svelte";
    let o1 = $state(false);
    let o2 = $state(false);
    let o3 = $state(false);
    let o4 = $state(false);
    let o5 = $state(false);
    let o6 = $state(false);
    let isStart = $state<number>(-1);
    onMount(async () => {
        if ($mounted) {
            isStart = 0;
            o1 = true;
            await sleep(1200);
            o2 = true;
            o3 = true;
            o4 = true;
            o5 = true;
            o6 = true;
            return;
        }
        mounted.set(true);
        init();
        o1 = true;
        await sleep(1200);
        o2 = true;
        await sleep(1500);
        isStart = 0;
    });
    async function showStart() {
        if (isStart === 0) {
            isStart = 1;
            // await sleep(300);
            o3 = true;
            // await sleep(300);
            o4 = true;
            // await sleep(300);
            o5 = true;
            // await sleep(300);
            o6 = true;
        }
    }
</script>

{#if o1}
    <div
        class="fixed flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-img-full bg-[url(/src/assets/Home/back.jpg)]"
        in:fade={{ duration: 1500 }}
        onclick={showStart}
        onkeydown={showStart}
        onkeyup={showStart}
        tabindex="0"
        role="button"
    >
        <MyStarBack></MyStarBack>
        {#if o2}
            <div
                in:fade={{ duration: 1500 }}
                class="absolute w-screen h-[30vh] top-[20vh] left-0 right-0 flex flex-col items-center overflow-auto"
            >
                <img
                    src={titlejpg}
                    alt="标题图片"
                    class="h-full w-auto shrink-0 max-w-none min-w-screen"
                />
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
                        class="flex-1 self-stretch px-2.5 bg-black text-[#FFF81D] mb-2.5 flex items-center justify-center"
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
                    class="flex flex-col absolute bottom-[10vh] h-[30vh] gap-1 left-0 right-0 w-[35vw] mx-auto
                    before:content-['主选单_/_存档'] before:absolute before:text-[0.9rem] before:text-[#00FFE5] before:-top-8 before:left-0"
                >
                    <div class="flex-3 flex flex-col overflow-auto gap-[0.6vh]">
                        {#each new Array(saveCount).fill(null) as _, index}
                            <div
                                class="border-white border-2 border-solid active:border-[#FFF81D] p-1"
                            >
                                <button
                                    aria-labelledby="存档"
                                    class="text-left flex items-center justify-between px-2 w-full h-[6vh] shrink-0 cursor-pointer transition-opacity duration-400 {$saveData
                                        .saveInstance[`save${index + 1}`].name
                                        ? `bg-[#FFF81D] text-black hover:bg-white active:bg-black active:text-white`
                                        : `bg-[#FFFFFF66] hover:bg-[#FFFFFF] active:bg-[#FFFFFF] text-black hover:text-black active:text-black`}"
                                    onclick={() => {
                                        if (
                                            $saveData.saveInstance[
                                                `save${index + 1}`
                                            ].name
                                        ) {
                                            currentSave.set(
                                                $saveData.saveInstance[
                                                    `save${index + 1}`
                                                ],
                                            );
                                            router.push("/saves");
                                        }
                                    }}
                                    >{@html `<div>${$saveData.saveInstance["save" + (index + 1)].name ? index + 1 + ". " + $saveData.saveInstance["save" + (index + 1)].name + "</div><div>" + ($saveData.saveInstance["save" + (index + 1)].updateTime ?? "") : index + 1 + ". 空存档"}</div>`}</button
                                >
                            </div>
                        {/each}
                    </div>
                    <button
                        aria-label="返回"
                        class="w-full flex-1 bg-[#FFF81D] text-black hover:bg-white active:bg-black active:text-white active:outline-2 active:outline-solid active:outline-[#FFF81D] cursor-pointer transition-opacity duration-400"
                        onclick={() => {
                            isStart = 1;
                        }}>返回</button
                    >
                </div>
            {:else if isStart === 1}
                <div
                    in:fade={{ duration: 1500 }}
                    out:fade={{ duration: 300 }}
                    class="flex flex-col absolute bottom-[10vh] h-[30vh] gap-[0.6vh] left-0 right-0 w-[35vw] mx-auto
                    before:content-['主选单_/'] before:absolute before:text-[0.9rem] before:text-[#00FFE5] before:-top-8 before:left-0"
                >
                    <button
                        aria-labelledby="新游戏"
                        class="w-full flex-1 bg-[#FFF81D] text-black hover:bg-white active:bg-black active:text-white active:outline-2 active:outline-solid active:outline-[#FFF81D] cursor-pointer transition-opacity duration-400"
                        style={`opacity: ${o3 ? "1" : "0"}`}
                        onclick={() => {
                            currentSave.set({
                                current: 0,
                                name: "",
                                remark: "",
                                saved: 0,
                                updateTime: 0,
                            });
                            for (let i = 0; i < branchCount; i++) {
                                currentSave.set({
                                    ...$currentSave,
                                    [`branch${i + 1}`]: "",
                                });
                            }
                            router.push("/saves");
                            // isStart = 2;
                        }}>新游戏</button
                    >
                    <button
                        aria-labelledby="存档"
                        class="w-full flex-1 bg-[#FFF81D] text-black hover:bg-white active:bg-black active:text-white active:outline-2 active:outline-solid active:outline-[#FFF81D] cursor-pointer transition-opacity duration-400"
                        style={`opacity: ${o4 ? "1" : "0"}`}
                        onclick={() => {
                            isStart = 2;
                        }}>存档</button
                    >
                    <button
                        aria-labelledby="画廊"
                        class="w-full flex-1 bg-[#FFF81D] text-black hover:bg-white active:bg-black active:text-white active:outline-2 active:outline-solid active:outline-[#FFF81D] cursor-pointer transition-opacity duration-400"
                        style={`opacity: ${o5 ? "1" : "0"}`}
                        onclick={() => router.push("/gallery")}>画廊</button
                    >
                    <button
                        aria-labelledby="退出"
                        class="w-full flex-1 bg-[#FFF81D] text-black hover:bg-white active:bg-black active:text-white active:outline-2 active:outline-solid active:outline-[#FFF81D] cursor-pointer transition-opacity duration-400"
                        style={`opacity: ${o6 ? "1" : "0"}`}
                        onclick={() => {
                            closeWindow();
                        }}>退出</button
                    >
                </div>
                <div
                    in:fade={{ duration: 1500 }}
                    out:fade={{ duration: 300 }}
                    class="absolute border border-[#FFF81D] border-solid p-1 bottom-[10vh] h-[30vh] left-[65vw] right-0 w-[20vw] mx-auto
                    before:content-['制作成员_/'] before:absolute before:text-[0.9rem] before:text-[#00FFE5] before:-top-8 before:left-0"
                >
                    <div
                        class="w-full h-full flex p-2 flex-col gap-1 bg-[#FFFFFF1C] transition-opacity duration-400 *:shrink-0 *:text-white overflow-auto"
                    >
                        <div>程序：</div>
                        <div class="ml-4">xphost</div>
                        <div>文案：</div>
                        <div class="ml-4">维特</div>
                        <div class="ml-4">阿瓜</div>
                        <div>UI：</div>
                        <div class="ml-4">阿瓜</div>
                        <div>美术：</div>
                        <div class="ml-4">糖圆</div>
                        <div class="ml-4">太阳饼</div>
                        <div class="ml-4">南司</div>
                        <div>音乐：</div>
                        <div class="ml-4">阿庆</div>
                        <div>特别鸣谢：</div>
                        <div class="ml-4">音效/背景</div>
                        <div class="ml-8">pixabay.com</div>
                        <div>本文所有 背景图片/音效 内容均出自于pixabay，</div>
                    </div>
                </div>
            {:else if isStart === 0}
                <div
                    in:fade={{ duration: 1500 }}
                    out:fade={{ duration: 300 }}
                    class="text-[#FFF81D] absolute bottom-[40vh] w-screen flex items-center justify-center"
                    style="animation: bling 2s infinite"
                >
                    单击以继续
                </div>
            {/if}
            <button
                class="fixed bottom-10 left-10 w-20 h-10 bg-[#FFF81D] border-none outline-none cursor-pointer hover:bg-white active:bg-black active:text-white"
                onclick={() => {
                    reset();
                }}
                aria-labelledby="重置">重置</button
            >
        {/if}
    </div>
{/if}

<style>
</style>
