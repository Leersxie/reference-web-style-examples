import { EASING, clamp } from '../lib/motion'

export type TransitionKind =
  | 'mask'
  | 'slices'
  | 'zoom'
  | 'wipe'
  | 'shared'
  | 'steps'
  | 'shutter'
  | 'sheet'
  | 'glitch'

export interface PlaySettings {
  speed: number
  quick: boolean
  reduced: boolean
}

export type Direction = 'forward' | 'back'

export interface PlayOptions {
  kind: TransitionKind
  direction: Direction
  layer: HTMLElement
  anchor: DOMRect | null
  label: string
  accent: string
  meta: string
  settings: PlaySettings
  commit: () => Promise<void> | void
  register: (anim: Animation) => void
  cancelled: () => boolean
}

const div = (cls: string, parent?: HTMLElement): HTMLDivElement => {
  const n = document.createElement('div')
  n.className = cls
  if (parent) parent.appendChild(n)
  return n
}

const defaultRect = (): DOMRect => {
  const w = Math.min(window.innerWidth * 0.4, 520)
  const h = Math.min(window.innerHeight * 0.34, 320)
  return new DOMRect(
    (window.innerWidth - w) / 2,
    (window.innerHeight - h) / 2,
    w,
    h,
  )
}

const mainEl = () => document.getElementById('hc-main')

type AnimFn = (
  n: Element,
  f: Keyframe[],
  opt?: KeyframeAnimationOptions,
) => Promise<void>

export async function playTransition(o: PlayOptions): Promise<void> {
  const root = div('hc-tx-root')
  o.layer.appendChild(root)

  const t = (ms: number) =>
    Math.max(50, Math.round((ms / o.settings.speed) * (o.settings.quick ? 0.6 : 1)))

  const anim = (
    node: Element,
    frames: Keyframe[],
    options: KeyframeAnimationOptions = {},
  ) => {
    const a = node.animate(frames, { fill: 'both', ...options })
    o.register(a)
    return a.finished.then(
      () => undefined,
      () => undefined,
    )
  }

  try {
    if (o.settings.reduced) {
      const fade = div('hc-tx__fade', root)
      fade.textContent = 'CHANNEL SWITCH'
      await anim(fade, [{ opacity: 0 }, { opacity: 1 }], {
        duration: 100,
        easing: EASING.standard,
      })
      if (o.cancelled()) return
      await o.commit()
      if (o.cancelled()) return
      await anim(fade, [{ opacity: 1 }, { opacity: 0 }], {
        duration: 140,
        easing: EASING.exit,
      })
      return
    }

    switch (o.kind) {
      case 'mask':
        await runMask(o, root, t, anim)
        break
      case 'slices':
        await runSlices(o, root, t, anim)
        break
      case 'zoom':
        await runZoom(o, root, t, anim)
        break
      case 'wipe':
        await runWipe(o, root, t, anim)
        break
      case 'shared':
        await runShared(o, root, t, anim)
        break
      case 'steps':
        await runSteps(o, root, t, anim)
        break
      case 'shutter':
        await runShutter(o, root, t, anim)
        break
      case 'sheet':
        await runSheet(o, root, t, anim)
        break
      case 'glitch':
        await runGlitch(o, root, t, anim)
        break
    }
  } finally {
    root.remove()
  }
}

