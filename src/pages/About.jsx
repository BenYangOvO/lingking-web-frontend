import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/pages/about.css'
import '../styles/components/site-content-editor.css'
import {
  Search, ChevronDown, Edit3,
} from 'lucide-react'
import { getSiteContent } from '../api'
import { isAdmin } from '../auth'
import SiteContentEditor from '../components/SiteContentEditor'
import {
  SITE_DEFAULTS,
  mergeSiteContent,
  ABOUT_CONTACT_ICONS,
  ABOUT_VALUE_ICONS,
  ABOUT_SPONSOR_ICONS,
} from '../siteContentDefaults'

function About() {
  const [pageContent, setPageContent] = useState(SITE_DEFAULTS.about)
  const [loading, setLoading] = useState(true)
  const [editorOpen, setEditorOpen] = useState(false)
  const isAdminUser = isAdmin()

  useEffect(() => {
    getSiteContent('about').then((res) => {
      setPageContent(mergeSiteContent(SITE_DEFAULTS.about, res?.content))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const contactCards = pageContent?.contact_cards || []
  const values = pageContent?.values || []
  const sponsors = pageContent?.sponsors || []
  const faqs = pageContent?.faqs || []

  return (
    <>
      <section className="lj-page-header">
        <div className="lj-page-header-inner">
          <div className="lj-breadcrumb">
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <span className="current">关于凌镜</span>
          </div>
          <h1 className="lj-page-title">关于凌镜</h1>
          <p className="lj-page-subtitle">
            {pageContent?.subtitle || '了解凌镜摄影社团的故事、理念与联系方式'}
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="lj-search-section">
        <div className="lj-search-wrap">
          <div className="lj-search-icon">
            <Search style={{ width: 20, height: 20 }} />
          </div>
          <input type="text" className="lj-search-input" placeholder="搜索作品、成员、日记..." aria-label="搜索" />
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* 联系我们 */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <h2 className="lj-section-title">
            {pageContent?.section_contact_title || '联系我们'}
          </h2>
          <div className="lj-contact-grid">
            {loading && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#6b7280' }}>加载中...</div>}
            {!loading && contactCards.map((c, idx) => {
              const IconComp = ABOUT_CONTACT_ICONS[idx % ABOUT_CONTACT_ICONS.length]
              return (
                <div className="lj-contact-card" key={c.platform + '-' + idx}>
                  <div className="lj-contact-icon">
                    <IconComp style={{ width: 20, height: 20 }} />
                  </div>
                  <div className="lj-contact-platform">{c.platform}</div>
                  <div className="lj-contact-handle">{c.handle}</div>
                  <div className="lj-contact-desc">{c.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* 关于凌镜 */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <h2 className="lj-section-title">
            {pageContent?.section_about_title || '关于凌镜'}
          </h2>
          <div className="lj-mission">
            <p className="lj-mission-text">{pageContent?.mission || '凌镜——以镜头为镜，映照世间万象'}</p>
          </div>
          <div className="lj-values-grid">
            {values.map((v, idx) => {
              const IconComp = ABOUT_VALUE_ICONS[idx % ABOUT_VALUE_ICONS.length]
              return (
                <div className="lj-value-card" key={v.name + '-' + idx}>
                  <div className="lj-value-icon">
                    <IconComp style={{ width: 22, height: 22 }} />
                  </div>
                  <h3 className="lj-value-name">{v.name}</h3>
                  <p className="lj-value-desc">{v.desc}</p>
                </div>
              )
            })}
          </div>
          {pageContent?.history_summary && (
            <div className="lj-history-summary">
              <p>{pageContent.history_summary}</p>
            </div>
          )}
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* 合作与赞助 */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <h2 className="lj-section-title">
            {pageContent?.section_sponsor_title || '合作与赞助'}
          </h2>
          <div className="lj-sponsor-body">
            {pageContent?.section_sponsor_desc && (
              <p className="lj-sponsor-desc">{pageContent.section_sponsor_desc}</p>
            )}
            <div className="lj-sponsor-cards">
              {sponsors.map((s, idx) => {
                const IconComp = ABOUT_SPONSOR_ICONS[idx % ABOUT_SPONSOR_ICONS.length]
                return (
                  <div className="lj-sponsor-card" key={s.name + '-' + idx}>
                    <div className="lj-sponsor-icon">
                      <IconComp style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                      <div className="lj-sponsor-name">{s.name}</div>
                      <div className="lj-sponsor-type">{s.type}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* FAQ */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <h2 className="lj-section-title">
            {pageContent?.section_faq_title || '常见问题'}
          </h2>
          <div className="lj-faq-list">
            {faqs.map((f, idx) => (
              <details className="lj-faq-item" key={(f.q || '') + '-' + idx}>
                <summary className="lj-faq-summary">
                  {f.q}
                  <span className="lj-faq-chevron">
                    <ChevronDown style={{ width: 18, height: 18 }} />
                  </span>
                </summary>
                <div className="lj-faq-answer">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 管理员：编辑悬浮按钮 + 编辑弹窗 */}
      {isAdminUser && (
        <button
          className="lj-edit-fab"
          onClick={() => setEditorOpen(true)}
          title="编辑关于凌镜内容"
        >
          <Edit3 size={16} /> 编辑本页
        </button>
      )}

      <SiteContentEditor
        slug="about"
        open={editorOpen}
        initialContent={pageContent}
        onClose={() => setEditorOpen(false)}
        onSaved={(saved) => {
          setPageContent(mergeSiteContent(SITE_DEFAULTS.about, saved))
        }}
      />
    </>
  )
}

export default About
