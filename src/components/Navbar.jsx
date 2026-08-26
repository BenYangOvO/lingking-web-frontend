import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, LogIn, UserPlus, LogOut } from 'lucide-react'
import { isLoggedIn, getUsername, logout, onAuthChange } from '../auth'

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
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const sync = () => setUser(isLoggedIn() ? getUsername() : null)
    sync()
    return onAuthChange(sync)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

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
          {user ? (
            <>
              <span className="lj-nav-user" title={user}>
                {user}
              </span>
              <button className="lj-btn-secondary" onClick={handleLogout}>
                <LogOut size={16} />
                退出
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