/* ---------- 1. 大块几何遮罩 ---------- */
async function runMask(
  o: PlayOptions,
  root: HTMLElement,
  t: (ms: number) => number,
  anim: AnimFn,
) {
  const accent = div('hc-tx__slab hc-tx__slab--accent', root)
  accent.style.background = o.accent
  const ink = div('hc-tx__slab hc-tx__slab--ink', root)
  const dark = div('hc-tx__slab hc-tx__slab--dark', root)

  const stampWrap = div('hc-tx__stampwrap', root)
  const stamp = div('hc-tx__stamp', stampWrap)
  const left = document.createElement('div')
  const em = document.createElement('em')
  em.textContent = 'HONEY CITY — CHANNEL SWITCH'
  const strong = document.createElement('strong')
  strong.textContent = o.label
  left.append(em, strong)
  const right = document.createElement('div')
  right.className = 'hc-tx__stampmeta'
  right.textContent = o.meta
  stamp.append(left, right)
  const track = div('hc-tx__track', stampWrap)

  const from = o.direction === 'back' ? '104%' : '-104%'
  const to = o.direction === 'back' ? '-104%' : '104%'
  const cover: Keyframe[] = [
    { transform: `translate3d(${from},0,0) skewX(-7deg)` },
    { transform: 'translate3d(0,0,0) skewX(0deg)' },
  ]
  const d = t(300)
  const a1 = anim(accent, cover, { duration: d, easing: EASING.emphasis })
  const a2 = anim(ink, cover, { duration: d, delay: t(80), easing: EASING.emphasis })
  const a3 = anim(dark, cover, { duration: d, delay: t(160), easing: EASING.emphasis })
  void anim(track, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
    duration: d,
    delay: t(160),
    easing: EASING.emphasis,
  })
  void anim(stampWrap, [{ opacity: 0 }, { opacity: 1 }], {
    duration: t(180),
    delay: t(250),
    easing: EASING.standard,
  })
  await Promise.all([a1, a2, a3])
  if (o.cancelled()) return

  await o.commit()
  if (o.cancelled()) return

  const exit: Keyframe[] = [
    { transform: 'translate3d(0,0,0) skewX(0deg)' },
    { transform: `translate3d(${to},0,0) skewX(7deg)` },
  ]
  const e = t(280)
  void anim(stampWrap, [{ opacity: 1 }, { opacity: 0 }], {
    duration: t(140),
    easing: EASING.exit,
  })
  await Promise.all([
    anim(dark, exit, { duration: e, easing: EASING.enter }),
    anim(ink, exit, { duration: e, delay: t(70), easing: EASING.enter }),
    anim(accent, exit, { duration: e, delay: t(140), easing: EASING.enter }),
  ])
}

/* ---------- 2. 几何切片 / 拼贴 ---------- */
async function runSlices(
  o: PlayOptions,
  root: HTMLElement,
  t: (ms: number) => number,
  anim: AnimFn,
) {
  const narrow = window.innerWidth < 760
  const count = o.settings.quick ? 3 : narrow ? 4 : 6
  const w = 100 / count
  const slices: HTMLElement[] = []
  for (let i = 0; i < count; i += 1) {
    const s = div('hc-tx__slice', root)
    s.style.left = `${i * w}%`
    s.style.width = `${w + 0.15}%`
    s.style.transformOrigin = 'top center'
    slices.push(s)
  }
  const d = t(240)
  const step = t(34)
  if (o.direction === 'back') {
    slices.forEach((s) => {
      s.style.transformOrigin = 'bottom center'
    })
  }
  await Promise.all(
    slices.map((s, i) =>
      anim(s, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], {
        duration: d,
        delay: i * step,
        easing: EASING.emphasis,
      }),
    ),
  )
  if (o.cancelled()) return
  await o.commit()
  if (o.cancelled()) return

  slices.forEach((s) => {
    s.style.transformOrigin = o.direction === 'back' ? 'top center' : 'bottom center'
  })
  const e = t(220)
  await Promise.all(
    slices.map((s, i) =>
      anim(s, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], {
        duration: e,
        delay: (count - 1 - i) * t(26),
        easing: EASING.enter,
      }),
    ),
  )
}

