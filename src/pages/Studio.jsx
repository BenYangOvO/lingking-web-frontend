import { useState, useEffect } from 'react'
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
        <div className="lj-section-label">
          <Sparkles style={{ width: 14, height: 14 }} />
          {pageContent?.hero_section_label || 'LingJing Studio'}
        </div>
        <h1 className="lj-hero-studio-title">
          {pageContent?.hero_title || '凌镜'}
          <span>{pageContent?.hero_title_highlight || '工作室'}</span>
        </h1>
        <p className="lj-hero-studio-tagline">
          {pageContent?.hero_tagline || '因为热爱，校外再聚'}
        </p>
        <p className="lj-hero-studio-desc">
          {pageContent?.hero_desc || '毕业不是终点，而是新的起点。凌镜工作室是社团校友在校外延续摄影热爱的平台，一个让热爱摄影的人永远有归处的地方。'}
        </p>
        <div className="lj-hero-ctas">
          <a href="#join" className="lj-btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>
            <UserPlus style={{ width: 16, height: 16 }} />
            申请加入
          </a>
          <a href="#contact" className="lj-btn-secondary" style={{ padding: '12px 28px', fontSize: 15 }}>
            <Mail style={{ width: 16, height: 16 }} />
            联系我们
          </a>
        </div>
        <div className="lj-scroll-indicator">
          <ChevronDown style={{ width: 24, height: 24 }} />
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* 工作室介绍 */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <div className="lj-intro-split">
            <div>
              <div className="lj-section-label">
                <Info style={{ width: 14, height: 14 }} />
                {pageContent?.section_about_label || '关于工作室'}
              </div>
              <h2 className="lj-section-title" style={{ marginBottom: 24 }}>
                {pageContent?.about_title || '热爱不止，步履不停'}
              </h2>
              <div className="lj-intro-left-body">
                {aboutParagraphs.map((p, i) => (
                  <p key={i} style={{ marginBottom: i === aboutParagraphs.length - 1 ? 0 : '1em' }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <div className="lj-feature-list">
                {features.map((f, idx) => {
                  const IconComp = STUDIO_FEATURE_ICONS[idx % STUDIO_FEATURE_ICONS.length]
                  return (
                    <div className="lj-feature-item" key={f.title + '-' + idx}>
                      <div className="lj-feature-icon">
                        <IconComp style={{ width: 20, height: 20 }} />
                      </div>
                      <div className="lj-feature-text">
                        <h4>{f.title}</h4>
                        <p>{f.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 设备清单 */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <h2 className="lj-section-title" style={{ textAlign: 'center' }}>
            {pageContent?.section_equip_title || '工作室设备清单'}
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--lj-ink-2)', marginBottom: 40 }}>
            {pageContent?.section_equip_subtitle || '共享器材，按需借用'}
          </p>
          {equipLoading && <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>加载设备中...</div>}
          {!equipLoading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
              {equipment.map((eq, i) => (
                <div key={i} style={{
                  background: 'var(--lj-surface)',
                  border: '1px solid var(--lj-border)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--lj-ink)' }}>{eq.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--lj-ink-3)', marginTop: 2 }}>{eq.type}</div>
                  </div>
                  <span style={{
                    fontSize: 12,
                    padding: '4px 12px',
                    borderRadius: 20,
                    background: eq.status === '可用' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: eq.status === '可用' ? '#059669' : '#DC2626',
                    fontWeight: 500,
                  }}>
                    {eq.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 运营结构 */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <h2 className="lj-section-title" style={{ textAlign: 'center' }}>
            {pageContent?.section_org_title || '工作室运营结构'}
          </h2>
          <div className="lj-org-wrapper">
            <div className="lj-org-root">
              工作室负责人
              <div className="lj-org-root-sub">统筹规划与对外合作</div>
            </div>
            <div className="lj-org-connector-v" />
            <div className="lj-org-connector-h-wrapper" />
            <div className="lj-org-groups-row">
              {orgGroups.map((g, idx) => {
                const IconComp = STUDIO_ORG_ICONS[idx % STUDIO_ORG_ICONS.length]
                return (
                  <div className="lj-org-group-col" key={g.name + '-' + idx}>
                    <div className="lj-org-drop-line" />
                    <div className="lj-org-group-card">
                      <div className="lj-org-group-icon">
                        <IconComp style={{ width: 20, height: 20 }} />
                      </div>
                      <h3 className="lj-org-group-name">{g.name}</h3>
                      <p className="lj-org-group-desc">{g.desc}</p>
                      <div className="lj-org-roles">
                        {(g.roles || []).map((r) => (
                          <span className="lj-org-role-tag" key={r}>{r}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 如何加入 */}
      <section className="lj-section" id="join">
        <div className="lj-section-inner">
          <h2 className="lj-section-title" style={{ textAlign: 'center' }}>
            {pageContent?.section_join_title || '如何成为工作室的一员'}
          </h2>
          <div className="lj-join-grid">
            <div>
              <h3 style={{ fontWeight: 600, fontSize: 18, color: 'var(--lj-ink)', marginBottom: 20 }}>
                <CheckCircle
                  style={{
                    width: 18,
                    height: 18,
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginRight: 6,
                    color: 'var(--lj-brand)',
                  }}
                />
                {pageContent?.section_join_req_title || '基本要求'}
              </h3>
              <div className="lj-join-req-list">
                {requirements.map((r, idx) => {
                  const IconComp = STUDIO_REQ_ICONS[idx % STUDIO_REQ_ICONS.length]
                  const text = r.text || r.label || r
                  return (
                    <div className="lj-join-req-item" key={text + '-' + idx}>
                      <div className="lj-join-req-icon">
                        <IconComp style={{ width: 14, height: 14 }} />
                      </div>
                      <span>{text}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div>
              <h3 style={{ fontWeight: 600, fontSize: 18, color: 'var(--lj-ink)', marginBottom: 20 }}>
                <Route
                  style={{
                    width: 18,
                    height: 18,
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    marginRight: 6,
                    color: 'var(--lj-brand)',
                  }}
                />
                {pageContent?.section_join_steps_title || '申请流程'}
              </h3>
              <div className="lj-steps-list">
                {joinSteps.map((s, idx) => (
                  <div className="lj-step-card" key={(s.num || idx) + '-' + idx}>
                    <div className="lj-step-number">{s.num}</div>
                    <div className="lj-step-content">
                      <h4>{s.title}</h4>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 联系 */}
      <section className="lj-section" id="contact">
        <div className="lj-section-inner">
          <h2 className="lj-section-title" style={{ textAlign: 'center' }}>
            {pageContent?.section_contact_title || '与我们取得联系'}
          </h2>
          <div className="lj-contact-card">
            <h3 className="lj-contact-title">
              {pageContent?.contact_card_title || '凌镜工作室'}
            </h3>
            <p className="lj-contact-subtitle">
              {pageContent?.contact_card_subtitle || '如果你对工作室感兴趣，或有任何合作与咨询需求，欢迎通过以下方式联系我们。'}
            </p>
            <div className="lj-contact-items">
              {contacts.map((c, idx) => {
                const IconComp = STUDIO_CONTACT_ICONS[idx % STUDIO_CONTACT_ICONS.length]
                return (
                  <div className="lj-contact-item" key={c.label + '-' + idx}>
                    <div className="lj-contact-item-icon">
                      <IconComp style={{ width: 18, height: 18 }} />
                    </div>
                    <div>
                      <div className="lj-contact-item-label">{c.label}</div>
                      <div className="lj-contact-item-value">{c.value}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 管理员：编辑悬浮按钮 + 编辑弹窗 */}
      {isAdminUser && (
        <button
          className="lj-edit-fab"
          onClick={() => setEditorOpen(true)}
          title="编辑工作室内容"
        >
          <Edit3 size={16} /> 编辑本页
        </button>
      )}

      <SiteContentEditor
        slug="studio"
        open={editorOpen}
        initialContent={pageContent}
        onClose={() => setEditorOpen(false)}
        onSaved={(saved) => {
          setPageContent(mergeSiteContent(SITE_DEFAULTS.studio, saved))
        }}
      />
    </>
  )
}

export default Studio
