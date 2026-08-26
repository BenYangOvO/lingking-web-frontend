import { useState, useEffect } from 'react'
import { Search, Eye, Download } from 'lucide-react'
import { api } from '../api'
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
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [keyword, setKeyword] = useState('')

  useEffect(() => {
    api('/resources').then((data) => {
      setResources(data.resources || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = resources.filter((r) => {
    const matchCat = tab === 'all' || r.cat === tab
    const kw = keyword.trim().toLowerCase()
    const matchKw = !kw || r.title.toLowerCase().includes(kw) || r.desc.toLowerCase().includes(kw)
    return matchCat && matchKw
  })

  return (
    <>
      <section className="lj-page-header">
        <h1 className="lj-page-header-title">凌镜资源库</h1>
        <p className="lj-page-header-subtitle">摄影技巧、后期教程、器材评测一站式资源</p>
      </section>

      <div className="lj-search-bar">
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
            <div className="lj-resource-card" key={r.id || r.title}>
              <div className="lj-resource-card-icon" style={{ background: r.bg }} />
              <div className="lj-resource-card-body">
                <h3 className="lj-resource-card-title">{r.title}</h3>
                <p className="lj-resource-card-desc">{r.desc}</p>
                <div className="lj-resource-card-footer">
                  <span className="lj-tag">{r.tag}</span>
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