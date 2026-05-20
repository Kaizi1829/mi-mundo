import { ReactNode, CSSProperties } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  style?: CSSProperties
}

export default function Card({ children, className = '', hover = false, style }: CardProps) {
  return (
    <div
      className={`rounded-2xl p-4 card-shadow ${hover ? 'card-shadow-hover transition-smooth cursor-pointer' : ''} ${className}`}
      style={{ background: 'var(--card)', border: '1px solid var(--border)', ...style }}
    >
      {children}
    </div>
  )
}
