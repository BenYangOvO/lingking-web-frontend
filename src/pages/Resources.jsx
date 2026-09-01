import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Search, Eye, Download, ArrowLeft, BookOpen, User, Tag } from 'lucide-react'
import { api } from '../api'
import MarkdownText from '../components/MarkdownText'
import '../styles/pages/resources.css'

const TABS = [
  { key: 'all', label: '全部' },
  { key: 'tutorial', label: '摄影教程' },
  { key: 'post', label: '后期技巧' },
  { key: 'gear', label: '器材评测' },
  { key: 'composition', label: '构图指南' },
  { key: 'light', label: '光影知识' },
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

  // 如果路由包含 :id 参数，查找对应项或从 API 单独加载
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

  // 单篇详情页面视图
  if (id) {
    const item = singleItem || resources.find((r) => String(r.uuid) === String(id) || String(r.id) === String(id))
    return (
      <div style={{ maxWidth: 880, margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            className="lj-btn-secondary"
            onClick={() => navigate('/resources')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 14 }}
          >
            <ArrowLeft size={16} /> 返回资源库
          </button>
          <div className="lj-breadcrumb" style={{ margin: 0 }}>
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <Link to="/resources">资源库</Link>
            <span className="sep">/</span>
            <span className="current">{item?.title || '资源详情'}</span>
          </div>
        </div>

        {singleLoading && <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>正在加载资源内容...</div>}

        {!singleLoading && !item && (
          <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
            <h2>未找到该资源</h2>
            <p style={{ marginTop: 8 }}>可能已被删除或链接有误</p>
          </div>
        )}

        {!singleLoading && item && (
          <article className="lj-resource-detail-card" style={{ background: 'var(--lj-bg-card)', borderRadius: 16, border: '1px solid var(--lj-border)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ height: 160, background: item.coverGrad || item.bg || 'linear-gradient(135deg, #2D5F8A, #4A90D9)' }} />
            <div style={{ padding: '32px 28px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                <span className="lj-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Tag size={12} /> {item.tag || item.cat}
                </span>
                <span style={{ fontSize: 13, color: 'var(--lj-ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Eye size={13} /> {item.views || 0} 阅读
                </span>
                <span style={{ fontSize: 13, color: 'var(--lj-ink-3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Download size={13} /> {item.downloads || 0} 次下载/引用
                </span>
              </div>

              <h1 style={{ fontSize: '1.85rem', fontWeight: 700, margin: '0 0 16px', lineHeight: 1.35, color: 'var(--lj-ink-1)' }}>
                {item.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 20, marginBottom: 24, borderBottom: '1px solid var(--lj-border)', color: 'var(--lj-ink-3)', fontSize: 14 }}>
                <User size={15} />
                <span>贡献作者：<strong style={{ color: 'var(--lj-ink-1)' }}>{item.author || '社员'}</strong></span>
              </div>

              {item.summary && (
                <div style={{ background: 'var(--lj-bg-alt)', padding: '16px 20px', borderRadius: 10, marginBottom: 24, fontSize: 14, color: 'var(--lj-ink-2)', lineHeight: 1.6, borderLeft: '4px solid var(--lj-brand)' }}>
                  <strong>简介：</strong>{item.summary}
                </div>
              )}

              <div className="lj-resource-full-content" style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--lj-ink-2)' }}>
                {item.fullDesc ? (
                  <MarkdownText content={item.fullDesc} />
                ) : (
                  <p>{item.desc || item.summary || '暂无详细正文'}</p>
                )}
              </div>
            </div>
          </article>
        )}
      </div>
    )
  }

  // 资源列表视图
  return (
    <>
      <section className="lj-page-header">
        <h1 className="lj-page-header-title">凌镜资源库</h1>
        <p className="lj-page-header-subtitle">摄影技巧、后期教程、器材评测一站式资源</p>
      </section>

      <div className="lj-search-bar">
        <div className="lj-search-wrap">
          <div className="lj-search-icon">
            <Search style={{ width: 18, height: 18 }} />
          </div>
          <input
            type="text"
            className="lj-search-input"
            placeholder="搜索资源：教程、技巧、器材评测..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="lj-category-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`lj-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="lj-resources-layout">
        <div className="lj-resource-grid">
          {loading && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#6b7280' }}>加载资源中...</div>}
          {!loading && filtered.map((r) => (
            <div
              className="lj-resource-card"
              key={r.uuid || r.id || r.title}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/resources/${r.uuid || r.id}`)}
            >
              <div className="lj-resource-card-icon" style={{ background: r.coverGrad || r.bg }} />
              <div className="lj-resource-card-body">
                <h3 className="lj-resource-card-title">{r.title}</h3>
                <p className="lj-resource-card-desc">{r.summary || r.desc}</p>
                <div className="lj-resource-card-footer">
                  <span className="lj-tag">{r.tag || r.cat}</span>
                  <div className="lj-resource-card-meta">
                    <span>
                      <Eye style={{ width: 12, height: 12 }} /> {r.views}
                    </span>
                    <span>
                      <Download style={{ width: 12, height: 12 }} /> {r.downloads}
                    </span>
                    <span>{r.author}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {!loading && filtered.length === 0 && (
        <div className="lj-resources-layout" style={{ textAlign: 'center', padding: '60px 0' }}>
          <p style={{ color: 'var(--lj-ink-3)' }}>没有找到匹配的资源</p>
        </div>
      )}
    </>
  )
}

export default Resources