import { useState, useEffect } from 'react'
import { Image } from 'lucide-react'
import { api } from '../api'
import '../styles/pages/history.css'

function History() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/history').then((data) => {
      setEvents(data.events || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])
  return (
    <>
      <section className="lj-hero pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: "'Noto Serif SC', Georgia, serif" }}
          >
            <span className="lj-logo-text">先有人还是先有社</span>
          </h1>
          <p className="text-ink-2 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">凌镜的起源与发展历程</p>
          <div className="mt-8">
            <span
              className="inline-block w-16 h-0.5 rounded-full"
              style={{ background: 'linear-gradient(to right, var(--lj-brand), var(--lj-brand-light))' }}
            />
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 lj-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "'Noto Serif SC', Georgia, serif" }}>
              时间轴
            </h2>
            <div className="lj-section-line" />
            <p className="text-ink-2 mt-4 text-base sm:text-lg">从萌芽到绽放，每一步都是热爱的印记</p>
          </div>

          <div className="lj-timeline">
            {loading && <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>加载历史中...</div>}
            {!loading && events.map((e) => (
              <div className="lj-timeline-item lj-fade-in" key={e.year}>
                <div className="lj-timeline-node" />
                <div className="lj-timeline-card">
                  <span className="lj-year-badge">{e.year}</span>
                  <h3 className="mt-3">{e.title}</h3>
                  <p>{e.desc}</p>
                  <div className="lj-timeline-img">
                    <Image
                      className="w-8 h-8"
                      style={{ color: 'var(--lj-ink-3)' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default History