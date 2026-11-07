# MOTION INVENTORY｜动效清单

> **P2 生效**：动效时长已对齐 120 / 200 / 300 / 420 / 680；§1–5 的 90–440 数值以 P2 附录为准。
> 参数来源：`src/transition/playTransition.ts` 与 `src/styles/*.css`。
> 所有时长为**本项目初始值**（D 级），不是官方测量值。

---

## 1. 总表

| # | 名称 | 触发 | 时长 | 缓动 | 主要属性 | 回答的问题 |
|---|---|---|---|---|---|---|
| P1 | 大块几何遮罩 | 主导航、首页主按钮 | 遮盖 460ms / 揭示 420ms | emphasis / enter | transform, skewX | 我从哪来、去哪 |
| P2 | 几何切片拼贴 | 实验室、切页 | 6 片：410 / 350ms | emphasis / enter | scaleY | 内容被切成块重组 |
| P3 | 缩放聚焦 | 点击磁贴 / 频道行 | 展开 360ms / 收尾 260ms | emphasis / exit | transform scale | 下一屏从这里展开 |
| P4 | 上下擦入 | 频道主题切换 | 合拢 260ms / 分离 240ms | emphasis / enter | scaleY, scaleX | 同层级信息替换 |
| P5 | 共享主体 | 磁贴 → 详情标题 | 飞行 480ms | emphasis | transform, scale | 同一主体连续移动 |
| H1 | 首屏标题上移 | 首页挂载 | 900ms（第二行 +90ms） | emphasis | translateY | 标题被「推入」画面 |
| H2 | 主视觉浮入 | 首页挂载 | 760ms，延迟 180ms | emphasis | opacity, translateY, scale | 设备面板就位 |
| H3 | 导航色块 / 图标 | hover | 160ms | standard | background, color | 指向哪里 |
| A1 | 按钮填充扫入 | hover | 240ms | enter | scaleX（伪元素） | 主操作被激活 |
| A2 | 按钮箭头位移 | hover | 240ms | enter | translateX 3px | 方向 |
| A3 | 按钮按下 | active | 即时 | — | translateY 1px | 已接收点击 |
| A4 | Loading 旋转 | loading | 700ms 循环 | linear | rotate | 正在处理 |
| B1 | Tab 指示条 | 切换 | 320ms | emphasis | translateX, width | 当前分区 |
| B2 | 分段控制 | 切换 | 90ms | standard | background, color | 选中项 |
| B3 | 磁贴徽记 | hover | 440ms | emphasis | scale, rotate, opacity | 该频道被聚焦 |
| B4 | 磁贴角标 | hover | 240ms | emphasis | translate | 可进入 |
| B5 | 廊道行 | hover | 240ms | standard | background, padding-left | 行被指向 |
| C1 | 抽屉进入 | 打开 | 320ms | emphasis | translateX | 次级信息从边缘来 |
| C2 | 抽屉退出 | 关闭 | 240ms | exit | translateX | 立刻让位 |
| C3 | 遮罩淡入 / 淡出 | 抽屉、弹窗 | 240 / 160ms | standard / exit | opacity | 焦点转移 |
| C4 | 弹窗进入 | 打开 | 320ms | emphasis | opacity, scale(.97→1) | 中断当前流程 |
| C5 | 弹窗退出 | 关闭 | 160ms | exit | opacity, scale | 返回 |
| C6 | 下拉菜单 | 打开 | 160ms | enter | opacity, translateY(-4px) | 选项在此展开 |
| C7 | Toast | 触发 | 240ms 进入 / 3.6s 后移除 | emphasis | translateX, opacity | 操作结果 |
| D1 | 列表行展开 | 点击 | 320ms | emphasis | opacity, translateY | 详情从行内展开 |
| D2 | 进度条 | 数值变化 | 320ms | emphasis | width | 进度推进 |
| D3 | 骨架屏 | 加载 | 1.4s 循环 | linear | translateX | 内容即将出现 |
| D4 | 分页 / 筛选 | 点击 | 90–160ms | standard | background, color | 当前页 |
| D5 | 聚焦环 | 键盘聚焦 | 即时 | — | outline | 焦点在哪 |
| R1 | 减少动态：转场 | 导航 | 100 / 140ms | standard / exit | opacity | 仍然反馈切换 |
| R2 | 减少动态：CSS | 全局 | 0.01ms | — | 全部 | 取消位移与循环 |

