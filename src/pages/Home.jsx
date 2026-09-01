import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, CardBody, Chip } from '@heroui/react'
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
import MarkdownText from '../components/MarkdownText'
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
        <div className="lj-hero-ctas flex items-center justify-center gap-4 mt-6">
          <Button
            as={Link}
            to="/gallery"
            size="lg"
            color="primary"
            className="px-8 font-medium shadow-lg shadow-indigo-500/25 rounded-full"
            startContent={<Image size={18} />}
          >
            探索作品
          </Button>
          <Button
            as={Link}
            to="/about"
            size="lg"
            variant="flat"
            className="px-8 font-medium bg-[var(--lj-surface-2)] text-[var(--lj-ink)] hover:bg-[var(--lj-surface)] rounded-full"
            startContent={<UserPlus size={18} />}
          >
            加入我们
          </Button>
        </div>
        <div className="lj-scroll-indicator">
          <ChevronDown size={24} />
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* Featured Works */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <div className="lj-section-header">
            <div>
              <h2 className="lj-section-title">精选作品</h2>
              <p className="lj-section-subtitle">来自社团成员的近期创作</p>
            </div>
            <Button
              as={Link}
              to="/gallery"
              variant="light"
              color="primary"
              endContent={<ArrowRight size={16} />}
            >
              查看全部
            </Button>
          </div>

          <div className="lj-cards-grid">
            {photos.map((p, idx) => (
              <div
                key={p.id || p.uuid || p.title}
                className="lj-card group cursor-pointer overflow-hidden rounded-2xl border border-[var(--lj-surface-2)]"
                style={cardBg(p)}
                onClick={() => setDetailIdx(idx)}
              >
                <div className="lj-card-overlay">
                  <div className="lj-card-tag">{p.cat}</div>
                  <h3 className="lj-card-title">{p.title}</h3>
                  <p className="lj-card-author">BY {p.author}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="lj-section lj-section-alt relative">
        {isAdminUser && (
          <div className="max-w-6xl mx-auto px-4 mb-4 flex justify-end">
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onClick={() => setEditorOpen(true)}
              startContent={<Edit3 size={14} />}
            >
              编辑首页文案
            </Button>
          </div>
        )}

        <div className="lj-section-inner">
          <div className="lj-about-grid">
            <div>
              <h2 className="lj-section-title">{homeContent?.about_section_title || '关于凌镜摄影社团'}</h2>
              <div className="lj-about-text space-y-3">
                {introParagraphs.map((pText, i) => (
                  <MarkdownText key={i} content={pText} />
                ))}
              </div>
              <div className="lj-stats-row flex flex-wrap gap-6 mt-6">
                {stats.map((s, i) => (
                  <div key={i} className="lj-stat-item">
                    <div className="lj-stat-num text-3xl font-extrabold text-[var(--lj-brand)]">{s.value}</div>
                    <div className="lj-stat-label text-xs text-default-400 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lj-depts-preview grid grid-cols-1 gap-3">
              {depts.map((d) => {
                const IconComponent = DEPT_ICON_MAP[d.icon] || Camera
                return (
                  <Card key={d.name} className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)]">
                    <CardBody className="flex flex-row items-center gap-4 p-4">
                      <div className="lj-dept-icon p-3 rounded-xl bg-[var(--lj-brand)]/10 text-[var(--lj-brand)]">
                        <IconComponent size={22} />
                      </div>
                      <div>
                        <h4 className="font-bold text-base">{d.name}</h4>
                        <p className="text-xs text-default-400 mt-0.5 line-clamp-1">{d.desc}</p>
                      </div>
                    </CardBody>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lj-cta-section text-center py-16 px-4">
        <div className="lj-cta-inner max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-3">{homeContent?.cta_title || '探索更多摄影之美'}</h2>
          <p className="text-sm text-default-400 mb-6">{homeContent?.cta_subtitle || '浏览更多作品、阅读摄影干货教程，或者提交你自己的得意之作'}</p>
          <div className="flex justify-center gap-4">
            <Button
              as={Link}
              to="/gallery"
              size="lg"
              color="primary"
              className="px-8 font-medium rounded-full"
              startContent={<Image size={18} />}
            >
              浏览作品展示
            </Button>
          </div>
        </div>
      </section>

      <PhotoDetail
        open={detailIdx !== null && detailIdx >= 0 && detailIdx < photos.length}
        photo={detailIdx !== null ? photos[detailIdx] : null}
        list={photos}
        currentIndex={detailIdx ?? 0}
        onClose={() => setDetailIdx(null)}
        onPrev={() => detailIdx > 0 && setDetailIdx((i) => i - 1)}
        onNext={() => detailIdx < photos.length - 1 && setDetailIdx((i) => i + 1)}
      />

      {editorOpen && (
        <SiteContentEditor
          slug="home"
          open={editorOpen}
          initialContent={homeContent}
          onClose={() => setEditorOpen(false)}
          onSaved={(newVal) => setHomeContent(newVal)}
        />
      )}
    </>
  )
}

export default Home
