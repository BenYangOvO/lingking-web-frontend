import { useEffect, useCallback } from 'react'
import { Modal, ModalContent, ModalBody, Button, Chip } from '@heroui/react'
import { X, ChevronLeft, ChevronRight, Heart, User, Tag, FileImage } from 'lucide-react'
import '../styles/components/photo-detail.css'

/**
 * 通用作品详情 Lightbox (升级 HeroUI Modal)
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
  const handleClose = useCallback(() => {
    if (typeof onClose === 'function') onClose()
  }, [onClose])

  const hasList = Array.isArray(list) && list.length > 0 && currentIndex !== null && Number.isFinite(currentIndex)
  const canPrev = hasList && (typeof onPrev === 'function' || currentIndex > 0)
  const canNext = hasList && (typeof onNext === 'function' || currentIndex < list.length - 1)

  const handlePrev = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    if (typeof onPrev === 'function') return onPrev()
  }, [onPrev])

  const handleNext = useCallback((e) => {
    if (e && e.stopPropagation) e.stopPropagation()
    if (typeof onNext === 'function') return onNext()
  }, [onNext])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft' && canPrev) handlePrev(e)
      else if (e.key === 'ArrowRight' && canNext) handleNext(e)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [open, canPrev, canNext, handlePrev, handleNext])

  if (!photo) return null

  const imgSrc = photo.image ? String(photo.image).trim() : ''
  const isValidImg = !!imgSrc && (imgSrc.startsWith('/') || imgSrc.startsWith('http://') || imgSrc.startsWith('https://') || imgSrc.startsWith('data:'))

  let mediaEl = null
  if (isValidImg) {
    mediaEl = (
      <img
        src={imgSrc}
        alt={photo.title || '作品图片'}
        className="lj-pd-image"
        draggable={false}
        onError={(e) => {
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
    <Modal
      isOpen={open}
      onClose={handleClose}
      size="5xl"
      backdrop="blur"
      hideCloseButton
      classNames={{
        base: 'bg-[var(--lj-surface)] text-[var(--lj-ink)] border border-[var(--lj-surface-2)] shadow-2xl rounded-2xl overflow-hidden p-0 max-w-5xl',
        backdrop: 'bg-black/70 backdrop-blur-md',
      }}
    >
      <ModalContent>
        {() => (
          <ModalBody className="p-0 relative">
            {/* 左右切换按钮 */}
            {canPrev && (
              <Button
                isIconOnly
                radius="full"
                variant="flat"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm shadow-lg min-w-10 h-10"
                onClick={handlePrev}
                aria-label="上一张"
              >
                <ChevronLeft size={24} />
              </Button>
            )}
            {canNext && (
              <Button
                isIconOnly
                radius="full"
                variant="flat"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-black/50 text-white hover:bg-black/80 backdrop-blur-sm shadow-lg min-w-10 h-10"
                onClick={handleNext}
                aria-label="下一张"
              >
                <ChevronRight size={24} />
              </Button>
            )}

            {/* 右上角关闭按钮 */}
            <Button
              isIconOnly
              radius="full"
              variant="flat"
              className="absolute right-3 top-3 z-50 bg-black/40 text-white hover:bg-black/70 min-w-8 h-8"
              onClick={handleClose}
              aria-label="关闭"
            >
              <X size={18} />
            </Button>

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
                  <Chip size="sm" variant="flat" className="lj-pd-counter bg-black/60 text-white border-0">
                    {currentIndex + 1} / {list.length}
                  </Chip>
                )}
              </div>

              {/* 右：详情信息面板 */}
              <div className="lj-pd-info">
                {photo.cat && (
                  <div className="mb-2">
                    <Chip size="sm" color="primary" variant="flat" startContent={<Tag size={12} />}>
                      {photo.cat}
                    </Chip>
                  </div>
                )}

                <h2 className="lj-pd-title">{photo.title || '未命名作品'}</h2>

                <div className="lj-pd-author-row">
                  <div className="lj-pd-author">
                    <User size={16} />
                    <span>作者：{photo.author || '匿名'}</span>
                  </div>
                  <div className="lj-pd-likes text-rose-500">
                    <Heart size={16} className="fill-current" />
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
                  <div className="lj-pd-mobile-nav flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="flat"
                      onClick={handlePrev}
                      isDisabled={!canPrev}
                      startContent={<ChevronLeft size={16} />}
                      className="flex-1"
                    >
                      上一张
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      onClick={handleNext}
                      isDisabled={!canNext}
                      endContent={<ChevronRight size={16} />}
                      className="flex-1"
                    >
                      下一张
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>
        )}
      </ModalContent>
    </Modal>
  )
}
