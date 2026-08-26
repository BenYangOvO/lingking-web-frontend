import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import '../styles/pages/members.css'

const DEPT_CLASS_MAP = { '摄影部': 'photo', '技术部': 'tech', '宣传部': 'media' }

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
          <p className="lj-page-subtitle">漫画风格Q版 · 每个人都是主角</p>
        </div>
      </section>

      <div className="lj-glow-line" />

      <section style={{ paddingTop: 64 }}>
        <div className="lj-members-grid">
          {loading && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#6b7280' }}>加载成员中...</div>}
          {!loading && members.map((m) => (
            <div className="lj-member-card" key={m.id || m.name}>
              <div className="lj-chibi-avatar" style={{ background: m.bg, color: m.color }}>
                <ChibiFace happy={m.happy} smile={m.smile} />
              </div>
              <div className="lj-member-name">{m.name}</div>
              <div className="lj-member-nickname">"{m.nickname}"</div>
              <span className={`lj-member-dept-tag ${DEPT_CLASS_MAP[m.dept] || 'photo'}`}>{m.dept}</span>
              <div className="lj-member-bio">{m.bio}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Members