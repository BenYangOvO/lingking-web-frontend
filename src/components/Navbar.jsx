import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, LogIn, UserPlus, LogOut, PenLine, Shield, Crown, UserCircle2, Sun, Moon, Sparkles } from 'lucide-react'
import { isLoggedIn, getUsername, logout, onAuthChange, isAdmin } from '../auth'
import { getTheme, toggleTheme, getParticlesEnabled, toggleParticles, onPrefsChange } from '../prefs'

const NAV_LINKS = [
  { to: '/', label: '首页', domId: 'nav-home' },
  { to: '/gallery', label: '作品展示', domId: 'nav-gallery' },
  { to: '/resources', label: '资源库', domId: 'nav-resources' },
  { to: '/history', label: '凌镜历史' },
  { to: '/diary', label: '日记本' },
  { to: '/departments', label: '部门介绍' },
  { to: '/members', label: '成员' },
  { to: '/studio', label: '工作室' },
  { to: '/about', label: '关于' },
]

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userInfo, setUserInfo] = useState({ loggedIn: false, username: null, role: 'member' })
  const [theme, setThemeState] = useState(getTheme())
  const [particlesOn, setParticlesOn] = useState(getParticlesEnabled())
  const navigate = useNavigate()

  useEffect(() => {
    const sync = (info) => setUserInfo(info || { loggedIn: isLoggedIn(), username: getUsername(), role: isAdmin() ? 'admin' : 'member' })
    const unsubAuth = onAuthChange(sync)
    // 订阅主题/粒子开关变化（Navbar 内切换后同步按钮图标状态）
    const unsubPrefs = onPrefsChange(() => {
      setThemeState(getTheme())
      setParticlesOn(getParticlesEnabled())
    })
    return () => { unsubAuth(); unsubPrefs() }
  }, [])

  const handleToggleTheme = () => {
    toggleTheme()
    setThemeState(getTheme())
  }

  const handleToggleParticles = () => {
    toggleParticles()
    setParticlesOn(getParticlesEnabled())
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const { loggedIn, username, role } = userInfo

  return (
    <nav className="lj-nav">
      <div className="lj-nav-inner">
        <Link to="/" className="lj-nav-logo">
          凌镜
        </Link>

        <ul className={`lj-nav-links${menuOpen ? ' open' : ''}`}>
          {NAV_LINKS.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="lj-nav-actions">
          {/* 主题切换：白色简约版 / 深色原版 */}
          <button
            className="lj-btn-secondary lj-nav-toggle"
            onClick={handleToggleTheme}
            title={theme === 'light' ? '切换回深色原版' : '切换白色简约版'}
            aria-label="切换主题"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          {/* 鼠标粒子拖曳效果开关 */}
          <button
            className={`lj-btn-secondary lj-nav-toggle${particlesOn ? ' lj-nav-toggle-on' : ''}`}
            onClick={handleToggleParticles}
            title={particlesOn ? '关闭鼠标粒子拖曳效果' : '开启鼠标粒子拖曳效果'}
            aria-label="切换鼠标粒子效果"
          >
            <Sparkles size={16} />
          </button>
          {loggedIn ? (
            <>
              <span className="lj-nav-user" title={username}>
                {role === 'admin' && (
                  <Crown size={14} style={{ color: '#FBBF24', marginRight: 4, verticalAlign: '-2px' }} />
                )}
                {username}
              </span>
              <Link to="/submit" className="lj-btn-secondary" onClick={() => setMenuOpen(false)} title="投稿">
                <PenLine size={16} />
              </Link>
              {role === 'admin' && (
                <Link to="/admin" className="lj-btn-secondary" onClick={() => setMenuOpen(false)} title="审核后台">
                  <Shield size={16} />
                </Link>
              )}
              <Link to="/profile" className="lj-btn-secondary" onClick={() => setMenuOpen(false)} title="个人资料">
                <UserCircle2 size={16} />
              </Link>
              <button className="lj-btn-secondary" onClick={handleLogout} title="退出登录">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" className="lj-btn-secondary" onClick={() => setMenuOpen(false)}>
                <LogIn size={16} style={{ width: 16, height: 16 }} />
                登录
              </Link>
              <Link to="/auth" className="lj-btn-primary" onClick={() => setMenuOpen(false)}>
                <UserPlus size={16} style={{ width: 16, height: 16 }} />
                注册
              </Link>
            </>
          )}
          <button
            className="lj-nav-hamburger"
            aria-label="菜单"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu style={{ width: 22, height: 22 }} />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
