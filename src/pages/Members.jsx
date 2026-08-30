import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import '../styles/pages/members.css'

function ChibiFace({ happy, smile }) {
  return (
    <div className="lj-chibi-face">
      <div className="lj-chibi-eyes">
        <span className={`lj-chibi-eye${happy ? ' happy' : ''}`} />
        <span className={`lj-chibi-eye${happy ? ' happy' : ''}`} />
      </div>
      <div className={`lj-chibi-mouth ${smile ? 'smile' : 'grin'}`} />
      <div className="lj-chibi-blush left" />
      <div className="lj-chibi-blush right" />
    </div>
  )
}

function Members() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/members').then((data) => {
      setMembers(data.members || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="lj-page-header">
        <div className="lj-page-header-inner">
          <div className="lj-breadcrumb">
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <span className="current">凌镜成员</span>
          </div>
          <h1 className="lj-page-title">凌镜成员</h1>
          <p className="lj-page-subtitle">真实成员 · 每个人都是主角</p>
        </div>
      </section>

      <div className="lj-glow-line" />

      <section style={{ paddingTop: 64 }}>
        <div className="lj-members-grid">
          {loading && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#6b7280' }}>加载成员中...</div>}
          {!loading && members.length === 0 && (
            <div className="lj-members-empty">
              还没有注册成员。注册账号并在个人资料中完善信息后，就会出现在这里。
            </div>
          )}
          {!loading && members.map((m) => (
            <div className="lj-member-card" key={m.id || m.name}>
              <div className="lj-chibi-avatar lj-member-avatar" style={m.avatar ? { background: 'var(--lj-surface-2)' } : undefined}>
                {m.avatar ? (
                  <img className="lj-member-avatar-img" src={m.avatar} alt={m.name} loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none' }} />
                ) : (
                  <ChibiFace />
                )}
              </div>
              <div className="lj-member-name">{m.name}</div>
              {m.nickname && m.nickname !== m.name && (
                <div className="lj-member-nickname">"{m.username || m.nickname}"</div>
              )}
              <span className={`lj-member-dept-tag ${m.role === 'admin' ? 'admin' : 'member'}`}>
                {m.role === 'admin' ? '管理员' : '成员'}
              </span>
              <div className="lj-member-bio">{m.bio || '这位成员还没有留下自我介绍'}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Members