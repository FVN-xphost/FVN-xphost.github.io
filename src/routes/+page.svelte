<script lang="ts">
    import "../style/index.css";
    import "../style/tailwind.css";
    import { onMount } from "svelte";
    import { sleep } from "../utils/all";
    import { init } from "../utils/backend-tauri";
    import { boardText, mounted } from "../store/store";
    import { window } from "@tauri-apps/api";
    // import MyBlackBoard from "../components/board/MyBlackBoard.svelte";
    import "../components/board/MyBlackBoard";
    // import { quadInOut } from "svelte/easing";
    import { fade } from "svelte/transition";
    // import MyTitleImg from "../assets/Home/title.png";
    import { router } from "../utils/all";
    let o1 = $state(false);
    let o2 = $state(false);
    let o3 = $state(false);
    let o4 = $state(false);
    let o5 = $state(false);
    let o6 = $state(false);
    let isStart = $state<boolean | null>(null);
    onMount(async () => {
        if ($mounted) {
            isStart = false;
            o1 = true;
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
        await sleep(1500);
        o2 = true;
        await sleep(1500);
        isStart = false;
    });
    async function showStart() {
        if (isStart === false) {
            isStart = true;
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
        class="fixed w-screen h-screen overflow-hidden bg-img-full bg-[url(/src/assets/Home/back.png)]"
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
                class="absolute w-screen h-[30vh] bg-yellow-300 top-[20vh] left-0 right-0 flex flex-col items-center"
            >
                <div class="flex-1 w-auto flex flex-col">
                    <div class="text-black font-bold" style="font-size: 16vh">
                        第一次离别
                    </div>
                    <div
                        class="flex-1 self-stretch bg-black text-yellow-300 mb-2.5 flex items-center justify-center"
                    >
                        V0.1.0
                    </div>
                </div>
            </div>
            {#if isStart === true}
                <div
                    in:fade={{ duration: 1500 }}
                    out:fade={{ duration: 300 }}
                    class="flex flex-col absolute border-white border border-solid bottom-[10vh] h-auto p-1.5 gap-1.5 left-0 right-0 w-[20vw] mx-auto"
                >
                    {#if o3}
                        <div
                            in:fade={{ duration: 1500 }}
                            class="flex-1 w-full flex items-center justify-center"
                        >
                            <button
                                aria-label="开始游戏"
                                class="w-[calc(20vw-0.75rem)] h-8.75 bg-yellow-300 text-black hover:bg-white cursor-pointer"
                                onclick={() => router.push("/saves")}
                                >开始游戏</button
                            >
                        </div>
                    {:else}
                        <div class="w-30 h-8.75"></div>
                    {/if}
                    {#if o4}
                        <div
                            in:fade={{ duration: 1500 }}
                            class="flex-1 w-full flex items-center justify-center"
                        >
                            <button
                                aria-label="画廊"
                                class="w-[calc(20vw-0.75rem)] h-8.75 bg-yellow-300 text-black hover:bg-white cursor-pointer"
                                onclick={() => router.push("/gallery")}
                                >画廊</button
                            >
                        </div>
                    {:else}
                        <div class="w-30 h-8.75"></div>
                    {/if}
                    {#if o5}
                        <div
                            in:fade={{ duration: 1500 }}
                            class="flex-1 w-full flex items-center justify-center"
                        >
                            <button
                                aria-label="鸣谢"
                                class="w-[calc(20vw-0.75rem)] h-8.75 bg-yellow-300 text-black hover:bg-white cursor-pointer"
                                onclick={() => {
                                    boardText.set(`
        <div style="color: #B22222;"><center style="font-size: 2rem;">关于与鸣谢：</center>
        非常感谢每一位支持我的玩家！在这里着重感谢：<br>
        <!-- <span style="color: red;">秋风残叶</span> 谢谢你的陪伴，让我在游戏生涯中少走了很多弯路。<br>
        <span style="color: orange">迟暮の夜莺</span> 也同样感谢你的陪伴！<br>
        如果没有上述两位，我可能无法制作出这款游戏！接下来是游戏设计、美术和编程的各位。<br>
        <span style="color: yellow"></span> -->
        </div>
        `);
                                }}>鸣谢</button
                            >
                        </div>
                    {:else}
                        <div class="w-30 h-8.75"></div>
                    {/if}
                    {#if o6}
                        <div
                            in:fade={{ duration: 1500 }}
                            class="flex-1 w-full flex items-center justify-center"
                        >
                            <button
                                aria-label="退出游戏"
                                class="w-[calc(20vw-0.75rem)] h-8.75 bg-yellow-300 text-black hover:bg-white cursor-pointer"
                                onclick={() =>
                                    window.getCurrentWindow().close()}
                                >退出游戏</button
                            >
                        </div>
                    {:else}
                        <div class="w-30 h-8.75"></div>
                    {/if}
                </div>
            {:else if isStart === false}
                <div
                    in:fade={{ duration: 1500 }}
                    out:fade={{ duration: 300 }}
                    class="animate-bounce text-yellow-300 absolute bottom-[40vh] w-screen flex items-center justify-center"
                >
                    单击以继续
                </div>
            {/if}
        {/if}
    </div>
{/if}
{#if $boardText !== ""}
    <my-black-board
        in:fade={{ duration: 400 }}
        out:fade={{ duration: 400 }}
        boardText={$boardText}
        close={() => boardText.set("")}
    ></my-black-board>
{/if}
