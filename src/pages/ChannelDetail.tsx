import { Fragment, useState } from 'react'
import {
  CHANNELS,
  RULES,
  getChannel,
  type ScheduleItem,
} from '../lib/data'
import { useTransition } from '../transition/TransitionProvider'
import {
  IconArrowRight,
  IconCalendar,
  IconCheck,
  IconDownload,
  IconRefresh,
  IconSignal,
} from '../components/Icon'
import { Drawer, Modal } from '../components/overlays'
import {
  Button,
  Checkbox,
  DataRow,
  Panel,
  Progress,
  CornerSet,
  SampleTag,
  Segmented,
  Status,
  Tabs,
  Tag,
  Toggle,
  useToast,
} from '../components/ui'
import { ChannelSigil, ChannelTexture } from '../components/ChannelSigil'

const TABS = [
  { id: 'overview', label: '总览', en: '01' },
  { id: 'schedule', label: '赛程', en: '02' },
  { id: 'archive', label: '档案', en: '03' },
  { id: 'rules', label: '规则', en: '04' },
]

export function ChannelDetail() {
  const { route, navigate } = useTransition()
  const channel = getChannel(route.param)
  const [tab, setTab] = useState('overview')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [detail, setDetail] = useState<ScheduleItem | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [agreed, setAgreed] = useState(false)
  const [session, setSession] = useState<'round2' | 'round3'>('round2')
  const [encrypted, setEncrypted] = useState(true)
  const toast = useToast()

  const switchChannel = (id: string) => {
    navigate(
      { name: 'channel', param: id },
      { kind: 'wipe', label: getChannel(id).name, keepScroll: true },
    )
  }

  const quoteParts = channel.feature.quote.split(channel.feature.emphasis)

  return (
    <div className="hc-page hc-detail" data-channel={channel.id}>
      <header className="hc-detail__head hc-paper" data-channel={channel.id}>
        <span className="hc-detail__texture" aria-hidden="true">
          <ChannelTexture id={channel.id} />
        </span>
        <CornerSet className="hc-detail__corners" />
        <div className="hc-detail__id">
          <div className="hc-nameplate">
            <span className="hc-nameplate__code">{channel.code}</span>
            <span className="hc-nameplate__diamond" />
            <span className="hc-nameplate__x">×</span>
            <span className="hc-nameplate__arrow" />
          </div>
          <div className="hc-detail__kicker">
            <span>CHANNEL / 频道详情</span>
            <span>· 第七赛季</span>
            <SampleTag label="SAMPLE DATA" />
          </div>
          <h1
            className="hc-detail__title"
            data-page-title
            data-shared-title
            tabIndex={-1}
          >
            {channel.name}
            <span className="en">{channel.en}</span>
          </h1>
          <p className="hc-detail__desc">{channel.intro}</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 16 }}>
            {channel.tags.map((t) => (
              <Tag key={t} variant="muted">
                {t}
              </Tag>
            ))}
            <Status kind={channel.statusKind}>{channel.status}</Status>
          </div>
        </div>
        <div className="hc-detail__crest" aria-hidden="true">
          <ChannelSigil id={channel.id} size={420} />
          <span className="hc-detail__crestcode">
            {channel.index} / {channel.code}
          </span>
        </div>
      </header>

      <div className="hc-detail__bar">
        <Tabs items={TABS} value={tab} onChange={setTab} label="频道分区" />
        <div className="hc-theme" role="group" aria-label="切换频道主题">
          {CHANNELS.map((c) => (
            <button
              key={c.id}
              type="button"
              className="hc-theme__sig"
              aria-pressed={c.id === channel.id}
              aria-label={`切换到${c.name}`}
              title={c.name}
              onClick={() => switchChannel(c.id)}
            >
              <ChannelSigil id={c.id} size={24} compact />
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, paddingRight: 2 }}>
          <Button size="sm" onClick={() => setDrawerOpen(true)}>
            频道参数
          </Button>
          <Button size="sm" variant="primary" onClick={() => setModalOpen(true)}>
            预约观赛
          </Button>
        </div>
      </div>

      <div className="hc-detail__body">
        <div
          role="tabpanel"
          id={`tab-panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          className="hc-lab__panel"
        >
          {tab === 'overview' && (
            <>
              <div className="hc-feature hc-paper" data-channel={channel.id}>
                <div className="hc-feature__label">
                  <span>{channel.feature.label}</span>
                </div>
                <p className="hc-feature__quote">
                  {quoteParts[0]}
                  <em>{channel.feature.emphasis}</em>
                  {quoteParts[1]}
                </p>
                <div className="hc-feature__foot">
                  <span>{channel.feature.note}</span>
                  <span>{channel.code}</span>
                </div>
              </div>

              <div className="hc-stats hc-graphite">
                {channel.stats.map((s) => (
                  <div className="hc-stat" key={s.label}>
                    <b>{s.value}</b>
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="hc-section-title">
                <h3>今日排程</h3>
                <span className="en">TODAY / 04 ENTRIES</span>
              </div>
              <div className="hc-sched">
                {channel.schedule.map((row) => (
                  <button
                    type="button"
                    className="hc-sched__row hc-cut-tr"
                    key={row.code}
                    onClick={() => {
                      setDetail(row)
                      setDetailOpen(true)
                    }}
                  >
                    <span className="hc-sched__time">{row.time}</span>
                    <span className="hc-sched__code">{row.code}</span>
                    <span className="hc-sched__main">
                      <b>{row.title}</b>
                      <span>{row.meta}</span>
                    </span>
                    <Status kind={row.statusKind}>{row.status}</Status>
                    <IconArrowRight size={13} />
                  </button>
                ))}
              </div>
              <p
                style={{
                  marginTop: 12,
                  fontSize: 11,
                  color: 'var(--hc-ink-4)',
                  lineHeight: 1.8,
                }}
              >
                排程数据为演示内容。点击任意条目查看场次详情，详情为弹窗层，不改变当前路由。
              </p>
            </>
          )}

          {tab === 'schedule' && (
            <>
              <div className="hc-section-title">
                <h3>完整排程</h3>
                <span className="en">SEASON 07 / ROUND 02</span>
              </div>
              <table className="hc-table">
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>编号</th>
                    <th>对阵 / 内容</th>
                    <th>场地</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  {channel.schedule.map((row) => (
                    <Fragment key={row.code}>
                      <tr
                        aria-expanded={expanded === row.code}
                        aria-controls={`sched-detail-${row.code}`}
                        tabIndex={0}
                        onClick={() =>
                          setExpanded(expanded === row.code ? null : row.code)
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setExpanded(expanded === row.code ? null : row.code)
                          }
                        }}
                      >
                        <td className="mono">{row.time}</td>
                        <td className="mono">{row.code}</td>
                        <td>
                          <b>{row.title}</b>
                        </td>
                        <td>{row.meta.split(' · ')[0]}</td>
                        <td>
                          <Status kind={row.statusKind}>{row.status}</Status>
                        </td>
                      </tr>
                      {expanded === row.code && (
                        <tr key={`${row.code}-detail`} id={`sched-detail-${row.code}`}>
                          <td colSpan={5} style={{ background: 'var(--hc-surface)' }}>
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 16,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <span style={{ fontSize: 12, color: 'var(--hc-ink-3)' }}>
                                {row.meta} · 信号由中央塔统一调度，机位切换由导播组确认。
                              </span>
                              <span style={{ display: 'flex', gap: 8 }}>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setDetail(row)
                                    setDetailOpen(true)
                                  }}
                                >
                                  场次详情
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    toast({
                                      text: `已加入日程：${row.title}`,
                                      meta: `${row.code} / ${row.time}`,
                                      kind: 'success',
                                    })
                                  }
                                >
                                  加入日程
                                </Button>
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {tab === 'archive' && (
            <>
              <div className="hc-section-title">
                <h3>频道档案</h3>
                <span className="en">ARCHIVE / 07 SEASONS</span>
              </div>
              <div className="hc-people">
                {channel.people.map((p) => (
                  <div className="hc-person" key={p.code}>
                    <span className="hc-person__avatar">{p.name.slice(0, 1)}</span>
                    <span>
                      <b>{p.name}</b>
                      <span>{p.role}</span>
                    </span>
                    <span className="hc-mono" style={{ fontSize: 10, color: 'var(--hc-ink-4)' }}>
                      {p.code}
                    </span>
                  </div>
                ))}
              </div>

              <div className="hc-section-title">
                <h3>收录状态</h3>
                <span className="en">CATALOGUE</span>
              </div>
              <dl className="hc-dl">
                <DataRow label="已归档场次" value="214" hint="场" />
                <DataRow label="影像总时长" value="86:42" hint="时:分" />
                <DataRow label="最近更新" value="2026-10-30 22:18" />
                <DataRow label="修复队列" value="03" hint="待处理" />
              </dl>
              <div style={{ marginTop: 20 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 11,
                    color: 'var(--hc-ink-3)',
                    marginBottom: 8,
                  }}
                >
                  <span>影像修复进度</span>
                  <span className="hc-mono">68%</span>
                </div>
                <Progress value={68} label="影像修复进度" />
              </div>

              <div style={{ marginTop: 24 }}>
                <Button
                  size="sm"
                  icon={<IconDownload size={13} />}
                  onClick={() =>
                    toast({
                      text: '档案索引已加入导出队列',
                      meta: 'FORMAT / CSV · 1,284 ITEMS',
                      kind: 'success',
                    })
                  }
                >
                  导出索引
                </Button>
              </div>
            </>
          )}

          {tab === 'rules' && (
            <>
              <div className="hc-section-title">
                <h3>频道规则</h3>
                <span className="en">RULES / 05</span>
              </div>
              <div className="hc-rules">
                {RULES.map((r) => (
                  <article className="hc-rule-item" key={r.title}>
                    <div>
                      <h4>{r.title}</h4>
                      <p>{r.body}</p>
                    </div>
                  </article>
                ))}
              </div>
              <p
                style={{
                  marginTop: 20,
                  fontSize: 11,
                  color: 'var(--hc-ink-4)',
                  maxWidth: '68ch',
                  lineHeight: 1.8,
                }}
              >
                规则文本为演示内容，用于测试长文排版、编号与段落节奏，不构成任何实际约束。
              </p>
            </>
          )}
        </div>

        <aside className="hc-aside">
          <Panel
            title="频道参数"
            en="PARAMETERS"
            extra={
              <Button
                variant="ghost"
                size="sm"
                aria-label="展开完整参数"
                onClick={() => setDrawerOpen(true)}
              >
                <IconArrowRight size={13} />
              </Button>
            }
          >
            <dl className="hc-dl">
              <DataRow label="频道编号" value={channel.code} />
              <DataRow label="信号类型" value="公开 / 单向" />
              <DataRow label="延迟" value="0.4s" />
              <DataRow label="在线席位" value="218 / 320" />
              <DataRow label="导播" value={channel.people[0].name} />
            </dl>
          </Panel>

          <Panel
            title="信号完整度"
            en="INTEGRITY"
            extra={<IconSignal size={14} style={{ color: 'var(--hc-accent)' }} />}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}
            >
              <span className="hc-mono" style={{ fontSize: 28, lineHeight: 1 }}>
                98.2
              </span>
              <span className="hc-mono" style={{ fontSize: 10, color: 'var(--hc-ink-4)' }}>
                / 100
              </span>
            </div>
            <Progress value={98} label="信号完整度" />
            <dl className="hc-dl" style={{ marginTop: 14 }}>
              <DataRow label="丢帧" value="0.02%" />
              <DataRow label="备用线路" value="就绪" />
            </dl>
          </Panel>

          <Panel title="值班" en="ON DUTY">
            <div className="hc-people" style={{ border: 0 }}>
              {channel.people.map((p) => (
                <div className="hc-person" key={p.code} style={{ padding: '10px 0', background: 'transparent' }}>
                  <span className="hc-person__avatar">{p.name.slice(0, 1)}</span>
                  <span>
                    <b>{p.name}</b>
                    <span>{p.role}</span>
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <div
            style={{
              border: '1px solid var(--hc-line-2)',
              borderLeft: '2px solid var(--hc-accent)',
              padding: 16,
              background: 'var(--hc-canvas-2)',
            }}
          >
            <div className="hc-en" style={{ marginBottom: 6 }}>
              TRANSITION
            </div>
            <p style={{ fontSize: 11, color: 'var(--hc-ink-3)', lineHeight: 1.8 }}>
              切换频道主题将播放「上下擦入」转场，并保持当前滚动位置——同一页面空间内的信息替换，而不是整页重载。
            </p>
          </div>
        </aside>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="频道参数"
        en="CHANNEL / PARAMETERS"
        meta={`${channel.code} · 修订 2026-10-28`}
        footer={
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setDrawerOpen(false)
                toast({ text: '参数已同步至终端', meta: 'APPLY / OK', kind: 'success' })
              }}
            >
              应用
            </Button>
            <Button size="sm" onClick={() => setDrawerOpen(false)}>
              取消
            </Button>
          </>
        }
      >
        <div className="hc-field" style={{ marginBottom: 20 }}>
          <span className="hc-label">信号加密</span>
          <Toggle label="启用频道端到端加密" checked={encrypted} onChange={setEncrypted} />
          <span style={{ fontSize: 11, color: 'var(--hc-ink-4)', lineHeight: 1.7 }}>
            关闭后信号将回落至公开段，仅影响演示状态。
          </span>
        </div>
        <div className="hc-field" style={{ marginBottom: 20 }}>
          <span className="hc-label">默认场次</span>
          <Segmented
            label="默认场次"
            value={session}
            options={[
              { value: 'round2', label: '第二轮' },
              { value: 'round3', label: '第三轮' },
            ]}
            onChange={setSession}
          />
        </div>
        <dl className="hc-dl" style={{ marginBottom: 20 }}>
          <DataRow label="频道编号" value={channel.code} />
          <DataRow label="主题色" value={channel.accent.toUpperCase()} />
          <DataRow label="信号延迟" value="0.4s" hint="公开段" />
          <DataRow label="席位上限" value="320" />
          <DataRow label="当前在线" value="218" />
          <DataRow label="备用线路" value="就绪" />
          <DataRow label="最近检修" value="2026-10-29" />
        </dl>
        <div
          style={{
            border: '1px solid var(--hc-line-1)',
            padding: 12,
            fontSize: 11,
            lineHeight: 1.8,
            color: 'var(--hc-ink-4)',
          }}
        >
          <IconCalendar size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
          参数变更将在下一场次开始时生效。抽屉打开时焦点被限制在面板内，ESC
          可关闭并归还焦点。
        </div>
      </Drawer>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="预约观赛"
        en="RESERVATION / SEAT"
        footer={
          <>
            <Button
              variant="primary"
              size="sm"
              disabled={!agreed}
              icon={<IconCheck size={13} />}
              onClick={() => {
                setModalOpen(false)
                setAgreed(false)
                toast({
                  text: `已预约 ${channel.name} · 第二轮`,
                  meta: 'SEAT LOCKED / 确认后不可转让',
                  kind: 'success',
                })
              }}
            >
              确认预约
            </Button>
            <Button size="sm" onClick={() => setModalOpen(false)}>
              取消
            </Button>
          </>
        }
      >
        <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
          预约将锁定一个看台席位，绑定当前终端账号。席位不可转让，开场前两小时可取消。
        </p>
        <dl className="hc-dl" style={{ marginBottom: 16 }}>
          <DataRow label="频道" value={channel.name} />
          <DataRow label="场次" value={session === 'round2' ? '第二轮 · 第 5 场' : '第三轮 · 待定'} />
          <DataRow label="席位" value="西看台 G-214" />
          <DataRow label="时间" value="今日 21:00" />
        </dl>
        <Checkbox
          label="我已阅读并同意频道调度规则"
          checked={agreed}
          onChange={setAgreed}
        />
        <p style={{ fontSize: 11, color: 'var(--hc-ink-4)', marginTop: 10 }}>
          未勾选时主操作保持禁用态，用于演示 disabled 与 focus 的差异。
        </p>
      </Modal>

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={detail?.title ?? ''}
        en={`SCHEDULE / ${detail?.code ?? ''}`}
        footer={
          <>
            <Button
              size="sm"
              icon={<IconRefresh size={12} />}
              onClick={() =>
                toast({ text: '场次信息已刷新', meta: detail?.code, kind: 'default' })
              }
            >
              刷新
            </Button>
            <Button size="sm" variant="primary" onClick={() => setDetail(null)}>
              知道了
            </Button>
          </>
        }
      >
        <dl className="hc-dl">
          <DataRow label="时间" value={detail?.time ?? ''} />
          <DataRow label="场地" value={detail?.meta ?? ''} />
          <DataRow label="状态" value={detail?.status ?? ''} />
          <DataRow label="信号" value="中央塔 · 主线路" />
        </dl>
        <p style={{ marginTop: 16, fontSize: 12, lineHeight: 1.8, color: 'var(--hc-ink-3)' }}>
          本场次由导播组统一调度，机位切换与解说通道在开场前十分钟锁定。迟到人员不得从主通道进入。
        </p>
      </Modal>
    </div>
  )
}
