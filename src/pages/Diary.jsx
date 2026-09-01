import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Calendar, Heart, MessageCircle, ArrowLeft, User } from 'lucide-react'
import { api } from '../api'
import MarkdownText from '../components/MarkdownText'
import '../styles/pages/diary.css'

function DiaryStats({ likes, comments }) {
  return (
    <div className="lj-diary-stats">
      <span className="lj-diary-stat">
        <Heart style={{ width: 14, height: 14 }} /> {likes || 0}
      </span>
      <span className="lj-diary-stat">
        <MessageCircle style={{ width: 14, height: 14 }} /> {comments || 0}
      </span>
    </div>
  )
}

function Diary() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [singlePost, setSinglePost] = useState(null)
  const [singleLoading, setSingleLoading] = useState(false)

  useEffect(() => {
    api('/diary').then((data) => {
      setEntries(data.entries || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // 如果路由指定了 :id，在 entries 中查找或通过 API 单独拉取
  useEffect(() => {
    if (!id) {
      setSinglePost(null)
      return
    }
    const found = entries.find((e) => String(e.uuid) === String(id) || String(e.id) === String(id) || String(e.submission_id) === String(id))
    if (found) {
      setSinglePost(found)
    } else {
      setSingleLoading(true)
      api(`/posts/${id}`).then((res) => {
        if (res.ok && res.post) {
          const p = res.post.payload || res.post
          setSinglePost({
            id: res.post.id,
            uuid: res.post.uuid || id,
            title: p.title || '无标题',
            date: p.date || '',
            author: p.author || res.post.submitter_name || '社员',
            mood: p.mood || 'happy',
            content: p.content || '',
            bg: p.bg || 'linear-gradient(145deg,#1E3A5F,#2D5F8A,#4A90D9)',
            avatar: (p.author || '社')[0],
            avatar_bg: 'linear-gradient(135deg,#4A90D9,#6AADE8)',
          })
        }
      }).catch(() => {}).finally(() => setSingleLoading(false))
    }
  }, [id, entries])

  const featured = entries[0]
  const rest = entries.slice(1)

  // 单篇日记详情视图
  if (id) {
    const item = singlePost || entries.find((e) => String(e.uuid) === String(id) || String(e.id) === String(id))
    return (
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            className="lj-btn-secondary"
            onClick={() => navigate('/diary')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', fontSize: 14 }}
          >
            <ArrowLeft size={16} /> 返回日记列表
          </button>
          <div className="lj-breadcrumb" style={{ margin: 0 }}>
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <Link to="/diary">凌镜日记本</Link>
            <span className="sep">/</span>
            <span className="current">{item?.title || '日记详情'}</span>
          </div>
        </div>

        {singleLoading && <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>正在加载日记详情...</div>}

        {!singleLoading && !item && (
          <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>
            <h2>未找到该篇日记</h2>
            <p style={{ marginTop: 8 }}>可能已被删除或链接有误</p>
          </div>
        )}

        {!singleLoading && item && (
          <article className="lj-diary-detail-card" style={{ background: 'var(--lj-bg-card)', borderRadius: 16, border: '1px solid var(--lj-border)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ height: 160, background: item.bg || 'linear-gradient(135deg, #1E3A5F, #4A90D9)' }} />
            <div style={{ padding: '32px 28px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 16 }}>
                {item.date && (
                  <span className="lj-diary-date-badge">
                    <Calendar style={{ width: 12, height: 12 }} />
                    {item.date}
                  </span>
                )}
                {item.mood && (
                  <span className={`lj-diary-mood-tag ${item.mood_class || 'mood-peaceful'}`}>
                    {item.mood}
                  </span>
                )}
                {item.tag && <span className="lj-tag">{item.tag}</span>}
              </div>

              <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 20px', lineHeight: 1.35, color: 'var(--lj-ink-1)' }}>
                {item.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, marginBottom: 24, borderBottom: '1px solid var(--lj-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="lj-diary-avatar" style={{ background: item.avatar_bg || 'var(--lj-brand)' }}>
                    {item.avatar || (item.author ? item.author[0] : <User size={14} />)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.author || '社员'}</div>
                    <div style={{ fontSize: 12, color: 'var(--lj-ink-3)' }}>{item.read_time || '凌镜日记'}</div>
                  </div>
                </div>
                <DiaryStats likes={item.likes} comments={item.comments} />
              </div>

              <div className="lj-diary-body-content" style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--lj-ink-2)' }}>
                {item.content ? (
                  <MarkdownText content={item.content} />
                ) : (
                  <p>{item.excerpt}</p>
                )}
              </div>
            </div>
          </article>
        )}
      </div>
    )
  }

  // 列表视图
  return (
    <>
      <section className="lj-page-header">
        <div className="lj-page-header-inner">
          <div className="lj-breadcrumb">
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <span className="current">凌镜日记本</span>
          </div>
          <h1 className="lj-page-title">凌镜日记本</h1>
          <p className="lj-page-subtitle">记录每一帧灵感与感悟</p>
        </div>
      </section>

      {loading && <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>加载日记中...</div>}

      {!loading && featured && (
        <div className="lj-diary-featured">
          <Link
            to={`/diary/${featured.uuid || featured.id}`}
            className="lj-diary-featured-card"
            style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
          >
            <div className="lj-diary-featured-cover" style={{ background: featured.bg }} />
            <div className="lj-diary-featured-body">
              <div className="lj-diary-featured-meta">
                <span className="lj-diary-date-badge">
                  <Calendar style={{ width: 11, height: 11 }} />
                  {featured.date}
                </span>
                <span className={`lj-diary-mood-tag ${featured.mood_class || 'mood-peaceful'}`}>
                  {featured.mood}
                </span>
                {featured.tag && <span className="lj-tag">{featured.tag}</span>}
              </div>
              <h2 className="lj-diary-featured-title">{featured.title}</h2>
              <p className="lj-diary-featured-excerpt">{featured.excerpt || (featured.content ? featured.content.slice(0, 100) + '...' : '')}</p>
              <div className="lj-diary-featured-footer">
                <div className="lj-diary-author">
                  <div className="lj-diary-avatar" style={{ background: featured.avatar_bg }}>
                    {featured.avatar || (featured.author ? featured.author[0] : '社')}
                  </div>
                  <div className="lj-diary-author-info">
                    <span className="lj-diary-author-name">{featured.author}</span>
                    <span className="lj-diary-read-time">{featured.read_time || '点击阅读'}</span>
                  </div>
                </div>
                <DiaryStats likes={featured.likes} comments={featured.comments} />
              </div>
            </div>
          </Link>
        </div>
      )}

      {!loading && (
        <div className="lj-diary-grid">
          {rest.map((e) => (
            <Link
              to={`/diary/${e.uuid || e.id}`}
              className="lj-diary-card"
              key={e.uuid || e.id || e.title}
              style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
            >
              <div className="lj-diary-card-cover" style={{ background: e.bg }} />
              <div className="lj-diary-card-body">
                <div className="lj-diary-card-meta">
                  <span className="lj-diary-date-badge">
                    <Calendar style={{ width: 11, height: 11 }} />
                    {e.date}
                  </span>
                  <span className={`lj-diary-mood-tag ${e.mood_class || 'mood-peaceful'}`}>
                    {e.mood}
                  </span>
                </div>
                <h3 className="lj-diary-card-title">{e.title}</h3>
                <p className="lj-diary-card-excerpt">{e.excerpt || (e.content ? e.content.slice(0, 80) + '...' : '')}</p>
                <div className="lj-diary-card-footer">
                  <div className="lj-diary-author">
                    <div className="lj-diary-avatar" style={{ width: 30, height: 30, fontSize: 12, background: e.avatar_bg }}>
                      {e.avatar || (e.author ? e.author[0] : '社')}
                    </div>
                    <div className="lj-diary-author-info">
                      <span className="lj-diary-author-name" style={{ fontSize: 13 }}>{e.author}</span>
                      <span className="lj-diary-read-time">{e.read_time || '阅读全文'}</span>
                    </div>
                  </div>
                  <DiaryStats likes={e.likes} comments={e.comments} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

export default Diary