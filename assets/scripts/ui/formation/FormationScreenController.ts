import {
  _decorator,
  Canvas,
  Color,
  Component,
  Graphics,
  Label,
  Layout,
  Mask,
  Node,
  ScrollView,
  UITransform,
  Widget,
  view
} from "cc";
import { GameDatabase } from "../../core/GameDatabase";
import { SaveService } from "../../core/SaveService";

const { ccclass, property } = _decorator;

const PALETTE = {
  background: "#091124",
  panel: "#162241",
  panelAlt: "#1b2a50",
  border: "#2f4272",
  text: "#f4f7ff",
  muted: "#9aa8cc",
  accent: "#77e6ff",
  selected: "#ffb88d",
  gold: "#f6c45c"
};

@ccclass("FormationScreenController")
export class FormationScreenController extends Component {
  @property
  public autoBuildRuntimeShell = true;

  start() {
    if (this.autoBuildRuntimeShell) {
      this.buildRuntimeShell();
    }
  }

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

  private buildRuntimeShell(): void {
    const canvasRoot = this.resolveCanvasRoot();
    const shellName = "GeneratedFormationShell";
    const oldShell = canvasRoot.getChildByName(shellName);
    if (oldShell) {
      oldShell.destroy();
    }

    const shell = new Node(shellName);
    canvasRoot.addChild(shell);
    this.fitFullScreen(shell, 0, 0, 0, 0);

    const visibleSize = view.getVisibleSize();
    const shellWidth = visibleSize.width;
    const shellHeight = visibleSize.height;
    const contentWidth = Math.min(shellWidth - 28, 720);
    const sidePadding = Math.max(16, (shellWidth - contentWidth) * 0.5);

    this.buildBackground(shell, shellWidth, shellHeight);

    const viewportHeight = shellHeight - 32;
    const scrollArea = new Node("ScrollArea");
    shell.addChild(scrollArea);
    this.setSize(scrollArea, contentWidth, viewportHeight);
    this.fitFullScreen(scrollArea, sidePadding, sidePadding, 20, 12);
    scrollArea.addComponent(Mask);

    const scrollView = scrollArea.addComponent(ScrollView);
    scrollView.horizontal = false;
    scrollView.vertical = true;
    scrollView.inertia = true;
    scrollView.elastic = true;

    const content = new Node("Content");
    scrollArea.addChild(content);
    this.setSize(content, contentWidth, viewportHeight);
    this.setAnchor(content, 0.5, 1);
    content.setPosition(0, viewportHeight * 0.5);

    const contentLayout = content.addComponent(Layout);
    contentLayout.type = Layout.Type.VERTICAL;
    contentLayout.spacingY = 14;
    contentLayout.paddingTop = 4;
    contentLayout.paddingBottom = 42;
    contentLayout.resizeMode = Layout.ResizeMode.CONTAINER;

    this.createHeader(content, contentWidth);
    this.createSelectedCompanionPanel(content, contentWidth);
    this.createEquipmentSummaryPanel(content, contentWidth);
    this.createCompanionListPanel(content, contentWidth);

    contentLayout.updateLayout();
    const contentTransform = content.getComponent(UITransform);
    if (contentTransform && contentTransform.height < viewportHeight) {
      contentTransform.setContentSize(contentTransform.width, viewportHeight);
    }
    scrollView.content = content;
  }

  private createHeader(parent: Node, width: number): void {
    const panel = this.createCard(parent, "HeaderPanel", width, 96, PALETTE.panel, PALETTE.border, 28);
    const title = this.createText(panel.card, "出战辅佐", 28, PALETTE.text, width - 48, true);
    this.setAnchor(title.node, 0, 0.5);
    title.node.setPosition(-width * 0.5 + 24, 16);

    const subtitle = this.createText(
      panel.card,
      "在这里编组净化后的辅佐，并检查虾仁当前携带的核心装备。",
      14,
      PALETTE.muted,
      width - 48
    );
    this.setAnchor(subtitle.node, 0, 0.5);
    subtitle.node.setPosition(-width * 0.5 + 24, -20);
  }

