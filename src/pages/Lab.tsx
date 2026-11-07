import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useTransition } from '../transition/TransitionProvider'
import type { Direction, Phase } from '../transition/TransitionProvider'
import type { TransitionKind } from '../transition/playTransition'
import { Curve } from '../components/Sigil'
import { Drawer, Modal } from '../components/overlays'
import {
  Button,
  Checkbox,
  DataRow,
  EmptyState,
  Progress,
  SampleTag,
  SearchInput,
  Segmented,
  Skeleton,
  Status,
  Tabs,
  Tag,
  Toggle,
  useToast,
} from '../components/ui'
import {
  IconAlert,
  IconArrowRight,
  IconCheck,
  IconCopy,
  IconInfo,
  IconPause,
  IconPlay,
  IconRefresh,
  IconSignal,
  IconStop,
} from '../components/Icon'

const LAB_TABS = [
  { id: 'tokens', label: '视觉令牌', en: '01', note: '颜色、字阶、间距与图形语汇' },
  { id: 'components', label: '组件状态', en: '02', note: '按钮、表单、列表与容器' },
  { id: 'motion', label: '转场实验', en: '03', note: '阶段、方向、速度与曲线' },
  { id: 'states', label: '全局状态', en: '04', note: '弹层、空状态与可访问性' },
]

const SWATCHES = [
  { name: 'canvas', value: '#111315', role: '页面底色', css: 'var(--hc-canvas)' },
  { name: 'surface', value: '#1B1E20', role: '内容面', css: 'var(--hc-surface)' },
  { name: 'surface-2', value: '#222628', role: '浮层面', css: 'var(--hc-surface-2)' },
  { name: 'ink', value: '#F8F8F5', role: '主文字', css: 'var(--hc-ink)' },
  { name: 'ink-3', value: 'rgba(248,248,245,.5)', role: '辅助文字', css: 'var(--hc-ink-3)' },
  { name: 'line-2', value: 'rgba(248,248,245,.18)', role: '结构线', css: 'var(--hc-line-2)' },
  { name: 'accent', value: '随频道', role: '主强调', css: 'var(--hc-accent)' },
  { name: 'success', value: '#46C47C', role: '成功', css: 'var(--hc-success)' },
  { name: 'warn', value: '#F1C644', role: '警示', css: 'var(--hc-warn)' },
  { name: 'danger', value: '#E33B3B', role: '危险', css: 'var(--hc-danger)' },
]

const TYPE_ROWS = [
  { meta: 'DISPLAY', text: '蜜果城', size: 52, weight: 700, ls: '-0.035em', lh: 0.98 },
  { meta: 'H1', text: '频道索引 与 排程', size: 38, weight: 700, ls: '-0.015em', lh: 1.1 },
  { meta: 'H2', text: '中央塔主赛区信号', size: 26, weight: 600, ls: '0', lh: 1.3 },
  { meta: 'BODY', text: '信号由中央塔统一调度，机位切换由导播组确认。', size: 14, weight: 400, ls: '0', lh: 1.55 },
  { meta: 'CAPTION', text: 'HONEY CITY / RIVALRY CHANNEL', size: 11, weight: 400, ls: '0.18em', lh: 1.5 },
]

const SPACES = [4, 8, 12, 16, 24, 32, 48, 64, 88]

const CURVES: { name: string; p: [number, number, number, number]; token: string; use: string; dur: number }[] = [
  { name: 'standard', p: [0.2, 0, 0, 1], token: '--ease-standard', use: '通用位移 / 状态', dur: 200 },
  { name: 'enter', p: [0.2, 0.8, 0.2, 1], token: '--ease-enter', use: '进入 / 揭示', dur: 300 },
  { name: 'exit', p: [0.4, 0, 1, 1], token: '--ease-exit', use: '退出 / 让位', dur: 120 },
  { name: 'emphasis', p: [0.2, 0.8, 0.2, 1], token: '--ease-emphasis', use: '遮罩 / 演出', dur: 680 },
]

const TRANSITIONS: {
  kind: TransitionKind
  name: string
  en: string
  desc: string
  duration: string
  easing: string
  layers: string
  dir: boolean
  params: [string, string][]
}[] = [
  {
    kind: 'mask',
    name: '大块几何遮罩',
    en: 'GEOMETRY MASK',
    desc: '三层斜切矩形错位推进，覆盖完成后替换内容，再反向滑出。标签层独立固定，保证覆盖期可读。',
    duration: '460 / 420ms',
    easing: 'emphasis / enter',
    layers: '3（快速 2）',
    dir: true,
    params: [
      ['单层时长', '300ms'],
      ['层间延迟', '80ms'],
      ['标签进入', '180ms @250ms'],
      ['方向', '左进 / 右进'],
    ],
  },
  {
    kind: 'slices',
    name: '几何切片拼贴',
    en: 'SLICE COLLAGE',
    desc: '4–6 条竖向切片按固定时间表依次升起，退出逆序收拢，小屏自动减少切片数量。',
    duration: '410 / 350ms',
    easing: 'emphasis / enter',
    layers: '6 / 4 / 3',
    dir: true,
    params: [
      ['切片数', '6（<760px 4）'],
      ['单层时长', '240ms'],
      ['步进', '34ms'],
      ['方向', '上升 / 下降'],
    ],
  },
  {
    kind: 'zoom',
    name: '缩放聚焦',
    en: 'ZOOM FOCUS',
    desc: '以点击目标矩形为起点放大至全屏，中心对齐后交换内容，再淡出并让新页面轻微回落。',
    duration: '360 / 260ms',
    easing: 'emphasis / exit',
    layers: '1 + 标签',
    dir: false,
    params: [
      ['起点', '目标 rect'],
      ['倍率', 'max(vw/aw, vh/ah)×1.08'],
      ['标签', '180ms @80ms'],
      ['收尾', '主区 1.012→1'],
    ],
  },
  {
    kind: 'wipe',
    name: '上下擦入',
    en: 'VERTICAL WIPE',
    desc: '上下两条斜纹面板向中线合拢，2px 接缝与标签芯片落在中线上，退出时反向分离。',
    duration: '260 / 240ms',
    easing: 'emphasis / enter',
    layers: '2 + 接缝',
    dir: false,
    params: [
      ['面板', '50% + 50%'],
      ['接缝', '2px accent'],
      ['标签', '芯片 + 150ms'],
      ['适用', '同层级切换'],
    ],
  },
  {
    kind: 'shared',
    name: '共享主体',
    en: 'SHARED SUBJECT',
    desc: '目标页标题从来源矩形的位置与比例连续飞入，其余内容随后淡入；无锚点时退回淡出。',
    duration: '480ms',
    easing: 'emphasis',
    layers: '克隆 + 遮罩',
    dir: false,
    params: [
      ['共享元素', '[data-shared-title]'],
      ['飞行', '480ms'],
      ['遮罩', '150 / 300ms'],
      ['降级', '无目标 → 淡出'],
    ],
  },
]

