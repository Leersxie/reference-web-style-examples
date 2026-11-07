export function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.15}
      aria-hidden="true"
    >
      <path d="M12 2.4 20.6 7.2v9.6L12 21.6 3.4 16.8V7.2z" />
      <path d="M12 7.2 16.8 9.9v4.9L12 17.5 7.2 14.8V9.9z" opacity=".55" />
      <path d="M12 2.4v4.8M12 17.5v4.1M3.4 12h3.8M16.8 12h3.8" opacity=".4" />
    </svg>
  )
}

export function Curve({
  p,
  className,
}: {
  p: [number, number, number, number]
  className?: string
}) {
  const [x1, y1, x2, y2] = p
  const path = `M0,100 C${x1 * 100},${100 - y1 * 100} ${x2 * 100},${100 - y2 * 100} 100,0`
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={className} aria-hidden="true">
      <g stroke="currentColor" opacity=".12" strokeWidth=".5">
        <line x1="0" y1="50" x2="100" y2="50" />
        <line x1="50" y1="0" x2="50" y2="100" />
        <line x1="0" y1="0" x2="100" y2="100" strokeDasharray="1 3" />
      </g>
      <path d={path} fill="none" stroke="var(--hc-accent)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      <g fill="currentColor" opacity=".5">
        <rect x="0" y="97" width="2" height="2" />
        <rect x="98" y="1" width="2" height="2" />
      </g>
    </svg>
  )
}
