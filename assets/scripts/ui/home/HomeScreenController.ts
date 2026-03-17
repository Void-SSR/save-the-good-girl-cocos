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
import { BeautyProfile, QuickEntry, SaveData, StageConfig } from "../../types/GameTypes";

const { ccclass, property } = _decorator;

type MetricKey = "gold" | "ticket" | "chapter" | "power";

interface HomeViewModel {
  heroName: string;
  heroSlogan: string;
  actionTitle: string;
  actionSubtitle: string;
  actionButton: string;
  currentStage: StageConfig | null;
  selectedCompanion: BeautyProfile | null;
  metrics: Record<MetricKey, string>;
  metricCaptions: Record<MetricKey, string>;
  chapterTitle: string;
  chapterSubtitle: string;
  chapterPreview: string;
  chapterTip: string;
  chapterDanger: string;
  formationTitle: string;
  formationSubtitle: string;
  codexTitle: string;
  codexSubtitle: string;
}

interface RuntimeBindings {
  heroNameLabel: Label | null;
  heroSloganLabel: Label | null;
  actionTitleLabel: Label | null;
  actionSubtitleLabel: Label | null;
  actionButtonLabel: Label | null;
  chapterTitleLabel: Label | null;
  chapterSubtitleLabel: Label | null;
  chapterPreviewLabel: Label | null;
  chapterTipLabel: Label | null;
  chapterDangerLabel: Label | null;
  formationTitleLabel: Label | null;
  formationSubtitleLabel: Label | null;
  codexTitleLabel: Label | null;
  codexSubtitleLabel: Label | null;
  metricValueLabels: Partial<Record<MetricKey, Label>>;
}

interface BadgeResult {
  node: Node;
  label: Label;
}

const PALETTE = {
  background: "#091124",
  backgroundTop: "#121d3a",
  panel: "#162241",
  panelAlt: "#1b2a50",
  panelSoft: "#202f5b",
  border: "#2f4272",
  text: "#f4f7ff",
  muted: "#9aa8cc",
  accent: "#77e6ff",
  danger: "#ff8b8b",
  gold: "#f6c45c"
};

@ccclass("HomeScreenController")
export class HomeScreenController extends Component {
  @property
  public autoBuildRuntimeShell = true;

  @property(Label)
  public heroNameLabel: Label | null = null;

  @property(Label)
  public heroSloganLabel: Label | null = null;

  @property(Label)
  public primaryActionTitleLabel: Label | null = null;

  @property(Label)
  public primaryActionSubtitleLabel: Label | null = null;

  private runtimeBindings: RuntimeBindings = {
    heroNameLabel: null,
    heroSloganLabel: null,
    actionTitleLabel: null,
    actionSubtitleLabel: null,
    actionButtonLabel: null,
    chapterTitleLabel: null,
    chapterSubtitleLabel: null,
    chapterPreviewLabel: null,
    chapterTipLabel: null,
    chapterDangerLabel: null,
    formationTitleLabel: null,
    formationSubtitleLabel: null,
    codexTitleLabel: null,
    codexSubtitleLabel: null,
    metricValueLabels: {}
  };

  start() {
    if (this.autoBuildRuntimeShell) {
      this.buildRuntimeShell();
    }

    this.refresh();
  }

  refresh() {
    const model = this.buildViewModel();

    if (this.heroNameLabel) {
      this.heroNameLabel.string = model.heroName;
    }

    if (this.heroSloganLabel) {
      this.heroSloganLabel.string = model.heroSlogan;
    }

    if (this.primaryActionTitleLabel) {
      this.primaryActionTitleLabel.string = model.actionTitle;
    }

    if (this.primaryActionSubtitleLabel) {
      this.primaryActionSubtitleLabel.string = model.actionSubtitle;
    }

    this.syncRuntimeBindings(model);
  }

  getQuickEntries() {
    return GameDatabase.homeShell.quickEntries;
  }

  getBottomTabs() {
    return GameDatabase.homeShell.bottomTabs;
  }

