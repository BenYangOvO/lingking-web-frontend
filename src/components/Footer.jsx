import { Link } from 'react-router-dom'
import { Button, Tooltip } from '@heroui/react'
import { Instagram, Twitter, Youtube } from 'lucide-react'

const QUICK_LINKS = [
  { to: '/gallery', label: '作品展示' },
  { to: '/resources', label: '资源库' },
  { to: '/history', label: '凌镜历史' },
  { to: '/diary', label: '日记本' },
  { to: '/departments', label: '部门介绍' },
  { to: '/about', label: '关于我们' },
]

const SOCIALS = [
  { icon: Instagram, label: 'Instagram' },
  { icon: Twitter, label: 'Twitter' },
  { icon: Youtube, label: 'YouTube' },
]

function Footer() {
  return (
    <footer className="lj-footer border-t border-[var(--lj-surface-2)] bg-[var(--lj-surface)] py-12 px-4">
      <div className="lj-footer-inner max-w-6xl mx-auto">
        <div className="lj-footer-grid grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="lj-footer-logo text-2xl font-bold text-[var(--lj-brand)] mb-3">凌镜</div>
            <p className="lj-footer-tagline text-xs text-default-400 leading-relaxed">
              用镜头记录世界，用光影讲述故事。
              <br />
              凌镜摄影社团，与你一起发现美的瞬间。
            </p>
          </div>

          <div>
            <div className="lj-footer-heading font-bold text-sm mb-3">快速链接</div>
            <ul className="lj-footer-links grid grid-cols-2 gap-2 text-xs text-default-400">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-[var(--lj-brand)] transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="lj-footer-heading font-bold text-sm mb-3">联系我们</div>
            <div className="lj-footer-contact text-xs text-default-400 flex flex-col gap-1">
              <p>邮箱：lingjing@photo.club</p>
              <p>微信公众号：凌镜摄影</p>
              <p>微博：@凌镜摄影社团</p>
              <div className="flex items-center gap-2 mt-3">
                {SOCIALS.map((s) => (
                  <Tooltip key={s.label} content={s.label}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      className="bg-[var(--lj-surface-2)] text-default-400 hover:text-[var(--lj-brand)] min-w-8 h-8 rounded-lg"
                      aria-label={s.label}
                    >
                      <s.icon size={16} />
                    </Button>
                  </Tooltip>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lj-footer-bottom text-center text-xs text-default-400 border-t border-[var(--lj-surface-2)] pt-6">
          &copy; 2018 - 2026 凌镜摄影社团 All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer