import Card from '@/components/ui/Card'

const quotes = [
  { text: 'La vida no se trata de encontrarte a ti misma, sino de crearte a ti misma.', author: 'George Bernard Shaw' },
  { text: 'El secreto para avanzar es comenzar.', author: 'Mark Twain' },
  { text: 'Cree en ti misma y en todo lo que eres.', author: 'Christian D. Larson' },
  { text: 'Haz cada día tu obra maestra.', author: 'John Wooden' },
]

export default function QuoteWidget() {
  const q = quotes[new Date().getDate() % quotes.length]
  return (
    <Card className="flex flex-col justify-center items-center text-center py-6" style={{ background: 'linear-gradient(135deg,#f9f4ec,#f2e8d8)' }}>
      <span className="text-3xl mb-3 opacity-30 font-serif" style={{ color: 'var(--accent-dark)' }}>&ldquo;</span>
      <p className="text-sm font-light leading-relaxed italic mb-3 px-2" style={{ color: 'var(--text)' }}>
        {q.text}
      </p>
      <p className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--muted)' }}>
        {q.author}
      </p>
    </Card>
  )
}
