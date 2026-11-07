# COMPONENTS｜组件规范

> **P2 生效**：§22 起为当前规范（切角 / 焦点 / 图标）；§1–21 仍适用，个别数值以 §22 为准。
> 所有组件在 `src/components/`。样式在 `styles/components.css`（通用）与 `styles/pages.css`（页面级组合）。
> 原则：**同层级组件行为一致，不同层级有节奏差异；没有「看起来能点但没反应」的假控件。**

---

## 1. 组件总表

| 组件 | 位置 | 主要状态 | 键盘 / 可访问性 |
|---|---|---|---|
| AppShell | `Shell.tsx` | 默认 / 移动端 | Skip link、`main#hc-main` |
| SideNavigation | `Shell.tsx` | 默认 / hover / current | `aria-current="page"`，按钮可 Tab |
| GlobalHeader | `Shell.tsx` | 默认 | 面包屑为文本，设置按钮有 aria-label |
| MobileNav | `Shell.tsx` | 开 / 关 | 焦点陷阱、ESC、滚动锁、`role="dialog"` |
| PageHead | 各页 | 默认 / 带右侧计数 | `h1` + `data-page-title` + `tabIndex=-1` |
| SectionHeading | `ui.tsx` / 页面 | 默认 | 装饰条不参与朗读 |
| Button | `ui.tsx` | 7 态 | 原生 `button`，`disabled` 真实生效 |
| Tabs | `ui.tsx` | 默认 / hover / selected / focus | `role=tablist`、← →、Home/End、roving tabindex |
| Segmented | `ui.tsx` | 默认 / hover / pressed | `aria-pressed` |
| Tag / Status | `ui.tsx` | 4 变体 / 5 状态 | 文本始终存在，颜色不是唯一信息 |
| Panel / DataRow | `ui.tsx` | 默认 | `dl/dt/dd` 语义 |
| ChannelTile | `Channels.tsx` | 默认 / hover / focus | 原生 button，整块可点 |
| Dropdown | `overlays.tsx` | 关 / 开 / 选中 | `aria-haspopup=listbox`、ESC、点击外部、↑↓ |
| Drawer | `overlays.tsx` | 开 / 关 / 退出中 | 焦点陷阱、ESC、焦点归还、滚动锁 |
| Modal | `overlays.tsx` | 开 / 关 / danger | 同上 + `aria-labelledby` |
| Toast | `ui.tsx` | 4 种语气 | `role=status`、`aria-live=polite` |
| SearchInput | `ui.tsx` | 默认 / focus / 有值 / error | 原生 search，`:focus-within` 双层描边 |
| Checkbox / Toggle | `ui.tsx` | 默认 / checked / disabled | 原生 input，label 包裹 |
| Progress | `ui.tsx` | 0–100 | `role=progressbar` + now/min/max |
| Skeleton | `ui.tsx` | 静态 / 流动 | `aria-hidden`，只替换内容区 |
| EmptyState | `ui.tsx` | 4 类文案 | 标题 + 原因 + 可选操作 |
| Tip | `ui.tsx` | hover / focus-within | `data-tip` 伪元素，不进入 tab 序 |
| TransitionOverlay | `transition/*` | 5 种转场 | `aria-hidden`，结束后移除 |
| Sigil / BrandMark / Curve | `Sigil.tsx` | 静态 SVG | `aria-hidden` |

---

## 2. Button

**结构**：`button > span.hc-btn__in > (spinner | children | icon)`，`::before` 作为填充扫入层。

| 状态 | 视觉 | 动效 |
|---|---|---|
| default | 1px line-3 线框，透明底，ink 文字 | — |
| hover | 墨白填充从左侧扫入，文字反白，箭头右移 3px | 240ms enter |
| pressed | 整体下移 1px | 即时 |
| focus-visible | 2px accent 外描边，偏移 3px | 即时 |
| disabled | 虚 line-2 边框 + 斜纹底 + ink-4，无 hover | — |
| loading | 保留当前变体底色，整体 72%，12px spinner | 700ms linear 循环 |
| confirmed | success 实底 + 深色文字 + 对勾（仅 primary） | — |

主按钮 `--primary`：accent 实底 + `accent-ink` 文字；hover 反转为 ink 实底。
文字按钮 `--ghost`：透明，hover 出现 surface-2 底。
图标按钮：36×36（sm 28×28），`aria-label` 必填。

