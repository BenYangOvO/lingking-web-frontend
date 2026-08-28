import { useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, Heart, User, Tag, FileImage } from 'lucide-react'
import '../styles/components/photo-detail.css'

/**
 * 通用作品详情 Lightbox
 * props:
 *   open: bool
 *   photo: 当前展示的照片对象 {title, author, cat, desc, image, grad, likes}
 *   list: 照片数组（可选，用于左右切换；若有则会显示切换按钮）
 *   currentIndex: 当前照片在 list 中的索引（可选，需和 list 一起传）
 *   onClose: () => void
 *   onPrev / onNext: 可选，自定义切换；若未传但提供了 list+currentIndex，则内部切换
 */
export default function PhotoDetail({
  open,
  photo,
  list = null,
  currentIndex = null,
  onClose,
  onPrev,
  onNext,
}) {
  // 关闭时的安全回调
  const handleClose = useCallback(() => {
    if (typeof onClose === 'function') onClose()
  }, [onClose])

  // 内部计算切换
  const hasList = Array.isArray(list) && list.length > 0 && currentIndex !== null && Number.isFinite(currentIndex)
  const canPrev = hasList && (typeof onPrev === 'function' || currentIndex > 0)
  const canNext = hasList && (typeof onNext === 'function' || currentIndex < list.length - 1)

  const handlePrev = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    if (typeof onPrev === 'function') return onPrev()
    if (hasList && currentIndex > 0) {
      // 不控制 state，通过回调给外层（由外层 onPrev / onNext 传进来）
    }
  }, [onPrev, hasList, currentIndex])

  const handleNext = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    if (typeof onNext === 'function') return onNext()
  }, [onNext])

  // ESC 关闭 + 键盘左右切换 + body 滚动锁
  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose()
      else if (e.key === 'ArrowLeft' && canPrev) handlePrev(e)
      else if (e.key === 'ArrowRight' && canNext) handleNext(e)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, handleClose, canPrev, canNext, handlePrev, handleNext])

  if (!open || !photo) return null

  // 构建图片显示：优先真实图片，否则用渐变背景
  let mediaEl = null
  const imgSrc = photo.image ? String(photo.image).trim() : ''
  const isValidImg = !!imgSrc && (imgSrc.startsWith('/') || imgSrc.startsWith('http://') || imgSrc.startsWith('https://') || imgSrc.startsWith('data:'))

  if (isValidImg) {
    mediaEl = (
      <img
        src={imgSrc}
        alt={photo.title || '作品图片'}
        className="lj-pd-image"
        draggable={false}
        onError={(e) => {
          // 图片加载失败降级为渐变背景
          const target = e.currentTarget
          target.style.display = 'none'
          const nextSib = target.nextElementSibling
          if (nextSib && nextSib.classList.contains('lj-pd-image-fallback')) {
            nextSib.style.display = 'block'
          }
        }}
      />
    )
  }

  const g = String(photo.grad || '').trim()
  const gradCss = g.startsWith('linear-gradient') ? g : `linear-gradient(135deg, ${g || '#2D5F8A,#4A90D9,#6AADE8'})`
  const fallbackStyle = {
    background: gradCss,
    display: isValidImg ? 'none' : 'block',
  }

  return (
    <div className="lj-pd-overlay" onClick={handleClose} role="dialog" aria-modal="true" aria-label="作品详情">
      {/* 左右切换按钮（仅在 Gallery 有 list 时显示） */}
      {canPrev && (
        <button
          type="button"
          className="lj-pd-nav lj-pd-nav-prev"
          onClick={handlePrev}
          aria-label="上一张"
        >
          <ChevronLeft style={{ width: 28, height: 28 }} />
        </button>
      )}
      {canNext && (
        <button
          type="button"
          className="lj-pd-nav lj-pd-nav-next"
          onClick={handleNext}
          aria-label="下一张"
        >
          <ChevronRight style={{ width: 28, height: 28 }} />
        </button>
      )}

      <div className="lj-pd-container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="lj-pd-close"
          onClick={handleClose}
          aria-label="关闭"
        >
          <X style={{ width: 22, height: 22 }} />
        </button>

        <div className="lj-pd-layout">
          {/* 左：图片 / 渐变区 */}
          <div className="lj-pd-media-wrap">
            {mediaEl}
            <div className="lj-pd-image-fallback lj-pd-image" style={fallbackStyle}>
              {!isValidImg && (
                <div className="lj-pd-fallback-hint">
                  <FileImage style={{ width: 56, height: 56, opacity: 0.5 }} />
                  <div style={{ marginTop: 12, color: '#94a3b8' }}>暂无图片，使用渐变预览</div>
                </div>
              )}
            </div>
            {hasList && (
              <div className="lj-pd-counter">{currentIndex + 1} / {list.length}</div>
            )}
          </div>

          {/* 右：详情信息面板 */}
          <div className="lj-pd-info">
            {photo.cat && (
              <div className="lj-pd-tag">
                <Tag style={{ width: 14, height: 14 }} />
                <span>{photo.cat}</span>
              </div>
            )}

            <h2 className="lj-pd-title">{photo.title || '未命名作品'}</h2>

            <div className="lj-pd-author-row">
              <div className="lj-pd-author">
                <User style={{ width: 16, height: 16 }} />
                <span>作者：{photo.author || '匿名'}</span>
              </div>
              <div className="lj-pd-likes">
                <Heart style={{ width: 16, height: 16 }} />
                <span>{photo.likes || 0} 喜欢</span>
              </div>
            </div>

            <div className="lj-pd-divider" />

            <div className="lj-pd-section-label">作品简介</div>
            <div className="lj-pd-desc">
              {photo.desc ? (
                photo.desc.split(/\r?\n/).map((line, i) => (
                  <p key={i} style={{ marginBottom: i === photo.desc.split(/\r?\n/).length - 1 ? 0 : 10 }}>
                    {line || '\u00A0'}
                  </p>
                ))
              ) : (
                <span className="lj-pd-empty">作者未提供简介</span>
              )}
            </div>

            {hasList && (
              <div className="lj-pd-mobile-nav">
                <button
                  type="button"
                  className="lj-btn-secondary"
                  onClick={handlePrev}
                  disabled={!canPrev}
                  style={{ opacity: canPrev ? 1 : 0.4 }}
                >
                  <ChevronLeft style={{ width: 16, height: 16 }} />
                  上一张
                </button>
                <button
                  type="button"
                  className="lj-btn-secondary"
                  onClick={handleNext}
                  disabled={!canNext}
                  style={{ opacity: canNext ? 1 : 0.4 }}
                >
                  下一张
                  <ChevronRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
