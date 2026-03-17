import { _decorator, Component } from "cc";
import { GameDatabase } from "../../core/GameDatabase";
import { SaveService } from "../../core/SaveService";

const { ccclass } = _decorator;

@ccclass("CodexScreenController")
export class CodexScreenController extends Component {
  public getDisplayEntries() {
    const save = SaveService.load();
    const unlocked = new Set([...save.purifiedBeautyIds, ...save.recruitedBeautyIds]);

    return GameDatabase.beauties.all.map((beauty) => ({
      ...beauty,
      isUnlocked: unlocked.has(beauty.id)
    }));
  }
}
