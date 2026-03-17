import { BeautyProfile } from "../types/GameTypes";

export const MAINLINE_BEAUTIES: BeautyProfile[] = [
  {
    id: "hiyori",
    source: "mainline",
    rank: "C",
    stageId: 1,
    name: "绯音",
    title: "净火咏叹者",
    profile: "舞台歌姬，被渣男诱入黑雾剧场后黑化。",
    skill: {
      name: "焰羽扫射",
      description: "每 10 秒放出三束焰羽贯穿弹，清掉一整条路径上的怪物。",
      cooldownSeconds: 10
    },
    accent: "#ff8e61",
    visualVariant: "idol-flare",
    unlockRule: "通关第 1 章净化解锁",
    webArtKey: "hiyori"
  },
  {
    id: "serin",
    source: "mainline",
    rank: "B",
    stageId: 2,
    name: "澄澈",
    title: "霜镜审裁者",
    profile: "冰穹巡礼的守护者，净化后可冻结全场敌人。",
    skill: {
      name: "冰镜领域",
      description: "每 11 秒冻结全场敌人并在冻结结束时追加一次冰爆。",
      cooldownSeconds: 11
    },
    accent: "#7eddf8",
    visualVariant: "frost-prism",
    unlockRule: "通关第 2 章净化解锁",
    webArtKey: "serin"
  },
  {
    id: "yelan",
    source: "mainline",
    rank: "B",
    stageId: 3,
    name: "夜岚",
    title: "雷辉裁定者",
    profile: "雷落穹塔的审判者，净化后会降下连锁雷击。",
    skill: {
      name: "雷链裁决",
      description: "每 9 秒锁定多名敌人，快速降下连锁雷击处理精英与成群怪。",
      cooldownSeconds: 9
    },
    accent: "#ffe48a",
    visualVariant: "thunder-lance",
    unlockRule: "通关第 3 章净化解锁",
    webArtKey: "yelan"
  },
  {
    id: "mingsha",
    source: "mainline",
    rank: "A",
    stageId: 4,
    name: "明纱",
    title: "樱雾祓御巫",
    profile: "神社巫女，被黑雾祭坛扭曲后化作樱刃风暴。",
    skill: {
      name: "樱刃风暴",
      description: "每 10 秒抛出多枚樱刃，形成高穿透扇形斩击。",
      cooldownSeconds: 10
    },
    accent: "#ff9caf",
    visualVariant: "shrine-fan",
    unlockRule: "通关第 4 章净化解锁",
    webArtKey: "mingsha"
  },
  {
    id: "lanwei",
    source: "mainline",
    rank: "A",
    stageId: 5,
    name: "岚薇",
    title: "蒸汽舰港领航姬",
    profile: "蒸汽船坞的航道指挥官，净化后用高压蒸汽清扫前场。",
    skill: {
      name: "蒸汽爆缸",
      description: "每 12 秒向前引爆高压蒸汽，对大片敌人造成伤害并减速。",
      cooldownSeconds: 12
    },
    accent: "#eab471",
    visualVariant: "steam-captain",
    unlockRule: "通关第 5 章净化解锁",
    webArtKey: "lanwei"
  },
  {
    id: "shali",
    source: "mainline",
    rank: "A",
    stageId: 6,
    name: "砂璃",
    title: "流砂星痕猎手",
    profile: "砂海遗都的游侠，净化后会布置迟缓流砂陷阱。",
    skill: {
      name: "流砂陷阱",
      description: "每 11 秒在敌群前方生成流砂区，持续减速并造成磨血伤害。",
      cooldownSeconds: 11
    },
    accent: "#ffd68d",
    visualVariant: "desert-veil",
    unlockRule: "通关第 6 章净化解锁",
    webArtKey: "shali"
  },
  {
    id: "yuege",
    source: "mainline",
    rank: "A",
    stageId: 7,
    name: "月歌",
    title: "月港谣姬",
    profile: "歌剧院的首席谣姬，净化后会让月刃来回切割怪群。",
    skill: {
      name: "弦月回旋",
      description: "每 9.5 秒放出两道回旋月刃，适合处理中后排怪群。",
      cooldownSeconds: 9.5
    },
    accent: "#ffb6a1",
    visualVariant: "opera-crescent",
    unlockRule: "通关第 7 章净化解锁",
    webArtKey: "yuege"
  },
  {
    id: "molan",
    source: "mainline",
    rank: "S",
    stageId: 8,
    name: "沫澜",
    title: "深渊潮汐司书",
    profile: "深海研究所的潮汐司书，净化后能以潮汐横扫大片敌人。",
    skill: {
      name: "潮汐冲刷",
      description: "每 12 秒掀起一轮潮汐波，横扫前方大片敌人并压低密集怪潮。",
      cooldownSeconds: 12
    },
    accent: "#86e7ee",
    visualVariant: "abyss-tide",
    unlockRule: "通关第 8 章净化解锁",
    webArtKey: "molan"
  },
  {
    id: "xingkui",
    source: "mainline",
    rank: "S",
    stageId: 9,
    name: "星葵",
    title: "星孢园艺使",
    profile: "被寄生花房吞没的园艺使，净化后会在上半场持续轰炸。",
    skill: {
      name: "星孢花雨",
      description: "每 10.5 秒从上空播撒星孢爆点，对大片怪群进行持续轰击。",
      cooldownSeconds: 10.5
    },
    accent: "#c4f88a",
    visualVariant: "flora-spore",
    unlockRule: "通关第 9 章净化解锁",
    webArtKey: "xingkui"
  },
  {
    id: "cangya",
    source: "mainline",
    rank: "S",
    stageId: 10,
    name: "苍雅",
    title: "圣城执光者",
    profile: "终局章节的圣城执光者，净化后会降下圣辉护域。",
    skill: {
      name: "圣辉屏障",
      description: "每 13 秒恢复基地并展开护盾，同时惩戒最前方敌人。",
      cooldownSeconds: 13
    },
    accent: "#dbe7ff",
    visualVariant: "sky-crown",
    unlockRule: "通关第 10 章净化解锁",
    webArtKey: "cangya"
  }
];

