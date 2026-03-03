import { keyed } from "lit/directives/keyed.js";
import { readable } from "svelte/store";
/**
 * key: 传入你需要判断的 branch 名称。
 * value: 可以填入一个字符串，也可以填入一个函数。填入字符串的话，就仅判断是否相等。如果填入函数的话，就可以判断类似分数，分数见下！分数可以用作角色好感度！
 * next: 一个 if 可以传入一个列表，那么自然少不了 and 和 or 拼接！这里一般末尾的 ifbranch 无需填入 next，然后上面的传入 next 就可以判断与下面的是 and 还是 or！
 * 以下是一个示例填写：
 * ```js
 * {
 *   type: "choice",
 *   id: "branch1",
 *   choice: ["牛奶", "橙汁", "汽水"],
 * },
 * {
 *   type: "choice",
 *   id: "branch2",
 *   choice: ["跑步", "骑马", "射箭"]
 * },
 * {
 *   name: "小龙",
 *   message: "这里是 if 判断测试，我猜测你上面肯定既选择了牛奶，然后选择了跑步或骑马！你居然不喜欢射箭？",
 *   if: [
 *     {
 *       key: "branch1",
 *       value: "牛奶",
 *       next: "and"
 *     },
 *     {
 *       key: "branch2",
 *       value: "跑步",
 *       next: "or"
 *     },
 *     {
 *       key: "branch2",
 *       value: "骑马"
 *     }
 *   ]
 * }
 * ```
 * 上述最终会拼接成类似下面的样子：
 * if (branch1 === "牛奶" && branch2 === "跑步" || branch2 === "骑马")
 * 好了，我承认，上述应该是判断牛奶和跑步，如果牛奶和跑步同时满足，则骑马无论满足不满足，都会执行，反之，骑马满足了，那么无论 branch1 选择的是否是牛奶，都会执行。
 * 那么如何解决这个问题呢？答案是：将 branch2 放到前面！
 * 这样的话，就变成了如下：
 * ```js
 * {
 *   name: "小龙",
 *   message: "这里是 if 判断测试，我猜测你上面肯定既选择了牛奶，然后选择了跑步或骑马！你居然不喜欢射箭？",
 *   if: [
 *     {
 *       key: "branch2",
 *       value: "跑步",
 *       next: "or"
 *     },
 *     {
 *       key: "branch2",
 *       value: "骑马",
 *       next: "and"
 *     },
 *     {
 *       key: "branch1",
 *       value: "牛奶"
 *     }
 *   ]
 * }
 * ```
 * 上述最终会拼接成类似下面的样子：
 * if (branch2 === "跑步" || branch2 === "骑马" && branch1 === "牛奶")
 * 当然，由于程序是从左往右运行的，并不存在优先级，因此 || 和 && 的优先级是平级，最终会先判断跑步和骑马，如果任意一个为 true，则判断牛奶，如果牛奶也为 true，则执行！
 */
interface IfInterface {
  key: string;
  value: string | ((branch_value: string) => boolean);
  next?: "and" | "or";
}
/**
 * targetId: 用于保存的变量。需要与当前 if 分支的不同，if 分支的和该处的必须不同。choice 是用来存储当前选项的，targetId 才是用来存储当前变量的！并且所有的 targetId 都必须使用 branch + 数字 来命名！并且全局的 branch 必须全部递增，不能跳过或重复！
 * action: 是一个函数类型，接收两个参数，返回 1 个字符串值。
 * 以下是一个示例填写：
 * ```js
 * {
 *   type: 'choice',
 *   choice: ["牛奶", "橙汁", "汽水"]
 *   score: {
 *     targetId: "branch10",
 *     action: (branch: string, rawValue: string) => {
 *       if (branch === "牛奶") return (parseInt(rawValue) || 0) + 1;
 *       if (branch === "橙汁") return (parseInt(rawValue) || 0) + 2;
 *       if (branch === "汽水") return (parseInt(rawValue) || 0) + 3;
 *     }
 *   }
 * }
 * ```
 * 随后在底下判断：
 * ```js
 * {
 *   name: "小龙",
 *   message: "哇，是牛奶，我也喜欢喝！",
 *   if: [
 *     {
 *       key: "branch10",
 *       value: (branch_value: string) => {
 *         return branch_value === "1" || parseInt(branch_value) === 1
 *       }
 *     }
 *   ]
 * }
 * ```
 * 由于选项均各不相同，因此此处可以把 value 当作一个闭包来填入！
 */
interface ScoreInterface {
  targetId: string;
  action: (branch: string, rawValue: string) => string;
}
/**
 * type: 目前只有三个值，还有一个默认。
 * 1. choice：表示选择
 * 2. to：表示跳转章节，跳转到哪个章节就执行哪个。
 * 3. end：表示结束所有章节，显示 message 内容并返回主界面！
 * id: 当前对话唯一 id（每个章节均需要唯一。）ps：所有 choice 选项的 id 必须是：branch + 数字！而且数字必须递增且不能重复！其余的无所谓。
 * // 以下是当 type 为默认时添加的内容
 * name: 当前对话者名字（可以直接写 html 标记）
 * avatar: 头像（已废除）
 * message: 当前对话内容（可以直接写 html 标记）
 * // 以下是当 type 为 choice 时添加的内容
 * choice: 定义一大堆的选择。
 * score: 定义分数。见上面所示
 * // 以下时全局定义
 * if: 优先级最大，可以当作分支运行，程序会先判断 if 分支，再判断是否应该执行该内容，此处适用于任何 type 任何值的任何地方。。
 * goto: 表示跳转对话。优先级次要，会跳转到对应 id 的对话。无论这个对话在哪。如果对话在前，则重新进入时历史记录将不会显示在页面上。
 * goto 另一种说法：
 * to: 表示跳转章节。0 代表序章，1 代表第一章。以下分别用 dialogChapter0、dialogChapter1 代替。
 */
