import { useId } from 'react'
import type { ChannelId } from '../lib/data'

/* ============================================================
   原创图形资产：统一 viewBox 240 / 120 / 24，描边 1.2
   全部使用 currentColor + var(--hc-accent)，可随频道主题换色
   ============================================================ */

const hexPoints = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30)
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  }).join(' ')

/** 蜜果城总徽记：六边形城徽 + 中央塔 + 轨道 */
export function CityEmblem({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      aria-hidden="true"
    >
      <polygon points={hexPoints(16, 16, 14)} opacity=".55" />
      <polygon points={hexPoints(16, 16, 10.5)} opacity=".22" />
      <path d="M16 6.5v19" opacity=".55" />
      <path d="M12 25.5 16 16l4 9.5" opacity=".8" />
      <path d="M13.4 18.6h5.2" opacity=".6" />
      <path d="M16 9.2l1.7 1.7L16 12.6 14.3 10.9z" fill="var(--hc-accent)" stroke="none" />
      <path d="M4.6 16h2.2M25.2 16h2.2" opacity=".45" />
    </svg>
  )
}

/** 四个频道主徽记 */
export function ChannelSigil({
  id,
  size = 200,
  className,
  compact = false,
}: {
  id: ChannelId
  size?: number
  className?: string
  compact?: boolean
}) {
  if (compact) {
    return (
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        aria-hidden="true"
      >
        {id === 'arena' && (
          <>
            <path d="M24 8 40 24 24 40 8 24z" />
            <path d="M24 16 32 24 24 32 16 24z" fill="var(--hc-accent)" stroke="none" />
          </>
        )}
        {id === 'hive' && (
          <>
            <polygon points={hexPoints(24, 24, 16)} />
            <polygon points={hexPoints(24, 24, 8)} fill="var(--hc-accent)" stroke="none" />
          </>
        )}
        {id === 'archive' && (
          <>
            <rect x="11" y="9" width="26" height="32" />
            <path d="M16 17h16M16 23h16M16 29h9" opacity=".55" />
            <circle cx="31" cy="33" r="6" stroke="var(--hc-accent)" />
          </>
        )}
        {id === 'workshop' && (
          <>
            <circle cx="24" cy="24" r="16" />
            <path d="M24 24 32 13" stroke="var(--hc-accent)" strokeWidth="2" />
            <circle cx="24" cy="24" r="3" fill="var(--hc-accent)" stroke="none" />
          </>
        )}
      </svg>
    )
  }
  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      aria-hidden="true"
    >
      {id === 'arena' && <ArenaSigil />}
      {id === 'hive' && <HiveSigil />}
      {id === 'archive' && <ArchiveSigil />}
      {id === 'workshop' && <WorkshopSigil />}
    </svg>
  )
}

function ArenaSigil() {
  return (
    <>
      <circle cx="120" cy="120" r="104" opacity=".18" strokeDasharray="2 8" />
      <circle cx="120" cy="120" r="88" opacity=".5" />
      <circle cx="120" cy="120" r="62" opacity=".14" />
      <path d="M120 6v26M120 208v26M6 120h26M208 120h26" opacity=".5" />
      <path d="M44 84 74 120 44 156M196 84 166 120 196 156" opacity=".78" />
      <path d="M58 98 80 120 58 142M182 98 160 120 182 142" opacity=".35" />
      <path d="M28 34h18M28 34v18M212 34h-18M212 34v18M28 206h18M28 206v-18M212 206h-18M212 206v-18" opacity=".45" />
      <path d="M74 44h92M74 196h92" opacity=".12" />
      <g stroke="var(--hc-accent)">
        <path d="M120 74 166 120 120 166 74 120z" fill="var(--hc-accent-wash)" />
        <path d="M120 92 148 120 120 148 92 120z" fill="var(--hc-accent)" stroke="none" />
        <path d="M120 104 136 120 120 136 104 120z" fill="var(--hc-canvas-2)" stroke="none" />
        <path d="M120 20v54M120 166v54" opacity=".7" />
      </g>
      <path d="M168 52a52 52 0 0 1 20 32" opacity=".5" stroke="var(--hc-accent)" />
      <path d="M48 188a52 52 0 0 1-20-32" opacity=".5" stroke="var(--hc-accent)" />
    </>
  )
}

