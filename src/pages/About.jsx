import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Input, Card, CardBody, Button, Spinner, Chip } from '@heroui/react'
import { Search, ChevronDown, Edit3 } from 'lucide-react'
import { getSiteContent } from '../api'
import { isAdmin } from '../auth'
import SiteContentEditor from '../components/SiteContentEditor'
import MarkdownText from '../components/MarkdownText'
import {
  SITE_DEFAULTS,
  mergeSiteContent,
  ABOUT_CONTACT_ICONS,
  ABOUT_VALUE_ICONS,
  ABOUT_SPONSOR_ICONS,
} from '../siteContentDefaults'
import '../styles/pages/about.css'
import '../styles/components/site-content-editor.css'

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
      <section className="lj-search-section max-w-xl mx-auto px-4 my-8">
        <Input
          size="lg"
          placeholder="搜索作品、成员、日记..."
          startContent={<Search size={20} className="text-default-400" />}
          variant="bordered"
          className="w-full"
        />
      </section>

      <div className="lj-glow-line" />

      {/* 联系我们 */}
      <section className="lj-section">
        <div className="lj-section-inner max-w-6xl mx-auto px-4">
          {isAdminUser && (
            <div className="flex justify-end mb-4">
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onClick={() => setEditorOpen(true)}
                startContent={<Edit3 size={14} />}
              >
                编辑关于我们内容
              </Button>
            </div>
          )}

          <h2 className="lj-section-title text-center mb-8">
            {pageContent?.section_contact_title || '联系我们'}
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner color="primary" label="加载中..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {contactCards.map((c, idx) => {
                const IconComp = ABOUT_CONTACT_ICONS[idx % ABOUT_CONTACT_ICONS.length]
                return (
                  <Card key={c.platform + '-' + idx} className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-md">
                    <CardBody className="flex flex-col items-center text-center p-5 gap-2">
                      <div className="p-3 rounded-full bg-[var(--lj-brand)]/10 text-[var(--lj-brand)] mb-1">
                        <IconComp size={22} />
                      </div>
                      <h3 className="font-bold text-base">{c.platform}</h3>
                      <p className="text-xs text-[var(--lj-brand)] font-medium">{c.handle}</p>
                      <p className="text-xs text-default-400 line-clamp-2 mt-1">{c.desc}</p>
                    </CardBody>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* 核心理念 */}
      <section className="lj-section">
        <div className="lj-section-inner max-w-5xl mx-auto px-4">
          <h2 className="lj-section-title text-center mb-6">
            {pageContent?.section_about_title || '关于凌镜'}
          </h2>

          <div className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] p-6 rounded-2xl shadow-xl mb-12">
            <MarkdownText className="text-base leading-relaxed text-[var(--lj-ink)] text-center">
              {pageContent?.mission || '凌镜——以镜头为镜，映照世间万象'}
            </MarkdownText>
          </div>

          {values.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((v, idx) => {
                const IconComp = ABOUT_VALUE_ICONS[idx % ABOUT_VALUE_ICONS.length]
                return (
                  <Card key={v.title} className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] p-2">
                    <CardBody className="gap-2 p-4">
                      <div className="p-2.5 w-fit rounded-xl bg-[var(--lj-brand)]/10 text-[var(--lj-brand)]">
                        <IconComp size={20} />
                      </div>
                      <h4 className="font-bold text-base">{v.title}</h4>
                      <p className="text-xs text-default-400 leading-relaxed">{v.desc}</p>
                    </CardBody>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {editorOpen && (
        <SiteContentEditor
          slug="about"
          open={editorOpen}
          initialContent={pageContent}
          onClose={() => setEditorOpen(false)}
          onSaved={(newVal) => setPageContent(newVal)}
        />
      )}
    </>
  )
}

export default About