---

## 2. 页面级转场的分解

### P1 大块几何遮罩

| 阶段 | 层 | 时长 | 延迟 | 缓动 | 关键帧 |
|---|---|---|---|---|---|
| 遮盖 | 琥珀板 | 300ms | 0 | emphasis | `translateX(-104%) skewX(-7deg)` → `0 skewX(0)` |
| 遮盖 | 墨白板 | 300ms | 80ms | emphasis | 同上 |
| 遮盖 | 深底板 | 300ms | 160ms | emphasis | 同上 |
| 遮盖 | 标签层 | 180ms | 250ms | standard | opacity 0 → 1 |
| 遮盖 | 进度线 | 300ms | 160ms | emphasis | scaleX 0 → 1 |
| — | 内容切换 | — | 460ms | — | 路由更新 + 滚动归零 |
| 揭示 | 深底板 | 280ms | 0 | enter | `0` → `translateX(104%) skewX(7deg)` |
| 揭示 | 墨白板 | 280ms | 70ms | enter | 同上 |
| 揭示 | 琥珀板 | 280ms | 140ms | enter | 同上 |
| 揭示 | 标签层 | 140ms | 0 | exit | opacity 1 → 0 |

快速模式：只保留深底 + 琥珀两层，时长 ×0.6。

### P2 几何切片

| 项 | 值 |
|---|---|
| 切片数 | 6（<760px 为 4，快速模式 3） |
| 单层时长 | 240ms |
| 步进 | 34ms（揭示 26ms，逆序） |
| 属性 | `scaleY`，`transform-origin` 遮盖时 top、揭示时 bottom |
| 底色 | `--hc-canvas-2` 与 `--hc-surface` 交替，右侧 1px 线 |

### P3 缩放聚焦

| 项 | 值 |
|---|---|
| 起点 | 点击元素 `getBoundingClientRect()`；无锚点时用视口中心 40%×34% 的矩形 |
| 放大倍率 | `max(vw/aw, vh/ah) × 1.08`，并计算平移使目标中心对齐视口中心 |
| 展开 | 360ms emphasis |
| 标签 | 180ms，延迟 80ms，随展开同时淡入 |
| 收尾 | 遮罩淡出 260ms exit；主区 scale 1.012 → 1 |
| 降级 | 无锚点仍可用，只是从中心展开 |

### P4 上下擦入

| 项 | 值 |
|---|---|
| 结构 | 上 / 下两条 50% 高、斜纹填充的面板 + 2px 强调接缝 + 标签芯片 |
| 合拢 | 260ms emphasis（scaleY 0→1） |
| 揭示 | 240ms enter（scaleY 1→0） |
| 标签 | 芯片落在接缝上，160ms 淡入；黑底 + 1px 线 + 2px 琥珀左边 |
| 适用 | 同层级栏目 / 频道主题切换，保持滚动位置 |

### P5 共享主体

| 项 | 值 |
|---|---|
| 共享元素 | `[data-shared-title]`，当前为频道详情 H1 |
| 来源 | 点击磁贴的矩形（视口坐标） |
| 飞行 | 480ms emphasis，`translate + scale`，`transform-origin: top left` |
| 遮罩 | 150ms 淡入；切换后 300ms 淡出（延迟 80ms） |
| 主区 | 360ms 淡入（延迟 120ms） |
| 降级 | 无目标或无锚点 → 仅遮罩淡出 |
| 注意 | 先归零滚动再测量，否则标题会从错误的纵向位置起飞（已修复） |

---

## 3. 时长与曲线分级

| 级别 | 场景 | 时长 | 曲线 |
|---|---|---|---|
| M0 即时反馈 | 按下、勾选、分段 | 60–120ms | standard |
| M1 微交互 | hover、图标、标签 | 120–200ms | standard / enter |
| M2 组件 | 抽屉、下拉、折叠、弹窗 | 180–320ms | emphasis / exit |
| M3 页面 | 遮罩、切片、缩放、擦入、共享 | 320–520ms | emphasis / enter |
| M4 主题演出 | 首屏、频道揭示 | 500–900ms | emphasis |

