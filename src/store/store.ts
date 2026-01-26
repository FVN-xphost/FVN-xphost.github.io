import { writable, readable } from "svelte/store";
import Gallery1 from "../assets/gallery/gallery1.png";
import Gallery2 from "../assets/gallery/gallery2.png";
import Gallery3 from "../assets/gallery/gallery3.png";
import Gallery4 from "../assets/gallery/gallery4.png";
export const saveData = writable({});
export const boardText = writable("");
export const mounted = writable(false);
export const galleryPage = writable(1);
export const galleryLock = readable([
  {
    id: "1",
    images: [Gallery1, Gallery2, Gallery3, Gallery4],
  },
  {
    id: "2",
    images: [Gallery1, Gallery2, Gallery3, Gallery4],
  },
  {
    id: "3",
    images: [Gallery1, Gallery2, Gallery3, Gallery4],
  },
  {
    id: "4",
    images: [Gallery1, Gallery2, Gallery3, Gallery4],
  },
  {
    id: "5",
    images: [Gallery1, Gallery2, Gallery3, Gallery4],
  },
  {
    id: "6",
    images: [Gallery1, Gallery2, Gallery3, Gallery4],
  },
  {
    id: "7",
    images: [Gallery1, Gallery2, Gallery3, Gallery4],
  },
  {
    id: "8",
    images: [Gallery2, Gallery3, Gallery4, Gallery1],
  },
  {
    id: "9",
    images: [Gallery3, Gallery4, Gallery1, Gallery2],
  },
  {
    id: "10",
    images: [Gallery4, Gallery1, Gallery2, Gallery3],
  },
]);
interface IfInterface {
  key: string;
  value: string | ((branch_value: string) => boolean);
}
interface ScoreInterface {
  targetId: string;
  action: (branch: string, rawValue: string) => string;
}
interface DialogInterface {
  type?: string;
  id?: string;
  name?: string;
  avatar?: string;
  message?: string;
  choice?: Array<string>;
  score?: ScoreInterface;
  if?: Array<IfInterface>;
}
function Normal(
  name: string = "",
  avatar: string = "",
  message: string,
  ifbranch: IfInterface[] | undefined = undefined,
): DialogInterface {
  return {
    name: name,
    avatar: avatar,
    message: message,
    if: ifbranch,
  };
}
function Aside(
  message: string,
  ifbranch: IfInterface[] | undefined = undefined,
) {
  return Normal("", "", message, ifbranch);
}
function George(
  message: string,
  ifbranch: IfInterface[] | undefined = undefined,
) {
  return Normal(
    `<span style="color: skyblue;">%name</span>`,
    "",
    message,
    ifbranch,
  );
}
function Admin(
  message: string,
  ifbranch: IfInterface[] | undefined = undefined,
) {
  return Normal(
    `<span style="color: lightgreen;">管理员</span>`,
    "",
    message,
    ifbranch,
  );
}
function Qm(message: string, ifbranch: IfInterface[] | undefined = undefined) {
  return Normal(
    `<span style="color: darkgray">??</span>`,
    "",
    message,
    ifbranch,
  );
}
function Tony(
  message: string,
  ifbranch: IfInterface[] | undefined = undefined,
) {
  return Normal(
    `<span style="color: orange">托尼</span>`,
    "",
    message,
    ifbranch,
  );
}
function Wildebeest(
  message: string,
  ifbranch: IfInterface[] | undefined = undefined,
) {
  return Normal(
    `<span style="color: lightcoral">角马</span>`,
    "",
    message,
    ifbranch,
  );
}
const ifbranch1: IfInterface[] = [
  {
    key: "branch1",
    value: "或者你先告诉我，你的名字？",
  },
];
function Choice(id: string, choice: string[]): DialogInterface {
  return {
    type: "choice",
    id: id,
    choice: choice,
  };
}
export const dialogInstance = readable<DialogInterface[]>([
  Aside(
    "一个方正的房间。狭小，几乎推开门就会撞到桌子。金属桌腿和地板是一体的，典型的空间站早期风格，“为了预防可能的撞击”。除此之外，房间里只有档案柜，管理员，档案柜。他们沉默着。",
  ),
  Aside(
    "冷色的日光灯照在管理员的鬃毛上，在桌面上投下了巨大的阴影。这会离开门已经过去了几秒，他停笔，抬头看了看，稍稍坐直，身下的折叠椅发出不堪重负的噪音。",
  ),
  Admin("姓名？"),
  Choice("branch1", ["直接告诉他", "或者你先告诉我，你的名字？"]),
  Admin("什么？", ifbranch1),
  Qm("告诉我，你的名字。", ifbranch1),
  Admin("没有这个流程，你到底办不办这个手续？", ifbranch1),
  Qm("办。我只是……突然想关心你？", ifbranch1),
  Admin("关心我？", ifbranch1),
  Qm("他皱着眉，好像你说了什么高深的难以理解的术语", ifbranch1),
  Admin("我只需要你回答问题。", ifbranch1),
  Qm("好的。", ifbranch1),
  Admin("名字？", ifbranch1),
  George("%name。"),
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
  Aside(
    "你很平静。看吧，从头到脚都可以在他眼前展示。在过去10年里，每个人听说你的工作后都会忍不住这样看。",
  ),
  Admin("你就是那个%name？"),
  Choice("branch2", [
    "如果是指在废品分类中心工作的话，那就是我。",
    "对，我就是那个%name，和其他%name不一样的%name。哪怕两个互不相干的人，只要说“那个%name”，他们两个也会一起默契地点头。",
  ]),
  Aside("他微不可察地点了点头。"),
  Admin("在这里签字。"),
  Aside("一张纸被递了过来，你潦草地签好了名字。"), // 播放 签字声，无需阻止线程。
  Admin("看镜头，看这里。"),
  Aside("他按动了某处开关，一个照相机从边缘升上来。"),
  George("还要拍照？"),
  // 闪光声，快门声
  Admin("别说话，重拍。"),
  // 闪光声，快门声
  Admin("好了。出门左拐走到头，看到两扇大门推开进去。"),
  // 切换场景：走廊
  Aside("走廊像一条苍白的喉咙。"),
  // 托尼走上来
  Tony("%name，你还好吧？"),
  Choice("branch2", [
    "还好，只是没想到还要照相。",
    "不太好。我感觉自己要被闪光灯谋杀了。",
  ]),
  Tony(
    "流程罢了，手续顺利？我特意和同事打了招呼，他处理得快极了。我可见过这种事上拖拖拉拉能有多糟心。",
  ),
  Aside("你忍不住地去舔自己的鼻子。"),
  Tony(
    "我是说，节哀。我知道这很难接受，但查理叔叔走的很安详，他最后在垃圾传送带上拽下了一个蛋，几乎完好。天知道现在的人在想什么，这种东西都能出现在回收站，简直是道德败坏……",
  ),
  George("托尼，开始流程吧。我……我不想听那个。"),
  Tony("好的，好的，我明白。"),
  Aside(
    "托尼走到告别厅的大门前，你和他从小一起长大，也一直知道他在这里工作，但今天还是第一次看到他这幅打扮。",
  ),
  Aside("大门被拉开，门轴发出摩擦的声音。"),
  // 切换场景：告别厅
  Tony("那么，你和逝者的关系？"),
  Choice("branch2", [
    "又来？就非要做这种事吗？",
    "刚刚在那个办公室已经问过我一遍了。",
  ]),
  Aside("他耸了耸肩膀，给了我一个无奈的表情，“一种流程”。"),
  Tony("那么，你和逝者的关系？"),
  George("叔侄。"),
  Tony("在场诸位有异议吗？"),
  Aside(
    "整个告别厅里只有我和托尼。我不知道为什么会有这样的流程，也不想知道。我盯着虚空中的某一处，鼻子却实时提醒着我，这里是弥漫着消毒水味的告别厅。",
  ),
  Tony(
    "今天我们为一位逝者哀悼，为一位Am-ω-7太空港的驻守者哀悼，他完成了他的工作，还清了全部的债务，他是一名标准的、合格的……",
  ),
  Tony("%name？%name？"),
  Aside(
    "我听到有人在叫我的名字，回过神，托尼目光关切地看着我。我想，如果不是流程，他大概会下来给我一个拥抱。",
  ),
  George("抱歉……"),
  Tony("没事，该下一个环节了。"),
  Tony(
    "确认一下查理的遗产。他的遗产不多，一个还剩15年许可的储物柜兼1.74m可折叠式休息区，一点信用点存款，还有一个……蛋？那种情况下都能把它拽下来，唔，我都不知道该怎么说了。总之先签字吧。",
  ),
  // 签字声
  Tony("最后一个流程，啧。"),
  George("怎么了？"),
  Tony("我们可能有一点小麻烦，但相信我，会过去的，很简单。"),
  Aside("托尼看着我的眼睛，轻轻地推着我的手臂，让我在座位上坐好。"),
  Tony("请死者家属致辞。"),
  Aside("我站起身，准备走到讲台上。"),
  Tony("不，%name，你先在那边等一等。这个环节需要父母、妻子或者儿女。"),
  George("托尼？你在搞什么？"),
  Tony("流程。该死的流程就是这样的。请逝者家属致辞。请死者家属致辞。"),
  George(
    "这里唯一的家属就是我！而我要看你对着空屋子喊“请家属致辞”？这太荒唐了，荒唐！",
  ),
  Tony(
    "我……我真的没有办法，这就是流程。我可以站在这里和你解释，从现在解释到明天都可以。但是我不能不说那句话，也不能让你上台，我的工作就是这是这样。",
  ),
  George(
    "查理叔叔根本就没结过婚，他的父母早不在了，我就是他唯一的亲人，他也是我唯一的亲人！怎么才能取消这该死的流程？！",
  ),
  Aside("“唉。”托尼长长地叹了一口气，用那种熟悉的“我就知道”的眼神看着我。"),
  Tony("证明查理没有父母、妻子或子女。"),
  George("需要什么证明？"),
  Tony("没法证明。"),
  George("为什么？"),
  Tony("证明查理没有父母、妻子或子女。"),
  Tony(
    "因为大家都……你明白吗？有出生证明、结婚证明、离婚证明、工作场所出入证明，但不会专门有一份证明去证明你什么关系都没有。总之，等我喊三遍，确认他们未到场之后，你就可以签字走人了。前面的手续都非常顺利，这是最后一步。",
  ),
  George(
    "你是说，按流程，宁可喊三遍根本不存在的人，我也没法在我叔叔的葬礼上说什么？",
  ),
  Tony("是的。"),
  Aside(
    "熟悉的眼神。托尼看着我，我想我这样的表情他已经看过了很多很多次，以至于我们都相互了解对方会干些什么。",
  ),
  Tony("别做傻事。"),
  George("我什么都不做，那才是傻事。"),
  Tony("等等。等一等。只要你愿意等一小段时间，那就……"),
  George("我愿意。"),
  Tony(
    "那就等365天+178天+285天+974天后，只要没人来认领其他亲属的身份，你就可以凭遗产接受人的身份开始葬礼悼词了。",
  ),
  George("如果有人来怎么办？"),
  Tony(
    "骗子吗？他们不会来的，想要确认身份至少得开5到15份证明，等开完，你早已经签完字了。而且他们来干嘛？骗一个在葬礼上致辞的机会？除了你没人那么干。",
  ),
  Choice("branch2", [
    "谢谢，我真的非常感谢你……",
    "伙计，我以后会给你换一个闪闪发亮的无缝一体式头套，我说真的，无论多少钱我都要买给你。",
  ]),
  Aside(
    "我可能要哭了，鼻子在发酸，我想我刚刚的样子可能像是在胡闹，我也不知道为什么突然难以忍受，明明这一切马上就要过去……",
  ),
  Tony(
    "别来这套，这是我应该做的。我没什么可劝你的，这种事不是说几句话就能过去的，不管如何，你得保持健康。",
  ),
  Tony("%name？你在听吗？"),
  // 切换场景：走廊
  Aside(
    "我几乎想不起来我是怎么走出门的。难怪托尼从来不提他的工作，如果他每天面对的都是这种事，那么我也会什么都不说，一到公共休息区就来三管无酒精麻醉剂。",
  ),
  Tony("等等，%name！"),
  Aside("大门被推开，发出咔吱咔吱的响声。"),
  Aside(
    "托尼在身后喊我，我回头看去。他怀里抱着一条巨大的乳白色的蛋，蛋壳上闪着牙齿一样的光泽。托尼甚至没法一只手托住它。他双手抱着蛋，艰难地用肩膀顶开大门。",
  ),
  Tony(
    "这个算是HB-c1，特殊活体宠物，按照规定……别管那些了，总之你可以先把这个带走。其他什么也别放在心上，就算不走完流程你也可以继续在查理的位置睡，根本没人管这种事。",
  ),
  Choice("branch2", ["谢谢你，托尼", "亲吻托尼"]),
  Aside("我抱住了他，那枚蛋隔在我俩中间，撞在托尼坚硬的身体上发出一声脆响。"),
  // 切换场景：宿舍床铺
  Aside(
    "最终，你回到休息区，带着饥饿、疲惫还有些陌生的情绪，你并不愿意去确认那到底是什么。",
  ),
  Aside("蛋也没事，它完整地被你带回来了。"),
  Aside(
    "休息区仍是你熟悉的样子，紧贴墙壁的垂直货架，上面摆了许多稀奇的小玩意——都是从垃圾传送带上捡回来的。",
  ),
  Aside("把货架沿着滑轨抬上去，剩下的空间才是你真正的家——一张床铺。"),
  Aside(
    "在查理捡到你的前几年，他和你共享这处休息区；在你能承担工作任务之后，你们两个就轮流使用这块区域了——那很艰难，不过你们积累一笔不错的信用点，如果一切按部就班，再过几年，查理或许会退休，或许会去卫星上养老，或许……",
  ),
  Aside(
    "而现在，你的目光看向那枚蛋，它没被扔进货架，而被你放在了床垫上，你下意识地给它找了一个柔软的地方——你还没意识到，不过这种想法已经偷偷地在你脑子里盘恒一阵子——是不是该像查理收养你一样孵化这枚蛋呢？",
  ),
  // 播放音效：哗啦啦嘭！
  Aside("查理的邻居回来了，一位角马，查理也是。"),
  Aside(
    "准确地说，整个垃圾分类回收中心只有你不是角马，你是%name，垃圾分类回收中心的鬣狗%name。",
  ),
  George("你好！"),
  Aside(
    "你稍有一点紧张，他的休息时间和你不同，这可能是你们第二次或者第三次见面？",
  ),
  Wildebeest("好。"),
  George("从今天起，这个休息区就只有我了。"),
  Wildebeest("嗯。"),
  George("因为查理死了。"),
  Wildebeest("哦？噢，我想起来了，是这么回事。"),
  George("你们之前相处的怎么样？"),
  Aside("（巨大的低沉的机械运作噪声）"),
  Aside("你和邻居的聊天就像被按下暂停键。"),
  Aside(
    "这上面是太空港的装卸仓，时不时就会响起这样的噪声，但这小小的代价也换来了巨大的收益，你们有更大的空间，甚至还有一列升降货架。",
  ),
  Aside(
    "角马的目光打量着你，你尴尬地微笑着，稍稍担心会不会露出了太多的牙齿，那会让你看起来不太友善。",
  ),
  Aside("你好想舔自己的鼻子。"),
  Aside("……"),
  Aside("噪声过去了。"),
  Wildebeest("不，我和查理不熟。"),
  Aside("他转过身，开始换下工作服，无意再与你交谈。你慢慢地坐下去，床铺很软。"),
  Aside("嘭！"), //（播放重物摔落声，不阻止线程）
  Aside(
    "那枚蛋从床铺上滚到地上，细细纹路出现在它的表面，越来越大，就像是裂缝。",
  ),
  Aside("是的，它就是裂缝。蛋摔坏了。"),
  Wildebeest("唔，我离它可很远。"),
  Aside("角马说着，他已经换好了衣服。"),
  Wildebeest("我要去公共区，再见。"),
  Aside("他飞快地离开了。"),
  George("再见。"),
  Aside("角马的脚步声渐远。"),
  Aside("再见个屁。"),
  Aside("再他妈的见。"),
  Aside(
    "你几乎是从床铺上弹起来，狠狠咬在对面的货架上，牙齿和金属发出酸涩的嘎吱声，本能让你疯狂地晃动脖子，甩动头部，切割想象中的猎物。",
  ),
  Aside(
    "你的手攥冰冷的金属滑轨，就像按着濒死的躯体，兴奋感化成一股热流沿着脊椎爬行到脑子里，你压抑不住的、从胸腔深处发出的闷哼在狭小的休息区内撞击回荡，又被新一阵的机器噪声淹没。",
  ),
  // 播放：机器噪声
  Aside("最终你用尽所有的力气在金属边框留下一个浅浅的痕迹。"),
  Aside("你筋疲力尽。"),
  George("抹布，抹布，抹布……"),
  Aside(
    "货架堆满了曾经的“宝贝”，损坏的内窥镜、备用维生导管、卵形钳、十字滑块联轴器……终于，你找到了该死的抹布，准备擦去刚刚甩的到处都是的口水，还有蛋液，那么大的一个蛋，一定淌的满地都是……等等？",
  ),
  Aside("地面上没有蛋液。"),
  Aside("没有蛋液。"),
  Aside(
    "你蹲下身，看着那枚蛋，指尖摩挲这裂缝的边缘，光滑，甚至有微微的弧度。你用力沿着裂缝一掰——",
  ),
  Aside("咔！"), // 播放：盒子打开的声音（不阻止线程）
  Aside(
    "蛋壳顺滑地分成两半，里面空空如也。没有蛋清，没有蛋黄，没有任何活体组织应有的痕迹。内壁光滑如镜，闪着陶瓷的光泽。",
  ),
  Aside(
    "那道裂缝是一个精心设计的开合口，巧妙地做成了蛋壳碎裂的模样，里面严丝合缝的卡榫在刚才的撞击下刚好弹开。",
  ),
  Aside("躺在两半蛋壳中间的，是一张材质奇特的卡片。"),
  Aside(
    "它很薄，却异常坚韧，像是某种合成织物，又带着一点生物材质的柔韧。你小心地把它翻转过来——",
  ),
]);