/* ---------- 3. 缩放聚焦 / 镜头推进 ---------- */
async function runZoom(
  o: PlayOptions,
  root: HTMLElement,
  t: (ms: number) => number,
  anim: AnimFn,
) {
  const r = o.anchor ?? defaultRect()
  const zoom = div('hc-tx__zoom', root)
  zoom.style.left = `${r.left}px`
  zoom.style.top = `${r.top}px`
  zoom.style.width = `${r.width}px`
  zoom.style.height = `${r.height}px`
  zoom.style.backgroundColor = 'var(--hc-surface-2)'

  const vw = window.innerWidth
  const vh = window.innerHeight
  const s = Math.max(vw / Math.max(r.width, 1), vh / Math.max(r.height, 1)) * 1.08
  const dx = (vw - r.width * s) / 2 - r.left
  const dy = (vh - r.height * s) / 2 - r.top

  const label = div('hc-tx__zoomlabel', root)
  label.textContent = o.label

  const dur = t(360)
  void anim(label, [{ opacity: 0 }, { opacity: 1 }], {
    duration: t(180),
    delay: t(80),
    easing: EASING.standard,
  })
  await anim(
    zoom,
    [
      { transform: 'translate3d(0,0,0) scale(1)' },
      { transform: `translate3d(${dx}px,${dy}px,0) scale(${s})` },
    ],
    { duration: dur, easing: EASING.emphasis },
  )
  if (o.cancelled()) return
  await o.commit()
  if (o.cancelled()) return

  const main = mainEl()
  if (main) {
    void anim(
      main,
      [
        { opacity: 0.4, transform: 'scale(1.012)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      { duration: t(300), easing: EASING.enter },
    )
  }
  await Promise.all([
    anim(zoom, [{ opacity: 1 }, { opacity: 0 }], {
      duration: t(260),
      easing: EASING.exit,
    }),
    anim(label, [{ opacity: 1 }, { opacity: 0 }], { duration: t(160), easing: EASING.exit }),
  ])
}

/* ---------- 4. 横向 / 纵向擦入 ---------- */
async function runWipe(
  o: PlayOptions,
  root: HTMLElement,
  t: (ms: number) => number,
  anim: AnimFn,
) {
  const top = div('hc-tx__bar hc-tx__bar--top', root)
  const bottom = div('hc-tx__bar hc-tx__bar--bottom', root)
  const line = div('hc-tx__barline', root)
  const label = div('hc-tx__wipelabel', root)
  const chip = document.createElement('span')
  chip.textContent = `${o.label} / 载入`
  label.appendChild(chip)

  const d = t(260)
  void anim(label, [{ opacity: 0 }, { opacity: 1 }], {
    duration: t(160),
    delay: t(70),
    easing: EASING.standard,
  })
  await Promise.all([
    anim(top, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], {
      duration: d,
      easing: EASING.emphasis,
    }),
    anim(bottom, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], {
      duration: d,
      easing: EASING.emphasis,
    }),
    anim(line, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
      duration: d,
      easing: EASING.emphasis,
    }),
  ])
  if (o.cancelled()) return
  await o.commit()
  if (o.cancelled()) return

  const e = t(240)
  await Promise.all([
    anim(top, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], {
      duration: e,
      easing: EASING.enter,
    }),
    anim(bottom, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], {
      duration: e,
      easing: EASING.enter,
    }),
    anim(line, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], {
      duration: e,
      easing: EASING.exit,
    }),
    anim(label, [{ opacity: 1 }, { opacity: 0 }], { duration: t(120), easing: EASING.exit }),
  ])
}

/* ---------- 5. 共享主体 ---------- */
async function runShared(
  o: PlayOptions,
  root: HTMLElement,
  t: (ms: number) => number,
  anim: AnimFn,
) {
  const scrim = div('hc-tx__scrim', root)
  await anim(scrim, [{ opacity: 0 }, { opacity: 1 }], {
    duration: t(150),
    easing: EASING.standard,
  })
  if (o.cancelled()) return
  await o.commit()
  if (o.cancelled()) return

  const target = document.querySelector<HTMLElement>('[data-shared-title]')
  const r = target?.getBoundingClientRect()
  const anchor = o.anchor

  if (!target || !r || r.width < 2 || !anchor) {
    await anim(scrim, [{ opacity: 1 }, { opacity: 0 }], {
      duration: t(280),
      easing: EASING.enter,
    })
    return
  }

  const cs = getComputedStyle(target)
  const clone = div('hc-tx__clone', root)
  clone.textContent = o.label || target.textContent || ''
  clone.style.left = `${r.left}px`
  clone.style.top = `${r.top}px`
  clone.style.width = `${r.width}px`
  clone.style.height = `${r.height}px`
  clone.style.fontFamily = cs.fontFamily
  clone.style.fontSize = cs.fontSize
  clone.style.fontWeight = cs.fontWeight
  clone.style.letterSpacing = cs.letterSpacing
  clone.style.lineHeight = cs.lineHeight
  clone.style.color = cs.color

  target.style.visibility = 'hidden'

  const s = clamp(anchor.width / Math.max(r.width, 1), 0.16, 1)
  const tx = anchor.left + (anchor.width - r.width * s) / 2 - r.left
  const ty = anchor.top + (anchor.height - r.height * s) / 2 - r.top

  const main = mainEl()
  if (main) {
    void anim(main, [{ opacity: 0.15 }, { opacity: 1 }], {
      duration: t(360),
      delay: t(120),
      easing: EASING.enter,
    })
  }

  try {
    await Promise.all([
      anim(
        clone,
        [
          { transform: `translate3d(${tx}px,${ty}px,0) scale(${s})`, opacity: 0.9 },
          { transform: 'translate3d(0,0,0) scale(1)', opacity: 1 },
        ],
        { duration: t(480), easing: EASING.emphasis },
      ),
      anim(scrim, [{ opacity: 1 }, { opacity: 0 }], {
        duration: t(300),
        delay: t(80),
        easing: EASING.enter,
      }),
    ])
  } finally {
    target.style.visibility = ''
    clone.remove()
  }
}

