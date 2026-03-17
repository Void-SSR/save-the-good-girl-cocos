import { EquipmentDefinition } from "../types/GameTypes";

export const EQUIPMENT_CATALOG: EquipmentDefinition[] = [
  {
    id: "weapon-rustfang",
    type: "weapon",
    quality: "COMMON",
    name: "锈牙冲锋枪",
    description: "便宜但稳定的近防武器，适合前期平滑过渡。",
    effectText: "基础伤害 +10",
    price: 140,
    iconKey: "weapon-rustfang"
  },
  {
    id: "weapon-stormbite",
    type: "weapon",
    quality: "UNCOMMON",
    name: "风暴短铳",
    description: "轻量改装枪管，压得住连续射击节奏。",
    effectText: "射速 +14%，伤害 +8",
    price: 260,
    iconKey: "weapon-stormbite"
  },
  {
    id: "weapon-railfang",
    type: "weapon",
    quality: "RARE",
    name: "破甲轨炮",
    description: "高动能实弹，对厚血目标更有效。",
    effectText: "基础伤害 +18，穿透 +1",
    price: 430,
    iconKey: "weapon-railfang"
  },
  {
    id: "weapon-phoenix",
    type: "weapon",
    quality: "EPIC",
    name: "炽凰主炮",
    description: "高阶主炮，开局就能打出成型清线火力。",
    effectText: "基础伤害 +26，投射物 +1",
    price: 760,
    iconKey: "weapon-phoenix"
  },
  {
    id: "armor-fieldvest",
    type: "armor",
    quality: "COMMON",
    name: "前哨护衣",
    description: "简易防护服，优先提高前期容错。",
    effectText: "基地生命上限 +45",
    price: 120,
    iconKey: "armor-fieldvest"
  },
  {
    id: "armor-rampart",
    type: "armor",
    quality: "UNCOMMON",
    name: "壁垒装甲",
    description: "中型护板和能量衬层，能挡住一轮压线。",
    effectText: "基地生命上限 +72，护盾 +24",
    price: 250,
    iconKey: "armor-rampart"
  },
  {
    id: "armor-polaris",
    type: "armor",
    quality: "RARE",
    name: "北极星战甲",
    description: "稳定供能的高级装甲，同时缩短辅助回转。",
    effectText: "基地生命上限 +96，辅佐冷却更快",
    price: 420,
    iconKey: "armor-polaris"
  },
  {
    id: "armor-seraph",
    type: "armor",
    quality: "EPIC",
    name: "炽天使外骨骼",
    description: "重型外骨骼，让虾仁能扛住终局怪潮。",
    effectText: "基地生命上限 +126，护盾 +64",
    price: 720,
    iconKey: "armor-seraph"
  },
  {
    id: "item-scopechip",
    type: "item",
    quality: "COMMON",
    name: "战术瞄片",
    description: "简单但实用的战术挂件。",
    effectText: "暴击率 +5%",
    price: 110,
    iconKey: "item-scopechip"
  },
  {
    id: "item-powdercharm",
    type: "item",
    quality: "UNCOMMON",
    name: "爆裂符坠",
    description: "让主武器爆裂更稳定的攻击挂件。",
    effectText: "爆裂半径提升",
    price: 240,
    iconKey: "item-powdercharm"
  },
  {
    id: "item-frostseal",
    type: "item",
    quality: "RARE",
    name: "霜痕印章",
    description: "每一发子弹都会拖出冻结尾迹。",
    effectText: "子弹附带减速",
    price: 410,
    iconKey: "item-frostseal"
  },
  {
    id: "item-overdrive",
    type: "item",
    quality: "EPIC",
    name: "超载核心",
    description: "直接拉高整套火力循环的稀有核心。",
    effectText: "射速和暴击伤害同步提高",
    price: 700,
    iconKey: "item-overdrive"
  }
];
