<script lang="ts">
    import { onMount } from "svelte";
    import CS from '../../../assets/title/0.png'
    import C1 from '../../../assets/title/1.png'
    import Mask from '../../../assets/title/mask.png'
    const { chapter } = $props()
</script>
<div class="fixed top-0 left-0 w-screen h-screen back">
    <img class="absolute left-[50%] h-screen top-0 -translate-x-[50%] text" src={chapter === 0 ? CS : chapter === 1 ? C1 : ''} alt="文字">
    <img class="absolute left-[50%] h-screen top-0 -translate-x-[50%] mask" alt="蒙版" src={Mask}>
</div>
<style>
    .text {
        animation: CT 10s;
        transform: scale(0.8);
    }
    .mask {
        animation: CM 10s;
    }
    .back {
        animation: CB 10s;
    }
    @keyframes CT {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(0.8);
        }
    }
    @keyframes CM {
        0% {
            opacity: 0;
        }
        49% {
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
    }
    @keyframes CB {
        9% {
            background-color: transparent;
        }
        10% {
            background-color: #080808;
        }
        11% {
            background-color: transparent;
        }
        19% {
            background-color: transparent;
        }
        20% {
            background-color: #101010;
        }
        21% {
            background-color: transparent;
        }
        29% {
            background-color: transparent;
        }
        30% {
            background-color: #181818;
        }
        31% {
            background-color: transparent;
        }
        39% {
            background-color: transparent;
        }
        40% {
            background-color: #202020;
        }
        41% {
            background-color: transparent;
        }
        49% {
            background-color: transparent;
        }
        50% {
            background-color: #282828;
        }
        51% {
            background-color: transparent;
        }
    }
</style>