高频操作永远短于低频演出；退出永远快于进入。

---

## 4. 速度倍率与模式

```ts
t(ms) = max(50, round(ms / speed × (quick ? 0.6 : 1)))
```

| 设置 | 效果 |
|---|---|
| 0.5× | 全部转场放慢一倍，用于观察 |
| 1× | 默认 |
| 1.5× / 2× | 加快，用于高频操作 |
| 完整 | 全部层次与错位 |
| 快速 | 时长 ×0.6，遮罩层数减少、切片数减少 |
| 减少动态 | 改用 100ms 淡入 + 140ms 淡出，不走几何层 |

设置同时作用于 `TransitionProvider`（WAAPI）与 `<html data-reduce>`（CSS 动效）。

---

## 5. 刻意没有做的动效

| 未做 | 原因 |
|---|---|
| 全站粒子 / 扫描线 / 代码雨 | 无信息含义的持续运动 |
| 卡片 3D 翻转、浮起 20px | 夸张且不属于该语言 |
| 每个内容块统一从下方淡入 | 会让页面像模板 |
| 页面级无限循环动画 | 只有骨架屏与 loading 旋转允许循环，且仅存在于加载态 |
| 鼠标自定义光标 | 干扰操作 |
| 视差滚动 | 对阅读无帮助，且与转场抢注意力 |
| 列表 FLIP 重排 | 当前没有「排序变化」的业务场景；筛选是替换而非重排（见 TEST_REPORT 未完成项） |


---

# P1 追加

## 6. 阶段与可观察性

所有页面级转场共享四个阶段：

| 阶段 | 用户可见 | 实验室 |
|---|---|---|
| COVER | 遮罩推进 | 轨道高亮 + 状态 `RUNNING` |
| COMMIT | 内容在遮罩后替换 | 轨道推进 |
| REVEAL | 遮罩退出，新页出现 | 轨道推进 |
| CLEANUP | 交互恢复 | 高亮 120ms 后归 `IDLE` |

## 7. 新增 / 调整

| 项 | 值 | 说明 |
|---|---|---|
| 方向（mask） | 左进 / 右进 | `forward` / `back` |
| 方向（slices） | 上升 / 下降 | `transform-origin` 翻转 |
| 暂停 | 空格 | 冻结当前 WAAPI |
| 复位 | ESC | 取消任务、清遮罩、解锁滚动 |
| 失败 | — | 直接切页，不留在遮罩后 |
| 首屏信号线 | 1.8s，延迟 0.35s | `stroke-dashoffset` 100→0，只播一次 |
| 徽记 hover | 440ms | 0.4→0.72 + 旋转 3° |
| 主题切换 | 即时 | 不做颜色过渡，避免大面积闪烁 |

## 8. 减少动态下的替代

| 正常 | 减少动态 |
|---|---|
| 五种几何转场 | 100ms 淡入 + 140ms 淡出 |
| 首屏标题上移 | 直接显示 |
| 信号线绘制 | 直接显示 |
| 骨架流光 | 停止 |
| 卡片 hover 位移 | 无位移，仅颜色 |
| Toast 进入 | 无位移 |


## P2.3 追加：转场 6–9

| # | 名称 | 触发 | 时长 | 缓动 | 结构 |
|---|---|---|---|---|---|
| P6 | 阶梯推挤 | 频道/导航 | 430 / 340ms | emphasis / enter | 4 横带 skewX(-8°)，错峰 50ms，右缘 2px 信号线 |
| P7 | 四向快门 | 频道/导航 | 240 / 220ms | emphasis / enter | 四角板 scale 0→1 向心合拢，中缝 2px 十字 + 旋转菱形 |
| P8 | 纸面翻页 | 频道/导航 | 280 / 300ms | emphasis / enter | 纸面整版（32px 网格）横推，折影 32px 投影，前缘 2px 信号边 |
| P9 | 信号故障 | 频道/导航 | 280 / 120ms | linear / exit | 8 横切片抖动（错峰 14ms），accent 提交帧压满后衰减 |

方向支持：P6（左/右进）、P8（左/右进）。减少动态下均为 100/140ms 淡入淡出。