function HiveSigil() {
  const cells = [
    [120, 120, 30],
    [120, 68, 24],
    [165, 94, 24],
    [165, 146, 24],
    [120, 172, 24],
    [75, 146, 24],
    [75, 94, 24],
  ]
  return (
    <>
      <circle cx="120" cy="120" r="106" opacity=".16" strokeDasharray="1 7" />
      <circle cx="120" cy="120" r="98" opacity=".28" />
      {[
        [120, 68],
        [165, 94],
        [165, 146],
        [120, 172],
        [75, 146],
        [75, 94],
      ].map(([x, y], i) => (
        <g key={i}>
          <line
            x1="120"
            y1="120"
            x2={x}
            y2={y}
            opacity=".28"
            strokeDasharray="3 4"
          />
          <rect x={x - 3} y={y - 3} width="6" height="6" fill="currentColor" opacity=".5" stroke="none" />
        </g>
      ))}
      {cells.map(([x, y, r], i) => (
        <polygon
          key={i}
          points={hexPoints(x, y, r)}
          opacity={i === 0 ? 1 : 0.55}
          stroke={i === 0 ? 'var(--hc-accent)' : 'currentColor'}
          fill={i === 0 ? 'var(--hc-accent-wash)' : 'none'}
        />
      ))}
      <polygon points={hexPoints(120, 120, 14)} fill="var(--hc-accent)" stroke="none" />
      <path d="M22 78v-14h14M218 162v14h-14" opacity=".45" />
      <path d="M120 6v10M120 224v10" opacity=".3" />
    </>
  )
}

function ArchiveSigil() {
  return (
    <>
      <circle cx="120" cy="120" r="106" opacity=".13" strokeDasharray="2 9" />
      <rect x="66" y="40" width="104" height="150" opacity=".22" transform="rotate(-6 118 115)" />
      <rect x="58" y="46" width="116" height="150" opacity=".35" transform="rotate(-3 116 121)" />
      <g>
        <rect x="52" y="52" width="124" height="150" fill="var(--hc-canvas-2)" fillOpacity=".35" />
        <path d="M52 52h124v20H52z" fill="currentColor" opacity=".09" stroke="none" />
        <path d="M64 86h88M64 100h88M64 114h62" opacity=".32" />
        <path d="M64 132h44M64 146h60" opacity=".2" />
        <rect x="64" y="160" width="34" height="24" opacity=".4" />
        <path d="M108 160h30M108 172h22" opacity=".2" />
        <path d="M158 52v20" opacity=".3" />
      </g>
      <g stroke="var(--hc-accent)">
        <circle cx="160" cy="150" r="26" opacity=".9" />
        <circle cx="160" cy="150" r="19" opacity=".45" strokeDasharray="2 4" />
        <path d="M160 134v32M144 150h32" opacity=".6" />
      </g>
      {[66, 84, 102, 120, 138, 156].map((x) => (
        <rect key={x} x={x} y="222" width="8" height="6" opacity=".3" />
      ))}
      <path d="M52 214h124" opacity=".25" />
      <path d="M188 78h14v14" opacity=".5" />
    </>
  )
}

function WorkshopSigil() {
  return (
    <>
      <circle cx="120" cy="120" r="106" opacity=".14" strokeDasharray="2 8" />
      <circle cx="120" cy="120" r="82" opacity=".55" />
      <circle cx="120" cy="120" r="70" opacity=".2" />
      {Array.from({ length: 48 }, (_, i) => {
        const a = (Math.PI / 180) * (i * 7.5 - 90)
        const long = i % 6 === 0
        const r1 = long ? 70 : 76
        const r2 = 82
        return (
          <line
            key={i}
            x1={120 + Math.cos(a) * r1}
            y1={120 + Math.sin(a) * r1}
            x2={120 + Math.cos(a) * r2}
            y2={120 + Math.sin(a) * r2}
            opacity={long ? 0.6 : 0.25}
          />
        )
      })}
      <g stroke="var(--hc-accent)">
        <path d="M56 168a72 72 0 0 1 20-96" opacity=".9" strokeWidth="2" />
        <path d="M120 120 158 78" strokeWidth="1.6" />
        <circle cx="120" cy="120" r="8" fill="var(--hc-accent)" stroke="none" />
        <circle cx="120" cy="120" r="3.5" fill="var(--hc-canvas-2)" stroke="none" />
      </g>
      <path d="M56 62h54M56 70h34" opacity=".3" />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 62 + (i % 4) * 16
        const y = 156 + Math.floor(i / 4) * 16
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width="12"
            height="12"
            opacity={i === 9 ? 1 : 0.22}
            stroke={i === 9 ? 'var(--hc-accent)' : 'currentColor'}
            fill={i === 9 ? 'var(--hc-accent-wash)' : 'none'}
          />
        )
      })}
      <path d="M120 24v14M120 202v14" opacity=".35" />
    </>
  )
}

