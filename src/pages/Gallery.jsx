import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ChevronDown } from 'lucide-react'
import '../styles/pages/gallery.css'

const PHOTOS = [
  { title: '晨光中的城市', author: '张明远', likes: 128, cat: '风光', bg: 'aspect-ratio:3/4;background:linear-gradient(160deg,#1E3A5F,#2D5F8A,#4A90D9,#6AADE8);' },
  { title: '雨后巷弄', author: '李思琪', likes: 96, cat: '街拍', bg: 'aspect-ratio:1/1;background:linear-gradient(135deg,#0F766E,#14B8A6,#5EEAD4);' },
  { title: '星空下的远山', author: '王浩宇', likes: 214, cat: '风光', bg: 'aspect-ratio:4/5;background:linear-gradient(145deg,#1E1B4B,#312E81,#4F46E5,#818CF8);' },
  { title: '秋日暖阳', author: '陈雨薇', likes: 87, cat: '风光', bg: 'aspect-ratio:3/2;background:linear-gradient(170deg,#78350F,#B45309,#F59E0B,#FCD34D);' },
  { title: '海边的黄昏', author: '林子涵', likes: 175, cat: '风光', bg: 'aspect-ratio:2/3;background:linear-gradient(150deg,#0C4A6E,#0284C7,#38BDF8,#7DD3FC);' },
  { title: '老街记忆', author: '赵一凡', likes: 143, cat: '纪实', bg: 'aspect-ratio:1/1;background:linear-gradient(130deg,#1C1917,#44403C,#78716C,#A8A29E);' },
  { title: '光影交错', author: '周思远', likes: 109, cat: '创意', bg: 'aspect-ratio:4/3;background:linear-gradient(155deg,#7C2D12,#C2410C,#FB923C,#FDBA74);' },
  { title: '静物之美', author: '孙晓婷', likes: 76, cat: '纪实', bg: 'aspect-ratio:3/4;background:linear-gradient(140deg,#134E4A,#0D9488,#2DD4BF,#99F6E4);' },
  { title: '霓虹夜色', author: '黄乐天', likes: 201, cat: '创意', bg: 'aspect-ratio:1/1;background:linear-gradient(165deg,#3B0764,#7E22CE,#A855F7,#C084FC);' },
  { title: '山间云海', author: '吴昊然', likes: 162, cat: '风光', bg: 'aspect-ratio:3/5;background:linear-gradient(135deg,#14532D,#16A34A,#4ADE80,#86EFAC);' },
  { title: '城市天际线', author: '郑雨萱', likes: 135, cat: '建筑', bg: 'aspect-ratio:16/9;background:linear-gradient(125deg,#1E3A5F,#4A90D9,#7DD3FC,#BAE6FD);' },
  { title: '花间人像', author: '刘诗雅', likes: 188, cat: '人像', bg: 'aspect-ratio:4/5;background:linear-gradient(148deg,#881337,#E11D48,#FB7185,#FDA4AF);' },
]

const FILTERS = ['全部', '风光', '人像', '街拍', '纪实', '创意', '建筑']

function Gallery() {
  const [filter, setFilter] = useState('全部')
  const [visible, setVisible] = useState(9)

  const filtered = filter === '全部' ? PHOTOS : PHOTOS.filter((p) => p.cat === filter)

  return (
    <>
      <section className="lj-page-header">
        <div className="lj-page-header-inner">
          <div className="lj-breadcrumb">
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <span className="current">作品展示</span>
          </div>
          <h1 className="lj-page-title">作品展示</h1>
          <p className="lj-page-subtitle">探索凌镜成员的精彩摄影作品</p>
        </div>
      </section>

      <div className="lj-filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`lj-filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => {
              setFilter(f)
              setVisible(9)
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="lj-masonry-grid">
        {filtered.slice(0, visible).map((p) => (
          <div className="lj-photo-card" key={p.title}>
            <div className="lj-photo-card-img" style={{ ...parseStyle(p.bg) }}>
              <div className="lj-photo-card-overlay">
                <div className="lj-photo-card-title">{p.title}</div>
                <div className="lj-photo-card-meta">
                  <span className="lj-photo-card-author">{p.author}</span>
                  <span className="lj-photo-card-likes">
                    <Heart style={{ width: 13, height: 13 }} /> {p.likes}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {visible < filtered.length && (
        <div className="lj-load-more-wrap">
          <button className="lj-btn-secondary" style={{ padding: '12px 32px', fontSize: 15 }} onClick={() => setVisible((v) => v + 9)}>
            加载更多作品
            <ChevronDown style={{ width: 15, height: 15 }} />
          </button>
        </div>
      )}
    </>
  )
}

function parseStyle(str) {
  const obj = {}
  for (const part of str.split(';')) {
    if (!part.trim()) continue
    const idx = part.indexOf(':')
    if (idx > -1) obj[part.slice(0, idx).trim()] = part.slice(idx + 1).trim()
  }
  return obj
}

export default Gallery