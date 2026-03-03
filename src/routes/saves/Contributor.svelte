<script lang="ts">
    import { onMount } from "svelte";
    import { sleep } from "../../utils/all";
    import MyStarBack from "../../components/svelte/MyStarBack.svelte";

    const { result } = $props();
    function isScrollAtBottom(element: HTMLElement, threshold: number = 0) {
        return element.scrollTop + element.clientHeight >= element.scrollHeight - threshold;
    }
    let el: HTMLDivElement | null = $state(null);
    onMount(async () => {
        await sleep(100);
        el = document.querySelector(".back101") as HTMLDivElement;
    })
    setInterval(async () => {
        if(el) {
            el.scrollTop += 10;
            if(isScrollAtBottom(el)) {
                el = null;
                await sleep(1000);
                result();
                return;
            }
        }
    }, 50)
</script>
<div class="back101 w-screen h-screen fixed top-0 left-0 bg-black flex flex-col items-center *:text-white *:shrink-0 *:last:mb-[50vh] *:first:mt-[150vh] gap-[8vh]">
    <MyStarBack></MyStarBack>
    <div style="font-size: 5vh;" class="font-semibold">程序</div>
    <div style="font-size: 3vh;" class="font-light">xphost</div>
    <div style="font-size: 5vh;" class="font-semibold">文案</div>
    <div style="font-size: 3vh;" class="font-light">维特</div>
    <div style="font-size: 3vh;" class="font-light">阿瓜</div>
    <div style="font-size: 5vh;" class="font-semibold">美术</div>
    <div style="font-size: 3vh;" class="font-light">南司</div>
    <div style="font-size: 3vh;" class="font-light">太阳饼</div>
    <div style="font-size: 5vh;" class="font-semibold">UI</div>
    <div style="font-size: 3vh;" class="font-light">阿瓜</div>
    <div style="font-size: 5vh;" class="font-semibold">音乐</div>
    <div style="font-size: 3vh;" class="font-light">阿庆</div>
</div>