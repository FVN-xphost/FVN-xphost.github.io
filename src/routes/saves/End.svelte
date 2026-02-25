<script lang="ts">
    import { onMount } from "svelte";
    import { sleep } from "../../utils/all";

    const { endText, result } = $props();
    let endRealText = $state("");
    onMount(async () => {
        let boo = false;
        for (let i = 0; i < endText.length; i++) {
            if (endText[i] === "<") boo = true;
            else if (endText[i] === ">") boo = false;
            endRealText += endText[i];
            if (!boo) {
                await sleep(150);
            }
        }
        await sleep(3000);
        result();
    });
</script>

<div
    class="fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center"
>
    <div class="w-auto h-auto text-center endText text-white" style="font-size: 6vh !important;">
        {@html endRealText}<span class="cursor inline-block">&nbsp;&nbsp;</span>
    </div>
</div>
<style>
    :global(.endText *) {
        font-size: 6vh !important;
        color: white;
    }
    .cursor {
        background-color: white;
        animation: cursorAnimation 1s infinite linear;
    }
    @keyframes cursorAnimation {
        0% {
            background-color: transparent;
        }
        50%{
            background-color: white;
        }
        100% {
            background-color: transparent;
        }
    }
</style>
