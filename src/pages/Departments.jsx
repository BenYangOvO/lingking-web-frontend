import { Link } from 'react-router-dom'
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
} from 'lucide-react'
import '../styles/pages/departments.css'

const DEPARTMENTS = [
  {
    icon: Camera,
    name: '摄影部',
    tag: '80+ 成员',
    desc: '负责社团核心摄影创作，组织外拍活动，策划影展。这里是每一个热爱摄影之人的主场，用镜头捕捉世界的每一个精彩瞬间。',
    responsibilities: [
      { icon: MapPin, label: '周常外拍' },
      { icon: Palette, label: '主题摄影' },
      { icon: Image, label: '影展策划' },
      { icon: Star, label: '作品评审' },
    ],
    stats: [
      { value: '200+', label: '年产出作品' },
      { value: '15+', label: '组织外拍' },
    ],
  },
  {
    icon: Cpu,
    name: '技术部',
    tag: '45+ 成员',
    desc: '网站开发维护，后期技术支持，器材技术指导。用技术赋能创作，让每一张作品都达到最佳呈现效果。',
    responsibilities: [
      { icon: Globe, label: '网站运维' },
      { icon: SlidersHorizontal, label: '后期教学' },
      { icon: Scan, label: '器材评测' },
      { icon: Share2, label: '技术分享' },
    ],
    stats: [
      { value: '50+', label: '技术教程' },
      { value: '3个', label: '维护项目' },
    ],
  },
  {
    icon: Megaphone,
    name: '宣传部',
    tag: '35+ 成员',
    desc: '品牌形象管理，社交媒体运营，活动宣传推广。让凌镜的声音传得更远，让更多人感受到摄影的魅力。',
    responsibilities: [
      { icon: Smartphone, label: '社媒运营' },
      { icon: PenTool, label: '海报设计' },
      { icon: Bell, label: '活动宣传' },
      { icon: Handshake, label: '品牌合作' },
    ],
    stats: [
      { value: '5000+', label: '粉丝' },
      { value: '100+', label: '海报' },
    ],
  },
]

function Departments() {
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
          <p className="lj-page-subtitle">三个核心部门，共同构成凌镜的灵魂</p>
        </div>
      </section>

      <div className="lj-dept-section">
        {DEPARTMENTS.map((d) => (
          <div className="lj-dept-card" key={d.name}>
            <div className="lj-dept-card-head">
              <div className="lj-dept-icon-wrap">
                <d.icon style={{ width: 22, height: 22 }} />
              </div>
              <div className="lj-dept-card-head-text">
                <div className="lj-dept-name">
                  {d.name}
                  <span className="lj-dept-count-tag">{d.tag}</span>
                </div>
                <p className="lj-dept-desc">{d.desc}</p>
              </div>
            </div>
            <div className="lj-dept-responsibilities">
              {d.responsibilities.map((r) => (
                <span className="lj-resp-tag" key={r.label}>
                  <r.icon style={{ width: 14, height: 14 }} /> {r.label}
                </span>
              ))}
            </div>
            <div className="lj-dept-stats">
              {d.stats.map((s) => (
                <div className="lj-dept-stat" key={s.label}>
                  <div className="lj-dept-stat-value">{s.value}</div>
                  <div className="lj-dept-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="lj-join-section">
        <div className="lj-join-card">
          <h2 className="lj-join-title">想加入我们？</h2>
          <p className="lj-join-desc">
            无论你是摄影新手还是技术达人，凌镜都有属于你的位置。我们每学期初开放招新，欢迎关注我们的公众号获取最新招募信息。加入凌镜，和志同道合的伙伴一起成长。
          </p>
          <div className="lj-join-actions">
            <Link to="/about" className="lj-btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>
              了解招新详情
            </Link>
            <Link to="/about" className="lj-btn-secondary" style={{ padding: '12px 28px', fontSize: 15 }}>
              联系我们
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Departments