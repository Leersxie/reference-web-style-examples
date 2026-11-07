/**
 * 运行偏好：速度 / 转场模式 / 动效偏好 / 主题
 * - 三态动效：system 跟随系统、reduce 强制减少、full 强制完整
 * - 持久化到 localStorage，读取失败安全回退
 * - 首屏不闪烁由 index.html 的内联脚本负责，这里只做运行期同步
 */

export type MotionMode = 'system' | 'reduce' | 'full'
export type ThemeMode = 'dark' | 'paper'

export interface Prefs {
  speed: number
  quick: boolean
  motion: MotionMode
  theme: ThemeMode
}

export const DEFAULT_PREFS: Prefs = {
  speed: 1,
  quick: false,
  motion: 'system',
  theme: 'dark',
}

export const PREFS_KEY = 'honeycity.prefs.v1'
export const SPEEDS = [0.5, 1, 1.5, 2] as const

const isSpeed = (v: unknown): v is number =>
  typeof v === 'number' && (SPEEDS as readonly number[]).includes(v)

const isMotion = (v: unknown): v is MotionMode =>
  v === 'system' || v === 'reduce' || v === 'full'

const isTheme = (v: unknown): v is ThemeMode => v === 'dark' || v === 'paper'

export function loadPrefs(): Prefs {
  try {
    const raw = window.localStorage.getItem(PREFS_KEY)
    if (!raw) return { ...DEFAULT_PREFS }
    const parsed = JSON.parse(raw) as Partial<Prefs>
    return {
      speed: isSpeed(parsed.speed) ? parsed.speed : DEFAULT_PREFS.speed,
      quick: typeof parsed.quick === 'boolean' ? parsed.quick : DEFAULT_PREFS.quick,
      motion: isMotion(parsed.motion) ? parsed.motion : DEFAULT_PREFS.motion,
      theme: isTheme(parsed.theme) ? parsed.theme : DEFAULT_PREFS.theme,
    }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

export function savePrefs(prefs: Prefs): void {
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch {
    /* 隐私模式或配额不足时静默，不影响运行 */
  }
}

export function clearPrefs(): void {
  try {
    window.localStorage.removeItem(PREFS_KEY)
  } catch {
    /* noop */
  }
}

export function systemReduced(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function resolveReduce(mode: MotionMode): boolean {
  if (mode === 'reduce') return true
  if (mode === 'full') return false
  return systemReduced()
}

/** 同步到 <html>，CSS 与 WAAPI 读同一份状态 */
export function applyRootPrefs(prefs: Prefs): void {
  const root = document.documentElement
  root.dataset.theme = prefs.theme
  root.dataset.reduce = resolveReduce(prefs.motion) ? 'true' : 'false'
  root.style.colorScheme = prefs.theme === 'paper' ? 'light' : 'dark'
}
