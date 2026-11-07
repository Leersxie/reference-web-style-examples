import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  RefObject,
} from 'react'
import { IconSearch } from './Icon'

const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(' ')

/* ---------------- Button ---------------- */
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
  icon?: ReactNode
  loading?: boolean
  confirmed?: boolean
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  loading = false,
  confirmed = false,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cx(
        'hc-btn',
        variant !== 'secondary' && `hc-btn--${variant}`,
        size === 'sm' && 'hc-btn--sm',
        !children && 'hc-btn--icon',
        loading && 'is-loading',
        confirmed && 'is-confirmed',
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      <span className="hc-btn__in">
        {loading && <span className="hc-btn__spin" aria-hidden="true" />}
        {children}
        {icon}
      </span>
    </button>
  )
}

/* ---------------- Tabs ---------------- */
export interface TabItem {
  id: string
  label: string
  en?: string
}

export function Tabs({
  items,
  value,
  onChange,
  label = '页面分区',
  idBase = 'tab',
}: {
  items: TabItem[]
  value: string
  onChange: (id: string) => void
  label?: string
  idBase?: string
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const [ind, setInd] = useState({ x: 0, w: 0 })

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () => {
      const active = list.querySelector<HTMLElement>('[aria-selected="true"]')
      if (!active) return
      setInd({ x: active.offsetLeft, w: active.offsetWidth })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(list)
    return () => ro.disconnect()
  }, [value, items])

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const idx = items.findIndex((i) => i.id === value)
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const dir = e.key === 'ArrowRight' ? 1 : -1
      const next = items[(idx + dir + items.length) % items.length]
      onChange(next.id)
      window.setTimeout(() => {
        listRef.current
          ?.querySelector<HTMLElement>(`#${idBase}-${next.id}`)
          ?.focus()
      }, 0)
    }
    if (e.key === 'Home') {
      e.preventDefault()
      onChange(items[0].id)
    }
    if (e.key === 'End') {
      e.preventDefault()
      onChange(items[items.length - 1].id)
    }
  }

  return (
    <div className="hc-tabs" role="tablist" aria-label={label} ref={listRef} onKeyDown={onKeyDown}>
      {items.map((item) => {
        const selected = item.id === value
        return (
          <button
            key={item.id}
            id={`${idBase}-${item.id}`}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls={`${idBase}-panel-${item.id}`}
            tabIndex={selected ? 0 : -1}
            className="hc-tab"
            onClick={() => onChange(item.id)}
          >
            <span className="hc-tab__idx">{item.en}</span>
            {item.label}
          </button>
        )
      })}
      <span
        className="hc-tabs__ind"
        style={{ transform: `translateX(${ind.x}px)`, width: ind.w }}
        aria-hidden="true"
      />
    </div>
  )
}