  private createSelectedCompanionPanel(parent: Node, width: number): void {
    const panel = this.createCard(parent, "SelectedCompanionPanel", width, 184, PALETTE.panelAlt, PALETTE.border, 28);
    const selected = this.getSelectedCompanion();

    const eyebrow = this.createText(panel.card, "当前辅佐", 14, PALETTE.accent, width - 52, true);
    this.setAnchor(eyebrow.node, 0, 0.5);
    eyebrow.node.setPosition(-width * 0.5 + 24, 66);

    const portrait = new Node("Portrait");
    panel.card.addChild(portrait);
    this.placeNode(portrait, 126, 126, -width * 0.5 + 92, -8);
    this.drawPortraitToken(portrait, selected ? selected.accent : "#546385");

    const name = this.createText(
      panel.card,
      selected ? `${selected.name} · ${selected.title}` : "尚未选择辅佐",
      24,
      PALETTE.text,
      width - 238,
      true
    );
    this.setAnchor(name.node, 0, 0.5);
    name.node.setPosition(-width * 0.5 + 174, 26);

    const profile = this.createText(
      panel.card,
      selected ? selected.profile : "先推进主线净化美少女，或在商城招募角色，再回到这里编组。",
      14,
      PALETTE.muted,
      width - 238
    );
    this.setAnchor(profile.node, 0, 0.5);
    profile.node.setPosition(-width * 0.5 + 174, -12);

    const skill = this.createText(
      panel.card,
      selected
        ? `技能：${selected.skill.name} · ${selected.skill.description}`
        : "尚未激活辅佐技能",
      14,
      selected ? PALETTE.text : PALETTE.muted,
      width - 238
    );
    this.setAnchor(skill.node, 0, 0.5);
    skill.node.setPosition(-width * 0.5 + 174, -54);
  }

  private createEquipmentSummaryPanel(parent: Node, width: number): void {
    const panel = this.createCard(parent, "EquipmentSummaryPanel", width, 150, PALETTE.panel, PALETTE.border, 28);
    const summary = this.getEquippedSummary();
    const eyebrow = this.createText(panel.card, "当前装备摘要", 14, PALETTE.gold, width - 48, true);
    this.setAnchor(eyebrow.node, 0, 0.5);
    eyebrow.node.setPosition(-width * 0.5 + 24, 46);

    const row = new Node("EquipmentRow");
    panel.card.addChild(row);
    this.placeNode(row, width - 36, 88, 0, -16);
    const layout = row.addComponent(Layout);
    layout.type = Layout.Type.HORIZONTAL;
    layout.spacingX = 12;
    layout.resizeMode = Layout.ResizeMode.NONE;

    const cards = [
      { title: "武器", value: summary.weapon?.name || "未装备", accent: "#8de2ff" },
      { title: "护具", value: summary.armor?.name || "未装备", accent: "#9ce8ba" },
      { title: "道具", value: summary.item?.name || "未装备", accent: "#ffd48a" }
    ];

    const cardWidth = (width - 36 - 24) / 3;
    for (let index = 0; index < cards.length; index += 1) {
      const data = cards[index];
      const item = this.createCard(row, `${data.title}Card`, cardWidth, 88, "#20315c", data.accent, 20);
      const title = this.createText(item.card, data.title, 14, data.accent, cardWidth - 24, true);
      title.node.setPosition(0, 18);
      const value = this.createText(item.card, data.value, 15, PALETTE.text, cardWidth - 24, true);
      value.node.setPosition(0, -10);
    }
  }

