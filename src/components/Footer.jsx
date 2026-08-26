import { Link } from 'react-router-dom'
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
    <footer className="lj-footer">
      <div className="lj-footer-inner">
        <div className="lj-footer-grid">
          <div>
            <div className="lj-footer-logo">凌镜</div>
            <p className="lj-footer-tagline">
              用镜头记录世界，用光影讲述故事。
              <br />
              凌镜摄影社团，与你一起发现美的瞬间。
            </p>
          </div>

          <div>
            <div className="lj-footer-heading">快速链接</div>
            <ul className="lj-footer-links">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="lj-footer-heading">联系我们</div>
            <div className="lj-footer-contact">
              <p>邮箱：lingjing@photo.club</p>
              <p>微信公众号：凌镜摄影</p>
              <p>微博：@凌镜摄影社团</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="lj-footer-social"
                    style={{ color: 'var(--lj-ink-3)', transition: 'color 160ms' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lj-brand)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--lj-ink-3)')}
                  >
                    <s.icon style={{ width: 18, height: 18 }} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lj-footer-bottom">&copy; 2018 - 2026 凌镜摄影社团 All Rights Reserved.</div>
      </div>
    </footer>
  )
}

export default Footer