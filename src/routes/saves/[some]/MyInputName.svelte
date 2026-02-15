<script lang="ts">
    import George from "../../../assets/illustration/george.png";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { sleep } from "../../../utils/all";
    const { result = (res: string) => {} } = $props();
    let resultValue = "";
    let o1 = $state(false);
    let o2 = $state(false);
    let o3 = $state(false);
    let oo = $state(false);
    let oo2 = $state(false);
    let o4 = $state(false);
    let o5 = $state(false);
    let v1 = $state("");
    let v2 = $state("");
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
你再次看向了那扇门。`;
        let boo = false;
        for (let i = 0; i < v.length; i++) {
            if (v[i] === "<") boo = true;
            else if (v[i] === ">") boo = false;
            v2 += v[i];
            if (!boo) {
                await sleep(20);
            }
        }
    }
    async function showV1() {
        const v = `你是Aa-ω-7太空港垃圾分类操作中心的一名员工。<br />
得益于慷慨的员工成长计划，你能认得操作手册上的每一个字，并且肢体齐全。<br />
在其他方面……总之，你的能力足够让自己活到现在。加油，在未来继续保持。`;
        let boo = false;
        for (let i = 0; i < v.length; i++) {
            if (v[i] === "<") boo = true;
            else if (v[i] === ">") boo = false;
            v1 += v[i];
            if (!boo) {
                await sleep(20);
            }
        }
    }
    async function sureName() {
        o1 = true;
        await sleep(1000);
        o2 = true;
        await sleep(100);
        o3 = true;
        await showV1();
        await sleep(500);
        oo = true;
    }
    async function sureScreen() {
        if (oo && !oo2) {
            o4 = true;
            oo2 = true;
            await sleep(2000);
            await showV2();
            await sleep(1000);
            o5 = true;
        }
    }
</script>

<div
    class="fixed top-0 left-0 w-screen h-screen bg-black z-999"
    onclick={sureScreen}
    role="button"
    onkeydown={(e) => {
        sureScreen();
    }}
    onkeyup={() => {}}
    tabindex="0"
>
    <div
        class="absolute left-0 w-screen transition-[top] duration-1000 h-[25vh] bg-yellow-300 z-10 flex flex-col items-center my-auto top-0 bottom-0
        before:content-['回想你的名字'] before:text-[2vh] before:text-yellow-300 before:absolute before:top-[-4vh] before:-left-[30vh] before:w-fit before:mx-auto before:right-0"
        style={o1 ? "top: -40vh" : ""}
    >
        <div
            class="h-[50%] w-[50vh] border-l-8 border-l-black shrink-0 flex items-center"
            style={o2
                ? ""
                : "top: 0; bottom: 0; height: fit-content; margin-top: auto; margin-bottom: auto;"}
        >
            <input
                onblur={onInputblur}
                placeholder="请输入名字"
                class="outline-none border-none pl-[2vh] font-bold"
                style="font-size: 6vh"
            />
        </div>
        {#if o3}
            <div class="h-[50%] w-[100vh] flex items-center justify-end">
                <div
                    class="text-left pl-[24vh] w-[100vh]"
                    style="font-size: 2vh"
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
            class="border border-yellow-300 border-solid absolute top-0 left-0 right-0 bottom-0 m-auto w-[105vh] h-[80vh]"
        >
            <div
                class="absolute bottom-4 left-0 w-full flex flex-col items-center"
            >
                <div
                    class="border-l-8 border-l-yellow-300 font-bold pl-6 -ml-6 text-yellow-300"
                    style="font-size: 6vh"
                >
                    办公室
                </div>
                <!-- <div
                    class="text-center text-gray-100 relative h-[30vh] mt-4 w-[70vh]
                    before:content-[''] before:w-px before:h-[calc(100%-3vh)] before:absolute before:-left-[3vh] before:top-0 before:bottom-[3vh] before:bg-yellow-300
                    after:content-[''] after:w-px after:h-[calc(100%-3vh)] after:absolute after:-right-[3vh] after:top-0 after:bottom-[3vh] after:bg-yellow-300"
                    style="font-size: 2vh"
                >
                    {@html v2}
                </div> -->
                <div
                    class="text-center text-gray-100 relative h-[30vh] mt-4 w-[70vh]"
                    style="font-size: 2vh"
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
        src={George}
        alt="George"
        class="absolute top-[6vh] -left-[95vh] right-0 mx-auto h-[94vh] z-20"
    />
    {#if !o1}
        <button
            class="absolute cursor-pointer bottom-[30vh] h-[5vh] mx-auto left-0 right-0 w-[50vh] bg-white text-black hover:bg-yellow-300 active:bg-black active:text-white"
            aria-label="确定"
            onclick={sureName}
        >
            确定
        </button>
    {/if}
    {#if o5}
        <button
            in:fade={{ duration: 300 }}
            out:fade={{ duration: 300 }}
            class="absolute cursor-pointer bottom-[2.5vh] h-[5vh] mx-auto left-0 right-0 w-[50vh] bg-white text-black hover:bg-yellow-300 active:bg-black active:text-white"
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
        height: 100%;
        top: 0;
        background-color: oklch(90.5% 0.182 98.111);
        animation: light-shine-before-before 3s;
    }
    .animate-light-shine-after-after {
        content: "";
        position: absolute;
        width: 1px;
        right: 0;
        height: 100%;
        top: 0;
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
            height: 100%;
            top: 0;
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
            height: 100%;
            top: 0;
        }
    }
</style>
