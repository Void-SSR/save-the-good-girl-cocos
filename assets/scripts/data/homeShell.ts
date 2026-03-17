import { QuickEntry } from "../types/GameTypes";

export const HOME_SHELL_BLUEPRINT = {
  heroName: "虾仁",
  heroSlogan: "美女们，我来拯救你们了！",
  dominantActionTitle: "开始净化行动",
  dominantActionSubtitle: "当前章节会在战前展示恐怖场景和 Boss 预警",
  topBarMetrics: ["gold", "ticket", "chapter", "power"],
  quickEntries: [
    {
      id: "formation",
      title: "出战辅佐",
      subtitle: "切换当前辅佐与查看编组",
      accent: "#ff9caf",
      route: "FormationScene",
      iconKey: "formation"
    },
    {
      id: "codex",
      title: "美女图鉴",
      subtitle: "滚动浏览已解锁与未解锁角色",
      accent: "#ffca8d",
      route: "CodexScene",
      iconKey: "codex"
    },
    {
      id: "equipment",
      title: "装备系统",
      subtitle: "武器、护具和道具分槽管理",
      accent: "#8de2ff",
      route: "EquipmentScene",
      iconKey: "equipment"
    },
    {
      id: "shop",
      title: "购买商城",
      subtitle: "角色招募、装备补给和直购入口",
      accent: "#ffe17d",
      route: "ShopScene",
      iconKey: "shop"
    }
  ] as QuickEntry[],
  bottomTabs: [
    { id: "home", title: "首页", route: "HomeScene" },
    { id: "campaign", title: "章节", route: "CampaignScene" },
    { id: "shop", title: "商城", route: "ShopScene" },
    { id: "codex", title: "图鉴", route: "CodexScene" }
  ]
};
