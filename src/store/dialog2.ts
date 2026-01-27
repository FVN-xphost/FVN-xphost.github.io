import { readable } from "svelte/store";

export const dialogInstance = readable<any[]>([
  {
    name: "",
    avatar: "",
    message: "汽车颠簸了一下。",
  },
  {
    name: "",
    avatar: "",
    message: "车内仪表盘亮着光，油量即将见底。",
  },
  {
    name: "",
    avatar: "",
    message:
      "我已经连续开了六个小时的车，但这点代价比起年末狂欢聚会算不上什么。",
  },
  {
    name: "",
    avatar: "",
    message: "别误会，我不是在去往聚会的路上。",
  },
  {
    name: "",
    avatar: "",
    message: "聚会是我的出发地。",
  },
  {
    name: "",
    avatar: "",
    message:
      "在喝掉几杯宝石波特之后，我又勇敢地徜徉在威士忌和龙舌兰的酒池，并因此错过了航班。",
  },
  {
    name: '<span style="color: red">%name</span>',
    avatar: "",
    message: "我想我还能再喝几杯。",
  },
  {
    name: "",
    avatar: "",
    message:
      "在口干舌燥的时候，谁会一杯口感丰富的利口酒，一杯冰镇过的波尔多甜，也许该再来一点金酒……",
  },
  {
    name: "",
    avatar: "",
    message: "……（呕吐声）",
  },
  {
    name: '<span style="color: red">%name</span>',
    avatar: "",
    message: "该死，这可是在高速路上，如果我刚刚吐的时候迎面撞上什么……",
  },
  {
    name: "",
    avatar: "",
    message: "……（呕吐声）",
  },
  {
    name: "",
    avatar: "",
    message: "对于死亡的恐惧令大脑变得清醒。",
  },
  {
    name: "",
    avatar: "",
    message: "我努力在呕吐时也睁着眼，眼泪被挤了出来。",
  },
  {
    name: "",
    avatar: "",
    message: "感觉糟透了。",
  },
  {
    name: "",
    avatar: "",
    message:
      "方向盘和我的手背上全是黏糊糊的呕吐物，不用看也知道，鞋子完蛋了，衬衫正湿淋淋地贴在身上。",
  },
  {
    name: "",
    avatar: "",
    message:
      "我感觉胸口的毛都变得一缕一缕的，被呕吐物打湿，而且嗓子火辣辣的疼。",
  },
  {
    name: "",
    avatar: "",
    message: "还有更坏的消息。",
  },
  {
    name: "",
    avatar: "",
    message: "被秽物掩盖的仪表盘上，油量灯顽强地闪烁着警示我，它已经不行了。",
  },
  {
    name: "",
    avatar: "",
    message: "我也是。",
  },
  {
    name: "",
    avatar: "",
    message: "从什么时候开始，路边的灯光变得越来越少的？",
  },
  {
    name: "",
    avatar: "",
    message: "取而代之的是越来越密集的雪花。",
  },
  {
    name: "",
    avatar: "",
    message:
      "起初只是稀疏的白色斑点，不知什么时候，车窗外已经成了狂舞的雪幕。狂风呼啸着吹来石子杂物撞击车身，叮叮当当。",
  },
  {
    name: "",
    avatar: "",
    message:
      "我已经连续开了六个小时的车，但这点代价比起年末狂欢聚会算不上什么。",
  },
  {
    name: "",
    avatar: "",
    message:
      "不，那些都算不上最坏的消息，清醒过来的脑子冰冷地说，你走错路了，这边是通往林区的路，你根本没法回到另一个城市温暖的家中，你现在离家12小时车程，还有拖车费可不在保险赔付范围……对了，你的手机呢？",
  },
  {
    name: '<span style="color: red">%name</span>',
    avatar: "",
    message: "我的手机呢？",
  },
  {
    name: "",
    avatar: "",
    message: "我慌乱地回头看了一眼车内，空荡荡的。",
  },
  {
    name: "",
    avatar: "",
    message: "我连外套都扔在聚会现场了。",
  },
  {
    name: "",
    avatar: "",
    message: "一股寒意沿着我的尾椎爬到脑髓。",
  },
  {
    name: "",
    avatar: "",
    message: "再过一会没油了，空调就会停。",
  },
  {
    name: "",
    avatar: "",
    message:
      "是的，空调会停，那又怎样？你是体毛旺盛的野兽不需要那个。大脑的反应相当迟缓，就像被酒精浸泡过一样。",
  },
  {
    name: "",
    avatar: "",
    message:
      "外面有-20℃，空调一停，车内的温度会迅速降低，我会被冻成一尊冰雕。也许要等到明年春天，伐木场工人返回时才会被人发现。",
  },
  {
    name: "",
    avatar: "",
    message: "车内仪表盘亮着光，油量即将见底。",
  },
  {
    name: "",
    avatar: "",
    message:
      "我已经连续开了六个小时的车，但这点代价比起年末狂欢聚会算不上什么。",
  },
  {
    name: '<span style="color: purple">内心</span>',
    avatar: "",
    message:
      "看看你身上闪亮的皮毛好吗？大脑对我说，专心开车，野兽，想想你威风的祖先，低温对你来说不算什么。",
  },
  {
    name: "",
    avatar: "",
    message: "理论上是这样的，理论上。",
  },
  {
    name: "",
    avatar: "",
    message: "什么？大脑感到迷惑。",
  },
  {
    name: "",
    avatar: "",
    message:
      "为了让皮毛更闪亮柔顺一些，我做了秋冬季毫毛清理套餐，现在我光洁闪亮的护毛下一根内层绒毛都没有。",
  },
  {
    name: '<span style="color: red">%name</span>',
    avatar: "",
    message: "你个白痴！",
  },
  {
    name: '<span style="color: red">%name</span>',
    avatar: "",
    message: "当初是你诱惑我买的！甚至都没等到折扣价！",
  },
  {
    name: '<span style="color: purple">内心</span>',
    avatar: "",
    message: "那是因为聚会第二天就要开始，而折扣价在下周！",
  },
  {
    name: '<span style="color: red">%name</span>',
    avatar: "",
    message: "你看，你承认当初自己诱惑我了。",
  },
  {
    name: "",
    avatar: "",
    message: "（嘟——嘟——嘟——）油量表不在闪烁，转而发出警示音。",
  },
  {
    name: '<span style="color: purple">内心</span>',
    avatar: "",
    message: "我建议你关闭座椅加热，现在就停下来，还能多开一会空调。",
  },
  {
    name: '<span style="color: red">%name</span>',
    avatar: "",
    message: "闭嘴。",
  },
  {
    name: '<span style="color: purple">内心</span>',
    avatar: "",
    message:
      "据说冻死的人会因为失温而看到幻觉，死去反倒感觉很热，甚至脱掉衣服。",
  },
  {
    name: '<span style="color: red">%name</span>',
    avatar: "",
    message: "闭嘴。",
  },
  {
    name: '<span style="color: purple">内心</span>',
    avatar: "",
    message: "假如往油箱里撒尿，会让底油浮上来吗？这样你可以同时解决两个问题。",
  },
  {
    name: '<span style="color: red">%name</span>',
    avatar: "",
    message: "闭嘴。闭嘴。闭嘴。",
  },
  {
    name: "",
    avatar: "",
    message: "……",
  },
  {
    name: "",
    avatar: "",
    message: "…………",
  },
  {
    name: '<span style="color: purple">内心</span>',
    avatar: "",
    message: "前面有灯？那是休息区！你简直是个天才！你怎么知道这里有休息区的？",
  },
  {
    name: '<span style="color: red">%name</span>',
    avatar: "",
    message: "隐约记得。",
  },
  {
    name: '<span style="color: purple">内心</span>',
    avatar: "",
    message: "真棒！快开过去，你都快尿裤子了。",
  },
]);
