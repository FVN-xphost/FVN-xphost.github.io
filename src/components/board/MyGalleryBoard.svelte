<script lang="ts">
    import { fade } from "svelte/transition";
    import { galleryOpen } from "../../store/store";
    import { onMount } from "svelte";
    import { sleep } from "../../logic/all";
    import { galleryLock } from "../../store/store";
    import MyMenuButton from "../input/MyMenuButton.svelte";
    import { quadInOut } from "svelte/easing";
    let galleryTrans = $state(new Array($galleryLock.length).fill(false));
    onMount(async () => {
        await sleep(400);
        for (let i = 0; i < galleryTrans.length; i++) {
            galleryTrans[i] = true;
            await sleep(100);
        }
    });
    function rot1(node: HTMLElement) {
        return {
            delay: 0,
            duration: 400,
            easing: quadInOut,
            css: (t: number) => {
                return `transform: rotate(${t * 360}deg)`;
            }
        };
    }
    function rot2(node: HTMLElement) {
        return {
            delay: 0,
            duration: 400,
            easing: quadInOut,
            css: (t: number) => {
                return `transform: rotate(${t * 360}deg)`;
            }
        };
    }
</script>

{#if $galleryOpen}
    <div class="back" in:fade out:fade>
        <MyMenuButton
            onclick={() => {
                galleryOpen.set(false);
            }}
            style="position: absolute; bottom: 6px; right: 10px;"
        >
            {#snippet children()}
                返回
            {/snippet}
        </MyMenuButton>
        {#each $galleryLock as image, index}
            {#if galleryTrans[index]}
                <div in:rot1>
                    <div class="antrans"></div>
                    <div class="antrans2"></div>
                </div>
            {/if}
        {/each}
    </div>
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
    }
    .antrans, .antrans2 {
        width: calc(100% - 8rem);
        height: calc(100% - 8rem);
        background-color: white;
        margin: 4rem;
    }
</style>