  private buildViewModel(): HomeViewModel {
    const save = SaveService.load();
    const blueprint = GameDatabase.homeShell;
    const lastClearedStageId = save.clearedStageIds.length
      ? save.clearedStageIds[save.clearedStageIds.length - 1]
      : 0;
    const currentStageId = Math.min(lastClearedStageId + 1, GameDatabase.stages.length);
    const currentStage = GameDatabase.findStage(currentStageId);
    const selectedCompanion = save.selectedCompanionId ? GameDatabase.findBeauty(save.selectedCompanionId) : null;
    const totalCodex = GameDatabase.beauties.all.length;
    const unlockedCodex = save.purifiedBeautyIds.length + save.recruitedBeautyIds.length;

    return {
      heroName: blueprint.heroName,
      heroSlogan: blueprint.heroSlogan,
      actionTitle: currentStage
        ? `${blueprint.dominantActionTitle} · 第 ${currentStage.id} 章`
        : blueprint.dominantActionTitle,
      actionSubtitle: currentStage
        ? `${currentStage.sceneName} · ${currentStage.bossWarning}`
        : blueprint.dominantActionSubtitle,
      actionButton: blueprint.dominantActionButton,
      currentStage,
      selectedCompanion,
      metrics: {
        gold: save.gold.toLocaleString("zh-CN"),
        ticket: `${save.tickets}`,
        chapter: `${currentStageId}/${GameDatabase.stages.length}`,
        power: `${this.calculatePower(save)}`
      },
      metricCaptions: blueprint.topBarMetricCaptions,
      chapterTitle: currentStage ? `${blueprint.chapterPanelTitle} · ${currentStage.name}` : blueprint.chapterPanelTitle,
      chapterSubtitle: currentStage
        ? `${currentStage.sceneName} · ${currentStage.description}`
        : blueprint.chapterPanelSubtitle,
      chapterPreview: currentStage ? currentStage.previewText : blueprint.chapterPanelSubtitle,
      chapterTip: currentStage ? `推荐思路：${currentStage.tip}` : blueprint.dominantActionSubtitle,
      chapterDanger: currentStage ? `危险等级：${currentStage.danger}` : "危险等级：待定",
      formationTitle: selectedCompanion
        ? `${selectedCompanion.name} · ${selectedCompanion.title}`
        : "尚未编组辅佐",
      formationSubtitle: selectedCompanion
        ? `${selectedCompanion.skill.name} · ${selectedCompanion.skill.description}`
        : "先推进主线净化或通过招募获得辅佐，再回到这里编组。",
      codexTitle: `已点亮 ${unlockedCodex}/${totalCodex}`,
      codexSubtitle: `主线净化 ${save.purifiedBeautyIds.length}/${GameDatabase.beauties.mainline.length} · 招募 ${save.recruitedBeautyIds.length}/${GameDatabase.beauties.summon.length}`
    };
  }

  private calculatePower(save: SaveData): number {
    const stageWeight = save.clearedStageIds.length * 35;
    const companionWeight = save.selectedCompanionId ? 180 : 0;
    const equipmentWeight = save.ownedEquipmentIds.length * 65;
    return 860 + stageWeight + companionWeight + equipmentWeight;
  }

  private syncRuntimeBindings(model: HomeViewModel): void {
    this.setLabel(this.runtimeBindings.heroNameLabel, model.heroName);
    this.setLabel(this.runtimeBindings.heroSloganLabel, model.heroSlogan);
    this.setLabel(this.runtimeBindings.actionTitleLabel, model.actionTitle);
    this.setLabel(this.runtimeBindings.actionSubtitleLabel, model.actionSubtitle);
    this.setLabel(this.runtimeBindings.actionButtonLabel, model.actionButton);
    this.setLabel(this.runtimeBindings.chapterTitleLabel, model.chapterTitle);
    this.setLabel(this.runtimeBindings.chapterSubtitleLabel, model.chapterSubtitle);
    this.setLabel(this.runtimeBindings.chapterPreviewLabel, model.chapterPreview);
    this.setLabel(this.runtimeBindings.chapterTipLabel, model.chapterTip);
    this.setLabel(this.runtimeBindings.chapterDangerLabel, model.chapterDanger);
    this.setLabel(this.runtimeBindings.formationTitleLabel, model.formationTitle);
    this.setLabel(this.runtimeBindings.formationSubtitleLabel, model.formationSubtitle);
    this.setLabel(this.runtimeBindings.codexTitleLabel, model.codexTitle);
    this.setLabel(this.runtimeBindings.codexSubtitleLabel, model.codexSubtitle);

    const metricKeys = Object.keys(model.metrics) as MetricKey[];
    for (let index = 0; index < metricKeys.length; index += 1) {
      const key = metricKeys[index];
      this.setLabel(this.runtimeBindings.metricValueLabels[key] || null, model.metrics[key]);
    }
  }

