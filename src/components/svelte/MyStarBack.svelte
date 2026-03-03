<script lang="ts">
    import { onMount } from "svelte";
    import StarUp from "../../assets/Home/star_up.png";
    import StarMiddle from "../../assets/Home/star_middle.png";
    import StarDown from "../../assets/Home/star_down.png";
    import { sleep } from "../../utils/all";

    let layers: HTMLImageElement[] = [];
    onMount(async () => {
        await sleep(100);
        const back = document.querySelector(".back100") as HTMLDivElement;
        if (!back) return;

        for (let i = 0; i < 3; i++) {
            const starback = document.createElement("img") as HTMLImageElement;
            starback.src = [StarDown, StarMiddle, StarUp][i];
            starback.style.maxHeight = "none";
            starback.style.maxWidth = "none";
            starback.style.width = `${i * 30 + 80}vw`;
            starback.style.height = `${i * 30 + 80}vh`;
            starback.style.zIndex = (i + 1).toString();
            starback.style.position = "absolute";
            starback.style.transition = "transform 0.2s ease-out";
            starback.classList.add("starback");
            starback.setAttribute("data-speed", (i * 40 + 20).toString());

            back.appendChild(starback);
            layers.push(starback);
        }
        window.addEventListener("mousemove", handleMouseMoveEvent)
    });
    function handleMouseMoveEvent(e: MouseEvent) {
        const x = window.innerWidth / 2 - e.pageX;
        const y = window.innerHeight / 2 - e.pageY;

        layers.forEach((layer) => {
            const speed = parseInt(layer.getAttribute("data-speed")!);
            const xPos = (x * speed) / 500;
            const yPos = (y * speed) / 500;
            layer.style.transform = `translateX(${xPos}px) translateY(${yPos}px)`;
        });
    }
</script>

<div
    class="back100 w-screen h-screen flex flex-col items-center justify-center fixed top-0 left-0 overflow-hidden bg-img-full bg-[url(/src/assets/Home/back.jpg)]"
></div>
