import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Button, Chip, Spinner } from '@heroui/react'
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
  const [detailIdx, setDetailIdx] = useState(null)

  useEffect(() => {
    api('/photos').then((data) => {
      setPhotos(data.photos || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const filtered = filter === '全部' ? photos : photos.filter((p) => p.cat === filter)

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

  const switchFilter = (f) => {
    setFilter(f)
    setVisible(9)
    if (id) navigate('/gallery')
    else setDetailIdx(null)
  }

  const buildBackground = (photo) => {
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

      <div className="lj-filter-bar flex flex-wrap items-center justify-center gap-2 my-6">
        {FILTERS.map((f) => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? 'solid' : 'flat'}
            color={filter === f ? 'primary' : 'default'}
            className={`rounded-full px-4 text-xs font-medium transition-all ${
              filter !== f ? 'bg-[var(--lj-surface-2)] text-[var(--lj-ink-2)] hover:bg-[var(--lj-surface)]' : 'shadow-md shadow-indigo-500/20'
            }`}
            onClick={() => switchFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      <div className="lj-masonry-grid">
        {loading && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3 text-default-400">
            <Spinner color="primary" label="加载作品中..." size="lg" />
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-default-400">暂无作品</div>
        )}
        {!loading && filtered.slice(0, visible).map((p, idx) => (
          <Link
            to={`/gallery/${p.uuid || p.id}`}
            className="lj-photo-card group"
            key={p.uuid || p.id || p.title}
            title="点击查看作品详情"
            style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
          >
            <div className="lj-photo-card-img" style={getStyle(p, idx)}>
              <div className="lj-photo-view-icon">
                <ZoomIn size={20} />
              </div>
              <div className="lj-photo-card-overlay">
                <div className="lj-photo-card-title">{p.title}</div>
                <div className="lj-photo-card-meta flex items-center justify-between">
                  <span className="lj-photo-card-author">{p.author}</span>
                  <Chip
                    size="sm"
                    variant="flat"
                    className="bg-black/40 text-rose-300 border-0"
                    startContent={<Heart size={12} className="fill-current" />}
                  >
                    {p.likes}
                  </Chip>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visible < filtered.length && (
        <div className="lj-load-more-wrap text-center my-8">
          <Button
            size="lg"
            color="primary"
            variant="flat"
            className="px-8 font-medium rounded-full"
            onClick={() => setVisible((v) => v + 9)}
            endContent={<ChevronDown size={18} />}
          >
            加载更多作品
          </Button>
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