  private createCompanionListPanel(parent: Node, width: number): void {
    const panel = this.createCard(parent, "CompanionListPanel", width, 332, PALETTE.panelAlt, PALETTE.border, 28);
    const eyebrow = this.createText(panel.card, "可用辅佐名单", 14, PALETTE.selected, width - 48, true);
    this.setAnchor(eyebrow.node, 0, 0.5);
    eyebrow.node.setPosition(-width * 0.5 + 24, 132);

    const subtitle = this.createText(
      panel.card,
      "先做可运行骨架，后续这里会接真实立绘、点击切换和出战确认。",
      13,
      PALETTE.muted,
      width - 48
    );
    this.setAnchor(subtitle.node, 0, 0.5);
    subtitle.node.setPosition(-width * 0.5 + 24, 106);

    const listArea = new Node("ListArea");
    panel.card.addChild(listArea);
    this.placeNode(listArea, width - 36, 232, 0, -34);
    listArea.addComponent(Mask);

    const scrollView = listArea.addComponent(ScrollView);
    scrollView.horizontal = false;
    scrollView.vertical = true;
    scrollView.inertia = true;
    scrollView.elastic = true;

    const content = new Node("ListContent");
    listArea.addChild(content);
    this.setSize(content, width - 36, 232);
    this.setAnchor(content, 0.5, 1);
    content.setPosition(0, 116);

    const layout = content.addComponent(Layout);
    layout.type = Layout.Type.VERTICAL;
    layout.spacingY = 10;
    layout.paddingTop = 4;
    layout.paddingBottom = 12;
    layout.resizeMode = Layout.ResizeMode.CONTAINER;

    const companions = this.getAvailableCompanions();
    if (!companions.length) {
      const emptyCard = this.createCard(content, "EmptyCompanionCard", width - 36, 92, "#1a2747", PALETTE.border, 22);
      const title = this.createText(emptyCard.card, "暂无可用辅佐", 18, PALETTE.text, width - 84, true);
      title.node.setPosition(0, 12);
      const desc = this.createText(emptyCard.card, "推进主线净化绯音，或去商城招募角色后再回来。", 13, PALETTE.muted, width - 84);
      desc.node.setPosition(0, -18);
    } else {
      for (let index = 0; index < companions.length; index += 1) {
        const companion = companions[index];
        const accent = companion.isSelected ? PALETTE.selected : companion.accent;
        const card = this.createCard(content, `${companion.id}Card`, width - 36, 96, "#1a2747", accent, 22);
        const rank = this.createBadge(card.card, companion.rank, 13, 34, 28, 14, accent, accent);
        rank.node.setPosition(-width * 0.5 + 56, 0);

        const name = this.createText(card.card, `${companion.name} · ${companion.title}`, 17, PALETTE.text, width - 124, true);
        this.setAnchor(name.node, 0, 0.5);
        name.node.setPosition(-width * 0.5 + 82, 18);

        const skill = this.createText(card.card, `${companion.skill.name} · ${companion.skill.cooldownSeconds}s`, 13, accent, width - 124);
        this.setAnchor(skill.node, 0, 0.5);
        skill.node.setPosition(-width * 0.5 + 82, -6);

        const desc = this.createText(card.card, companion.skill.description, 12, PALETTE.muted, width - 124);
        this.setAnchor(desc.node, 0, 0.5);
        desc.node.setPosition(-width * 0.5 + 82, -28);
      }
    }

    layout.updateLayout();
    const transform = content.getComponent(UITransform);
    if (transform && transform.height < 232) {
      transform.setContentSize(transform.width, 232);
    }
    scrollView.content = content;
  }

  private resolveCanvasRoot(): Node {
    const currentCanvas = this.node.getComponent(Canvas);
    if (currentCanvas) {
      currentCanvas.fitHeight = true;
      currentCanvas.fitWidth = true;
      return this.node;
    }

    const existingCanvas = this.node.getChildByName("Canvas");
    if (existingCanvas && existingCanvas.getComponent(Canvas)) {
      return existingCanvas;
    }

    const canvasNode = new Node("Canvas");
    this.node.addChild(canvasNode);
    const canvas = canvasNode.addComponent(Canvas);
    canvas.fitHeight = true;
    canvas.fitWidth = true;
    const transform = canvasNode.addComponent(UITransform);
    const size = view.getVisibleSize();
    transform.setContentSize(size.width, size.height);
    return canvasNode;
  }

  private buildBackground(parent: Node, width: number, height: number): void {
    const base = new Node("Background");
    parent.addChild(base);
    this.fitFullScreen(base, 0, 0, 0, 0);
    this.drawRoundedPanel(base, width, height, PALETTE.background, PALETTE.background, 0);

    const glow = new Node("Glow");
    parent.addChild(glow);
    this.placeNode(glow, 260, 260, width * 0.18, height * 0.72);
    this.drawGlow(glow, "#2b5cff", 0.24);
  }

  private createCard(parent: Node, name: string, width: number, height: number, fillHex: string, borderHex: string, radius: number) {
    const card = new Node(name);
    parent.addChild(card);
    this.setSize(card, width, height);
    this.drawRoundedPanel(card, width, height, fillHex, borderHex, radius);

    const content = new Node(`${name}Content`);
    card.addChild(content);
    this.placeNode(content, width - 24, height - 24, 0, 0);

    return { card, content };
  }

  private createText(parent: Node, text: string, fontSize: number, colorHex: string, width: number, bold = false): Label {
    const node = new Node("Label");
    parent.addChild(node);
    const transform = node.addComponent(UITransform);
    transform.setContentSize(width, fontSize + 12);
    const label = node.addComponent(Label);
    label.string = text;
    label.fontSize = fontSize;
    label.lineHeight = fontSize + 8;
    label.enableWrapText = true;
    label.color = this.hex(colorHex);
    if (bold) {
      node.name = "EmphasisLabel";
    }
    return label;
  }

