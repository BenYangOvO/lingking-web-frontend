import { useState, useEffect, useRef } from 'react'
import { Image, Edit3 } from 'lucide-react'
import { getSiteContent } from '../api'
import { isAdmin } from '../auth'
import SiteContentEditor from '../components/SiteContentEditor'
import MarkdownText from '../components/MarkdownText'
import { SITE_DEFAULTS, mergeSiteContent } from '../siteContentDefaults'
import '../styles/pages/history.css'
import '../styles/components/site-content-editor.css'

function History() {
  const [pageContent, setPageContent] = useState(SITE_DEFAULTS.history)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const isAdminUser = isAdmin()

  useEffect(() => {
    getSiteContent('history').then((res) => {
      setPageContent(mergeSiteContent(SITE_DEFAULTS.history, res?.content))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!loading && containerRef.current) {
      const timer = setTimeout(() => {
        const fadeEls = containerRef.current.querySelectorAll('.lj-fade-in')
        fadeEls.forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 80)
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [loading, pageContent])

  const events = pageContent?.events || []

  return (
    <>
      <section className="lj-hero pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: "'Noto Serif SC', Georgia, serif" }}
          >
            <span className="lj-logo-text">{pageContent?.hero_title || '先有人还是先有社'}</span>
          </h1>
          <p className="text-ink-2 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            {pageContent?.hero_subtitle || '凌镜的起源与发展历程'}
          </p>
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
              {pageContent?.timeline_title || '时间轴'}
            </h2>
            <div className="lj-section-line" />
            <p className="text-ink-2 mt-4 text-base sm:text-lg">
              {pageContent?.timeline_subtitle || '从萌芽到绽放，每一步都是热爱的印记'}
            </p>
          </div>

          <div className="lj-timeline" ref={containerRef}>
            {loading && <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>加载历史中...</div>}
            {!loading && events.map((e) => (
              <div className="lj-timeline-item lj-fade-in" key={e.year + '-' + e.title}>
                <div className="lj-timeline-node" />
                <div className="lj-timeline-card">
                  <span className="lj-year-badge">{e.year}</span>
                  <h3 className="mt-3">{e.title}</h3>
                  <MarkdownText>{e.desc}</MarkdownText>
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

      {/* 管理员：编辑悬浮按钮 + 编辑弹窗 */}
      {isAdminUser && (
        <button
          className="lj-edit-fab"
          onClick={() => setEditorOpen(true)}
          title="编辑凌镜历史内容"
        >
          <Edit3 size={16} /> 编辑本页
        </button>
      )}

      <SiteContentEditor
        slug="history"
        open={editorOpen}
        initialContent={pageContent}
        onClose={() => setEditorOpen(false)}
        onSaved={(saved) => {
          setPageContent(mergeSiteContent(SITE_DEFAULTS.history, saved))
        }}
      />
    </>
  )
}

export default History
