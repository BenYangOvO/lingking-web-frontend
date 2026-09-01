import { useState, useEffect, useRef } from 'react'
import { Button, Card, CardBody, Chip, Modal, ModalContent, ModalHeader, ModalBody, Spinner } from '@heroui/react'
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

  const openFullHistory = async () => {
    const url = fullHistoryFile
    if (!url) return
    if (/\.pdf(\?|$)/i.test(url) || /\.doc(\?|$)/i.test(url)) {
      window.open(url, '_blank', 'noopener')
      return
    }
    setDocView({ open: true, loading: true, html: '', err: '' })
    try {
      const getMammoth = () => {
        if (window.mammoth) return Promise.resolve(window.mammoth)
        return new Promise((resolve, reject) => {
          const s = document.createElement('script')
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js'
          s.onload = () => resolve(window.mammoth)
          s.onerror = () => reject(new Error('文档解析器加载失败，请直接下载文档查看'))
          document.head.appendChild(s)
        })
      }
      const [mammoth, resp] = await Promise.all([
        getMammoth(),
        fetch(url),
      ])
      if (!resp.ok) throw new Error(`文档加载失败（HTTP ${resp.status}）`)
      const arrayBuffer = await resp.arrayBuffer()
      const result = await mammoth.convertToHtml({ arrayBuffer })
      setDocView({ open: true, loading: false, html: result.value || '<p>（文档内容为空）</p>', err: '' })
    } catch (er) {
      setDocView({ open: true, loading: false, html: '', err: er.message || '文档解析失败，请尝试下载后查看' })
    }
  }

  const closeDocView = () => setDocView((d) => ({ ...d, open: false }))

  return (
    <div ref={containerRef}>
      <section className="lj-hero pt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <span className="lj-logo-text">{pageContent?.hero_title || '先有人还是先有社'}</span>
          </h1>
          <p className="text-[var(--lj-ink-2)] text-lg max-w-2xl mx-auto leading-relaxed">
            {pageContent?.hero_subtitle || '凌镜的起源与发展历程'}
          </p>
          <div className="mt-8 flex justify-center">
            <span className="w-16 h-1 rounded-full bg-[var(--lj-brand)]" />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {isAdminUser && (
            <div className="flex justify-end mb-6">
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onClick={() => setEditorOpen(true)}
                startContent={<Edit3 size={14} />}
              >
                编辑大事记历史
              </Button>
            </div>
          )}

          {fullHistoryFile && (
            <Card className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-xl mb-12 p-4">
              <CardBody className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[var(--lj-brand)]/10 text-[var(--lj-brand)]">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{pageContent?.full_history_title || '探索凌镜全景历史故事'}</h3>
                    <p className="text-xs text-default-400 mt-1">查看建社以来的完整图文风采纪实</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" color="primary" onClick={openFullHistory} startContent={<FileText size={14} />}>
                    在线阅读
                  </Button>
                  <Button size="sm" variant="flat" as="a" href={fullHistoryFile} download startContent={<Download size={14} />}>
                    下载
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {loading && (
            <div className="flex justify-center py-16">
              <Spinner color="primary" label="加载历史节点中..." size="lg" />
            </div>
          )}

          {!loading && (
            <div className="lj-timeline relative border-l-2 border-[var(--lj-surface-2)] ml-4 pl-6 flex flex-col gap-10">
              {events.map((ev, idx) => (
                <div key={idx} className="lj-timeline-item relative">
                  <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-[var(--lj-brand)] border-4 border-[var(--lj-surface)] shadow-md" />
                  <Card className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] p-2">
                    <CardBody className="gap-3 p-4">
                      <div className="flex items-center gap-2">
                        <Chip size="sm" color="primary" variant="flat" className="font-bold">{ev.year}</Chip>
                        <h3 className="text-lg font-bold">{ev.title}</h3>
                      </div>
                      <MarkdownText className="text-xs text-default-400 leading-relaxed">{ev.desc}</MarkdownText>
                      {ev.image && (
                        <img src={ev.image} alt={ev.title} className="rounded-xl mt-2 max-h-64 object-cover border border-[var(--lj-surface-2)]" />
                      )}
                    </CardBody>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {editorOpen && (
        <SiteContentEditor
          slug="history"
          open={editorOpen}
          initialContent={pageContent}
          onClose={() => setEditorOpen(false)}
          onSaved={(newVal) => setPageContent(newVal)}
        />
      )}

      {/* docView Modal */}
      <Modal
        isOpen={docView.open}
        onClose={closeDocView}
        size="4xl"
        backdrop="blur"
        scrollBehavior="inside"
        classNames={{
          base: 'bg-[var(--lj-surface)] text-[var(--lj-ink)] border border-[var(--lj-surface-2)] shadow-2xl rounded-2xl max-h-[85vh]',
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="border-b border-[var(--lj-surface-2)] py-3 px-5">
                <span className="text-base font-bold">完整历史文档</span>
              </ModalHeader>
              <ModalBody className="p-6">
                {docView.loading ? (
                  <div className="flex justify-center py-16">
                    <Spinner color="primary" label="正在解析文档..." />
                  </div>
                ) : docView.err ? (
                  <div className="text-center py-12 text-rose-500">{docView.err}</div>
                ) : (
                  <div className="lj-markdown leading-relaxed" dangerouslySetInnerHTML={{ __html: docView.html }} />
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default History
