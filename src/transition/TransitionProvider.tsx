import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { frames } from '../lib/motion'
import { ROUTE_META, parseHash, routeToHash, sameRoute, type Route } from '../lib/router'
import {
  DEFAULT_PREFS,
  applyRootPrefs,
  clearPrefs,
  loadPrefs,
  resolveReduce,
  savePrefs,
  type MotionMode,
  type Prefs,
  type ThemeMode,
} from '../lib/prefs'
import { playTransition, type TransitionKind } from './playTransition'

export type Phase = 'cover' | 'commit' | 'reveal' | 'cleanup'
export type Direction = 'forward' | 'back'

export interface UiSettings extends Prefs {
  reduceMotion: boolean
}

export interface NavOptions {
  kind?: TransitionKind
  anchor?: DOMRect | null
  label?: string
  force?: boolean
  keepScroll?: boolean
  skipHistory?: boolean
  direction?: Direction
}

interface TransitionApi {
  route: Route
  navigate: (to: Route, opts?: NavOptions) => void
  settings: UiSettings
  updateSettings: (patch: Partial<Omit<UiSettings, 'reduceMotion'>>) => void
  resetSettings: () => void
  transitioning: TransitionKind | null
  phase: Phase | null
  paused: boolean
  pauseTransition: () => void
  resumeTransition: () => void
  cancelTransition: () => void
}

interface Task {
  id: number
  phase: Phase | null
  committed: boolean
  animations: Set<Animation>
}

const TransitionContext = createContext<TransitionApi | null>(null)

export function useTransition(): TransitionApi {
  const ctx = useContext(TransitionContext)
  if (!ctx) throw new Error('useTransition must be used inside TransitionProvider')
  return ctx
}