/* ---------------- Segmented ---------------- */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  label: string
}) {
  return (
    <div className="hc-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          className="hc-seg__btn"
          aria-pressed={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

/* ---------------- Tag / Status ---------------- */
export function Tag({
  children,
  variant = 'default',
}: {
  children: ReactNode
  variant?: 'default' | 'accent' | 'solid' | 'muted'
}) {
  return (
    <span className={cx('hc-tag', variant !== 'default' && `hc-tag--${variant}`)}>
      {children}
    </span>
  )
}

export function Status({
  children,
  kind = 'idle',
}: {
  children: ReactNode
  kind?: 'live' | 'ok' | 'warn' | 'idle' | 'info'
}) {
  return <span className={cx('hc-status', `hc-status--${kind}`)}>{children}</span>
}

/* ---------------- Panel / DataRow ---------------- */
export function Panel({
  title,
  en,
  extra,
  children,
  flat = false,
  className,
}: {
  title: string
  en?: string
  extra?: ReactNode
  children: ReactNode
  flat?: boolean
  className?: string
}) {
  return (
    <section className={cx('hc-panel', flat && 'hc-panel--flat', className)}>
      <header className="hc-panel__head">
        <h3 className="hc-panel__title">
          {title}
          {en && <span className="hc-en">{en}</span>}
        </h3>
        {extra}
      </header>
      <div className="hc-panel__body">{children}</div>
    </section>
  )
}

export function DataRow({
  label,
  value,
  hint,
}: {
  label: string
  value: ReactNode
  hint?: string
}) {
  return (
    <div className="hc-drow">
      <dt>{label}</dt>
      <dd>
        {value}
        {hint && <em> {hint}</em>}
      </dd>
    </div>
  )
}

/* ---------------- Input / Checkbox / Toggle ---------------- */
export function SearchInput({
  value,
  onChange,
  placeholder,
  onClear,
  className,
  ...rest
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  onClear?: () => void
  className?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  return (
    <div className={cx('hc-input', className)}>
      <IconSearch />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
      {value && onClear && (
        <button type="button" className="hc-btn hc-btn--ghost hc-btn--sm" onClick={onClear}>
          清除
        </button>
      )}
    </div>
  )
}

export function Checkbox({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <label className="hc-check">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  )
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="hc-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  )
}

/* ---------------- Progress / Skeleton / Empty ---------------- */
export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div
      className="hc-progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? '进度'}
    >
      <span className="hc-progress__fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      <span className="hc-progress__ticks" />
    </div>
  )
}

export function Skeleton({ height = 14, width = '100%' }: { height?: number; width?: string }) {
  return <div className="hc-skel" style={{ height, width }} aria-hidden="true" />
}

export function EmptyState({
  code = 'NO RESULT',
  title,
  desc,
  action,
}: {
  code?: string
  title: string
  desc: string
  action?: ReactNode
}) {
  return (
    <div className="hc-empty">
      <span className="hc-empty__code">{code}</span>
      <h4>{title}</h4>
      <p>{desc}</p>
      {action}
    </div>
  )
}

/* ---------------- 数字滚动（ak-counter / RL 460ms） ---------------- */
export function CountTo({
  value,
  decimals = 0,
  pad = 0,
  duration = 460,
}: {
  value: number
  decimals?: number
  pad?: number
  duration?: number
}) {
  const reduced =
    typeof document !== 'undefined' &&
    (document.documentElement.dataset.reduce === 'true' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [display, setDisplay] = useState(() => (reduced ? value : 0))

  useEffect(() => {
    if (document.documentElement.dataset.reduce === 'true') {
      setDisplay(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(value * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  const text = display.toFixed(decimals)
  return <span className="hc-mono">{pad > 0 ? text.padStart(pad, '0') : text}</span>
}

/* ---------------- 破格四角（D1 §1.6：右下略小且靠左） ---------------- */
export function CornerSet({ className }: { className?: string }) {
  return (
    <span className={cx('hc-corners', className)} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  )
}

/* ---------------- 演示数据标记 ---------------- */
export function SampleTag({
  label = 'SAMPLE DATA / 演示数据',
  accent = false,
  className,
}: {
  label?: string
  accent?: boolean
  className?: string
}) {
  return (
    <span
      className={cx('hc-sample', accent && 'hc-sample--accent', className)}
      title="本页内容为演示数据，不代表官方设定"
    >
      {label}
    </span>
  )
}

/* ---------------- Tooltip ---------------- */
export function Tip({ text, children }: { text: string; children: ReactNode }) {
  return (
    <span className="hc-tip" data-tip={text}>
      {children}
    </span>
  )
}

/* ---------------- 焦点陷阱 ---------------- */
let trapDepth = 0

function setAppInert(on: boolean) {
  const app = document.querySelector<HTMLElement>('.hc-app')
  if (!app) return
  if (on) app.setAttribute('inert', '')
  else app.removeAttribute('inert')
}

export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onClose: () => void,
) {
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!active) return
    const node = ref.current
    if (!node) return
    const previous = document.activeElement as HTMLElement | null
    trapDepth += 1
    setAppInert(true)
    const focusables = () =>
      Array.from(
        node.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null)

    const timer = window.setTimeout(() => {
      const first = focusables()[0]
      ;(first ?? node).focus({ preventScroll: true })
    }, 40)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeRef.current()
        return
      }
      if (e.key !== 'Tab') return
      const list = focusables()
      if (list.length === 0) {
        e.preventDefault()
        node.focus()
        return
      }
      const first = list[0]
      const last = list[list.length - 1]
      const current = document.activeElement
      if (e.shiftKey && (current === first || !node.contains(current))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && current === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', onKey)
      trapDepth = Math.max(0, trapDepth - 1)
      if (trapDepth === 0) setAppInert(false)
      // 触发元素可能已被卸载：优先归还，其次回到主内容
      if (previous && previous.isConnected) {
        previous.focus({ preventScroll: true })
      } else {
        document.getElementById('hc-main')?.focus({ preventScroll: true })
      }
    }
  }, [active, ref])
}

/* ---------------- Presence（保留退出动画） ---------------- */
export function usePresence(open: boolean, exitMs = 280) {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      setClosing(false)
      return
    }
    if (!mounted) return
    setClosing(true)
    const timer = window.setTimeout(() => {
      setMounted(false)
      setClosing(false)
    }, exitMs)
    return () => window.clearTimeout(timer)
  }, [open, mounted, exitMs])

  return { mounted, closing }
}

/* ---------------- Toast ---------------- */
export interface ToastItem {
  id: number
  text: string
  meta?: string
  kind?: 'default' | 'success' | 'warn' | 'danger'
}

const ToastContext = createContext<((t: Omit<ToastItem, 'id'>) => void) | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const seq = useRef(0)

  const push = useCallback((t: Omit<ToastItem, 'id'>) => {
    seq.current += 1
    const id = seq.current
    setItems((prev) => [...prev.slice(-2), { ...t, id }])
    window.setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }, 3600)
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="hc-toasts" role="status" aria-live="polite">
        {items.map((i) => {
          const code =
            i.kind === 'success'
              ? 'HC / OK'
              : i.kind === 'warn'
                ? 'HC / WARN'
                : i.kind === 'danger'
                  ? 'HC / ERR'
                  : 'HC / INFO'
          return (
            <div className="hc-toast" key={i.id} data-kind={i.kind ?? 'default'}>
              <span className="hc-toast__code">{code}</span>
              {i.text}
              {i.meta && <span className="hc-toast__meta">{i.meta}</span>}
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

