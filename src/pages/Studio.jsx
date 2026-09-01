import { useState, useEffect } from 'react'
import { Button, Card, CardBody, Chip, Spinner } from '@heroui/react'
import {
  Sparkles,
  UserPlus,
  Mail,
  ChevronDown,
  Info,
  Camera,
  Monitor,
  Package,
  Calendar,
  Settings,
  Palette,
  Cpu,
  Heart,
  Award,
  Users,
  Clock,
  CheckCircle,
  Route,
  MessageCircle,
  MapPin,
  Edit3,
} from 'lucide-react'
import { api, getSiteContent } from '../api'
import { isAdmin } from '../auth'
import SiteContentEditor from '../components/SiteContentEditor'
import MarkdownText from '../components/MarkdownText'
import {
  SITE_DEFAULTS,
  mergeSiteContent,
  STUDIO_FEATURE_ICONS,
  STUDIO_ORG_ICONS,
  STUDIO_REQ_ICONS,
  STUDIO_CONTACT_ICONS,
} from '../siteContentDefaults'
import '../styles/pages/studio.css'
import '../styles/components/site-content-editor.css'

function Studio() {
  const [equipment, setEquipment] = useState([])
  const [equipLoading, setEquipLoading] = useState(true)
  const [pageContent, setPageContent] = useState(SITE_DEFAULTS.studio)
  const [siteLoading, setSiteLoading] = useState(true)
  const [editorOpen, setEditorOpen] = useState(false)
  const isAdminUser = isAdmin()

  useEffect(() => {
    Promise.all([
      api('/studio/equipment'),
      getSiteContent('studio'),
    ]).then(([eqRes, siteRes]) => {
      setEquipment(eqRes.equipment || [])
      setEquipLoading(false)
      setPageContent(mergeSiteContent(SITE_DEFAULTS.studio, siteRes?.content))
      setSiteLoading(false)
    }).catch(() => {
      setEquipLoading(false)
      setSiteLoading(false)
    })
  }, [])

  const features = pageContent?.features || []
  const orgGroups = pageContent?.org_groups || []
  const requirements = pageContent?.requirements || []
  const joinSteps = pageContent?.join_steps || []
  const contacts = pageContent?.contacts || []
  const aboutParagraphs = pageContent?.about_paragraphs || []

  return (
    <>
      <section className="lj-hero-studio">
        <div className="lj-section-label flex items-center justify-center gap-1.5">
          <Sparkles size={14} />
          <span>{pageContent?.hero_section_label || 'LingJing Studio'}</span>
        </div>
        <h1 className="lj-hero-studio-title">
          {pageContent?.hero_title || '凌镜'}
          <span>{pageContent?.hero_title_highlight || '工作室'}</span>
        </h1>
        <p className="lj-hero-studio-tagline">
          {pageContent?.hero_tagline || '因为热爱，校外再聚'}
        </p>
        <MarkdownText className="lj-hero-studio-desc">
          {pageContent?.hero_desc || '毕业不是终点，而是新的起点。凌镜工作室是社团校友在校外延续摄影热爱的平台，一个让热爱摄影的人永远有归处的地方。'}
        </MarkdownText>
        <div className="lj-hero-ctas flex items-center justify-center gap-4 mt-6">
          <Button
            as="a"
            href="#join"
            size="lg"
            color="primary"
            className="px-8 font-medium shadow-lg shadow-indigo-500/25 rounded-full"
            startContent={<UserPlus size={18} />}
          >
            申请加入
          </Button>
          <Button
            as="a"
            href="#contact"
            size="lg"
            variant="flat"
            className="px-8 font-medium bg-[var(--lj-surface-2)] text-[var(--lj-ink)] hover:bg-[var(--lj-surface)] rounded-full"
            startContent={<Mail size={18} />}
          >
            联系我们
          </Button>
        </div>
        <div className="lj-scroll-indicator">
          <ChevronDown size={24} />
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* 关于工作室 */}
      <section className="lj-section relative">
        {isAdminUser && (
          <div className="max-w-6xl mx-auto px-4 mb-4 flex justify-end">
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onClick={() => setEditorOpen(true)}
              startContent={<Edit3 size={14} />}
            >
              编辑工作室内容
            </Button>
          </div>
        )}

        <div className="lj-section-inner">
          <div className="lj-studio-about">
            <div className="lj-studio-about-header">
              <h2 className="lj-section-title">{pageContent?.about_section_title || '延续摄影梦想的归宿'}</h2>
              <p className="lj-section-subtitle">{pageContent?.about_section_subtitle || '关于凌镜工作室的创立与愿景'}</p>
            </div>
            <div className="lj-studio-about-content">
              <div className="lj-studio-about-text space-y-3">
                {aboutParagraphs.map((p, i) => (
                  <MarkdownText key={i} content={p} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {features.map((f, i) => {
              const IconComp = STUDIO_FEATURE_ICONS[f.icon] || Heart
              return (
                <Card key={i} className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-md p-2">
                  <CardBody className="flex flex-col gap-3 p-5">
                    <div className="p-3 w-fit rounded-xl bg-[var(--lj-brand)]/10 text-[var(--lj-brand)]">
                      <IconComp size={24} />
                    </div>
                    <h3 className="font-bold text-lg">{f.title}</h3>
                    <p className="text-xs text-default-400 leading-relaxed">{f.desc}</p>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* 设备列表与借用 */}
      <section className="lj-section lj-section-alt">
        <div className="lj-section-inner max-w-5xl mx-auto">
          <h2 className="lj-section-title text-center">工作室设备 & 场地</h2>
          <p className="lj-section-subtitle text-center mb-8">成员可预约借用影棚、相机与暗房冲洗器材</p>

          {equipLoading ? (
            <div className="flex justify-center py-12">
              <Spinner color="primary" label="加载器材列表中..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipment.map((eq) => (
                <Card key={eq.id} className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)]">
                  <CardBody className="flex flex-row items-center justify-between p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Chip size="sm" variant="flat" color="primary">{eq.category}</Chip>
                        <span className="font-bold text-base">{eq.name}</span>
                      </div>
                      <p className="text-xs text-default-400 mt-1">{eq.model || '标准摄影设备'}</p>
                    </div>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={eq.status === 'available' ? 'success' : 'warning'}
                    >
                      {eq.status === 'available' ? '可借用' : '使用中'}
                    </Chip>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {editorOpen && (
        <SiteContentEditor
          slug="studio"
          open={editorOpen}
          initialContent={pageContent}
          onClose={() => setEditorOpen(false)}
          onSaved={(newVal) => setPageContent(newVal)}
        />
      )}
    </>
  )
}

export default Studio
