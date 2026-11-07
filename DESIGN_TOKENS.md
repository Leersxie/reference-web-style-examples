# DESIGN TOKENS｜设计令牌

> **P2 生效**：§14 起为当前令牌（方舟实测体系）；§1–13 为 P1 历史记录，配色已被覆盖。
> 单一来源：`src/styles/tokens.css`。组件内不写 magic number；确需特例时必须在代码里注释理由。
> 令牌命名遵循「角色优先」：先说明它是什么角色，再谈它是什么颜色。

---

## 1. 色彩

### 1.1 基础中性色

| 令牌 | 值 | 角色 | 典型用法 |
|---|---|---|---|
| `--hc-canvas` | `#0B0C0D` | 页面底色 | body、左导航、页脚 |
| `--hc-canvas-2` | `#0F1112` | 区块底色 | 主视觉面板、磁贴、日志行、表格容器 |
| `--hc-surface` | `#15181A` | 承载面 | 面板、hover 行、频道卡 |
| `--hc-surface-2` | `#1B1F21` | 浮起面 | 下拉、Toast、抽屉、擦入面板 |
| `--hc-surface-3` | `#23282B` | 更高层 / 区分块 | 菜单 hover、示例块 |
| `--hc-inset` | `#08090A` | 凹陷面 | 输入框、下拉触发、曲线画布 |

### 1.2 文字

| 令牌 | 值 | 对比度（canvas） | 用途 |
|---|---|---|---|
| `--hc-ink` | `#EDEAE3` | 16.30 | 标题、数值、选中态 |
| `--hc-ink-2` | `#A9AAA5` | 8.37 | 正文、说明 |
| `--hc-ink-3` | `#7C8081` | 4.91（面板上 4.47） | 英文标签、单位、注脚 |
| `--hc-ink-4` | `#565B5C` | 2.84 | 仅装饰 / 编号前缀，不承载信息 |

### 1.3 线与边框

| 令牌 | 值 | 用途 |
|---|---|---|
| `--hc-line-1` | `rgba(237,234,227,.075)` | 细分隔、表格行 |
| `--hc-line-2` | `rgba(237,234,227,.14)` | 结构边框、面板 |
| `--hc-line-3` | `rgba(237,234,227,.28)` | 控件边框、浮层 |
| `--hc-line-4` | `rgba(237,234,227,.46)` | 角标、描边字 |

### 1.4 强调与状态

| 令牌 | 值 | 语义 | 使用约束 |
|---|---|---|---|
| `--hc-accent` | `#F0A93C` | 主强调 | 选中、主动作、进度、焦点；不用于大面积填充 |
| `--hc-accent-ink` | `#14100A` | 强调底上的文字 | 只与 accent 配对 |
| `--hc-accent-wash` | `rgba(240,169,60,.12)` | 强调弱底 | 选中行背景、渐变起点 |
| `--hc-accent-line` | `rgba(240,169,60,.38)` | 强调线 | 角标、tag 边框 |
| `--hc-success` | `#6FAE8C` | 成功 / 在线 | 已发布、已确认 |
| `--hc-warn` | `#D98A5F` | 警示 | 审核中、席位调整 |
| `--hc-danger` | `#CF6A63` | 危险 | 中断、LIVE 点 |
| `--hc-info` | `#7BA7B8` | 信息 | 用于次级状态 |
| `--hc-disabled` | `#4A4F50` | 不可用 | 配合虚线 + 斜纹，不单靠透明度 |

### 1.5 频道主题

```css
[data-channel="arena"]   { --hc-accent:#F0A93C; --hc-accent-ink:#14100A; ... }
[data-channel="hive"]    { --hc-accent:#7FB6C9; ... }
[data-channel="archive"] { --hc-accent:#C98C7E; ... }
[data-channel="workshop"]{ --hc-accent:#A9B27E; ... }
```

只覆盖 accent 组，不动任何中性色。`Shell` 根据路由把 `data-channel` 写到 `<html>`，因此导航、遮罩、抽屉都能同步换色。

---

## 2. 字体