  private createBadge(
    parent: Node,
    text: string,
    fontSize: number,
    width: number,
    height: number,
    radius: number,
    fillHex: string,
    borderHex: string
  ) {
    const badge = new Node("Badge");
    parent.addChild(badge);
    this.setSize(badge, width, height);
    this.drawRoundedPanel(badge, width, height, fillHex, borderHex, radius);
    const label = this.createText(badge, text, fontSize, "#ffffff", width - 12, true);
    label.node.setPosition(0, 0);
    return { node: badge, label };
  }

  private drawPortraitToken(node: Node, accent: string): void {
    this.drawRoundedPanel(node, 126, 126, "#1f3468", accent, 34);

    const halo = new Node("Halo");
    node.addChild(halo);
    this.placeNode(halo, 86, 86, 0, 8);
    this.drawGlow(halo, accent, 0.26);

    const face = new Node("Face");
    node.addChild(face);
    this.placeNode(face, 56, 66, 0, 2);
    const faceGraphic = face.addComponent(Graphics);
    faceGraphic.fillColor = this.hex("#f4d7c0");
    faceGraphic.roundRect(-28, -33, 56, 66, 22);
    faceGraphic.fill();

    const hair = new Node("Hair");
    node.addChild(hair);
    this.placeNode(hair, 72, 54, 0, 18);
    const hairGraphic = hair.addComponent(Graphics);
    hairGraphic.fillColor = this.hex("#10172d");
    hairGraphic.roundRect(-36, -27, 72, 54, 18);
    hairGraphic.fill();
  }

  private drawRoundedPanel(node: Node, width: number, height: number, fillHex: string, borderHex: string, radius: number): void {
    const transform = node.getComponent(UITransform) || node.addComponent(UITransform);
    transform.setContentSize(width, height);
    const graphics = node.getComponent(Graphics) || node.addComponent(Graphics);
    graphics.clear();
    graphics.fillColor = this.hex(fillHex);
    graphics.roundRect(-width * 0.5, -height * 0.5, width, height, radius);
    graphics.fill();
    graphics.lineWidth = 2;
    graphics.strokeColor = this.hex(borderHex, 220);
    graphics.roundRect(-width * 0.5 + 1, -height * 0.5 + 1, width - 2, height - 2, Math.max(radius - 1, 0));
    graphics.stroke();
  }

  private drawGlow(node: Node, fillHex: string, alphaScale: number): void {
    const transform = node.getComponent(UITransform) || node.addComponent(UITransform);
    const size = transform.contentSize;
    const graphics = node.getComponent(Graphics) || node.addComponent(Graphics);
    graphics.clear();
    graphics.fillColor = this.hex(fillHex, Math.floor(255 * alphaScale));
    graphics.circle(0, 0, Math.min(size.width, size.height) * 0.5);
    graphics.fill();
  }

  private fitFullScreen(node: Node, left: number, right: number, top: number, bottom: number): void {
    const widget = node.getComponent(Widget) || node.addComponent(Widget);
    widget.isAlignLeft = true;
    widget.isAlignRight = true;
    widget.isAlignTop = true;
    widget.isAlignBottom = true;
    widget.left = left;
    widget.right = right;
    widget.top = top;
    widget.bottom = bottom;
  }

  private setSize(node: Node, width: number, height: number): void {
    const transform = node.getComponent(UITransform) || node.addComponent(UITransform);
    transform.setContentSize(width, height);
  }

  private placeNode(node: Node, width: number, height: number, x: number, y: number): void {
    this.setSize(node, width, height);
    node.setPosition(x, y);
  }

  private setAnchor(node: Node, x: number, y: number): void {
    const transform = node.getComponent(UITransform);
    if (transform) {
      transform.setAnchorPoint(x, y);
    }
  }

  private hex(hex: string, alpha = 255): Color {
    const normalized = hex.replace("#", "");
    const factor = normalized.length === 3 ? 1 : 2;
    const expand = (value: string) => (factor === 1 ? value + value : value);
    const channels = factor === 1
      ? [normalized[0], normalized[1], normalized[2]]
      : [normalized.slice(0, 2), normalized.slice(2, 4), normalized.slice(4, 6)];

    const [r, g, b] = channels.map((channel) => parseInt(expand(channel), 16));
    return new Color(r, g, b, alpha);
  }
}
