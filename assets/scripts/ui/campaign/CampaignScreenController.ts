import { _decorator, Component } from "cc";
import { GameDatabase } from "../../core/GameDatabase";
import { SaveService } from "../../core/SaveService";

const { ccclass } = _decorator;

@ccclass("CampaignScreenController")
export class CampaignScreenController extends Component {
  public getStageEntries() {
    const save = SaveService.load();
    const clearedSet = new Set(save.clearedStageIds);
    const highestCleared = save.clearedStageIds.length ? Math.max(...save.clearedStageIds) : 0;

    return GameDatabase.stages.map((stage) => {
      const boss = GameDatabase.findBeauty(stage.bossBeautyId);
      const isCleared = clearedSet.has(stage.id);
      const isUnlocked = stage.id <= highestCleared + 1;

      return {
        ...stage,
        bossName: boss?.name || "未知目标",
        bossTitle: boss?.title || "待识别",
        isCleared,
        isUnlocked
      };
    });
  }

  public getCurrentStageEntry() {
    return this.getStageEntries().find((stage) => stage.isUnlocked && !stage.isCleared) || this.getStageEntries()[0] || null;
  }
}
