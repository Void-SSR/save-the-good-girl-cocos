import { _decorator, Component } from "cc";
import { GameDatabase } from "../../core/GameDatabase";
import { SaveService } from "../../core/SaveService";

const { ccclass } = _decorator;

@ccclass("BattleSceneController")
export class BattleSceneController extends Component {
  public getNextStage() {
    const save = SaveService.load();
    const lastClearedStageId = save.clearedStageIds.length
      ? save.clearedStageIds[save.clearedStageIds.length - 1]
      : 0;
    const currentStageId = lastClearedStageId + 1;
    return GameDatabase.findStage(Math.min(currentStageId, GameDatabase.stages.length));
  }

  public getSelectedCompanion() {
    const save = SaveService.load();
    if (!save.selectedCompanionId) {
      return null;
    }
    return GameDatabase.findBeauty(save.selectedCompanionId);
  }
}
