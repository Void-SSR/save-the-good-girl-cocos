import { _decorator, Component } from "cc";
import { GameDatabase } from "../../core/GameDatabase";
import { SaveService } from "../../core/SaveService";

const { ccclass } = _decorator;

@ccclass("EquipmentScreenController")
export class EquipmentScreenController extends Component {
  public getEquippedLoadout() {
    return SaveService.load().equipped;
  }

  public getInventoryByType() {
    const save = SaveService.load();
    const owned = new Set(save.ownedEquipmentIds);

    return {
      weapon: GameDatabase.equipmentCatalog.filter((item) => item.type === "weapon" && owned.has(item.id)),
      armor: GameDatabase.equipmentCatalog.filter((item) => item.type === "armor" && owned.has(item.id)),
      item: GameDatabase.equipmentCatalog.filter((item) => item.type === "item" && owned.has(item.id))
    };
  }
}