点击反馈不等待动画结束；`disabled` 使用原生属性而非仅样式。

---

## 3. Tabs

- 结构：`div[role=tablist] > button[role=tab]`，底部 2px 指示条绝对定位。
- 指示条位置由 `offsetLeft/offsetWidth` 测量，`ResizeObserver` 监听容器变化。
- 切换 320ms emphasis；连续切换时指示条追随最新目标，不排队。
- 键盘：← → 循环、Home / End 跳首尾；`tabIndex` 只在选中项为 0。
- `aria-selected`、`aria-controls`、`id` 由 `idBase` 生成，面板需提供对应 `role=tabpanel`。
- 溢出时横向滚动，隐藏滚动条。

---

## 4. Segmented

`role=group` + `aria-pressed`。选中用墨白实底反白（不是 accent），与 Tabs 的强调色形成层级差。切换 90ms。

---

## 5. Tag / Status

| 变体 | 用途 |
|---|---|
| default | 类型标签（公告 / 维护 / 档案） |
| accent | 当前频道、关键标签 |
| solid | 已选中、强标记 |
| muted | 次级标签 |

Status 用 5px 方块 + 文案：`live`(danger 点) / `ok`(success) / `warn` / `idle`(gray) / `info`。颜色永远配文字，不单独用色表意。

---

## 6. Panel / DataRow

- Panel：38px 表头（左侧 3px accent 竖条 + 标题 + 英文 + 右侧插槽）+ 16px 内边距内容区。
- 只用于承载结构化信息，不用于「什么都往里塞」。
- DataRow：`dt` 左、`dd` 右（等宽数字），底部 1px 分隔；`hint` 用小号 em 追加单位。
- 面板本身无圆角、无阴影；阴影只属于临时层。

---

## 7. ChannelTile

- 整块是 `button`，内部只用 `span`，避免嵌套交互元素。
- 尺寸：`hero` 7 列 / `tall` 5 列 / `half` 5 列 / `wide` 7 列，高度 380 或 300。
- hover：底色 `canvas-2 → surface`（240ms）、徽记 22% → 50% 并 scale 1.03（440ms）、右上角标从右上滑入（240ms）、箭头右上位移。
- 点击：把 `getBoundingClientRect()` 作为转场锚点。
- 1px 发丝线网格由父容器 `gap:1px + 背景线色` 形成，不是每个卡片单独描边。

---

## 8. Dropdown

- 触发按钮：`aria-haspopup="listbox"`、`aria-expanded`，右侧 chevron 旋转 180°。
- 菜单：`role=listbox` + `role=option` + `aria-selected`；160ms 从 -4px 淡入。
- 键盘：触发点 ↓ 打开并聚焦首项；菜单内 ↑↓ 循环；ESC 关闭。
- 点击外部关闭（`mousedown` 监听）。
- 用于频道索引的「转场类型」、终端的「状态筛选」。

---

## 9. Drawer

| 项 | 值 |
|---|---|
| 宽度 | `min(440px, 92vw)` |
| 进入 / 退出 | 320ms emphasis / 240ms exit |
| 结构 | head（英文 + 标题 + meta） / body（独立滚动） / foot（操作） |
| 遮罩 | 240ms 淡入，点击关闭 |
| 键盘 | 打开后焦点移入第一个可聚焦元素；Tab 循环；ESC 关闭 |
| 归还 | 关闭后焦点回到触发按钮 |
| 滚动 | 打开时锁 body，关闭恢复（保留进入前的值） |

用于频道参数、界面设置、实验室示例。

---

## 10. Modal

- 520px 宽，顶部 2px 语气条（accent / danger）。
- 进入：`opacity 0→1` + `scale .97→1`，320ms emphasis；退出 160ms。
- 结构：head（英文 + 标题 + 关闭） / body / foot（右对齐操作）。
- 遮罩点击、ESC 关闭；焦点陷阱；`aria-labelledby` 指向标题。
- 用于预约确认、场次详情、危险操作确认。

---

## 11. Toast

