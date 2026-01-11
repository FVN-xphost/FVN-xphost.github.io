<script lang="ts">
    import "../style/index.css";
    import { onMount } from "svelte";
    import MyMenuButton from "../components/input/MyMenuButton.svelte";
    import { sleep } from "../logic/all";
    import { boardText, galleryOpen } from "../store/store";
    import { window } from "@tauri-apps/api";
    import MyBlackBoard from "../components/board/MyBlackBoard.svelte";
    import { quadInOut } from "svelte/easing";
    import { fade } from "svelte/transition";
    import MyGalleryBoard from "../components/board/MyGalleryBoard.svelte";
    import MyTitleImg from "../assets/Home/title.png";
    let o1 = false;
    let o2 = false;
    let o3 = false;
    let o4 = false;
    let o5 = false;
    let o6 = false;
    onMount(async () => {
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
    });
    function fadeHomeButton(node: HTMLElement) {
        return {
            delay: 0,
            duration: 1500,
            easing: quadInOut,
            css: (t: number) =>
                `opacity: ${t}; transform: translateX(${t * 50 - 50}px)`,
        };
    }
</script>

{#if o1}
    <main class="container" in:fade={{ duration: 1500 }}>
        {#if o2}
            <img
                src={MyTitleImg}
                class="titleImage"
                alt="标题文字"
                in:fade={{ duration: 1500 }}
            />
        {/if}
        <div class="main-div">
            {#if o3}
                <div in:fadeHomeButton>
                    <MyMenuButton onclick={() => {}}>
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
                            console.log($galleryOpen);
                            galleryOpen.set(true);
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
        <div style="font-family: ShanHaiZhongXiaYe; color: #B22222;"><center style="font-size: 2rem;">关于与鸣谢：</center>
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
<MyGalleryBoard></MyGalleryBoard>

<style>
    .container {
        position: fixed;
        width: 100vw;
        height: 100vh;
        background: url(/src/assets/Home/back.png);
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        overflow: hidden;
    }
    .titleImage {
        position: absolute;
        width: 315px;
        height: 214px;
        top: 0;
        right: 0;
    }
    .main-div {
        position: absolute;
        width: 315px;
        height: calc(100% - 214px);
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 30px;
    }
</style>
