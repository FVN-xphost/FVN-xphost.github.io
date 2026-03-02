<script lang="ts">
    import GeorgeNocoat from "../../assets/illustration/george_nocoat.png";
    import GeorgeNoeye from "../../assets/illustration/george_noeye.png";
    import { fade } from "svelte/transition";
    import { sleep } from "../../utils/all";
    import { onMount } from "svelte";
    const { result = (res: string) => {} } = $props();
    import "../../components/input/MyStarBack";
    let resultValue = "";
    let o0 = $state(false);
    let o1 = $state(false);
    let o2 = $state(false);
    let o3 = $state(false);
    let o4 = $state(false);
    let o5 = $state(false);
    let v0 = $state("");
    let v1 = $state("");
    let v2 = $state("");
    onMount(async () => {
        await sleep(1000);
        sureName1();
    });
    function onInputblur(event: Event) {
        resultValue = (event.target as HTMLInputElement).value;
    }
    function returnResult() {
        result(resultValue);
    }
    async function showV2() {
        const v = `你的面前是一间办公室。<br />
准确的来说是一扇办公室的门，你还没有进去的打算，也尚未敲响它。<br />
20分钟前，你收到通知。<br />
这是你本行星年里第一次中断工作。<br />
出来时太过匆忙，以至于现在回想不起来，到底有没有关掉磁源机械臂，<br />
也许它还在那边重复着抓取、放下、抓取、放下……<br />
你感到冷，疲惫也跟着翻涌上来。<br />
走廊空调新风口的挡板坏掉了，机器的嗡嗡声伴着冷气一起垂降在你头顶。<br />
你再次看向了那扇门。`.split("<br />");
        for (let i = 0; i < v.length; i++) {
            v2 += v[i] + "<br />";
            await sleep(1000);
        }
    }
    async function showV1() {
        const v = `你是Aa-ω-7太空港垃圾分类操作中心的一名员工。<br />
得益于慷慨的员工成长计划，你能认得操作手册上的每一个字，并且肢体齐全。<br />
在其他方面……总之，你的能力足够让自己活到现在。加油，在未来继续保持。`.split(
            "<br />",
        );
        for (let i = 0; i < v.length; i++) {
            v1 += v[i] + "<br />";
            await sleep(1000);
        }
    }
    async function showV0() {
        const v = `输入文本`;
        for (let i = 0; i < v.length; i++) {
            v0 += v[i];
            await sleep(200);
        }
    }
    async function sureName1() {
        o0 = true;
        await sleep(1000);
        await showV0();
        await sleep(400);
        o2 = true;
    }
    async function sureName2() {
        o2 = false;
        o1 = true;
        await sleep(1500);
        o3 = true;
        await showV1();
        o4 = true;
        await sleep(2000);
        await showV2();
        await sleep(1000);
        o5 = true;
    }
    let o6 = $state(false);
    setInterval(async () => {
        o6 = true;
        await sleep(500);
        o6 = false;
    }, 5000);
</script>

<div
    class="back bg-img-full bg-[url(/src/assets/Home/back.jpg)] fixed top-0 left-0 w-screen h-screen bg-black z-999"
