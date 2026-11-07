import { useEffect, useState } from 'react'
import { CHANNELS } from '../lib/data'
import { useTransition } from '../transition/TransitionProvider'
import {
  IconArrowRight,
  IconArrowUpRight,
  IconBarcode,
  IconChartArcs,
  IconPlay,
  IconSignal,
  IconTarget,
} from '../components/Icon'
import { CitySignalOverview, ChannelSigil } from '../components/ChannelSigil'
import { Button, CornerSet, CountTo, SampleTag, Status } from '../components/ui'

export function Home() {
  const { navigate } = useTransition()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  return (
    <div className={`hc-home ${ready ? 'is-ready' : ''}`}>
      <section className="hc-cover" aria-labelledby="home-title">
        <div className="hc-cover__paper hc-paper" data-channel="arena">
          <CornerSet className="hc-cover__corners" />
          <span className="hc-halftone45 hc-cover__ht" aria-hidden="true" />
          <div className="hc-cover__top">
            <span className="hc-mono">HC-07 / 2026.11.06</span>
            <SampleTag label="SAMPLE DATA" />
            <span className="hc-cover__topline" aria-hidden="true" />
            <span className="hc-mono">P2.1</span>
          </div>

          <h1 className="hc-cover__title" id="home-title" data-page-title tabIndex={-1}>
            <span className="hc-cover__en">HONEY CITY / CHANNEL TERMINAL</span>
            <span className="hc-cover__cn">蜜果城</span>
            <span className="hc-cover__sub">
              <span className="hc-cover__outline">争锋频道</span>
              <span className="hc-cover__latin">RIVALRY CHANNEL</span>
            </span>
          </h1>

          <p className="hc-cover__desc">
            四个频道共用一套工业制图语言。信号从中央塔发出，经四个信号段分发到看台、回廊、档案室与工坊。
            <b>这里没有玩法，只有界面本身。</b>
          </p>

          <div className="hc-cover__actions">
            <Button
              variant="primary"
              icon={<IconArrowRight size={14} />}
              onClick={() =>
                navigate({ name: 'channel', param: 'arena' }, { kind: 'mask', label: '争锋频道' })
              }
            >
              进入争锋频道
            </Button>
            <Button
              icon={<IconPlay size={13} />}
              onClick={() => navigate({ name: 'lab' }, { kind: 'slices', label: '设计实验室' })}
            >
              打开实验台
            </Button>
          </div>

          <div className="hc-cover__meta">
            <div>
              <CountTo value={4} pad={2} />
              <em>CHANNELS / 频道</em>
            </div>
            <div>
              <CountTo value={1} pad={2} />
              <em>ON AIR / 直播</em>
            </div>
            <div>
              <CountTo value={3} pad={2} />
              <em>OPEN / 开放</em>
            </div>
            <div>
              <CountTo value={98.2} decimals={1} />
              <em>SIGNAL / 信号</em>
            </div>
          </div>

          <div className="hc-cover__foot">
            <span className="hc-barcode" aria-hidden="true" />
            <span className="hc-mono">SAMPLE DATA / 非官方研究样本</span>
            <span className="hc-mono">SECTOR 04</span>
          </div>

          <span className="hc-cover__stamp" aria-hidden="true">
            <IconTarget size={14} />
            <span>VERIFIED SAMPLE</span>
          </span>
        </div>

        <div className="hc-cover__screen hc-graphite">
          <div className="hc-screen__bar">
            <span className="hc-screen__brand">
              <IconSignal size={14} />
              SIGNAL OVERVIEW
            </span>
            <span className="hc-screen__live">
              <i /> LIVE
            </span>
            <span className="hc-mono">98.2</span>
          </div>
          <div className="hc-screen__art">
            <CitySignalOverview className="hc-overview" />
          </div>
          <div className="hc-screen__readout">
            <div>
              <span className="hc-mono hc-screen__k">TOWER</span>
              <b className="hc-mono">CENTRAL / 04</b>
            </div>
            <div>
              <span className="hc-mono hc-screen__k">CHANNELS</span>
              <b className="hc-mono">04 / 01 LIVE</b>
            </div>
            <div>
              <span className="hc-mono hc-screen__k">UPLINK</span>
              <b className="hc-mono">0.4s</b>
            </div>
            <div>
              <span className="hc-mono hc-screen__k">MODE</span>
              <b className="hc-mono">PAPER / DARK</b>
            </div>
          </div>
          <span className="hc-screen__corner hc-screen__corner--tl" aria-hidden="true" />
          <span className="hc-screen__corner hc-screen__corner--br" aria-hidden="true" />
        </div>
      </section>

      <div className="hc-corridor" aria-label="频道入口">
        <div className="hc-corridor__head">
          <span className="hc-mono">CHANNEL CORRIDOR / 频道廊道</span>
          <span className="hc-mono">SELECT · 点击进入</span>
        </div>
        {CHANNELS.map((ch) => (
          <button
            key={ch.id}
            type="button"
            className="hc-corridor__row hc-cut-tr"
            data-channel={ch.id}
            onClick={(e) =>
              navigate(
                { name: 'channel', param: ch.id },
                {
                  kind: 'zoom',
                  anchor: e.currentTarget.getBoundingClientRect(),
                  label: ch.name,
                },
              )
            }
          >
            <span className="idx">{ch.index}</span>
            <ChannelSigil id={ch.id} size={30} className="hc-corridor__sigil" />
            <span className="name">
              {ch.name}
              <em>{ch.en}</em>
            </span>
            <span className="desc">{ch.desc}</span>
            <Status kind={ch.statusKind}>{ch.status}</Status>
            <IconArrowUpRight size={16} />
          </button>
        ))}
      </div>

      <section className="hc-specs" aria-label="样本组成">
        <div className="hc-specs__lead">
          <span className="hc-en">// WHAT IS THIS</span>
          <h3>
            不是后台。
            <br />
            是一套可拆的界面语言。
          </h3>
          <p>
            结构、层级、切角、动效节奏都拆成了可复用的部分。所有控件能操作，所有转场能中断和重播。
          </p>
          <div className="hc-specs__seal">
            <IconChartArcs size={18} />
            <span className="hc-mono">4 CHANNELS / 5 TRANSITIONS / 2 THEMES</span>
          </div>
        </div>
        <div className="hc-specs__list">
          {[
            {
              num: '01',
              name: '视觉语言',
              en: 'TOKENS / TYPE / CUT',
              desc: '纸面与石墨分层、切角表示可点击、信号色只表达功能',
            },
            {
              num: '02',
              name: '转场系统',
              en: 'NINE PAGE TRANSITIONS',
              desc: '九种页面级转场，统一调度、可中断、可暂停',
            },
            {
              num: '03',
              name: '组件状态',
              en: 'BUTTON / TAB / DRAWER / MODAL',
              desc: '默认、悬停、按下、焦点、禁用与加载',
            },
          ].map((item) => (
            <button
              type="button"
              className="hc-specs__item hc-cut-tr"
              key={item.num}
              onClick={() => navigate({ name: 'lab' }, { kind: 'wipe', label: '设计实验室' })}
            >
              <b className="hc-mono">{item.num}</b>
              <strong>{item.name}</strong>
              <span>
                {item.en} · {item.desc}
              </span>
              <IconArrowUpRight size={16} />
            </button>
          ))}
        </div>
      </section>

      <div className="hc-home__foot">
        <span className="hc-mono">
          <IconBarcode size={14} /> HONEY CITY / UI &amp; MOTION STUDY
        </span>
        <span className="hc-mono">非官方研究项目 · 与鹰角网络无隶属关系</span>
      </div>
    </div>
  )
}
