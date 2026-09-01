import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Input, Card, CardBody, Button, Chip, Tabs, Tab, Spinner } from '@heroui/react'
import { Search, Eye, Download, ArrowLeft, BookOpen, User, Tag } from 'lucide-react'
import { api } from '../api'
import MarkdownText from '../components/MarkdownText'
import '../styles/pages/resources.css'

const TABS = [
  { key: 'all', label: '全部' },
  { key: '摄影教程', label: '摄影教程' },
  { key: '后期技巧', label: '后期技巧' },
  { key: '器材评测', label: '器材评测' },
  { key: '构图指南', label: '构图指南' },
  { key: '光影知识', label: '光影知识' },
]

function Resources() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [singleItem, setSingleItem] = useState(null)
  const [singleLoading, setSingleLoading] = useState(false)

  useEffect(() => {
    api('/resources').then((data) => {
      setResources(data.resources || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!id) {
      setSingleItem(null)
      return
    }
    const found = resources.find((r) => String(r.uuid) === String(id) || String(r.id) === String(id) || String(r.submission_id) === String(id))
    if (found) {
      setSingleItem(found)
    } else {
      setSingleLoading(true)
      api(`/posts/${id}`).then((res) => {
        if (res.ok && res.post) {
          const p = res.post.payload || res.post
          setSingleItem({
            id: res.post.id,
            uuid: res.post.uuid || id,
            title: p.title || '未命名资源',
            cat: p.cat || '投稿',
            summary: p.summary || p.desc || '',
            fullDesc: p.fullDesc || p.full_desc || p.desc || '',
            author: p.author || res.post.submitter_name || '社员',
            views: p.views || 0,
            downloads: p.downloads || 0,
            tag: p.tag || p.cat || '资源',
            bg: p.coverGrad || p.bg || 'linear-gradient(135deg, #2D5F8A, #4A90D9)',
          })
        }
      }).catch(() => {}).finally(() => setSingleLoading(false))
    }
  }, [id, resources])

  const filtered = resources.filter((r) => {
    const matchCat = tab === 'all' || r.cat === tab
    const kw = keyword.trim().toLowerCase()
    const matchKw = !kw || r.title.toLowerCase().includes(kw) || (r.desc && r.desc.toLowerCase().includes(kw)) || (r.summary && r.summary.toLowerCase().includes(kw))
    return matchCat && matchKw
  })

  if (id) {
    const item = singleItem || resources.find((r) => String(r.uuid) === String(id) || String(r.id) === String(id))
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button
            size="sm"
            variant="flat"
            onClick={() => navigate('/resources')}
            startContent={<ArrowLeft size={16} />}
          >
            返回资源库
          </Button>
          <div className="lj-breadcrumb m-0">
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <Link to="/resources">资源库</Link>
            <span className="sep">/</span>
            <span className="current">{item?.title || '资源详情'}</span>
          </div>
        </div>

        {singleLoading && (
          <div className="flex justify-center py-16">
            <Spinner color="primary" label="正在加载资源内容..." />
          </div>
        )}

        {!singleLoading && !item && (
          <div className="text-center py-16 text-default-400">
            <h2 className="text-xl font-bold">未找到该资源</h2>
            <p className="mt-2 text-sm">可能已被删除或链接有误</p>
          </div>
        )}

        {!singleLoading && item && (
          <Card className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-xl p-4 md:p-8">
            <CardBody className="gap-4">
              <div className="flex items-center justify-between border-b border-[var(--lj-surface-2)] pb-4">
                <div className="flex items-center gap-2">
                  <Chip size="sm" color="primary" variant="flat" startContent={<Tag size={12} />}>
                    {item.cat || item.tag}
                  </Chip>
                  <span className="text-xs text-default-400">作者: {item.author || '凌镜社员'}</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{item.title}</h1>

              <div className="py-4 text-base leading-relaxed text-[var(--lj-ink)] border-b border-[var(--lj-surface-2)]">
                <MarkdownText content={item.fullDesc || item.summary || item.desc} />
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    )
  }

  return (
    <>
      <section className="lj-page-header">
        <div className="lj-page-header-inner">
          <div className="lj-breadcrumb">
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <span className="current">资源库</span>
          </div>
          <h1 className="lj-page-title">摄影干货资源库</h1>
          <p className="lj-page-subtitle">探索摄影教程、后期处理技巧、器材评测与光影指南</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <Tabs
            selectedKey={tab}
            onSelectionChange={(k) => setTab(String(k))}
            color="primary"
            variant="flat"
            size="sm"
          >
            {TABS.map((t) => (
              <Tab key={t.key} title={t.label} />
            ))}
          </Tabs>

          <Input
            size="sm"
            placeholder="搜索教程 / 技巧标题..."
            value={keyword}
            onValueChange={setKeyword}
            startContent={<Search size={16} className="text-default-400" />}
            className="w-full md:w-64"
          />
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Spinner color="primary" label="加载资源中..." size="lg" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-default-400">暂无资源卡片</div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <Card
                key={item.uuid || item.id || item.title}
                isPressable
                onClick={() => navigate(`/resources/${item.uuid || item.id}`)}
                className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-md hover:shadow-xl transition-all"
              >
                <CardBody className="gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <Chip size="sm" color="primary" variant="flat">{item.cat || item.tag || '教程'}</Chip>
                    <span className="text-xs text-default-400">{item.author || '凌镜社员'}</span>
                  </div>

                  <h3 className="text-lg font-bold line-clamp-1">{item.title}</h3>

                  <p className="text-xs text-default-400 line-clamp-3 leading-relaxed">
                    {item.summary || item.desc || '点击查看完整教程与知识干货分享...'}
                  </p>

                  <div className="flex items-center justify-end mt-2 pt-2 border-t border-[var(--lj-surface-2)]">
                    <Button size="sm" color="primary" variant="flat" endContent={<BookOpen size={14} />}>
                      阅读全文
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Resources