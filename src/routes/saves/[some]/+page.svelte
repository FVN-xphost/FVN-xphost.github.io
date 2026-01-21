<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import MyMessageBox from "../../../components/board/MyMessageBox.svelte";
    import { saveData, saveInstance, branchs } from "../../../store/store";
    import { showMessageBox } from "../../../utils/messagebox";
    import { sleep, router } from "../../../utils/all";
    import { invoke } from "@tauri-apps/api/core";
    import Dragon from "../../../assets/illustration/dragon_dressed.png";
    import Tiger from "../../../assets/illustration/tiger_dressed.png";
    import html2canvas from "html2canvas";
    import piano from "../../../assets/music/mp3/piano.mp3";
    import experience from "../../../assets/music/ogg/experience.ogg";
    import contentback1 from "../../../assets/Home/contentback1.jpg";
    const pianoIns = new Audio(piano);
    const experienceIns = new Audio(experience);
    const { params } = $props();
    const thisname = (() => `save${params.some}`)();
    let o1 = $state(false);
    let currentText = $state("");
    let lockText = $state(false);
    let exitText = $state(false);
    let keyLock = $state(false);
    let quickCurrent = $state(false);
    let liveStyleDragon = $state("");
    let liveStyleTiger = $state("");
    let contentback = $state("");
    let backStyle = $state("");
    function setSaveMeta(key: string, value: string) {
        saveData.set({
            ...$saveData,
            saveObject: {
                ...$saveData.saveObject,
                [thisname]: {
                    ...$saveData.saveObject[thisname],
                    [key]: value,
                },
            },
        });
    }
    function setGalleryMeta(id: number) {
        saveData.set({
            ...$saveData,
            gallery: {
                ...$saveData.gallery,
                [`gallery${id}`]: true,
            },
        });
    }
    function setSaveInfo(key: string, value: string | number) {
        saveData.set({
            ...$saveData,
            saveInstance: {
                ...$saveData.saveInstance,
                [thisname]: {
                    ...$saveData.saveInstance[thisname],
                    [key]: value,
                },
            },
        });
    }
    async function unlockGallery(id: number) {
        await invoke("update_gallery", { id });
        setGalleryMeta(id);
    }
    function getSaveInfo(key: string | undefined) {
        if (key === undefined) {
            return $saveData.saveInstance[thisname];
        }
        return $saveData.saveInstance[thisname][key];
    }
    function gc(): number {
        return parseInt(getSaveInfo("current"));
    }
    function plusOne() {
        setSaveInfo("current", gc() + 1);
    }
    function minusOne() {
        setSaveInfo("current", gc() - 1);
    }
    async function doStyle(current: number, isQuick: boolean = false) {
        pianoIns.pause();
        pianoIns.currentTime = 0;
        experienceIns.pause();
        experienceIns.currentTime = 0;
        if (current === 0) {
            backStyle = "opacity: 0;";
            liveStyleTiger = "transform: translateX(700px);";
        } else if (current === 5) {
            liveStyleDragon = "";
        } else if (current === 6) {
            liveStyleDragon = "animation: run 2s infinite;";
        } else if (current === 7) {
            liveStyleDragon = "transform: rotateY(180deg);";
        } else if (current === 8) {
            liveStyleDragon = "scale: 1.2;";
        } else if (current === 9) {
            liveStyleDragon = "animation: vibration 0.2s infinite;";
        } else if (current === 10) {
            await unlockGallery(1);
            liveStyleDragon = "";
        } else if (current === 11) {
            experienceIns.play();
            liveStyleDragon = "";
        } else if (current === 12) {
            pianoIns.play();
            liveStyleDragon = "";
        } else if (current === 33) {
            liveStyleDragon = "";
            liveStyleTiger = "transform: translateX(700px);";
        } else if (current === 34) {
            liveStyleDragon = "animation: runleft 2s;";
            if (!isQuick) await sleep(2000);
            liveStyleDragon = "transform: translateX(-200px) rotateY(180deg);";
            liveStyleTiger = "animation: runleft2 1s";
            if (!isQuick) await sleep(1000);
            liveStyleTiger = "transform: translateX(100px)";
        } else if (current === 35) {
            backStyle = "opacity: 0;";
        } else if (current === 36) {
            backStyle = "animation: opac1 0.5s";
            if (!isQuick) await sleep(500);
            backStyle = "opacity: 1";
        }
        if (current >= 0 && current < 36) {
            backStyle = "opacity: 0;";
            if (current < 34) {
                liveStyleTiger = "transform: translateX(700px);";
            }
        }
        if (current >= 34) {
            liveStyleDragon = "transform: translateX(-200px) rotateY(180deg);";
            liveStyleTiger = "transform: translateX(100px)";
            if (current >= 36) {
                backStyle = "opacity: 1";
            }
        }
    }
    onMount(async () => {
        if (getSaveInfo("name") === "") {
            let name = "";
            while (true) {
                name = await showMessageBox(
                    "请输入主角名字",
                    "请在下方输入主角名字，默认：小龙",
                    "input",
                );
                name = name === "" ? "小龙" : name;
                if (
                    (await showMessageBox(
                        "你的名字是",
                        `你的名字是：${name}，是否me}，是否确定？`,
                        "info",
                        ["ok", "cancel"],
                    )) === "0"
                ) {
                    break;
                }
            }
            setSaveInfo("name", name);
        }
        doStyle(gc(), true);
        o1 = true;
        await sleep(500);
        next(false);
    });
    async function next(plus: boolean = true) {
        if (gc() >= $saveInstance.length) {
            return;
        }
        if (!$saveInstance[gc()]?.message) return;
        if (lockText) {
            exitText = true;
            currentText = replaceCurrentText($saveInstance[gc()]?.message);
            return;
        }
        lockText = true;
        currentText = "";
        if (plus) {
            jumpTo(true);
            plusOne();
        }
        await doStyle(gc());
        let ct = replaceCurrentText($saveInstance[gc()]?.message);
        for (let i = 0; i < (ct?.length ?? 0); i++) {
            if (exitText) {
                break;
            }
            await sleep(20);
            if (exitText) {
                break;
            }
            currentText += ct[i];
            if (exitText) {
                break;
            }
        }
        exitText = false;
        lockText = false;
    }
    function replaceCurrentText(text: string | undefined) {
        if (text === undefined) return "";
        Object.keys(getSaveInfo(undefined))
            .filter((item) => item !== "current")
            .forEach((key) => {
                text = text!.replace(`%${key}`, getSaveInfo(key) ?? "");
            });
        return text;
    }
    function jumpTo(ps: boolean) {
        while (true) {
            const j = $saveInstance[gc() + (ps ? 1 : -1)]?.if;
            if (j) {
                let count = 0;
                for (let i = 0; i < j.length; i++) {
                    const key = j[i]?.key;
                    const value = j[i]?.value;
                    if (getSaveInfo(key) === value) {
                        count++;
                    }
                }
                if (count >= j.length) {
                    break;
                }
                setSaveInfo("current", gc() + (ps ? 1 : -1));
            } else {
                break;
            }
            // const key = $saveInstance[gc() + (ps ? 1 : -1)]?.key;
            // const value = $saveInstance[gc() + (ps ? 1 : -1)]?.value;
            // console.log(key, value, 2222);
            // if (key && value) {
            //     if (getSaveInfo(key) === value) {
            //         break;
            //     }
            //     setSaveInfo("current", gc() + (ps ? 1 : -1));
            // } else {
            //     break;
            // }
        }
    }
    function prev() {
        if (gc() <= 0) return;
        jumpTo(false);
        minusOne();
        doStyle(gc(), true);
        currentText = replaceCurrentText($saveInstance[gc()]?.message);
    }
    async function quick() {
        quickCurrent = !quickCurrent;
        while (true) {
            if (
                !quickCurrent ||
                gc() >= $saveInstance.length ||
                !$saveInstance[gc()]?.message
            )
                break;
            jumpTo(true);
            await sleep(50);
            plusOne();
            await doStyle(gc(), true);
            currentText = replaceCurrentText($saveInstance[gc()]?.message);
        }
    }
    function spaceDown(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (e.code === "Space") {
            if (!keyLock) {
                keyLock = true;
                next();
            }
        }
    }
    function spaceUp(e: KeyboardEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (e.code === "Space") {
            keyLock = false;
        }
    }
    async function updateSave(name: string, current: number) {
        const date = new Date();
        const image = (
            await html2canvas(document.querySelector(".container2")!)
        ).toDataURL("image/png");
        const updateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        setSaveMeta("image", image);
        setSaveMeta("remark", "");
        setSaveMeta("updateTime", updateTime);
        await invoke("update_save", {
            id: params.some,
            updateTime,
            image,
            name,
            current,
            branch1: getSaveInfo("branch1"),
            branch2: getSaveInfo("branch2"),
            branch3: getSaveInfo("branch3"),
        });
        console.log($saveData);
    }
