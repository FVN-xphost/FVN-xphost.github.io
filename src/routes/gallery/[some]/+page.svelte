<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import "../../../components/input/MyMenuButton";
    import { galleryLock } from "../../../store/store";
    const { params } = $props();
    const images = $galleryLock.find(
        (item: any) => item.id === params.some,
    )!.images;
    onMount(() => {
        const c = document.querySelector(".gallery");
        c?.addEventListener("wheel", (e: Event) => {
            e.preventDefault();
            c.scrollLeft += (e as WheelEvent).deltaY;
        });
    });
</script>

<div class="fixed top-0 left-0 w-screen h-screen flex overflow-x-auto gallery">
    {#each images as item, index}
        <img
            src={item}
            alt={`图片${index}`}
            class="shrink-0 relative w-screen h-screen"
        />
    {/each}
    <my-menu-button
        style="position: fixed; bottom: 10px; right: 10px;"
        click={() => {
            goto("/gallery");
        }}
    >
        返回
    </my-menu-button>
</div>