  private setLabel(label: Label | null, value: string): void {
    if (label) {
      label.string = value;
    }
  }

  private buildRuntimeShell(): void {
    const canvasRoot = this.resolveCanvasRoot();
    const shellName = "GeneratedHomeShell";
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
    const bottomNavHeight = 94;

    this.buildBackground(shell, shellWidth, shellHeight);

    const viewportHeight = shellHeight - 28 - (bottomNavHeight + 18);
    const scrollArea = new Node("ScrollArea");
    shell.addChild(scrollArea);
    this.setSize(scrollArea, contentWidth, viewportHeight);
    this.fitFullScreen(scrollArea, sidePadding, sidePadding, 28, bottomNavHeight + 18);
    scrollArea.addComponent(Mask);

    const scrollView = scrollArea.addComponent(ScrollView);
    scrollView.horizontal = false;
    scrollView.vertical = true;
    scrollView.inertia = true;
    scrollView.elastic = true;
    scrollView.brake = 0.55;
    scrollView.bounceDuration = 0.2;

    const content = new Node("Content");
    scrollArea.addChild(content);
    this.setSize(content, contentWidth, viewportHeight);
    this.setAnchor(content, 0.5, 1);
    content.setPosition(0, viewportHeight * 0.5 - 4);

    const contentLayout = content.addComponent(Layout);
    contentLayout.type = Layout.Type.VERTICAL;
    contentLayout.spacingY = 14;
    contentLayout.paddingTop = 4;
    contentLayout.paddingBottom = 56;
    contentLayout.resizeMode = Layout.ResizeMode.CONTAINER;

    const topMetrics = this.createMetricRow(content, contentWidth);
    const heroPanel = this.createHeroPanel(content, contentWidth);
    const chapterPanel = this.createChapterPanel(content, contentWidth);
    this.createQuickEntryPanel(content, contentWidth, this.getQuickEntries());
    const supportPanel = this.createSupportRow(content, contentWidth);
    contentLayout.updateLayout();
    const contentTransform = content.getComponent(UITransform);
    if (contentTransform && contentTransform.height < viewportHeight) {
      contentTransform.setContentSize(contentTransform.width, viewportHeight);
    }
    scrollView.content = content;

    this.runtimeBindings.metricValueLabels = topMetrics;
    this.runtimeBindings.heroNameLabel = heroPanel.heroNameLabel;
    this.runtimeBindings.heroSloganLabel = heroPanel.heroSloganLabel;
    this.runtimeBindings.actionTitleLabel = heroPanel.actionTitleLabel;
    this.runtimeBindings.actionSubtitleLabel = heroPanel.actionSubtitleLabel;
    this.runtimeBindings.actionButtonLabel = heroPanel.actionButtonLabel;
    this.runtimeBindings.chapterTitleLabel = chapterPanel.titleLabel;
    this.runtimeBindings.chapterSubtitleLabel = chapterPanel.subtitleLabel;
    this.runtimeBindings.chapterPreviewLabel = chapterPanel.previewLabel;
    this.runtimeBindings.chapterTipLabel = chapterPanel.tipLabel;
    this.runtimeBindings.chapterDangerLabel = chapterPanel.dangerLabel;
    this.runtimeBindings.formationTitleLabel = supportPanel.formationTitleLabel;
    this.runtimeBindings.formationSubtitleLabel = supportPanel.formationSubtitleLabel;
    this.runtimeBindings.codexTitleLabel = supportPanel.codexTitleLabel;
    this.runtimeBindings.codexSubtitleLabel = supportPanel.codexSubtitleLabel;

    this.createBottomTabs(shell, shellWidth, bottomNavHeight);
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

    const topGlow = new Node("TopGlow");
    parent.addChild(topGlow);
    this.placeNode(topGlow, width * 0.56, 260, width * 0.2, height * 0.68);
    this.drawGlow(topGlow, "#2b5cff", 0.28);

    const sideGlow = new Node("SideGlow");
    parent.addChild(sideGlow);
    this.placeNode(sideGlow, 240, 240, width * 0.78, height * 0.42);
    this.drawGlow(sideGlow, "#ff8db3", 0.22);

    const accentGlow = new Node("AccentGlow");
    parent.addChild(accentGlow);
    this.placeNode(accentGlow, 180, 180, width * 0.16, height * 0.22);
    this.drawGlow(accentGlow, "#73e0ff", 0.18);
  }

