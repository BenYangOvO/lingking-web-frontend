import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import useParticleBackground from '../hooks/useParticleBackground'

/**
 * 全局布局：粒子背景 + 导航栏 + 内容区 + 页脚
 */
function Layout() {
  const canvasRef = useParticleBackground({
    count: 80,
    speed: 0.5,
    connectDistance: 120,
    color: '#4A90D9',
  })

  return (
    <>
      <canvas ref={canvasRef} className="lj-particles-canvas" />
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