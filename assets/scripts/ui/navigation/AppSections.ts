export const APP_SCENES = {
  boot: "BootScene",
  home: "HomeScene",
  formation: "FormationScene",
  codex: "CodexScene",
  equipment: "EquipmentScene",
  shop: "ShopScene",
  campaign: "CampaignScene",
  battle: "BattleScene"
} as const;

export type AppSceneId = (typeof APP_SCENES)[keyof typeof APP_SCENES];
