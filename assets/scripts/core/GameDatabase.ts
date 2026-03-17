import { ALL_BEAUTIES, MAINLINE_BEAUTIES, SUMMON_BEAUTIES } from "../data/beauties";
import { EQUIPMENT_CATALOG } from "../data/equipmentCatalog";
import { HOME_SHELL_BLUEPRINT } from "../data/homeShell";
import { STAGES } from "../data/stages";

export const GameDatabase = {
  homeShell: HOME_SHELL_BLUEPRINT,
  stages: STAGES,
  equipmentCatalog: EQUIPMENT_CATALOG,
  beauties: {
    all: ALL_BEAUTIES,
    mainline: MAINLINE_BEAUTIES,
    summon: SUMMON_BEAUTIES
  },
  findStage(stageId: number) {
    return STAGES.find((stage) => stage.id === stageId) || null;
  },
  findBeauty(beautyId: string) {
    return ALL_BEAUTIES.find((beauty) => beauty.id === beautyId) || null;
  },
  findEquipment(equipmentId: string) {
    return EQUIPMENT_CATALOG.find((entry) => entry.id === equipmentId) || null;
  }
};
