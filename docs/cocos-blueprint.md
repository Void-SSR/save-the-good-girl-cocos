# Save the Good Girl Cocos Blueprint

## Goal

This project is not a direct 1:1 port of the web prototype. It is a cleaner
mobile-first rebuild in Cocos Creator 3.8 that keeps the core game loop:

- fixed-position hero
- vertical lane pressure from top to bottom
- auto shooting and auto skills
- level-up card choices
- boss rescue loop
- codex, equipment, and shop metagame

## UI / UX direction

This rebuild follows the information density and hierarchy seen in strong
mobile mini-game shooters such as "向僵尸开炮":

- one dominant "start battle" focus card above the fold
- top resource bar with premium and soft currency
- short labels and icon-first quick entry tiles
- clear separation between combat prep, progression, and long-tail systems
- safe-area friendly bottom actions for thumb interaction
- codex and collection pages optimized for scrolling, not modal drilling

## Scene plan

- `BootScene`
  - preload save, static data, and future atlas/audio manifests
- `HomeScene`
  - core hub, chapter card, quick entries, current formation
- `FormationScene`
  - companion selection and lineup
- `CodexScene`
  - beauty gallery, lock state, rank labels, skill detail
- `EquipmentScene`
  - hero paper-doll, weapon/armor/item slots, inventory grid
- `ShopScene`
  - summon, equipment gacha, direct purchase tabs
- `CampaignScene`
  - chapter list, preview art, stage info
- `BattleScene`
  - combat runtime and HUD
- `ResultOverlay`
  - stage result, rewards, continue/return

## Runtime layers

- `Core`
  - save service, database facade, scene routing
- `Data`
  - stages, beauties, shop, equipment, layout blueprint
- `UI`
  - screen controllers and presentational composition
- `Battle`
  - hero, enemies, projectiles, upgrades, result flow

## First build slice

- mobile home shell
- static game database
- save schema
- screen controller skeletons
- system entry architecture

## Follow-up build order

1. Home scene composition
2. Codex scene
3. Equipment scene
4. Shop scene
5. Campaign and stage preview
6. Battle runtime
7. Result flow and progression rewards
