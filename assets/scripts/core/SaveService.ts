import { sys } from "cc";
import { SaveData } from "../types/GameTypes";

const SAVE_KEY = "save-the-good-girl-cocos-v1";

export const DEFAULT_SAVE_DATA: SaveData = {
  version: 1,
  gold: 1600,
  tickets: 20,
  clearedStageIds: [],
  purifiedBeautyIds: [],
  recruitedBeautyIds: [],
  ownedEquipmentIds: [],
  equipped: {},
  selectedCompanionId: undefined
};

function cloneDefaultSave(): SaveData {
  return JSON.parse(JSON.stringify(DEFAULT_SAVE_DATA)) as SaveData;
}

export class SaveService {
  static load(): SaveData {
    const raw = sys.localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return cloneDefaultSave();
    }

    try {
      const parsed = JSON.parse(raw) as Partial<SaveData>;
      return {
        ...cloneDefaultSave(),
        ...parsed,
        equipped: {
          ...cloneDefaultSave().equipped,
          ...(parsed.equipped || {})
        }
      };
    } catch (error) {
      console.warn("[SaveService] Failed to parse save data, reset to default.", error);
      return cloneDefaultSave();
    }
  }

  static save(data: SaveData): void {
    sys.localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }
}