| 令牌 | 值 |
|---|---|
| `--hc-font-cn` | `"HarmonyOS Sans SC","MiSans","Source Han Sans SC","Noto Sans SC","PingFang SC","Microsoft YaHei",system-ui,sans-serif` |
| `--hc-font-en` | `"Bahnschrift","Inter","Segoe UI",system-ui,sans-serif` |
| `--hc-font-mono` | `"Bahnschrift","Consolas","SFMono-Regular",ui-monospace,monospace` |

| 令牌 | 值 | 令牌 | 值 |
|---|---|---|---|
| `--fs-10` | 10px | `--fs-28` | 28px |
| `--fs-11` | 11px | `--fs-36` | 36px |
| `--fs-12` | 12px | `--fs-48` | 48px |
| `--fs-13` | 13px | `--fs-64` | 64px |
| `--fs-14` | 14px | `--fs-88` | 88px |
| `--fs-16` | 16px | `--fs-136` | 136px（未直接用，首页 clamp 上限 120） |
| `--fs-18` | 18px | `--fs-22` | 22px |

| 行高 | 值 | 字距 | 值 |
|---|---|---|---|
| `--lh-tight` | 1.08 | `--ls-label` | 0.18em |
| `--lh-snug` | 1.28 | `--ls-label-wide` | 0.28em |
| `--lh-base` | 1.55 | `--ls-title` | -0.015em |
| `--lh-loose` | 1.75 | | |

规则：拉丁标签一律大写 + 0.18em 以上字距；中文标题用负字距收紧；数字用 `tabular-nums`。

---

## 3. 间距与尺寸

| 令牌 | 值 | 令牌 | 值 |
|---|---|---|---|
| `--sp-1` | 4px | `--sp-7` | 32px |
| `--sp-2` | 8px | `--sp-8` | 40px |
| `--sp-3` | 12px | `--sp-9` | 48px |
| `--sp-4` | 16px | `--sp-10` | 64px |
| `--sp-5` | 20px | `--sp-11` | 88px |
| `--sp-6` | 24px | `--sp-12` | 120px |

| 尺寸令牌 | 值 |
|---|---|
| `--sz-rail` | 82px |
| `--sz-topbar` | 56px |
| `--sz-content-max` | 1440px |
| `--sz-gutter` | 48px（响应式降至 32 / 20 / 16） |
| `--sz-control-sm / control / control-lg` | 28 / 36 / 44px |
| `--sz-icon` | 18px |

---

## 4. 边框、圆角、阴影

| 令牌 | 值 | 说明 |
|---|---|---|
| `--bd-1 / 2 / 3` | 1px solid line-1 / 2 / 3 | 结构线 |
| `--bd-accent` | 1px solid accent | 选中、强调 |
| `--radius-0` | 0 | **默认** |
| `--radius-1` | 1px | 极少使用 |
| `--radius-round` | 999px | 仅保留给未使用的语义位 |
| `--shadow-float` | `0 18px 48px rgba(0,0,0,.55)` | 抽屉、弹窗 |
| `--shadow-menu` | `0 10px 24px rgba(0,0,0,.45)` | 下拉、Toast |

全站不做圆角卡片；阴影只属于临时层。

---

## 5. 层级

| 令牌 | 值 | 用途 |
|---|---|---|
| `--z-base` | 0 | 内容 |
| `--z-sticky` | 100 | sticky 元素 |
| `--z-rail` | 200 | 左导航 |
| `--z-topbar` | 300 | 顶栏 |
| `--z-drawer` | 700 | 抽屉 / 遮罩 |
| `--z-modal` | 800 | 弹窗 |
| `--z-toast` | 850 | 通知 |
| `--z-transition` | 900 | 转场遮罩（最高业务层） |

---

## 6. 动效

| 令牌 | 值 | 用途 |
|---|---|---|
| `--ease-standard` | `cubic-bezier(.4,0,.2,1)` | 通用 |
| `--ease-enter` | `cubic-bezier(.16,1,.3,1)` | 进入 / 揭示 |
| `--ease-exit` | `cubic-bezier(.4,0,1,1)` | 退出 / 让位 |
| `--ease-emphasis` | `cubic-bezier(.22,1,.36,1)` | 遮罩 / 主题演出 |
| `--ease-transform` | `cubic-bezier(.65,0,.35,1)` | 位移重排 |
| `--ease-linear` | `linear` | 进度、旋转、骨架 |
| `--motion-instant` | 90ms | M0 |
| `--motion-fast` | 160ms | M1 |
| `--motion-base` | 240ms | M1–M2 |
| `--motion-panel` | 320ms | M2 |
| `--motion-page` | 440ms | M3 |
| `--motion-hero` | 680ms | M4 |
| `--dur-cover` / `--dur-reveal` | 420 / 380ms | 转场参考值（实际由 TS 计算） |

