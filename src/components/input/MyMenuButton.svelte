<script lang="ts">
    let { class: className = "", style = "", children, onclick } = $props();
</script>

<button class={["mybutton", "bg-img-full", className]} {style} {onclick}>
    {@render children?.()}
</button>

<style>
    .mybutton {
        font-family: Silver;
        width: 120px;
        height: 35px;
        background-image: url("../../assets/Home/mybutton-normal.png");
        background-color: transparent;
        border: none;
        font-weight: bold;
        color: black;
        transition: box-shadow 0.2s;
        cursor: pointer;
    }
    .mybutton:hover {
        background-image: url("../../assets/Home/mybutton-hover.png");
        box-shadow: 0 0 10px #ffc148;
    }
    .mybutton:active {
        background-image: url("../../assets/Home/mybutton-active.png");
        box-shadow: 0 0 10px #ffc148;
    }
</style>