  private createMetricRow(parent: Node, width: number): Partial<Record<MetricKey, Label>> {
    const metricsNode = new Node("TopMetrics");
    parent.addChild(metricsNode);
    this.setSize(metricsNode, width, 76);

    const layout = metricsNode.addComponent(Layout);
    layout.type = Layout.Type.HORIZONTAL;
    layout.spacingX = 12;
    layout.resizeMode = Layout.ResizeMode.NONE;

    const labels: Partial<Record<MetricKey, Label>> = {};
    const blueprint = GameDatabase.homeShell;
    const metricKeys = blueprint.topBarMetrics as MetricKey[];
    const cardWidth = (width - 12 * (metricKeys.length - 1)) / metricKeys.length;

    for (let index = 0; index < metricKeys.length; index += 1) {
      const key = metricKeys[index];
      const card = this.createCard(metricsNode, `${key}MetricCard`, cardWidth, 76, PALETTE.panelAlt, PALETTE.border, 22);
      const label = this.createText(card.content, blueprint.topBarMetricLabels[key], 14, PALETTE.muted, cardWidth - 30);
      label.node.setPosition(0, 15);
      const value = this.createText(card.content, "--", 24, PALETTE.text, cardWidth - 30, true);
      value.node.setPosition(0, -4);
      const caption = this.createText(card.content, blueprint.topBarMetricCaptions[key], 12, PALETTE.muted, cardWidth - 30);
      caption.node.setPosition(0, -26);
      labels[key] = value;
    }

    return labels;
  }

  private createHeroPanel(parent: Node, width: number) {
    const hero = this.createCard(parent, "HeroPanel", width, 168, PALETTE.panel, PALETTE.border, 30);
    const blueprint = GameDatabase.homeShell;

    const badge = this.createBadge(hero.card, "净化指挥官", 18, 136, 34, 26, "#22366a", "#3b5dba");
    badge.node.setPosition(-width * 0.5 + 92, 58);

    const avatar = new Node("HeroAvatar");
    hero.card.addChild(avatar);
    this.placeNode(avatar, 132, 132, -width * 0.5 + 92, -6);
    this.drawPortraitToken(avatar);

    const textWidth = Math.max(216, width * 0.5 - 264);

    const heroNameLabel = this.createText(hero.card, blueprint.heroName, 34, PALETTE.text, textWidth, true);
    this.setAnchor(heroNameLabel.node, 0, 0.5);
    heroNameLabel.node.setPosition(-14, 26);

    const heroSloganLabel = this.createText(hero.card, blueprint.heroSlogan, 16, PALETTE.muted, textWidth);
    this.setAnchor(heroSloganLabel.node, 0, 0.5);
    heroSloganLabel.node.setPosition(-14, -6);

    const actionTitleLabel = this.createText(hero.card, blueprint.dominantActionTitle, 22, PALETTE.text, textWidth, true);
    this.setAnchor(actionTitleLabel.node, 0, 0.5);
    actionTitleLabel.node.setPosition(-14, -48);

    const actionSubtitleLabel = this.createText(hero.card, blueprint.dominantActionSubtitle, 14, PALETTE.muted, textWidth);
    this.setAnchor(actionSubtitleLabel.node, 0, 0.5);
    actionSubtitleLabel.node.setPosition(-14, -74);

    const actionButton = this.createBadge(hero.card, blueprint.dominantActionButton, 16, 138, 40, 20, "#2c5fff", "#74b7ff");
    actionButton.node.setPosition(width * 0.5 - 92, -12);
    const actionButtonLabel = actionButton.label;

    return {
      heroNameLabel,
      heroSloganLabel,
      actionTitleLabel,
      actionSubtitleLabel,
      actionButtonLabel
    };
  }

