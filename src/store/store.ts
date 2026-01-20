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
export const branchs = writable({
  branch1: "",
  branch2: "",
});
export const saveInstance = readable([
  {
    name: "%name",
    avatar: "",
    message: "你好，我是%name，很高兴你来玩这个demo小游戏！",
  },
  {
    name: "%name",
    avatar: "",
    message: "各位可以自行点击下面的所有按钮，目前都做好啦！",
  },
  {
    name: "%name",
    avatar: "",
    message:
      '此次文字可以<b>粗</b><i>斜体</i><u>下划线</u><s>删除线</s>以及<b><i><u><s>嵌套</s></u></i></b>，以及调整<span style="font-size: 20px; color: red;">大小和颜色</span>！',
  },
  {
    name: "%name",
    avatar: "",
    message:
      "存档即为将数据文件导出到本地文件，随后，在下一次进入游戏时，自动导入存档文件！",
  },
  {
    name: "%name",
    avatar: "",
    message:
      "如果你但凡没有对任何一个存档进行储存的话，存档将保存在你的内存中，如果在此期间你要是关闭了游戏，存档将丢失！",
  },
  {
    name: "%name",
    avatar: "",
    message: "随后，让我们来看看人物立绘是怎么动的吧！",
  },
  {
    name: "%name",
    avatar: "",
    message: "在我这行剧情触发时，人物将左右跑动！",
  },
  {
    name: "%name",
    avatar: "",
    message: "在我这行剧情触发时，人物将镜像翻转！",
  },
  {
    name: "%name",
    avatar: "",
    message: "在我这行剧情触发时，人物将变大1.2倍！",
  },
  {
    name: "%name",
    avatar: "",
    message: "在我这行剧情触发时，人物将开始振动！",
  },
  {
    name: "%name",
    avatar: "",
    message: "在我这行剧情触发时，画廊1将解锁！",
  },
  {
    name: "%name",
    avatar: "",
    message: "在我这行剧情触发时，将播放一段音效！",
  },
  {
    name: "%name",
    avatar: "",
    message: "在我这行剧情触发时，将播放一段音乐！",
  },
  {
    name: "%name",
    avatar: "",
    message:
      "所有画廊解锁都是永久性解锁的！一旦解锁直接放入游戏本地目录，基本上不会存在你忘记存档了画廊就没解锁。。",
  },
  {
    name: "%name",
    avatar: "",
    message:
      "接下来会循环生成【10个由100个啊】组成的片段！可以点击下列快进按钮进行快进！",
  },
  ...new Array(10).fill(null).map((_, index) => ({
    name: "%name",
    avatar: "",
    message: index + "啊".repeat(100),
  })),
  {
    name: "%name",
    avatar: "",
    message:
      "接下来是选择分支结构！在过掉本剧情之后，会出现两个分支！<br>两个分支均不会影响剧情，但是会影响我们的下一句对话！<br>比如说我问你：你最喜欢做什么运动？",
  },
  {
    type: "choice",
    id: "branch1",
    choice: ["跑步", "游泳", "打篮球"],
  },
  {
    name: "%name",
    avatar: "",
    message:
      "每一个分支都会影响最终结局，比如说上述你的选择我将会记住！让我想想，上一步你选择的是%branch1！我猜对了吗？",
  },
  {
    name: "%name",
    avatar: "",
    message:
      "还有另外一种情况，就是根据你选择的内容输出一句完整的话，比如我现在问你：<br>你今天喝了牛奶吗？",
  },
  {
    type: "choice",
    id: "branch2",
    choice: ["喝了", "没喝", "你猜"],
  },
  {
    name: "%name",
    if: [
      {
        key: "branch2",
        value: "喝了",
      },
    ],
    avatar: "",
    message: "哇，牛奶很香很好喝吧！我觉得也是。",
  },
  {
    name: "%name",
    if: [
      {
        key: "branch2",
        value: "没喝",
      },
    ],
    avatar: "",
    message: "天哪，你今天居然没喝牛奶！快去喝一杯吧！",
  },
  {
    name: "%name",
    if: [
      {
        key: "branch2",
        value: "你猜",
      },
    ],
    avatar: "",
    message: "我猜？我才不想猜呢！一看你就是没有喝啦……",
  },
  {
    name: "%name",
    avatar: "",
    message: "下面演示一下场景切换！接下来邀请我的朋友：小虎，来为各位作解释！",
  },
  {
    name: "小虎",
    avatar: "",
    message: "Hi，我是小虎！",
  },
]);
