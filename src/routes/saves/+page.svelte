<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { currentSave, saveData } from "../../store/store";
    import {
        choiceTitle,
        dialogChapter0,
        dialogChapter1,
    } from "../../store/dialog";
    import { sleep, router, branchCount } from "../../utils/all";
    import { save, unlockGallery } from "../../utils/backend-tauri";
    import MyInputName from "./MyInputName.svelte";
    import "../../components/input/MyStarBack";
    import "../../components/input/MyCustomComponent";
    // 控制主屏幕显示。
    let showMainScreen = $state(false);
    // 控制 空格键 锁定
    let keyLock = $state(false);
    // 是否点击了快进
    let quickCurrent = $state(false);
    // 历史
    let historyFile = $state<any[]>([]);
    // 展示存档界面
    let showSaved = $state(false);
    // 展示开头的信息框
    let showInput = $state(false);
    let resultInput = $state("");
    // 自动播放
    let autoplay = $state(false);
    // 章节数
    let chapterNum = $state(0);
    let showChapter = $state(false);
    // 显示结局
    let showEnd = $state(false);
    let endText = $state("");
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
        currentSave.set({
            ...$currentSave,
            [key]: value,
        });
    }
    // 解锁任一画廊
    async function ug(id: number) {
        await unlockGallery(id);
        setGalleryMeta(id);
    }
    function getSaveInfo(key: string | undefined = undefined): any {
        if (key === undefined) {
            return $currentSave;
        }
        return $currentSave[key];
    }
    function gc(): number {
        return parseInt(getSaveInfo("current"));
    }
    function gi(): any {
        return chapterNum === 0 ? $dialogChapter0 : $dialogChapter1;
    }
    function gd(index: number): any {
        return gi()[index] ?? {};
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
    // 背景样式
    let backStyle = $state("");
    let backImage = $state("");
    // Tony 样式
    let TonyStyle = $state("");
    let TonyImage = $state("");
    // George 样式
    let GeorgeStyle = $state("");
    let GeorgeImage = $state("");
    // Andrey 样式
    let AndreyStyle = $state("");
    let AndreyImage = $state("");
    // 背景资源
    import Workplace from "../../assets/scene/workplace.jpg";
    import Hallway from "../../assets/scene/hallway.jpg";
    import Funeral from "../../assets/scene/funeral.jpg";
    import Bedroom from "../../assets/scene/bedroom.jpg";
    import Spaceport from "../../assets/scene/spaceport.jpg";
    // 立绘资源
    import AndreyCloth from "../../assets/illustration/andrey_cloth.png";
    import AndreyNocloth from "../../assets/illustration/andrey_nocloth.png";
    import AndreyNoeye from "../../assets/illustration/andrey_noeye.png";
    import AndreyHand from "../../assets/illustration/andrey_hand.png";
    import AndreyFace from "../../assets/illustration/andrey_face.png";
    import TonyCoat from "../../assets/illustration/tony_coat.png";
    import TonyShirt from "../../assets/illustration/tony_shirt.png";
    import TonyNoeye from "../../assets/illustration/tony_noeye.png";
    import GeorgeAll from "../../assets/illustration/george_all.png";
    import GeorgeNoall from "../../assets/illustration/george_noall.png";
    import GeorgeNocloth from "../../assets/illustration/george_nocloth.png";
    import GeorgeNocoat from "../../assets/illustration/george_nocoat.png";
    import GeorgeNoeye from "../../assets/illustration/george_noeye.png";
    import GeorgeNovest from "../../assets/illustration/george_novest.png";
    import Chapter from "./Chapter.svelte";
    import End from "./End.svelte";
    import Saved from "./Saved.svelte";
    // 音效资源
    import Machine from "../../assets/sounds/ogg/machine.ogg";
    const machine = new Audio(Machine);
    machine.loop = true;
    machine.volume = 0.2;
    import Camera from "../../assets/sounds/ogg/camera.ogg";
    const camera = new Audio(Camera);
    import Writing from "../../assets/sounds/ogg/writing.ogg";
    const writing = new Audio(Writing);
    import Collapse from "../../assets/sounds/ogg/collapse.ogg";
    const collapse = new Audio(Collapse);
    import Openbox from "../../assets/sounds/ogg/openbox.ogg";
    const openbox = new Audio(Openbox);
    async function doStyle(current: number, isQuick: boolean = false) {
        if (current === 0) {
            backStyle = `opacity: 0`;
            backImage = "";
            TonyStyle = `opacity: 0; bottom: 0; right: 0; height: 80%`;
            TonyImage = "";
            GeorgeStyle = `opacity: 0; bottom: 0; left: 0; height: 80%`;
            GeorgeImage = "";
            AndreyStyle = `opacity: 0; bottom: 0; right: 0; height: 80%`;
            AndreyImage = "";
        }
        if (gd(current).id === "start1") {
            backImage = Workplace as string;
            backStyle = `opacity: 1;`;
        } else if (gd(current).id === "start2") {
            GeorgeImage = GeorgeAll;
            GeorgeStyle = `opacity: 1; bottom: 0; left: 0; height: 80%`;
        } else if (gd(current).id === "start3") {
            backStyle = `opacity: 0`;
            if (!isQuick) await sleep(500);
            backImage = Hallway;
            backStyle = `opacity: 1`;
        } else if (gd(current).id === "start4") {
            TonyImage = TonyCoat as string;
            TonyStyle = `opacity: 1; bottom: 0; right: 0; height: 80%`;
        } else if (gd(current).id === "start5") {
            backStyle = `opacity: 0`;
            if (!isQuick) await sleep(500);
            backImage = Funeral;
            backStyle = `opacity: 1`;
        } else if (gd(current).id === "start6") {
            TonyStyle = `opacity: 0; bottom: 0; right: 0; height: 80%`;
            backStyle = `opacity: 0`;
            if (!isQuick) await sleep(500);
            backImage = Bedroom;
            backStyle = `opacity: 1`;
            GeorgeImage = GeorgeNocoat;
        } else if (gd(current).id === "start7") {
            TonyImage = TonyShirt;
            backStyle = `opacity: 0`;
            if (!isQuick) await sleep(500);
            backImage = Funeral;
            backStyle = `opacity: 1`;
            TonyStyle = `opacity: 1; bottom: 0; right: 0; height: 80%`;
            GeorgeImage = GeorgeAll;
        } else if (gd(current).id === "start8") {
            TonyStyle = `opacity: 0; bottom: 0; right: 0; height: 80%`;
            backStyle = `opacity: 0`;
            if (!isQuick) await sleep(500);
            backImage = Spaceport;
            backStyle = `opacity: 1`;
        } else if (gd(current).id === "writing") {
            if (!isQuick) writing.play();
        } else if (gd(current).id === "camera") {
            if (!isQuick) camera.play();
        } else if (gd(current).id === "collapse") {
            if (!isQuick) collapse.play();
        } else if (gd(current).id === "machine") {
            machine.play();
        } else if (gd(current).id === "openbox") {
            if (!isQuick) openbox.play();
        } else if (gd(current).id === "machinestop") {
            machine.pause();
        }
    }
    // 会根据 对话内容 进行下一步处理！
    // 返回 -10 代表已经走到末尾，返回 -11 代表这是一个选项。返回 -12 代表已经到末尾！
    function nextOne(index: number, plus: boolean): number {
        let resNum = index;
        if (resNum >= gi().length) return -10;
        if (gd(resNum).goto && gd(resNum).if) {
            const i = gi().findIndex(
                (item: any) => item.id === gd(resNum).goto,
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
        if (gd(resNum).type === "to") return resNum;
        if (!gd(resNum).message) return -12;
        return resNum;
    }
    function prevOne(index: number): number {
        let resNum = index;
        if (resNum <= 0) return -10;
        if (gd(resNum).prev) {
            const i = gi().findIndex(
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
        chapterNum = parseInt(getSaveInfo("saved"));
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
        if (m === 0 && chapterNum === 0) {
            showChapter = true;
            await sleep(10000);
            showChapter = false;
            await sleep(500);
        }
        showMainScreen = true;
        await sleep(500);
        dialogDom = document.querySelector(".dialog-by") as HTMLDivElement;
        dialogDom.scrollTop = dialogDom.scrollHeight + 200;
        await next(false);
        const back = document.querySelector(".back") as HTMLDivElement;
        const mc = document.querySelectorAll(".mousecover");
        back.addEventListener("mousemove", (e: MouseEvent) => {
            const x = window.innerWidth / 2 - e.pageX;
            const y = window.innerHeight / 2 - e.pageY;
            mc.forEach((el: any) => {
                const xPos = x / 300;
                const yPos = y / 300;
                el.style.transform = `translateX(${xPos}px) translateY(${yPos}px)`;
            });
        });
    });
    async function next(plus: boolean = true) {
        // if (lockText) {
        //     exitText = true;
        //     historyFile[historyFile.length - 1].text = replaceCurrentText(
        //         gd(gc()).message,
        //     );
        //     dialogDom.scrollTop = dialogDom.scrollHeight + 200;
        //     return;
        // }
        if (!gd(gc()).message) return;
        let n = nextOne(gc(), plus);
        if (n === -10 || n === -12) return;
        else if (n === -11) {
            plusOne();
            return;
        }
        if (gd(n).type === "to") {
            showMainScreen = false;
            await sleep(500);
            chapterNum = gd(n).to;
            console.log(chapterNum);
            setSaveInfo("saved", gd(n).to);
            showChapter = true;
            await sleep(5000);
            historyFile = [];
            setc(0);
            await sleep(5000);
            showChapter = false;
            await doStyle(0, true);
            await sleep(500);
            showMainScreen = true;
            await sleep(500);
            dialogDom = document.querySelector(".dialog-by") as HTMLDivElement;
            dialogDom.scrollTop = dialogDom.scrollHeight + 200;
            await next(false);
            return;
        }
        if (gd(n).type === "end") {
            showMainScreen = false;
            await sleep(500);
            endText = gd(n).message;
            showEnd = true;
            return;
        }
        setc(n);
        // lockText = true;
        await doStyle(gc());
        // let isLt = false;
        dialogDom.scrollTop = dialogDom.scrollHeight + 200;
        historyFile.push({
            name: gd(gc()).name,
            text: gd(gc()).message,
        });
        // for (let i = 0; i < (ct?.length ?? 0); i++) {
        //     if (exitText) {
        //         break;
        //     }
        //     if (ct[i] === "<") {
        //         isLt = true;
        //     }
        //     if (ct[i] === ">") {
        //         isLt = false;
        //     }
        //     if (!isLt) await sleep(20);
        //     if (exitText) {
        //         break;
        //     }
        //     historyFile[historyFile.length - 1].text += ct[i];
        //     dialogDom.scrollTop = dialogDom.scrollHeight + 200;
        //     if (exitText) {
        //         break;
        //     }
        // }
        await sleep(50);
        for (let i = 0; i < 200; i++) {
            dialogDom.scrollTop += 5;
            await sleep(5);
        }
        // dialogDom.scrollTop = dialogDom.scrollHeight + 200;
        // exitText = false;
        // lockText = false;
    }
    /**
     * 使用古法查看历史（ps：逐步往前退，直到退到 0。。由于 jumpTo 函数已经帮我们解决了分支问题，因此无需担心历史数据丢失或者起冲突。。）
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
        while (true) {
            if (!gd(gc()).message) break;
            let n = nextOne(gc(), true);
            if (n === -10 || n === -12 || !quickCurrent) break;
            if (n === -11) {
                plusOne();
                break;
            }
            if (gd(n).type === "to") {
                quickCurrent = false;
                showMainScreen = false;
                await sleep(500);
                chapterNum = gd(n).to;
                setSaveInfo("saved", gd(n).to);
                showChapter = true;
                await sleep(5000);
                historyFile = [];
                await sleep(5000);
                showChapter = false;
                await sleep(500);
                setc(0);
                next(false);
                showMainScreen = true;
                return;
            }
            if (gd(n).type === "end") {
                quickCurrent = false;
                showMainScreen = false;
                await sleep(500);
                endText = gd(n).message;
                showEnd = true;
                return;
            }
            setc(n);
            await sleep(50);
            await doStyle(gc(), true);
            historyFile.push({
                name: gd(gc()).name,
                text: gd(gc()).message,
            });
            dialogDom.scrollTop = dialogDom.scrollHeight + 200;
        }
        await sleep(50);
        for (let i = 0; i < 200; i++) {
            dialogDom.scrollTop += 5;
            await sleep(5);
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
    /**
     * @deprecated 从 f9 版本弃用，改用 Saved 组件使用！
     * @param name
     * @param current
     */
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
                // params.some,
                "",
                updateTime,
                name,
                chapterNum,
                current,
                new Array(branchCount)
                    .fill(null)
                    .map(
                        (_, index: number) =>
                            getSaveInfo(`branch${index + 1}`) ?? "",
                    ),
            );
            console.log($saveData);
        } catch (e: any) {}
    }
    setInterval(() => {
        if (autoplay) {
            next();
        }
    }, 3000);
    let TonyEye = $state(true);
    let GeorgeEye = $state(true);
    let AndreyEye = $state(true);
    setInterval(async () => {
        await sleep(Math.random() * 1000 + 2000);
        TonyEye = false;
        await sleep(500);
        TonyEye = true;
    }, 5000);
    setInterval(async () => {
        await sleep(Math.random() * 1000 + 2000);
        GeorgeEye = false;
        await sleep(500);
        GeorgeEye = true;
    }, 5000);
    setInterval(async () => {
        await sleep(Math.random() * 1000 + 2000);
        AndreyEye = false;
        await sleep(500);
        AndreyEye = true;
    }, 5000);
    // setInterval(() => {
    //     if(dialogDom) {
    //         dialogDom.scrollTop += 10
    //     }
    // }, 20)
</script>

{#if showMainScreen}
    <div
        class="back bg-img-full bg-[url(/src/assets/Home/back.jpg)] fixed top-0 left-0 right-0 bottom-0 m-0 w-screen h-screen border-none outline-none overflow-hidden flex items-center justify-center z-10"
        in:fade={{ duration: 500 }}
        out:fade={{ duration: 500 }}
        onclick={() => {
            // if (quickCurrent) quickCurrent = false;
            // next();
        }}
        onkeydown={spaceDown}
        onkeyup={spaceUp}
        tabindex="0"
        role="button"
    >
        <my-star-back></my-star-back>
        <div
            class="w-[60vw] h-[90vh] border-y-gray-300 border-y flex items-center relative"
        >
            <div
                class="w-full h-[88.5vh] border-y-gray-600 border-y flex items-center z-10"
            >
                <!-- 立绘区域 -->
                <div class="shrink-0 w-full h-full relative">
                    <img
                        src={backImage}
                        alt="背景图片"
                        class="absolute top-[50%] left-[50%] translate-[-50%] w-full aspect-16/10 transition-opacity duration-500"
                        style={backStyle}
                    />
                    <div
                        class="mousecover absolute transition-opacity duration-500 w-auto z-10"
                        style={GeorgeStyle}
                    >
                        {#if !GeorgeEye}
                            <img
                                src={GeorgeNoeye}
                                alt="主角眨眼"
                                class="absolute top-0 left-0 w-auto h-full"
                            />
                        {/if}
                        <img
                            src={GeorgeImage}
                            alt="主角图片"
                            class="w-auto h-full"
                        />
                    </div>
                    <div
                        class="mousecover absolute transition-opacity duration-500 w-auto z-10"
                        style={TonyStyle}
                    >
                        {#if !TonyEye}
                            <img
                                src={TonyNoeye}
                                alt="Tony眨眼"
                                class="absolute top-0 left-0 w-auto h-full"
                            />
                        {/if}
                        <img
                            src={TonyImage}
                            alt="Tony图片"
                            class="w-auto h-full"
                        />
                    </div>
                    <div
                        class="mousecover absolute transition-opacity duration-500 w-auto z-10"
                        style={AndreyStyle}
                    >
                        {#if !AndreyEye}
                            <img
                                src={AndreyNoeye}
                                alt="主角眨眼"
                                class="absolute top-0 left-0 w-auto h-full"
                            />
                        {/if}
                        <img
                            src={AndreyImage}
                            alt="主角图片"
                            class="w-auto h-full"
                        />
                    </div>
                    <div
                        class="absolute right-0 bottom-[13vh] wvr text-white font-bold"
                        style="font-size: 8vh;"
                    >
                        管理员
                    </div>
                </div>
            </div>
        </div>
        <div
            class="relative flex flex-col items-center flex-1 h-full border-x-gray-600 border-x z-10"
        >
            <!-- 四个角的装饰 -->
            <div
                class="absolute top-0 -left-[0.2rem] w-[0.3rem] h-[7.5vh] bg-white"
            ></div>
            <div
                class="absolute top-0 -right-[0.2rem] w-[0.3rem] h-[7.5vh] bg-white"
            ></div>
            <div
                class="absolute -left-[3.4vh] w-[4vh] top-[4.75vh] h-[0.3rem] bg-white"
            ></div>
            <div
                class="absolute -right-[3.4vh] w-[4vh] top-[4.75vh] h-[0.3rem] bg-white"
            ></div>
            <div
                class="absolute bottom-0 -left-[0.2rem] w-[0.3rem] h-[7.5vh] bg-white"
            ></div>
            <div
                class="absolute bottom-0 -right-[0.2rem] w-[0.3rem] h-[7.5vh] bg-white"
            ></div>
            <!-- 自动播放 -->
            <div
                onclick={() => {
                    autoplay = !autoplay;
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
                class="absolute cursor-pointer bottom-6 -left-[13vw] w-[5.4vh] h-[5.4vh] border-2 border-solid border-white text-white hover:border-green-300 hover:*:text-green-300"
                style={autoplay
                    ? "border: 2px solid oklch(79.2% 0.209 151.711)"
                    : ""}
            >
                <div
                    class="absolute -bottom-[2vh] left-0 right-0 mx-auto flex flex-col items-center"
                    style="font-size: 1.1vh; color: oklch(55.1% 0.027 264.364);"
                >
                    自动播放
                </div>
                <div
                    class="absolute -top-[4.8vh] -translate-x-[50%] left-[50%] max-w-none border border-solid border-white flex flex-col items-center"
                >
                    <div
                        class="text-black m-0.75 bg-white whitespace-nowrap"
                        style="font-size: 1.6vh;"
                    >
                        太空港·丧葬及遗产办公室
                    </div>
                </div>
                <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    style={autoplay ? "color: oklch(79.2% 0.209 151.711)" : ""}
                    class="w-full h-full"
                >
                    <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="2"
                    ></circle>
                    <path d="M9 7L9 17L18 12Z" fill="currentColor"></path>
                </svg>
            </div>
            <div
                class="flex flex-col items-center h-full w-[98%] border-x-gray-300 border-x bg-[#3D3D3DFF]"
            >
                <!-- 对话区域 -->
                <div
                    class="dialog-by flex-1 w-full flex flex-col gap-3 overflow-y-auto p-4"
                >
                    {#each historyFile as item, index}
                        <div
                            class="zwtext break-all shrink-0 text-white h-auto w-full text-left transition-[filter] duration-400"
                            style={`filter: brightness(${index === historyFile.length - 1 ? "1" : "0.5"}); ${index === 0 ? "margin-top: auto;" : ""}`}
                        >
                            {@html replaceCurrentText(
                                item.name === undefined || item.name === ""
                                    ? ""
                                    : item.name + "：",
                            )}
                            {@html replaceCurrentText(item.text)}
                        </div>
                    {/each}
                </div>
                <!-- 选项区域 -->
                <div class="relative w-full h-[35vh]">
                    {#if gd(gc()).type === "choice"}
                        <div
                            transition:fade={{ duration: 400 }}
                            class="absolute top-0 left-0 flex flex-col w-full h-full p-2.5 overflow-y-auto gap-3"
                        >
                            {#each gd(gc()).choice as choice, index}
                                <button
                                    class="zwtext break-all border-none text-left outline-none px-2.5 w-full h-auto py-1 shrink-0 text-white cursor-pointer
                                    hover:*:text-black hover:text-black hover:bg-yellow-300
                                    active:text-yellow-300 active:bg-black active:*:text-yellow-300 active:outline-yellow-300 active:outline-2 active:outline-solid"
                                    aria-labelledby={choice}
                                    onclick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSaveInfo(gd(gc()).id, choice);
                                        let score = gi()[gc()]?.score;
                                        if (score !== undefined) {
                                            setSaveInfo(
                                                score.targetId,
                                                score.action(
                                                    choice,
                                                    getSaveInfo(score.targetId),
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
                                    {@html replaceCurrentText(choice)}</button
                                >
                            {/each}
                        </div>
                    {:else}
                        <div
                            transition:fade={{ duration: 400 }}
                            class="absolute top-0 left-0 flex shrink-0 h-[10vh] p-2.5 w-full items-center justify-center"
                        >
                            <button
                                class="zwtext break-all border-none text-left outline-none px-2.5 w-full h-auto py-1 shrink-0 bg-yellow-300 text-black cursor-pointer
                                    hover:*:text-black hover:text-black hover:bg-white
                                    active:text-yellow-300 active:bg-black active:*:text-yellow-300 active:outline-yellow-300 active:outline-2 active:outline-solid"
                                aria-labelledby="继续"
                                onclick={() => {
                                    if (quickCurrent) quickCurrent = false;
                                    next();
                                }}>继续</button
                            >
                        </div>
                        <div class="flex-1"></div>
                    {/if}
                </div>
            </div>
        </div>
        <div
            class="w-[10vw] h-[90vh] border-y-gray-300 border-y flex items-center z-10"
        >
            <div
                class="w-full h-[88.5vh] border-y-gray-600 border-y flex items-center relative"
            >
                <div
                    class="absolute flex flex-col gap-[1vw] bottom-[15vh] left-[1vh] w-auto h-auto my-0"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-[30px] h-[30px] border-none outline-none cursor-pointer"
                        viewBox="0 0 64 64"
                        onclick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            showMainScreen = false;
                            await sleep(500);
                            showSaved = true;
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
                        class="text-sky-300 w-[30px] h-[30px] border-none outline-none cursor-pointer hover:text-orange-300"
                        style={quickCurrent
                            ? "color: rgb(257.48, 161.84, 162.27)"
                            : ""}
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            quick();
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
                        class="text-sky-300 w-[30px] h-[30px] border-none outline-none cursor-pointer hover:text-orange-300"
                        width="32"
                        height="32"
                        viewBox="0 0 48 48"
                        onclick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.back();
                            machine.pause();
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
{/if}
{#if showInput}
    <div in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
        <MyInputName
            result={(res) => {
                showInput = false;
                resultInput = res;
            }}
        ></MyInputName>
    </div>
{/if}
{#if showChapter}
    <div in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
        <Chapter chapter={chapterNum}></Chapter>
    </div>
{/if}
{#if showEnd}
    <div in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
        <End {endText} result={() => router.push("/")}></End>
    </div>
{/if}
{#if showSaved}
    <div in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
        <Saved
            result={async () => {
                showSaved = false;
                await sleep(500);
                showMainScreen = true;
                await sleep(500);
                dialogDom = document.querySelector(
                    ".dialog-by",
                ) as HTMLDivElement;
                dialogDom.scrollTop = dialogDom.scrollHeight + 200;
            }}
        ></Saved>
    </div>
{/if}

<style>
    .wvr {
        writing-mode: vertical-rl;
        text-orientation: upright;
    }
    :global(.zwtext) {
        font-size: 1.5vw;
    }
    :global(.zwtext *) {
        font-size: 1.5vw;
    }
</style>
