interface ProgressBarProps {
  value: number
  color?: string
  height?: number
  animated?: boolean
}

export default function ProgressBar({
  value,
  color = '#2c6e8a',
  height = 6,
  animated = true,
}: ProgressBarProps) {
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height, background: 'var(--border)' }}
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
