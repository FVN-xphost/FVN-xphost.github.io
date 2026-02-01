<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import "../../../components/board/MyMessageBox";
    import { mounted, saveData } from "../../../store/store";
    import { dialogInstance } from "../../../store/dialog";
    import { showMessageBox, messagebox } from "../../../utils/messagebox";
    import { sleep, router, branchCount } from "../../../utils/all";
    import { init, save, unlockGallery } from "../../../utils/backend-tauri";
    import Dragon from "../../../assets/illustration/dragon_dressed.png";
    import Tiger from "../../../assets/illustration/tiger_dressed.png";
    import html2canvas from "html2canvas";
    import piano from "../../../assets/music/mp3/piano.mp3";
    import experience from "../../../assets/music/ogg/experience.ogg";
    import Scene1 from "../../../assets/scene/scene1.png";
    import "../../../components/input/MyMenuButton";
    // 钢琴音乐
    const pianoIns = new Audio(piano);
    // 获得经验
    const experienceIns = new Audio(experience);
    const { params } = $props();
    // 当前存档名称
    const thisname = (() => `save${params.some}`)();
    // 临时变量：控制主屏幕显示。
    let o1 = $state(false);
    /// 以下为一组：当前文本
    let currentText = $state("");
    // 锁住文本（用于 next 时是否控制文本点击时自动显示完整。）
    let lockText = $state(false);
    /// 退出文本（同上用于判断）
    let exitText = $state(false);
    // 控制 空格键 锁定
    let keyLock = $state(false);
    // 是否点击了快进
    let quickCurrent = $state(false);
    // 龙立绘样式
    let liveStyleDragon = $state("");
    // 虎立绘样式
    let liveStyleTiger = $state("");
    // 背景样式
    let backStyle = $state("");
    let backImage = $state("");
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
    async function ug(id: number) {
        await unlockGallery(id);
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
    function gd(index: number): object {
        return $dialogInstance[index] ?? {};
    }
    function plusOne() {
        setSaveInfo("current", gc() + 1);
    }
    function minusOne() {
        setSaveInfo("current", gc() - 1);
    }
    async function doStyle(current: number, isQuick: boolean = false) {
        if (current === 0) {
            pianoIns.pause();
            pianoIns.currentTime = 0;
            experienceIns.pause();
            experienceIns.currentTime = 0;
            liveStyleTiger = "transform: translateX(150vw);";
            liveStyleDragon = "transform: translateX(-150vw);";
            backStyle = `opacity: 0;`;
            backImage = "";
        }
        if (gd(current).id === "start1") {
            backStyle = `opacity: 1;`;
            backImage = Scene1;
            if (!isQuick) await sleep(500);
        }
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
        if (!gd(gc()).message) return;
        if (lockText) {
            exitText = true;
            currentText = replaceCurrentText(gd(gc()).message);
            return;
        }
        lockText = true;
        currentText = "";
        if (gd(gc()).next && gd(gc()).if) {
            const i = $dialogInstance.findIndex(
                (item: any) => item.id === gd(gc()).next,
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
        let ct = replaceCurrentText(gd(gc()).message);
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
            const j = gd(gc() + (ps ? 1 : -1)).if;
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
            name: gd(gc()).name,
            message: gd(gc()).message,
        });
        while (true) {
            if (gc() === 0) {
                break;
            }
            jumpTo(false);
            minusOne();
            if (!gd(gc()).message) {
                continue;
            }
            let score = gd(gc()).score;
            // 下列开始判断 score 分数的回退，仅适用与 score 在 action 的返回值是 return (parseInt(rawValue) || 0 + n).toString();（n=任何数字）这种。。
            if (score !== undefined) {
                let choice = getSaveInfo(gd(gc()).id);
                let rawScore = parseInt(getSaveInfo(score.targetId));
                let plusScore = parseInt(score.action(choice, "0"));
                setSaveInfo(score.targetId, (rawScore - plusScore).toString());
            }
            historyFile.unshift({
                name: gd(gc()).name,
                message: gd(gc()).message,
            });
        }
        setSaveInfo("current", current);
    }
    function prev() {
        if (gc() <= 0) return;
        if (gd(gc()).prev) {
            const i = $dialogInstance.findIndex(
                (item: any) => item.id === gd(gc()).prev,
            );
            if (i >= 0) {
                setSaveInfo("current", i);
            }
        } else {
            jumpTo(false);
            minusOne();
            doStyle(gc(), true);
            let score = gd(gc()).score;
            // 下列开始判断 score 分数的回退，仅适用与 score 在 action 的返回值是 return (parseInt(rawValue) || 0 + n).toString();（n=任何数字）这种。。
            if (score !== undefined) {
                let choice = getSaveInfo(gd(gc()).id);
                let rawScore = parseInt(getSaveInfo(score.targetId));
                let plusScore = parseInt(score.action(choice, "0"));
                setSaveInfo(score.targetId, (rawScore - plusScore).toString());
            }
        }
        currentText = replaceCurrentText(gd(gc()).message);
    }
    async function quick() {
        quickCurrent = !quickCurrent;
        while (true) {
            if (
                !quickCurrent ||
                gc() >= $dialogInstance.length ||
                !gd(gc()).message
            )
                break;
            jumpTo(true);
            await sleep(50);
            plusOne();
            await doStyle(gc(), true);
            currentText = replaceCurrentText(gd(gc()).message);
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
        try {
            await save(
                params.some,
                updateTime,
                image,
                name,
                current,
                new Array(branchCount)
                    .fill(null)
                    .map(
                        (_, index: number) =>
                            getSaveInfo(`branch${index + 1}`) ?? "",
                    ),
            );
            showHint("存档成功！");
        } catch (e: any) {
            showHint("存档失败，错误信息：" + e.message);
        }
        // await invoke("update_save", {
        //     id: params.some,
        //     updateTime,
        //     image,
        //     name,
        //     current,
        //     branches: new Array(branchCount)
        //         .fill(null)
        //         .map((_, index: number) => {
        //             return getSaveInfo(`branch${index + 1}`) ?? "";
        //         }),
        // });
    }
</script>

{#if o1}
    <div
        class="bg1 bg-img-full fixed top-0 left-0 right-0 bottom-0 m-0 w-screen h-screen border-none outline-none overflow-hidden flex items-center"
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
        <div class="w-screen h-[95vh] flex border-white border items-center">
            <div
                class="w-screen h-[93vh] border-gray-300 border flex items-center"
            >
                <div class="w-[50vw] h-full relative">
                    <img
                        src={backImage}
                        alt="背景图片"
                        class="absolute top-[50%] left-[50%] translate-[-50%] w-full aspect-video transition-opacity duration-500"
                        style={backStyle}
                    />
                </div>
                <div class="flex-1 h-full border-l-gray-300 border"></div>
                <div class="relative w-[5vw] h-full border-l-gray-300 border">
                    <div
                        class="absolute flex flex-col items-center gap-[3vw] bottom-0 left-0 right-0 w-full h-auto mx-auto my-0"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="text-sky-300 w-[4vw] h-[4vw]"
                            viewBox="0 0 24 24"
                            ><path
                                fill="currentColor"
                                d="M8.539 19.192v-5H5.325q-.379 0-.55-.348t.09-.646L11.399 5.7q.243-.279.602-.279t.602.279l6.533 7.498q.261.298.09.646t-.55.348h-3.213v5q0 .349-.23.578t-.578.23H9.346q-.348 0-.578-.23t-.23-.578"
                            /></svg
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-[4vw] h-[4vw]"
                            viewBox="0 0 64 64"
                            ><path
                                fill="#3e4347"
                                d="m61.3 9.3l-6.6-6.6c-.4-.4-1.2-.7-1.7-.7H9v4H5V2H3c-.5 0-1 .5-1 1v58c0 .5.5 1 1 1h58c.5 0 1-.5 1-1V11c0-.6-.3-1.3-.7-1.7"
                            /><path
                                fill="#fff"
                                d="M12 62V34c0-1.1.9-2 2-2h36c1.1 0 2 .9 2 2v28z"
                            /><path
                                fill="#e8e8e8"
                                d="M18 2v20c0 1.1.9 2 2 2h30c1.1 0 2-.9 2-2V2z"
                            /><path fill="#3e4347" d="M36 6h10v16H36z" /><path
                                fill="#fff"
                                d="M59 56c0-.6-.5-1-1-1h-2c-.5 0-1 .4-1 1v2c0 .5.5 1 1 1h2c.5 0 1-.5 1-1z"
                            /><path
                                fill="#f15744"
                                d="M12 54h40v8H12zm5-18h30v2H17zm0 6h30v2H17zm0 6h30v2H17z"
                            /></svg
                        ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="text-sky-300 w-[4vw] h-[4vw]"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            ><g
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                ><path d="M12 22l-7 -7M12 22l7 -7" /><path
                                    d="M12 16l-7 -7M12 16l7 -7"
                                /><path d="M12 10l-7 -7M12 10l7 -7" /></g
                            ></svg
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
{/if}
{#if $messagebox.show}
    <my-message-box
        in:fade={{ duration: 300 }}
        out:fade={{ duration: 300 }}
        title={$messagebox.title}
        content={$messagebox.content}
        buttons={$messagebox.buttons}
        type={$messagebox.type}
        result={(result: string) => {
            messagebox.set({
                show: false,
                title: "",
                content: "",
                type: "info",
                buttons: [],
                result: result,
            });
        }}
    ></my-message-box>
{/if}

<!-- <MyMessageBox></MyMessageBox> -->

<style>
    .bg1 {
        background-image: url(../../../assets/Home/back.png);
    }
</style>
