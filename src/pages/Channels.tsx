import { useState } from 'react'
import { CHANNELS, type ChannelId } from '../lib/data'
import { ROUTE_META } from '../lib/router'
import { useTransition } from '../transition/TransitionProvider'
import type { TransitionKind } from '../transition/playTransition'
import { IconArrowUpRight, IconChannel } from '../components/Icon'
import { ChannelSigil, ChannelTexture } from '../components/ChannelSigil'
import { Button, SampleTag, Segmented, Status, Tag } from '../components/ui'
import { Dropdown } from '../components/overlays'

type Filter = 'all' | 'live' | 'standby' | 'open'

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'live', label: '直播中' },
  { value: 'standby', label: '待命' },
  { value: 'open', label: '开放' },
]

const TRANSITIONS: { value: TransitionKind; label: string }[] = [
  { value: 'zoom', label: '缩放聚焦' },
  { value: 'mask', label: '几何遮罩' },
  { value: 'slices', label: '切片拼贴' },
  { value: 'wipe', label: '上下擦入' },
  { value: 'shared', label: '共享主体' },
  { value: 'steps', label: '阶梯推挤' },
  { value: 'shutter', label: '四向快门' },
  { value: 'sheet', label: '纸面翻页' },
  { value: 'glitch', label: '信号故障' },
]

const META: Record<ChannelId, { size: string; layout: string; current?: boolean }> = {
  arena: { size: 'hero', layout: 'a', current: true },
  hive: { size: 'tall', layout: 'b' },
  archive: { size: 'half', layout: 'c' },
  workshop: { size: 'wide', layout: 'd' },
}

const GROUP: Record<ChannelId, Filter> = {
  arena: 'live',
  hive: 'standby',
  archive: 'open',
  workshop: 'open',
}

export function Channels() {
  const { navigate } = useTransition()
  const [filter, setFilter] = useState<Filter>('all')
  const [kind, setKind] = useState<TransitionKind>('zoom')

  const list = CHANNELS.filter((c) => filter === 'all' || GROUP[c.id] === filter)
  const count = String(CHANNELS.length).padStart(2, '0')

  return (
    <div className="hc-page">
      <header className="hc-pagehead">
        <div>
          <div className="hc-pagehead__kicker">
            CHANNEL INDEX / 02
            <SampleTag />
          </div>
          <h1 data-page-title tabIndex={-1}>
            频道索引 <em>/ 四个信号段</em>
          </h1>
          <div className="hc-pagehead__en">SELECT A CHANNEL · TRANSITION ANCHOR</div>
          <p className="hc-pagehead__desc">
            每个频道有独立的徽记、纹理与图形母题，但共享同一套结构与交互规则。点击任意频道即以该卡片为锚点播放转场，可在右侧切换转场类型。
          </p>
        </div>
        <div className="hc-pagehead__meta">
          <b>{count}</b>
          CHANNELS
          <span>HC / 7TH SEASON</span>
        </div>
      </header>

      <div className="hc-toolbar">
        <Segmented label="按状态筛选频道" value={filter} options={FILTERS} onChange={setFilter} />
        <div className="hc-toolbar__spacer" />
        <span className="hc-toolbar__count">
          转场 <b>{TRANSITIONS.find((t) => t.value === kind)?.label}</b>
        </span>
        <Dropdown
          label="选择转场类型"
          value={kind}
          options={TRANSITIONS}
          onChange={setKind}
          minWidth={132}
        />
      </div>

      <div className="hc-chgrid">
        {list.map((ch) => {
          const m = META[ch.id]
          return (
            <button
              type="button"
              key={ch.id}
              className={`hc-tile hc-cut-tr ${m.current ? 'hc-paper' : ch.id === 'hive' || ch.id === 'workshop' ? 'hc-graphite' : 'hc-paper'}`}
              data-size={m.size}
              data-layout={m.layout}
              data-channel={ch.id}
              data-current={m.current ? 'true' : undefined}
              onClick={(e) =>
                navigate(
                  { name: 'channel', param: ch.id },
                  { kind, anchor: e.currentTarget.getBoundingClientRect(), label: ch.name },
                )
              }
            >
              <span className="hc-tile__texture" aria-hidden="true">
                <ChannelTexture id={ch.id} />
              </span>
              <span className="hc-tile__bg" aria-hidden="true" />
              {m.current && <span className="hc-tile__flag">ON AIR</span>}

              <span className="hc-tile__top">
                <span className="idx">{ch.index}</span>
                <span>{ch.code}</span>
                <span className="grow" />
                <Status kind={ch.statusKind}>{ch.status}</Status>
              </span>

              <span className="hc-tile__crest" aria-hidden="true">
                <ChannelSigil id={ch.id} size={420} />
              </span>

              <span className="hc-tile__body">
                <span className="hc-tile__name">{ch.name}</span>
                <span className="hc-tile__en">{ch.en}</span>
                <span className="hc-tile__desc">{ch.desc}</span>
              </span>

              <span className="hc-tile__foot">
                <span style={{ display: 'flex', gap: 6 }}>
                  {ch.tags.slice(0, 2).map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </span>
                <span className="hc-tile__go">
                  进入频道
                  <IconArrowUpRight size={13} />
                </span>
              </span>

              <span className="hc-tile__corner" aria-hidden="true">
                <IconArrowUpRight size={15} />
              </span>
            </button>
          )
        })}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px 24px',
          alignItems: 'center',
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid var(--hc-line-1)',
          fontSize: 11,
          color: 'var(--hc-ink-4)',
          letterSpacing: '.04em',
        }}
      >
        <span className="hc-mono">ANCHOR = {kind.toUpperCase()}</span>
        <span>转场以卡片矩形为起点，覆盖阶段完成内容替换，揭示阶段恢复交互。</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: 8, alignItems: 'center' }}>
          <IconChannel size={13} />
          当前视图 {list.length} / {CHANNELS.length}
        </span>
      </div>

      <div style={{ marginTop: 24 }}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            navigate({ name: 'terminal' }, { kind: 'wipe', label: ROUTE_META.terminal.title })
          }
        >
          前往终端查看频道日志
        </Button>
      </div>
    </div>
  )
}
