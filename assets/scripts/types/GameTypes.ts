export type BeautyRank = "S" | "A" | "B" | "C";
export type BeautySource = "mainline" | "summon";
export type EquipmentType = "weapon" | "armor" | "item";
export type EquipmentQuality = "COMMON" | "UNCOMMON" | "RARE" | "EPIC";
export type DrawCurrency = "gold" | "ticket";
export type StageThemeId =
  | "neon"
  | "frost"
  | "thunder"
  | "shrine"
  | "steamdock"
  | "desert"
  | "opera"
  | "abysslab"
  | "greenhouse"
  | "skycity";

export interface BeautySkill {
  name: string;
  description: string;
  cooldownSeconds: number;
}

export interface BeautyProfile {
  id: string;
  source: BeautySource;
  rank: BeautyRank;
  stageId?: number;
  name: string;
  title: string;
  profile: string;
  skill: BeautySkill;
  accent: string;
  visualVariant: string;
  unlockRule: string;
  webArtKey?: string;
}

export interface StageConfig {
  id: number;
  themeId: StageThemeId;
  name: string;
  sceneName: string;
  danger: string;
  accent: string;
  bossBeautyId: string;
  bossAtSeconds: number;
  bossHp: number;
  description: string;
  previewText: string;
  bossWarning: string;
  tip: string;
}

export interface EquipmentDefinition {
  id: string;
  type: EquipmentType;
  quality: EquipmentQuality;
  name: string;
  description: string;
  effectText: string;
  price: number;
  iconKey: string;
}

export interface QuickEntry {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  route: string;
  iconKey: string;
}

export interface SaveData {
  version: number;
  gold: number;
  tickets: number;
  clearedStageIds: number[];
  purifiedBeautyIds: string[];
  recruitedBeautyIds: string[];
  ownedEquipmentIds: string[];
  equipped: {
    weaponId?: string;
    armorId?: string;
    itemId?: string;
  };
  selectedCompanionId?: string;
}