TS 侧同值映射在 `src/lib/motion.ts`，供 WAAPI 使用。

---

## 7. 装饰变量

| 令牌 | 值 |
|---|---|
| `--pat-grid` | 1px 网格（横竖各一条） |
| `--pat-grid-size` | 72px 72px |
| `--pat-stripe` | -45° 斜纹，5px 透明 + 1px 线 |
| `--pat-halftone` | 1px 圆点 |
| `--pat-halftone-size` | 6px 6px |
| `--pat-ticks` | 每 10px 一根竖线 |

---

## 8. 使用规则

1. **先选角色，再选值。** 不要写 `#F0A93C`，写 `var(--hc-accent)`。
2. **一个屏幕只有一个主动作**使用 accent 实底。
3. **正文不用 ink-4**；ink-3 只用于 11–12px 辅助信息。
4. **禁用态**必须同时改变：文字降级 + 虚线边框 + 斜纹底 + `cursor: not-allowed`，不能只调透明度。
5. **焦点态**用 2px accent 外描边 + 3px 偏移；输入框内部用 `inset 0 0 0 1px` 叠成 2px 效果。
6. **强调色上的文字**只用 `--hc-accent-ink`。
7. **新增颜色前**先问：能不能用现有语义色？不能才加令牌，并登记到本文件。

---

## 9. 新增频道主题

1. 在 `tokens.css` 加一组 `[data-channel="xxx"]`，只覆盖 `--hc-accent / -ink / -wash / -line`。
2. 在 `lib/data.ts` 的 `CHANNELS` 加条目（id、编号、名称、英文、accent）。
3. 在 `Terminal` 不需要改；`Shell` 会自动写 `data-channel`。
4. 检查对比度：新 accent 对 `#0F1112` ≥ 4.5，`--hc-accent-ink` 对新 accent ≥ 4.5。
5. 在实验室色板与频道索引确认磁贴、图表、遮罩都正常。


---

# P1 追加：第二主题与结构令牌

## 10. 结构色令牌（两套主题共享语义）

| 令牌 | 暗色 | 纸面 | 用途 |
|---|---|---|---|
| `--hc-topbar-bg` | `rgba(11,12,13,.92)` | `rgba(232,227,214,.92)` | 顶栏底 |
| `--hc-scrim` | `rgba(5,6,6,.66)` | `rgba(43,38,29,.55)` | 弹层遮罩 |
| `--hc-shine` | `rgba(237,234,227,.06)` | `rgba(25,27,26,.05)` | 骨架流光 |
| `--hc-hatch` | `rgba(237,234,227,.045)` | `rgba(25,27,26,.05)` | 禁用斜纹 |
| `--hc-wash` | `rgba(237,234,227,.018)` | `rgba(25,27,26,.026)` | 空状态斜纹 |
| `--hc-panel-glow` | `rgba(237,234,227,.028)` | `rgba(255,255,255,.32)` | 面板顶部光 |
| `--hc-glow-a/b` | 白色低透明 | 深墨低透明 | 主视觉斜带 |
| `--hc-grain` | `none` | 内联 SVG 噪声 | 纸面颗粒 |

组件内不再出现 `rgba(237,234,227,...)`、`rgba(11,12,13,...)` 这类硬编码；全部走令牌。

## 11. Paper Dossier 主题

