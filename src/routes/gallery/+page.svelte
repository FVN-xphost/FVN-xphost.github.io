<script lang="ts">
    import { fade } from "svelte/transition";
    import { sleep } from "../../utils/all";
    import { onMount } from "svelte";
    import { router } from "../../utils/all";
    import MyStarBack from "../../components/svelte/MyStarBack.svelte";
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
    import Book from "../../assets/gallery/book.jpg";
    import Shower from "../../assets/gallery/shower.jpg";
    import Photo1 from "../../assets/gallery/photo1.jpg";
    import Photo2 from "../../assets/gallery/photo2.jpg";
    let o1 = $state(false);
    let cg = $state(0);
    let gs = $state(0);
    const galleryLock = [
        {
            images: [Book],
        },
        {
            images: [Photo1, Photo2],
        },
        {
            images: [Shower],
        },
    ];
    const illustratorMan = [
        {
            image: GeorgeAll,
            eye: 1,
        },
        {
            image: GeorgeNocoat,
            eye: 1,
        },
        {
            image: GeorgeNovest,
            eye: 1,
        },
        {
            image: GeorgeNocloth,
            eye: 1,
        },
        {
            image: GeorgeNoall,
            eye: 1,
        },
        {
            image: AndreyAll,
            eye: 2,
        },
        {
            image: AndreyNohand,
            eye: 2,
        },
        {
            image: AndreyNocloth,
            eye: 2,
        },
        {
            image: TonyCoat,
            eye: 3,
        },
        {
            image: TonyShirt,
            eye: 3,
        },
    ];
    let galleryStyle = $state("opacity: 0;");
    let galleryImage = $state([]);
    async function showGallery(item: any) {
        // if (!($saveData?.gallery ?? {})[`gallery${item.id}`]) return;
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
    async function load() {
        const skewbutton = document.querySelectorAll(
            ".skewbutton",
        ) as any as HTMLDivElement[];
        skewbutton.forEach((ele: HTMLDivElement) => {
            ele.addEventListener("mousemove", (e: MouseEvent) => {
                const rect = ele.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -25;
                const rotateY = ((x - centerX) / centerX) * 25;

                ele.style.transform = `scale(1.1) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            ele.addEventListener("mouseleave", () => {
                ele.style.transform = "scale(1) rotateX(0deg) rotateY(0deg)";
            });
        });
    }
    onMount(async () => {
        o1 = true;
        await sleep(300);
        await load();
        const back = document.querySelector(".back") as HTMLDivElement;
        back.addEventListener("mousemove", (e: MouseEvent) => {
            const x = window.innerWidth / 2 - e.pageX;
            const y = window.innerHeight / 2 - e.pageY;
            mc.forEach((el: HTMLElement) => {
                const xPos = x / 180;
                const yPos = y / 180;
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
        <MyStarBack></MyStarBack>
        <div
            class="shrink-0 w-[180px] h-full flex flex-col items-center justify-center z-10 px-[20px] gap-[40px] py-[60px]"
        >
            <button
                class="flex font-bold cursor-pointer items-start justify-center transition-all duration-200 wvr skewbutton flex-1 w-full border-3 border-solid border-[#FFF81D] bg-transparent text-white hover:bg-[#FFF81D] hover:text-black"
                aria-labelledby="角色"
                style="font-size: 3rem;"
                onclick={async () => {
                    if (cg !== 1) {
                        cg = 0;
                        gs = 0;
                        illustraStyle = `opacity: 0`;
                        await sleep(300);
                        cg = 1;
                    }
                }}
            >
                角色
            </button>
            <button
                class="flex font-bold cursor-pointer items-start justify-center transition-all duration-200 wvr skewbutton flex-1 w-full border-3 border-solid border-[#FFF81D] bg-transparent text-white hover:bg-[#FFF81D] hover:text-black"
                aria-labelledby="插画"
                style="font-size: 3rem;"
                onclick={async () => {
                    if (cg !== 2) {
                        cg = 0;
                        gs = 0;
                        galleryStyle = `opacity: 0`;
                        await sleep(300);
                        cg = 2;
                    }
                }}
            >
                插画
            </button>
        </div>
        <div
            class="shrink-0 w-[150px] h-full z-10 border-x-3 border-[#FFF81D] border-solid"
        >
            {#if cg === 1}
                <div
                    in:fade={{ duration: 300 }}
                    out:fade={{ duration: 300 }}
                    class="w-full h-full flex flex-col items-center px-4 py-8 gap-6 overflow-auto"
                >
                    {#each illustratorMan as item, index}
                        <button
                            aria-labelledby="角色"
                            class="relative shrink-0 cursor-pointer transition-all duration-200 skewbutton h-[80px] w-full border-2 border-solid border-[#FFF81D] bg-transparent text-white hover:bg-[#FFF81D] hover:text-black"
                            onclick={() => {
                                if (gs !== index + 1) {
                                    showIllustration(item);
                                    gs = index + 1;
                                }
                            }}
                            style={gs === index + 1
                                ? "background-color: oklch(90.5% 0.182 98.111)"
                                : ""}
                        >
                            <img
                                src={item.image}
                                alt="立绘"
                                class="absolute bottom-0 left-0 right-0 mx-auto h-[90%]"
                            />
                        </button>
                    {/each}
                </div>
            {:else if cg === 2}
                <div
                    in:fade={{ duration: 300 }}
                    out:fade={{ duration: 300 }}
                    class="w-full h-full flex flex-col items-center px-4 py-8 gap-6 overflow-auto"
                >
                    {#each galleryLock as item, index}
                        <button
                            aria-labelledby="插画"
                            class="shrink-0 cursor-pointer transition-all duration-200 skewbutton h-[80px] w-full border-2 border-solid border-[#FFF81D] bg-transparent text-white hover:bg-[#FFF81D] hover:text-black"
                            onclick={() => {
                                if (gs !== index + 1) {
                                    showGallery(item);
                                    gs = index + 1;
                                }
                            }}
                            style={gs === index + 1
                                ? "background-color: oklch(90.5% 0.182 98.111)"
                                : ""}
                        >
                            <img src={item.images[0]} alt="图片" style="width: 100%; height: 100%;">
                            <!-- {@html ($saveData?.gallery ?? {})[
                                `gallery${item.id}`
                            ]
                                ? `<img src="${item.images[0]}" alt="图片" style="width: 100%; height: 100%;">`
                                : "锁定中……"} -->
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
        <div
            class="flex-1 h-full relative z-10 flex flex-col justify-center items-center"
        >
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
                    class="gallery border-[#4a90e2] border-2 border-dashed transition-opacity overflow-x-auto duration-300 max-w-full max-h-[80%] aspect-16/10 flex"
                    style={galleryStyle}
                >
                    {#each galleryImage as gallery}
                        <img
                            src={gallery}
                            alt="C · G · "
                            class="w-full h-full shrink-0"
                        />
                    {/each}
                </div>
            {/if}
        </div>
        <button
            aria-labelledby="返回"
            onclick={() => {
                router.push("/");
            }}
            class="cursor-pointer bg-[#FFF81D] border-3 border-solid border-[#FFF81D] skewbutton px-10 py-4 fixed bottom-10 right-16 z-10"
        >
            返回
        </button>
    </div>
{/if}

<style>
    .skewbutton {
        transition:
            transform 0.1s ease-out,
            background-color 0.2s,
            color 0.2s;
    }
    .skewbutton:active {
        background-color: #000 !important;
        color: #ffeb3b !important;
        transform: scale(0.95) !important;
    }
</style>
