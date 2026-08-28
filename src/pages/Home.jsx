import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Image,
  UserPlus,
  ChevronDown,
  ArrowRight,
  Camera,
  Monitor,
  Megaphone,
  Edit3,
} from 'lucide-react'
import { api, getSiteContent } from '../api'
import { isAdmin } from '../auth'
import PhotoDetail from '../components/PhotoDetail'
import SiteContentEditor from '../components/SiteContentEditor'
import {
  SITE_DEFAULTS,
  DEPT_ICON_MAP,
  mergeSiteContent,
} from '../siteContentDefaults'
import '../styles/components/site-content-editor.css'

function cardBg(item) {
  if (item && item.image) {
    const src = String(item.image).trim()
    if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return {
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    }
  }
  const g = String(item?.grad || '').trim()
  const grad = g.startsWith('linear-gradient') ? g : `linear-gradient(135deg, ${g || '#2D5F8A,#4A90D9,#6AADE8'})`
  return { background: grad, backgroundSize: 'cover', backgroundPosition: 'center' }
}

function Home() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [detailIdx, setDetailIdx] = useState(null)

  // 站点可编辑内容
  const [homeContent, setHomeContent] = useState(SITE_DEFAULTS.home)
  const [deptsContent, setDeptsContent] = useState(SITE_DEFAULTS.departments)
  const [siteLoaded, setSiteLoaded] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const isAdminUser = isAdmin()

  useEffect(() => {
    Promise.all([
      api('/photos'),
      getSiteContent('home'),
      getSiteContent('departments'),
    ]).then(([p, homeRes, deptsRes]) => {
      setPhotos((p.photos || []).slice(0, 3))
      setHomeContent(mergeSiteContent(SITE_DEFAULTS.home, homeRes?.content))
      setDeptsContent(mergeSiteContent(SITE_DEFAULTS.departments, deptsRes?.content))
      setLoading(false)
      setSiteLoaded(true)
    }).catch(() => {
      setLoading(false)
      setSiteLoaded(true)
    })
  }, [])

  const depts = deptsContent?.departments || []
  const stats = homeContent?.stats || []
  const introParagraphs = homeContent?.intro_paragraphs || []

  return (
    <>
      {/* Hero */}
      <section className="lj-hero">
        <h1 className="lj-hero-title">{homeContent?.hero_title || '凌镜'}</h1>
        <p className="lj-hero-subtitle">{homeContent?.hero_subtitle || '用镜头记录世界，用光影讲述故事'}</p>
        <div className="lj-hero-ctas">
          <Link to="/gallery" className="lj-btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>
            <Image style={{ width: 16, height: 16 }} />
            探索作品
          </Link>
          <Link to="/about" className="lj-btn-secondary" style={{ padding: '12px 28px', fontSize: 15 }}>
            <UserPlus style={{ width: 16, height: 16 }} />
            加入我们
          </Link>
        </div>
        <div className="lj-scroll-indicator">
          <ChevronDown style={{ width: 24, height: 24 }} />
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* Featured Works */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <h2 className="lj-section-title">{homeContent?.section_featured_title || '精选作品'}</h2>
          <div className="lj-featured-grid">
            {loading && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#6b7280' }}>加载中...</div>}
            {!loading && photos.map((w, idx) => (
              <div
                className="lj-featured-card"
                key={w.id || w.title}
                onClick={() => setDetailIdx(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDetailIdx(idx) } }}
                title="点击查看作品详情"
              >
                <div className="lj-featured-card-img" style={cardBg(w)} />
                <div className="lj-featured-card-body">
                  <h3 className="lj-featured-card-title">{w.title}</h3>
                  <div className="lj-featured-card-meta">
                    <span className="lj-featured-card-author">摄影：{w.author}</span>
                    <span className="lj-tag">{w.cat}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/gallery" className="lj-btn-secondary">
              查看全部作品
              <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* Club Intro */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <div className="lj-intro-grid">
            <div>
              <h2 className="lj-section-title" style={{ marginBottom: 24 }}>
                {homeContent?.section_about_title || '关于凌镜'}
              </h2>
              <div className="lj-intro-body">
                {introParagraphs.map((p, i) => (
                  <p key={i} style={{ marginBottom: i === introParagraphs.length - 1 ? 0 : 16 }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <div className="lj-stats-grid">
                {stats.map((s) => (
                  <div className="lj-stat-card" key={s.label}>
                    <div className="lj-stat-number">{s.value}</div>
                    <div className="lj-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* Departments Preview */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <h2 className="lj-section-title">{homeContent?.section_depts_title || '部门一览'}</h2>
          <div className="lj-dept-grid">
            {!siteLoaded && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#6b7280' }}>加载中...</div>}
            {siteLoaded && depts.map((d) => {
              const IconComp = DEPT_ICON_MAP[d.name] || Camera
              return (
                <div className="lj-dept-card" key={d.name}>
                  <div className="lj-dept-icon">
                    <IconComp style={{ width: 22, height: 22 }} />
                  </div>
                  <h3 className="lj-dept-name">{d.name}</h3>
                  <p className="lj-dept-desc">{d.desc}</p>
                  <div className="lj-dept-count">成员 {d.count}+ 人</div>
                </div>
              )
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/departments" className="lj-btn-secondary">
              了解更多部门
              <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        </div>
      </section>

      <PhotoDetail
        open={detailIdx !== null}
        photo={detailIdx !== null ? photos[detailIdx] : null}
        list={photos}
        currentIndex={detailIdx ?? 0}
        onClose={() => setDetailIdx(null)}
        onPrev={() => setDetailIdx((i) => (i === null || i <= 0 ? 0 : i - 1))}
        onNext={() => setDetailIdx((i) => (i === null ? 0 : Math.min(photos.length - 1, i + 1)))}
      />

      {/* 管理员：编辑悬浮按钮 + 编辑弹窗 */}
      {isAdminUser && (
        <button
          className="lj-edit-fab"
          onClick={() => setEditorOpen(true)}
          title="编辑首页内容"
        >
          <Edit3 size={16} /> 编辑本页
        </button>
      )}

      <SiteContentEditor
        slug="home"
        open={editorOpen}
        initialContent={homeContent}
        onClose={() => setEditorOpen(false)}
        onSaved={(saved) => {
          setHomeContent(mergeSiteContent(SITE_DEFAULTS.home, saved))
        }}
      />
    </>
  )
}

export default Home
