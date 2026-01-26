<script lang="ts">
    import "../style/index.css";
    import { onMount } from "svelte";
    import MyMenuButton from "../components/input/MyMenuButton.svelte";
    import { sleep, init } from "../utils/all";
    import { boardText, mounted, saveData } from "../store/store";
    import { window } from "@tauri-apps/api";
    import MyBlackBoard from "../components/board/MyBlackBoard.svelte";
    import { quadInOut } from "svelte/easing";
    import { fade } from "svelte/transition";
    import { showMessageBox } from "../utils/messagebox";
    import MyTitleImg from "../assets/Home/title.png";
    import { router } from "../utils/all";
    let o1 = $state(false);
    let o2 = $state(false);
    let o3 = $state(false);
    let o4 = $state(false);
    let o5 = $state(false);
    let o6 = $state(false);
    onMount(async () => {
        if ($mounted) {
            o1 = true;
            o2 = true;
            o3 = true;
            o4 = true;
            o5 = true;
            o6 = true;
        } else {
            init();
            o1 = true;
            await sleep(1500);
            o2 = true;
            await sleep(1500);
            o3 = true;
            await sleep(300);
            o4 = true;
            await sleep(300);
            o5 = true;
            await sleep(300);
            o6 = true;
            await sleep(300);
            mounted.set(true);
        }
    });
    function fadeHomeButton(node: HTMLElement) {
        return {
            delay: 0,
            duration: $mounted ? 0 : 1500,
            easing: quadInOut,
            css: (t: number) => {
                if (t < 0.6) {
                    return `opacity: ${t}; transform: translateY(${t * 100 - 40}px)`;
                } else {
                    return `opacity: ${t}; transform: translateY(${-50 * t + 50}px)`;
                }
            },
        };
    }
</script>

{#if o1}
    <main class="container bg-img-full" in:fade={{ duration: 1500 }}>
        {#if o2}
            <img
                src={MyTitleImg}
                class="titleImage"
                alt="标题文字"
                in:fade={{ duration: $mounted ? 0 : 1500 }}
            />
        {/if}
        <div class="main-div">
            {#if o3}
                <div in:fadeHomeButton>
                    <MyMenuButton
                        onclick={() => {
                            router.push("/saves");
                        }}
                    >
                        {#snippet children()}
                            开始游戏
                        {/snippet}
                    </MyMenuButton>
                </div>
            {:else}
                <div style="width: 120px; height: 35px;"></div>
            {/if}
            {#if o4}
                <div in:fadeHomeButton>
                    <MyMenuButton
                        onclick={() => {
                            router.push("/gallery");
                        }}
                    >
                        {#snippet children()}
                            画廊
                        {/snippet}
                    </MyMenuButton>
                </div>
            {:else}
                <div style="width: 120px; height: 35px;"></div>
            {/if}
            {#if o5}
                <div in:fadeHomeButton>
                    <MyMenuButton
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
                        }}
                    >
                        {#snippet children()}
                            关于与鸣谢
                        {/snippet}
                    </MyMenuButton>
                </div>
            {:else}
                <div style="width: 120px; height: 35px;"></div>
            {/if}
            {#if o6}
                <div in:fadeHomeButton>
                    <MyMenuButton
                        onclick={() => {
                            window.getCurrentWindow().close();
                        }}
                    >
                        {#snippet children()}
                            退出游戏
                        {/snippet}
                    </MyMenuButton>
                </div>
            {:else}
                <div style="width: 120px; height: 35px;"></div>
            {/if}
        </div>
    </main>
{/if}
<MyBlackBoard></MyBlackBoard>

<style>
    .container {
        position: fixed;
        width: 100vw;
        height: 100vh;
        background-image: url(/src/assets/Home/back.png);
        overflow: hidden;
    }
    .titleImage {
        position: absolute;
        width: 100vw;
        top: 0;
        left: 0;
        right: 0;
    }
    .main-div {
        position: absolute;
        width: 100vw;
        height: 100px;
        left: 0;
        bottom: 0;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        gap: 60px;
    }
</style>
