<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import "./MyInputName";
    import { saveData } from "../../../store/store";
    import { choiceTitle, dialogInstance } from "../../../store/dialog";
    import { sleep, router, branchCount } from "../../../utils/all";
    import { save, unlockGallery } from "../../../utils/backend-tauri";
    import Dragon from "../../../assets/illustration/dragon_dressed.png";
    import Tiger from "../../../assets/illustration/tiger_dressed.png";
    import piano from "../../../assets/sounds/mp3/piano.mp3";
    import experience from "../../../assets/sounds/ogg/experience.ogg";
    import Scene1 from "../../../assets/scene/scene1.png";
    import "../../../components/input/MyMenuButton";
    const { params } = $props();
    // 钢琴音乐
    const pianoIns = new Audio(piano);
    // 获得经验
    const experienceIns = new Audio(experience);
    // 当前存档名称
    const thisname = (() => `save${params.some}`)();
    // 临时变量：控制主屏幕显示。
    let o1 = $state(false);
    /// 以下为一组：
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
    // 展示提示
    let isShowHint = $state(false);
    // 提示内容
    let hintContent = $state("");
    // 历史
    let historyFile = $state<any[]>([]);
    // 展示开头的信息框
    let showInput = $state(false);
    let resultInput = $state("");
    let pedding = $state<((resolve: string) => void) | undefined>(undefined);
    $effect(() => {
        if (!showInput && pedding) {
            pedding(resultInput);
            pedding = undefined;
        }
    });
    function showInputName(): Promise<string> {
        showInput = true;
        return new Promise((resolve: (resolve: string) => void) => {
            pedding = resolve;
        });
    }
    function showHint(hintText: string) {
        isShowHint = true;
        hintContent = hintText;
        setTimeout(() => {
            isShowHint = false;
        }, 3000);
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
    function getSaveInfo(key: string | undefined = undefined): any {
        if (key === undefined) {
            return $saveData.saveInstance[thisname];
        }
        return $saveData.saveInstance[thisname][key];
    }
    function gc(): number {
        return parseInt(getSaveInfo("current"));
    }
    function gd(index: number): any {
        return $dialogInstance[index] ?? {};
    }
    function setc(current: number) {
        setSaveInfo("current", current);
    }
    function plusOne() {
        setc(gc() + 1);
    }
    function minusOne() {
        setc(gc() - 1);
    }
    function replaceCurrentText(text: string | undefined): string {
        if (text === undefined) return "";
        Object.keys(getSaveInfo())
            .filter((item) => item !== "current")
            .forEach((key) => {
                text = text!.replaceAll(`%${key}`, getSaveInfo(key) ?? "");
            });
        return text;
    }
    // 跳过部分分支剧情。ps 代表着是前进还是后退。（自动判断分支跳过！需要在每一个 next 之前都要调用一遍！）
    function jumpTo(ps: boolean, index: number = gc()): number {
        let resNum = index;
        while (true) {
            const j = gd(resNum + (ps ? 1 : -1)).if;
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
                resNum++;
            } else {
                break;
            }
        }
        return resNum;
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
            backImage = Scene1;
            backStyle = `opacity: 1;`;
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
    // 会根据 对话内容 进行下一步处理！
    // 返回 -10 代表已经走到末尾，返回 -11 代表这是一个选项。返回 -12 代表已经到末尾！
    function nextOne(index: number, plus: boolean): number {
        let resNum = index;
        if (resNum >= $dialogInstance.length) return -10;
        if (gd(resNum).next && gd(resNum).if) {
            const i = $dialogInstance.findIndex(
                (item: any) => item.id === gd(resNum).next,
            );
            if (i >= 0) {
                resNum = i;
            }
        }
        if (resNum === index && plus) {
            resNum = jumpTo(true, resNum);
            resNum++;
        }
        if (gd(resNum).type === "choice") return -11;
        if (!gd(resNum).message) return -12;
        return resNum;
    }
    function prevOne(index: number): number {
        let resNum = index;
        if (resNum <= 0) return -10;
        if (gd(resNum).prev) {
            const i = $dialogInstance.findIndex(
                (item: any) => item.id === gd(resNum).prev,
            );
            if (i >= 0) resNum = i;
        } else {
            resNum = jumpTo(false, resNum);
            resNum--;
        }
        // 下列开始判断 score 分数的回退，仅适用与 score 在 action 的返回值是 return (parseInt(rawValue) || 0 + n).toString();（n=任何数字）这种。。
        let score = gd(resNum).score;
        if (score) {
            let choice = getSaveInfo(gd(gc()).id);
            let rawScore = parseInt(getSaveInfo(score.targetId));
            let plusScore = parseInt(score.action(choice, "0"));
            setSaveInfo(score.targetId, (rawScore - plusScore).toString());
        }
        return resNum;
    }
    let dialogDom: HTMLDivElement;
    onMount(async () => {
        // 输入名字
        if (getSaveInfo("name") === "") {
            let name = await showInputName();
            name = name === "" ? "乔治" : name;
            setSaveInfo("name", name);
        }
        let m = 0;
        // 回朔历史
        // 直接在初始化里面显示【历史】！（不直接用按钮显示了。。）
        while (m < gc()) {
            let n = nextOne(m, false);
            if (n !== -10 && n !== -11) {
                m = n;
                m = jumpTo(true, m);
                await doStyle(m, true);
                historyFile.push({
                    name: gd(m).name,
                    text: gd(m).message,
                });
                if (n === -12) break;
            } else if (n == -11) {
                historyFile.push({
                    name: choiceTitle,
                    text: getSaveInfo(gd(m).id),
                });
                m = jumpTo(true, m);
                await doStyle(m, true);
            }
            m++;
        }
        o1 = true;
        await sleep(500);
        dialogDom = document.querySelector(".dialog-by") as HTMLDivElement;
        dialogDom.scrollTop = dialogDom.scrollHeight;
        await next(false);
        console.log(gc());
    });
    async function next(plus: boolean = true) {
        if (lockText) {
            exitText = true;
            historyFile[historyFile.length - 1].text = replaceCurrentText(
                gd(gc()).message,
            );
            dialogDom.scrollTop = dialogDom.scrollHeight;
            return;
        }
        if (!gd(gc()).message) return;
        let n = nextOne(gc(), plus);
        if (n === -10 || n === -12) return;
        if (n === -11) {
            plusOne();
            return;
        }
        setc(n);
        historyFile.push({
            name: replaceCurrentText(gd(gc()).name),
            text: "",
        });
        lockText = true;
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
            historyFile[historyFile.length - 1].text += ct[i];
            dialogDom.scrollTop = dialogDom.scrollHeight;
            if (exitText) {
                break;
            }
        }
        dialogDom.scrollTop = dialogDom.scrollHeight;
        exitText = false;
        lockText = false;
    }
    /**
     * 使用古法查看历史（ps：逐步往前退，直到退到0。。由于 jumpTo 函数已经帮我们解决了分支问题，因此无需担心历史数据丢失或者起冲突。。）
     * @deprecated 自 v4 版本已被弃用！因为现在是直接显示历史！
     */
    function showHistory() {
        console.warn(
            "请不要使用该函数了！！因为现在是直接显示历史，因此移除了按钮！",
        );
        let current = gc();
        historyFile.unshift({
            name: gd(gc()).name,
            message: gd(gc()).message,
        });
        while (true) {
            let p = prevOne(gc());
            if (p === -10 || p === -11 || p === -12) break;
            setc(p);
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
        setc(current);
    }
    /**
     * 回退一句对话
     * @deprecated 自 v4 版本已被弃用！因为现在直接显示历史，因此无需回退，在进行重大决策时会有提示存档！！
     */
    function prev() {
        setc(prevOne(gc()));
        historyFile.pop();
    }
    async function quick() {
        quickCurrent = !quickCurrent;
        if (!quickCurrent) return;
        if (lockText) {
            exitText = true;
            historyFile[historyFile.length - 1].text = replaceCurrentText(
                gd(gc()).message,
            );
        }
        exitText = false;
        lockText = false;
        while (true) {
            if (!gd(gc()).message) break;
            let n = nextOne(gc(), true);
            if (n === -10 || n === -12 || !quickCurrent) break;
            if (n === -11) {
                plusOne();
                break;
            }
            setc(n);
            await sleep(50);
            await doStyle(gc(), true);
            historyFile.push({
                name: gd(gc()).name,
                text: gd(gc()).message,
            });
            dialogDom.scrollTop = dialogDom.scrollHeight;
        }
        dialogDom.scrollTop = dialogDom.scrollHeight;
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
        const updateTime = `${date.getFullYear()}-${
            date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1
        }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()} ${
            date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
        }:${
            date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
        }:${
            date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
        }`;
        setSaveInfo("remark", "");
        setSaveInfo("updateTime", updateTime);
        try {
            await save(
                params.some,
                updateTime,
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
            console.log($saveData);
        } catch (e: any) {
            showHint("存档失败，错误信息：" + e.message);
        }
    }
</script>

{#if o1}
    <div
        class="container2 bg-img-full bg-[url(/src/assets/Home/back.png)] fixed top-0 left-0 right-0 bottom-0 m-0 w-screen h-screen border-none outline-none overflow-hidden flex items-center"
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
                <!-- 立绘区域 -->
                <div class="w-[50vw] h-full relative">
                    <img
                        src={backImage}
                        alt="背景图片"
                        class="absolute top-[50%] left-[50%] translate-[-50%] w-full aspect-video transition-opacity duration-500"
                        style={backStyle}
                    />
                </div>
                <div
                    class="flex flex-col flex-1 h-full border-l-gray-300 border"
                >
                    <!-- 对话区域 -->
                    <div
                        class="dialog-by flex-1 w-full flex flex-col before:content-[''] gap-2.5 overflow-y-auto p-4"
                    >
                        {#each historyFile as item, index}
                            <div
                                class="shrink-0 text-white h-auto w-full text-left transition-[filter] duration-400"
                                style={`filter: brightness(${index === historyFile.length - 1 ? "1" : "0.5"}); ${index === 0 ? "margin-top: auto;" : ""}`}
                            >
                                {@html replaceCurrentText(
                                    item.name === "" || item.name === undefined
                                        ? ""
                                        : item.name + "：",
                                )}
                                {@html replaceCurrentText(item.text)}
                            </div>
                        {/each}
                    </div>
                    <!-- 选项区域 -->
                    <div
                        class="flex flex-col h-[30vh] border-t-gray-300 border"
                    >
                        {#if gd(gc()).type === "choice"}
                            <div
                                transition:fade={{ duration: 400 }}
                                class="flex flex-col w-full h-full p-2.5 overflow-y-auto gap-2.5"
                            >
                                {#each gd(gc()).choice as choice, index}
                                    <button
                                        class="border-none outline-none w-full h-auto shrink-0 text-white hover:text-yellow-300 cursor-pointer"
                                        aria-labelledby={choice}
                                        onclick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSaveInfo(gd(gc()).id!, choice);
                                            let score =
                                                $dialogInstance[gc()]?.score;
                                            if (score !== undefined) {
                                                setSaveInfo(
                                                    score.targetId!,
                                                    score.action(
                                                        choice,
                                                        getSaveInfo(
                                                            score.targetId,
                                                        ),
                                                    ),
                                                );
                                            }
                                            historyFile.push({
                                                name: choiceTitle,
                                                text: choice,
                                            });
                                            setc(jumpTo(true));
                                            plusOne();
                                            next(false);
                                        }}
                                        ><span class="text-yellow-400"
                                            >{index + 1}.</span
                                        >
                                        {replaceCurrentText(choice)}</button
                                    >
                                {/each}
                            </div>
                        {:else}
                            <div
                                transition:fade={{ duration: 400 }}
                                class="flex shrink-0 h-[10vh] w-full items-center justify-center"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="text-yellow-400 w-[3vh] h-[3vh] animate-bounce"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 16 16"
                                    ><path
                                        fill="currentColor"
                                        d="M10.164 13.756c-.962 1.665-3.366 1.665-4.329 0L.918 5.251C-.045 3.584 1.158 1.5 3.083 1.5h9.834c1.925 0 3.128 2.084 2.164 3.751z"
                                    /></svg
                                >
                            </div>
                            <div class="flex-1"></div>
                        {/if}
                    </div>
                </div>
                <div class="relative w-[5vw] h-full border-l-gray-300 border">
                    <div
                        class="absolute flex flex-col items-center gap-[3vw] bottom-0 left-0 right-0 w-full h-auto mx-auto my-0"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-[4vw] h-[4vw] border-none outline-none cursor-pointer"
                            viewBox="0 0 64 64"
                            onclick={(e: Event) => {
                                e.preventDefault();
                                e.stopPropagation();
                                updateSave(getSaveInfo("name"), gc());
                            }}
                            onkeydown={(e: Event) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onkeyup={(e: Event) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            tabindex="0"
                            role="button"
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
                            class="text-sky-300 w-[4vw] h-[4vw] border-none outline-none cursor-pointer hover:text-orange-300"
                            style={quickCurrent
                                ? "color: rgb(257.48, 161.84, 162.27)"
                                : ""}
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            onclick={(e: Event) => {
                                e.preventDefault();
                                e.stopPropagation();
                                quick();
                            }}
                            onkeydown={(e: Event) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onkeyup={(e: Event) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            tabindex="0"
                            role="button"
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            ><path d="M12 22l-7 -7M12 22l7 -7" /><path
                                d="M12 16l-7 -7M12 16l7 -7"
                            /><path d="M12 10l-7 -7M12 10l7 -7" /></svg
                        ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="text-sky-300 w-[4vw] h-[4vw] border-none outline-none cursor-pointer hover:text-orange-300"
                            width="32"
                            height="32"
                            viewBox="0 0 48 48"
                            onclick={(e: Event) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.back();
                            }}
                            onkeydown={(e: Event) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onkeyup={(e: Event) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            tabindex="0"
                            role="button"
                            fill="none"
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="4"
                            ><path d="m13 8l-7 6l7 7" /><path
                                d="M6 14h22.994c6.883 0 12.728 5.62 12.996 12.5c.284 7.27-5.723 13.5-12.996 13.5H11.998"
                            /></svg
                        >
                    </div>
                </div>
            </div>
        </div>
        <div
            class="fixed top-10 left-0 flex items-center bg-gray-200 rounded-r-sm shadow-[0_0_10px_#333333] w-auto transition-[max-width] duration-200 overflow-hidden whitespace-nowrap"
            style={`max-width: ${isShowHint ? "300px" : "0"}`}
        >
            <span class="mx-2.5 text-2.5 text-black">{hintContent}</span>
        </div>
    </div>
{/if}
{#if showInput}
    <my-input-name
        in:fade={{ duration: 300 }}
        out:fade={{ duration: 300 }}
        result={(res: string) => {
            showInput = false;
            resultInput = res;
        }}
    ></my-input-name>
{/if}
