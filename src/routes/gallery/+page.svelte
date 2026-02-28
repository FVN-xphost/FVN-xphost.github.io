<script lang="ts">
    import { fade } from "svelte/transition";
    import { sleep } from "../../utils/all";
    import { saveData } from "../../store/store";
    import "../../components/input/MyMenuButton";
    import { onMount } from "svelte";
    import { router } from "../../utils/all";
    import "../../components/input/MyStarBack";
    // 立绘资源
    import AndreyAll from "../../assets/illustration/andrey_all.png";
    import AndreyNohand from "../../assets/illustration/andrey_nohand.png";
    import AndreyNocloth from "../../assets/illustration/andrey_nocloth.png";
    import AndreyNoeye from "../../assets/illustration/andrey_noeye.png";
    import AndreyFace from "../../assets/illustration/andrey_face.png";
    import TonyCoat from "../../assets/illustration/tony_coat.png";
    import TonyShirt from "../../assets/illustration/tony_shirt.png";
    import TonyNoeye from "../../assets/illustration/tony_noeye.png";
    import GeorgeAll from "../../assets/illustration/george_all.png";
    import GeorgeNoall from "../../assets/illustration/george_noall.png";
    import GeorgeNocloth from "../../assets/illustration/george_nocloth.png";
    import GeorgeNocoat from "../../assets/illustration/george_nocoat.png";
    import GeorgeNovest from "../../assets/illustration/george_novest.png";
    import GeorgeNoeye from "../../assets/illustration/george_noeye.png";
    // CG 资源
    import TestCG from "../../assets/scene/bedroom.jpg";
    let o1 = $state(false);
    let cg = $state(0);
    const galleryLock = [
        {
            id: "1",
            images: [TestCG, TestCG, TestCG],
            name: "照顾",
        },
        {
            id: "2",
            images: [],
            name: "太空港",
        },
    ];
    const illustratorMan = [
        {
            name: "乔治-穿衣",
            image: GeorgeAll,
            eye: 1,
        },
        {
            name: "乔治-脱外套",
            image: GeorgeNocoat,
            eye: 1,
        },
        {
            name: "乔治-脱背心",
            image: GeorgeNovest,
            eye: 1,
        },
        {
            name: "乔治-脱上衣",
            image: GeorgeNocloth,
            eye: 1,
        },
        {
            name: "乔治-短裤",
            image: GeorgeNoall,
            eye: 1,
        },
        {
            name: "安德烈-穿衣",
            image: AndreyAll,
            eye: 2,
        },
        {
            name: "安德烈-无机械臂",
            image: AndreyNohand,
            eye: 2,
        },
        {
            name: "安德烈-脱衣",
            image: AndreyNocloth,
            eye: 2,
        },
        {
            name: "托尼-西装",
            image: TonyCoat,
            eye: 3,
        },
        {
            name: "托尼-脱外套",
            image: TonyShirt,
            eye: 3,
        },
    ];
    let galleryStyle = $state("opacity: 0;");
    let galleryImage = $state([]);
    async function showGallery(item: any) {
        if (!($saveData?.gallery ?? {})[`gallery${item.id}`]) return;
        console.log("success!", item);
        galleryStyle = "opacity: 0";
        await sleep(250);
        const c = document.querySelector(".gallery");
        c!.scrollLeft = 0;
        c?.addEventListener("wheel", (e: Event) => {
            e.preventDefault();
            c.scrollLeft += (e as WheelEvent).deltaY;
        });
        galleryImage = item.images;
        await sleep(50);
        galleryStyle = "opacity: 1";
    }
    let illustraEye = $state(0);
    let illustraReal = $state("");
    let illustraStyle = $state("opacity: 0;");
    async function showIllustration(item: any) {
        illustraStyle = `opacity: 0`;
        await sleep(250);
        illustraReal = item.image;
        await sleep(50);
        illustraEye = item.eye;
        illustraStyle = `opacity: 1`;
        mc = document.querySelectorAll(".mousecover") as any as HTMLElement[];
    }
    let mc = $state<HTMLElement[]>([]);
    onMount(async () => {
        o1 = true;
        await sleep(300);
        const back = document.querySelector(".back") as HTMLDivElement;
        back.addEventListener("mousemove", (e: MouseEvent) => {
            const x = window.innerWidth / 2 - e.pageX;
            const y = window.innerHeight / 2 - e.pageY;
            mc.forEach((el: HTMLElement) => {
                const xPos = x / 300;
                const yPos = y / 300;
                el.style.transform = `translateX(${xPos}px) translateY(${yPos}px)`;
            });
        });
    });
    let Eye = $state(true);
    setInterval(async () => {
        await sleep(Math.random() * 1000 + 2000);
        Eye = false;
        await sleep(500);
        Eye = true;
    }, 5000);
