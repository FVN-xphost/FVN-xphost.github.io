<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import MyMessageBox from "../../../components/board/MyMessageBox.svelte";
    import { saveData } from "../../../store/store";
    import { dialogInstance } from "../../../store/dialog2";
    import { showMessageBox } from "../../../utils/messagebox";
    import { sleep, router } from "../../../utils/all";
    import { invoke } from "@tauri-apps/api/core";
    import Dragon from "../../../assets/illustration/dragon_dressed.png";
    import Tiger from "../../../assets/illustration/tiger_dressed.png";
    import html2canvas from "html2canvas";
    import piano from "../../../assets/music/mp3/piano.mp3";
    import experience from "../../../assets/music/ogg/experience.ogg";
    import contentback1 from "../../../assets/Home/contentback1.jpg";
    import MyMenuButton from "../../../components/input/MyMenuButton.svelte";
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
    let isShowHint = $state(false);
    let hintContent = $state("");
    let historyFile = $state<any[]>([]);
    function showHint(hintText: string) {
        isShowHint = true;
        hintContent = hintText;
        setTimeout(() => {
            isShowHint = false;
        }, 3000);
    }
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
        liveStyleTiger = "transform: translateX(150vw);";
        liveStyleDragon = "transform: translateX(-150vw);";
        backStyle = "opacity: 0;";
        // if (current === 0) {
        //     backStyle = "opacity: 0;";
        //     liveStyleTiger = "transform: translateX(110vh);";
        // } else if (current === 5) {
        //     liveStyleDragon = "";
        // } else if (current === 6) {
        //     liveStyleDragon = "animation: run 2s infinite;";
        // } else if (current === 7) {
        //     liveStyleDragon = "transform: rotateY(180deg);";
        // } else if (current === 8) {
        //     liveStyleDragon = "scale: 1.2;";
        // } else if (current === 9) {
        //     liveStyleDragon = "animation: vibration 0.2s infinite;";
        // } else if (current === 10) {
        //     await unlockGallery(1);
        //     liveStyleDragon = "";
        // } else if (current === 11) {
        //     experienceIns.play();
        //     liveStyleDragon = "";
        // } else if (current === 12) {
        //     pianoIns.play();
        //     liveStyleDragon = "";
        // } else if (current === 35) {
        //     liveStyleDragon = "";
        //     liveStyleTiger = "transform: translateX(110vh);";
        // } else if (current === 36) {
        //     liveStyleDragon = "animation: runleft 2s;";
        //     if (!isQuick) await sleep(2000);
        //     liveStyleDragon = "transform: translateX(-10vh) rotateY(180deg);";
        //     liveStyleTiger = "animation: runleft2 1s";
        //     if (!isQuick) await sleep(1000);
        //     liveStyleTiger = "transform: translateX(10vh)";
        // } else if (current === 37) {
        //     backStyle = "opacity: 0;";
        // } else if (current === 38) {
        //     backStyle = "animation: opac1 0.5s";
        //     if (!isQuick) await sleep(500);
        //     backStyle = "opacity: 1";
        // }
        // if (current >= 0 && current < 36) {
        //     backStyle = "opacity: 0;";
        //     if (current < 36) {
        //         liveStyleTiger = "transform: translateX(110vh);";
        //     }
        // }
        // if (current >= 36) {
        //     liveStyleDragon = "transform: translateX(-10vh) rotateY(180deg);";
        //     liveStyleTiger = "transform: translateX(10vh)";
        //     if (current >= 38) {
        //         backStyle = "opacity: 1";
        //     }
        // }
    }
    onMount(async () => {
        if (getSaveInfo("name") === "") {
            let name = "";
            while (true) {
                name = await showMessageBox(
                    "请输入主角名字",
                    "请在下方输入主角名字，默认：乔治",
                    "input",
                );
                name = name === "" ? "乔治" : name;
                if (
                    (await showMessageBox(
                        "你的名字是",
                        `你的名字是：${name}，是否确定？`,
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
        if (gc() >= $dialogInstance.length) {
            return;
        }
        if (!$dialogInstance[gc()]?.message) return;
        if (lockText) {
            exitText = true;
            currentText = replaceCurrentText($dialogInstance[gc()]?.message);
            return;
        }
        lockText = true;
        currentText = "";
        if ($dialogInstance[gc()]?.next && $dialogInstance[gc()]?.if) {
            const i = $dialogInstance.findIndex(
                (item: any) => item.id === $dialogInstance[gc()]?.next,
            );
            if (i >= 0) {
                setSaveInfo("current", i);
                plus = false;
            }
        }
        if (plus) {
            jumpTo(true);
            plusOne();
        }
        await doStyle(gc());
        let ct = replaceCurrentText($dialogInstance[gc()]?.message);
        let isLt = false;
        for (let i = 0; i < (ct?.length ?? 0); i++) {
            if (exitText) {
                break;
            }
            if (ct[i] === "<") {
                isLt = true;
            }
            if (ct[i] === ">") {
                isLt = false;
            }
            if (!isLt) await sleep(20);
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
                text = text!.replaceAll(`%${key}`, getSaveInfo(key) ?? "");
            });
        return text;
    }
    function jumpTo(ps: boolean) {
        while (true) {
            const j = $dialogInstance[gc() + (ps ? 1 : -1)]?.if;
            if (j && j.length > 0) {
                let result = true;
                const firstKey = j[0]!.key;
                const firstValue = j[0]!.value;
                result =
                    typeof firstValue === "function"
                        ? firstValue(getSaveInfo(firstKey))
                        : getSaveInfo(firstKey) === firstValue;
                for (let i = 1; i < j.length; i++) {
                    const key = j[i]?.key;
                    const value = j[i]?.value;
                    const next = j[i - 1]?.next;
                    if (next === "and") {
                        result =
                            result &&
                            (typeof value === "function"
                                ? value(getSaveInfo(key))
                                : getSaveInfo(key) === value);
                    } else if (next === "or") {
                        result =
                            result ||
                            (typeof value === "function"
                                ? value(getSaveInfo(key))
                                : getSaveInfo(key) === value);
                    }
                }
                if (result) {
                    break;
                }
                setSaveInfo("current", gc() + (ps ? 1 : -1));
            } else {
                break;
            }
        }
    }
    // 使用古法查看历史（ps：逐步往前退，直到退到0。。由于 jumpTo 函数已经帮我们解决了分支问题，因此无需担心历史数据丢失。。）
    function showHistory() {
        let loadPrev = [];
        let current = gc();
        historyFile.unshift({
            name: $dialogInstance[gc()]?.name,
            message: $dialogInstance[gc()]?.message,
        });
        while (true) {
            if (gc() === 0) {
                break;
            }
            jumpTo(false);
            minusOne();
            historyFile.unshift({
                name: $dialogInstance[gc()]?.name,
                message: $dialogInstance[gc()]?.message,
            });
        }
        setSaveInfo("current", current);
    }
    function prev() {
        if (gc() <= 0) return;
        if ($dialogInstance[gc()]?.prev) {
            const i = $dialogInstance.findIndex(
                (item: any) => item.id === $dialogInstance[gc()]?.prev,
            );
            if (i >= 0) {
                setSaveInfo("current", i);
            }
        } else {
            jumpTo(false);
            minusOne();
            doStyle(gc(), true);
            let score = $dialogInstance[gc()]?.score;
            // 下列开始判断 score 分数的回退，仅适用与 score 在 action 的返回值是 return (parseInt(rawValue) || 0 + n).toString();（n=任何数字）这种。。
            if (score !== undefined) {
                let choice = getSaveInfo($dialogInstance[gc()]!.id);
                let rawScore = parseInt(getSaveInfo(score.targetId));
                let plusScore = parseInt(score.action(choice, "0"));
                setSaveInfo(score.targetId, (rawScore - plusScore).toString());
            }
        }
        currentText = replaceCurrentText($dialogInstance[gc()]?.message);
    }
    async function quick() {
        quickCurrent = !quickCurrent;
        while (true) {
            if (
                !quickCurrent ||
                gc() >= $dialogInstance.length ||
                !$dialogInstance[gc()]?.message
            )
                break;
            jumpTo(true);
            await sleep(50);
            plusOne();
            await doStyle(gc(), true);
            currentText = replaceCurrentText($dialogInstance[gc()]?.message);
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
            branches: [
                getSaveInfo("branch1") ?? "",
                getSaveInfo("branch2") ?? "",
                getSaveInfo("branch3") ?? "",
                getSaveInfo("branch4") ?? "",
                getSaveInfo("branch5") ?? "",
                getSaveInfo("branch6") ?? "",
                getSaveInfo("branch7") ?? "",
            ],
        });
        showHint("存档成功！");
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
        <div class="painting-container">
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
        </div>
        <div class="dialog">
            <div class="avatar" style="grid-row: 1 / 3;"></div>
            <div class="title">
                {@html $dialogInstance[gc()]?.name?.replace(
                    "%name",
                    getSaveInfo("name"),
                )}
            </div>
            <div class="content">
                {#if $dialogInstance[gc()]?.type === "choice"}
                    <div class="choose">
                        {#each $dialogInstance[gc()]?.choice as choice}
                            <button
                                class="choice-button"
                                onclick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSaveInfo(
                                        $dialogInstance[gc()]?.id!,
                                        choice,
                                    );
                                    let score = $dialogInstance[gc()]?.score;
                                    if (score !== undefined) {
                                        setSaveInfo(
                                            score.targetId!,
                                            score.action(
                                                choice,
                                                getSaveInfo(score.targetId),
                                            ),
                                        );
                                        console.log(
                                            getSaveInfo(score.targetId),
                                        );
                                    }
                                    jumpTo(true);
                                    plusOne();
                                    next(false);
                                }}
                                aria-label={choice}
                            >
                                {@html replaceCurrentText(choice)}
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
                    style={`color: ${quickCurrent ? "red" : "darkorange"}`}
                    onclick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        showHistory();
                    }}
                    aria-label="历史">历史</button
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
        <div class="hint" style={`max-width: ${isShowHint ? "300px" : "0"}`}>
            <span style="margin: 0 10px; font-size: 10px; color: white;"
                >{hintContent}</span
            >
        </div>
        {#if historyFile.length !== 0}
            <div
                class="history"
                in:fade={{ duration: 400 }}
                out:fade={{ duration: 400 }}
                onclick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onkeydown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onkeyup={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                tabindex="0"
                role="button"
            >
                <div class="history-content">
                    {#each historyFile as history, index}
                        <div class="history-single">
                            <div style="font-size: 1.2rem; font-weight: bold;">
                                {@html replaceCurrentText(history!.name)}
                            </div>
                            <div
                                style="white-space: wrap; word-wrap: break-word; color: white;"
                            >
                                {@html replaceCurrentText(history!.message)}
                            </div>
                        </div>
                    {/each}
                </div>
                <MyMenuButton
                    style="position: fixed; bottom: 32px; right: 32px"
                    onclick={() => historyFile.splice(0)}
                >
                    {#snippet children()}
                        返回
                    {/snippet}
                </MyMenuButton>
            </div>
        {/if}
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
        margin: 0;
        width: 100vw;
        height: 100vh;
        border: none;
        outline: none;
        overflow: hidden;
    }
    .painting-container {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0 auto;
        width: 110vh;
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
        grid-template-columns: minmax(0, 0.2fr) minmax(0, 1fr);
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
        color: white;
    }
    .content {
        padding: 10px;
        color: white;
        white-space: wrap;
        overflow-y: auto;
        word-wrap: break-word;
    }
    .content::-webkit-scrollbar {
        display: none;
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
        min-height: 30px;
        flex-shrink: 0;
        width: 100%;
    }
    .choice-button:hover {
        background-color: #aaaaaa66;
    }
    .hint {
        position: fixed;
        top: 30px;
        left: 0;
        display: flex;
        align-items: center;
        background-color: #333333;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        box-shadow: 0 0 10px #33333333;
        width: auto;
        max-width: 0;
        height: 24px;
        transition: max-width 0.2s;
        overflow: hidden;
        white-space: nowrap;
    }
    .history {
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        backdrop-filter: blur(12px);
        background-color: #00000033;
    }
    .history-content {
        height: auto;
        max-height: 100vh;
        width: 120vh;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }
    .history-content::-webkit-scrollbar {
        display: none;
    }
    .history-single {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-around;
        padding: 0 20px;
        min-height: 20vh;
        flex-shrink: 0;
        width: 100%;
    }
</style>