const PHASES: { id: Phase; en: string; cn: string }[] = [
  { id: 'cover', en: 'COVER', cn: '遮盖' },
  { id: 'commit', en: 'COMMIT', cn: '提交' },
  { id: 'reveal', en: 'REVEAL', cn: '揭示' },
  { id: 'cleanup', en: 'CLEANUP', cn: '清理' },
]

/* ---------- 转场缩略图 ---------- */
function TxPreview({ kind, fit = 'none' }: { kind: TransitionKind; fit?: string }) {
  const A = 'var(--hc-accent)'
  return (
    <svg viewBox="0 0 240 108" width="100%" height="100%" preserveAspectRatio={fit} aria-hidden="true">
      <g stroke="var(--hc-line-2)" fill="none">
        <path d="M0 0h240v108H0z" />
        <path d="M0 54h240M120 0v108" strokeDasharray="1 5" opacity=".5" />
      </g>
      {kind === 'mask' && (
        <>
          <path d="M14 6h74l-30 96H14z" fill={A} opacity=".2" stroke={A} />
          <path d="M82 6h74l-30 96H52z" fill="var(--hc-ink)" opacity=".08" stroke="var(--hc-line-3)" />
          <path d="M150 6h76l-30 96h-76z" fill="var(--hc-surface-3)" stroke="var(--hc-line-3)" />
          <path d="M196 12v84" stroke={A} strokeWidth="1.5" />
        </>
      )}
      {kind === 'slices' && (
        <>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={12 + i * 36}
              y={14 + (i % 2) * 10}
              width="32"
              height={80 - (i % 2) * 10}
              fill={i % 3 === 0 ? A : 'var(--hc-surface-3)'}
              opacity={i % 3 === 0 ? '.35' : '.9'}
              stroke="var(--hc-line-2)"
            />
          ))}
        </>
      )}
      {kind === 'zoom' && (
        <>
          <rect x="94" y="34" width="52" height="40" fill={A} opacity=".22" stroke={A} />
          <rect x="74" y="22" width="92" height="64" fill="none" stroke="var(--hc-line-3)" />
          <rect x="44" y="6" width="152" height="96" fill="none" stroke="var(--hc-line-2)" />
          <path d="M120 2v104M2 54h236" stroke={A} opacity=".35" strokeDasharray="2 6" />
        </>
      )}
      {kind === 'wipe' && (
        <>
          <rect x="0" y="0" width="240" height="40" fill="var(--hc-surface-3)" />
          <rect x="0" y="68" width="240" height="40" fill="var(--hc-surface-3)" />
          <path d="M0 40h240M0 68h240" stroke={A} />
          <path d="M110 54h20" stroke={A} strokeWidth="3" />
        </>
      )}
      {kind === 'steps' && (
        <>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={-10 + i * 18}
              y={i * 27}
              width="150"
              height="27"
              fill={i === 1 ? A : 'var(--hc-surface-3)'}
              opacity={i === 1 ? '.35' : '.9'}
              stroke="var(--hc-line-2)"
              transform="skewX(-8)"
            />
          ))}
          <path d="M120 2v104" stroke={A} strokeWidth="2" />
        </>
      )}
      {kind === 'shutter' && (
        <>
          <rect x="0" y="0" width="120" height="54" fill="var(--hc-surface-3)" />
          <rect x="120" y="0" width="120" height="54" fill="var(--hc-surface-3)" />
          <rect x="0" y="54" width="120" height="54" fill="var(--hc-surface-3)" />
          <rect x="120" y="54" width="120" height="54" fill="var(--hc-surface-3)" />
          <path d="M120 0v108M0 54h240" stroke={A} strokeWidth="2" />
          <path d="M120 42 132 54 120 66 108 54z" fill={A} />
        </>
      )}
      {kind === 'sheet' && (
        <>
          <rect x="-30" y="0" width="150" height="108" fill="var(--hc-paper)" opacity=".92" />
          <path d="M120 0v108" stroke={A} strokeWidth="2" />
          <path d="M30 30h60M30 42h44" stroke="var(--hc-line-3)" />
          <text x="126" y="50" fontFamily="var(--hc-font-mono)" fontSize="9" fill="currentColor" opacity=".6">
            {String.fromCharCode(86, 69, 82, 89)}
          </text>
        </>
      )}
      {kind === 'glitch' && (
        <>
          {[
            [0, 'var(--hc-accent)', -4],
            [14, 'var(--hc-ink)', 3],
            [28, 'var(--hc-info)', -2],
            [54, 'var(--hc-accent)', 5],
            [68, 'var(--hc-surface-3)', -3],
            [82, 'var(--hc-ink)', 2],
          ].map(([y, f, dx], i) => (
            <rect key={i} x={Number(dx)} y={Number(y)} width="240" height="10" fill={String(f)} opacity=".85" />
          ))}
        </>
      )}
      {kind === 'shared' && (
        <>
          <rect x="18" y="72" width="58" height="24" fill="none" stroke="var(--hc-line-3)" />
          <rect x="118" y="14" width="104" height="26" fill={A} opacity=".25" stroke={A} />
          <path d="M76 72 118 40" stroke={A} strokeDasharray="3 4" />
          <circle cx="76" cy="72" r="2.5" fill={A} />
          <circle cx="118" cy="40" r="2.5" fill={A} />
        </>
      )}
    </svg>
  )
}