/* ---------- 6. 阶梯推挤（AK 错位线条 / 阶梯边缘） ---------- */
async function runSteps(
  o: PlayOptions,
  root: HTMLElement,
  t: (ms: number) => number,
  anim: AnimFn,
) {
  const bands = 4
  const el: HTMLElement[] = []
  for (let i = 0; i < bands; i++) {
    const b = div('hc-tx__band', root)
    b.style.top = `${i * (100 / bands)}%`
    b.style.height = `${100 / bands + 0.3}%`
    b.style.borderRightColor = i === 1 ? 'var(--hc-accent)' : 'var(--hc-line-2)'
    el.push(b)
  }
  const inSign = o.direction === 'back' ? '' : '-'
  const outSign = o.direction === 'back' ? '-' : ''
  const cover = el.map((b, i) =>
    anim(
      b,
      [
        { transform: `translate3d(${inSign}104%,0,0) skewX(-8deg)` },
        { transform: 'translate3d(0,0,0) skewX(-8deg)' },
      ],
      { duration: t(280), delay: i * t(50), easing: EASING.emphasis },
    ),
  )
  await Promise.all(cover)
  if (o.cancelled()) return
  await o.commit()
  if (o.cancelled()) return
  const e = t(240)
  await Promise.all(
    el.map((b, i) =>
      anim(
        b,
        [
          { transform: 'translate3d(0,0,0) skewX(-8deg)' },
          { transform: `translate3d(${outSign}104%,0,0) skewX(-8deg)` },
        ],
        { duration: e, delay: (bands - 1 - i) * t(40), easing: EASING.enter },
      ),
    ),
  )
}

/* ---------- 7. 四向快门（四块角板向中心合拢） ---------- */
async function runShutter(
  o: PlayOptions,
  root: HTMLElement,
  t: (ms: number) => number,
  anim: AnimFn,
) {
  const geo: { top: string; left: string; right: string; bottom: string; bw: string }[] = [
    { top: '0', left: '0', right: 'auto', bottom: 'auto', bw: '0 2px 2px 0' },
    { top: '0', left: 'auto', right: '0', bottom: 'auto', bw: '0 0 2px 2px' },
    { top: 'auto', left: '0', right: 'auto', bottom: '0', bw: '2px 2px 0 0' },
    { top: 'auto', left: 'auto', right: '0', bottom: '0', bw: '2px 0 0 2px' },
  ]
  const blocks = geo.map((g) => {
    const b = div('hc-tx__quad', root)
    b.style.top = g.top
    b.style.bottom = g.bottom
    b.style.left = g.left
    b.style.right = g.right
    b.style.borderWidth = g.bw
    b.style.transformOrigin = `${g.left === 'auto' ? '100%' : '0%'} ${g.top === 'auto' ? '100%' : '0%'}`
    return b
  })
  const seamV = div('hc-tx__seam', root)
  seamV.style.left = '50%'
  seamV.style.top = '0'
  seamV.style.bottom = '0'
  seamV.style.width = '2px'
  const seamH = div('hc-tx__seam', root)
  seamH.style.top = '50%'
  seamH.style.left = '0'
  seamH.style.right = '0'
  seamH.style.height = '2px'
  const dia = div('hc-tx__diamond', root)

  const d = t(240)
  await Promise.all([
    ...blocks.map((b) =>
      anim(b, [{ transform: 'scale(0)' }, { transform: 'scale(1)' }], {
        duration: d,
        easing: EASING.emphasis,
      }),
    ),
    anim(seamV, [{ scaleY: 0 }, { scaleY: 1 }] as Keyframe[], { duration: d, easing: EASING.emphasis }),
    anim(seamH, [{ scaleX: 0 }, { scaleX: 1 }] as Keyframe[], { duration: d, easing: EASING.emphasis }),
    anim(dia, [{ transform: 'rotate(45deg) scale(0)' }, { transform: 'rotate(135deg) scale(1)' }], {
      duration: d,
      easing: EASING.emphasis,
    }),
  ])
  if (o.cancelled()) return
  await o.commit()
  if (o.cancelled()) return
  const e = t(220)
  await Promise.all([
    ...blocks.map((b) =>
      anim(b, [{ transform: 'scale(1)' }, { transform: 'scale(0)' }], {
        duration: e,
        easing: EASING.enter,
      }),
    ),
    anim(seamV, [{ opacity: 1 }, { opacity: 0 }], { duration: e, easing: EASING.exit }),
    anim(seamH, [{ opacity: 1 }, { opacity: 0 }], { duration: e, easing: EASING.exit }),
    anim(dia, [{ transform: 'rotate(135deg) scale(1)' }, { transform: 'rotate(225deg) scale(0)' }], {
      duration: e,
      easing: EASING.enter,
    }),
  ])
}