</script>

{#if o1}
    <div
        class="container2"
        in:fade={{ duration: 500 }}
        onclick={() => {
            if (quickCurrent) quickCurrent = false;
            next();
        }}
        onkeydown={spaceDown}
        onkeyup={spaceUp}
        tabindex="0"
        role="button"
    >
        <img
            src={contentback1}
            alt="Background"
            class="background"
            style={backStyle}
        />
        <!-- <img
            src={contentback}
            alt="Background Image"
            class="background"
            style={backStyle}
        /> -->
        <img
            src={Dragon}
            alt="Dragon Avatar"
            class="dragon"
            style={liveStyleDragon}
        />
        <img
            src={Tiger}
            alt="Tiger Avatar"
            class="tiger"
            style={liveStyleTiger}
        />
        <div class="dialog">
            <div class="avatar" style="grid-row: 1 / 3;"></div>
            <div class="title">
                {$saveInstance[gc()]?.name?.replace(
                    "%name",
                    getSaveInfo("name"),
                )}
            </div>
            <div class="content">
                {#if $saveInstance[gc()]?.type === "choice"}
                    <div class="choose">
                        {#each $saveInstance[gc()]?.choice as choice}
                            <button
                                class="choice-button"
                                onclick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSaveInfo(
                                        $saveInstance[gc()]?.id!,
                                        choice,
                                    );
                                    jumpTo(true);
                                    plusOne();
                                    next(false);
                                }}
                                aria-label={choice}
                            >
                                {choice}
                            </button>
                        {/each}
                    </div>
                {:else}
                    {@html currentText}
                {/if}
            </div>
            <div class="control" style="grid-column: 1 / 3;">
                <button
                    onclick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        prev();
                    }}
                    aria-label="后退">后退</button
                >
                <button
                    style={`color: ${quickCurrent ? "red" : "darkorange"}`}
                    onclick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        quick();
                    }}
                    aria-label="快进">快进</button
                >
                <button
                    onclick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        updateSave(getSaveInfo("name"), gc());
                    }}
                    aria-label="存档">存档</button
                >
                <button
                    onclick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        router.back();
                    }}
                    aria-label="返回">返回</button
                >
            </div>
        </div>
    </div>
{/if}
<MyMessageBox></MyMessageBox>

<style>
    .container2 {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;
        width: 111.5vh;
        height: 100vh;
        border: none;
        outline: none;
        overflow: hidden;
    }
    .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .dragon {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        height: 90vh;
        width: auto;
    }
    .tiger {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        height: 90vh;
        width: auto;
    }
    .dialog {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 30%;
        background-image: linear-gradient(to left bottom, #88888833, #44444433);
        display: grid;
        grid-template-columns: minmax(0, 0.3fr) minmax(0, 1fr);
        grid-template-rows: minmax(0, 0.2fr) minmax(0, 1fr) minmax(0, 0.2fr);
    }
    .control {
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    .control button {
        border: none;
        background-color: transparent;
        color: darkorange;
        cursor: pointer;
        border: none;
        outline: none;
    }
    .title {
        display: flex;
        align-items: center;
        padding-left: 10px;
        font-size: 1.2rem;
        font-weight: bold;
        color: red;
    }
    .content {
        padding: 10px;
        color: white;
    }
    .choose {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .choice-button {
        border: none;
        background-color: #99999955;
        color: white;
        cursor: pointer;
        border-radius: 5px;
        flex: 1;
        width: 100%;
    }
    .choice-button:hover {
        background-color: #aaaaaa66;
    }
</style>