function CurveDemo({ p, dur }: { p: [number, number, number, number]; dur: number }) {
  const box = useRef<HTMLDivElement>(null)
  const anim = useRef<Animation | null>(null)
  const [state, setState] = useState<'idle' | 'running' | 'paused'>('idle')

  const play = () => {
    const el = box.current
    if (!el) return
    anim.current?.cancel()
    const a = el.animate([{ transform: 'translateX(-52px)' }, { transform: 'translateX(52px)' }], {
      duration: dur,
      easing: `cubic-bezier(${p.join(',')})`,
      fill: 'both',
    })
    anim.current = a
    setState('running')
    a.finished.then(() => setState('idle')).catch(() => undefined)
  }

  const toggle = () => {
    const a = anim.current
    if (!a) {
      play()
      return
    }
    if (a.playState === 'running') {
      a.pause()
      setState('paused')
    } else {
      a.play()
      setState('running')
    }
  }

  const reset = () => {
    anim.current?.cancel()
    anim.current = null
    setState('idle')
  }

  return (
    <div>
      <div className="hc-demo">
        <div className="hc-demo__box" ref={box} />
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <Button
          size="sm"
          variant="ghost"
          onClick={toggle}
          icon={state === 'running' ? <IconPause size={11} /> : <IconPlay size={11} />}
        >
          {state === 'running' ? '暂停' : state === 'paused' ? '继续' : '播放'}
        </Button>
        <Button size="sm" variant="ghost" onClick={reset} icon={<IconRefresh size={11} />}>
          复位
        </Button>
      </div>
    </div>
  )
}