/* ---------- 8. 纸面翻页（整张纸面横推，折影随行） ---------- */
async function runSheet(
  o: PlayOptions,
  root: HTMLElement,
  t: (ms: number) => number,
  anim: AnimFn,
) {
  const sheet = div('hc-tx__sheet hc-paper', root)
  const label = div('hc-tx__sheetlabel', sheet)
  const strong = document.createElement('strong')
  strong.textContent = o.label
  const meta = document.createElement('span')
  meta.textContent = o.meta
  label.append(strong, meta)
  const inSign = o.direction === 'back' ? '' : '-'
  const outSign = o.direction === 'back' ? '-' : ''
  // 折影：前缘阴影 + 2px 信号边
  sheet.style.boxShadow = `${o.direction === 'back' ? -12 : 12}px 0 32px rgba(0,0,0,.4)`
  sheet.style.borderRight = o.direction === 'back' ? 'none' : '2px solid var(--hc-accent)'
  sheet.style.borderLeft = o.direction === 'back' ? '2px solid var(--hc-accent)' : 'none'

  const d = t(280)
  await anim(
    sheet,
    [
      { transform: `translate3d(${inSign}104%,0,0)` },
      { transform: 'translate3d(0,0,0)' },
    ],
    { duration: d, easing: EASING.emphasis },
  )
  if (o.cancelled()) return
  await o.commit()
  if (o.cancelled()) return
  const e = t(300)
  await anim(
    sheet,
    [
      { transform: 'translate3d(0,0,0)' },
      { transform: `translate3d(${outSign}104%,0,0)` },
    ],
    { duration: e, easing: EASING.enter },
  )
}

/* ---------- 9. 信号故障（八条切片抖动 + 信号橙压满） ---------- */
async function runGlitch(
  o: PlayOptions,
  root: HTMLElement,
  t: (ms: number) => number,
  anim: AnimFn,
) {
  const slices = 8
  const fills = [
    'var(--hc-accent)',
    'var(--hc-ink)',
    'var(--hc-info)',
    'var(--hc-accent)',
    'var(--hc-surface-3)',
    'var(--hc-ink)',
    'var(--hc-accent)',
    'var(--hc-info)',
  ]
  const els: HTMLElement[] = []
  for (let i = 0; i < slices; i++) {
    const g = div('hc-tx__glitch', root)
    g.style.top = `${i * (100 / slices)}%`
    g.style.height = `${100 / slices + 0.3}%`
    g.style.background = fills[i % fills.length]
    els.push(g)
  }
  const flickers = els.map((g, i) =>
    anim(
      g,
      [
        { opacity: 0, transform: 'translateX(-1.5%)' },
        { opacity: 1, transform: 'translateX(0.8%)', offset: 0.45 },
        { opacity: 1, transform: 'translateX(-0.6%)', offset: 0.75 },
        { opacity: 0, transform: 'translateX(0)' },
      ],
      { duration: t(220), delay: i * t(14), easing: 'linear' },
    ),
  )
  const flash = div('hc-tx__flash', root)
  flash.style.background = 'var(--hc-accent)'
  await Promise.all([
    ...flickers,
    anim(flash, [{ opacity: 0 }, { opacity: 1 }], {
      duration: t(90),
      delay: t(190),
      easing: EASING.standard,
    }),
  ])
  if (o.cancelled()) return
  await o.commit()
  if (o.cancelled()) return
  const e = t(120)
  await anim(flash, [{ opacity: 1 }, { opacity: 0 }], { duration: e, easing: EASING.exit })
}