  private createChapterPanel(parent: Node, width: number) {
    const panel = this.createCard(parent, "ChapterPanel", width, 212, PALETTE.panelAlt, PALETTE.border, 28);
    const blueprint = GameDatabase.homeShell;

    const eyebrow = this.createText(panel.card, blueprint.chapterPanelEyebrow, 13, PALETTE.accent, width - 40, true);
    this.setAnchor(eyebrow.node, 0, 0.5);
    eyebrow.node.setPosition(-width * 0.5 + 26, 72);

    const dangerLabel = this.createText(panel.card, "危险等级：待定", 13, PALETTE.danger, 180, true);
    this.setAnchor(dangerLabel.node, 1, 0.5);
    dangerLabel.node.setPosition(width * 0.5 - 26, 72);

    const titleLabel = this.createText(panel.card, blueprint.chapterPanelTitle, 26, PALETTE.text, width - 52, true);
    this.setAnchor(titleLabel.node, 0, 0.5);
    titleLabel.node.setPosition(-width * 0.5 + 26, 40);

    const subtitleLabel = this.createText(panel.card, blueprint.chapterPanelSubtitle, 15, PALETTE.muted, width - 52);
    this.setAnchor(subtitleLabel.node, 0, 0.5);
    subtitleLabel.node.setPosition(-width * 0.5 + 26, 12);

    const previewLabel = this.createText(panel.card, blueprint.dominantActionSubtitle, 16, PALETTE.text, width - 52);
    this.setAnchor(previewLabel.node, 0, 0.5);
    previewLabel.node.setPosition(-width * 0.5 + 26, -32);

    const tipLabel = this.createText(panel.card, blueprint.chapterPanelSubtitle, 14, PALETTE.muted, width - 52);
    this.setAnchor(tipLabel.node, 0, 0.5);
    tipLabel.node.setPosition(-width * 0.5 + 26, -78);

    return {
      titleLabel,
      subtitleLabel,
      previewLabel,
      tipLabel,
      dangerLabel
    };
  }

  private createQuickEntryPanel(parent: Node, width: number, entries: QuickEntry[]): Node {
    const panel = this.createCard(parent, "QuickEntryPanel", width, 232, PALETTE.panel, PALETTE.border, 28);
    const blueprint = GameDatabase.homeShell;

    const titleLabel = this.createText(panel.card, blueprint.quickEntryTitle, 24, PALETTE.text, width - 40, true);
    this.setAnchor(titleLabel.node, 0, 0.5);
    titleLabel.node.setPosition(-width * 0.5 + 24, 88);

    const subtitleLabel = this.createText(panel.card, blueprint.quickEntrySubtitle, 14, PALETTE.muted, width - 40);
    this.setAnchor(subtitleLabel.node, 0, 0.5);
    subtitleLabel.node.setPosition(-width * 0.5 + 24, 62);

    const grid = new Node("QuickEntryGrid");
    panel.card.addChild(grid);
    this.placeNode(grid, width - 36, 144, 0, -32);

    const rowLayout = grid.addComponent(Layout);
    rowLayout.type = Layout.Type.VERTICAL;
    rowLayout.spacingY = 12;
    rowLayout.resizeMode = Layout.ResizeMode.NONE;

    const rowWidth = width - 36;
    const itemWidth = (rowWidth - 12) * 0.5;
    for (let rowIndex = 0; rowIndex < 2; rowIndex += 1) {
      const row = new Node(`QuickEntryRow${rowIndex + 1}`);
      grid.addChild(row);
      this.setSize(row, rowWidth, 68);
      const layout = row.addComponent(Layout);
      layout.type = Layout.Type.HORIZONTAL;
      layout.spacingX = 12;
      layout.resizeMode = Layout.ResizeMode.NONE;

      const start = rowIndex * 2;
      const rowEntries = entries.slice(start, start + 2);
      for (let index = 0; index < rowEntries.length; index += 1) {
        const entry = rowEntries[index];
        const entryCard = this.createCard(row, entry.id, itemWidth, 68, "#20315c", entry.accent, 22);
        const iconBubble = this.createBadge(
          entryCard.card,
          entry.title.slice(0, 1),
          18,
          34,
          34,
          17,
          entry.accent,
          entry.accent
        );
        iconBubble.node.setPosition(-itemWidth * 0.5 + 30, 0);

        const title = this.createText(entryCard.card, entry.title, 16, PALETTE.text, itemWidth - 92, true);
        this.setAnchor(title.node, 0, 0.5);
        title.node.setPosition(-itemWidth * 0.5 + 58, 10);

        const subtitle = this.createText(entryCard.card, entry.subtitle, 12, PALETTE.muted, itemWidth - 92);
        this.setAnchor(subtitle.node, 0, 0.5);
        subtitle.node.setPosition(-itemWidth * 0.5 + 58, -14);

        entryCard.card.on(Node.EventType.TOUCH_END, () => {
          console.log(`[Home] Quick entry tapped -> ${entry.route}`);
        });
      }
    }

    return panel.card;
  }

