import { _decorator, Component, Label } from "cc";
import { GameDatabase } from "../../core/GameDatabase";
import { SaveService } from "../../core/SaveService";

const { ccclass, property } = _decorator;

@ccclass("HomeScreenController")
export class HomeScreenController extends Component {
  @property(Label)
  public heroNameLabel: Label | null = null;

  @property(Label)
  public heroSloganLabel: Label | null = null;

  @property(Label)
  public primaryActionTitleLabel: Label | null = null;

  @property(Label)
  public primaryActionSubtitleLabel: Label | null = null;

  start() {
    this.refresh();
  }

  refresh() {
    const save = SaveService.load();
    const blueprint = GameDatabase.homeShell;
    const lastClearedStageId = save.clearedStageIds.length
      ? save.clearedStageIds[save.clearedStageIds.length - 1]
      : 0;
    const currentStageId = lastClearedStageId + 1;
    const currentStage = GameDatabase.findStage(Math.min(currentStageId, GameDatabase.stages.length));

    if (this.heroNameLabel) {
      this.heroNameLabel.string = blueprint.heroName;
    }

    if (this.heroSloganLabel) {
      this.heroSloganLabel.string = blueprint.heroSlogan;
    }

    if (this.primaryActionTitleLabel) {
      this.primaryActionTitleLabel.string = currentStage
        ? `${blueprint.dominantActionTitle} · 第 ${currentStage.id} 章`
        : blueprint.dominantActionTitle;
    }

    if (this.primaryActionSubtitleLabel) {
      this.primaryActionSubtitleLabel.string = currentStage
        ? `${currentStage.sceneName} | ${currentStage.tip}`
        : blueprint.dominantActionSubtitle;
    }
  }

  getQuickEntries() {
    return GameDatabase.homeShell.quickEntries;
  }

  getBottomTabs() {
    return GameDatabase.homeShell.bottomTabs;
  }
}
