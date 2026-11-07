# 参考用网页风格例子

**仓库定位**：可参考的网页视觉 / 交互 / 动效实现样本合集。每个样本独立可运行，用于对照版式结构、色板层级、组件手感与转场节奏——拿来拆、拿来对照、拿来改成自己的东西，而不是当作产品交付。

| 编号 | 样本 | 技术 | 在线预览 |
|---|---|---|---|
| 001 | [HONEY CITY｜蜜果城 · 争锋频道](./honey-city.html) | React 18 + TS + Vite，WAAPI，零动画库 | [Pages](https://leersxie.github.io/reference-web-style-examples/) |

---

# 001 · HONEY CITY｜蜜果城 · 争锋频道

以《明日方舟》界面设计语言为研究对象、以「蜜果城 · 争锋频道」为主题包装的**交互式 UI 与动效研究样本**。

不是可玩的游戏，也不是电竞后台。它把一套游戏 UI 的版式、色彩、图形母题、组件手感和页面转场做成可直接打开、点击、拆解、复用的东西。

> 当前版本 **P2.1**：依据 `H:/【素材库】` 的方舟设计规范，把整套视觉从“自创暗色面板”换成 **纸面 / 石墨分层 + 切角 + Noto Sans SC / Oswald / IBM Plex Mono + 素材库 2px 图标**，并重构首页、索引、详情、终端与实验台。详见 [P2_CHANGELOG.md](./P2_CHANGELOG.md)，素材授权见 [CREDITS.md](./CREDITS.md)。

---

## 快速开始

```bash
npm install
npm run dev          # http://127.0.0.1:5178
npm run build        # 产出 dist/
npm run build:single # 构建并内联为 honey-city.html（含字体，可离线双击打开）
npm run fonts        # 重新裁切中文字体子集（改文案后运行）
```

- 技术栈：React 18 + TypeScript + Vite 6，**零动画库**（页面转场统一走 Web Animations API）。
- 所有图形为 CSS / 内联 SVG，项目内不含任何游戏拆包素材或截图。
- 设计基准：`Honey_City_.md`（P0）与 `Honey_City_P1_深度精修与视觉升级任务书.md`（P1）。

**单文件版本**：根目录 `honey-city.html`（约 802 KB，含 6 个内联字体），CSS / JS / 图标全部内联，不需要 Node 或服务器。`file://` 下 `pushState` 会被拒绝，已降级为 hash 跳转；主题与速度等偏好仍会写入 localStorage。

## 页面

| 路由 | 页面 | 内容 |
|---|---|---|
| `#/` | 首页 | 原创「信号总览」主视觉、中央塔、四频道节点、状态条、频道廊道 |
| `#/channels` | 频道索引 | 四种不同构图的磁贴、频道徽记与纹理、静态 `ON AIR` 标记、可选转场类型 |
| `#/channel/:id` | 频道详情 | 徽记身份区、四分区内容、徽记主题切换、抽屉、弹窗、预约流程 |
| `#/terminal` | 终端 | 概况条、优先日志、类型筛选、检索、展开、分页、空 / 错 / 加载状态 |
| `#/lab` | 实验台 | 左样本 / 中预览 / 右检查器；令牌、组件、转场、状态四类实验 |

实验室支持 `?tab=tokens|components|motion|states` 深链，例如 `?tab=motion#/lab`。

## 视觉系统

依据素材库 `02-案例库/明日方舟/01-设计规范.md` 与 `tokens/ak-tokens.css`：

- **两层表面**：近黑画布（`#111315`）+ 纸面（`#F2F0EA`）/ 石墨（`#1B1E20`）。内容用纸，控制台用石墨，浮层用深色。
- **信号色只表达功能**：信息 `#4AABEA`、操作 `#F1C644`、强调 `#F6540E`、成功 `#46C47C`、危险 `#E33B3B`。强调只做填充，不铺底。
- **切角 = 可点击**：按钮、磁贴、Tab、列表行统一切右上角（6–20px）；正文、图片、展示块保持直角。切角元素用 3px 内描边显示焦点，避免被裁切。
- **字体**：Noto Sans SC Variable（900 标题 / 400 正文）、Oswald（英文标签）、IBM Plex Mono（数据）。中文字体子集 921 字，WOFF2 262KB。
- **图标**：素材库 24 个（Tabler MIT + 手绘）+ 18 个同规则手绘 = 42 个资产，28 个在用。24×24、2px、方头。
- **频道母题**：争锋（瞄准环 / 橙）、回廊（六边形 / 青）、档案（叠卡 / 黄）、工坊（刻度盘 / 绿）。
- **两套主题**：暗色终端（默认）与档案纸面（Paper Dossier），纸面主题会把频道色压暗并保留深色信号屏。

## 动效系统

九种页面级转场，统一由 `TransitionProvider` 调度：

1. **大块几何遮罩** — 三层斜切色块错位推进，覆盖期显示频道标签。
2. **几何切片拼贴** — 4–6 条竖切片按固定步进升起，退出逆序。
3. **缩放聚焦** — 以点击矩形为起点放大至全屏，中心对齐后交换内容。
4. **上下擦入** — 斜纹面板向中线合拢，标签芯片落在接缝。
5. **共享主体** — 目标标题从来源矩形连续飞入，其余内容随后淡入。
6. **阶梯推挤** — 四条横带同时推入，拖尾形成阶梯，右缘信号线。
7. **四向快门** — 四块角板向中心合拢，中缝十字 + 旋转菱形标记提交点。
8. **纸面翻页** — 整张纸面带折影横推，像翻一页档案。
9. **信号故障** — 八条切片抖动闪烁，信号橙在提交帧压满。

P1 新增：

- 阶段上报 `cover / commit / reveal / cleanup`，实验室实时高亮；
- 方向 `forward / back`（遮罩、切片）；
- 暂停 / 继续 / 复位（播放后按空格暂停，ESC 复位）；
- 失败兜底：转场异常时直接切页，不丢失导航；
- 三态动效：跟随系统 / 减少 / 完整，CSS 与 WAAPI 读同一个 `data-reduce`；
- 速度 0.5–2×、完整 / 快速、偏好持久化。

## 可访问性

- 弹层打开时 `.hc-app` 进入 `inert`，背景不可聚焦、不可点击；嵌套弹层用引用计数。
- 抽屉 / 弹窗 / 移动导航：焦点陷阱、ESC 关闭、焦点归还（触发元素卸载时回退到主内容）。
- 所有控件有可访问名称；状态不只靠颜色；图标按钮必须 `aria-label`。
- `prefers-reduced-motion` + 手动三态开关，`html[data-reduce]` 同步所有 CSS 动效。

## 目录

```
src/
  styles/        tokens.css / base.css / components.css / transition.css / pages.css
  lib/           data.ts、router.ts、motion.ts、prefs.ts
  components/    ChannelSigil / Icon / Sigil(Curve) / ui / overlays / Shell
  pages/         Home / Channels / ChannelDetail / Terminal / Lab
  transition/    TransitionProvider.tsx（调度 / 阶段 / 暂停）、playTransition.ts（九种转场）
scripts/inline.mjs  单文件构建
.qa/                 自动化测试与截图脚本
```

## 文档

| 文件 | 内容 |
|---|---|
| [P2_CHANGELOG.md](./P2_CHANGELOG.md) | P2 视觉重构、字体/图标、版式与验证 |
| [P2.1 自检修复](./P2_CHANGELOG.md) | 对比度、切角覆盖、首屏编排、无障碍修复 |
| [CREDITS.md](./CREDITS.md) | 字体、图标、设计参考的来源与授权 |
| [DESIGN_DECISIONS.md](./DESIGN_DECISIONS.md) | 设计决策记录（为什么这样做） |
| [BRIEFS.md](./docs/briefs/BRIEFS.md) | 三轮任务书索引 |
| [P1_CHANGELOG.md](./P1_CHANGELOG.md) | P1 变更记录、问题对应表、未完成项 |
| [REFERENCE_AUDIT.md](./REFERENCE_AUDIT.md) | 参考资料、证据分级、未证实项 |
| [VISUAL_INVENTORY.md](./VISUAL_INVENTORY.md) | 色彩、字阶、间距、图形资产、页面构图 |
| [MOTION_INVENTORY.md](./MOTION_INVENTORY.md) | 每个动效的触发、时长、曲线、语义 |
| [DESIGN_TOKENS.md](./DESIGN_TOKENS.md) | 完整令牌表与两套主题 |
| [MOTION_SYSTEM.md](./MOTION_SYSTEM.md) | Motion Director、阶段、偏好、中断与降级 |
| [COMPONENTS.md](./COMPONENTS.md) | 组件结构、状态、键盘、响应式、可访问性 |
| [TEST_REPORT.md](./TEST_REPORT.md) | 测试环境、31 + 14 项结果、视口、已知限制 |

## 已知限制（当前）

- 工作区没有蜜果城截图或录屏；视觉依据素材库的方舟设计规范（C 级）与实测令牌，不是官方逐像素还原。
- 中文字体只子集了界面现有字符；检索框输入生僻字会回退系统黑体。
- 切角元素依赖 `clip-path`，焦点使用 3px 内描边；直角元素为 3px 外描边 + 3px 偏移。
- 实验台保持深色工作台配色（刻意），不随纸面主题变浅。
- 对比度已按 WCAG AA 抽查（`.qa/p21-visual.mjs`），未做全页面自动化审查。
- Safari / Firefox 未实机验证；低端移动设备未测帧率；未做真实读屏软件测试。
- 转场暂停是冻结当前 WAAPI 动画，不支持逐阶段单步播放。
- 主题切换为即时切换，没有颜色过渡动画（避免大面积过渡闪烁）。
- 浏览器前进 / 后退使用 220ms 短淡入，不播完整几何转场。
- 单文件 `file://` 下实验室 `?tab=` 深链无效（页内切换正常）。

---

非官方研究项目，与鹰角网络及《明日方舟》无隶属关系。页面内全部数据为演示数据。
