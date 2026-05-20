interface ProgressBarProps {
  value: number       // 0-100
  color?: string
  height?: number
  animated?: boolean
}

export default function ProgressBar({
  value,
  color = '#c9a96e',
  height = 6,
  animated = true,
}: ProgressBarProps) {
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height, background: '#ede5d8' }}
    >
      <div
        className={animated ? 'progress-bar' : ''}
        style={{
          height: '100%',
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: color,
          borderRadius: 'inherit',
          '--progress-width': `${value}%`,
        } as React.CSSProperties}
      />
    </div>
  )
}
