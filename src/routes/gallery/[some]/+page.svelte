<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import MyMenuButton from "../../../components/input/MyMenuButton.svelte";
    import { galleryLock } from "../../../store/store";
    const { params } = $props();
    const images = $galleryLock.find(
        (item: any) => item.id === params.some,
    )!.images;
    // function onDivWhell(e: WheelEvent) {
    //     e.preventDefault();
    //     const scrollAmount = e.deltaY || e.detail || -e.wheelDelta;
    //     div.scrollLeft += scrollAmount;
    // }
    // /** @type {HTMLDivElement} */
    // let div;
    onMount(() => {
        const c = document.querySelector(".gallery");
        c?.addEventListener("wheel", (e: Event) => {
            e.preventDefault();
            c.scrollLeft += (e as WheelEvent).deltaY;
        });
    });
</script>

<div class="gallery">
    {#each images as item, index}
        <img
            src={item}
            alt={`图片${index}`}
            style="flex-shrink: 0; position: relative; width: 100vw; height: 100vh;"
        />
    {/each}
    <MyMenuButton
        style="position: fixed; bottom: 10px; right: 10px;"
        onclick={() => {
            goto("/gallery");
        }}
    >
        {#snippet children()}
            返回
        {/snippet}
    </MyMenuButton>
</div>

<style>
    .gallery {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        overflow-x: auto;
    }
    .gallery::-webkit-scrollbar {
        display: none;
    }
</style>
