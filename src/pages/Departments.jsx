import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, Chip, Button, Spinner } from '@heroui/react'
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

      <div className="max-w-6xl mx-auto px-4 py-12">
        {isAdminUser && (
          <div className="flex justify-end mb-6">
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onClick={() => setEditorOpen(true)}
              startContent={<Edit3 size={14} />}
            >
              编辑部门介绍
            </Button>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-16">
            <Spinner color="primary" label="加载部门中..." size="lg" />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {departments.map((d) => {
              const IconComp = DEPT_ICON_MAP[d.name] || Camera
              const responsibilities = d.responsibilities || []
              const stats = d.stats || []
              return (
                <Card key={d.name} className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-lg p-2">
                  <CardBody className="gap-4 p-5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-[var(--lj-brand)]/10 text-[var(--lj-brand)]">
                        <IconComp size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{d.name}</h3>
                          <Chip size="sm" variant="flat" color="primary">{d.count}+ 成员</Chip>
                        </div>
                      </div>
                    </div>

                    <MarkdownText className="text-xs text-default-400 leading-relaxed">{d.desc}</MarkdownText>

                    {responsibilities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--lj-surface-2)]">
                        {responsibilities.map((r) => {
                          const label = r.label || r
                          const Icon = respIconFor(label)
                          return (
                            <Chip key={label} size="sm" variant="flat" startContent={<Icon size={12} />}>
                              {label}
                            </Chip>
                          )
                        })}
                      </div>
                    )}
                  </CardBody>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {editorOpen && (
        <SiteContentEditor
          slug="departments"
          open={editorOpen}
          initialContent={pageContent}
          onClose={() => setEditorOpen(false)}
          onSaved={(newVal) => setPageContent(newVal)}
        />
      )}
    </>
  )
}

export default Departments
