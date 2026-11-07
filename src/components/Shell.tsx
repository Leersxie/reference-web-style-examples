import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  IconChannel,
  IconChannels,
  IconClose,
  IconHome,
  IconLab,
  IconMenu,
  IconSliders,
  IconTerminal,
} from './Icon'
import { BrandMark } from './Sigil'
import { Drawer } from './overlays'
import { Button, Segmented, Toggle, useFocusTrap } from './ui'
import { useTransition } from '../transition/TransitionProvider'
import type { RouteName } from '../lib/router'
import { ROUTE_META } from '../lib/router'
import { CHANNELS } from '../lib/data'

const NAV: {
  name: RouteName
  param?: string
  label: string
  en: string
  num: string
  icon: typeof IconHome
}[] = [
  { name: 'home', label: '首页', en: 'ENTRY', num: '01', icon: IconHome },
  { name: 'channels', label: '索引', en: 'INDEX', num: '02', icon: IconChannels },
  { name: 'channel', param: 'arena', label: '频道', en: 'CHANNEL', num: '03', icon: IconChannel },
  { name: 'terminal', label: '终端', en: 'TERM', num: '04', icon: IconTerminal },
  { name: 'lab', label: '实验室', en: 'LAB', num: '05', icon: IconLab },
]

export function Shell({ children }: { children: ReactNode }) {
  const { route, navigate, settings, updateSettings, resetSettings } = useTransition()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [now, setNow] = useState(() => new Date())
  const mobileNavRef = useRef<HTMLDivElement>(null)
  useFocusTrap(mobileNavRef, mobileOpen, () => setMobileOpen(false))

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [route])

  useEffect(() => {
    const channel = route.name === 'channel' ? route.param ?? 'arena' : 'arena'
    document.documentElement.dataset.channel = channel
  }, [route])

  const clock = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const stamp = `${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`

  const current = route.name === 'channel' ? CHANNELS.find((c) => c.id === route.param) : undefined
  const meta = ROUTE_META[route.name]
  const activeKey = (name: RouteName) => route.name === name

  return (
    <div className="hc-app">
      <a className="hc-skip" href="#hc-main">
        跳到主内容
      </a>

      <nav className="hc-rail" aria-label="主导航">
        <div className="hc-rail__brand">
          <BrandMark size={24} />
        </div>
        <div className="hc-rail__nav">
          {NAV.map((item) => (
            <button
              key={item.name}
              type="button"
              className="hc-navitem"
              aria-current={activeKey(item.name) ? 'page' : undefined}
              aria-label={`${item.label} ${item.en}`}
              onClick={() =>
                navigate(
                  { name: item.name, param: item.param },
                  {
                    kind: 'mask',
                    label: item.name === 'channel' ? '争锋频道' : ROUTE_META[item.name].title,
                  },
                )
              }
            >
              <span className="hc-navitem__num">{item.num}</span>
              <item.icon />
            </button>
          ))}
        </div>
        <div className="hc-rail__foot">
          <span className="hc-rail__clock">HC / P2.1</span>
        </div>
      </nav>

      <div className="hc-body">
        <header className="hc-topbar">
          <button
            type="button"
            className="hc-menu-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="打开导航"
            aria-expanded={mobileOpen}
          >
            <IconMenu size={20} />
          </button>

          <div className="hc-topbar__brand">
            <div className="hc-topbar__mark">
              <b>HONEY CITY</b>
              <span>蜜果城 · 争锋频道</span>
            </div>
          </div>

          <div className="hc-topbar__path" aria-label="当前位置">
            <span>蜜果城</span>
            <i>/</i>
            <span>频道系统</span>
            <i>/</i>
            <b>{current ? `${current.name} · ${current.code}` : meta.path}</b>
          </div>

          <div className="hc-topbar__status">
            <span className="hc-sample hc-sample--top" title="本页全部内容为演示数据">
              SAMPLE DATA
            </span>
            <span className="hc-live">SIGNAL LIVE</span>
            <span className="hc-topbar__clock">
              {stamp} {clock}
            </span>
            <Button
              variant="ghost"
              className="hc-btn--icon hc-btn--sm"
              aria-label="打开界面设置"
              onClick={() => setSettingsOpen(true)}
            >
              <IconSliders size={16} />
            </Button>
          </div>
        </header>

        <main id="hc-main" className="hc-main" tabIndex={-1}>
          {children}
          <footer className="hc-footer">
            <span>HONEY CITY · 视觉与动效样本 / UI &amp; MOTION STUDY</span>
            <span>非官方研究项目 · 与鹰角网络及《明日方舟》无隶属关系</span>
            <span className="hc-mono">P2.1 / SAMPLE DATA</span>
          </footer>
        </main>
      </div>

      {mobileOpen &&
        createPortal(
          <div
            className="hc-mobnav"
            role="dialog"
            aria-modal="true"
            aria-label="移动端导航"
            ref={mobileNavRef}
            tabIndex={-1}
          >
            <div className="hc-drawer__head">
              <div className="hc-en">HONEY CITY / NAVIGATION</div>
              <button
                type="button"
                className="hc-btn hc-btn--icon hc-btn--ghost"
                onClick={() => setMobileOpen(false)}
                aria-label="关闭导航"
              >
                <IconClose size={18} />
              </button>
            </div>
            <div style={{ padding: 'var(--sp-4) var(--sp-5)', flex: 1 }}>
              {NAV.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className="hc-corridor__row"
                  aria-current={activeKey(item.name) ? 'page' : undefined}
                  style={{ gridTemplateColumns: '38px 1fr 20px', padding: '18px 0' }}
                  onClick={() => {
                    setMobileOpen(false)
                    navigate({ name: item.name, param: item.param }, { kind: 'mask' })
                  }}
                >
                  <span className="idx">{item.num}</span>
                  <span className="name">
                    {item.label}
                    <em>{item.en}</em>
                  </span>
                  <item.icon />
                </button>
              ))}
            </div>
            <div className="hc-footer">
              <span>演示数据 · 非官方研究项目</span>
              <span className="hc-mono">
                {stamp} {clock}
              </span>
            </div>
          </div>,
          document.body,
        )}

      <Drawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="界面设置"
        en="INTERFACE / PREFERENCES"
        meta="偏好写入本地存储，下次打开时恢复"
        footer={
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSettingsOpen(false)
                navigate({ name: 'lab' }, { kind: 'slices', label: '设计实验室' })
              }}
            >
              前往动效实验室
            </Button>
            <Button size="sm" onClick={() => setSettingsOpen(false)}>
              关闭
            </Button>
          </>
        }
      >
        <div className="hc-field" style={{ marginBottom: 22 }}>
          <span className="hc-label">主题</span>
          <Segmented
            label="主题"
            value={settings.theme}
            options={[
              { value: 'dark', label: '暗色终端' },
              { value: 'paper', label: '档案纸面' },
            ]}
            onChange={(v) => updateSettings({ theme: v })}
          />
          <span className="hc-hint">
            纸面主题为独立校准的对照主题，不是简单反相；频道色同步降饱和。
          </span>
        </div>

        <div className="hc-field" style={{ marginBottom: 22 }}>
          <span className="hc-label">动效偏好</span>
          <Segmented
            label="动效偏好"
            value={settings.motion}
            options={[
              { value: 'system', label: '跟随系统' },
              { value: 'reduce', label: '减少' },
              { value: 'full', label: '完整' },
            ]}
            onChange={(v) => updateSettings({ motion: v })}
          />
          <span className="hc-hint">
            当前解析为：{settings.reduceMotion ? '减少动态' : '完整动效'} · 系统偏好
            {settings.motion === 'system' ? '生效中' : '已被手动覆盖'}
          </span>
        </div>

        <div className="hc-field" style={{ marginBottom: 22 }}>
          <span className="hc-label">转场速度倍率</span>
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

        <div className="hc-field" style={{ marginBottom: 22 }}>
          <span className="hc-label">转场强度</span>
          <Toggle
            label="快速模式（时长 ×0.6，减少遮罩层数）"
            checked={settings.quick}
            onChange={(v) => updateSettings({ quick: v })}
          />
        </div>

        <div className="hc-panel" style={{ background: 'var(--hc-inset)' }}>
          <div
            className="hc-panel__body"
            style={{ fontSize: 12, color: 'var(--hc-ink-3)', lineHeight: 1.8 }}
          >
            速度、模式、动效偏好与主题都会保存。跟随系统模式只记录「跟随」，不会把手动减少误存为强制减少。
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <Button size="sm" variant="ghost" onClick={() => resetSettings()}>
            恢复默认设置
          </Button>
        </div>
      </Drawer>
    </div>
  )
}