>
    <my-star-back></my-star-back>
    <div
        class="absolute left-0 w-screen transition-[top] duration-1000 h-[20vh] bg-[#FFF81D] z-15 flex flex-col items-center my-auto top-0 bottom-0
        before:content-['回想你的名字（默认：乔治）'] before:text-[2vh] before:text-[#bfbfbf] before:absolute before:top-[-4vh] before:-left-[35vh] before:w-fit before:mx-auto before:right-0"
        style={o1 ? "top: -40vh" : ""}
    >
        {#if o0}
            <div
                in:fade={{ duration: 400 }}
                out:fade={{ duration: 400 }}
                class="h-fit w-[40vh] transition-[width] duration-1000 border-l-8 border-l-black shrink-0 flex items-center"
                style={o1
                    ? "width: 60vh; margin-top: 0.8vh; margin-bottom: -1.5vh"
                    : "margin-top: auto; margin-bottom: auto;"}
            >
                <input
                    onblur={onInputblur}
                    placeholder={v0}
                    class="outline-none border-none pl-[1vh] -my-[1.5vh] py-0 font-bold placeholder:text-[#bfbfbf] text-[#bfbfbf]"
                    style="font-size: 7.9vh"
                />
            </div>
        {/if}
        {#if o3}
            <div class="h-[50%] w-[115vh] flex items-start mt-[2vh] justify-end">
                <div
                    class="text-left pl-[24vh] w-[100vh]"
                    style="font-size: 2vh;"
                >
                    {@html v1}
                </div>
            </div>
        {/if}
    </div>
    {#if o4}
        <div
            in:fade={{ duration: 400 }}
            out:fade={{ duration: 400 }}
            class="backdrop-blur-xs bg-[#00000066] border-3 z-10 border-[#FFF81D] border-solid absolute top-0 left-0 right-0 bottom-0 m-auto w-[115vh] h-[80vh]"
        >
            <div
                class="absolute bottom-[6vh] left-0 w-full flex flex-col items-center"
            >
                <div
                    class="border-l-8 border-l-[#FFF81D] overflow-hidden max-h-[8vh] flex items-center -my-[1vh] font-bold pl-[2vh] -ml-6 text-[#FFF81D]"
                    style="font-size: 7.4vh"
                >
                    办公室
                </div>
                <div
                    class="text-center text-gray-100 flex justify-center items-center relative h-[30vh] mt-[3vh] w-[75vh]"
                    style="font-size: 2vh;"
                >
                    <div class="animate-light-shine-before"></div>
                    <div class="animate-light-shine-before-before"></div>
                    <div class="animate-light-shine-after"></div>
                    <div class="animate-light-shine-after-after"></div>
                    {@html v2}
                </div>
            </div>
        </div>
    {/if}
    <img
        src={GeorgeNocoat}
        alt="George"
        class="absolute top-[6vh] -left-[105vh] right-0 mx-auto h-[94vh] z-20"
    />
    {#if o2}
        <button
            in:fade={{ duration: 400 }}
            out:fade={{ duration: 400 }}
            class="z-10 absolute cursor-pointer bottom-[30vh] h-[5vh] mx-auto left-0 right-0 w-[50vh] bg-white text-black hover:bg-[#FFF81D] active:bg-black active:text-white"
            aria-label="确定"
            onclick={sureName2}
        >
            确定
        </button>
    {/if}
    {#if o6}
        <img
            src={GeorgeNoeye}
            alt="GeorgeNoeye"
            class="absolute top-[6vh] -left-[105vh] right-0 mx-auto h-[94vh] z-21"
        />
    {/if}
    {#if o5}
        <button
            in:fade={{ duration: 400 }}
            out:fade={{ duration: 400 }}
            class="active:border active:border-solid active:border-[#FFF81D] z-10 absolute cursor-pointer bottom-[3vh] h-[4vh] mx-auto left-0 right-0 w-[25vh] bg-white text-black hover:bg-[#FFF81D] active:bg-black active:text-white"
            style="font-size: 2.6vh;"
            onclick={returnResult}
            aria-label="敲门"
        >
            敲门
        </button>
    {/if}
</div>

<style>
    .animate-light-shine-before {
        content: "";
        height: 1px;
        top: 50%;
        position: absolute;
        background-color: oklch(90.5% 0.182 98.111);
        animation: light-shine-before 3s;
    }
    .animate-light-shine-after {
        content: "";
        height: 1px;
        top: 50%;
        position: absolute;
        background-color: oklch(90.5% 0.182 98.111);
        animation: light-shine-after 3s;
    }
    .animate-light-shine-before-before {
        content: "";
        position: absolute;
        width: 1px;
        left: 0;
        height: calc(100% - 4vh);
        top: 2vh;
        background-color: oklch(90.5% 0.182 98.111);
        animation: light-shine-before-before 3s;
    }
    .animate-light-shine-after-after {
        content: "";
        position: absolute;
        width: 1px;
        right: 0;
        height: calc(100% - 4vh);
        top: 2vh;
        background-color: oklch(90.5% 0.182 98.111);
        animation: light-shine-after-after 3s;
    }
    @keyframes light-shine-before {
        0% {
            width: 0;
            left: 50%;
        }
        33% {
            width: 0;
            left: 50%;
        }
        48% {
            width: 50%;
            left: 0;
        }
        88% {
            width: 0;
            left: 0;
        }
    }
    @keyframes light-shine-after {
        0% {
            width: 0;
            right: 50%;
        }
        33% {
            width: 0;
            right: 50%;
        }
        48% {
            width: 50%;
            right: 0;
        }
        88% {
            width: 0;
            right: 0;
        }
    }
    @keyframes light-shine-before-before {
        0% {
            height: 0;
            top: 50%;
        }
        58% {
            height: 0;
            top: 50%;
        }
        100% {
            height: calc(100% - 4vh);
            top: 2vh;
        }
    }
    @keyframes light-shine-after-after {
        0% {
            height: 0;
            top: 50%;
        }
        58% {
            height: 0;
            top: 50%;
        }
        100% {
            height: calc(100% - 4vh);
            top: 2vh;
        }
    }
</style>
