# MOTION SYSTEM｜动效与转场系统

> 目标：所有页面级转场走**同一个入口、同一套状态机、同一组令牌**，组件里不允许各写一套 transition。

---

## 1. 分层

| 层 | 负责 | 文件 |
|---|---|---|
| 令牌 | 时长、曲线、倍率 | `styles/tokens.css`、`lib/motion.ts` |
| 调度 | 导航请求、锁、切页时机、清理、焦点 | `transition/TransitionProvider.tsx` |
| 演出 | 五种转场的 DOM 构建与 WAAPI 时间线 | `transition/playTransition.ts` |
| 样式 | 遮罩节点、层级、`contain` | `styles/transition.css` |
| 组件微交互 | hover / pressed / 展开 | `styles/components.css` |

没有引入 Framer Motion / Motion One：五套转场需要精确的多阶段时序与可中断能力，直接使用 WAAPI 反而更短、更可控，也避免动画库叠加。

---

## 2. 调度流程

```
navigate(to, opts)
  │
  ├─ 1. 同路由且非强制？→ 直接返回
  ├─ 2. gen += 1（使旧转场失效）
  ├─ 3. 取消上一轮所有 Animation，清空遮罩节点
  ├─ 4. 锁定滚动（只记录一次原始 overflow）
  ├─ 5. playTransition()
  │      ├─ 遮盖阶段
  │      ├─ commit()
  │      │    ├─ setRoute(to)
  │      │    ├─ history.pushState(#hash)
  │      │    ├─ 瞬时滚动到顶 + 等待 2 帧
  │      │    └─ 等待 2 帧让新页面完成绘制
  │      └─ 揭示阶段
  └─ 6. finally：清层、解锁滚动、把焦点移到 [data-page-title]
```

### 2.1 为什么需要 `gen`

连续点击时，旧转场可能正处在任意阶段。`gen` 是唯一真相：

- 每次导航 `gen += 1`，旧转场在下一个 `await` 后检查 `cancelled()` 并退出。
- 旧转场的 `finally` 不会清理新转场的节点，也不会恢复滚动（它已经不是最新一轮）。
- 旧动画被 `cancel()`，`finished` 的 reject 被吞掉，不会冒泡成未捕获异常。

### 2.2 滚动锁

- 第一次锁定时把原始 `document.body.style.overflow` 存进 ref，之后每轮复用。
- 只有**最新一轮**结束时才恢复，避免「旧转场提前解锁」。
- 转场期间设置 `history.scrollRestoration = 'manual'`，防止浏览器自行恢复滚动位置。

### 2.3 一个必须写下来的坑

`window.scrollTo({ behavior: 'auto' })` 在 CSS `scroll-behavior: smooth` 下**仍然会平滑滚动**。共享主体转场需要在切页后测量标题的最终矩形，如果此时还在滚动，标题会从错误的纵向位置起飞。

修复方式：

```ts
const html = document.documentElement
const prev = html.style.scrollBehavior
html.style.scrollBehavior = 'auto'
window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
await frames(2)
html.style.scrollBehavior = prev
```

`behavior: 'instant'` 会覆盖 CSS 并取消进行中的平滑滚动。

---

## 3. 五种转场的实现要点

### 3.1 mask

三层 `position:absolute; inset:-2px` 的色块，各自 `translateX(-104%) skewX(-7deg)` → `0`，延迟 0 / 80 / 160ms。第三层（深底）最后到达并遮住页面，标签层独立于色块、固定在底部 11vh，避免随色块滑出屏幕而不可读。

揭示时顺序反转：深底先走、墨白、琥珀最后，形成「暗 → 闪白 → 琥珀 → 新页面」的收束。

### 3.2 slices

4–6 条竖切片，宽度 `100/n%`，`scaleY(0→1)`，`transform-origin` 在遮盖时为 top、揭示时改为 bottom。延迟按索引递增，揭示时逆序，形成稳定时间表而非随机。

### 3.3 zoom