export const SUMMON_BEAUTIES: BeautyProfile[] = [
  {
    id: "qinglu",
    source: "summon",
    rank: "C",
    name: "晴露",
    title: "晨风花匠",
    profile: "从风庭苗圃逃出的少女，擅长用花露弹清掉前线小怪。",
    skill: {
      name: "花露散射",
      description: "每 9 秒发射四枚花露弹，对前方扇形区域造成多段伤害。",
      cooldownSeconds: 9
    },
    accent: "#8ef1c2",
    visualVariant: "petal-bloom",
    unlockRule: "角色招募获得"
  },
  {
    id: "taoxi",
    source: "summon",
    rank: "C",
    name: "桃汐",
    title: "软潮泡泡师",
    profile: "会用泡阵拖慢冲得最急的敌人。",
    skill: {
      name: "潮泡禁域",
      description: "每 10 秒在前场生成泡阵，持续减速并造成区域伤害。",
      cooldownSeconds: 10
    },
    accent: "#ffb4d0",
    visualVariant: "pearl-tide",
    unlockRule: "角色招募获得"
  },
  {
    id: "yunmi",
    source: "summon",
    rank: "B",
    name: "云弥",
    title: "巡云猎手",
    profile: "擅长快速点杀高威胁单位的巡空射手。",
    skill: {
      name: "追光羽针",
      description: "每 8.5 秒锁定多名敌人，发射追踪羽针点杀目标。",
      cooldownSeconds: 8.5
    },
    accent: "#97e6ff",
    visualVariant: "feather-dart",
    unlockRule: "角色招募获得"
  },
  {
    id: "luoye",
    source: "summon",
    rank: "B",
    name: "洛夜",
    title: "影幕裁缝",
    profile: "能让冲在最前排的敌人瞬间停滞。",
    skill: {
      name: "暮影禁锢",
      description: "每 10.5 秒束缚多名靠前目标，并追加一次影伤。",
      cooldownSeconds: 10.5
    },
    accent: "#c4b8ff",
    visualVariant: "shadow-tailor",
    unlockRule: "角色招募获得"
  },
  {
    id: "qinyao",
    source: "summon",
    rank: "B",
    name: "琴瑶",
    title: "和声补给官",
    profile: "会恢复防线，并空投爆裂弹支援战场。",
    skill: {
      name: "和声投送",
      description: "每 11 秒恢复基地并空投两枚爆裂弹清扫前场。",
      cooldownSeconds: 11
    },
    accent: "#ffd38a",
    visualVariant: "lyra-arc",
    unlockRule: "角色招募获得"
  },
  {
    id: "ruolan",
    source: "summon",
    rank: "A",
    name: "若澜",
    title: "棱镜魔装使",
    profile: "会发出高能棱镜射线贯穿整条怪潮。",
    skill: {
      name: "棱镜射界",
      description: "每 9.5 秒放出一道高能棱镜射线，贯穿并灼烧前方路径。",
      cooldownSeconds: 9.5
    },
    accent: "#7de6ff",
    visualVariant: "prism-mage",
    unlockRule: "角色招募获得"
  },
  {
    id: "aisha",
    source: "summon",
    rank: "A",
    name: "艾纱",
    title: "星轨圣职者",
    profile: "偏单体惩戒型的高阶辅佐。",
    skill: {
      name: "星轨惩戒",
      description: "每 10 秒锁定多名敌人，降下高压星轨圣光。",
      cooldownSeconds: 10
    },
    accent: "#ffb7d2",
    visualVariant: "halo-warden",
    unlockRule: "角色招募获得"
  },
  {
    id: "jinse",
    source: "summon",
    rank: "S",
    name: "瑾瑟",
    title: "天穹凰姬",
    profile: "稀有招募角色，兼具群攻与续航能力。",
    skill: {
      name: "凰羽圣裁",
      description: "每 12.5 秒对多名敌人降下凰羽圣裁，并恢复基地生命与护盾。",
      cooldownSeconds: 12.5
    },
    accent: "#ff8ecb",
    visualVariant: "phoenix-empress",
    unlockRule: "角色招募获得"
  }
];

export const ALL_BEAUTIES: BeautyProfile[] = [...MAINLINE_BEAUTIES, ...SUMMON_BEAUTIES];
