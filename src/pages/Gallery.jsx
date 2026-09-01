import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Heart, ChevronDown, ZoomIn } from 'lucide-react'
import { api } from '../api'
import PhotoDetail from '../components/PhotoDetail'
import '../styles/pages/gallery.css'

const FILTERS = ['全部', '风光', '人像', '街拍', '纪实', '创意', '建筑']

const PHOTO_ASPECTS = ['3/4', '1/1', '4/5', '3/2', '2/3', '1/1', '4/3', '3/4', '1/1', '3/5', '16/9', '4/5']

function Gallery() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [photos, setPhotos] = useState([])
  const [filter, setFilter] = useState('全部')
  const [visible, setVisible] = useState(9)
  const [loading, setLoading] = useState(true)
  const [detailIdx, setDetailIdx] = useState(null) // 当前打开的作品在 filtered 数组中的索引；null 表示关闭

  useEffect(() => {
    api('/photos').then((data) => {
      setPhotos(data.photos || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = filter === '全部' ? photos : photos.filter((p) => p.cat === filter)

  // 当 URL 中带有 :id 时，自动在列表中匹配并打开详情；无 :id 时关闭
  useEffect(() => {
    if (!id) {
      setDetailIdx(null)
      return
    }
    if (photos.length > 0) {
      const idx = filtered.findIndex((p) => String(p.uuid) === String(id) || String(p.id) === String(id) || String(p.submission_id) === String(id))
      if (idx !== -1) {
        setDetailIdx(idx)
      } else {
        const allIdx = photos.findIndex((p) => String(p.uuid) === String(id) || String(p.id) === String(id) || String(p.submission_id) === String(id))
        if (allIdx !== -1) {
          setFilter('全部')
          setDetailIdx(allIdx)
        }
      }
    }
  }, [id, photos, filter])

  // 切换分类
  const switchFilter = (f) => {
    setFilter(f)
    setVisible(9)
    if (id) navigate('/gallery')
    else setDetailIdx(null)
  }

  const buildBackground = (photo) => {
    // 1. 优先使用用户上传的真实图片（投稿通过 /uploads/xxx 路径，静态作品也可能带 http 外链）
    if (photo.image) {
      const src = String(photo.image).trim()
      if (src.startsWith('/') || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
        return {
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      }
    }
    // 2. 回退渐变：静态 grad 是颜色列表 "#A,#B,#C"；投稿 grad 是完整 "linear-gradient(135deg, ...)"
    const g = String(photo.grad || '').trim()
    const gradCss = g.startsWith('linear-gradient') ? g : `linear-gradient(135deg, ${g || '#2D5F8A,#4A90D9,#6AADE8'})`
    return {
      background: gradCss,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }

  const getStyle = (photo, idx) => {
    const aspect = PHOTO_ASPECTS[idx % PHOTO_ASPECTS.length]
    return {
      aspectRatio: aspect,
      ...buildBackground(photo),
    }
  }

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
            onClick={() => switchFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="lj-masonry-grid">
        {loading && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#6b7280' }}>加载作品中...</div>}
        {!loading && filtered.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40, color: '#6b7280' }}>暂无作品</div>}
        {!loading && filtered.slice(0, visible).map((p, idx) => (
          <div
            className="lj-photo-card"
            key={p.uuid || p.id || p.title}
            onClick={() => navigate(`/gallery/${p.uuid || p.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/gallery/${p.uuid || p.id}`) } }}
            title="点击查看作品详情"
          >
            <div className="lj-photo-card-img" style={getStyle(p, idx)}>
              <div className="lj-photo-view-icon">
                <ZoomIn style={{ width: 20, height: 20 }} />
              </div>
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

      <PhotoDetail
        open={detailIdx !== null && detailIdx >= 0 && detailIdx < filtered.length}
        photo={detailIdx !== null ? filtered[detailIdx] : null}
        list={filtered}
        currentIndex={detailIdx ?? 0}
        onClose={() => navigate('/gallery')}
        onPrev={() => {
          if (detailIdx !== null && detailIdx > 0) {
            const prevItem = filtered[detailIdx - 1]
            navigate(`/gallery/${prevItem.uuid || prevItem.id}`)
          }
        }}
        onNext={() => {
          if (detailIdx !== null && detailIdx < filtered.length - 1) {
            const nextItem = filtered[detailIdx + 1]
            navigate(`/gallery/${nextItem.uuid || nextItem.id}`)
          }
        }}
      />
    </>
  )
}

export default Gallery