  private createSupportRow(parent: Node, width: number) {
    const row = new Node("SupportRow");
    parent.addChild(row);
    this.setSize(row, width, 140);

    const layout = row.addComponent(Layout);
    layout.type = Layout.Type.HORIZONTAL;
    layout.spacingX = 14;
    layout.resizeMode = Layout.ResizeMode.NONE;

    const cardWidth = (width - 14) * 0.5;
    const formation = this.createCard(row, "FormationPanel", cardWidth, 140, PALETTE.panelAlt, PALETTE.border, 26);
    const codex = this.createCard(row, "CodexPanel", cardWidth, 140, PALETTE.panelAlt, PALETTE.border, 26);
    const blueprint = GameDatabase.homeShell;

    const formationEyebrow = this.createText(formation.card, blueprint.formationPanelTitle, 14, PALETTE.accent, cardWidth - 36, true);
    this.setAnchor(formationEyebrow.node, 0, 0.5);
    formationEyebrow.node.setPosition(-cardWidth * 0.5 + 18, 38);
    const formationTitleLabel = this.createText(formation.card, "尚未编组辅佐", 20, PALETTE.text, cardWidth - 36, true);
    this.setAnchor(formationTitleLabel.node, 0, 0.5);
    formationTitleLabel.node.setPosition(-cardWidth * 0.5 + 18, 8);
    const formationSubtitleLabel = this.createText(formation.card, blueprint.formationPanelSubtitle, 13, PALETTE.muted, cardWidth - 36);
    this.setAnchor(formationSubtitleLabel.node, 0, 0.5);
    formationSubtitleLabel.node.setPosition(-cardWidth * 0.5 + 18, -34);

    const codexEyebrow = this.createText(codex.card, blueprint.codexPanelTitle, 14, "#ffbf88", cardWidth - 36, true);
    this.setAnchor(codexEyebrow.node, 0, 0.5);
    codexEyebrow.node.setPosition(-cardWidth * 0.5 + 18, 38);
    const codexTitleLabel = this.createText(codex.card, "已点亮 0/0", 20, PALETTE.text, cardWidth - 36, true);
    this.setAnchor(codexTitleLabel.node, 0, 0.5);
    codexTitleLabel.node.setPosition(-cardWidth * 0.5 + 18, 8);
    const codexSubtitleLabel = this.createText(codex.card, blueprint.codexPanelSubtitle, 13, PALETTE.muted, cardWidth - 36);
    this.setAnchor(codexSubtitleLabel.node, 0, 0.5);
    codexSubtitleLabel.node.setPosition(-cardWidth * 0.5 + 18, -34);

    codex.card.on(Node.EventType.TOUCH_END, () => {
      console.log("[Home] Codex panel tapped -> CodexScene");
    });

    return {
      formationTitleLabel,
      formationSubtitleLabel,
      codexTitleLabel,
      codexSubtitleLabel
    };
  }

