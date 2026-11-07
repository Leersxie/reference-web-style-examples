import { useEffect, useMemo, useRef, useState } from 'react'
import { LOGS, LOG_KINDS, type LogKind, type LogStatus } from '../lib/data'
import {
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconRefresh,
  IconSearch,
} from '../components/Icon'
import { Dropdown } from '../components/overlays'
import {
  Button,
  EmptyState,
  SampleTag,
  SearchInput,
  Skeleton,
  Status,
  Tag,
  useToast,
} from '../components/ui'
import { ChannelAux } from '../components/ChannelSigil'

const PAGE_SIZE = 6

const STATUS_OPTIONS: { value: 'all' | LogStatus; label: string }[] = [
  { value: 'all', label: '全部状态' },
  { value: '已发布', label: '已发布' },
  { value: '审核中', label: '审核中' },
  { value: '进行中', label: '进行中' },
  { value: '已归档', label: '已归档' },
]

const statusKind = (s: LogStatus): 'ok' | 'warn' | 'live' | 'idle' => {
  if (s === '已发布') return 'ok'
  if (s === '审核中') return 'warn'
  if (s === '进行中') return 'live'
  return 'idle'
}

export function Terminal() {
  const toast = useToast()
  const [kind, setKind] = useState<'all' | LogKind>('all')
  const [status, setStatus] = useState<'all' | LogStatus>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState<string | null>('l2')
  const [loading, setLoading] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current)
    },
    [],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return LOGS.filter((l) => {
      if (kind !== 'all' && l.kind !== kind) return false
      if (status !== 'all' && l.status !== status) return false
      if (!q) return true
      return (
        l.title.toLowerCase().includes(q) ||
        l.code.includes(q) ||
        l.detail.toLowerCase().includes(q)
      )
    })
  }, [kind, status, query])

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pages)
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const resetPage = () => setPage(1)

  const refresh = () => {
    setLoading(true)
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setLoading(false)
      toast({ text: '终端日志已同步', meta: 'LATEST / 14 ENTRIES', kind: 'success' })
    }, 900)
  }

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(`HC-LOG-${code}`)
      toast({ text: `已复制编号 HC-LOG-${code}`, meta: 'CLIPBOARD', kind: 'default' })
    } catch {
      toast({ text: '当前环境无法访问剪贴板', meta: 'CLIPBOARD / DENIED', kind: 'warn' })
    }
  }

  return (
    <div className="hc-page">
      <header className="hc-pagehead">
        <div>
          <div className="hc-pagehead__kicker">
            TERMINAL / 04
            <SampleTag />
          </div>
          <h1 data-page-title tabIndex={-1}>
            终端 <em>/ 信息流</em>
          </h1>
          <div className="hc-pagehead__en">LOG STREAM · DISPATCH · ARCHIVE</div>
          <p className="hc-pagehead__desc">
            频道系统的公开日志。筛选、检索、展开与分页都在客户端完成，用于检验密集信息排版下的行高、对齐与状态表达。
          </p>
        </div>
        <div className="hc-pagehead__meta">
          <b>14</b>
          ENTRIES
          <span>SYNC 09:12</span>
        </div>
      </header>

      <div className="hc-term__summary" aria-label="日志概况">
        <div className="hc-term__cell">
          <span>总条目</span>
          <b>14</b>
        </div>
        <div className="hc-term__cell">
          <span>今日新增</span>
          <b>04</b>
        </div>
        <div className="hc-term__cell">
          <span>待处理</span>
          <b>02</b>
        </div>
        <div className="hc-term__cell">
          <span>最近同步</span>
          <b>09:12</b>
        </div>
      </div>

      <div className="hc-term__layout">
        <div className="hc-filters" aria-label="按类型筛选">
          <div className="hc-filters__head">TYPE / 类型</div>
          <button
            type="button"
            className="hc-filter"
            aria-pressed={kind === 'all'}
            onClick={() => {
              setKind('all')
              resetPage()
            }}
          >
            全部日志
            <em>{String(LOGS.length).padStart(2, '0')}</em>
          </button>
          {LOG_KINDS.map((k) => {
            const n = LOGS.filter((l) => l.kind === k).length
            return (
              <button
                key={k}
                type="button"
                className="hc-filter"
                aria-pressed={kind === k}
                onClick={() => {
                  setKind(k)
                  resetPage()
                }}
              >
                {k}
                <em>{String(n).padStart(2, '0')}</em>
              </button>
            )
          })}
        </div>

        <div>
          <div className="hc-term__bar">
            <SearchInput
              className="hc-term__search"
              value={query}
              onChange={(v) => {
                setQuery(v)
                resetPage()
              }}
              onClear={() => {
                setQuery('')
                resetPage()
              }}
              placeholder="检索标题、编号或正文"
              aria-label="检索日志"
            />
            <Dropdown
              label="状态筛选"
              value={status}
              options={STATUS_OPTIONS}
              onChange={(v) => {
                setStatus(v)
                resetPage()
              }}
              minWidth={124}
            />
            <Button
              size="sm"
              icon={<IconRefresh size={13} />}
              onClick={refresh}
              loading={loading}
              aria-label="同步日志"
            >
              同步
            </Button>
            <span className="grow" />
            <span className="hc-toolbar__count">
              命中 <b>{String(filtered.length).padStart(2, '0')}</b> / {LOGS.length}
            </span>
          </div>

          <div className="hc-loglist hc-paper">
            <div className="hc-loglist__head" aria-hidden="true">
              <span>TIME</span>
              <span>CODE</span>
              <span>SUBJECT</span>
              <span>TYPE</span>
              <span>STATUS</span>
              <span />
            </div>

            {loading ? (
              <div style={{ display: 'grid', gap: 1, background: 'var(--hc-line-1)' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '92px 84px 1fr 92px 88px',
                      gap: 12,
                      padding: '14px 12px',
                      background: 'var(--hc-canvas-2)',
                    }}
                  >
                    <Skeleton height={11} width="70%" />
                    <Skeleton height={11} width="60%" />
                    <Skeleton height={11} width={`${60 + i * 6}%`} />
                    <Skeleton height={11} width="60%" />
                    <Skeleton height={11} width="70%" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ paddingTop: 16 }}>
                <EmptyState
                  code="NO MATCH / 0"
                  title="没有符合条件的条目"
                  desc="当前类型、状态与关键词的组合没有命中任何日志。清除筛选后可查看全部十四条目。"
                  action={
                    <Button
                      size="sm"
                      onClick={() => {
                        setKind('all')
                        setStatus('all')
                        setQuery('')
                        resetPage()
                      }}
                    >
                      清除筛选
                    </Button>
                  }
                />
              </div>
            ) : (
              rows.map((l) => {
                const isOpen = open === l.id
                return (
                  <div
                    className={[
                      'hc-log',
                      isOpen ? 'is-open' : '',
                      l.priority ? 'is-priority' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    key={l.id}
                  >
                    <button
                      type="button"
                      className="hc-log__row hc-cut-tr"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : l.id)}
                    >
                      <span className="hc-log__time">{l.time}</span>
                      <span className="hc-log__code">HC-{l.code}</span>
                      <span className="hc-log__title">
                        {l.priority && (
                          <>
                            <i className="hc-log__flag" aria-hidden="true" />
                            <span className="hc-sr">优先</span>
                          </>
                        )}
                        <span>{l.title}</span>
                      </span>
                      <Tag>{l.kind}</Tag>
                      <Status kind={statusKind(l.status)}>{l.status}</Status>
                      <IconChevronDown className="hc-log__chev" />
                    </button>
                    {isOpen && (
                      <div className="hc-log__detail">
                        <div>
                          <p>{l.detail}</p>
                          <div className="tags">
                            {l.tags.map((t) => (
                              <Tag key={t} variant="muted">
                                {t}
                              </Tag>
                            ))}
                          </div>
                        </div>
                        <div className="hc-log__ops">
                          <ChannelAux id="archive" variant={1} size={54} className="hc-log__stamp" />
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={<IconCheck size={12} />}
                            onClick={() =>
                              toast({
                                text: `已标记为已读：HC-${l.code}`,
                                meta: 'READ / LOCAL ONLY',
                                kind: 'default',
                              })
                            }
                          >
                            标记已读
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => copy(l.code)}>
                            复制编号
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          <div className="hc-term__foot">
            <span className="hc-toolbar__count">
              第 <b>{safePage}</b> / {pages} 页
            </span>
            <div className="hc-pager" role="navigation" aria-label="分页">
              <button
                type="button"
                aria-label="上一页"
                disabled={safePage <= 1}
                onClick={() => setPage(Math.max(1, safePage - 1))}
              >
                <IconChevronLeft size={13} />
              </button>
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-current={safePage === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
              <button
                type="button"
                aria-label="下一页"
                disabled={safePage >= pages}
                onClick={() => setPage(Math.min(pages, safePage + 1))}
              >
                <IconChevronRight size={13} />
              </button>
            </div>
            <span className="hc-en" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              <IconSearch size={12} /> 客户端筛选 · 无后端
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