export function Lab() {
  const {
    navigate,
    settings,
    updateSettings,
    resetSettings,
    phase,
    paused,
    pauseTransition,
    resumeTransition,
    cancelTransition,
    transitioning,
  } = useTransition()
  const toast = useToast()

  const [tab, setTab] = useState(() => {
    const q = new URLSearchParams(window.location.search).get('tab')
    return LAB_TABS.some((t) => t.id === q) ? (q as string) : 'tokens'
  })
  const [kind, setKind] = useState<TransitionKind>('mask')
  const [direction, setDirection] = useState<Direction>('forward')
  const [drawer, setDrawer] = useState(false)
  const [modal, setModal] = useState<'confirm' | 'danger' | null>(null)
  const [toggleA, setToggleA] = useState(true)
  const [toggleB, setToggleB] = useState(false)
  const [checked, setChecked] = useState(true)
  const [density, setDensity] = useState<'compact' | 'normal' | 'loose'>('normal')
  const [compoTab, setCompoTab] = useState('a')
  const [query, setQuery] = useState('')
  const [loadingDemo, setLoadingDemo] = useState(false)
  const [tokenVals, setTokenVals] = useState<Record<string, string>>({})
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cs = getComputedStyle(document.documentElement)
    const read = (name: string) =>
      cs
        .getPropertyValue(name)
        .trim()
        .replace(/\(\s*/g, '(')
        .replace(/,\s+/g, ',')
    setTokenVals({
      canvas: read('--hc-canvas'),
      surface: read('--hc-surface'),
      'surface-2': read('--hc-surface-2'),
      ink: read('--hc-ink'),
      'ink-3': read('--hc-ink-3'),
      'line-2': read('--hc-line-2'),
      accent: read('--hc-accent'),
      success: read('--hc-success'),
      warn: read('--hc-warn'),
      danger: read('--hc-danger'),
    })
  }, [settings.theme, settings.motion])

  const active = TRANSITIONS.find((t) => t.kind === kind) ?? TRANSITIONS[0]
  const phaseIndex = phase ? PHASES.findIndex((p) => p.id === phase) : -1

  // 转场播放时遮罩会拦截指针，暂停 / 复位改用键盘
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!transitioning) return
      if (e.code === 'Space') {
        e.preventDefault()
        if (paused) resumeTransition()
        else pauseTransition()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        cancelTransition()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [transitioning, paused, pauseTransition, resumeTransition, cancelTransition])

  const changeTab = (id: string) => {
    setTab(id)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', id)
    history.replaceState(null, '', url)
  }

  const play = (e?: ReactMouseEvent<HTMLElement>) => {
    const anchor =
      e?.currentTarget.getBoundingClientRect() ??
      previewRef.current?.getBoundingClientRect() ??
      null
    navigate(
      { name: 'lab' },
      {
        force: true,
        kind,
        direction,
        anchor,
        label: '设计实验室',
        keepScroll: true,
      },
    )
  }

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ text: `已复制${label}`, meta: 'CLIPBOARD', kind: 'success' })
    } catch {
      toast({ text: '剪贴板不可用', meta: 'CLIPBOARD / DENIED', kind: 'warn' })
    }
  }

  return (
    <div className="hc-page hc-lab">
      <header className="hc-pagehead">
        <div>
          <div className="hc-pagehead__kicker">
            SYSTEM LAB / 05
            <SampleTag />
          </div>
          <h1 data-page-title tabIndex={-1}>
            组件与动效 <em>/ 实验台</em>
          </h1>
          <div className="hc-pagehead__en">TOKENS · COMPONENTS · MOTION · STATES</div>
          <p className="hc-pagehead__desc">
            左侧选样本，中间看预览，右侧调参数。转场播放的是真实页面切换，不是示意图；阶段、速度、方向与减少动态都会立即生效。
          </p>
        </div>
        <div className="hc-pagehead__meta">
          <b>09</b>
          TRANSITIONS
          <span>
            SPEED {settings.speed}× / {settings.quick ? 'QUICK' : 'FULL'} /{' '}
            {settings.reduceMotion ? 'REDUCE' : 'MOTION'}
          </span>
        </div>
      </header>

      <div className="hc-work">
        <aside className="hc-work__nav" aria-label="实验分类">
          <div className="hc-work__navhead">LAB / P2 实验台</div>
          <nav>
            {LAB_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                className="hc-work__navitem"
                aria-current={tab === t.id ? 'true' : undefined}
                onClick={() => changeTab(t.id)}
              >
                <span className="num">{t.en}</span>
                <span>
                  <b>{t.label}</b>
                  <em>{t.note}</em>
                </span>
              </button>
            ))}
          </nav>
          <div className="hc-work__navfoot">
            <div className="hc-work__meta">
              <span>{settings.theme === 'paper' ? 'PAPER' : 'DARK'}</span>
              <span>{settings.reduceMotion ? 'REDUCE' : 'FULL MOTION'}</span>
            </div>
            <Button size="sm" variant="ghost" onClick={() => resetSettings()}>
              恢复默认
            </Button>
          </div>
        </aside>

        <main className="hc-work__stage">
          {tab === 'tokens' && (
            <div className="hc-lab__panel">
              <section className="hc-lab-block">
                <header>
                  <h3>语义色</h3>
                  <em>COLOR / 10 TOKENS</em>
                  <span className="grow" />
                  <span className="hc-en">C + D 级</span>
                </header>
                <div className="hc-lab-block__body" style={{ padding: 0 }}>
                  <div className="hc-swatches">
                    {SWATCHES.map((s) => (
                      <div className="hc-swatch" key={s.name}>
                        <div className="hc-swatch__chip" style={{ background: s.css }} />
                        <b>{s.role}</b>
                        <span>
                          {s.name} · {tokenVals[s.name] ?? s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="hc-lab-block">
                <header>
                  <h3>字体与排版</h3>
                  <em>TYPE / SCALE</em>
                </header>
                <div className="hc-lab-block__body">
                  {TYPE_ROWS.map((t) => (
                    <div className="hc-type-row" key={t.meta}>
                      <span className="meta">{t.meta}</span>
                      <span
                        style={{
                          fontSize: t.size,
                          fontWeight: t.weight,
                          letterSpacing: t.ls,
                          lineHeight: t.lh,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t.text}
                      </span>
                      <span className="meta">
                        {t.weight} / {t.ls}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="hc-lab-block">
                <header>
                  <h3>间距与图形语汇</h3>
                  <em>SPACE / GEOMETRY</em>
                </header>
                <div className="hc-lab-block__body">
                  {SPACES.map((s) => (
                    <div className="hc-space-row" key={s}>
                      <span>sp-{s / 4}</span>
                      <i style={{ width: s * 2 }} />
                      <span>{s}px</span>
                    </div>
                  ))}
                  <div className="hc-geomrow">
                    <div>
                      <span className="hc-halftone" />
                      <em>HALFTONE</em>
                    </div>
                    <div>
                      <span className="hc-stripe" />
                      <em>STRIPE</em>
                    </div>
                    <div>
                      <span className="hc-ticks" />
                      <em>CORNER</em>
                    </div>
                    <div>
                      <span className="hc-bar-left is-active" />
                      <em>ACCENT BAR</em>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

          {tab === 'components' && (
            <div className="hc-lab__panel">
              <section className="hc-lab-block">
                <header>
                  <h3>按钮</h3>
                  <em>BUTTON / 8 STATES</em>
                </header>
                <div className="hc-lab-block__body">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
                    <Button variant="primary" icon={<IconArrowRight size={14} />}>主操作</Button>
                    <Button>次操作</Button>
                    <Button variant="ghost">文字操作</Button>
                    <Button variant="primary" loading>提交中</Button>
                    <Button variant="primary" confirmed icon={<IconCheck size={13} />}>已确认</Button>
                    <Button disabled>不可用</Button>
                    <Button aria-label="图标按钮"><IconSignal size={16} /></Button>
                  </div>
                  <div className="hc-state-table" style={{ marginTop: 16 }}>
                    <div className="head">组件</div>
                    <div className="head">默认</div>
                    <div className="head">悬停</div>
                    <div className="head">按下</div>
                    <div className="head">禁用</div>
                    <div>主按钮</div>
                    <div>accent 实底</div>
                    <div>反转为 ink</div>
                    <div>下移 1px</div>
                    <div>虚线 + 斜纹</div>
                    <div>次级按钮</div>
                    <div>1px 线框</div>
                    <div>ink 填充扫入</div>
                    <div>下移 1px</div>
                    <div>虚线，无 hover</div>
                    <div>图标按钮</div>
                    <div>36×36</div>
                    <div>填充 + 提亮</div>
                    <div>下移 1px</div>
                    <div>透明度 40%</div>
                  </div>
                </div>
              </section>

              <section className="hc-lab-block">
                <header>
                  <h3>导航与标签</h3>
                  <em>TABS / SEGMENTED / TAGS</em>
                </header>
                <div className="hc-lab-block__body">
                  <Tabs
                    items={[
                      { id: 'a', label: '频道总览', en: '01' },
                      { id: 'b', label: '信号记录', en: '02' },
                      { id: 'c', label: '值班安排', en: '03' },
                    ]}
                    value={compoTab}
                    onChange={setCompoTab}
                    label="组件示例分区"
                    idBase="demo"
                  />
                  <div
                    id={`demo-panel-${compoTab}`}
                    role="tabpanel"
                    style={{ padding: '16px 0', fontSize: 12, color: 'var(--hc-ink-3)', minHeight: 52 }}
                  >
                    指示条沿轨道滑动，切换可被连续点击打断；左右方向键可切换。
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                    <Segmented
                      label="视图密度"
                      value={density}
                      options={[
                        { value: 'compact', label: '紧凑' },
                        { value: 'normal', label: '标准' },
                        { value: 'loose', label: '宽松' },
                      ]}
                      onChange={setDensity}
                    />
                    <Tag variant="solid">已选中</Tag>
                    <Tag variant="accent">强调</Tag>
                    <Tag>默认</Tag>
                    <Tag variant="muted">弱化</Tag>
                    <Status kind="live">直播中</Status>
                    <Status kind="ok">已发布</Status>
                    <Status kind="warn">审核中</Status>
                    <Status kind="idle">已归档</Status>
                  </div>
                </div>
              </section>

              <section className="hc-lab-block">
                <header>
                  <h3>表单与占位</h3>
                  <em>INPUT / CHECK / TOGGLE / SKELETON</em>
                </header>
                <div className="hc-lab-block__body">
                  <div className="hc-formgrid">
                    <div className="hc-field">
                      <span className="hc-label">检索</span>
                      <SearchInput
                        value={query}
                        onChange={setQuery}
                        onClear={() => setQuery('')}
                        placeholder="输入关键词"
                      />
                    </div>
                    <div className="hc-field">
                      <span className="hc-label">复选</span>
                      <Checkbox label="仅看公开" checked={checked} onChange={setChecked} />
                      <Checkbox label="含归档" checked={false} onChange={() => undefined} />
                    </div>
                    <div className="hc-field">
                      <span className="hc-label">开关</span>
                      <Toggle label="信号加密" checked={toggleA} onChange={setToggleA} />
                      <Toggle label="自动同步" checked={toggleB} onChange={setToggleB} />
                    </div>
                    <div className="hc-field">
                      <span className="hc-label">进度</span>
                      <Progress value={toggleA ? 68 : 24} label="同步进度" />
                      <span className="hc-mono" style={{ fontSize: 10, color: 'var(--hc-ink-4)' }}>
                        {toggleA ? '68% / 同步中' : '24% / 已暂停'}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
                    <Button size="sm" variant="ghost" onClick={() => setLoadingDemo(true)}>
                      骨架屏
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setLoadingDemo(false)}>
                      复位
                    </Button>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    {loadingDemo ? (
                      <div style={{ display: 'grid', gap: 8 }}>
                        <Skeleton height={14} width="46%" />
                        <Skeleton height={12} width="82%" />
                        <Skeleton height={12} width="64%" />
                      </div>
                    ) : (
                      <EmptyState
                        code="NO DATA / DEMO"
                        title="这里本来应该有一条记录"
                        desc="空状态保留结构：编号、标题、一句原因与一个可选操作。"
                        action={<Button size="sm">新建记录</Button>}
                      />
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}

          {tab === 'motion' && (
            <div className="hc-lab__panel">
              <section className="hc-lab-block">
                <header>
                  <h3>转场样本</h3>
                  <em>TRANSITION / 09</em>
                  <span className="grow" />
                  <span className="hc-en">真实页面切换</span>
                </header>
                <div className="hc-lab-block__body" style={{ paddingTop: 12 }}>
                  <div
                    className="hc-txpick"
                    role="tablist"
                    aria-label="转场样本"
                    onKeyDown={(e) => {
                      const idx = TRANSITIONS.findIndex((t) => t.kind === kind)
                      let next = idx
                      if (e.key === 'ArrowRight') next = (idx + 1) % TRANSITIONS.length
                      else if (e.key === 'ArrowLeft')
                        next = (idx - 1 + TRANSITIONS.length) % TRANSITIONS.length
                      else if (e.key === 'Home') next = 0
                      else if (e.key === 'End') next = TRANSITIONS.length - 1
                      else return
                      e.preventDefault()
                      const target = TRANSITIONS[next]
                      setKind(target.kind)
                      window.setTimeout(() => {
                        document.getElementById(`tx-tab-${target.kind}`)?.focus()
                      }, 0)
                    }}
                  >
                    {TRANSITIONS.map((t) => (
                      <button
                        key={t.kind}
                        id={`tx-tab-${t.kind}`}
                        type="button"
                        role="tab"
                        aria-selected={kind === t.kind}
                        aria-controls="tx-panel"
                        tabIndex={kind === t.kind ? 0 : -1}
                        className="hc-txpick__item"
                        onClick={() => setKind(t.kind)}
                      >
                        <span className="hc-txpick__thumb">
                          <TxPreview kind={t.kind} />
                        </span>
                        <span className="hc-txpick__name">{t.name}</span>
                        <span className="hc-txpick__en">{t.en}</span>
                      </button>
                    ))}
                  </div>

                  <div
                    className="hc-motion"
                    id="tx-panel"
                    role="tabpanel"
                    aria-labelledby={`tx-tab-${kind}`}
                  >
                    <div className="hc-motion__preview" ref={previewRef}>
                      <TxPreview kind={kind} fit="xMidYMid meet" />
                      <div className="hc-motion__phase" aria-live="polite">
                        {PHASES.map((p, i) => (
                          <div
                            key={p.id}
                            className="hc-phase"
                            data-active={phase === p.id ? 'true' : undefined}
                            data-done={phaseIndex > i ? 'true' : undefined}
                          >
                            <span className="hc-phase__bar" />
                            <b>{p.en}</b>
                            <em>{p.cn}</em>
                          </div>
                        ))}
                      </div>
                      <div className="hc-motion__status">
                        <span>当前阶段</span>
                        <b>{phase ? PHASES.find((p) => p.id === phase)?.en : 'IDLE'}</b>
                        <span>·</span>
                        <span>{paused ? 'PAUSED' : transitioning ? 'RUNNING' : 'READY'}</span>
                      </div>
                    </div>

                    <div className="hc-motion__side">
                      <h4>{active.name}</h4>
                      <div className="hc-en">{active.en}</div>
                      <p>{active.desc}</p>
                      <div className="hc-motion__actions">
                        <Button
                          size="sm"
                          variant="primary"
                          icon={<IconPlay size={11} />}
                          onClick={(e) => play(e)}
                        >
                          播放
                        </Button>
                        <Button
                          size="sm"
                          icon={<IconPause size={11} />}
                          disabled={!transitioning || paused}
                          onClick={pauseTransition}
                        >
                          暂停
                        </Button>
                        <Button
                          size="sm"
                          icon={<IconPlay size={11} />}
                          disabled={!paused}
                          onClick={resumeTransition}
                        >
                          继续
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={<IconStop size={11} />}
                          disabled={!transitioning}
                          onClick={cancelTransition}
                        >
                          复位
                        </Button>
                      </div>
                      <div className="hc-motion__inline">
                        <span className="hc-label">方向</span>
                        <Segmented
                          label="转场方向"
                          value={direction}
                          options={[
                            { value: 'forward', label: '正向' },
                            { value: 'back', label: '反向' },
                          ]}
                          onChange={setDirection}
                        />
                        <span className="hc-hint">
                          {active.dir ? '该转场支持进入方向反转。' : '该转场不区分方向。'}
                          播放后按 <b className="hc-mono">空格</b> 暂停 / 继续，<b className="hc-mono">ESC</b> 复位。
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="hc-lab-settings" style={{ marginTop: 16, marginBottom: 0 }}>
                    <div className="group">
                      <span>SPEED</span>
                      <Segmented
                        label="转场速度倍率"
                        value={String(settings.speed)}
                        options={[
                          { value: '0.5', label: '0.5×' },
                          { value: '1', label: '1×' },
                          { value: '1.5', label: '1.5×' },
                          { value: '2', label: '2×' },
                        ]}
                        onChange={(v) => updateSettings({ speed: Number(v) })}
                      />
                    </div>
                    <div className="group">
                      <span>MODE</span>
                      <Segmented
                        label="转场强度"
                        value={settings.quick ? 'quick' : 'full'}
                        options={[
                          { value: 'full', label: '完整' },
                          { value: 'quick', label: '快速' },
                        ]}
                        onChange={(v) => updateSettings({ quick: v === 'quick' })}
                      />
                    </div>
                    <div className="group">
                      <Toggle
                        label="减少动态"
                        checked={settings.reduceMotion}
                        onChange={() => updateSettings({ motion: settings.motion === 'reduce' ? 'full' : 'reduce' })}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="hc-lab-block">
                <header>
                  <h3>缓动曲线</h3>
                  <em>EASING / 4 TOKENS</em>
                </header>
                <div className="hc-lab-block__body">
                  <div className="hc-motion-grid">
                    {CURVES.map((c) => (
                      <div key={c.name}>
                        <div className="hc-curve">
                          <Curve p={c.p} />
                          <b>{c.name}</b>
                          <span>
                            {c.token} · cubic-bezier({c.p.join(', ')})
                          </span>
                        </div>
                        <CurveDemo p={c.p} dur={c.dur} />
                      </div>
                    ))}
                  </div>
                  <dl className="hc-dl" style={{ marginTop: 12 }}>
                    <div className="hc-drow"><dt>M0 即时</dt><dd>120ms <em>按下 / 勾选</em></dd></div>
                    <div className="hc-drow"><dt>M1 微交互</dt><dd>120–200ms <em>hover / 标签</em></dd></div>
                    <div className="hc-drow"><dt>M2 组件</dt><dd>200–300ms <em>抽屉 / 折叠</em></dd></div>
                    <div className="hc-drow"><dt>M3 页面</dt><dd>300–420ms <em>遮罩 / 缩放</em></dd></div>
                    <div className="hc-drow"><dt>M4 演出</dt><dd>420–680ms <em>首屏 / 揭示</em></dd></div>
                  </dl>
                </div>
              </section>
            </div>
          )}

          {tab === 'states' && (
            <div className="hc-lab__panel">
              <section className="hc-lab-block">
                <header>
                  <h3>全局弹层</h3>
                  <em>OVERLAY / DRAWER · MODAL · TOAST</em>
                </header>
                <div className="hc-lab-block__body">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    <Button onClick={() => setDrawer(true)}>打开抽屉</Button>
                    <Button onClick={() => setModal('confirm')} icon={<IconInfo size={13} />}>
                      确认弹窗
                    </Button>
                    <Button onClick={() => setModal('danger')} icon={<IconAlert size={13} />}>
                      危险弹窗
                    </Button>
                    <Button onClick={() => toast({ text: '通知已送达', meta: 'TOAST / DEFAULT' })}>
                      普通通知
                    </Button>
                    <Button onClick={() => toast({ text: '同步完成', meta: 'TOAST / SUCCESS', kind: 'success' })}>
                      成功通知
                    </Button>
                    <Button onClick={() => toast({ text: '信号中断', meta: 'TOAST / WARNING', kind: 'warn' })}>
                      警告通知
                    </Button>
                  </div>
                  <p className="hc-hint" style={{ marginTop: 14 }}>
                    打开后背景区域进入 inert，焦点被限制在弹层内；ESC 关闭并把焦点归还触发元素。
                  </p>
                </div>
              </section>

              <section className="hc-lab-block">
                <header>
                  <h3>状态样本</h3>
                  <em>EMPTY / ERROR / LOADING / DENIED</em>
                </header>
                <div className="hc-lab-block__body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 14 }}>
                    <EmptyState
                      code="EMPTY / 00"
                      title="频道暂无排程"
                      desc="今天没有公开对局。可以查看往期归档，或等待下一轮排程发布。"
                      action={<Button size="sm">查看归档</Button>}
                    />
                    <EmptyState
                      code="DENIED / 403"
                      title="需要二级以上权限"
                      desc="回廊信号为受限段，当前账号仅持有公开权限。请向调度组提交临时授权。"
                      action={<Button size="sm">提交申请</Button>}
                    />
                    <EmptyState
                      code="ERROR / 502"
                      title="信号同步失败"
                      desc="终端未能连接中央塔线路。已保留本地记录，可稍后重试。"
                      action={<Button size="sm" icon={<IconRefresh size={11} />}>重试</Button>}
                    />
                    <div style={{ border: '1px solid var(--hc-line-2)', padding: 14, background: 'var(--hc-canvas-2)' }}>
                      <div className="hc-label" style={{ marginBottom: 12 }}>LOADING / SKELETON</div>
                      <div style={{ display: 'grid', gap: 8 }}>
                        <Skeleton height={18} width="52%" />
                        <Skeleton height={12} width="88%" />
                        <Skeleton height={12} width="72%" />
                        <Skeleton height={12} width="40%" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="hc-lab-block">
                <header>
                  <h3>可访问性基线</h3>
                  <em>A11Y</em>
                </header>
                <div className="hc-lab-block__body">
                  <dl className="hc-dl">
                    <div className="hc-drow"><dt>键盘</dt><dd>Tab / 方向键 / ESC <em>已实现</em></dd></div>
                    <div className="hc-drow"><dt>焦点</dt><dd>2px accent + 3px offset <em>全局</em></dd></div>
                    <div className="hc-drow"><dt>背景隔离</dt><dd>弹层打开时 .hc-app 置 inert <em>已实现</em></dd></div>
                    <div className="hc-drow"><dt>动效</dt><dd>system / reduce / full 三态 <em>已实现</em></dd></div>
                    <div className="hc-drow"><dt>持久化</dt><dd>localStorage，失败安全回退 <em>已实现</em></dd></div>
                  </dl>
                </div>
              </section>
            </div>
          )}
        </main>

        <aside className="hc-work__inspect" aria-label="参数检查器">
          <div className="hc-work__inspecthead">
            <span>INSPECTOR</span>
            <span className="hc-mono">{LAB_TABS.find((t) => t.id === tab)?.en}</span>
          </div>

          {tab === 'tokens' && (
            <>
              <div className="hc-inspect__title">当前主题</div>
              <dl className="hc-dl">
                <DataRow label="主题" value={settings.theme === 'paper' ? 'Paper Dossier' : 'Dark Terminal'} />
                <DataRow label="频道" value="随页面切换" />
                <DataRow label="正文对比" value="≥ 7:1" hint="抽查" />
                <DataRow label="圆角" value="0px" hint="全站" />
              </dl>
              <Button
                size="sm"
                variant="ghost"
                icon={<IconCopy size={11} />}
                onClick={() =>
                  copy(
                    ':root{--hc-canvas:#111315;--hc-ink:#F8F8F5;--hc-accent:#F6540E;}',
                    '色彩变量',
                  )
                }
              >
                复制色板变量
              </Button>
              <p className="hc-hint">
                纸面主题不是反相：纸面 #E8E3D6、墨色 #191B1A、琥珀压到 #8C5A1A，保证正文与强调色都过 4.5:1。
              </p>
            </>
          )}

          {tab === 'components' && (
            <>
              <div className="hc-inspect__title">状态覆盖</div>
              <dl className="hc-dl">
                <DataRow label="按钮" value="8 态" />
                <DataRow label="Tab" value="默认 / 选中 / 焦点" />
                <DataRow label="输入" value="默认 / 聚焦 / 有值" />
                <DataRow label="列表" value="默认 / 展开 / 空" />
              </dl>
              <p className="hc-hint">
                所有控件为原生 button / input，不使用 div 模拟。禁用态使用真实 disabled，不依赖透明度。
              </p>
              <Button
                size="sm"
                variant="ghost"
                icon={<IconCopy size={11} />}
                onClick={() => copy('--motion-fast:120ms; --ease-standard:cubic-bezier(.2,0,0,1);', '组件动效令牌')}
              >
                复制组件动效令牌
              </Button>
            </>
          )}

          {tab === 'motion' && (
            <>
              <div className="hc-inspect__title">转场参数</div>
              <dl className="hc-dl">
                <DataRow label="样本" value={active.name} />
                <DataRow label="时长" value={active.duration} />
                <DataRow label="缓动" value={active.easing} />
                <DataRow label="层数" value={active.layers} />
                <DataRow label="方向" value={active.dir ? (direction === 'back' ? '反向' : '正向') : '固定'} />
                <DataRow label="速度" value={`${settings.speed}×`} hint={settings.quick ? '快速' : '完整'} />
                <DataRow label="阶段" value={phase ? PHASES.find((p) => p.id === phase)?.en ?? '—' : 'IDLE'} />
              </dl>
              <div className="hc-inspect__title">参数表</div>
              <dl className="hc-dl">
                {active.params.map(([k, v]) => (
                  <DataRow key={k} label={k} value={v} />
                ))}
              </dl>
              <div style={{ display: 'grid', gap: 6 }}>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<IconCopy size={11} />}
                  onClick={() =>
                    copy(
                      `/* ${active.en} */\n--transition-duration: ${active.duration};\n--transition-easing: ${active.easing};`,
                      '转场 CSS',
                    )
                  }
                >
                  复制 easing / duration
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<IconCopy size={11} />}
                  onClick={() => copy(`${active.name} / ${active.en} / ${active.duration} / ${active.easing}`, '参数')}
                >
                  复制参数摘要
                </Button>
              </div>
              <p className="hc-hint">
                暂停只冻结当前运行的转场；新导航会取消旧任务并接管遮罩，不会卡住页面。
              </p>
            </>
          )}

          {tab === 'states' && (
            <>
              <div className="hc-inspect__title">状态清单</div>
              <dl className="hc-dl">
                <DataRow label="空" value="Empty / 00" />
                <DataRow label="无结果" value="No Match" />
                <DataRow label="权限" value="Denied / 403" />
                <DataRow label="错误" value="Error / 502" />
                <DataRow label="加载" value="Skeleton" />
              </dl>
              <p className="hc-hint">
                状态不是留白：每一种都保留编号、原因与一个可执行动作，避免用户停在死路。
              </p>
            </>
          )}

          <div className="hc-inspect__foot">
            <span className="hc-mono">SAMPLE DATA</span>
            <span className="hc-mono">P2.1</span>
          </div>
        </aside>
      </div>

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="抽屉面板"
        en="OVERLAY / DRAWER"
        meta="焦点陷阱 · 背景 inert · ESC 关闭"
        footer={
          <>
            <Button variant="primary" size="sm" onClick={() => setDrawer(false)}>
              完成
            </Button>
            <Button size="sm" onClick={() => setDrawer(false)}>
              关闭
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 12, lineHeight: 1.8, color: 'var(--hc-ink-2)', marginBottom: 18 }}>
          抽屉用于承载不离开当前页面的次级信息。内容滚动独立于页面，遮罩同步淡入，关闭时保留退出动画。
        </p>
        <dl className="hc-dl">
          <DataRow label="进入时长" value="320ms" />
          <DataRow label="退出时长" value="240ms" />
          <DataRow label="宽度" value="440px / 92vw" />
          <DataRow label="背景" value="inert" />
        </dl>
        <div className="hc-field" style={{ marginTop: 20 }}>
          <span className="hc-label">示例开关</span>
          <Toggle label="点击遮罩关闭" checked={toggleA} onChange={setToggleA} />
        </div>
      </Drawer>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        tone={modal === 'danger' ? 'danger' : 'accent'}
        title={modal === 'danger' ? '中断当前信号？' : '同步频道参数'}
        en={modal === 'danger' ? 'WARNING / IRREVERSIBLE' : 'CONFIRM / SYNC'}
        footer={
          <>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                setModal(null)
                toast({
                  text: modal === 'danger' ? '已中断信号' : '参数已同步',
                  meta: 'ACTION / DONE',
                  kind: modal === 'danger' ? 'warn' : 'success',
                })
              }}
            >
              {modal === 'danger' ? '确认中断' : '确认同步'}
            </Button>
            <Button size="sm" onClick={() => setModal(null)}>
              取消
            </Button>
          </>
        }
      >
        <p style={{ lineHeight: 1.8 }}>
          {modal === 'danger'
            ? '中断后当前场次的公开信号将立即停止，恢复需要重新走调度流程。此操作在演示中只改变界面状态。'
            : '将把频道参数写入本地会话，并同步到终端的演示状态。该操作可重复执行。'}
        </p>
      </Modal>
    </div>
  )
}
