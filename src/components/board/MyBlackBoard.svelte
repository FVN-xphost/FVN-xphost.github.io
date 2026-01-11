<script lang="ts">
    import { fade } from "svelte/transition";
    import { boardText } from "../../store/store";
    import MyMenuButton from "../input/MyMenuButton.svelte";

    const { style = "" } = $props();
</script>

{#if $boardText !== ""}
    <div class="back" in:fade out:fade>
        <div class="myboard" {style}>
            <div class="boardcontent">
                {@html $boardText}
            </div>
        </div>
        <MyMenuButton
            onclick={() => boardText.set("")}
            style="position: absolute; bottom: 60px; right: 60px;"
        >
            {#snippet children()}返回{/snippet}
        </MyMenuButton>
    </div>
{/if}

<style>
    .back {
        backdrop-filter: blur(5px);
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0px;
        left: 0px;
    }
    .myboard {
        position: fixed;
        margin: auto;
        top: -100px;
        left: -100px;
        right: -100px;
        bottom: -360px;
        border-radius: 10px;
        background-image: url("../../assets/Home/board.png");
        background-size: 100% 100%;
        background-position: center;
        background-repeat: no-repeat;
    }
    .boardcontent {
        position: fixed;
        left: 8rem;
        right: 8rem;
        top: 8rem;
        bottom: 18rem;
    }
</style>