const prefsOf = (s: UiSettings): Prefs => ({
  speed: s.speed,
  quick: s.quick,
  motion: s.motion,
  theme: s.theme,
})

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))
  const routeRef = useRef(route)
  const initial = useRef<UiSettings | null>(null)
  if (!initial.current) {
    const p = loadPrefs()
    initial.current = { ...p, reduceMotion: resolveReduce(p.motion) }
  }
  const [settings, setSettings] = useState<UiSettings>(initial.current)
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  const [transitioning, setTransitioning] = useState<TransitionKind | null>(null)
  const [phase, setPhase] = useState<Phase | null>(null)
  const [paused, setPaused] = useState(false)

  const layerRef = useRef<HTMLDivElement | null>(null)
  const genRef = useRef(0)
  const taskRef = useRef<Task | null>(null)
  const overflowRef = useRef<string | null>(null)

  const clearLayer = useCallback(() => {
    const layer = layerRef.current
    if (layer) {
      layer.dataset.active = 'false'
      layer.querySelectorAll('.hc-tx-root').forEach((n) => n.remove())
    }
  }, [])

  const reset = useCallback(() => {
    genRef.current += 1
    const task = taskRef.current
    if (task) {
      task.animations.forEach((a) => {
        try {
          a.cancel()
        } catch {
          /* 已结束 */
        }
      })
      task.animations.clear()
      taskRef.current = null
    }
    clearLayer()
    if (overflowRef.current !== null) {
      document.body.style.overflow = overflowRef.current
      overflowRef.current = null
    }
    setTransitioning(null)
    setPhase(null)
    setPaused(false)
  }, [clearLayer])

  const updateSettings = useCallback((patch: Partial<Omit<UiSettings, 'reduceMotion'>>) => {
    const prev = settingsRef.current
    const next: UiSettings = { ...prev, ...patch }
    next.reduceMotion = resolveReduce(next.motion)
    settingsRef.current = next
    setSettings(next)
    savePrefs(prefsOf(next))
    applyRootPrefs(prefsOf(next))
  }, [])

  const resetSettings = useCallback(() => {
    clearPrefs()
    const next: UiSettings = { ...DEFAULT_PREFS, reduceMotion: resolveReduce(DEFAULT_PREFS.motion) }
    settingsRef.current = next
    setSettings(next)
    applyRootPrefs(DEFAULT_PREFS)
  }, [])

  const navigate = useCallback(
    (to: Route, opts: NavOptions = {}) => {
      if (!opts.force && sameRoute(to, routeRef.current)) return
      const layer = layerRef.current
      const my = genRef.current + 1
      genRef.current = my

      // 取消上一轮：动画、临时节点、任务归属全部交给旧任务自己结束
      const previous = taskRef.current
      if (previous) {
        previous.animations.forEach((a) => {
          try {
            a.cancel()
          } catch {
            /* noop */
          }
        })
        previous.animations.clear()
      }
      clearLayer()

      const kind: TransitionKind = opts.kind ?? 'mask'
      const task: Task = { id: my, phase: null, committed: false, animations: new Set() }
      taskRef.current = task
      setTransitioning(kind)
      setPhase('cover')
      setPaused(false)

      if (!layer) {
        setRoute(to)
        routeRef.current = to
        setTransitioning(null)
        setPhase(null)
        return
      }

      layer.dataset.active = 'true'
      if (overflowRef.current === null) {
        overflowRef.current = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
      }

      const accent =
        getComputedStyle(document.documentElement).getPropertyValue('--hc-accent').trim() ||
        '#f6540e'
      const meta = `${ROUTE_META[to.name].en} / ${settingsRef.current.quick ? 'QUICK' : 'FULL'}`

      const commitRoute = () => {
        setRoute(to)
        routeRef.current = to
        task.committed = true
        if (!opts.skipHistory) {
          try {
            history.pushState(null, '', `#${routeToHash(to)}`)
          } catch {
            // file:// 下 origin 为 null，pushState 会被拒绝；退化为 hash 赋值。
            window.location.hash = routeToHash(to)
          }
        }
      }

      void playTransition({
        kind,
        direction: opts.direction ?? 'forward',
        layer,
        anchor: opts.anchor ?? null,
        label: opts.label ?? ROUTE_META[to.name].title,
        accent,
        meta,
        settings: {
          speed: settingsRef.current.speed,
          quick: settingsRef.current.quick,
          reduced: settingsRef.current.reduceMotion,
        },
        register: (a) => {
          task.animations.add(a)
          const drop = () => task.animations.delete(a)
          a.addEventListener('finish', drop)
          a.addEventListener('cancel', drop)
        },
        cancelled: () => my !== genRef.current,
        commit: async () => {
          if (my !== genRef.current) return
          setPhase('commit')
          commitRoute()
          if (!opts.keepScroll) {
            // CSS scroll-behavior:smooth 会让 behavior:'auto' 也走平滑滚动，
            // 转场期间必须瞬时归零，否则共享元素测量会落在滚动中间态。
            const html = document.documentElement
            const prev = html.style.scrollBehavior
            html.style.scrollBehavior = 'auto'
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
            await frames(2)
            html.style.scrollBehavior = prev
          } else {
            await frames(2)
          }
        },
      })
        .catch((err: unknown) => {
          if (my !== genRef.current) return
          if (import.meta.env.DEV) {
            console.error('[transition] failed', {
              kind,
              to: routeToHash(to),
              phase: task.phase,
              settings: settingsRef.current,
              error: err,
            })
          } else {
            console.error(`[transition] ${kind} → ${routeToHash(to)} failed; fallback to direct navigation`)
          }
          // 生产保底：导航不能丢，直接切页并清掉遮罩
          if (!task.committed) {
            commitRoute()
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
          }
        })
        .finally(() => {
          if (my !== genRef.current) return
          setPhase('cleanup')
          layer.dataset.active = 'false'
          setTransitioning(null)
          setPaused(false)
          taskRef.current = null
          if (overflowRef.current !== null) {
            document.body.style.overflow = overflowRef.current
            overflowRef.current = null
          }
          // 清理阶段保持极短，让实验室能观察到 Cleanup
          window.setTimeout(() => {
            if (my === genRef.current) setPhase(null)
            const title = document.querySelector<HTMLElement>('[data-page-title]')
            title?.focus({ preventScroll: true })
          }, 120)
        })
    },
    [clearLayer],
  )

  const pauseTransition = useCallback(() => {
    const task = taskRef.current
    if (!task || task.animations.size === 0) return
    task.animations.forEach((a) => {
      try {
        a.pause()
      } catch {
        /* noop */
      }
    })
    setPaused(true)
  }, [])

  const resumeTransition = useCallback(() => {
    const task = taskRef.current
    if (!task) return
    task.animations.forEach((a) => {
      try {
        a.play()
      } catch {
        /* noop */
      }
    })
    setPaused(false)
  }, [])

  const cancelTransition = useCallback(() => {
    reset()
  }, [reset])

  // 系统减少动态偏好：仅在 motion === 'system' 时追随
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => {
      const current = settingsRef.current
      if (current.motion !== 'system') return
      const next = { ...current, reduceMotion: mq.matches }
      settingsRef.current = next
      setSettings(next)
      applyRootPrefs(prefsOf(next))
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // 初次挂载：把持久化偏好同步到根节点
  useEffect(() => {
    applyRootPrefs(prefsOf(settingsRef.current))
  }, [])

  // 浏览器前进 / 后退：取消进行中的转场，直接切换并以短淡入提示
  useEffect(() => {
    const onPop = () => {
      const next = parseHash(window.location.hash)
      if (sameRoute(next, routeRef.current)) return
      reset()
      setRoute(next)
      routeRef.current = next
      const html = document.documentElement
      const prev = html.style.scrollBehavior
      html.style.scrollBehavior = 'auto'
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
      html.style.scrollBehavior = prev
      const main = document.getElementById('hc-main')
      if (main && !settingsRef.current.reduceMotion) {
        main.animate([{ opacity: 0.2 }, { opacity: 1 }], {
          duration: 220,
          easing: 'cubic-bezier(0.16,1,0.3,1)',
        })
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [reset])

  useEffect(() => () => reset(), [reset])

  const api = useMemo<TransitionApi>(
    () => ({
      route,
      navigate,
      settings,
      updateSettings,
      resetSettings,
      transitioning,
      phase,
      paused,
      pauseTransition,
      resumeTransition,
      cancelTransition,
    }),
    [
      route,
      navigate,
      settings,
      updateSettings,
      resetSettings,
      transitioning,
      phase,
      paused,
      pauseTransition,
      resumeTransition,
      cancelTransition,
    ],
  )

  return (
    <TransitionContext.Provider value={api}>
      {children}
      <div className="hc-tx-host" ref={layerRef} data-active="false" aria-hidden="true" />
    </TransitionContext.Provider>
  )
}

export type { MotionMode, ThemeMode }
