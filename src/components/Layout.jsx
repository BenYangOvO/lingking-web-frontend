import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import useParticleBackground from '../hooks/useParticleBackground'
import useCursorParticles from '../hooks/useCursorParticles'
import { getTheme, getParticlesEnabled, onPrefsChange } from '../prefs'

/**
 * 全局布局：粒子背景 + 鼠标拖曳粒子（可通过右上角开关关闭）+ 导航栏 + 内容区 + 页脚
 * 支持深色原版 / 白色简约版主题切换
 */
function Layout() {
  const [theme, setThemeState] = useState(getTheme())
  const [particlesEnabled, setParticlesEnabled] = useState(getParticlesEnabled())

  useEffect(() => onPrefsChange(() => {
    setThemeState(getTheme())
    setParticlesEnabled(getParticlesEnabled())
  }), [])

  const isLight = theme === 'light'

  const bgCanvasRef = useParticleBackground({
    count: 80,
    speed: 0.5,
    connectDistance: 120,
    color: '#4A90D9',
  })
  const cursorCanvasRef = useCursorParticles({
    enabled: particlesEnabled,
    color: isLight ? '#4A90D9' : '#6AADE8',
    gravity: 0.06,
    life: 70,
    density: 4,
    maxPerFrame: 8,
  })

  return (
    <>
      <canvas ref={bgCanvasRef} className="lj-particles-canvas" />
      <canvas ref={cursorCanvasRef} className="lj-cursor-canvas" />
      <div className="lj-content-layer">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default Layout
