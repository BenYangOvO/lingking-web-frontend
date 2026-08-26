import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Heart, MessageCircle } from 'lucide-react'
import { api } from '../api'
import '../styles/pages/diary.css'

function DiaryStats({ likes, comments }) {
  return (
    <div className="lj-diary-stats">
      <span className="lj-diary-stat">
        <Heart style={{ width: 14, height: 14 }} /> {likes}
      </span>
      <span className="lj-diary-stat">
        <MessageCircle style={{ width: 14, height: 14 }} /> {comments}
      </span>
    </div>
  )
}

function Diary() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/diary').then((data) => {
      setEntries(data.entries || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const featured = entries[0]
  const rest = entries.slice(1)

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
          <div className="lj-diary-featured-card">
            <div className="lj-diary-featured-cover" style={{ background: featured.bg }} />
            <div className="lj-diary-featured-body">
              <div className="lj-diary-featured-meta">
                <span className="lj-diary-date-badge">
                  <Calendar style={{ width: 11, height: 11 }} />
                  {featured.date}
                </span>
                <span className={`lj-diary-mood-tag ${featured.mood_class}`}>
                  {featured.mood}
                </span>
                <span className="lj-tag">{featured.tag}</span>
              </div>
              <h2 className="lj-diary-featured-title">{featured.title}</h2>
              <p className="lj-diary-featured-excerpt">{featured.excerpt}</p>
              <div className="lj-diary-featured-footer">
                <div className="lj-diary-author">
                  <div className="lj-diary-avatar" style={{ background: featured.avatar_bg }}>
                    {featured.avatar}
                  </div>
                  <div className="lj-diary-author-info">
                    <span className="lj-diary-author-name">{featured.author}</span>
                    <span className="lj-diary-read-time">{featured.read_time}</span>
                  </div>
                </div>
                <DiaryStats likes={featured.likes} comments={featured.comments} />
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <div className="lj-diary-grid">
          {rest.map((e) => (
            <div className="lj-diary-card" key={e.id || e.title}>
              <div className="lj-diary-card-cover" style={{ background: e.bg }} />
              <div className="lj-diary-card-body">
                <div className="lj-diary-card-meta">
                  <span className="lj-diary-date-badge">
                    <Calendar style={{ width: 11, height: 11 }} />
                    {e.date}
                  </span>
                  <span className={`lj-diary-mood-tag ${e.mood_class}`}>
                    {e.mood}
                  </span>
                </div>
                <h3 className="lj-diary-card-title">{e.title}</h3>
                <p className="lj-diary-card-excerpt">{e.excerpt}</p>
                <div className="lj-diary-card-footer">
                  <div className="lj-diary-author">
                    <div className="lj-diary-avatar" style={{ width: 30, height: 30, fontSize: 12, background: e.avatar_bg }}>
                      {e.avatar}
                    </div>
                    <div className="lj-diary-author-info">
                      <span className="lj-diary-author-name" style={{ fontSize: 13 }}>{e.author}</span>
                      <span className="lj-diary-read-time">{e.read_time}</span>
                    </div>
                  </div>
                  <DiaryStats likes={e.likes} comments={e.comments} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default Diary