interface DialogInterface {
  type?: string;
  id?: string;
  name?: string;
  avatar?: string;
  message?: string;
  choice?: Array<string>;
  score?: ScoreInterface;
  if?: Array<IfInterface>;
  goto?: string;
  to?: number;
}
// 以下均是为了方便构建最终的 dialogInstance 而创建的函数！各位既可以忽略，也可以直接照着写！
// Normal 有 goto 选项，为的就是简化下列操作。
function Normal(
  name: string,
  message: string,
  ifbranch: IfInterface[] | undefined = undefined,
  id: string = "",
  goto: string | undefined = undefined
): DialogInterface {
  return {
    id,
    name,
    message,
    if: ifbranch,
    goto,
  };
}
const publicCss = `color: white; background-color: transparent; font-size: 1.2vw; padding: 2px; border-radius: 2px;`;
function Aside(
  message: string,
  ifbranch: IfInterface[] | undefined = undefined,
  id: string = "",
  goto: string | undefined = undefined
): DialogInterface {
  return Normal("", message, ifbranch, id, goto);
}
// 这里乔治的 goto 参数仅是为了解决下列的 走迷宫环节 跳转做准备！
function George(
  message: string,
  ifbranch: IfInterface[] | undefined = undefined,
  id: string = "",
  goto: string | undefined = undefined
): DialogInterface {
  return Normal(
    `<span style="${publicCss} background-color: brown;">%name</span>`,
    message,
    ifbranch,
    id,
    goto
  );
}
function Admin(
  message: string,
  ifbranch: IfInterface[] | undefined = undefined,
  id: string = "",
): DialogInterface {
  return Normal(
    `<span style="${publicCss} background-color: limegreen;">管理员</span>`,
    message,
    ifbranch,
    id,
  );
}
function Qm(
  message: string,
  ifbranch: IfInterface[] | undefined = undefined,
  id: string = "",
): DialogInterface {
  return Normal(
    `<span style="${publicCss} background-color: darkgray;">？？</span>`,
    message,
    ifbranch,
    id,
  );
}
function Tony(
  message: string,
  ifbranch: IfInterface[] | undefined = undefined,
  id: string = "",
): DialogInterface {
  return Normal(
    `<span style="${publicCss} background-color: orange;">托尼</span>`,
    message,
    ifbranch,
    id,
  );
}
function Andrey(
  message: string,
  ifbranch: IfInterface[] | undefined = undefined,
  id: string = "",
  goto: string | undefined = undefined
): DialogInterface {
  return Normal(
    `<span style="${publicCss} background-color: gold;">安德烈</span>`,
    message,
    ifbranch,
    id,
    goto,
  );
}
function Wildebeest(
  message: string,
  ifbranch: IfInterface[] | undefined = undefined,
  id: string = "",
): DialogInterface {
  return Normal(
    `<span style="${publicCss} background-color: lightcoral;">角马</span>`,
    message,
    ifbranch,
    id,
  );
}
function Choice(
  id: string,
  choice: string[],
  ifbranch: IfInterface[] | undefined = undefined,
): DialogInterface {
  return {
    type: "choice",
    id: id,
    choice: choice,
    if: ifbranch,
  };
}
const ifbranch3a4: IfInterface[] = [
  {
    key: "branch7",
    value: "可是，到地球我能做什么呢？我的工作怎么办？",
    next: "and",
  },
  {
    key: "branch8",
    value: "托尼，你去过下面卫星吗？",
  },
];
const ifbranch3a4a5: IfInterface[] = [
  {
    key: "branch7",
    value: "可是，到地球我能做什么呢？我的工作怎么办？",
    next: "and",
  },
  {
    key: "branch8",
    value: "托尼，你去过下面卫星吗？",
    next: "and",
  },
  {
    key: "branch9",
    value: "卖掉船票",
  },
];
const ifbranch3o4o5: IfInterface[] = [
  {
    key: "branch7",
    value: "你说的对，再也不会有这么好的机会了。下一趟飞船在什么时候？",
    next: "or",
  },
  {
    key: "branch8",
    value: "你说的对，在到达地球前不需要考虑这种事。下一趟飞船在什么时候？",
    next: "or",
  },
  {
    key: "branch9",
    value: "不卖船票",
    next: "or"
  },
  {
    key: "branch100",
    value: (branch_value: string) => {
      return parseInt(branch_value) >= 10
    }
  }
];
// 这里是选项的【标题】
export const choiceTitle = `<span style="${publicCss} background-color: blue;">选项</span>`;
// 以下为构建文案，可以直接写对象，也可以写函数！总之 TypeScript 或者 JavaScript 能用的这里都可以写！
// dialogChapter0 是序章的，dialogChapter1 是第一章的，以此类推！
// 序章
export const dialogChapter0 = readable<DialogInterface[]>([
  Aside("一个方正的房间。狭小，几乎推开门就会撞到桌子。金属桌腿和地板是一体的，典型的空间站早期风格，“为了预防可能的撞击”。除此之外，房间里只有档案柜，管理员，档案柜。他们沉默着。"),
  Aside("冷色的日光灯照在管理员的鬃毛上，在桌面上投下了巨大的阴影。这会离开门已经过去了几秒，他停笔，抬头看了看，稍稍坐直，身下的折叠椅发出不堪重负的噪音。"),
  Admin("姓名？", [], "start1"),
  Choice("branch1", ["直接告诉他", "或者你先告诉我，你的名字？"]),
  ...(() => {
    const ifbranch: IfInterface[] = [
      {
        key: "branch1",
        value: "或者你先告诉我，你的名字？",
      },
    ];
    return [
      Admin("什么？", ifbranch),
      Qm("告诉我，你的名字。", ifbranch),
      Admin("没有这个流程，你到底办不办这个手续？", ifbranch),
      Qm("办。我只是……突然想关心你？", ifbranch),
      Admin("关心我？", ifbranch),
      Aside("他皱着眉，好像你说了什么高深的难以理解的术语", ifbranch),
      Admin("我只需要你回答问题。", ifbranch),
      Qm("好的。", ifbranch),
      Admin("名字？", ifbranch),
    ];
  })(),
  George("%name。", [], "start2"),
  Admin("种族？"),
  George("食肉动物。"),
  Admin("年龄？"),
  George("22岁。"),
  Admin("性别？"),
  George("雄。"),
  Admin("和死者关系？"),
  George("他是我的叔叔，我是他侄子。"),
  Admin("工作？"),
  George("废品分类中心。"),
  Aside("管理员挑着眉毛抬起了头，上下打量了一番。"),
  Aside("你很平静。看吧，从头到脚都可以在他眼前展示。在过去10年里，每个人听说你的工作后都会忍不住这样看。"),
  Admin("你就是那个%name？"),
  Choice("branch2", [
    "如果是指在废品分类中心工作的话，那就是我。",
    "对，我就是那个%name，和其他%name不一样的%name。哪怕两个互不相干的人，只要说“那个%name”，他们两个也会一起默契地点头。",
  ]),
  Aside("他微不可察地点了点头。"),
  Admin("在这里签字。"),
  // 播放 签字声
  Aside("一张纸被递了过来，你潦草地签好了名字。", [], "writing"),
  Admin("看镜头，看这里。"),
  Aside("他按动了某处开关，一个照相机从边缘升上来。"),
  George("还要拍照？", [], "camera"),
  // 闪光声，快门声
  Admin("别说话，重拍。"),
  // 闪光声，快门声
  Admin("好了。出门左拐走到头，看到两扇大门推开进去。", [], "camera"),
  // 切换场景：走廊
  Aside("走廊像一条苍白的喉咙。", [], "start3"),
  // 托尼走上来
  Tony("%name，你还好吧？", [], "start4"),
  Choice("branch3", [
    "还好，只是没想到还要照相。",
    "不太好。我感觉自己要被闪光灯谋杀了。",
  ]),
  Tony("流程罢了，手续顺利？我特意和同事打了招呼，他处理得快极了。我可见过这种事上拖拖拉拉能有多糟心。"),
  Aside("你忍不住地去舔自己的鼻子。"),
  Tony("我是说，节哀。我知道这很难接受，但查理叔叔走的很安详，他最后在垃圾传送带上拽下了一个蛋，几乎完好。天知道现在的人在想什么，这种东西都能出现在回收站，简直是道德败坏……"),
  George("托尼，开始流程吧。我……我不想听那个。"),
  Tony("好的，好的，我明白。"),
  Aside("托尼走到告别厅的大门前，你和他从小一起长大，也一直知道他在这里工作，但今天还是第一次看到他这幅打扮。"),
  Aside("大门被拉开，门轴发出摩擦的声音。"),
  // 切换场景：告别厅
  Tony("那么，你和逝者的关系？", [], "start5"),
  Choice("branch4", [
    "又来？就非要做这种事吗？",
    "刚刚在那个办公室已经问过我一遍了。",
  ]),
  Aside("他耸了耸肩膀，给了我一个无奈的表情，“一种流程”。"),
  Tony("那么，你和逝者的关系？"),
  George("叔侄。"),
  Tony("在场诸位有异议吗？"),
  Aside("整个告别厅里只有我和托尼。我不知道为什么会有这样的流程，也不想知道。我盯着虚空中的某一处，鼻子却实时提醒着我，这里是弥漫着消毒水味的告别厅。"),
  Tony("今天我们为一位逝者哀悼，为一位Am-ω-7太空港的驻守者哀悼，他完成了他的工作，还清了全部的债务，他是一名标准的、合格的……"),
  Tony("%name？%name？"),
  Aside("我听到有人在叫我的名字，回过神，托尼目光关切地看着我。我想，如果不是流程，他大概会下来给我一个拥抱。"),
  George("抱歉……"),
  Tony("没事，该下一个环节了。"),
  Tony("确认一下查理的遗产。他的遗产不多，一个还剩15年许可的储物柜兼1.74m可折叠式休息区，一点信用点存款，还有一个……蛋？那种情况下都能把它拽下来，唔，我都不知道该怎么说了。总之先签字吧。"),
  // 签字声
  Tony("最后一个流程，啧。", [], "writing"),
  George("怎么了？"),
  Tony("我们可能有一点小麻烦，但相信我，会过去的，很简单。"),
  Aside("托尼看着我的眼睛，轻轻地推着我的手臂，让我在座位上坐好。"),
  Tony("请死者家属致辞。"),
  Aside("我站起身，准备走到讲台上。"),
  Tony("不，%name，你先在那边等一等。这个环节需要父母、妻子或者儿女。"),
  George("托尼？你在搞什么？"),
  Tony("流程。该死的流程就是这样的。请逝者家属致辞。请死者家属致辞。"),
  George("这里唯一的家属就是我！而我要看你对着空屋子喊“请家属致辞”？这太荒唐了，荒唐！"),
  Tony("我……我真的没有办法，这就是流程。我可以站在这里和你解释，从现在解释到明天都可以。但是我不能不说那句话，也不能让你上台，我的工作就是这是这样。"),
  George("查理叔叔根本就没结过婚，他的父母早不在了，我就是他唯一的亲人，他也是我唯一的亲人！怎么才能取消这该死的流程？！"),
  Aside("“唉。”托尼长长地叹了一口气，用那种熟悉的“我就知道”的眼神看着我。"),
  Tony("证明查理没有父母、妻子或子女。"),
  George("需要什么证明？"),
  Tony("没法证明。"),
  George("为什么？"),
  Tony("证明查理没有父母、妻子或子女。"),
  Tony("因为大家都……你明白吗？有出生证明、结婚证明、离婚证明、工作场所出入证明，但不会专门有一份证明去证明你什么关系都没有。总之，等我喊三遍，确认他们未到场之后，你就可以签字走人了。前面的手续都非常顺利，这是最后一步。"),
  George("你是说，按流程，宁可喊三遍根本不存在的人，我也没法在我叔叔的葬礼上说什么？"),
  Tony("是的。"),
  Aside("熟悉的眼神。托尼看着我，我想我这样的表情他已经看过了很多很多次，以至于我们都相互了解对方会干些什么。"),
  Tony("别做傻事。"),
  George("我什么都不做，那才是傻事。"),
  Tony("等等。等一等。只要你愿意等一小段时间，那就……"),
  George("我愿意。"),
  Tony("那就等365天+178天+285天+974天后，只要没人来认领其他亲属的身份，你就可以凭遗产接受人的身份开始葬礼悼词了。"),
  George("如果有人来怎么办？"),
  Tony("骗子吗？他们不会来的，想要确认身份至少得开5到15份证明，等开完，你早已经签完字了。而且他们来干嘛？骗一个在葬礼上致辞的机会？除了你没人那么干。"),
  Choice("branch5", [
    "谢谢，我真的非常感谢你……",
    "伙计，我以后会给你换一个闪闪发亮的无缝一体式头套，我说真的，无论多少钱我都要买给你。",
  ]),
  Aside("我可能要哭了，鼻子在发酸，我想我刚刚的样子可能像是在胡闹，我也不知道为什么突然难以忍受，明明这一切马上就要过去……"),
  Tony("别来这套，这是我应该做的。我没什么可劝你的，这种事不是说几句话就能过去的，不管如何，你得保持健康。"),
  Tony("%name？你在听吗？"),
  Aside("我几乎想不起来我是怎么走出门的。难怪托尼从来不提他的工作，如果他每天面对的都是这种事，那么我也会什么都不说，一到公共休息区就来三管无酒精麻醉剂。"),
  Tony("等等，%name！"),
  Aside("大门被推开，发出咔吱咔吱的响声。"),
  Aside("托尼在身后喊我，我回头看去。他怀里抱着一条巨大的乳白色的蛋，蛋壳上闪着牙齿一样的光泽。托尼甚至没法一只手托住它。他双手抱着蛋，艰难地用肩膀顶开大门。"),
  Tony("这个算是HB-c1，特殊活体宠物，按照规定……别管那些了，总之你可以先把这个带走。其他什么也别放在心上，就算不走完流程你也可以继续在查理的位置睡，根本没人管这种事。"),
  Choice("branch6", ["谢谢你，托尼", "亲吻托尼"]),
  Aside("我抱住了他，那枚蛋隔在我俩中间，撞在托尼坚硬的身体上发出一声脆响。"),
  // 切换场景：宿舍床铺
  Aside("最终，你回到休息区，带着饥饿、疲惫还有些陌生的情绪，你并不愿意去确认那到底是什么。", [], "start6"),
  Aside("蛋也没事，它完整地被你带回来了。"),
  Aside("休息区仍是你熟悉的样子，紧贴墙壁的垂直货架，上面摆了许多稀奇的小玩意——都是从垃圾传送带上捡回来的。"),
  Aside("把货架沿着滑轨抬上去，剩下的空间才是你真正的家——一张床铺。"),
  Aside("在查理捡到你的前几年，他和你共享这处休息区；在你能承担工作任务之后，你们两个就轮流使用这块区域了——那很艰难，不过你们积累一笔不错的信用点，如果一切按部就班，再过几年，查理或许会退休，或许会去卫星上养老，或许……"),
  Aside("而现在，你的目光看向那枚蛋，它没被扔进货架，而被你放在了床垫上，你下意识地给它找了一个柔软的地方——你还没意识到，不过这种想法已经偷偷地在你脑子里盘恒一阵子——是不是该像查理收养你一样孵化这枚蛋呢？"),
  // 播放音效：哗啦啦嘭！
  Aside("查理的邻居回来了，一位角马，查理也是。"),
  Aside("准确地说，整个垃圾分类回收中心只有你不是角马，你是%name，垃圾分类回收中心的鬣狗%name。"),
  George("你好！"),
  Aside("你稍有一点紧张，他的休息时间和你不同，这可能是你们第二次或者第三次见面？"),
  Wildebeest("好。"),
  George("从今天起，这个休息区就只有我了。"),
  Wildebeest("嗯。"),
  George("因为查理死了。"),
  Wildebeest("哦？噢，我想起来了，是这么回事。"),
  George("你们之前相处的怎么样？"),
  Aside("（巨大的低沉的机械运作噪声）", [], "machine"),
  Aside("你和邻居的聊天就像被按下暂停键。"),
  Aside("这上面是太空港的装卸仓，时不时就会响起这样的噪声，但这小小的代价也换来了巨大的收益，你们有更大的空间，甚至还有一列升降货架。"),
  Aside("角马的目光打量着你，你尴尬地微笑着，稍稍担心会不会露出了太多的牙齿，那会让你看起来不太友善。"),
  Aside("你好想舔自己的鼻子。"),
  Aside("……"),
  Aside("噪声过去了。", [], "machinestop"),
  Wildebeest("不，我和查理不熟。"),
  Aside("他转过身，开始换下工作服，无意再与你交谈。你慢慢地坐下去，床铺很软。"),
  // 播放重物坠落声
  Aside("嘭！", [], "collapse"),
  Aside("那枚蛋从床铺上滚到地上，细细纹路出现在它的表面，越来越大，就像是裂缝。"),
  Aside("是的，它就是裂缝。蛋摔坏了。"),
  Wildebeest("唔，我离它可很远。"),
  Aside("角马说着，他已经换好了衣服。"),
  Wildebeest("我要去公共区，再见。"),
  Aside("他飞快地离开了。"),
  George("再见。"),
  Aside("角马的脚步声渐远。"),
  Aside("再见个屁。"),
  Aside("再他妈的见。"),
  Aside("你几乎是从床铺上弹起来，狠狠咬在对面的货架上，牙齿和金属发出酸涩的嘎吱声，本能让你疯狂地晃动脖子，甩动头部，切割想象中的猎物。"),
  Aside("你的手攥冰冷的金属滑轨，就像按着濒死的躯体，兴奋感化成一股热流沿着脊椎爬行到脑子里，你压抑不住的、从胸腔深处发出的闷哼在狭小的休息区内撞击回荡，又被新一阵的机器噪声淹没。"),
  Aside("最终你用尽所有的力气在金属边框留下一个浅浅的痕迹。"),
  Aside("你筋疲力尽。"),
  George("抹布，抹布，抹布……"),
  Aside("货架堆满了曾经的“宝贝”，损坏的内窥镜、备用维生导管、卵形钳、十字滑块联轴器……终于，你找到了该死的抹布，准备擦去刚刚甩的到处都是的口水，还有蛋液，那么大的一个蛋，一定淌的满地都是……等等？"),
  Aside("地面上没有蛋液。"),
  Aside("没有蛋液。"),
  Aside("你蹲下身，看着那枚蛋，指尖摩挲这裂缝的边缘，光滑，甚至有微微的弧度。你用力沿着裂缝一掰——"),
  Aside("咔！", [], "openbox"), // 播放：盒子打开的声音（不阻止线程）
  Aside("蛋壳顺滑地分成两半，里面空空如也。没有蛋清，没有蛋黄，没有任何活体组织应有的痕迹。内壁光滑如镜，闪着陶瓷的光泽。"),
  Aside("那道裂缝是一个精心设计的开合口，巧妙地做成了蛋壳碎裂的模样，里面严丝合缝的卡榫在刚才的撞击下刚好弹开。"),
  Aside("躺在两半蛋壳中间的，是一张材质奇特的卡片。"),
  Aside("它很薄，却异常坚韧，像是某种合成织物，又带着一点生物材质的柔韧。你小心地把它翻转过来——"),
  Aside("家园号-全程-顶层豪奢套间<br>目的地：地球"),
  Aside("你知道这趟飞船，这座太空港就是为它建设的，据说是史上最庞大，最昂贵，也最声名远播的星际客轮。你曾经和托尼一起幻想过其中的生活，十几种口味的营养膏，随时供应的热水，真空一般的安静，还有高含氧无异味的空气……"),
  Aside("至于地球，那是你做梦难以想象的地方，你只见过港口的公共屏幕上播放它的广告：蓝天，白云，绿色的植物，水多到可以占满整个镜头，到处都是水——乘坐家园号的有钱人就是去那。"),
  Aside("不过你从不觉得，那和你有什么关系。就像想象自己成为恒星。太遥远，太不真实了。这张船票，这张轻飘飘的、从一颗像蛋的盒子里掉出来的船票，却把那个传说砸到了你的面前，带着沉甸甸的、令人眩晕的重量。"),
  Aside("混乱的思绪像受惊的鼠群在你脑中窜动。狂喜的萌芽刚刚探出头，就被更庞大的疑虑和不安死死压住。本能告诉你，必须藏好它。你迅速将两半蛋壳扣回，裂缝严丝合缝地消失，它又变回那颗巨大、无辜、闪着牙白色光泽的蛋。你把它踹得粉碎，看上去就像经历过无数次磕碰一样。碎片零零散散地投到各个垃圾通道，然后你抓起通讯器，手指因为用力和饥饿而微微发抖。"),
  Aside("联系托尼。现在。"),
  Tony("锟斤拷锟竭讹拷膩……"),
  George("托尼！托尼！"),
  Tony("%name？你应该去食堂排队，难道饭也不吃了吗？"),
  George("别担心那个，我要见你，现在。"),
  Tony("到底出什么事了？"),
  George("见面说，我需要一个安全的地方。"),
  Tony("稍等……好，再来一趟告别厅，我用你的名义发起一次投诉访问，接待人是我。这样在解决投诉期间那边的监控器会暂时地故障一会儿，方便我采取一切可能的拒保行动。",),
  // 场景切换：告别厅
  Aside("20分钟后，我闻到熟悉的消毒水味。托尼迎了上来。", [], "start7"),
  Tony("我们有大概十五分钟。到底怎么了？流程还有问题，还是有人找你麻烦？垃圾分类中心的那帮蠢货？"),
  Aside("我举起船票，展示在托尼面前。"),
  Tony("我的天，这是？"),
  Aside("托尼不可置信地看着船票，又看向我的脸。"),
  Tony("这是……甚至是不记名的……你从哪弄到的？"),
  Aside("你深吸一口气，从头开始告诉托尼，关于那枚蛋，关于船票……（除了你像野兽的那段）", [], "hintend"),
  Tony("那可能是一个礼品盒。"),
  Aside("托尼的指示灯闪烁着。"),
  Tony("其实，有些家伙不吃营养膏……不，去他妈的破事。"),
  Tony("%name，看着我，%name，你知道船票意味着什么吗？离开这里。离开Am-ω-7，离开垃圾分类中心，离开这该死的太空港和那群对着你指指点点家伙。去地球。不是作为广告里的一个远景，而是真正踏上那的地面，呼吸那里的空气，看真正的天空——不是公共显示屏播放的那种！"),
  Choice("branch7", [
    "你说的对，再也不会有这么好的机会了。下一趟飞船在什么时候？",
    "可是，到地球我能做什么呢？我的工作怎么办？",
  ]),
  Tony("去他的工作吧！这都什么时候，你还在想这种事，那可是地球！那才是人应该生活的地方，空气、水、食物都是天然的，到处都是，你大可以等到了地球再考虑这种事！", [{ key: "branch7", value: "可是，到地球我能做什么呢？我的工作怎么办？" }]),
  Choice(
    "branch8",
    ["你说的对，在到达地球前不需要考虑这种事。下一趟飞船在什么时候？", "托尼，你去过下面卫星吗？"],
    [{ key: "branch7", value: "可是，到地球我能做什么呢？我的工作怎么办？" }],
  ),
  Tony("嗯？和这有什么关系？", ifbranch3a4),
  George("我出生在这座太空港，我从来没有接触过地面。营养膏？没那个我几乎不知道应该吃什么。噪声？那简直是我的助眠曲，我从小就听着它。异味？不会比我身上的气味更明显。", ifbranch3a4),
  George("地球太遥远，我没法想象一个没有屋顶，没有墙壁，到处是水的地方。托尼，我习惯了，我不想离开，我害怕离开。", ifbranch3a4),
  Tony("别这样，伙计，我不是在逼你离开。太空港挺好的，你愿意留下来陪我，简直感激不尽。", ifbranch3a4),
  Aside("托尼叹了口气。", ifbranch3a4),
  Tony("好，这东西总能排上用处，我可以考虑帮你卖掉这张船票，但卖掉的钱绝对不够再买回它的。", ifbranch3a4),
  Tony("你要卖掉这张船票吗？", ifbranch3a4, "isSell"),
  {
    type: "choice",
    choice: ["不卖船票", "送给托尼", "卖掉船票"],
    id: "branch9",
    score: {
      targetId: "branch100",
      action: (branch: string, rawValue: string) => {
        if (branch === "送给托尼") return ((parseInt(rawValue) || 0) + 1).toString();
        else return rawValue;
      }
    },
    if: ifbranch3a4
  },
  George("还是算了，总要去看一眼地球才甘心。", [
    {
      key: "branch7",
      value: "可是，到地球我能做什么呢？我的工作怎么办？",
      next: "and",
    },
    {
      key: "branch8",
      value: "托尼，你去过下面卫星吗？",
      next: "and",
    },
    {
      key: "branch9",
      value: "不卖船票",
    },
  ]),
  ...(() => {
    const ifbranch: IfInterface[] = [
      {
        key: "branch7",
        value: "可是，到地球我能做什么呢？我的工作怎么办？",
        next: "and",
      },
      {
        key: "branch8",
        value: "托尼，你去过下面卫星吗？",
        next: "and",
      },
      {
        key: "branch9",
        value: "送给托尼",
        next: "and"
      },
      {
        key: "branch100",
        value: (branch_value: string) => {
          return (parseInt(branch_value) || 0) < 10
        }
      }
    ];
    return [
      George("托尼，我打算把它送给你，你在很多方面一直都在照顾我，我想除了这个，我再也没什么能表示感谢了。", ifbranch),
      Tony("送给我？", ifbranch),
      Aside("托尼伸手敲敲自己的脑袋。", ifbranch),
      {
        name: `<span style="${publicCss} background-color: orange;">托尼</span>`,
        message: "那地方可到处是水，连屋顶都没有，我可去不了。你再想想。",
        goto: "isSell",
        if: ifbranch,
      },
    ];
  })(),
  ...(() => {
    const ifbranch: IfInterface[] = [
      {
        key: "branch100",
        value: (branch_value: string) => {
          return (parseInt(branch_value) || 0) >= 10
        }
      }
    ]
    return [
      Tony("好了好了，行了，知道你的好心了，别再说送给我了！车已经帮你备好了！", ifbranch),
      George("我的天，谢谢你托尼，你知道的，我一直都很喜欢你！那还是我自己上船吧~", ifbranch),
    ]
  })(),
  Tony("谢天谢地，你的脑子终于好用了一次，16个小时后就有飞船出发，4个小时后就开始检票。你在这可以等上1小时，剩下3个小时就在港区转悠，等时间一到你就可以拿着票进贵宾候船厅！", ifbranch3o4o5),
  George("托尼，我会想你的。", ifbranch3o4o5),
  Tony("我暂时没收这种权力，除非你到达地球。", ifbranch3o4o5),
  Aside("我又一次抱住了他。", ifbranch3o4o5),
  // 播放太空港剧情音效
  Aside("一艘银色的太空船缓缓地向着太空港驶来，像羽毛一样轻盈，像水滴一样光滑。整座太空港都忙碌起来，先是引力预警器发出低沉的、持续性的嗡鸣，像一头巨鲸在深海发出的鸣叫。然后无数牵引车像蚂蚁一样沿着互不干扰的轨迹爬行，卸下集装箱，堆满港口。", ifbranch3o4o5, "start8"),
  Aside("下一步，港区所有的灯光，无论是刺目的作业灯还是微弱的指示灯，都开始同步明灭，仿佛整座太空港都在跟随一个遥远的心跳呼吸。接着，主对接廊桥牢牢咬合在客船的气闸，金属骨架传导来的、深沉至极的“咚！”一声沉闷的巨响，更多的管线——能源的、数据的、维生的——如蛇一般自动连接。", ifbranch3o4o5),
  Aside("气闸内侧的指示灯由红转绿，发出柔和的光芒。这一刻，两个世界贯通了。", ifbranch3o4o5),
  Aside("你低头看着手中的船票，那简单的几行字仿佛在发光，在燃烧。地球。一个陌生的，却似乎能容纳所有疲惫灵魂的词语。托尼的话语在你脑中回荡，混合着巨大的低沉的机器轰鸣声，混合着告别厅里消毒水的味道，混合着休息区金属货架的冰冷触感。。", ifbranch3o4o5),
  Aside("光滑的登船通道像是一面镜子，反射出你的身形。", ifbranch3o4o5),
  Aside("你上了船。", ifbranch3o4o5),
  {
    type: "to",
    to: 1,
    if: ifbranch3o4o5,
  },
  George("卖掉，这应该是一大笔钱吧？让我想想该怎么花它……我们可以在接待区买下一个隔间。也许我可以换一份工作，在候船厅卖卖纪念品什么的，就是那种花花绿绿的铁皮小徽章。", ifbranch3a4a5),
  Tony("啊对，到时候你穿一件操作间的那种白色大褂，平时裹得严严的，每见到一名有钱人就唰得一下敞开衣服，让他看看你衣服里挂着的小铁片，然后被保安追回家。", ifbranch3a4a5),
  George("“卖掉，现在！”你强忍着笑意，坚定地说。", ifbranch3a4a5),
  Tony("你确定？", ifbranch3a4a5),
  George("确定。", ifbranch3a4a5),
  Aside("托尼最后看一眼船票，轻轻摇了摇头，他似乎还想说什么，但撞上你熟悉的倔强的眼神。他轻轻点头，你想那大概是“真拿你没办法”。", ifbranch3a4a5),
  Tony("别这样，伙计，我不是在逼你离开。太空港挺好的，你愿意留下来陪我，简直感激不尽。幕暗淡下去，只是一个瞬间，屏幕上重新亮起瀑布流，那是数据的原始海洋，你完全未知的领域。", ifbranch3a4a5),
  Aside("时间一分一秒的过去。", ifbranch3a4a5),
  Normal(
    `<span style="${publicCss} background-color: darkred;">犹豫之心</span>`,
    "%name？%name！你在干什么，你就像过去无数次做蠢事一样做你这辈子最蠢的决定吗？你得再想想，动动脑子，深思熟虑，衡量自身利弊。快叫托尼回来，快点，你不能在这种事上犯蠢。",
    ifbranch3a4a5,
  ),
  George("我已经做出决定，滚吧。", ifbranch3a4a5),
  Aside("时间一分一秒的过去。", ifbranch3a4a5),
  Normal(
    `<span style="${publicCss} background-color: darkblue;">怀疑之心</span>`,
    "仅此一次的机会，被你浪费掉了。你犯了世上最愚蠢的错误，最难以宽恕的错误，最不可理喻的错误。你就是一只活在垃圾堆里的蠢狗，一辈子在垃圾堆刨食的废物，一步都不敢迈出的懦夫、胆小鬼！你辜负了查理送你最后的礼物。",
    ifbranch3a4a5,
  ),
  George("你知道吗？你说的很有道理，你说的全都对。但又怎样？我对自己很满意，查理也会满意。", ifbranch3a4a5),
  Aside("时间一分一秒的过去。", ifbranch3a4a5),
  Normal(
    `<span style="${publicCss} background-color: rebeccapurple;">恐惧之心</span>`,
    "啧啧，看看你干了什么好事。看看已经过去了多长时间？托尼在干嘛？他在安排另一具身体，他在转移自己的数据，他在花你的钱。再等一会你面前的屏幕就会熄灭，保安会冲进来把你按在地上“你个小偷！”然后查理留下的休息区被收回，你被流放到宇宙真空中，不穿宇航服的那种。",
    ifbranch3a4a5,
  ),
  Aside("……", ifbranch3a4a5),
  Aside("屏幕重新亮起来。", ifbranch3a4a5),
  Tony("搞定！", ifbranch3a4a5),
  Aside("托尼伸了一个懒腰。", ifbranch3a4a5),
  Tony("用了多长时间？", ifbranch3a4a5),
  George("不到1个小时。", ifbranch3a4a5),
  Tony("竟然这么久……让你担心了，不过值得，那张票真的卖了一大笔钱。走吧，我们直接在贵宾候船厅外面等买家。", ifbranch3a4a5),
  // 播放结局 0 音效
  Aside("你成功卖掉船票，拿到了钱。那长长的一串零是你从没见过数字，你险些觉得那是系统乱码。", ifbranch3a4a5),
  Aside("你和托尼去贵宾餐厅大吃一顿，不过在第一次去的时候因为衣服被拦截下来，但你觉得没什么，那是你第一次吃到营养膏之外的食物，你差点控制不住自己，开始甩头撕咬。", ifbranch3a4a5),
  Aside("托尼狠狠嘲笑，要是你去地球，大概每天都在吃这个。你哈哈一笑，探身过去亲了他一口。", ifbranch3a4a5),
  Aside("你们两个在太空港的顶层买下了好几个房间，明明一张床就可以休息，可你买了好几个房间，一个专门放床，一个独立的的淋浴间，一个专门存放稀奇古怪的小玩意，还有一个什么也不放，你和托尼会静静地坐在那，托尼说，这叫冥想。", ifbranch3a4a5),
  Aside("1802天后，你重新参加查理的葬礼，并在葬礼上致辞。", ifbranch3a4a5),
  Aside("3652天后，你第一次踏足卫星的地面，过高的重力让你很不舒服，回去后一个星期你都躺在床上休息并且发誓再也不去了。", ifbranch3a4a5),
  Aside("5478天后，托尼升级了躯体，还换了个闪闪发亮的无缝一体式脑壳，你对此非常满意，把他的旧脑壳改成台灯放在了冥想室。", ifbranch3a4a5),
  Aside("前所未有的满足感充盈着你的内心，托尼抱住你，向你解释，这种感觉叫做幸福。", ifbranch3a4a5),
  {
    type: "end",
    message: `<span style="color: yellow">Normal Ending</span><br>你将船票卖掉了`,
    if: ifbranch3a4a5
  }
]);
// 第一章
const police = `<span style="${publicCss} background-color: violet;">保安</span>`
export const dialogChapter1 = readable<DialogInterface[]>([
  George("你好！有人吗？", [], "start10"),
  Aside("寂静无声。"),
  Aside("刚来到船舶的你感到非常迷茫，因为你完全不知道接下来会发生什么。到底是有人会把你赶下去，还是有人会把你丢出宇宙飞船。"),
  Aside("但是你转念一想，自己获得了顶层豪奢套间的船票，还会怕有人会把你赶下去不成？吼吼！这么一想，你顿时放轻松了。"),
  Aside("不过，这个地方为什么一个人也没有？你环顾四周，周围空荡荡的，这里明明已经到候船厅了，为什么一个人也没有？你不知道该往哪里走。"),
  Choice("branch10", ["左边有亮光，往左走。", "右边似乎有人，往右走。"]),
  ...(() => {
    const ifbranch: IfInterface[] = [
      {
        key: "branch10",
        value: "左边有亮光，往左走。",
      },
    ];
    return [
      George("吼啊，这里人好多啊！", ifbranch),
      Aside("你有些庆幸自己走出来了。", ifbranch),
    ]
  })(),
  ...(() => {
    const ifbranch: IfInterface[] = [
      {
        key: "branch10",
        value: "右边似乎有人，往右走。",
      },
    ];
    return [
      Aside("这是一个类似于行李室的地方，周围摆放了很多行李箱。", ifbranch, "start12"),
      George("此时，突然有人闯了进来！", ifbranch),
      Normal(police, "你是谁？在那里干什么？", ifbranch),
      George("不，不，我只是……对不起！", ifbranch),
      Aside("说完你赶快往左边跑了。", ifbranch),
    ]
  })(),
  George("这里就是候船厅吗？", [], "start11"),
  Aside("这里总算是有人了，并且这里挤满了兽人，没办法，去往地球的船票卖的就是这么好。"),
  Aside("路上，你经过了入船口的保安室，里面的熊兽人保安正在站岗。他紧紧的盯着所有即将上船的人。但是他的门口却有一个人坐在地上。"),
  // 安德烈，出现
  Aside("那个坐在地上的人是一名虎兽人，此时正在虎视眈眈的看着保安室。眼神对保安室的熊兽人异常凶猛，甚至下一秒钟就有可能会吃了那个熊兽人。", [], "start13"),
  Aside("你本来不想管那个兽人的，但是那个兽人身上穿着一身修理工的衣服，一件修理工的裤子。外形看着很壮实。看着像修理飞船的员工。按道理来说，这个时候他应该去查看飞船是否有损坏，或者别的。他怎么会在这？难道他想……"),
  Aside("你走上前"),
  George("我找不到厕所了，你能告诉我在哪吗？"),
  Aside("那位虎兽人看了一眼你，指了指对面。"),
  Qm("在那里。自己去吧。"),
  George("我觉得，我是一个方向感很差的人，我的嗅觉失灵，几乎完全找不到厕所。我觉得保安应该可以把我带到厕所的吧！"),
  Qm("哦~"),
  Aside("虎兽人突然明白了什么。"),
  Qm("你可以去试试看找那边的保安，我会去修理另外一边的通风口，放心吧！包在我身上！"),
  George("好的，我现在立马过去！"),
  // 安德烈，走掉
  Aside("你走到保安室，把手搭在窗台，望着里面的熊兽人。", [], "start14"),
  George("你知道洗手间在哪吗？"),
  Normal(police, "去去去，自己找去，别来烦我！", [{ key: "branch10", value: "左边有亮光，往左走。" }]),
  Normal(police, "我不知道，你不是刚刚误闯我们行李室的人吗？怎么，偷偷摸摸的，是小偷吧！", [{ key: "branch10", value: "右边似乎有人，往右走。" }]),
  George("怎么可能，我怎么可能是小偷？", [{ key: "branch10", value: "右边似乎有人，往右走。" }]),
  Normal(police, "你觉得我会信吗？", [{ key: "branch10", value: "右边似乎有人，往右走。" }]),
  Aside("你反手亮出自己的尊贵船票。那位保安立刻瞪直了眼，望着那一个明晃晃的船票，保安立刻抬起头，弯下了腰。"),
  Normal(police, "对不起，先生，洗手间请走右边，随后再拐个弯就到了。"),
  George("不好意思，保安先生，我有点近视，你能带我过去吗？"),
  Normal(police, "对不起先生，我现在立刻带你过去。"),
  Aside("你谢过了保安，随后和保安一起离开了保安室，同时他的余光瞥见了那位虎兽人已经顺利的越过保安室，往行李室走去！"),
  Aside("不一会，大厅广播响起"),
  Normal(`<span style="${publicCss} background-color: purple">广播</span>`, "请前往“地球”的旅客，前往3号检票口排队检票上船。"),
  Aside("你上完了厕所，向候船厅检票口走去。"),
  Aside("在到达检票口时，你脑子里一直在想之前那个虎兽人，直到检票员催了催后面的人时，他才缓过神。"),
  Aside("检票员看着你手里的船票，那是一个尊贵的顶层豪奢船票！但他也不是那么崇拜那些人，相反，检票员也非常痛恨这种有钱人，因为他们整天就翘起鼻子看人，把别人看低一等！"),
  Aside("你心里倍感歧视，但是为了看一眼地球他必须上船！即使船上的所有包括呼吸、喝水都要收费，钱花光了就会被丢到太空！"),
  Normal(`<span style="${publicCss} background-color: royalblue">检票员</span>`, "你是否确定要上船？你握着的是顶层豪奢套房，我需要判断你是否有经济条件，不然当小偷处理！这样的话起码你就不用因为钱花光而被丢到太空了！"),
  George("我……"),
  // 安德烈：出现
  Aside("你刚想说话，虎兽人突然从船舱里走出来。看样子他已经顺利通过了安检，成功进入了船内。", [], "start15"),
  Qm("船票只是用来进入大厅的！你现在应该跟我来“面试”！", [], "hintexam"),
  Aside("说完，你被虎兽人拉到一旁，虎兽人轻轻拉下它的工牌，上面写着安德烈三个字。应该是他的名字？"),
  Andrey("姓名？"),
  George("我刚刚才帮了你，你就这样报答我？难道你忘恩负义？"),
  Andrey("先别管那么多。"),
  Aside("安德烈大声问道。"),
  Andrey("姓名？"),
  George("%name。"),
  Andrey("种族？"),
  {
    type: "choice",
    id: 'branch11',
    choice: ["薮猫", "食草动物", "鬣狗", "食肉动物"],
    score: {
      targetId: "branch16",
      action: (branch: string, rawValue: string) => {
        if (branch === "食肉动物") return ((parseInt(rawValue) || 0) + 1).toString()
        return (parseInt(rawValue) || 0).toString()
      }
    }
  },
  Andrey("年龄？"),
  {
    type: "choice",
    id: 'branch12',
    choice: ["21岁", "22岁", "23岁", "20岁"],
    score: {
      targetId: "branch16",
      action: (branch: string, rawValue: string) => {
        if (branch === "22岁") return ((parseInt(rawValue) || 0) + 1).toString()
        return (parseInt(rawValue) || 0).toString()
      }
    }
  },
  Andrey("性别？"),
  {
    type: "choice",
    id: 'branch13',
    choice: ["雄", "雌", "无性", "沃尔玛购物袋"],
    score: {
      targetId: "branch16",
      action: (branch: string, rawValue: string) => {
        if (branch === "22岁") return ((parseInt(rawValue) || 0) + 1).toString()
        return (parseInt(rawValue) || 0).toString()
      }
    }
  },
  Andrey("工作？"),
  {
    type: "choice",
    id: 'branch14',
    choice: ["废品回收中心", "废品筛选中心", "废品分类中心"],
    score: {
      targetId: "branch16",
      action: (branch: string, rawValue: string) => {
        if (branch === "废品分类中心") return ((parseInt(rawValue) || 0) + 1).toString()
        return (parseInt(rawValue) || 0).toString()
      }
    }
  },
  Andrey("听说你有一个叔叔去世了，他的名字叫？"),
  {
    type: "choice",
    id: 'branch15',
    choice: ["查克", "查理", "察克", "察理"],
    score: {
      targetId: "branch16",
      action: (branch: string, rawValue: string) => {
        if (branch === "查理") return ((parseInt(rawValue) || 0) + 1).toString()
        return (parseInt(rawValue) || 0).toString()
      }
    }
  },
  ...(() => {
    const ifbranch = [
      {
        key: "branch16",
        value: (branch_value: string) => {
          return parseInt(branch_value) < 3
        }
      }
    ]
    return [
      Andrey("等等，我看到你刚刚回答的事情和我记录的事情有点出入啊！", ifbranch),
      George("什么？你还窥探我的生活？", ifbranch),
      Andrey("看来我还是信不过你！只能叫保安把你抓走了！", ifbranch),
      George("不，你不能这样！", ifbranch),
      Normal(police, "你个小偷，终于被我抓到把柄了吧，我早就猜到你的船票是你偷的了！够了，跟我回去吧！", ifbranch),
      George("不！！！", ifbranch),
      {
        type: "end",
        message: `<span style="color: yellow">Bad Ending</span><br>你被捕了`,
        if: ifbranch,
      }
    ]
  })(),
  Andrey("嗯，再说说你的工作经历？"),
  George("我……"),
  Aside("安德烈趁你没说完，突然大吼的说了一句。"),
  Andrey("什么？你三岁就在维修室里工作？天哪，能活到现在真不容易！"),
  George("你在说什么？我只是一个太空港的垃圾回收工。"),
  Andrey("还得到了太空港的推荐？读过书？你还识字？"),
  George("只是认识一些简单的字。"),
  Aside("你突然反应过来，安德烈只是在识别他的身份，并且在帮他打掩护。"),
  Andrey("是的，我们提前发了船票，让你进来。对于某些紧急事故，可少不了我们这些底层工人！不过我很乐意引荐你进入！"),
  George("啊，对，我有一点！我可以帮忙！"),
  Aside("在一系列对话完成之后，安德烈最后说了一句："),
  Andrey("来签字，这是你的工作证明。"),
  Aside("检票员看着这一幕，气的牙齿咬得很厉害，但迫不得已，他只能放行他们过了安检。谁让你既有顶层豪奢船票，又有工程师证明呢。"),
  Aside("你将证明递给了检票员，随后成功混上了飞船。"),
  // 切换场景：飞船内部
  Aside("飞船内，有很多的员工小门，安德烈带着你到处走。头顶的机械在震动，好几百个闪光小灯正在闪烁。还有色彩斑斓的线缆。", [], "start16"),
  Aside("金属管道绵延到尽头，嘈杂的机械声和原来垃圾回收站的声音都差不多。还有一处很不起眼的梯子。"),
  George("你为什么要来帮我？"),
  Andrey("我的天啊，你居然不知道？你拥有顶层奢侈船票可不够，检票员会让你出示你的工作证明。没有工作证明证明你有经济来源，你就无法上船，并且很有可能会被当作小偷抓走的！毕竟在船上，呼吸、喝水都要收费！"),
  George("你还没回答我的问题！"),
  Andrey("我？你帮了我，我也帮你，很正常嘛！过来，这里是我的房间！"),
  George("喔，你有房间了？那你为什么还要我帮你上船？"),
  Andrey("很简单啊，我也一样没有工作证明。你猜一个小维修工是怎么得到一张船票的？"),
  George("我怎么知道……"),
  Andrey("好了，我在车站刚看见你的时候，你的着装很明显和那些达官贵人不一样，这可是地球！你怎么能去？所以你帮我，我帮你，两人互帮互助嘛！"),
  George("噢~"),
  Aside("两人进了安德烈的房间，这是一个类似于检修室的房间，里面有很多维修工具……"),
  {
    type: "to",
    to: 2,
  }
])
// goto 0：上、1：下、2：左、3：右
// 由于 goto 语句在下一句话是选择时不会显示，所以这里直接用一个空的 Aside 代替！
function GenMazeDialog(branch: string, goto: (string | undefined)[] = [undefined, undefined, undefined, undefined]): DialogInterface[] {
  return [
    // George("上。", [{ key: branch, value: "上" }], ""),
    // George("下。", [{ key: branch, value: "下" }], ""),
    // George("左。", [{ key: branch, value: "左" }], ""),
    // George("右。", [{ key: branch, value: "右" }], ""),
    George(`%${branch}`, [{ key: branch, value: "上" }], "", goto[0]),
    George(`%${branch}`, [{ key: branch, value: "下" }], "", goto[1]),
    George(`%${branch}`, [{ key: branch, value: "左" }], "", goto[2]),
    George(`%${branch}`, [{ key: branch, value: "右" }], "", goto[3]),
  ]
}
// 第二章
export const dialogChapter2 = readable<DialogInterface[]>([
  Aside("安德烈招呼着你。", [], "start17"),
  Andrey("来，过来，坐这！我去找点喝的！"),
  Aside("你刚想坐下。"),
  Andrey("不不不，别坐那，那里是超高精密线缆，坐坏了我们全船的人都要陪葬！"),
  George("喔~"),
  Aside("你本能的夹起尾巴，看起来像被吓到了。"),
  Andrey("哈哈哈，被吓坏了吧！逗你的，快放松坐吧。这里非常安全、随便，是我的家，也是我们之后最大的安全区。"),
  George("该死。"),
  Aside("安德烈找到了两瓶酒，他走过来，坐在了你的旁边。"),
  Andrey("好了，为我们到达了安全区干杯！"),
  George("先别急，我先问你一个问题。你说这里是你的家？你的房间？你不是买船票进来的吗？"),
  Andrey("哎哟，这话说的。好吧，我承认，我并没有买船票。但我是船上的修理工，这点倒是被你猜中了。"),
  George("等等，我可没说你是船上的修理工。你怎么知道我猜中了？"),
  Andrey("拜托，是个人都会从对方的打扮来判断对方的身份的！你的外套是白色的，在太空港，只有最底层的员工才会穿那种颜色的衣服！你我都是白色，说明地位都肯定很低！"),
  George("那医生呢？"),
  Andrey("他们穿的服装也不是白色的吧，人家穿绿色的衣服……而且人家也不打领带。"),
  Aside("沉默了大约10秒钟。"),
  Andrey("不说这些了！来喝酒！"),
  Aside("你们狠狠的干了一杯。"),
  Aside("又沉默了大约10秒钟。"),
  George("对了，你怎么知道我的叔叔死了？"),
  Aside("又再沉默了大约10秒钟。"),
  Andrey("说来话长，我只能先暂时告诉你，我是托尼的朋友。"),
  George("托尼？那个机器人居然也有朋友？"),
  Andrey("没事，先这样吧，再干一杯！"),
  Aside("你们又狠狠的干了一杯。你开始有了一点醉意。"),
  Andrey("我告诉你一件事……"),
  Aside("你可以很明显的看出安德烈有些醉了。"),
  Andrey("你的名字是%name，在太空港Am-ω-7担任废品回收员。该死，我刚刚提问的时候怎么没有想到这个……"),
  Aside("安德烈打了一个嗝。"),
  Andrey("我呢，我其实是在这艘船上担任维修员，我从一出生开始就在这艘船上了。我是被我养父养大的。我养父一直都是这艘船上的维修员，所以我也是。"),
  Andrey("我很少离开这艘船，但是，这一次不一样，我有迫不得已的理由要下船。结果一下船之后再想上船可没那么容易，他们需要你提供身份证明。可是……我哪有那玩意，我养父从未给我办理过。"),
  Andrey("我下去之后，遇见的第一个人就是托尼。他当时并没有告诉我他是机器人，相反，他带我回了他的家。"),
  Aside("你惊了一下，因为托尼很少带你回他家。"),
  Andrey("他帮我洗去身上的污垢和泥土，随后便把我送去了一家收养机构。但是我根本不想去！我只想回到这艘船！因此我偷偷跑了出来，来到了这艘船周围，找时机准备进去。顺便密切的关注着托尼的动向。"),
  Andrey("后来，我听说他主持了一场葬礼，这一场葬礼是有关你叔叔查理的！这点我也记了下来。是你叔叔把托尼雇回去的！这点我当然知道！后来查理死了，我顺势查到了你的信息，得知了查理留了一个蛋给你。"),
  Andrey("那个蛋里有什么我没注意，不过托尼主持了这场葬礼！随后就遇见了你！%name，你是我朋友的朋友，肯定也是朋友！想从一个底层员工里查信息很容易，只要去对应机构里查看资料即可！"),
  Aside("安德烈顿了一下，随后接着说道。"),
  Andrey("但是我的钱快花完了。我快没钱了！因此我需要尽快回到太空船！我又回到了候船厅，准备伺机而动！但此时，意外发生了！我遇到了你！%name，你来的真是时候！"),
  Aside("他越说越兴奋，直到说的口干舌燥。他又喝了一口酒。"),
  George("好了好了，别说了，别喝了！再喝小心出人命！"),
  Andrey("%name，说真的，你是自托尼那个狼心狗肺的机器人以外，第一个愿意来帮我的！我真得谢谢你帮我支开保安！其他人要么是应声虫，要么是用鼻孔看人的先生女士。”"),
  George("行了！少说两句。到我说了。"),
  Aside("你感到醉意加深了许多。"),
  George("我呢，我在废品分类中心工作，但说实话，我和角马的关系也好不上哪去。我的祖父其实是角马，但是他与鬣狗结婚，并生下了我爸，随后我爸又和另外一个鬣狗又结婚，生下了我。所以我体内流着1/4角马的血。"),
  George("说来不巧，正是这1/4的血，导致了我硬是要在废品分类中心过一辈子。"),
  Aside("你也打了个嗝。"),
  Andrey("我在船上时，已经把维修百科都给记下来了，谁让我是一个维修工呢。这就像我的家一样，没有什么地方比这更好了！虽然这里普遍被那帮有钱人当作垃圾场。"),
  George("行了吧，我们那哪有书啊，最多靠着查理教我读几个字就感谢上天了。"),
  Andrey("你在分类中心那过得还好吗？"),
  George("不算很好，因为角马们都非常排斥我。最近因为某些原因，角马们叫嚣着让我滚出分类中心，说的好像是我把查理害死了一样。"),
  Andrey("我有个疑惑，你那张船票从哪里得到的？"),
  George("我说了你可能不信。"),
  Aside("俩人又干了一杯，此时已经是第三杯了。"),
  George("我叔叔查理在传送带上捡到了一个蛋嘛，你猜怎么着？那个蛋里面不是有机物，就是一张船票！一张船票！！知道我看到这个有多兴奋和害怕吗？"),
  George("当时我老害怕了，我甚至想到了我可能会被当成<c-scare>小偷</c-scare>！"),
  Aside("你颤抖了一下！"),
  George("那个蛋就是个礼品盒！"),
  Andrey("那你为什么不把蛋还给失主？"),
  George("兄弟，这说明你从没下过船。在太空港，丢掉这种船票的人我惹不起。归还可能受赏，也可能被当成小偷，更可能被人杀掉夺票。匹夫无罪，怀璧其罪。"),
  George("这就是为什么当你捡到一个非常贵重的东西时，请最好不要归还。不然你很可能会死掉！最好是自己一个人默默的享受。"),
  Andrey("天哪……那你把这件事告诉给托尼了吗？"),
  George("托尼早就知道了这件事了……我拿到船票的第一时间就和托尼说了。托尼让我直接上船，他不与我一起。"),
  Andrey("喔~"),
  Aside("不一会，酒被喝完了。"),
  Andrey("我珍藏的酒都被喝完了。"),
  George("船上有餐厅吗？"),
  Andrey("肯定有啊！"),
  Choice("branch17", ["去厨房偷点酒喝？", "去餐厅偷点酒喝？", "不偷酒喝。"]),
  Andrey("行，走。", [{ key: "branch17", value: "去厨房偷点酒喝？", next: "or" }, { key: "branch17", value: "去餐厅偷点酒喝？" }]),
  Andrey("厨房肯定有酒，为什么不去厨房偷点酒？走了走了，去嘛！", [{ key: "branch17", value: "不偷酒喝。" }]),
  Aside("安德烈指了指旁边的通风管道，示意从通风管道进入。"),
  Aside("你们顺着管道，直冲冲的往前走。前面很深，也很黑很冷。", [], "start18"),
  Aside("不知为何，自从上了太空船之后，周围都变得很冷，更何况你现在只穿了一件背心。", [], "hintmaze"),
  // 下列即将开启本代码块最长的代码：走迷宫！但其实很快就结束了。。
  Andrey("来，前方你带路，如果有岔路的话，你来帮我分辨一下！"),
  Choice("branch18", ["左", "上", "右", "下"]),
  ...GenMazeDialog("branch18", ["branch22", undefined, "branch19", undefined]),
  Andrey("喂，撞墙了啊！", [
    {
      key: "branch18",
      value: "右",
      next: "or"
    },
    {
      key: "branch18",
      value: "下"
    }
  ], "", "branch18"),
  Choice("branch19", ["左", "上", "右", "下"], [
    {
      key: "branch18",
      value: "左",
      next: "or"
    },
    {
      key: "branch23",
      value: "下",
      next: "or"
    },
    {
      key: "branch20",
      value: "右"
    }
  ]),
  ...GenMazeDialog("branch19", ["branch23", undefined, "branch20", "branch18"]),
  Andrey("喂，撞墙了啊！", [
    {
      key: "branch19",
      value: "下",
      next: "or"
    }
  ], "", "branch19"),
  Choice("branch20", ["左", "上", "右", "下"], [
    {
      key: "branch19",
      value: "左",
      next: "or"
    },
    {
      key: "branch24",
      value: "下"
    }
  ]),
  ...GenMazeDialog("branch20", ["branch24", undefined, "branch21", "branch19"]),
  Andrey("喂，撞墙了啊！", [
    {
      key: "branch20",
      value: "下"
    }
  ], "", "branch20"),
  ...(() => {
    const ifbranch: IfInterface[] = [
      {
        key: "branch20",
        value: "左",
        next: "or"
      },
      {
        key: "branch25",
        value: "下"
      }
    ]
    return [
      George("底下有亮光！", ifbranch, "branch21"),
      Andrey("快走吧！", ifbranch),
      Aside("你和安德烈打开通风管道，这里的滤网有点难打开，因此你们直接狠狠的砸开，随后跳了下去。", ifbranch),
      Aside("跳下去时，安德烈的胳膊被扭了一下……不过他没有和你说这件事。。", ifbranch),
      Andrey("等下，气味不对。", ifbranch),
      George("你闻到什么了吗？", ifbranch),
      Andrey("有一种很浓烈的……腐肉味。。", ifbranch),
      Aside("他猛然发现自己在哪了！这里是冷藏室！", ifbranch),
      Andrey("不好，快回去！%name！", ifbranch),
      George("我也想回去……但是，这里好冷……", ifbranch),
      Aside("安德烈这才发现，你只穿了一件单薄的背心。", ifbranch),
      Andrey("可恶！", ifbranch),
      Aside("安德烈抱起周围的箱子，往上堆着。但是箱子很沉。再加上他在跳下去时扭到了胳膊，他的手顿时没了力气。", ifbranch),
      Andrey("可恶啊！！", ifbranch),
      Aside("他此时才发现，自己刚才根本不应该那么莽撞的砸开。也不应该让%name这么早的跳下去。。通风管道太高了。", ifbranch),
      Aside("此时，你已经冷到逐渐失去了意识。这里的温度已然降到了零下 30°，再这样下去，恐怕都得冻死在这。", ifbranch),
      Andrey("我还这么年轻，我不想死！！", ifbranch),
      Aside("安德烈冲向冷藏室门前，大声喊。", ifbranch),
      Andrey("快来人啊！里面有人！", ifbranch),
      Aside("无人应答。", ifbranch),
      Aside("于是，就这样，1 天过去了，3 天过去了，7 天过去了，直到下一个打开冷藏室大门的人，走了进来，发现了你俩的尸体。你俩浑身都是冰，顶部的通风管道被狠狠砸开。", ifbranch),
      {
        type: "end",
        message: `<span style="color: yellow">Bad Ending</span><br>你被冻死了`,
        if: ifbranch,
      }
    ]
  })(),
  Choice("branch22", ["左", "上", "右", "下"], [
    {
      key: "branch23",
      value: "右",
      next: "or"
    },
    {
      key: "branch18",
      value: "上",
      next: "or"
    },
    {
      key: "branch26",
      value: "下"
    }
  ]),
  ...GenMazeDialog("branch22", ["branch26", "branch18", "branch23", undefined]),
  Andrey("喂，撞墙了啊！", [
    {
      key: "branch22",
      value: "右"
    }
  ], "", "branch22"),
  Choice("branch23", ["左", "上", "右", "下"], [
    {
      key: "branch24",
      value: "右",
      next: "or"
    },
    {
      key: "branch19",
      value: "上",
      next: "or"
    },
    {
      key: "branch22",
      value: "左",
      next: "or"
    },
    {
      key: "branch27",
      value: "下"
    }
  ]),
  ...GenMazeDialog("branch23", ["branch27", "branch19", "branch24", "branch27"]),
  Choice("branch24", ["左", "上", "右", "下"], [
    {
      key: "branch25",
      value: "右",
      next: "or"
    },
    {
      key: "branch20",
      value: "上",
      next: "or"
    },
    {
      key: "branch23",
      value: "左",
      next: "or"
    },
    {
      key: "branch28",
      value: "下"
    }
  ]),
  ...GenMazeDialog("branch24", ["branch28", "branch20", "branch25", "branch23"]),
  Choice("branch25", ["左", "上", "右", "下"], [
    {
      key: "branch24",
      value: "左",
      next: "or"
    },
    {
      key: "branch29",
      value: "下"
    }
  ]),
  ...GenMazeDialog("branch25", ["branch29", "branch21", undefined, "branch24"]),
  Andrey("喂，撞墙了啊！", [
    {
      key: "branch25",
      value: "左"
    }
  ], "", "branch25"),
  Choice("branch26", ["左", "上", "右", "下"], [
    {
      key: "branch27",
      value: "右",
      next: "or"
    },
    {
      key: "branch22",
      value: "上"
    }
  ]),
  ...GenMazeDialog("branch26", ["branch30", "branch22", "branch27", undefined]),
  Andrey("喂，撞墙了啊！", [
    {
      key: "branch26",
      value: "右"
    }
  ], "", "branch26"),
  Choice("branch27", ["左", "上", "右", "下"], [
    {
      key: "branch28",
      value: "右",
      next: "or"
    },
    {
      key: "branch23",
      value: "上",
      next: "or"
    },
    {
      key: "branch26",
      value: "左",
      next: "or"
    },
    {
      key: "branch31",
      value: "下"
    }
  ]),
  ...GenMazeDialog("branch27", ["branch31", "branch23", "branch28", "branch26"]),
  Choice("branch28", ["左", "上", "右", "下"], [
    {
      key: "branch29",
      value: "右",
      next: "or"
    },
    {
      key: "branch24",
      value: "上",
      next: "or"
    },
    {
      key: "branch27",
      value: "左",
      next: "or"
    },
    {
      key: "branch32",
      value: "下"
    }
  ]),
  ...GenMazeDialog("branch28", ["branch32", "branch24", "branch29", "branch27"]),
  Choice("branch29", ["左", "上", "右", "下"], [
    {
      key: "branch28",
      value: "左",
      next: "or"
    },
    {
      key: "branch25",
      value: "上"
    }
  ]),
  ...GenMazeDialog("branch29", ["branch33", "branch25", undefined, "branch28"]),
  Andrey("喂，撞墙了啊！", [
    {
      key: "branch29",
      value: "左"
    }
  ], "", "branch29"),
  ...(() => {
    const ifbranch: IfInterface[] = [
      {
        key: "branch26",
        value: "上",
        next: "or"
      },
      {
        key: "branch31",
        value: "右"
      }
    ]
    return [
      George("底下有亮光！", ifbranch, "branch30"),
      Andrey("快走吧！", ifbranch),
      Aside("你俩掀开通风管道的盖子，往下跳了下去。", ifbranch),
      Aside("刚一跳下去，正好跳在船长室门前。门口的武装特警保安瞬间发现了你们。", ifbranch),
      Normal(police, "你们俩是谁？在那里干什么？", ifbranch),
      Andrey("呃啊，我是安德烈，你们都忘记我了吗？", ifbranch),
      Normal(police, "修理船工就给我好好的呆在自己的地方，别到处乱跑！你这次来船长室有何意图？是想谋权篡位？还是想来当小偷？", ifbranch),
      Andrey("不不不，我不是……", ifbranch),
      Aside("保安指了指你。", ifbranch),
      Normal(police, "还有同伙？看来是活得不耐烦了！", ifbranch),
      Aside("说完，保安大吼了一句，顿时整个船舱的保安都来了。纷纷举起手枪对准了你们。", ifbranch),
      George("等等，你们为什么说我是？我明明就不是……", ifbranch),
      Normal(police, "抓住他们！", ifbranch),
      George("不要……", ifbranch),
      Aside("你和安德烈被保安抓住了，无论怎么辩解也没有，船长下令将你们扔到太空里。你们的脸被遮住，随后被人用力一甩，你和安德烈被扔到了太空里，失重感和压迫感瞬间袭来，不一会就被冰封成了一个雕像，被人遗忘在太空里。", ifbranch),
      {
        type: "end",
        message: `<span style="color: yellow">Bad Ending</span><br>你被保安抓住了`,
        if: ifbranch,
      }
    ]
  })(),
  Choice("branch31", ["左", "上", "右", "下"], [
    {
      key: "branch32",
      value: "右",
      next: "or"
    },
    {
      key: "branch27",
      value: "上"
    }
  ]),
  ...GenMazeDialog("branch31", [undefined, "branch27", "branch32", "branch30"]),
  Andrey("喂，撞墙了啊！", [
    {
      key: "branch31",
      value: "上"
    }
  ], "", "branch31"),
  Choice("branch32", ["左", "上", "右", "下"], [
    {
      key: "branch31",
      value: "左",
      next: "or"
    },
    {
      key: "branch28",
      value: "上"
    }
  ]),
  ...GenMazeDialog("branch32", [undefined, "branch28", "branch33", "branch31"]),
  Andrey("喂，撞墙了啊！", [
    {
      key: "branch32",
      value: "上"
    }
  ], "", "branch32"),
  ...(() => {
    const ifbranch = [
      {
        key: "branch32",
        value: "左"
      },
      {
        key: "branch29",
        value: "上"
      }
    ]
    return [
      George("前面有亮光！", ifbranch, "branch33"),
      Andrey("快走吧！", ifbranch),
    ]
  })(),
  // 切换场景：厨房
  Aside("一股香气扑面而来。", [], "start19"),
  George("看起来这里就是厨房了！"),
  Andrey("让我们找找酒架！"),
  Aside("在鱼龙混杂的食物的香气里，还得是鬣狗的鼻子最灵敏，你从众多食物的气味里准确找到的酒的香气！"),
  George("我找到了！"),
  Andrey("好哦~"),
  Aside("你和安德烈来到酒架旁。"),
  Andrey("我看看，这一瓶，19xx年，那一瓶，18xx年，酒肯定是越老越香！要这瓶！"),
  Aside("说完安德烈拿下了这一瓶酒。但是他刚想离开，你听见了脚步声。"),
  George("等等，安德烈，我好像听见了脚步！"),
  Aside("你把安德烈拉到桌子底下，小声的说。"),
  Aside("不一会，有一个厨师走了进来。"),
  Normal(`<span style="${publicCss} background-color: peru">厨师</span>`, "哇，这酒局真不错。"),
  Aside("你发现这个厨师喝的非常醉，似乎下一秒就要倒下去。你似乎有一个妙计。你站起来。"),
  George("嘿，那位厨师！"),
  Normal(`<span style="${publicCss} background-color: peru">厨师</span>`, "哦？你是马修？"),
  George("对的对的，我是马修！我们正在为酒局寻找新的酒，你能帮我们找两瓶吗？"),
  Normal(`<span style="${publicCss} background-color: peru">厨师</span>`, "哦哟，不错嘛~小东西有点意思。"),
  Aside("厨师打开了某一个隐藏的抽屉。"),
  Normal(`<span style="${publicCss} background-color: peru">厨师</span>`, "这里面可是好酒，号称一杯倒，你拿着！"),
  Andrey("一杯倒？那不是……"),
  George("哦哦，好的，谢谢你！你先回去吧，这里有我就够了！"),
  Normal(`<span style="${publicCss} background-color: peru">厨师</span>`, "行，我等你的好消息！"),
  Aside("厨师离开了。安德烈站了起来。"),
  Andrey("可以嗷~这也能被你发现？不错不错！一杯倒，这可是上好的酒！今晚就喝它了！"),
  Aside("你们离开了厨房，回到了休息室。"),
  // 切换场景：安全区。
  Andrey("喝！干杯！庆祝我俩都成功上了飞船！还偷到了这么好的酒！", [], "start20"),
  George("嗝，是啊……"),
  Aside("你发现这一杯倒的酒性极其强烈，可能要兑上一点饮料喝才行，但是安德烈似乎就喜欢喝烈酒。"),
  Aside("安德烈没喝几杯，就真的醉倒了。他说的最后一句话是："),
  Andrey("我好伤心，好难过。我的父母死的很早，我养父是船上的修理工，现在我养父也死了，我继承了他的家业。但这根本不是我想要的生活！"),
  Aside("说完，他就醉倒了。"),
  Aside("你也很醉……"),
  Aside("很醉……"),
  Aside("醉…………"),
  Aside("……………………", [], "start21"),
  Normal(`<span style="${publicCss} background-color: darkred">犹豫之心</span>`, "你到底在干什么？你现在应该回到你的顶层豪奢房间去，而不是在这个破败不堪的地方，你明明是有钱人了，还和一个普通的修理工打交道？"),
  George("我……"),
  Normal(`<span style="${publicCss} background-color: darkblue">怀疑之心</span>`, "醒醒吧，你是鬣狗，他是老虎！你俩根本就不是同一个物种，你觉得他有没有一种可能会把你吃了？认清楚你自己的身份，你到底是谁？"),
  George("我……我是鬣狗%name，我在太空港长大，我爱太空港，爱垃圾堆……"),
  Normal(`<span style="${publicCss} background-color: rebeccapurple">恐惧之心</span>`, "你的目标是什么？是活下去！是活下去！你是野兽，你应该在草原上奔跑，狩猎，死亡！你要去地球，去看大草原！而且是一定要去！"),
  George("我……我是野兽，我爱草原……奔跑，狩猎，死亡……", [], "start22"),
  Aside("……………………"),
  {
    type: "to",
    to: 3
  }
])
// 0：娱乐厅，1：旅客居住区，2：舰桥区，3：动力区
function b34a(i: 0 | 1 | 2 | 3): IfInterface[] {
  return [
    {
      key: "branch34",
      value: ["娱乐厅", "旅客居住区", "舰桥区", "动力区"][i]
    }
  ]
}
const fox = `<span style="${publicCss} background-color: hotpink">狐兽人</span>`
const wolf = `<span style="${publicCss} background-color: slategray">狼兽人</span>`
const bear = `<span style="${publicCss} background-color: saddlebrown">熊兽人</span>`
const tiger = `<span style="${publicCss} background-color: crimson">虎兽人</span>`
const raccoon = `<span style="${publicCss} background-color: palevioletred">浣熊贵妇</span>`
const lizard1 = `<span style="${publicCss} background-color: darkolivegreen">蜥蜴兽人1</span>`
const lizard2 = `<span style="${publicCss} background-color: darkolivegreen">蜥蜴兽人2</span>`
const anteater = `<span style="${publicCss} background-color: blueviolet">食蚁兽人</span>`
const porcupine = `<span style="${publicCss} background-color: darkkhaki">豪猪兽人</span>`
const poster = `<span style="${publicCss} background-color: navy">海报</span>`
// 下面是本代码块最长的分支剧情（每一个分支相当于半个章节）
// 第三章
export const dialogChapter3 = readable<DialogInterface[]>([
  Aside("在飞船上，并没有时间这种概念，但是太空船方自行拟定了时间。此时应该已经到白天了。", [], "start23"),
  Aside("你昨晚直接睡在了安德烈的房间，安德烈此时不知道去哪了，不过这完全不影响你。"),
  Aside("今天才刚开始过，你还有大把时间。", [], "hintgo"),
  Aside("你穿好衣服，开始计划现在应该去哪。", [], "start24"),
  Aside("你打算去哪？"),
  Choice("branch34", ["娱乐厅", "旅客居住区", "舰桥区", "动力区"]),
  Aside("你来到了娱乐厅。", b34a(0), "start25"),
  Aside("娱乐厅里有很多人，不愧是白天。", b34a(0)),
  Aside("你走了好久，你想到，自己口袋里的钱可不能花在这个地方。", b34a(0)),
  Aside("你四处观察，墙上有监控探头一直在看，周围也有许多熊兽人保安。你走着走着，来到了宴会厅。这里是举办宴会的！但是现在有很多兽人在这里吃早餐。", b34a(0)),
  Aside("你偷听了几个兽人在旁边说话。比如那有个狐狸兽人和一个狼兽人。", b34a(0)),
  Normal(fox, "为什么这躺飞船只是在地球绕一圈啊，就不能下去看吗？", b34a(0)),
  Normal(wolf, "宝贝，最近难道不是太空港政府倒牌了嘛，自从他们倒牌之后，飞船就再也不飞回地球了。", b34a(0)),
  Normal(fox, "倒牌了？那……你是不是……", b34a(0)),
  Normal(wolf, "啊，宝贝，你知道的，现在风口紧，不要随便对外面说哦~", b34a(0)),
  Normal(fox, "知道了，狼先生！", b34a(0)),
  Normal(wolf, "我尊贵的狐狸小姐，让我们去那边跳一支舞吧！", b34a(0)),
  Aside("你离开了这里，又偷听另外几个兽人聊天。那有一个虎兽人和一个熊兽人聊天。", b34a(0)),
  Normal(bear, "诶，现在的太空港总司长是谁？", b34a(0)),
  Normal(tiger, "我也不知道啊……悄悄告诉你我是被人哄上来的。", b34a(0)),
  Normal(bear, "唉，现在政治局面太乱了，连飞船都不靠地球了。", b34a(0)),
  Normal(tiger, "是啊，太乱了。该死的政治！", b34a(0)),
  Normal(bear, "我其实最主要是担心我的家人，我爷爷还在地球。", b34a(0)),
  Normal(tiger, "你多久没回去看他了？", b34a(0)),
  Normal(bear, "我忘了，大概有10年了吧。", b34a(0)),
  Normal(tiger, "那很久咯，我也有快20年没去地球了。", b34a(0)),
  Aside("你离开了。", b34a(0)),
  Aside("你思考了一会，本来打算再逛一下就回到维修室，毕竟你还是比较喜欢脏脏的地方，太干净了反而不适应。因此暂时先不回顶层豪华套间。", b34a(0)),
  Aside("就在这时，你突然间发现了前面似乎有一个很熟悉的人！哦天哪，是安德烈！他居然在调戏一只浣熊兽人贵妇！", b34a(0), 'start26'),
  Andrey("女士，你真美丽！", b34a(0)),
  Normal(raccoon, "小哥哥小嘴真甜，来喝一杯！", b34a(0)),
  Aside("你冲上前，想听一下他们在做什么", b34a(0)),
  Andrey("诶哟，真不错的酒！和你的心一样美！", b34a(0)),
  Normal(raccoon, "哦吼吼吼，真的吗？在我们家那边，可从来没有人夸过我美呢！", b34a(0)),
  Aside("你心想：对，对，美哭了。", b34a(0)),
  Aside("就在此时，安德烈似乎发现了你，他像你打手势，指着那位贵妇前面的推酒车。", b34a(0)),
  Aside("好家伙，这人昨晚醉得不知道得有多爽，现在居然还喝。真是喝不死你！", b34a(0)),
  Aside("你顺从了他的意见，往推酒车靠近。", b34a(0)),
  Andrey("哎呀，女士，你的酒温度不太对劲，这种酒在我们那算是次品，哪里配得上您啊！", b34a(0)),
  Normal(raccoon, "哦？那你说哪种酒适合我？", b34a(0)),
  Aside("安德烈也像推酒车靠近，只见他拿了一瓶你从未见过的酒。", b34a(0)),
  Andrey("女士，这瓶豪客士大红酒才配得上您！您快拆开来品品~", b34a(0)),
  Aside("你终于懂了，该死的安德烈居然用次酒换好酒？那位女士之前手上拿着的酒可是好酒，这倒好，用次品酒换了好酒。", b34a(0)),
  Normal(raccoon, "小哥哥真用心！开瓶器呢？", b34a(0)),
  Andrey("在这呢女士~", b34a(0)),
  Aside("安德烈倒了一杯好酒在自己杯子里，反而倒了一杯次酒给女士，真讽刺！", b34a(0)),
  Aside("安德烈走向你。", b34a(0)),
  Andrey("喂，%name，把这瓶酒收口袋里，这可是百年难得一遇的好酒！", b34a(0)),
  George("你是早就知道我会来这吗？", b34a(0)),
  Andrey("这话说的。", b34a(0)),
  Aside("安德烈摸了一下你的鼻子。", b34a(0)),
  Andrey("走了！咱们再去看看旁边有没有什么好酒！", b34a(0)),
  Aside("你和安德烈巡视着每一张桌子，顺走了许多瓶酒，口袋放不下就放外套里，外套放不下就放裤裆里，总之哪里能塞就统统塞进去。", b34a(0)),
  Aside("最后，你和安德烈几乎满载而归！回到了那个小小的维修室。", b34a(0)),
  Aside("你来到了一个房间，这个房间还算挺宽的，周围有楼梯，感觉自己像是身处大楼一样。", b34a(1), "start27"),
  Aside("这里的一切都是你没见过的，那个真皮沙发，那个闪烁的帘子！", b34a(1)),
  Aside("周围有一些人在走动，有一些人似乎在打电话，你往楼上走去。", b34a(1)),
  Aside("楼上和楼下的走廊几乎一样，而且这里似乎还有图书馆！", b34a(1)),
  Aside("走着走着，你似乎看见前面有个熟悉的身影。那不是安德烈吗？他怎么会在这？", b34a(1), "start28"),
  Aside("安德烈似乎也发现了你，只见他立刻跑过来。", b34a(1)),
  Andrey("哟，这不是%name吗，什么风把你吹来了？我奉某个房主的命令，来他的房间的隔壁房间测试一下隔音。正好这间房房主不在，我才能顺利进来！", b34a(1)),
  Aside("你哦了一声，随后跟着安德烈进入了房间。这间房间非常乱，床单有清晰人形印和多余腿印、奇怪玩具、镜子上手印、紧闭窗帘、灯上垂下的绳子、手铐、全息黄色影像。看起来像是这间房主生活习惯很差。", b34a(1), "start29"),
  Aside("此时，突然间走廊上传来了脚步声，听起来像是两个男的，还有谈话声。", b34a(1)),
  Aside("你和安德烈马上躲进了柜子里。柜子里很窄，你几乎和安德烈脸对脸贴到一起了。", b34a(1), "start30"),
  Andrey("你过去点，挤到我了。", b34a(1)),
  George("我还没说你挤到我了呢！刚刚我们为什么不直接出去？", b34a(1)),
  Andrey("我们是检修工啊！", b34a(1)),
  George("那为什么要躲起来？", b34a(1)),
  Andrey("低调，低调……", b34a(1)),
  George("那你藏床底下不行吗？", b34a(1)),
  Andrey("床底？哈哈，这里的所有房间都是实心的，哪来的床底？", b34a(1)),
  George("啧。", b34a(1)),
  Aside("你坳不过安德烈，只能就此作罢。", b34a(1)),
  Aside("外面是两只雄性蜥蜴兽人，他们一回来就躺在床上，其中一只蜥蜴兽人说道：", b34a(1)),
  Normal(lizard1, "哦，这里应该没有人了。", b34a(1)),
  Normal(lizard2, "你真火热……脱衣服吧~", b34a(1)),
  Aside("安德烈立刻捂住了你的眼睛和耳朵。", b34a(1)),
  Aside("黑暗中，你能感受到安德烈的鼻息，非常炙热。", b34a(1)),
  Aside("与此同时，你也能感受到底下有什么硬硬的东西搁到了你的肚子。", b34a(1)),
  Normal(lizard1, "房间里好热啊……要不开空调？", b34a(1)),
  Normal(lizard2, "不了，宝贝，就让它更热一些吧！", b34a(1)),
  Aside("房间里实在是太热了，你忍不住吐出了舌头。但是舌头恰好舔到了安德烈的鼻子，又或者说是眼睛。", b34a(1)),
  Andrey("别抠了，那是我的机械手。", b34a(1)),
  George("你的铁疙瘩搁到我肚子了，挪开点！", b34a(1)),
  Andrey("啊？哦，不好意思，你把机械手往上挪一点就好了。", b34a(1)),
  George("你的脸好香……", b34a(1)),
  Andrey("啧，先别闹了。", b34a(1)),
  Aside("你忍不住多舔了一下安德烈的脸。", b34a(1)),
  Aside("隔了好久，蜥蜴人终于离开了。你和安德烈冲了出来，大口喘气。", b34a(1), "start31"),
  George("你整天戴着那个机械手干啥？", b34a(1)),
  Andrey("随时准备维修东西罢了。这个东西有助于我攀爬。诶你看床上是什么？", b34a(1)),
  Aside("你看了看。", b34a(1)),
  George("这应该是旅行计划书。哦等等，它上面说只在地球外围活动？不进入地球？", b34a(1)),
  Andrey("行了，赶快看看这间房子的隔音为什么这么差，完了我应该收工回去了！", b34a(1)),
  Aside("你们检查了一下房间的隔音海绵，随后也没怎么看就为其更换了一块海绵，然后重新擦了一下墙壁，之后你们回到了维修室。", b34a(1)),
  Aside("你来到了舰桥区，这里是众人观赏宇宙风景的地方，的确，这里有很多游客，也有很多士兵。", b34a(2), "start32"),
  Aside("这里也是部分工人宿舍，很多船上的工人在此休息，比如修理工、保洁员等。", b34a(2)),
  Aside("你一眼就看到前面站着一个非常熟悉的人，那不是安德烈？", b34a(2)),
  Aside("他鬼鬼祟祟的在干什么呢？", b34a(2), "start33"),
  Aside("你走过去。安德烈正站在那里。手上拿着一枚勋章。安德烈也看见了你。", b34a(2)),
  Andrey("喂，%name，快过来看！", b34a(2)),
  Aside("安德烈招呼你过去，你过去之后，他向你展示他手里的东西。", b34a(2)),
  Andrey("知道这是什么吗？这可是修理工“长官”的勋章！猜猜我从哪找到的？", b34a(2)),
  George("行了吧，我可不想知道，你的计划是什么？", b34a(2)),
  Andrey("嘿嘿，我悄悄告诉你，我们这些太空船底层员工，都有个AI长官！这个长官用来监视我们的一举一动，不过从来没有任何一个人见过真正的长官。来看这个！", b34a(2)),
  Aside("说完，他对着员工休息室狠狠吹了一次口哨。", b34a(2)),
  Aside("顿时，几乎所有员工都走了出来，他们很疑惑，到底是谁在呼唤他们。", b34a(2)),
  Andrey("小的们，我是太空船总修理工长官，这位是我的小弟！他的名字叫%name，给我记好了！", b34a(2)),
  Aside("顿时，所有人开始叽叽喳喳的讨论起来。部分人压根不信任安德烈是他们的长官。因为很多人这辈子都没见过长官一面。", b34a(2)),
  Andrey("那边那个食蚁兽人，过来！我问你，托马斯为什么没来？", b34a(2)),
  Normal(anteater, "<c-scare>他……他今天请假了……</c-scare>", b34a(2)),
  Andrey("嗯行，我带了一瓶酒，帮我交给他，让他好受点吧！还有一件事，听说咱们部门负责维护的电路板有损坏，是真的吗？", b34a(2)),
  Normal(anteater, "是真的，电路板目前是由咱们部门的豪弟管。豪弟最近一直在苦恼，为什么电路板一直很快就坏了，明明他已经尽力去修了。", b34a(2)),
  Andrey("带我过去，我亲自去修理！", b34a(2)),
  Aside("食蚁兽兽人将安德烈和你一同带过去找了那个豪猪兽人。在此期间，几乎每个人都很恭敬的看着安德烈和你，就好像他真的是长官一样。", b34a(2)),
  Normal(anteater, "到了，他就在里面。", b34a(2)),
  Andrey("发电室？好好好。里面有人吗？别发电了，再发电也比不过这个电厂会发！", b34a(2)),
  Aside("他冲了进去。", b34a(2)),
  Andrey("喂，你在干嘛？", b34a(2)),
  Aside("那个豪猪兽人的手刚想砸下去，立刻收回了。而在他的面前，是一个沙袋。", b34a(2)),
  Andrey("呃，你在干嘛？", b34a(2)),
  Normal(porcupine, "呃，不好意思，你是？", b34a(2)),
  Andrey("我是你的长官！刚刚我吹哨没听见吗？", b34a(2)),
  Normal(porcupine, "不好意思不好意思，对不起。", b34a(2)),
  Normal(anteater, "那个就是电路板了，上面还冒火星，豪弟就是这么笨手笨脚的。", b34a(2)),
  Normal(porcupine, "你说什么？啊，不是，我的意思是……", b34a(2)),
  Aside("豪猪兽人的汗正汩汩往外流。", b34a(2)),
  Andrey("让我想想，好吧，让我亲自来修理这个！", b34a(2)),
  Aside("豪猪兽人站起身，望向那个食蚁兽人，如果说眼神能杀人，恐怕食蚁兽人已经死了千百遍了。", b34a(2)),
  Normal(anteater, "这里是装备箱，有什么要取的尽管吩咐！", b34a(2)),
  Andrey("好了好了，行了，就这样吧！我先看看。", b34a(2)),
  Normal(porcupine, "好的，谢谢长官！", b34a(2)),
  Andrey("嗯嗯，好好。", b34a(2)),
  Aside("说完，安德烈就开始干事了。", b34a(2)),
  Aside("只见他行云流水，出神入化！他手臂上的机械手配上他本身就有的两只手，工作效率提升了许多。", b34a(2)),
  Aside("豪猪兽人走到食蚁兽人旁边，问了一嘴。", b34a(2)),
  Normal(porcupine, "是你把那个自称长官的人叫来的吗？", b34a(2)),
  Normal(anteater, "不是我，怎么可能。是他自己来的！我只是顺势推舟罢了。毕竟要是你一直修不好电路板，是要被长官骂的！", b34a(2)),
  Normal(porcupine, "噢，不对，既然这个长官自己来了，那我还担心被他骂不成？", b34a(2)),
  Normal(anteater, "呃，好像也是。", b34a(2)),
  Normal(porcupine, "该死的，要是这次飞船在地球落地，我真想直接跑出去，谁愿意呆这谁呆！天天被骂就算了，还天天被嘲笑。", b34a(2)),
  Normal(anteater, "我也是！我也想跑掉。", b34a(2)),
  George("喂，你俩在聊啥？", b34a(2)),
  Normal(anteater, "<c-scare>emm，没啥。</c-scare>", b34a(2)),
  George("没啥你抖啥？", b34a(2)),
  Normal(anteater, "报告长官，我不抖了！", b34a(2)),
  Aside("你叹了一口气，随后继续看着安德烈在弄。很快，半个小时过去了。", b34a(2)),
  Andrey("搞好了！来看看！", b34a(2)),
  Aside("安德烈拍拍手，一副喜悦之情流露在面部。", b34a(2)),
  Normal(porcupine, "哇塞，简直是修的太棒了！所有部件都焊接得完美无缺！", b34a(2)),
  Andrey("好了，小弟，我们走啦！", b34a(2)),
  Aside("你跟在安德烈的身后，安德烈大步的走在前面。周围的羚羊、斑马、梅花鹿等生物都对你表示出敬意。", b34a(2)),
  George("你那个勋章哪来的？", b34a(2)),
  Andrey("噢，你说这个，这个只是用石头随意刻的罢了，真正的工人谁见过长官啊？", b34a(2)),
  George("切……", b34a(2)),
  Aside("你们回到了安全屋。", b34a(2)),
  Aside("动力区？好吧，你现在就身处动力区，这是属于底层工人聚集的地方，有很多工人都在这里工作，有烧煤的，有维修的，虽然现在基本上都自动化了，但依旧还是需要人看着，不然很容易出事。", b34a(3), "start34"),
  Aside("你打算目前暂时先在旁边逛逛。你走到了一处飞船设计图面前，正仔细的端详着这幅图。", b34a(3)),
  Aside("嗯，我现在的位置是飞船底部偏后位置，通常这里是燃料供应点。", b34a(3)),
  Aside("你又走到了另外一处地方，墙上有海报，上面有飞船的历史和飞船的光辉事迹。", b34a(3)),
  Aside("你仔细看了那则海报。", b34a(3)),
  Normal(poster, "家园号飞船建立在23xx年3月10日！由我们最尊敬的科学家哈尔博士打造！全长10公里，宽2公里。", b34a(3)),
  Normal(poster, "这艘飞船建立之初是投入军事用途的，直到24xx年时才投入民用。", b34a(3)),
  Normal(poster, "这艘 “家园号” 曾是企业战争期间的荣誉战舰，退役后改为客轮，性能出色可靠，整艘飞船里还保留有武装武器！", b34a(3)),
  Normal(poster, "他的引擎经过许多次迭代，目前是最新的第八代旗舰引擎，他内部含有数十万个零件以及数百万颗螺丝。他还有……", b34a(3)),
  Qm("喂，你在干嘛？", b34a(3)),
  Aside("你着实的被吓了一跳，回过头，发现是安德烈！", b34a(3), "start35"),
  George("你干嘛~~哎哟~~吓死我了！", b34a(3)),
  Andrey("你在了解这艘飞船的历史？我可以告诉你我知道的。", b34a(3)),
  George("好吧，你说给我听听？", b34a(3)),
  Andrey("咱们这艘飞船，光是引擎就有数十亿个参数设置，内置了一个最强的AI，普通工程师只需要说两句话，他立刻就能听懂！", b34a(3)),
  George("哦？真的假的？", b34a(3)),
  Andrey("真的真的！你看现在船上，全是保安不是，但是领导层呢？他们只需要在办公室叫一句，就可以瞬间令飞船转向。", b34a(3)),
  George("哦哟，我的天啊！", b34a(3)),
  Andrey("还有，你看我的机械臂，他里面也内置了一个非常小的AI芯片，我只需要说“出拳”……", b34a(3)),
  Aside("安德烈话还没说完，机械臂突然一弹出去……", b34a(3)),
  Aside("轰！", b34a(3), "explode"),
  Aside("天花板被砸出一个超大的洞。", b34a(3)),
  George("我去……这……", b34a(3)),
  Andrey("<c-scare>没事，我现在立刻就去修……</c-scare>", b34a(3)),
  Aside("说完，安德烈将机械臂收回了。", b34a(3)),
  Andrey("啊哈哈哈，还好附近没有人发现，不然就完蛋了。", b34a(3)),
  Aside("随后，安德烈将机械臂伸出去，开始在天花板上攀爬。他说这是因为他的机械臂含有磁性物质，可以吸引铁的东西。", b34a(3)),
  Aside("他缓慢的维修着天花板，天花板被砸出了一个大窟窿，没办法，他只能用两块铁板先暂时贴上去。他的机械臂吸引着天花板的铁皮，双手腾出用来焊接钢板。", b34a(3)),
  Aside("就在此时，突然间重力失效了！不知道什么原因，可能是管理重力的工人偷懒了。", b34a(3)),
  Andrey("喂，%name，没事吧！", b34a(3)),
  George("我还好！", b34a(3)),
  Aside("你飞了起来。安德烈那边其实还好，由于本身机械臂就已经牢牢吸附了，因此除了担心工具可能会飞走以外，人是不会飞走的。", b34a(3)),
  Aside("随后，安德烈很快便把钢板焊接到天花板上了。", b34a(3)),
  Andrey("我修好了！你快来！", b34a(3)),
  George("哦，来了！", b34a(3)),
  Aside("你往安德烈那边飞过去。余光不时瞟过那张大海报。你的眼角注意到海报下面有一行字。", b34a(3)),
  Normal(poster, "25xx年，由于太空港管理不得当，导致政府倒牌，各地战争频发，此舰为确保随时待命，将不再开往地球。", b34a(3)),
  Aside("你扑到安德烈怀里。而正在此时，重力突然间恢复了！你和安德烈两人重重摔倒在地上。", b34a(3)),
  Aside("你废了老大劲站起身，安德烈也废了老大劲站起身。", b34a(3)),
  Andrey("好了，我发誓这次重力事故绝对是因为管重力的那帮小杂种们干的！这附近应该有监控，他们就想看我们俩出丑！", b34a(3)),
  George("行了行了，先回去吧。", b34a(3)),
  Aside("你们回到了安全屋。", b34a(3)),
  Aside("安德烈一回到安全屋，就立刻打开了一瓶酒", [], "start36"),
  George("对了，我问一下，这艘船真的不会到地球吗？"),
  Andrey("啊，半对吧。"),
  George("半对是什么意思？"),
  Andrey("半对就是你先别急，这件事我也不确定，因为我也想去地球！如果这次要是去不了的话，那我就只好动点手脚了！"),
  George("等等，你我的梦想都是去一趟地球吗？"),
  Andrey("嗯对，我还从来没去过一次地球。之前好几次都是被人放在太空港的飞船收容所里，我的老爹，也就是我的养父，自己去了地球。"),
  Andrey("啊，不过那时候我还小嘛，所以没什么印象，我的梦想和你的一样，都是去一趟地球！我们底层员工的命运肯定能被修改的！"),
  George("我也相信！"),
  Aside("窗外，宇宙的星星正在闪烁，闪烁着……似乎这是一场永远也不会结束的漫漫长夜……"),
  Aside("你暂时居住在安德烈的安全屋，但其实你从来都没去过顶层，也从来都没去过那个本来就属于你的房间看过一次。不过就算看了也不太会喜欢吧！"),
  Aside("时间飞速流逝，3天时间很快就过去了。"),
  Aside("某夜，但说是夜晚，不如说是太空船时刻目前是夜晚，你和安德烈去偷酒时，突然前面有一群虫子飞过来。你和安德烈惊慌着躲到管道缝隙里躲过了一劫。"),
  Aside("安德烈解释说这是每个月定时驱虫和扫地的机器虫，一般来说，他们被我们底层员工称作寄生虫，因为底层一直都很脏乱，没有人知道为什么要派这些东西处理。"),
  Aside("这天夜里，你做了一个梦，<c-rainbow>梦见自己身处地球，沐浴在阳光下！</c-rainbow>"),
  Aside("你惊讶的跳起来，却发现这里依旧是太空港，无数的冷汗爬满你的全身，你根本不知道未来几天的路应该怎么走，如果真像自己之前发现的飞船不停靠地球，那安德烈的计划是什么？"),
  {
    type: "to",
    to: 4,
  }
])
// 第四章（仅洗澡对话）
export const dialogChapter4 = readable<DialogInterface[]>([
  Aside("今天，安德烈带着你来到了一处由引擎废液组成的不算那么天然的温泉区。", [], "start37"),
  Aside("这里真的是由引擎产生的废液组成的，但是经过了再加工，与此同时，没有任何一个人将这件事告诉给那群富人。"),
  Aside("温泉冒着热气，废液特有的化学味道被过滤器中和，反而带着一点金属的清香。四周是粗大的管道和压力表，头顶的照明灯发出昏黄的光。"),
  George("你是怎么发现这种地方的？"),
  Andrey("嘿，底层员工总得有点自己的乐子。这地方连AI都监控不到，因为房间门上写着“危险废液区，禁止进入”。"),
  Aside("安德烈脱下上衣，露出精壮的上身，肩膀和背部的肌肉线条在蒸汽中若隐若现。他毫不犹豫地滑入温泉，舒服地叹了口气。", [], "start38"),
  Andrey("下来啊，%name，愣着干嘛？"),
  Aside("你也脱掉外套，小心地试探水温，然后慢慢坐进水里。温热的液体包裹着身体，让你紧绷的神经松弛下来。", [], "start39"),
  Aside("两人沉默了片刻，只有蒸汽嘶嘶的声音和远处引擎的低沉轰鸣。", [], "cgshower"),
  George("安德烈……我们能不能……不再过这种躲躲藏藏的生活？"),
  Andrey("你指的是哪种生活？偷酒？躲机器虫？还是被那些有钱人当空气？"),
  George("就是。我想……堂堂正正地活着。不用怕被赶出去，不用怕被当成寄生虫。"),
  Andrey("其他区能生活吗？娱乐厅？那是给乘客的。旅客区？我们进去都得偷偷摸摸。舰桥区？到处都是保安。动力区？就是我们这破地方。"),
  Aside("你回想这几天的经历，不得不承认他说得对。"),
  Aside("你抬起头，目光落在安德烈身上。他半躺在水里，热气蒸腾中，宽阔的后背、结实的肩膀、被水汽打湿的毛发……恍惚间，你仿佛看见一只巨大的虎兽人伏在草原的河流边，与金黄色的干草融为一体。"),
  Normal(`<span style="${publicCss} background-color: rebeccapurple;">恐惧之心</span>`, "奔跑……狩猎……死亡……", []),
  Aside("你猛然间站起来。"),
  George("为什么不去地球？！"),
  Aside("水花四溅，安德烈被你吓了一跳。"),
  Andrey("你发什么疯？我说过了，飞船不降落。"),
  George("那我们偷个逃生舱什么的！"),
  Andrey("这是宇宙飞船，完全密封。逃生舱只能在外太空飘，没有推进系统能到地球。"),
  Aside("安德烈沉默了一会儿，整个人潜进水里，过了好久才浮上来，甩了甩脑袋。"),
  Andrey("不过……其实有个办法。"),
  George("什么办法？"),
  Andrey("这艘“家园号”以前是战舰，企业战争时期的荣誉舰。退役后改成了客轮，但很多系统还在。我养父告诉过我，飞船有一个古老的控制权限——舰长级紧急迫降协议。如果能拿到那个权限，就能强制改变航线，迫降在地球。"),
  George("那还等什么？我们去拿！"),
  Andrey("哪有那么容易。那个权限被锁在核心机房的某个地方，需要多重密码——声纹、生物信息、还有古老的授权码。而且那地方……据说很久没人进去过了。"),
  George("安德烈，我梦见地球了。真的。阳光、草原、水……我是一名鬣狗，我生来就是大草原的！我再也不想再在垃圾堆里活一辈子。"),
  George("这里，每天逃亡的生活我已经不想再继续了！我也不想再住那肮脏的地下室了！"),
  George("我……我……"),
  Aside("你哭了出来。"),
  Aside("安德烈看着你，眼神变得认真"),
  Andrey("……好吧。既然你决定了，我陪你。反正我也从来没下去过，早就想看看我养父说的“蓝色星球”是什么样。"),
  Aside("你擦了擦眼泪，点头答应了一句。随后开始制定作战计划。", [], "hintplan"),
  Andrey("首先，据我所知，去核心机房总共有3个步骤！众所周知，船上总共有两名舰长，首先是生物信息，这个你需要主动获取第一位舰长的生物信息，揪他身上的一根毛就好。还有声纹，这个是第二个舰长的。你只需要用高清设备录制他的声音即可。最后一个，授权码！"),
  George("授权码在哪？"),
  Andrey("授权码一般不在飞船上，不过舰长肯定知道，你只要撬开他的嘴就好了。哦对了，第一个舰长是一个豹兽人。"),
  Andrey("先获取声纹信息吧！豹舰长一般会在宴会厅里到处闲逛，你随时都可以接近他，你打算怎么做？"),
  Choice("branch35", ["装作演员表演。", "装作调酒师给舰长调酒。"]),
  Andrey("好的！下一个问题，第二个舰长是一位薮猫兽人，他一般会亲自下厨，这点我不确定他到底是什么特殊癖好，不过这样其实更好。你打算怎么做？"),
  Choice("branch36", ["趁他忙的时候揪他的毛。", "装作顾客上去品尝他的菜。"]),
  Andrey("em，恐怕不行，他一般只做菜给自己吃。再想个别的办法呢？", [{key: "branch36", value: "装作顾客上去品尝他的菜。"}]),
  Choice("branch36", ["趁他忙的时候揪他的毛。", "在他做的菜里面撒猫草。"], [{key: "branch36", value: "装作顾客上去品尝他的菜。"}]),
  Andrey("ok，好的。就这样吧！", [], "cgrshower"),
  Aside("说罢，安德烈站起身，你被他的身体惊艳到了。他穿好衣服。", [], "start40"),
  Andrey("好了，咱们先出去吧！"),
  Aside("你披上外套，离开了这里。", [], "start41"),
  {
    type: "to",
    to: 5
  }
])
// 0: 跳舞，揪毛，1：跳舞，猫草，2：调酒，揪毛，3：调酒，猫草
function f3536(i: number): IfInterface[] {
  return [
    {
      key: "branch35",
      value: ["装作演员表演。", "装作调酒师给舰长调酒。"][(i === 0 || i === 1) ? 0 : 1],
      next: "and",
    },
    {
      key: "branch36",
      value: ["趁他忙的时候揪他的毛。", "在他做的菜里面撒猫草。"][(i === 0 || i === 2) ? 0 : 1]
    }
  ]
}
function f35(i: number): IfInterface[] {
  return [
    {
      key: "branch35",
      value: ["装作演员表演。", "装作调酒师给舰长调酒。"][i]
    },
  ]
}
function f36(i: number): IfInterface[] {
  return [
    {
      key: "branch36",
      value: ["趁他忙的时候揪他的毛。", "在他做的菜里面撒猫草。"][i]
    }
  ]
}
const captain1 = `<span style="${publicCss} background-color: MidnightBlue">豹舰长</span>`
const captain2 = `<span style="${publicCss} background-color: MidnightBlue">薮猫舰长</span>`
const host = `<span style="${publicCss} background-color: darkcyan">主持人</span>`
// 第五章
export const dialogChapter5 = readable<DialogInterface[]>([
  Aside("这一天，你们来到了宴会厅。宴会厅里有很多乘客。每位乘客都坐在位子上交流，还有些落单的乘客正在座位上交流着。", [], "start42"),
  Andrey("呐，你看，那就是舰长了，他就坐在那里！"),
  Aside("这位舰长长得很帅很威猛，不愧是豹兽人，不过看起来他长得很熟悉……算了，直接上吧！"),
  Aside("你身上提前背了一些设备，用于演出一些出色的技巧。", f35(0)),
  Aside("你来到幕后，放下仪器。此时台上刚好有主持人正在宣布。", f35(0)),
  Normal(host, "完美的一次表演，那么下面我们请欣赏来自罗衫的精彩演出吧！", f35(0)),
  Aside("罗衫是谁？此时你刚好看到旁边有一位精心装扮的男士正往台上走。你想也没想，冲上前朝着他的后颈来了一拳。他一瞬间就被击晕了。", f35(0)),
  Aside("随后，你硬着头皮走上了台。", f35(0)),
  Normal(host, "噢，看呐！咱们的罗……", f35(0)),
  Aside("主持人愣住了，他看见了一只鬣狗正在台上，身后还拖着一个仪器！", f35(0)),
  Aside("但他也不能扫了各位的兴，他大声说。", f35(0)),
  Normal(host, "罗衫走上台了！大家掌声欢迎！", f35(0)),
  Aside("安德烈正站在台下，手里还握着一根话筒一样的，应该是录音机。他两只手摊开，向你欢呼！", f35(0)),
  George("大家好！我是罗衫！接下来让我为大家表演……", f35(0)),
  Aside("你卡住了，但好在安德烈后面用手势提醒了一下你。", f35(0)),
  George("手风琴！对，是手风琴！", f35(0)),
  Aside("你坐在台上，手里捧着一个很大的盒子，你的左手放在键上，右手放在了拉手上。你缓慢的学着那些贵妇人拉琴。", f35(0)),
  Aside("笑死了，你根本从来就没有学过这个……你只是在候船厅那会见过一两次这种琴，没想到拉了两次根本没有声音。", f35(0)),
  Aside("你按了按前面的按键，似乎有声音了！看来得一边拉一边弹才行！", f35(0)),
  Aside("但结果就是，你拉出了一阵吵闹的声音，所有人都惊呼了，主持人也惊了。这声音怎么这么难听？", f35(0)),
  Normal(host, "呃，兄弟，你要不要休息一下？", f35(0)),
  Choice("branch37", ["什么？连你也觉得我病了吗？吼吼，行了吧，我根本没病，我拉的就是这么棒！这就是我的真实水平！", "我的天哪，我弹奏得这么棒！你们这帮有眼无珠的家伙！真的是气死我了！干脆把耳朵都捐了吧！！"], f35(0)),
  Aside("观众看不下去了，纷纷向你竖起大倒拇指，让你下台。", f35(0)),
  Aside("你用余光一瞟，惊恐的发现安德烈不见了，舰长也不见了！你放下手风琴。", f35(0)),
  George("好好好，我承认我病了，我该下台了……", f35(0)),
  Aside("你丢下一句嘴，来到了安德烈走掉的地方。但此时，安德烈却从厕所里走了出来。", f35(0)),
  Aside("你推着一个酒车，来到了舰长附近。你高兴的说。", f35(1)),
  George("朋友你好！我是%name，我是这里卖酒的！", f35(1)),
  Normal(captain1, "嗯？你这里有什么酒？", f35(1)),
  Choice("branch37", ["太空港联名利口酒，喝着纯！又香又浓，还不辣口，每个人喝了都赞不绝口！", "你发烧了吗？发烧了我这里也有好酒可以治治你的精神病！让你这一整天都精神抖擞！"], f35(1)),
  Aside("其实那里所有的酒都是你偷来的。但你根本不能直接说出来。而且要不是你昨天晚上喝过这种酒，也说不出这种话。", f35(1)),
  Normal(captain1, "哦？那我可得尝尝了。", f35(1)),
  Aside("你到处看，奇怪，安德烈呢？正当你疑惑之际，舰长突然说话了。", f35(1)),
  Normal(captain1, "不错，真是个好酒！", f35(1)),
  Aside("隔了一会，舰长站起身。", f35(1)),
  Normal(captain1, "我要去上个厕所，你这种酒我买2瓶，你先等我一会！", f35(1)),
  George("过奖了！", f35(1)),
  Aside("说完，舰长朝着厕所走去了。你在原地等候。因为他可能一会儿会回来付钱。", f35(1)),
  Aside("不一会，舰长走了出来。与此同时，你看到了与舰长同时走出来的，还有一个熟悉的身影。", f35(1)),
  Normal(captain1, "哎呀，服务生，这两瓶酒多少钱？", f35(1)),
  George("不好意思，先生，两瓶酒就送给你了！我先走了！", f35(1)),
  Normal(captain1, "你去干嘛？不给钱怎么好意思？", f35(1)),
  Aside("舰长没有追你，但他似乎看见你走到安德烈的身边了。", f35(1)),
  George("怎么样？拿到了吗？", [], "start43"),
  Andrey("托你的福，拿到了！"),
  George("呼，谢啦！下一个是什么？"),
  Andrey("下一个是生物信息，我刚刚了解到，这个是第二个舰长的。尽快去吧！"),
  George("所以我们现在应该去干嘛？"),
  Andrey("诶嘿，马上就到饭点了，我们应该去厨房了！"),
  Aside("你和安德烈来到厨房里。", [], "start44"),
  Aside("你将身上的手风琴藏到了外面，并拿出了镊子，装作啥也没看到的往里走。", f3536(0)),
  Aside("你将身上的手风琴藏到了外面，并拿出了猫草，装作啥也没看到的往里走。", f3536(1)),
  Aside("你赶快把剩下的酒藏到了外面，并拿出了镊子，装作啥也没看到的往里走。", f3536(2)),
  Aside("你赶快把剩下的酒藏到了外面，并拿出了猫草，装作啥也没看到的往里走。", f3536(3)),
  Aside("安德烈看到了第二位舰长，他指了指。", [], "start45"),
  Aside("你悄悄的走到那第二位舰长的身后，刚想摘一撮毛。", f36(0)),
  Aside("那位舰长一回头，刚好看见了你。", f36(0)),
  Normal(captain2, "喂，你是谁？你也是厨房的帮工吗？", f36(0)),
  Aside("你愣了一下。", f36(0)),
  George("啊？嗯，是的！我的确是帮工！", f36(0)),
  Normal(captain2, "帮工？我以前怎么没见过你？", f36(0)),
  George("呃，我是新来的。", f36(0)),
  Normal(captain2, "你叫什么名？", f36(0)),
  George("我……", f36(0)),
  Aside("你回头一看，安德烈又不知道跑哪去了。你只能硬着头皮回答。", f36(0)),
  George("%name。", f36(0)),
  Normal(captain2, "没听说过，你看起来像个鬣狗？", f36(0)),
  Choice("branch38", ["嗯，对，我肯定是鬣狗兽人，万中无一的鬣狗兽人！别人都叫我超级无敌大鬣狗！", "你眼睛……还好吗？这么年轻就看不见了吗？我不是鬣狗兽人，难道我是愚蠢的鱼兽人吗？"], f36(0)),
  Aside("他微微点了点头。", f36(0)),
  Normal(captain2, "不错。哦对了，你们是要做全船人所有的饭菜对吧，那正好，厨师长晚点过来，你先把盘子刷一下！", f36(0)),
  George("啊？哦……", f36(0)),
  Aside("你拿起海绵，用你那双非常细嫩的双手开始刷碗。为了不引起警觉，你一边刷一边靠近薮猫舰长，直到距离他只有一指距离。", f36(0)),
  Normal(captain2, "嘿，你在干什么？", f36(0)),
  Aside("你被吓了一跳，手上的镊子跌到地上。", f36(0)),
  Normal(captain2, "你！你想谋杀吗？", f36(0)),
  George("不不不，你想错了。", f36(0)),
  Aside("说完，你瞬间狠狠的抓住了薮猫兽人的手臂，并狠狠的薅了一把毛下来，随后你马上就跑掉了。", f36(0)),
  Aside("你悄悄走到那个薮猫兽人的旁边，趁他不注意，往他的菜里撒了两把猫草。随后躲了起来。", f36(1)),
  Aside("那个薮猫兽人回到了菜旁边，鼻子似乎闻到了菜的味道。他嘀咕着。", f36(1)),
  Normal(captain2, "今天的菜感觉格外的香啊~哇，真的好香~~", f36(1)),
  Aside("他犯迷糊了。", f36(1)),
  Aside("你趁机狠狠的抓了一把薮猫舰长。但是，薮猫舰长很轻松的就躲过去了。", f36(1)),
  Normal(captain2, "诶呀，还有刺客？但你似乎小看了薮猫的灵活程度！", f36(1)),
  Aside("你哑口无言。", f36(1)),
  Normal(captain2, "说吧，谁派你来的？", f36(1)),
  George("我只是想……", f36(1)),
  Aside("你回头一看，安德烈又不知道跑哪去了。你只能硬着头皮回答。", f36(1)),
  George("想和你深入交流一下罢了！", f36(1)),
  Normal(captain2, "诶等等等等，我先告诉你哈，我可是钢铁直男，深入交流还是免了吧。你的真实目的到底是什么？", f36(1)),
  Choice("branch38", ["我的真实目的？哈哈哈，真实目的就是我压根就没有目的！我做的所有的一切就是为了爱上你！", "我的目的？好吧，其实我是有点目的的，那就是我已经喜欢上你了。你真可爱，宝贝~"], f36(1)),
  Aside("你摸了摸口袋，自己口袋里居然还剩下这么多猫草，你索性直接全部用掉算了！", f36(1)),
  George("看猫草！", f36(1)),
  Aside("你直接向薮猫兽人狠狠的扑了一把猫草，薮猫兽人见状，非常开心。", f36(1)),
  Normal(captain2, "我的天啊，这么多猫草，嘿嘿嘿~你是个好人~~", f36(1)),
  Aside("你早就猜到了所有猫科兽人对猫草都毫无抵抗力，这就是为什么军队里但凡进了猫科兽人都要先进行一次猫草特训。", f36(1)),
  Aside("你走上前，扯了一把薮猫兽人的毛。", f36(1)),
  George("没什么，就是要了你一根毛而已啦~", f36(1)),
  Aside("薮猫兽人直到现在还沉浸在猫草的世界里。", f36(1)),
  George("安德烈？你在哪？", [], "start46"),
  Aside("你一出门就叫安德烈，但是他似乎并没有回应你。"),
  George("该死。你在哪？"),
  Aside("你走在奇妙的太空船侧翼，这里可以透过窗外看清楚整片宇宙，整个宇宙空空如也，没有一点亮光，有的只是斑斑的行星，漫漫长夜，是时候该终止了！你必须要去地球上，躺下晒太阳，奔跑！临近这最后一步，可千万不能出差错了！"),
  Aside("前面似乎有一个熟悉的身影。", [], "start47"),
  George("安德烈！！"),
  Aside("你冲上前，大声吼道。"),
  Andrey("啊，%name，你来了！进入这道门，就是核心控制室了。我刚刚趁舰长不在，偷走了他的记事本。里面记录了密钥！现在就差临门一步了！"),
  Aside("你感动的要哭了。你拉着他的手。"),
  George("我们一起走！"),
  Andrey("不了，不好意思，我不能和你一起走。"),
  George("为什么？"),
  Andrey("啊……因为……"),
  Aside("安德烈说着，他的身后突然传出了一阵声音。"),
  Qm("哈哈哈，不止他走不了，你也走不了了！"),
  George("你是谁？"),
  Qm("哦，你还不认识我，那让我自我介绍一下吧！你手里的船票，是我给你的！"),
  George("什么？"),
  Qm("你的整个登船事件都是我一手策划的！还有这个，安德烈！是一个次生人！也就是说，陪了你这么多天的，就是一个AI机器人！"),
  George("这……这不可能，安德烈，你说一句话！哦对了，机器人不能喝酒的！"),
  Aside("你像是抓住了一个救命稻草。"),
  Qm("机器人不能喝酒？哈哈哈，他是AI，对于你来说，他肯定是真人，但是如果他只是个披着兽人皮的骨架呢？我想让他做什么他就做什么！"),
  Andrey("对不起，%name，是我失信了。"),
  Qm("不止他是我的杰作，包括和你做了多年老友的托尼，也是我的杰作嗷~"),
  George("够了，说了这么多，你的真实目的到底是什么？"),
  Qm("真实目的？哈哈，你还不明白吗？安德烈已经告诉你了吧，这艘太空船已经快一百年没降落过地球了。我们这些在太空港的人，无论怎么样都无法步入地球一次。"),
  Qm("而我，费劲千辛万苦，才得知了这艘舰艇上面有一个紧急控制室，这个舱只要在距离地球最近的位置，临时夺权哪怕只有1分钟，也能让飞船紧急降落到地球！"),
  Qm("而你！只是我的棋子！我把船票放在蛋里，并主动的让那个该死的查理发现。然后我费劲心思把你引上来，就是看到你和我的杰作托尼撺掇已久，我把你安排在安德烈身边，故意让他在太空港与你相遇，最后让你沉迷在他的怀里。"),
  Qm("最后，我便可以很轻易的获得这个紧急控制室的权限，声音纹，生物纹，还有这最终的密钥！但是你唯一不知道的就是，一旦夺取权限，整个飞船会瞬间断电。我会紧急握动操作杆，飞船将会向地球撞去。"),
  Qm("你可知道，这可不是简单的降落，这是直接撞上地球啊！我是有多么希望再看一眼蓝天、白云，为了这个目的，牺牲一点这种社会高级人士又如何？他们整天就只知道吃里爬外，根本没资格活着！"),
  George("所以……紧急控制室的功能，就是让飞船撞向地球吗？但是这样你我都会死掉！"),
  Qm("我？你可知我身后背着的是什么？", [], "hintmore"),
  Aside("那是一个降落伞。"),
  Qm("实不相瞒，等我到了地球之后，安德烈已经没有任何用处了，就让他和你一起在飞船上陪葬吧！"),
  George("如你所见，要是我现在把你的计划告诉舰长，你还能活吗？"),
  Qm("你威胁我？我告诉你！再过10分钟就是整个旅程最接近地球的时候了！到时候我只需要掌握控制权，哪怕只有1分钟，我也可以强制使飞船转向！"),
  Aside("说完，他用密钥打开了门。"),
  {
    type: "choice",
    id: "branch39",
    choice: ["投降，也许他会放你一马", "冲上前，提前掌握主动权", "无动于衷，静等死亡"],
    score: {
      targetId: "branch40",
      action: (branch: string, _: string) => {
        return branch === "冲上前，提前掌握主动权" ? Math.random().toString() : "0";
      }
    }
  },
  ...(() => {
    const ifbranch: IfInterface[] = [
      {
        key: "branch39",
        value: "投降，也许他会放你一马"
      }
    ]
    return [
      George("我投降，我投降，大人，是我有眼不识泰山，其实我也想去地球。", ifbranch),
      Qm("你也想去地球？好啊，打不过就开始投降了吗？", ifbranch),
      Aside("你转眼望向安德烈，他站在一旁默不作声。", ifbranch),
      George("对不起大人，我还是对你有用的吧，安德烈我不要了。我只要主人。", ifbranch),
      Aside("你此时已经被下破了胆，你的裤子已经湿了一大片。", ifbranch),
      Qm("吓坏了吧！哈哈哈哈！安德烈，过来！", ifbranch),
      Aside("安德烈走过来。", ifbranch),
      Andrey("主人。", ifbranch),
      Qm("那么，把这个肮脏的人给我丢到外太空去吧！我不需要懦弱的人来陪我！", ifbranch),
      Andrey("是，主人。", ifbranch),
      Aside("说完，安德烈把你扛在肩上，离开了房间。", ifbranch),
      Aside("到了外面，安德烈把你放了下来。", ifbranch),
      George("该死，你真的想把我丢出去吗？我和你生活了这么多天没有一点感情吗？", ifbranch),
      Andrey("对不起，我也是奉主人的命令。", ifbranch),
      George("你……明明是机器人，为什么还有血有肉，甚至还能喝酒？", ifbranch),
      Andrey("其实，次生人的意思，就是通过科学技术人工培育的种，里面包含了多种基因片段。兽人的那里面都是蛋白质，现在人已经掌握了体外培育蛋白质的技术了！", ifbranch),
      George("所以你其实是人工生命？", ifbranch),
      Andrey("准确来说是的。", ifbranch),
      George("那托尼……", ifbranch),
      Andrey("托尼算是半人形机器人，他有自己的思考能力，而我算是下一代的次生人。", ifbranch),
      George("我……我还不想死！！", ifbranch),
      Aside("一想到这个你就浑身发抖。", ifbranch),
      George("那个该死的老东西甚至要把你杀了，你难道就没有一点点的反抗之心？", ifbranch),
      Andrey("我……我不知道。我要学的东西还很多，但我知道，属于太空港的漫漫长夜，我们这辈子都不会过了。。", ifbranch),
      Aside("不久之后，红灯亮起，整艘船全部闪烁着红灯，警报声忽远忽近。你第一次在窗外看到了地球的完整模样。", ifbranch),
      Aside("又过了2分钟，你开始失重，地球就在窗外，近在咫尺！你甚至伸出手就可以触摸它！", ifbranch),
      Aside("又2分钟过去，你的大脑开始放空，此时窗外的光线变得很亮，你知道自己已经进入了地球的臭氧层。！", ifbranch),
      Aside("前所未有的愉悦感席满全身，你第一次看到阳光，哪怕这辈子死了也值了！第一次的离别，原来这么悲惨吗？", ifbranch),
      Aside("安德烈紧紧的抱住你，抱住你……抱住了此生无憾的你！永别了！太空港！", ifbranch),
      Aside("飞船爆炸了……", ifbranch),
      {
        id: "ne",
        type: "end",
        message: `<span style="color: yellow">Normal Ending</span><br>你此生无憾了`,
        if: ifbranch,
      }
    ]
  })(),
  ...(() => {
    const ifbranch: IfInterface[] = [
      {
        key: "branch39",
        value: "无动于衷，静等死亡"
      }
    ]
    return [
      Aside("你无动于衷。", ifbranch),
      Qm("我的伟大之业即将诞生啦！地球！我来啦！", ifbranch),
      Aside("安德烈看见你无动于衷，他思考了很久，最后在神秘人关门的前5秒钟，冲上前，狠狠的砸开了门！", ifbranch),
      Qm("什么鬼，安德烈，你要造反吗？", ifbranch),
      Andrey("不，哪怕我死掉，我也要阻止你！", ifbranch),
      Qm("够了，你给我滚开！", ifbranch),
      Aside("神秘人怪就怪他当初把安德烈生得太壮实了。安德烈此时狠狠把神秘人压在墙角。", ifbranch),
      Andrey("呃，呃啊！！", ifbranch),
      Aside("安德烈发了疯似的揍那个神秘人。", ifbranch),
      Aside("神秘人此时满脸是血。", ifbranch),
      Andrey("我！我不允许你为了自己的一己私欲杀死整条船的人！！", ifbranch),
      Aside("在打斗过程中，安德烈意外碰到了操作杆。在这一瞬间，飞船顿时冒起了红光……所有战备人员进入一级戒备！", ifbranch),
      Qm("你！你竟敢！", ifbranch),
      Aside("飞船紧急转向，随后径直朝着地球撞过去……", ifbranch),
      Qm("可恶，快放开我！这样的话我们都得死在这里！", ifbranch),
      Andrey("死就死吧，大不了和你同归于尽！", ifbranch),
      Qm("我好歹也算是你的父亲，可是你就是这么报答我的？", ifbranch),
      Andrey("可笑，自从我的养父去世之后，我哪里还有父亲？你不过就是个半路杀出来的废物罢了！", ifbranch),
      Aside("安德烈紧紧的掐住神秘人的脖子。直到你捡起了地上的一个包包。", ifbranch),
      George("安德烈，别管他了！想活命和我走！", ifbranch),
      Aside("飞船距离地面800km、700km、600km……", ifbranch),
      Aside("警报一直在报数，这就像催命符一样催动着他们行动。", ifbranch),
      George("我刚刚拿到了他的降落伞包包，你比我重，你穿上，然后你抱着我！", ifbranch),
      Andrey("好，行！", ifbranch),
      Aside("随后，飞船很快进入了地球的臭氧层，你和安德烈费了老大劲，砸开了宇宙飞船的窗，之后一跃而下……", ifbranch),
      Aside("你的大脑突然一片空白。眼里一阵眩光……你晕了过去。", ifbranch, "start48"),
      Aside("你再次醒来时，你在一片草原上。周围是草，是山，是天空，是太阳！！", ifbranch, "start49"),
      Aside("你不可置信，自己居然到地球了！", ifbranch),
      Aside("安德烈走了过来，他捧着一碗水。", ifbranch),
      Andrey("是的，这里是地球，%name，我们成功了！", ifbranch),
      George("是阳光，真暖和~地球~啊！太美了！", ifbranch),
      Andrey("太空港的漫漫长夜，终于度过了！", ifbranch),
      Aside("1天后，在国家新闻台上报道，有一个似乎是外太空来的宇宙飞艇坠毁在地球，船上无人生存。几乎全地球人都知道了这件事。而独独你们不知道。", ifbranch),
      Aside("3天后，你们进入了城市，过上了和正常人无异的生活，但因为种种不相干的习俗，导致了你迟迟融入不进去。", ifbranch),
      Aside("40天后，你们正式结为同性伴侣，准备相守终生。你时不时会发一两封电报回去给托尼，也不知道托尼收到了没有。总之，一切都往好的方向发展。", ifbranch),
      Aside("378天后，你们在这座城市上定居了下来，你为安德烈定制了一个棒球服，并鼓励安德烈去打棒球运动！安德烈对此也非常赞同！", ifbranch),
      Aside("这也是你们第一次与太空港的离别，一别即是永远。属于你们的漫漫长夜，终于度过了！", ifbranch),
      {
        id: "te",
        type: "end",
        message: `<span style="color: yellow">True Ending</span><br>你终于摆脱了漫漫长夜`,
        if: ifbranch,
      }
    ]
  })(),
  ...(() => {
    const ifbranch: IfInterface[] = [
      {
        key: "branch39",
        value: "冲上前，提前掌握主动权",
        next: "and"
      },
      {
        key: "branch40",
        value: (branch_value: string) => {
          return parseFloat(branch_value) >= 0.5
        }
      }
    ]
    return [
      Aside("你愤怒的冲上前，给了神秘人两拳。但是神秘人均接下了你的两拳，并反手给你整只手铐住。", ifbranch),
      Qm("细胳膊细腿的，你怎么好意思和我打？", ifbranch),
      George("你！可恶！", ifbranch),
      Aside("你手脚被绑住了。", ifbranch),
      Qm("给我乖乖的呆在那，我也许会让你死得痛快一点！", ifbranch),
      Aside("你毫不甘心被绑住，愤怒的你冲上前狠狠的咬了一口神秘人。鬣狗的咬合力出奇的高，神秘人吃痛。", ifbranch),
      Qm("可恶的死鬣狗，居然敢咬我！安德烈，给我过来！", ifbranch),
      Aside("安德烈走了过来。", ifbranch),
      Qm("我看着你，把他给我拖到舱门那里去！", ifbranch),
      Aside("那个神秘人从控制台那边捡了一把枪。指着安德烈，安德烈无奈只好将你拖到了舱门口。", ifbranch),
      Qm("穿上太空服，打开舱门！", ifbranch),
      Aside("你和神秘人穿上了太空服，并打开了舱门。舱门外黑漆漆的一片，除了底下那颗蔚蓝色的星球以外。", ifbranch),
      Aside("神秘人似乎看到了你流下了两行眼泪，他啐了一口，一脚把安德烈也踢出了舱门……", ifbranch),
      Qm("我的队伍里不需要有情感的傻瓜！给我滚吧！", ifbranch, "start50"),
      Aside("神秘人将氧气瓶断开，随后切断了你和飞船的联系……由于没了氧气瓶，太空服内的氧气含量骤降，冷气瞬间弥漫着安德烈的全身。", ifbranch),
      Aside("冷气与窒息感瞬间弥漫着你，你望着安德烈，最后给了他一个小小的眼神。那个眼神似乎在说：不怪你。", ifbranch),
      George("对不起，都是我的错，我不应该让你去搜集舰长的生物信息，对不起……对不起！！", ifbranch),
      Aside("安德烈眼泪流了出来……", ifbranch),
      Aside("十分钟后，飞船被地球引力捕获，安德烈亲眼看见飞船撞向地球，而你根本无能为力。。第一次的离别，原来这么悲惨吗？", ifbranch),
      Aside("二十分钟后，氧气耗尽，安德烈和你通通都死在了外太空里……啊，到死也没能看一眼地球，将是多么遗憾的事情啊！永别了！太空港！", ifbranch),
      {
        id: "be",
        type: "end",
        message: `<span style="color: yellow">Bad Ending</span><br>你死在了外太空`,
        if: ifbranch,
      }
    ]
  })(),
  ...(() => {
    const ifbranch: IfInterface[] = [
      {
        key: "branch39",
        value: "冲上前，提前掌握主动权",
        next: "and"
      },
      {
        key: "branch40",
        value: (branch_value: string) => {
          return parseFloat(branch_value) < 0.5
        }
      }
    ]
    function f35a(i: number): IfInterface[] {
      return [
        {
          key: "branch35",
          value: ["装作演员表演。", "装作调酒师给舰长调酒。"][i],
          next: "and",
        },
        ...ifbranch
      ]
    }
    function f36a(i: number): IfInterface[] {
      return [
        {
          key: "branch36",
          value: ["趁他忙的时候揪他的毛。", "在他做的菜里面撒猫草。"][i],
          next: "and",
        },
        ...ifbranch
      ]
    }
    return [
      Aside("你愤怒的冲上前，给了神秘人两拳。神秘人压根没反应过来，被你一拳打趴在地……", ifbranch),
      Qm("该死！", ifbranch),
      Aside("你乘胜追击，用尽全身力气压住了神秘人。", ifbranch),
      George("安德烈！快过来！", ifbranch),
      Aside("安德烈立马冲过来，死死的压着神秘人。", ifbranch),
      George("我去找舰长！你不要让他动操作杆！", ifbranch),
      Aside("安德烈心领神会，立刻死死的铐住了神秘人。神秘人动弹不得。", ifbranch),
      Aside("不出10分钟，你便从厨房、宴会厅找齐了两名舰长，这两名舰长呼叫了保安。", ifbranch),
      Aside("你将事情的来龙去脉说明了一遍，唯独利用蒙太奇手法将你偷他们的生物密码的事情搪塞过去。", ifbranch),
      George("事情就是这样！麻烦你狠狠处置！", ifbranch),
      Normal(captain1, "哦，原来是这样！叫保安过来，关入牢房！等回太空港就收拾你！", ifbranch),
      Normal(captain2, "我的天，我以为这种事只有在fvn视觉小说里才会出现的一幕，没想到居然在这里真的有？！", ifbranch),
      Normal(captain1, "一会你过来记得解释一下为什么上台表演演的这么差！", f35a(0)),
      Normal(captain1, "一会你过来记得解释一下为什么刚刚买你的酒不收钱！", f35a(1)),
      Normal(captain2, "一会你过来记得解释一下为什么偷偷跑过来谎称厨师！", f36a(0)),
      Normal(captain2, "一会你过来记得解释一下为什么对我撒那么多的猫草！", f36a(1)),
      George("哦，好吧~", ifbranch),
      Aside("最终，保安把神秘人抓走了，最终的判决结果是听从太空港的判决。", ifbranch),
      Aside("你接着回到了安德烈的安全小屋。", ifbranch, "start51"),
      George("嗷！好吧，你可从来没说过去一次地球要整船人的性命。", ifbranch),
      Andrey("有舍才有得，朋友，你要知道这一点。", ifbranch),
      George("那这种舍的代价简直是太大了。这根本不值得。", ifbranch),
      Andrey("你说的对，这根本不值得！", ifbranch),
      George("对了。你……明明是机器人，为什么还有血有肉，甚至还能喝酒？", ifbranch),
      Andrey("其实，次生人的意思，就是通过科学技术人工培育的种，里面包含了多种基因片段。兽人的那里面都是蛋白质，现在人已经掌握了体外培育蛋白质的技术了！", ifbranch),
      George("所以你其实是人工生命？", ifbranch),
      Andrey("准确来说是的。", ifbranch),
      George("那托尼……", ifbranch),
      Andrey("托尼算是半人形机器人，他有自己的思考能力，而我算是下一代的次生人。", ifbranch),
      George("噢~行吧，不过至少来说，我们又能回到太空港了！我们又能回到我们温暖的小窝了！", ifbranch),
      Andrey("呜哇，是的！", ifbranch),
      George("也许将来，我们还能自己造一台飞船，光临一次地球！但至少我们还有家嘛！！", ifbranch),
      Aside("就这样聊着，聊着……", ifbranch),
      Aside("10天后，地球环绕旅行到此结束，你们回到了太空港，你回到了托尼的怀抱，安德烈则继续呆在太空飞船。", ifbranch, "start52"),
      Aside("1046天后，安德烈成功当上了舰长，你为他感到兴奋和高兴！不过由于规定的问题，目前还是无法在地球降落。", ifbranch),
      Aside("1802天后，你重新参加查理的葬礼，并在葬礼上致辞。", ifbranch),
      Aside("3652天后，你第一次踏足卫星的地面，过高的重力让你很不舒服，回去后一个星期你都躺在床上休息并且发誓再也不去了。", ifbranch),
      Aside("5478天后，托尼升级了躯体，还换了个闪闪发亮的无缝一体式脑壳，你对此非常满意，把他的旧脑壳改成台灯放在了冥想室。", ifbranch),
      Aside("前所未有的满足感充盈着你的内心，托尼抱住你，向你解释，这种感觉叫做幸福。", ifbranch),
      {
        id: "be",
        type: "end",
        message: `<span style="color: yellow">Happy Ending</span><br>你保全了所有人的性命`,
        if: ifbranch,
      }
    ]
  })(),
  // Choice("branch39", ["投降与主人，也许他会放你一马。", "冲上前，准备掌握主动权！", "无动于衷，静等死亡"]),
])