import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { IconChevronDown, IconClose } from './Icon'
import { useFocusTrap, usePresence } from './ui'

const cx = (...p: (string | false | null | undefined)[]) => p.filter(Boolean).join(' ')

/* ---------------- Drawer ---------------- */
export function Drawer({
  open,
  onClose,
  title,
  en,
  meta,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  en?: string
  meta?: ReactNode
  children: ReactNode
  footer?: ReactNode
}) {
  const { mounted, closing } = usePresence(open, 280)
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, mounted, onClose)

  useEffect(() => {
    if (!mounted) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mounted])

  if (!mounted) return null

  return createPortal(
    <>
      <div
        className={cx('hc-scrim', closing && 'is-closing')}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        ref={ref}
        className={cx('hc-drawer', closing && 'is-closing')}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <header className="hc-drawer__head">
          <div>
            <div className="hc-en" style={{ marginBottom: 4 }}>
              {en}
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.2 }}>{title}</h2>
            {meta && (
              <div
                className="hc-mono"
                style={{ fontSize: 10, color: 'var(--hc-ink-4)', marginTop: 6, letterSpacing: '.1em' }}
              >
                {meta}
              </div>
            )}
          </div>
          <button
            type="button"
            className="hc-btn hc-btn--icon hc-btn--ghost"
            onClick={onClose}
            aria-label="关闭面板"
          >
            <IconClose size={16} />
          </button>
        </header>
        <div className="hc-drawer__body">{children}</div>
        {footer && <div className="hc-drawer__foot">{footer}</div>}
      </aside>
    </>,
    document.body,
  )
}

/* ---------------- Modal ---------------- */
export function Modal({
  open,
  onClose,
  title,
  en,
  children,
  footer,
  tone = 'accent',
}: {
  open: boolean
  onClose: () => void
  title: string
  en?: string
  children: ReactNode
  footer?: ReactNode
  tone?: 'accent' | 'danger'
}) {
  const { mounted, closing } = usePresence(open, 200)
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, mounted, onClose)

  if (!mounted) return null

  return createPortal(
    <>
      <div
        className={cx('hc-scrim', closing && 'is-closing')}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={ref}
        className={cx('hc-modal', closing && 'is-closing')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hc-modal-title"
        tabIndex={-1}
      >
        <div
          className="hc-modal__bar"
          style={{ background: tone === 'danger' ? 'var(--hc-danger)' : 'var(--hc-accent)' }}
        />
        <div className="hc-modal__head">
          <div>
            {en && <div className="hc-en" style={{ marginBottom: 6 }}>{en}</div>}
            <h2 id="hc-modal-title" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.25 }}>
              {title}
            </h2>
          </div>
          <button
            type="button"
            className="hc-btn hc-btn--icon hc-btn--ghost hc-btn--sm"
            onClick={onClose}
            aria-label="关闭弹窗"
          >
            <IconClose size={15} />
          </button>
        </div>
        <div className="hc-modal__body">{children}</div>
        {footer && <div className="hc-modal__foot">{footer}</div>}
      </div>
    </>,
    document.body,
  )
}

/* ---------------- Dropdown ---------------- */
export function Dropdown<T extends string>({
  value,
  options,
  onChange,
  label,
  minWidth,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  label: string
  minWidth?: number
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const current = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const onMenuKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const items = Array.from(
      root.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [],
    )
    const idx = items.indexOf(document.activeElement as HTMLElement)
    const next = items[(idx + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]
    next?.focus()
  }

  return (
    <div className="hc-dd" data-open={open} ref={root}>
      <button
        type="button"
        className="hc-dd__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        style={minWidth ? { minWidth } : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
            window.setTimeout(() => {
              root.current?.querySelector<HTMLElement>('[role="option"]')?.focus()
            }, 20)
          }
        }}
      >
        <span>{current?.label ?? '—'}</span>
        <IconChevronDown />
      </button>
      {open && (
        <div className="hc-dd__menu" role="listbox" aria-label={label} onKeyDown={onMenuKey}>
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              className="hc-dd__item"
              onClick={() => {
                onChange(o.value)
                setOpen(false)
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
