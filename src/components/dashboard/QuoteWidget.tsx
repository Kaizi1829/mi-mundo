import Card from '@/components/ui/Card'

const quotes = [
  { text: 'La vida no se trata de encontrarte a ti misma, sino de crearte a ti misma.', author: 'George Bernard Shaw' },
  { text: 'El mar es el gran igualador. En él solo cuenta quién eres de verdad.', author: 'Anónimo' },
  { text: 'Las olas del pasado te trajeron aquí. Tú decides hacia dónde navegas.', author: 'Proverbio marino' },
  { text: 'La disciplina es el ancla que te permite volar lejos.', author: 'Anónimo' },
]

export default function QuoteWidget() {
  const q = quotes[new Date().getDate() % quotes.length]
  return (
    <div
      className="rounded-2xl p-5 flex flex-col items-center text-center"
      style={{
        background: 'linear-gradient(135deg, #0d2137 0%, #1a3a5c 100%)',
        border: '1px solid rgba(74,155,181,0.2)',
      }}
    >
      <div className="w-8 h-px mb-4" style={{ background: 'var(--gold)' }} />
      <span className="text-4xl mb-3 font-serif leading-none" style={{ color: 'rgba(74,155,181,0.4)' }}>&ldquo;</span>
      <p className="text-sm font-light leading-relaxed italic mb-4" style={{ color: '#a8d5e2' }}>
        {q.text}
      </p>
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
        {q.author}
      </p>
      <div className="w-8 h-px mt-4" style={{ background: 'var(--gold)', opacity: 0.5 }} />
    </div>
  )
}
