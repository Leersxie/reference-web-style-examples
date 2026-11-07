/** 动效令牌的 TS 映射：与 tokens.css 保持同值，供 WAAPI 使用 */

export const EASING = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  enter: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  emphasis: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  transform: 'cubic-bezier(0.2, 0, 0, 1)',
  linear: 'linear',
} as const

export const DURATION = {
  instant: 120,
  fast: 120,
  base: 200,
  panel: 300,
  page: 420,
  hero: 680,
} as const

export const SPEED_OPTIONS = [0.5, 1, 1.5, 2] as const

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v))
}

export function raf(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()))
}

export async function frames(n = 1): Promise<void> {
  for (let i = 0; i < n; i += 1) await raf()
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
