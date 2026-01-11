<script lang="ts">
    import { fade } from "svelte/transition";
    import { galleryOpen } from "../../store/store";
    import { sleep } from "../../logic/all";
    import { galleryLock } from "../../store/store";
    import MyMenuButton from "../input/MyMenuButton.svelte";
    import { quadInOut } from "svelte/easing";
    let galleryTrans1 = $state(new Array($galleryLock.length).fill(false));
    let galleryTrans2 = $state(new Array($galleryLock.length).fill(false));
    let galleryOpenUnsubscribe = galleryOpen.subscribe(async (value) => {
        if (value) {
            galleryTrans1 = new Array($galleryLock.length).fill(false);
            galleryTrans2 = new Array($galleryLock.length).fill(false);
            await sleep(400);
            for (let i = 0; i < $galleryLock.length; i++) {
                galleryTrans1[i] = true;
                await sleep(200);
                galleryTrans2[i] = true;
            }
        }
    });
    function rot1(node: HTMLElement) {
        return {
            delay: 0,
            duration: 1500,
            easing: quadInOut,
            css: (t: number, n: number) =>
                `opacity: ${t}; transform: rotate(${n * 30 + 10}deg)`,
        };
    }
    function rot2(node: HTMLElement) {
        return {
            delay: 0,
            duration: 1500,
            easing: quadInOut,
            css: (t: number, n: number) => {
                return `opacity: ${t}; transform: rotate(${n * 30}deg)`;
            },
        };
    }
</script>

{#if $galleryOpen}
    <div class="back" in:fade out:fade>
        {#each $galleryLock as item, index}
            <div style="position: relative;">
                {#if galleryTrans2[index]}
                    <div in:rot2 class="trans trans2"></div>
                {/if}
                {#if galleryTrans1[index]}
                    <div in:rot1 class="trans"></div>
                {/if}
            </div>
        {/each}
    </div>
    <MyMenuButton
        onclick={() => {
            galleryOpen.set(false);
        }}
        style="position: absolute; bottom: 6px; right: 10px; z-index: 10000;"
    >
        {#snippet children()}
            返回
        {/snippet}
    </MyMenuButton>
{/if}

<style>
    .back {
        position: fixed;
        left: 0;
        top: 0;
        width: 100vw;
        height: 100vh;
        background-image: url("../../assets/Home/paper2.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        grid-template-rows: repeat(2, minmax(0, 1fr));
    }
    .trans {
        width: 20vw;
        height: 30vh;
        background-color: white;
        transform-origin: 80% 80%;
        transform: rotate(10deg);
        position: absolute;
        top: calc(50% - 15vh);
        left: calc(50% - 10vw);
        background-color: gray;
        transition: box-shadow 0.2s;
    }
    .trans2 {
        transform: rotate(0);
        background-image: url("../../assets/gallery/galleryback.png");
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 10;
    }
    .trans2:hover {
        box-shadow: 0 0 12px purple;
        cursor: pointer;
    }
    .trans2:hover + .trans {
        box-shadow: 0 0 12px gray;
        cursor: pointer;
    }
</style>