从锚点矩形计算 `scale = max(vw/aw, vh/ah) × 1.08`，再计算 `dx/dy` 让放大后的矩形中心对齐视口中心（`transform-origin: top left`，所以平移量要减去原始 `left/top`）。标签与展开同时开始淡入，否则会被 `await` 拖到揭示阶段，实际看不见。

### 3.4 wipe

上下两条 50% 高的面板 + 2px 接缝 + 标签芯片。面板用斜纹填充，避免与页面底色混在一起（早期版本用同色面板，实测几乎不可见，已改）。标签芯片自带底色，保证压在接缝上仍可读。

### 3.5 shared

1. 150ms 淡入遮罩。
2. 切页并归零滚动（见 2.3）。
3. 查找 `[data-shared-title]`，取最终矩形与计算样式。
4. 克隆一个标题节点，按最终字号设置，`transform-origin: top left`，初始 `translate + scale` 到来源卡片位置。
5. 480ms 飞回 `scale(1)`；同时遮罩淡出、主区从 0.15 淡入。
6. `finally` 恢复真实标题可见、移除克隆。

没有目标 / 没有锚点时只做遮罩淡出，不假装有共享元素。

---

## 4. 统一 API

```ts
navigate(
  { name: 'channel', param: 'arena' },
  {
    kind: 'zoom',            // mask | slices | zoom | wipe | shared
    anchor: DOMRect,         // 点击目标，缩放/共享的必要输入
    label: '争锋频道',        // 遮罩标签与克隆文本
    force: false,            // 同路由强制重播（实验室「播放」）
    keepScroll: false,       // 主题切换保持位置
    skipHistory: false,
  },
)
```

全局设置：

```ts
updateSettings({ speed: 2, quick: true, reduceMotion: false })
```

```ts
t(ms) = max(50, round(ms / speed × (quick ? 0.6 : 1)))
```

---

## 5. 减少动态

两条路径，必须同时存在：

| 路径 | 行为 |
|---|---|
| 转场引擎 | 单层 `hc-tx__fade`：100ms 淡入 → 切页 → 140ms 淡出，不构建任何几何层 |
| CSS 组件 | `@media (prefers-reduced-motion: reduce)` 与 `html[data-reduce="true"]` 将 animation/transition 压到 0.01ms，并强制首屏元素回到最终位置、隐藏骨架流光 |

手动开关与系统偏好取「或」关系：系统开启即开启；用户也可在界面设置里单独打开。

仍然保留反馈：切换依然有 240ms 的明暗变化，只是没有位移和几何演出。

---

## 6. 浏览器前进 / 后退

`popstate` 不重新播放完整转场，原因：

- 历史栈切换是用户对「时间」的操作，不是对「空间」的操作；
- 若再次 `pushState` 会把历史越推越乱。

处理方式：取消进行中的转场 → 直接 `setRoute` → 瞬时滚动到顶 → 主区 220ms 淡入。焦点不强制迁移，避免打断用户对历史位置的预期。

---

## 7. 性能约束

- 只动 `transform` 与 `opacity`；不逐帧改 `width/height/top`。
- 遮罩根节点 `contain: strict`，避免重排扩散到整页。
- 转场结束后立即移除 DOM 与动画对象；`will-change` 只写在遮罩内部节点上。
- 不使用 `filter: blur()` 做转场；顶栏的 `backdrop-filter: blur(2px)` 是静态的，且面积有限。
- 页面离场后不存在循环动画；唯一的循环是加载骨架与按钮 spinner，且只在加载态出现。
- 首屏标题先渲染再动画，用户可在动画结束前点击按钮（遮罩会覆盖并接管）。

---

## 8. 如何新增一种转场

1. 在 `playTransition.ts` 的 `TransitionKind` 里加名字。
2. 写 `runXxx(o, root, t, anim)`：用 `div()` 建节点、用 `anim()` 播动画、在 `await` 后检查 `o.cancelled()`。
3. 在 `playTransition()` 的 `switch` 里加分支。
4. 在 `transition.css` 加节点样式，命名 `hc-tx__xxx`。
5. 在 `Channels.tsx` 的 `TRANSITIONS` 与 `Lab.tsx` 的 `TRANSITIONS` 注册（名称、说明、参数、缩略图）。
6. 跑 `TEST_REPORT.md` 里的连续点击 / 中断 / 减少动态三项检查。