- 右下角堆叠，最多 3 条，3.6s 自动移除。
- 左侧 2px 语气条；`role=status` + `aria-live=polite`。
- 进入 240ms 从右 12px 淡入；无退出动画（移除即可，不阻塞）。
- 用于同步、复制、预约、参数应用等轻量反馈。

---

## 12. 表单

| 控件 | 规格 |
|---|---|
| SearchInput | 36px 高，inset 底，1px line-2；`:focus-within` 变 accent + inset 1px 叠加成 2px；有值时出现「清除」 |
| Checkbox | 15px 方块，选中 accent 实底 + 深色勾；禁用虚线边框 |
| Toggle | 38×20 轨道 + 14px 方形滑块；选中滑块右移 18px，轨道 accent-wash |
| Dropdown | 见 §8 |

标签统一 10px 等宽大写 + 0.16em 字距；说明文字 11px ink-4。

---

## 13. 反馈与占位

- Progress：3px 轨道 + accent 填充 + 10% 刻度叠层；填充 320ms emphasis；`role=progressbar`。
- Skeleton：surface-2 底 + 1.4s 线性流光；只在加载态出现，不复用为装饰。
- EmptyState：斜纹底 + 虚线框 + 编号 + 标题 + 一句原因 + 可选操作。
- 三种占位都保留结构（编号 / 标题 / 操作），不是单纯留白。

---

## 14. 响应式

| 断点 | 变化 |
|---|---|
| ≤1180px | 内容留白 48 → 32；详情侧栏 320 → 280；实验室说明改单列 |
| ≤980px | 首页主视觉改为上下堆叠；详情头与主体改单列；终端筛选栏改为横向 chip；页头右侧计数下移 |
| ≤900px | 左导航 82 → 64；顶栏 56 → 52；隐藏面包屑 |
| ≤760px | 磁贴单列；日志行重排为两行网格；表格隐藏次要列；页头标题降到 36px |
| ≤680px | 隐藏左导航，改为全屏移动导航；顶栏保留品牌 + 设置；时间与 LIVE 隐藏 |
| ≤480px | 首页按钮等宽；副标题改纵向；统计块单列 |

---

## 15. 可访问性基线

| 项 | 实现 |
|---|---|
| 跳转 | `.hc-skip` → `#hc-main` |
| 焦点 | 2px `--hc-accent` 外描边 + 3px 偏移，全站统一 |
| 语义 | `nav / main / header / footer / section / article / dl / table` |
| Tab | `role=tablist/tab/tabpanel`，`aria-selected`、`aria-controls` |
| 展开 | `aria-expanded` 用于日志行、表格行、移动导航按钮 |
| 当前项 | `aria-current="page"`（导航）、`aria-current="true"`（分页） |
| 弹层 | `role=dialog` + `aria-modal` + 标题关联 + 焦点陷阱 |
| 图标 | 装饰性 `aria-hidden`；纯图标按钮必须有 `aria-label` |
| 动效 | `prefers-reduced-motion` + 手动开关，见 MOTION_SYSTEM §5 |
| 对比 | 正文 ≥ 7:1；辅助信息 ≥ 4.4:1；ink-4 仅装饰 |

---

## 16. 新增组件的检查清单

- [ ] 是否真的需要新组件，还是现有组件的变体？
- [ ] 结构是否最小？有没有嵌套按钮 / 嵌套链接？
- [ ] 默认、hover、pressed、focus-visible、disabled、loading 是否齐全？
- [ ] 键盘是否能完整操作？ESC / 方向键是否需要？
- [ ] 关闭后焦点回到哪里？
- [ ] 移动端是否重排而不是缩小？
- [ ] 减少动态时是否仍有明确反馈？
- [ ] 颜色是否全部来自令牌？
- [ ] 是否在实验室里加了一条可触发示例？


---

# P1 追加

## 17. 新增组件与状态

| 组件 | 位置 | 说明 |
|---|---|---|
| `SampleTag` | `ui.tsx` | `SAMPLE DATA / 演示数据` 标记，可强调色 |
| `ChannelSigil` | `ChannelSigil.tsx` | 4 主徽记 + compact 版本 |
| `ChannelAux` | `ChannelSigil.tsx` | 8 个辅助图形 |
| `ChannelTexture` | `ChannelSigil.tsx` | 4 种 SVG pattern |
| `CitySignalOverview` | `ChannelSigil.tsx` | 首页主视觉 |
| 主题 / 动效三态 | `Shell.tsx` | Segmented + 持久化 + 恢复默认 |
| 工作台导航 | `Lab.tsx` | 左侧分类、中央预览、右侧检查器 |
| 阶段轨道 | `Lab.tsx` | COVER / COMMIT / REVEAL / CLEANUP |
| 复制按钮 | `Lab.tsx` | 复制 CSS / 参数摘要 |

