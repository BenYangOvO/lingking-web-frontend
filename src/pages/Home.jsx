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

const FEATURED_WORKS = [
  {
    title: '晨光中的城市',
    author: '张明远',
    tag: '城市风光',
    bg: 'linear-gradient(135deg, #2D5F8A, #4A90D9, #6AADE8)',
  },
  {
    title: '雨后巷弄',
    author: '李思琪',
    tag: '街拍纪实',
    bg: 'linear-gradient(135deg, #3670B0, #4A90D9, #81B4E8)',
  },
  {
    title: '星空下的远山',
    author: '王浩宇',
    tag: '自然风景',
    bg: 'linear-gradient(135deg, #2A4D7A, #4A90D9, #5BA3E0)',
  },
]

const STATS = [
  { value: '200+', label: '成员人数' },
  { value: '30+', label: '年度活动' },
  { value: '500+', label: '精选作品' },
  { value: '2018', label: '成立年份' },
]

const DEPARTMENTS = [
  {
    icon: Camera,
    name: '摄影部',
    desc: '负责社团核心摄影创作，包括外拍活动策划、主题拍摄项目以及日常创作交流。从人像到风光，从纪实到创意，这里汇聚了社团最活跃的摄影师。',
    count: '成员 80+ 人',
  },
  {
    icon: Monitor,
    name: '技术部',
    desc: '专注于后期处理、视频剪辑与新媒体技术。提供 Lightroom、Photoshop、Premiere 等软件的教学与指导，助力成员提升作品品质。',
    count: '成员 60+ 人',
  },
  {
    icon: Megaphone,
    name: '宣传部',
    desc: '负责社团品牌运营与对外宣传，包括社交媒体管理、活动文案撰写、海报设计与线上展览策划，是社团对外发声的重要窗口。',
    count: '成员 55+ 人',
  },
]

function Home() {
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
            {FEATURED_WORKS.map((w) => (
              <div className="lj-featured-card" key={w.title}>
                <div className="lj-featured-card-img" style={{ background: w.bg }} />
                <div className="lj-featured-card-body">
                  <h3 className="lj-featured-card-title">{w.title}</h3>
                  <div className="lj-featured-card-meta">
                    <span className="lj-featured-card-author">摄影：{w.author}</span>
                    <span className="lj-tag">{w.tag}</span>
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
            {DEPARTMENTS.map((d) => (
              <div className="lj-dept-card" key={d.name}>
                <div className="lj-dept-icon">
                  <d.icon style={{ width: 22, height: 22 }} />
                </div>
                <h3 className="lj-dept-name">{d.name}</h3>
                <p className="lj-dept-desc">{d.desc}</p>
                <div className="lj-dept-count">{d.count}</div>
              </div>
            ))}
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