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
  warning: "#ffb88d",
  cleared: "#8ff0ba",
  locked: "#5b698f"
};

@ccclass("CampaignScreenController")
export class CampaignScreenController extends Component {
  @property
  public autoBuildRuntimeShell = true;

  start() {
    if (this.autoBuildRuntimeShell) {
      this.buildRuntimeShell();
    }
  }

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

  private buildRuntimeShell(): void {
    const canvasRoot = this.resolveCanvasRoot();
    const shellName = "GeneratedCampaignShell";
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
    this.createCurrentStagePanel(content, contentWidth);
    this.createStageListPanel(content, contentWidth);

    contentLayout.updateLayout();
    const contentTransform = content.getComponent(UITransform);
    if (contentTransform && contentTransform.height < viewportHeight) {
      contentTransform.setContentSize(contentTransform.width, viewportHeight);
    }
    scrollView.content = content;
  }

  private createHeader(parent: Node, width: number): void {
    const panel = this.createCard(parent, "HeaderPanel", width, 96, PALETTE.panel, PALETTE.border, 28);
    const title = this.createText(panel.card, "章节", 28, PALETTE.text, width - 48, true);
    this.setAnchor(title.node, 0, 0.5);
    title.node.setPosition(-width * 0.5 + 24, 16);

    const subtitle = this.createText(
      panel.card,
      "主线净化以章节推进为核心，这里会承接关前场景预览、Boss 预警和净化战斗入口。",
      14,
      PALETTE.muted,
      width - 48
    );
    this.setAnchor(subtitle.node, 0, 0.5);
    subtitle.node.setPosition(-width * 0.5 + 24, -20);
  }

  private createCurrentStagePanel(parent: Node, width: number): void {
    const stage = this.getCurrentStageEntry();
    const panel = this.createCard(parent, "CurrentStagePanel", width, 214, PALETTE.panelAlt, PALETTE.border, 28);

    const eyebrow = this.createText(panel.card, "当前推进目标", 14, PALETTE.accent, width - 48, true);
    this.setAnchor(eyebrow.node, 0, 0.5);
    eyebrow.node.setPosition(-width * 0.5 + 24, 78);

    const danger = this.createText(
      panel.card,
      stage ? `危险等级：${stage.danger}` : "危险等级：待定",
      13,
      PALETTE.warning,
      180,
      true
    );
    this.setAnchor(danger.node, 1, 0.5);
    danger.node.setPosition(width * 0.5 - 24, 78);

    const title = this.createText(
      panel.card,
      stage ? `第 ${stage.id} 章 · ${stage.name}` : "暂无可推进章节",
      26,
      PALETTE.text,
      width - 48,
      true
    );
    this.setAnchor(title.node, 0, 0.5);
    title.node.setPosition(-width * 0.5 + 24, 42);

    const subtitle = this.createText(
      panel.card,
      stage ? `${stage.sceneName} · ${stage.description}` : "当前没有可展示内容",
      14,
      PALETTE.muted,
      width - 48
    );
    this.setAnchor(subtitle.node, 0, 0.5);
    subtitle.node.setPosition(-width * 0.5 + 24, 12);

    const preview = this.createText(
      panel.card,
      stage ? stage.previewText : "后续这里会展示场景原画和 Boss 黑化预警。",
      15,
      PALETTE.text,
      width - 48
    );
    this.setAnchor(preview.node, 0, 0.5);
    preview.node.setPosition(-width * 0.5 + 24, -40);

    const boss = this.createText(
      panel.card,
      stage ? `Boss：${stage.bossName} · ${stage.bossTitle}` : "Boss：待确认",
      13,
      PALETTE.warning,
      width - 48,
      true
    );
    this.setAnchor(boss.node, 0, 0.5);
    boss.node.setPosition(-width * 0.5 + 24, -86);
  }

  private createStageListPanel(parent: Node, width: number): void {
    const panel = this.createCard(parent, "StageListPanel", width, 468, PALETTE.panel, PALETTE.border, 28);
    const eyebrow = this.createText(panel.card, "主线章节列表", 14, PALETTE.warning, width - 48, true);
    this.setAnchor(eyebrow.node, 0, 0.5);
    eyebrow.node.setPosition(-width * 0.5 + 24, 200);

    const subtitle = this.createText(
      panel.card,
      "先做手机竖屏版本的运行骨架，后续这里会接场景预览图、解锁态和 Boss 出场演出入口。",
      13,
      PALETTE.muted,
      width - 48
    );
    this.setAnchor(subtitle.node, 0, 0.5);
    subtitle.node.setPosition(-width * 0.5 + 24, 174);

    const listArea = new Node("StageListArea");
    panel.card.addChild(listArea);
    this.placeNode(listArea, width - 36, 360, 0, -24);
    listArea.addComponent(Mask);

    const scrollView = listArea.addComponent(ScrollView);
    scrollView.horizontal = false;
    scrollView.vertical = true;
    scrollView.inertia = true;
    scrollView.elastic = true;

    const content = new Node("StageListContent");
    listArea.addChild(content);
    this.setSize(content, width - 36, 360);
    this.setAnchor(content, 0.5, 1);
    content.setPosition(0, 180);

    const layout = content.addComponent(Layout);
    layout.type = Layout.Type.VERTICAL;
    layout.spacingY = 10;
    layout.paddingTop = 4;
    layout.paddingBottom = 12;
    layout.resizeMode = Layout.ResizeMode.CONTAINER;

    const stages = this.getStageEntries();
    for (let index = 0; index < stages.length; index += 1) {
      const stage = stages[index];
      const accent = stage.isCleared ? PALETTE.cleared : stage.isUnlocked ? stage.accent : PALETTE.locked;
      const card = this.createCard(content, `${stage.id}StageCard`, width - 36, 102, "#1a2747", accent, 22);

      const chapter = this.createText(card.card, `第 ${stage.id} 章 · ${stage.name}`, 18, PALETTE.text, width - 172, true);
      this.setAnchor(chapter.node, 0, 0.5);
      chapter.node.setPosition(-width * 0.5 + 26, 24);

      const boss = this.createText(card.card, `Boss：${stage.bossName} · ${stage.bossTitle}`, 13, accent, width - 172, true);
      this.setAnchor(boss.node, 0, 0.5);
      boss.node.setPosition(-width * 0.5 + 26, -2);

      const preview = this.createText(card.card, stage.previewText, 12, PALETTE.muted, width - 172);
      this.setAnchor(preview.node, 0, 0.5);
      preview.node.setPosition(-width * 0.5 + 26, -28);

      const statusText = stage.isCleared ? "已净化" : stage.isUnlocked ? "进行中" : "未解锁";
      const statusBadge = this.createBadge(card.card, statusText, 13, 74, 30, 15, accent, accent);
      statusBadge.node.setPosition(width * 0.5 - 58, 20);

      const danger = this.createText(card.card, stage.danger, 12, PALETTE.text, 74, true);
      danger.node.setPosition(width * 0.5 - 58, -18);
    }

    layout.updateLayout();
    const transform = content.getComponent(UITransform);
    if (transform && transform.height < 360) {
      transform.setContentSize(transform.width, 360);
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
    this.placeNode(glow, 280, 280, width * 0.72, height * 0.72);
    this.drawGlow(glow, "#5a78ff", 0.22);
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
