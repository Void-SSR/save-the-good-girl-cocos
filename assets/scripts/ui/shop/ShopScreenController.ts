import { _decorator, Component } from "cc";
import { GameDatabase } from "../../core/GameDatabase";

const { ccclass } = _decorator;

@ccclass("ShopScreenController")
export class ShopScreenController extends Component {
  public getCharacterPool() {
    return GameDatabase.beauties.summon;
  }

  public getEquipmentPool() {
    return GameDatabase.equipmentCatalog;
  }
}
