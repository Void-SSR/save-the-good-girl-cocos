import { _decorator, Component } from "cc";
import { GameDatabase } from "../../core/GameDatabase";
import { SaveService } from "../../core/SaveService";

const { ccclass } = _decorator;

@ccclass("FormationScreenController")
export class FormationScreenController extends Component {
  public getAvailableCompanions() {
    const save = SaveService.load();
    const unlocked = new Set([...save.purifiedBeautyIds, ...save.recruitedBeautyIds]);

    return GameDatabase.beauties.all
      .filter((beauty) => unlocked.has(beauty.id))
      .map((beauty) => ({
        ...beauty,
        isSelected: beauty.id === save.selectedCompanionId
      }));
  }

  public getSelectedCompanion() {
    const save = SaveService.load();
    if (!save.selectedCompanionId) {
      return null;
    }
    return GameDatabase.findBeauty(save.selectedCompanionId);
  }

  public getEquippedSummary() {
    const save = SaveService.load();
    return {
      weapon: save.equipped.weaponId ? GameDatabase.findEquipment(save.equipped.weaponId) : null,
      armor: save.equipped.armorId ? GameDatabase.findEquipment(save.equipped.armorId) : null,
      item: save.equipped.itemId ? GameDatabase.findEquipment(save.equipped.itemId) : null
    };
  }
}
