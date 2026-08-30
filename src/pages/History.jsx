import { useState, useEffect, useRef } from 'react'
import { Image, Edit3, BookOpen, FileText, Download, X, Loader2, AlertTriangle } from 'lucide-react'
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
  // 完整历史文档在线阅读（docx）
  const [docView, setDocView] = useState({ open: false, loading: false, html: '', err: '' })

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
  const fullHistoryFile = pageContent?.full_history_file || ''

  // 完整历史讲述入口：pdf 直接新窗口打开；docx 用 mammoth 在线渲染；doc 下载查看
  const openFullHistory = async () => {
    const url = fullHistoryFile
    if (!url) return
    if (/\.pdf(\?|$)/i.test(url) || /\.doc(\?|$)/i.test(url)) {
      window.open(url, '_blank', 'noopener')
      return
    }
    setDocView({ open: true, loading: true, html: '', err: '' })
    try {
      const [mod, resp] = await Promise.all([
        import('mammoth/mammoth.browser.min'),
        fetch(url),
      ])
      if (!resp.ok) throw new Error(`文档加载失败（HTTP ${resp.status}）`)
      const mammoth = mod.default || mod
      const arrayBuffer = await resp.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      setDocView({ open: true, loading: false, html: result.value || '<p>（文档内容为空）</p>', err: '' })
    } catch (er) {
      setDocView({ open: true, loading: false, html: '', err: er.message || '文档解析失败，请尝试下载后查看' })
    }
  }

  const closeDocView = () => setDocView((d) => ({ ...d, open: false }))

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
                  {e.image ? (
                    <div className="lj-timeline-img lj-timeline-img-photo">
                      <img src={e.image} alt={e.title || '历史配图'} loading="lazy" />
                    </div>
                  ) : (
                    <div className="lj-timeline-img">
                      <Image
                        className="w-8 h-8"
                        style={{ color: 'var(--lj-ink-3)' }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 完整历史讲述入口（管理员上传 Word/PDF 后显示） */}
      {fullHistoryFile && (
        <section className="pb-20 lg:pb-28">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div
              className="lj-fullhistory-card lj-fade-in"
              role="button"
              tabIndex={0}
              onClick={openFullHistory}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openFullHistory() }}
            >
              <div className="lj-fullhistory-icon">
                <BookOpen size={26} />
              </div>
              <div className="lj-fullhistory-text">
                <h3>{pageContent?.full_history_title || '完整历史讲述'}</h3>
                <p>点击在线阅读完整的凌镜历史文档</p>
              </div>
              <div className="lj-fullhistory-actions">
                <button type="button" className="lj-btn-primary">
                  <FileText size={14} /> 在线阅读
                </button>
                <a
                  className="lj-btn-secondary"
                  href={fullHistoryFile}
                  target="_blank"
                  rel="noreferrer"
                  download
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={14} /> 下载
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Word 文档在线阅读弹窗（mammoth 渲染） */}
      {docView.open && (
        <div className="lj-docviewer-mask" onClick={closeDocView}>
          <div className="lj-docviewer-dialog" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <header className="lj-docviewer-head">
              <div className="lj-docviewer-title">
                <BookOpen size={16} />
                <span>{pageContent?.full_history_title || '完整历史讲述'}</span>
              </div>
              <button type="button" className="lj-docviewer-close" onClick={closeDocView} aria-label="关闭">
                <X size={18} />
              </button>
            </header>
            <div className="lj-docviewer-body">
              {docView.loading && (
                <div className="lj-docviewer-state">
                  <Loader2 size={22} style={{ animation: 'spin 0.8s linear infinite' }} />
                  <span>文档解析中…</span>
                </div>
              )}
              {docView.err && (
                <div className="lj-docviewer-state">
                  <AlertTriangle size={22} />
                  <span>{docView.err}</span>
                  <a href={fullHistoryFile} target="_blank" rel="noreferrer" className="lj-btn-secondary" style={{ marginTop: 10 }}>
                    <Download size={13} /> 下载文档查看
                  </a>
                </div>
              )}
              {!docView.loading && !docView.err && (
                <div className="lj-docviewer-content lj-markdown" dangerouslySetInnerHTML={{ __html: docView.html }} />
              )}
            </div>
          </div>
        </div>
      )}

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