/** 频道辅助图形：每个频道 2 个 */
export function ChannelAux({
  id,
  variant = 0,
  size = 88,
  className,
}: {
  id: ChannelId
  variant?: 0 | 1
  size?: number
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      {id === 'arena' && variant === 0 && (
        <>
          <path d="M12 60h34M74 60h34" opacity=".5" />
          <path d="M34 42 60 60 34 78M86 42 60 60 86 78" />
          <path d="M60 18v84" opacity=".2" />
          <path d="M60 52 68 60 60 68 52 60z" fill="var(--hc-accent)" stroke="none" />
        </>
      )}
      {id === 'arena' && variant === 1 && (
        <>
          <rect x="18" y="26" width="84" height="68" opacity=".25" />
          <path d="M30 44h64M30 58h64M30 72h40" opacity=".3" />
          <path d="M30 84h20" stroke="var(--hc-accent)" />
          <circle cx="90" cy="76" r="12" opacity=".5" />
          <path d="M90 68v16M82 76h16" opacity=".8" />
        </>
      )}
      {id === 'hive' && variant === 0 && (
        <>
          <polygon points={hexPoints(40, 60, 24)} opacity=".5" />
          <polygon points={hexPoints(78, 60, 24)} stroke="var(--hc-accent)" />
          <path d="M64 60h-0.5M16 60h0M102 60h0" opacity=".1" />
          <path d="M64 60h-2M16 60h0M102 60h0" opacity=".1" />
          <path d="M58 60h-2M98 60h2" opacity=".5" />
          <circle cx="78" cy="60" r="5" fill="var(--hc-accent)" stroke="none" />
        </>
      )}
      {id === 'hive' && variant === 1 && (
        <>
          {[46, 36, 26, 16].map((r) => (
            <polygon key={r} points={hexPoints(60, 60, r)} opacity={r === 16 ? 0.9 : 0.24} stroke={r === 16 ? 'var(--hc-accent)' : 'currentColor'} />
          ))}
          <path d="M60 4v12M60 104v12M4 60h12M104 60h12" opacity=".3" />
        </>
      )}
      {id === 'archive' && variant === 0 && (
        <>
          <rect x="24" y="38" width="72" height="14" opacity=".3" />
          <rect x="24" y="58" width="72" height="14" opacity=".45" />
          <rect x="24" y="78" width="76" height="18" stroke="var(--hc-accent)" />
          <path d="M34 87h26" stroke="var(--hc-accent)" />
          <path d="M96 38v14M96 58v14" opacity=".3" />
        </>
      )}
      {id === 'archive' && variant === 1 && (
        <>
          <circle cx="60" cy="60" r="38" opacity=".45" />
          <circle cx="60" cy="60" r="29" opacity=".9" stroke="var(--hc-accent)" strokeDasharray="2 4" />
          <path d="M60 40v40M44 60h32" opacity=".6" stroke="var(--hc-accent)" />
          <path d="M18 18h14v14M102 102H88V88" opacity=".35" />
        </>
      )}
      {id === 'workshop' && variant === 0 && (
        <>
          <path d="M22 78a38 38 0 0 1 76 0" opacity=".6" />
          {Array.from({ length: 11 }, (_, i) => {
            const a = (Math.PI / 180) * (180 + i * 18)
            return (
              <line
                key={i}
                x1={60 + Math.cos(a) * 38}
                y1={78 + Math.sin(a) * 38}
                x2={60 + Math.cos(a) * 31}
                y2={78 + Math.sin(a) * 31}
                opacity={i % 5 === 0 ? 0.8 : 0.3}
              />
            )
          })}
          <path d="M60 78 82 55" stroke="var(--hc-accent)" />
          <circle cx="60" cy="78" r="4" fill="var(--hc-accent)" stroke="none" />
          <path d="M22 92h76" opacity=".25" />
        </>
      )}
      {id === 'workshop' && variant === 1 && (
        <>
          {Array.from({ length: 9 }, (_, i) => {
            const x = 30 + (i % 3) * 22
            const y = 28 + Math.floor(i / 3) * 22
            return (
              <rect
                key={i}
                x={x}
                y={y}
                width="18"
                height="18"
                opacity={i === 4 ? 1 : 0.26}
                stroke={i === 4 ? 'var(--hc-accent)' : 'currentColor'}
                fill={i === 4 ? 'var(--hc-accent-wash)' : 'none'}
              />
            )
          })}
        </>
      )}
    </svg>
  )
}