## 18. 弹层背景隔离

- `useFocusTrap` 打开时给 `.hc-app` 加 `inert`；用模块级 `trapDepth` 支持嵌套。
- 最后一个弹层关闭时才解除，避免嵌套时误解除另一个弹层的隔离。
- 移动导航通过 `createPortal` 挂到 `body`，因此不会被 `.hc-app` 的 inert 连带禁用。
- 焦点归还：优先回到打开前的 `activeElement`；若已卸载或不可见，回到 `#hc-main`。

## 19. 按钮状态更新

| 状态 | 变化 |
|---|---|
| disabled | 虚 line-2 边框 + `--hc-hatch` 斜纹 + ink-4；`loading` 不再命中禁用样式 |
| loading | 保留变体底色，整体 72%，spinner 用 `currentColor` |
| confirmed | 次级为 success 文字；primary 为 success 实底 + 深色文字 |

## 20. 设置面板

| 分组 | 控件 | 持久化 |
|---|---|---|
| 主题 | 暗色终端 / 档案纸面 | 是 |
| 动效偏好 | 跟随系统 / 减少 / 完整 | 是（保存 mode，不保存解析值） |
| 速度 | 0.5× / 1× / 1.5× / 2× | 是 |
| 强度 | 快速模式开关 | 是 |
| 恢复默认 | 清除 localStorage | — |

## 21. 实验室三栏

- 左：分类（编号、名称、一句说明）、当前偏好、恢复默认。
- 中：样本选择、预览、阶段、控制、曲线、时长表。
- 右：检查器（参数、复制、说明）。
- 窄屏：分类变横向 chip，检查器落到内容下方；不把三栏硬压成两栏。


---

# P2 追加

## 22. 切角与焦点

- 可点击块统一切右上角：按钮 8px、图标按钮 6px、Tab 6px、磁贴 20px、廊道行 6px。
- 内容块、纸面、图片一律直角。
- 切角元素 `:focus-visible` 用 `box-shadow: inset 0 0 0 3px var(--hc-action)`，外描边会被 `clip-path` 裁掉；直角元素保留 3px 外描边 + 3px 偏移。

## 23. 图标

- 全站一套：素材库 24 个（Tabler MIT）+ 16 个同规则手绘。
- 24×24、stroke 2、square cap、miter join、currentColor。
- 组件 `<span class="hc-icon">` 包裹 raw SVG，尺寸由外层控制。

## 24. 开关

- 38×20 轨道：未选中石墨底 + line-3 边框；选中 accent 实底 + accent-ink 方块滑块。
- 不使用 pill 圆角，保持与直角/切角体系一致。

## 25. 纸面作用域

组件放进 `.hc-paper` 后自动使用纸面令牌，不需要维护第二套组件。注意：

- 图标颜色走 `currentColor`，会自动适配。
- 硬编码的 `#fff` / `#000` 会被替换为 `--hc-accent-ink` / `--hc-canvas`。
- 状态色在纸面下有独立值（success / danger 压暗），不要直接用暗色值。


## 26. P2.2 小物件增强

| 组件 | 增强 |
|---|---|
| 按钮 | 切角 hover 8→10px；按压下移 1px + 120ms 回弹 |
| 分段控制 | inset 2px 焦点环 |
| 复选框 | 勾选 140ms scale 弹出 |
| Toast | 底部 2px 计时条（3.6s 线性收窄）+ 信号编码行 |
| 分割线 | `.hc-divider` 带 24px accent 引导段 |
| Tag | color / border 120ms 过渡 |
| 滚动条 | thumb hover 提亮 |
| 磁贴 / 廊道行 | 切角 hover 生长（20→26 / 8→12） |
| 四角 | 容器 hover 时 scale 1.18 |
| 扫描线 | 实验台预览 hover 触发一次 900ms 扫描 |