约束：遮盖阶段必须完成切页；退出阶段必须能被打断；不得依赖固定 `setTimeout` 判断结束，只能用 `animation.finished`。


---

# P1 追加：Motion Director

## 9. 五件套

| 组成 | 实现 | 职责 |
|---|---|---|
| MotionTokens | `tokens.css` + `lib/motion.ts` | 时长、曲线、速度、错峰 |
| MotionPreference | `lib/prefs.ts` | `system / reduce / full` 三态 + 系统监听 |
| TransitionTask | `TransitionProvider.tsx` | 每次导航独立 id / 阶段 / 已提交标记 / 动画集合 |
| MotionRegistry | 任务内的 `Set<Animation>` | `finish` / `cancel` 自动移除，结束时清空 |
| MotionDebug | `console` + 阶段状态 | 开发模式输出完整错误与上下文 |

## 10. 阶段协议

```
cover → commit → reveal → cleanup → idle
```

| 阶段 | 触发点 | 实验室回显 |
|---|---|---|
| cover | `navigate()` 开始时 | COVER 高亮 |
| commit | `commit()` 开头，路由与历史写入前 | COMMIT 高亮 |
| reveal | 新页面绘制两帧后 | REVEAL 高亮 |
| cleanup | `finally()`，遮罩移除与滚动解锁 | CLEANUP 高亮 120ms |

只有当前 `task.id` 可以推进阶段、提交路由、释放滚动锁。旧任务在任何 `await` 后检查 `cancelled()` 并退出。

## 11. 暂停 / 继续 / 复位

- `pauseTransition()`：对任务集合内所有 `Animation` 调 `pause()`。
- `resumeTransition()`：调 `play()`。
- `cancelTransition()`：`reset()` → 递增 id、取消动画、清空遮罩、解锁滚动、阶段归零。
- 遮罩会拦截指针，所以实验室提供 **空格暂停 / ESC 复位**，并在 UI 中写明。
- 暂停只冻结当前 WAAPI；不支持逐阶段单步。

## 12. 方向

`navigate(..., { direction: 'forward' | 'back' })`：

- mask：正向从左进入、向右退出；反向从右进入、向左退出。
- slices：正向自下而上，反向自上而下（`transform-origin` 翻转）。
- 其余转场忽略该参数。

## 13. 失败与降级

```ts
.catch(err => {
  log(kind, route, phase, settings, err)
  if (!task.committed) {
    commitRoute()            // 导航不能丢
    window.scrollTo(0,0)
  }
})
.finally(() => cleanup())
```

- 开发模式：完整错误对象。
- 生产模式：简要错误 + 直接切页。
- 任何阶段异常都不会把用户留在遮罩后面。

## 14. 减少动态的统一路径

```
prefs.motion ──┬─ 'reduce' → true
               ├─ 'full'   → false
               └─ 'system' → matchMedia(...).matches
                        ↓
              resolved.reduceMotion
                 ├─ playTransition：只播 100/140ms 淡入
                 └─ html[data-reduce]：CSS 动画压到 0.01ms、首屏元素归位、骨架流光停止
```

系统 `change` 事件只在 `system` 下生效；手动 `reduce/full` 不被系统覆盖。


---

# P2 追加

- 曲线改为规范值：标准 `cubic-bezier(.2,0,0,1)`，强调/进入 `cubic-bezier(.2,.8,.2,1)`，退出 `cubic-bezier(.4,0,1,1)`。
- 组件时长：即时 120ms、基础 200ms、面板 300ms、页面 420ms；M4 首屏仍保留 680ms 一次编排。
- 页面转场引擎、阶段、暂停、方向、失败兜底、偏好持久化不变。
- 纸面 / 石墨作用域只改颜色，不参与动画；转场遮罩仍使用当前 accent（切页时由 `data-channel` 决定）。