/** 频道背景纹理：4 种，使用 pattern 保证轻量 */
export function ChannelTexture({
  id,
  className,
}: {
  id: ChannelId
  className?: string
}) {
  const raw = useId()
  const pid = `tex-${id}-${raw.replace(/[:]/g, '')}`

  return (
    <svg className={className} aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id={pid} width="40" height="40" patternUnits="userSpaceOnUse">
          {id === 'arena' && (
            <>
              <path d="M0 40 40 0" stroke="currentColor" strokeWidth=".6" opacity=".55" />
              <path d="M0 0h6M34 36h6" stroke="currentColor" strokeWidth=".6" opacity=".35" />
            </>
          )}
          {id === 'hive' && (
            <path
              d="M20 2 37 12v20L20 42 3 32V12z"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              opacity=".5"
            />
          )}
          {id === 'archive' && (
            <>
              <path d="M0 10h40M0 24h40M0 38h40" stroke="currentColor" strokeWidth=".5" opacity=".45" />
              <circle cx="4" cy="17" r="1.2" fill="currentColor" opacity=".5" />
            </>
          )}
          {id === 'workshop' && (
            <>
              <path d="M0 20h40M20 0v40" stroke="currentColor" strokeWidth=".5" opacity=".35" />
              <circle cx="20" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".45" />
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${pid})`} />
    </svg>
  )
}

/* ============================================================
   首页主视觉：蜜果城信号总览
   远景城市 / 中央塔 / 信号网络 / 频道节点 / 标注
   ============================================================ */
export function CitySignalOverview({ className }: { className?: string }) {
  const nodes: { x: number; y: number; code: string; glyph: string; live?: boolean; label: string }[] = [
    { x: 330, y: 306, code: 'CH.01', glyph: 'diamond', live: true, label: '争锋 / ON AIR' },
    { x: 232, y: 216, code: 'CH.02', glyph: 'hex', label: '回廊 / 待命' },
    { x: 606, y: 336, code: 'CH.03', glyph: 'card', label: '档案 / 开放' },
    { x: 668, y: 206, code: 'CH.04', glyph: 'dial', label: '工坊 / 预约' },
  ]
  const towerX = 452
  const towerApex = 128

  return (
    <svg
      viewBox="0 0 760 620"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      aria-hidden="true"
    >
      {/* 网格 */}
      <g opacity=".12">
        {[120, 240, 360, 480, 600, 720].map((x) => (
          <path key={x} d={`M${x} 40V560`} strokeDasharray="2 10" />
        ))}
        {[160, 280, 400, 520].map((y) => (
          <path key={y} d={`M40 ${y}H720`} strokeDasharray="2 10" />
        ))}
      </g>

      {/* 远景城市轮廓 */}
      <g opacity=".62">
        {[
          [64, 470, 58, 90],
          [128, 430, 44, 130],
          [178, 486, 34, 74],
          [216, 452, 52, 108],
          [274, 498, 30, 62],
          [612, 470, 40, 90],
          [660, 420, 46, 140],
          [712, 492, 34, 68],
        ].map(([x, y, w, h], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} />
            <path
              d={`M${Number(x) + 6} ${Number(y) + 12}h${Number(w) - 12}M${Number(x) + 6} ${Number(y) + 22}h${Number(w) - 12}`}
              opacity=".5"
            />
          </g>
        ))}
        <path d="M40 560h680" opacity=".7" />
      </g>

      {/* 中央塔 */}
      <g>
        <path d={`M${towerX - 46} 560 ${towerX - 32} 196h64l14 364z`} opacity=".8" />
        <path d={`M${towerX - 34} 300h68M${towerX - 36} 356h72M${towerX - 38} 412h76M${towerX - 40} 470h80`} opacity=".38" />
        <path d={`M${towerX - 32} 196 ${towerX - 9} 128h18l23 68z`} opacity=".7" />
        <polygon points={hexPoints(towerX, 300, 58)} opacity=".32" />
        <polygon points={hexPoints(towerX, 300, 42)} opacity=".72" stroke="var(--hc-accent)" />
        <path d={`M${towerX} 128V48`} stroke="var(--hc-accent)" opacity=".9" />
        <path d={`M${towerX} 62l8 8-8 8-8-8z`} fill="var(--hc-accent)" stroke="none" />
        <circle cx={towerX} cy="300" r="76" opacity=".16" strokeDasharray="2 8" />
        <circle cx={towerX} cy="300" r="96" opacity=".1" strokeDasharray="1 10" />
        <path d={`M${towerX - 12} 560v-92h24v92`} opacity=".35" />
      </g>

      {/* 信号连线 */}
      {nodes.map((n) => (
        <g key={n.code}>
          <path
            d={`M${towerX} ${towerApex} Q${(towerX + n.x) / 2} ${(towerApex + n.y) / 2 - 24} ${n.x} ${n.y}`}
            opacity={n.live ? 0.95 : 0.3}
            stroke={n.live ? 'var(--hc-accent)' : 'currentColor'}
            strokeDasharray={n.live ? 'none' : '3 5'}
            className={n.live ? 'hc-overview__live' : undefined}
            pathLength={n.live ? 100 : undefined}
          />
          <circle
            cx={n.x}
            cy={n.y}
            r={n.live ? 5 : 3.5}
            fill={n.live ? 'var(--hc-accent)' : 'currentColor'}
            stroke="none"
            opacity={n.live ? 1 : 0.55}
          />
          {n.live && (
            <>
              <circle cx={n.x} cy={n.y} r="14" stroke="var(--hc-accent)" opacity=".5" />
              <circle cx={n.x} cy={n.y} r="24" stroke="var(--hc-accent)" opacity=".2" strokeDasharray="2 5" />
            </>
          )}
          {/* 频道节点图形 */}
          <g transform={`translate(${n.x} ${n.y})`} stroke={n.live ? 'var(--hc-accent)' : 'currentColor'} opacity={n.live ? 1 : 0.7}>
            {n.glyph === 'diamond' && <path d="M0 -14 14 0 0 14-14 0z" fill={n.live ? 'var(--hc-accent-wash)' : 'none'} />}
            {n.glyph === 'hex' && <polygon points={hexPoints(0, 0, 13)} />}
            {n.glyph === 'card' && <rect x="-11" y="-13" width="22" height="26" />}
            {n.glyph === 'dial' && (
              <>
                <circle r="13" />
                <path d="M0 0 7-7" />
              </>
            )}
          </g>
          {/* 引出线与标注：右侧节点向左引出，避免被画面边缘裁切 */}
          {(() => {
            const left = n.x > 540
            const dir = left ? -1 : 1
            const anchor = left ? 'end' : 'start'
            const bx = n.x + dir * (n.live ? 22 : 18)
            const tx = n.x + dir * (n.live ? 74 : 58)
            return (
              <>
                <path d={`M${bx} ${n.y} h${dir * (n.live ? 46 : 34)}`} opacity=".3" />
                <text
                  x={tx}
                  y={n.y - 3}
                  textAnchor={anchor}
                  fontFamily="var(--hc-font-mono)"
                  fontSize="9"
                  letterSpacing="1.4"
                  fill="currentColor"
                  stroke="none"
                  opacity={n.live ? 0.95 : 0.55}
                >
                  {n.code}
                </text>
                <text
                  x={tx}
                  y={n.y + 10}
                  textAnchor={anchor}
                  fontFamily="var(--hc-font-mono)"
                  fontSize="8"
                  letterSpacing="1"
                  fill="currentColor"
                  stroke="none"
                  opacity={n.live ? 0.75 : 0.35}
                >
                  {n.label}
                </text>
              </>
            )
          })()}
        </g>
      ))}

      {/* 标注 */}
      <g fontFamily="var(--hc-font-mono)" stroke="none" fill="currentColor">
        <text x="40" y="592" fontSize="8" letterSpacing="2" opacity=".4">
          SEASON 07 / ROUND 02
        </text>
        <text x="720" y="592" fontSize="8" letterSpacing="2" textAnchor="end" opacity=".4">
          NOT TO SCALE
        </text>
      </g>

      {/* 基线刻度 */}
      <g opacity=".3">
        <path d="M40 560h680" />
        {Array.from({ length: 35 }, (_, i) => (
          <path
            key={i}
            d={`M${40 + i * 20} 560v${i % 5 === 0 ? 9 : 4}`}
            opacity={i % 5 === 0 ? 0.9 : 0.45}
          />
        ))}
      </g>

    </svg>
  )
}