</script>

{#if o1}
    <div
        in:fade={{ duration: 1500 }}
        class="back bg-img-full bg-[url(/src/assets/Home/back.jpg)] fixed overflow-hidden left-0 top-0 w-screen h-screen flex"
    >
        <my-star-back></my-star-back>
        <div class="flex-1 h-full flex flex-col items-center z-10">
            <my-menu-button
                click={async () => {
                    cg = 0;
                    illustraStyle = `opacity: 0`;
                    await sleep(300);
                    cg = 1;
                }}
                style="margin-top: 3vh;">立绘</my-menu-button
            >
            <my-menu-button
                click={async () => {
                    cg = 0;
                    illustraStyle = `opacity: 0`;
                    await sleep(300);
                    cg = 2;
                }}
                style="margin-top: 3vh;"
                >C · G ·
            </my-menu-button>
        </div>
        <div class="flex-1 h-full z-10">
            {#if cg === 1}
                <div
                    in:fade={{ duration: 300 }}
                    out:fade={{ duration: 300 }}
                    class="w-full h-full flex flex-col items-center"
                >
                    {#each illustratorMan as item}
                        <my-menu-button
                            click={() => showIllustration(item)}
                            style="margin-top: 3vh"
                        >
                            {item.name}
                        </my-menu-button>
                    {/each}
                </div>
            {:else if cg === 2}
                <div
                    in:fade={{ duration: 300 }}
                    out:fade={{ duration: 300 }}
                    class="w-full h-full flex flex-col items-center"
                >
                    {#each galleryLock as item}
                        <my-menu-button
                            in:fade={{ duration: 300 }}
                            out:fade={{ duration: 300 }}
                            click={() => showGallery(item)}
                            style="margin-top: 3vh"
                        >
                            {($saveData?.gallery ?? {})[`gallery${item.id}`]
                                ? item.name
                                : "【Locked】"}
                        </my-menu-button>
                    {/each}
                </div>
            {/if}
        </div>
        <div class="w-[60vw] h-full relative z-10">
            {#if cg === 1}
                <div
                    in:fade={{ duration: 300 }}
                    out:fade={{ duration: 300 }}
                    class="mousecover transition-opacity duration-300 absolute w-fit bottom-0 h-[90%] mx-auto left-0 right-0"
                    style={illustraStyle}
                >
                    {#if !Eye}
                        <img
                            src={["", GeorgeNoeye, AndreyNoeye, TonyNoeye][
                                illustraEye
                            ]}
                            alt="眨眼"
                            class="absolute top-0 left-0 w-auto h-full"
                        />
                    {/if}
                    <img src={illustraReal} alt="立绘" class="w-auto h-full" />
                </div>
            {:else if cg === 2}
                <div
                    in:fade={{ duration: 300 }}
                    out:fade={{ duration: 300 }}
                    class="gallery border-yellow-300 border-2 border-dashed transition-opacity overflow-x-auto duration-300 w-[60vw] absolute left-0 right-0 top-0 bottom-0 my-auto aspect-16/10 flex"
                    style={galleryStyle}
                >
                    {#each galleryImage as gallery}
                        <img
                            src={gallery}
                            alt="C · G · "
                            class="w-[60vw] h-full shrink-0"
                        />
                    {/each}
                </div>
            {/if}
        </div>
        <my-menu-button
            click={() => {
                router.push("/");
            }}
            style="position: fixed; bottom: 10px; right: 16px; z-index: 10;"
        >
            返回
        </my-menu-button>
    </div>
{/if}
