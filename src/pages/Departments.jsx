import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Camera,
  Cpu,
  Megaphone,
  MapPin,
  Palette,
  Image,
  Star,
  Globe,
  SlidersHorizontal,
  Scan,
  Share2,
  Smartphone,
  PenTool,
  Bell,
  Handshake,
  Edit3,
} from 'lucide-react'
import { getSiteContent } from '../api'
import { isAdmin } from '../auth'
import SiteContentEditor from '../components/SiteContentEditor'
import MarkdownText from '../components/MarkdownText'
import {
  SITE_DEFAULTS,
  DEPT_ICON_MAP,
  mergeSiteContent,
} from '../siteContentDefaults'
import '../styles/pages/departments.css'
import '../styles/components/site-content-editor.css'

// 职责图标映射（按职责标签关键字匹配）
const RESP_ICON_BY_LABEL = {
  '周常外拍': MapPin, '主题摄影': Palette, '影展策划': Image, '作品评审': Star,
  '网站运维': Globe, '后期教学': SlidersHorizontal, '器材评测': Scan, '技术分享': Share2,
  '社媒运营': Smartphone, '海报设计': PenTool, '活动宣传': Bell, '品牌合作': Handshake,
}
function respIconFor(label) {
  return RESP_ICON_BY_LABEL[label] || Star
}

function Departments() {
  const [pageContent, setPageContent] = useState(SITE_DEFAULTS.departments)
  const [loading, setLoading] = useState(true)
  const [editorOpen, setEditorOpen] = useState(false)
  const isAdminUser = isAdmin()

  useEffect(() => {
    getSiteContent('departments').then((res) => {
      setPageContent(mergeSiteContent(SITE_DEFAULTS.departments, res?.content))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const departments = pageContent?.departments || []

  return (
    <>
      <section className="lj-page-header">
        <div className="lj-page-header-inner">
          <div className="lj-breadcrumb">
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <span className="current">部门介绍</span>
          </div>
          <h1 className="lj-page-title">部门介绍</h1>
          <p className="lj-page-subtitle">
            {pageContent?.page_subtitle || '三个核心部门，共同构成凌镜的灵魂'}
          </p>
        </div>
      </section>

      <div className="lj-dept-section">
        {loading && <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>加载部门中...</div>}
        {!loading && departments.map((d) => {
          const IconComp = DEPT_ICON_MAP[d.name] || Camera
          const responsibilities = d.responsibilities || []
          const stats = d.stats || []
          return (
            <div className="lj-dept-card" key={d.name}>
              <div className="lj-dept-card-head">
                <div className="lj-dept-icon-wrap">
                  <IconComp style={{ width: 22, height: 22 }} />
                </div>
                <div className="lj-dept-card-head-text">
                  <div className="lj-dept-name">
                    {d.name}
                    <span className="lj-dept-count-tag">{d.count}+ 成员</span>
                  </div>
                  <MarkdownText className="lj-dept-desc">{d.desc}</MarkdownText>
                </div>
              </div>
              {responsibilities.length > 0 && (
                <div className="lj-dept-responsibilities">
                  {responsibilities.map((r) => {
                    const label = r.label || r
                    const Icon = respIconFor(label)
                    return (
                      <span className="lj-resp-tag" key={label}>
                        <Icon style={{ width: 14, height: 14 }} /> {label}
                      </span>
                    )
                  })}
                </div>
              )}
              {stats.length > 0 && (
                <div className="lj-dept-stats">
                  {stats.map((s) => (
                    <div className="lj-dept-stat" key={s.label}>
                      <div className="lj-dept-stat-value">{s.value}</div>
                      <div className="lj-dept-stat-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="lj-join-section">
        <div className="lj-join-card">
          <h2 className="lj-join-title">{pageContent?.section_join_title || '想加入我们？'}</h2>
          <MarkdownText className="lj-join-desc">
            {pageContent?.section_join_desc || '无论你是摄影新手还是技术达人，凌镜都有属于你的位置。我们每学期初开放招新，欢迎关注我们的公众号获取最新招募信息。加入凌镜，和志同道合的伙伴一起成长。'}
          </MarkdownText>
          <div className="lj-join-actions">
            <Link to="/about" className="lj-btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>
              了解招新详情
            </Link>
            <Link to="/about" className="lj-btn-secondary" style={{ padding: '12px 28px', fontSize: 15 }}>
              联系我们
            </Link>
          </div>
        </div>
      </div>

      {/* 管理员：编辑悬浮按钮 + 编辑弹窗 */}
      {isAdminUser && (
        <button
          className="lj-edit-fab"
          onClick={() => setEditorOpen(true)}
          title="编辑部门介绍内容"
        >
          <Edit3 size={16} /> 编辑本页
        </button>
      )}

      <SiteContentEditor
        slug="departments"
        open={editorOpen}
        initialContent={pageContent}
        onClose={() => setEditorOpen(false)}
        onSaved={(saved) => {
          setPageContent(mergeSiteContent(SITE_DEFAULTS.departments, saved))
        }}
      />
    </>
  )
}

export default Departments
