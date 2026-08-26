import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import useParticleBackground from '../hooks/useParticleBackground'
import useCursorParticles from '../hooks/useCursorParticles'

/**
 * 全局布局：粒子背景 + 鼠标拖曳粒子 + 导航栏 + 内容区 + 页脚
 */
function Layout() {
  const bgCanvasRef = useParticleBackground({
    count: 80,
    speed: 0.5,
    connectDistance: 120,
    color: '#4A90D9',
  })
  const cursorCanvasRef = useCursorParticles({
    color: '#6AADE8',
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