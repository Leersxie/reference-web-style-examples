import type { CSSProperties, ReactNode, SVGProps } from 'react'
import crosshair from '../assets/icons/crosshair.svg?raw'
import hexagon from '../assets/icons/hexagon.svg?raw'
import tower from '../assets/icons/tower.svg?raw'
import flask from '../assets/icons/flask.svg?raw'
import alertTriangle from '../assets/icons/alert-triangle.svg?raw'
import arrowUpRight from '../assets/icons/arrow-up-right.svg?raw'
import activity from '../assets/icons/activity.svg?raw'
import gear from '../assets/icons/settings.svg?raw'
import barcode from '../assets/icons/barcode.svg?raw'
import target from '../assets/icons/target.svg?raw'
import chartArcs from '../assets/icons/chart-arcs.svg?raw'
import terminalIcon from '../assets/icons/terminal.svg?raw'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const cx = (...p: (string | false | null | undefined)[]) => p.filter(Boolean).join(' ')

/* 素材库自绘图标：24×24，stroke 2，方头端点，颜色走 currentColor */
function rawIcon(svg: string) {
  return function RawIcon({
    size = 18,
    className,
    style,
  }: {
    size?: number
    className?: string
    style?: CSSProperties
  }) {
    return (
      <span
        className={cx('hc-icon', className)}
        style={{ width: size, height: size, ...style }}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    )
  }
}

/* 通用界面图标：同一套 2px / 方头规则手绘补齐 */
const base = (size: number): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'square',
  strokeLinejoin: 'miter',
  'aria-hidden': true,
  focusable: false,
})

const make = (path: ReactNode) =>
  function Icon({ size = 18, ...rest }: IconProps) {
    return (
      <svg {...base(size)} {...rest}>
        {path}
      </svg>
    )
  }

export const IconHome = rawIcon(crosshair)
export const IconChannels = rawIcon(hexagon)
export const IconChannel = rawIcon(tower)
export const IconTerminal = rawIcon(terminalIcon)
export const IconLab = rawIcon(flask)
export const IconAlert = rawIcon(alertTriangle)
export const IconArrowUpRight = rawIcon(arrowUpRight)
export const IconSignal = rawIcon(activity)
export const IconSliders = rawIcon(gear)
export const IconBarcode = rawIcon(barcode)
export const IconTarget = rawIcon(target)
export const IconChartArcs = rawIcon(chartArcs)

export const IconArrowRight = make(
  <>
    <path d="M3 12h17" />
    <path d="m14 6 6 6-6 6" />
  </>,
)

export const IconChevronDown = make(<path d="m5 9 7 7 7-7" />)
export const IconChevronLeft = make(<path d="m15 5-7 7 7 7" />)
export const IconChevronRight = make(<path d="m9 5 7 7-7 7" />)
export const IconClose = make(<path d="M5 5l14 14M19 5 5 19" />)
export const IconSearch = make(
  <>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </>,
)
export const IconCheck = make(<path d="m4 12.5 5 5L20 6.5" />)
export const IconInfo = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 8v.5" />
  </>,
)
export const IconMenu = make(<path d="M3 6h18M3 12h18M3 18h18" />)
export const IconPlay = make(<path d="M7 4v16l13-8z" />)
export const IconPause = make(<path d="M8 4v16M16 4v16" />)
export const IconStop = make(<rect x="5" y="5" width="14" height="14" />)
export const IconRefresh = make(
  <>
    <path d="M20 12a8 8 0 1 1-2.6-5.9" />
    <path d="M20 4v5h-5" />
  </>,
)
export const IconDownload = make(
  <>
    <path d="M12 3v12" />
    <path d="m7 10 5 5 5-5" />
    <path d="M4 20h16" />
  </>,
)
export const IconCalendar = make(
  <>
    <rect x="3.5" y="5" width="17" height="16" />
    <path d="M3.5 10h17M8 2.5V6M16 2.5V6" />
  </>,
)
export const IconCopy = make(
  <>
    <rect x="8" y="8" width="12" height="12" />
    <path d="M16 8V4H4v12h4" />
  </>,
)