| 令牌 | 值 | 说明 |
|---|---|---|
| `--hc-canvas` | `#E8E3D6` | 暖灰纸面 |
| `--hc-canvas-2` | `#F0EBDE` | 区块 |
| `--hc-surface` | `#F6F2E7` | 内容面 |
| `--hc-surface-2` | `#FBF8EF` | 浮层 |
| `--hc-surface-3` | `#DDD7C8` | 更高层 |
| `--hc-inset` | `#DED8C9` | 凹陷 |
| `--hc-ink` | `#191B1A` | 深墨 |
| `--hc-ink-2` | `#484B46` | 正文 |
| `--hc-ink-3` | `#5F6259` | 辅助（4.8:1） |
| `--hc-ink-4` | `#8A8C84` | 仅装饰 |
| `--hc-line-1/2/3/4` | `rgba(25,27,26,.10/.18/.34/.52)` | 结构线 |
| `--hc-accent`（arena） | `#8C5A1A` | 压暗琥珀 |
| `--hc-success` | `#3F6A4F` | 5.2:1 |
| `--hc-warn` | `#8A4B28` | 5.7:1 |
| `--hc-danger` | `#9A423C` | 5.6:1 |
| `--hc-info` | `#44697A` | 5.0:1 |

频道色（纸面）：`arena #8C5A1A / hive #3D6270 / archive #8A4A40 / workshop #5A6636`。

## 12. 嵌套频道节点规则

`data-channel` 可能出现在 `<html>` 上（页面主题），也可能出现在磁贴、廊道行、徽记容器上。为了让纸面主题下的局部频道也使用降饱和色，必须同时提供：

```css
[data-theme="paper"][data-channel="hive"] { ... }   /* html 自身 */
[data-theme="paper"] [data-channel="hive"] { ... }  /* 页面内嵌套 */
```

遗漏后者会导致纸面页面里的磁贴回落到暗色主题的亮频道色。

## 13. 主题切换与持久化

- 主题写入 `<html data-theme>`，由 `src/lib/prefs.ts` 统一管理。
- 首屏前由 `index.html` 内联脚本读取 `honeycity.prefs.v1`，避免刷新闪烁。
- 主题不参与转场动画，即时切换；`color-scheme` 同步为 light / dark。


---

# P2 覆盖：方舟实测体系（当前生效）

> 本节覆盖前文的 P1 琥珀配色；代码以 `src/styles/tokens.css` 为准。

## 14. 表面与信号色

| 令牌 | 值 | 语义 |
|---|---|---|
| `--hc-canvas` | `#111315` | 页面画布 |
| `--hc-paper` / `--hc-paper-2` | `#F2F0EA` / `#E7E4DA` | 纸面（内容） |
| `--hc-surface` / `--hc-surface-2` | `#1B1E20` / `#222628` | 石墨（控制台 / 浮层） |
| `--hc-ink` | `#F8F8F5` | 暗底主文字 |
| `--hc-accent` | `#F6540E` | 强调 / 当前 / 醒目 |
| `--hc-info` | `#4AABEA` | 信息 / 链接 |
| `--hc-info-official` | `#19D1FF` | 官网导航青（参考值） |
| `--hc-action` | `#F1C644` | 可点击 / 警告 / 焦点 |
| `--hc-success` / `--hc-danger` | `#46C47C` / `#E33B3B` | 成功 / 危险 |
| `--hc-line-strong` | `4px` | 当前项 / 主操作的强线 |

## 15. 作用域

`.hc-paper` 与 `.hc-graphite` 在局部重写整套变量（表面、文字、线、accent、状态色）。组件不需要双份：

```html
<section class="hc-paper" data-channel="arena"> … </section>
<div class="hc-graphite"> … </div>
```

纸面频道色：arena `#C2410C` / hive `#1F6E94` / archive `#8A6412` / workshop `#2F6B5C`。

## 16. 字体

| 令牌 | 值 |
|---|---|
| `--hc-font-cn` | `"Noto Sans SC", "Source Han Sans SC", "MiSans", "PingFang SC", "Microsoft YaHei"` |
| `--hc-font-en` | `"Oswald", "Bahnschrift", "Segoe UI"` |
| `--hc-font-mono` | `"IBM Plex Mono", "Consolas"` |

标题 900 / `-0.04 ~ -0.055em`；英文标签 Oswald 500 / 大写 / `0.16–0.3em`；数据 `tabular-nums`。

## 17. 几何

| 令牌 | 值 | 用途 |
|---|---|---|
| `--cut-sm` | 6px | Tab / 行内小控件 |
| `--cut-md` | 12px | 按钮 / 常规可点块 |
| `--cut-lg` | 20px | 频道磁贴 |
| `--radius-0` | 0 | 内容块、纸面 |
| 焦点 | 3px 内描边（切角）/ 3px 外描边 + 3px 偏移（直角） | 不被裁切 |
