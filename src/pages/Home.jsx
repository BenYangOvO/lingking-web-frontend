import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Image,
  UserPlus,
  ChevronDown,
  ArrowRight,
  Camera,
  Monitor,
  Megaphone,
} from 'lucide-react'
import { api } from '../api'

const STATS = [
  { value: '200+', label: '成员人数' },
  { value: '30+', label: '年度活动' },
  { value: '500+', label: '精选作品' },
  { value: '2018', label: '成立年份' },
]

const DEPT_ICONS = { '摄影部': Camera, '技术部': Monitor, '宣传部': Megaphone }

function cardBg(item) {
  if (item && item.image) {
    const src = String(item.image).trim()
    if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
      return {
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    }
  }
  const g = String(item?.grad || '').trim()
  const grad = g.startsWith('linear-gradient') ? g : `linear-gradient(135deg, ${g || '#2D5F8A,#4A90D9,#6AADE8'})`
  return { background: grad, backgroundSize: 'cover', backgroundPosition: 'center' }
}

function Home() {
  const [photos, setPhotos] = useState([])
  const [depts, setDepts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api('/photos'), api('/departments')]).then(([p, d]) => {
      setPhotos((p.photos || []).slice(0, 3))
      setDepts(d.departments || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])
  return (
    <>
      {/* Hero */}
      <section className="lj-hero">
        <h1 className="lj-hero-title">凌镜</h1>
        <p className="lj-hero-subtitle">用镜头记录世界，用光影讲述故事</p>
        <div className="lj-hero-ctas">
          <Link to="/gallery" className="lj-btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>
            <Image style={{ width: 16, height: 16 }} />
            探索作品
          </Link>
          <Link to="/about" className="lj-btn-secondary" style={{ padding: '12px 28px', fontSize: 15 }}>
            <UserPlus style={{ width: 16, height: 16 }} />
            加入我们
          </Link>
        </div>
        <div className="lj-scroll-indicator">
          <ChevronDown style={{ width: 24, height: 24 }} />
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* Featured Works */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <h2 className="lj-section-title">精选作品</h2>
          <div className="lj-featured-grid">
            {loading && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#6b7280' }}>加载中...</div>}
            {!loading && photos.map((w) => (
              <div className="lj-featured-card" key={w.id || w.title}>
                <div className="lj-featured-card-img" style={cardBg(w)} />
                <div className="lj-featured-card-body">
                  <h3 className="lj-featured-card-title">{w.title}</h3>
                  <div className="lj-featured-card-meta">
                    <span className="lj-featured-card-author">摄影：{w.author}</span>
                    <span className="lj-tag">{w.cat}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/gallery" className="lj-btn-secondary">
              查看全部作品
              <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* Club Intro */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <div className="lj-intro-grid">
            <div>
              <h2 className="lj-section-title" style={{ marginBottom: 24 }}>
                关于凌镜
              </h2>
              <div className="lj-intro-body">
                <p style={{ marginBottom: 16 }}>
                  凌镜摄影社团成立于2018年，是一个由热爱摄影的同学自发组织的校园社团。我们相信每一张照片都承载着独特的故事，每一次按下快门都是对美好瞬间的致敬。
                </p>
                <p style={{ marginBottom: 16 }}>
                  社团汇聚了来自不同专业、不同背景的摄影爱好者，从初学者到资深摄影师，在这里共同学习、创作与成长。我们定期举办摄影讲座、外拍活动、作品展览和主题沙龙，为每一位成员提供展示才华的舞台。
                </p>
                <p>
                  无论你使用的是专业相机还是手机，只要你对光影有热情，凌镜都欢迎你的加入。让我们一起，用镜头记录生活中的每一个精彩瞬间。
                </p>
              </div>
            </div>
            <div>
              <div className="lj-stats-grid">
                {STATS.map((s) => (
                  <div className="lj-stat-card" key={s.label}>
                    <div className="lj-stat-number">{s.value}</div>
                    <div className="lj-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="lj-glow-line" />

      {/* Departments Preview */}
      <section className="lj-section">
        <div className="lj-section-inner">
          <h2 className="lj-section-title">部门一览</h2>
          <div className="lj-dept-grid">
            {loading && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#6b7280' }}>加载中...</div>}
            {!loading && depts.map((d) => {
              const IconComp = DEPT_ICONS[d.name] || Camera
              return (
                <div className="lj-dept-card" key={d.id || d.name}>
                  <div className="lj-dept-icon">
                    <IconComp style={{ width: 22, height: 22 }} />
                  </div>
                  <h3 className="lj-dept-name">{d.name}</h3>
                  <p className="lj-dept-desc">{d.desc}</p>
                  <div className="lj-dept-count">成员 {d.count}+ 人</div>
                </div>
              )
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/departments" className="lj-btn-secondary">
              了解更多部门
              <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home