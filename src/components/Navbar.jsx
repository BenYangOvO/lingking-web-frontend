import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Button, Tooltip } from '@heroui/react'
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

        <div className="lj-nav-actions flex items-center gap-2">
          {/* 主题切换按钮 */}
          <Tooltip content={theme === 'light' ? '切换回深色原版' : '切换白色简约版'}>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              className="bg-[var(--lj-surface-2)] text-[var(--lj-ink)] hover:bg-[var(--lj-surface)] min-w-8 h-8 rounded-lg"
              onClick={handleToggleTheme}
              aria-label="切换主题"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </Button>
          </Tooltip>

          {/* 粒子效果开关 */}
          <Tooltip content={particlesOn ? '关闭鼠标粒子拖曳效果' : '开启鼠标粒子拖曳效果'}>
            <Button
              isIconOnly
              size="sm"
              variant={particlesOn ? 'solid' : 'flat'}
              color={particlesOn ? 'primary' : 'default'}
              className={`min-w-8 h-8 rounded-lg ${
                !particlesOn ? 'bg-[var(--lj-surface-2)] text-[var(--lj-ink)] hover:bg-[var(--lj-surface)]' : ''
              }`}
              onClick={handleToggleParticles}
              aria-label="切换鼠标粒子效果"
            >
              <Sparkles size={16} />
            </Button>
          </Tooltip>

          {loggedIn ? (
            <>
              <div className="lj-nav-user flex items-center gap-1 font-medium text-sm text-[var(--lj-ink)] px-2">
                {role === 'admin' && (
                  <Crown size={14} className="text-amber-400 inline-block" />
                )}
                <span>{username}</span>
              </div>

              <Tooltip content="投稿">
                <Button
                  as={Link}
                  to="/submit"
                  isIconOnly
                  size="sm"
                  variant="flat"
                  className="bg-[var(--lj-surface-2)] text-[var(--lj-ink)] hover:bg-[var(--lj-surface)] min-w-8 h-8 rounded-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  <PenLine size={16} />
                </Button>
              </Tooltip>

              {role === 'admin' && (
                <Tooltip content="审核后台">
                  <Button
                    as={Link}
                    to="/admin"
                    isIconOnly
                    size="sm"
                    variant="flat"
                    className="bg-[var(--lj-surface-2)] text-[var(--lj-ink)] hover:bg-[var(--lj-surface)] min-w-8 h-8 rounded-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Shield size={16} />
                  </Button>
                </Tooltip>
              )}

              <Tooltip content="个人资料">
                <Button
                  as={Link}
                  to="/profile"
                  isIconOnly
                  size="sm"
                  variant="flat"
                  className="bg-[var(--lj-surface-2)] text-[var(--lj-ink)] hover:bg-[var(--lj-surface)] min-w-8 h-8 rounded-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  <UserCircle2 size={16} />
                </Button>
              </Tooltip>

              <Tooltip content="退出登录">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="danger"
                  className="min-w-8 h-8 rounded-lg"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                </Button>
              </Tooltip>
            </>
          ) : (
            <>
              <Button
                as={Link}
                to="/auth"
                size="sm"
                variant="flat"
                className="bg-[var(--lj-surface-2)] text-[var(--lj-ink)] hover:bg-[var(--lj-surface)] rounded-lg text-xs px-3"
                onClick={() => setMenuOpen(false)}
                startContent={<LogIn size={15} />}
              >
                登录
              </Button>
              <Button
                as={Link}
                to="/auth"
                size="sm"
                color="primary"
                className="rounded-lg text-xs px-3 font-medium"
                onClick={() => setMenuOpen(false)}
                startContent={<UserPlus size={15} />}
              >
                注册
              </Button>
            </>
          )}

          <Button
            isIconOnly
            size="sm"
            variant="flat"
            className="lj-nav-hamburger md:hidden min-w-9 h-9"
            aria-label="菜单"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Menu size={20} />
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