  private createBottomTabs(parent: Node, width: number, height: number): void {
    const tabs = new Node("BottomTabs");
    parent.addChild(tabs);
    this.fitFullScreen(tabs, 0, 0, 0, 0);
    const tabWidth = Math.min(width - 28, 720);
    const holder = this.createCard(tabs, "BottomTabsHolder", tabWidth, height, "#101a33", "#2c3d6d", 28);
    holder.card.setPosition(0, -view.getVisibleSize().height * 0.5 + height * 0.5 + 8);

    const row = new Node("BottomTabRow");
    holder.card.addChild(row);
    this.placeNode(row, tabWidth - 24, height - 16, 0, 0);
    const layout = row.addComponent(Layout);
    layout.type = Layout.Type.HORIZONTAL;
    layout.spacingX = 8;
    layout.resizeMode = Layout.ResizeMode.NONE;

    const tabsData = this.getBottomTabs();
    const itemWidth = (tabWidth - 24 - 8 * (tabsData.length - 1)) / tabsData.length;
    for (let index = 0; index < tabsData.length; index += 1) {
      const tab = tabsData[index];
      const isActive = tab.id === "home";
      const tabNode = this.createCard(
        row,
        `${tab.id}Tab`,
        itemWidth,
        height - 16,
        isActive ? "#214198" : "#162241",
        isActive ? "#74b7ff" : "#2c3d6d",
        22
      );
      const title = this.createText(tabNode.card, tab.title, 15, isActive ? "#ffffff" : PALETTE.muted, itemWidth - 16, true);
      title.node.setPosition(0, 0);
    }
  }

  private createCard(
    parent: Node,
    name: string,
    width: number,
    height: number,
    fillHex: string,
    borderHex: string,
    radius: number
  ) {
    const card = new Node(name);
    parent.addChild(card);
    this.setSize(card, width, height);
    this.drawRoundedPanel(card, width, height, fillHex, borderHex, radius);

    const content = new Node(`${name}Content`);
    card.addChild(content);
    this.placeNode(content, width - 24, height - 24, 0, 0);

    return { card, content };
  }

  private createText(
    parent: Node,
    text: string,
    fontSize: number,
    colorHex: string,
    width: number,
    bold = false
  ): Label {
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
  ): BadgeResult {
    const badge = new Node("Badge");
    parent.addChild(badge);
    this.setSize(badge, width, height);
    this.drawRoundedPanel(badge, width, height, fillHex, borderHex, radius);

    const label = this.createText(badge, text, fontSize, "#ffffff", width - 12, true);
    label.node.setPosition(0, 0);
    return { node: badge, label };
  }

  private drawPortraitToken(node: Node): void {
    this.drawRoundedPanel(node, 132, 132, "#1f3468", "#4d79ff", 36);

    const halo = new Node("Halo");
    node.addChild(halo);
    this.placeNode(halo, 92, 92, 0, 10);
    this.drawGlow(halo, "#6ab8ff", 0.28);

    const hair = new Node("Hair");
    node.addChild(hair);
    this.placeNode(hair, 78, 62, 0, 14);
    const hairGraphic = hair.addComponent(Graphics);
    hairGraphic.fillColor = this.hex("#0b1020");
    hairGraphic.roundRect(-39, -31, 78, 62, 18);
    hairGraphic.fill();

    const face = new Node("Face");
    node.addChild(face);
    this.placeNode(face, 64, 70, 0, 0);
    const faceGraphic = face.addComponent(Graphics);
    faceGraphic.fillColor = this.hex("#f4d7c0");
    faceGraphic.roundRect(-32, -35, 64, 70, 24);
    faceGraphic.fill();

    const coat = new Node("Coat");
    node.addChild(coat);
    this.placeNode(coat, 88, 52, 0, -34);
    const coatGraphic = coat.addComponent(Graphics);
    coatGraphic.fillColor = this.hex("#0f172d");
    coatGraphic.roundRect(-44, -26, 88, 52, 16);
    coatGraphic.fill();
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
