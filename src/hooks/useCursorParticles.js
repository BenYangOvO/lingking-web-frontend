import { useEffect, useRef } from 'react'

/**
 * 鼠标粒子拖曳效果：鼠标移动时在指针位置拖出一串彩色粒子
 * 粒子带重力、阻力、透明度/大小衰减，不影响页面交互（pointer-events: none）
 */
export default function useCursorParticles({
  enabled = true,
  color = '#6AADE8',
  gravity = 0.08,
  friction = 0.96,
  life = 60,
  density = 4,        // 每像素产生多少粒子（这里实际是每帧移动每 dist 产生粒子数）
  maxPerFrame = 8,     // 单帧最大生成数
  sizeMin = 2,
  sizeMax = 5,
} = {}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    // 开关关闭时不启动动画与监听
    if (!enabled) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }
    let particles = []
    let rafId
    let running = true
    let lastX = -9999
    let lastY = -9999
    let mouseMoving = false
    let stopTimer = null

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function hexToRgba(hex, a) {
      const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
      const h = hex.replace(shorthand, (m, r, g, b) => r + r + g + g + b + b)
      const r = parseInt(h.slice(1, 3), 16)
      const g = parseInt(h.slice(3, 5), 16)
      const b = parseInt(h.slice(5, 7), 16)
      return `rgba(${r},${g},${b},${a})`
    }

    function emit(x, y, dx, dy, count = 1) {
      for (let i = 0; i < count; i++) {
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * Math.PI * 0.8
        const speed = Math.random() * 3 + 1
        particles.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * (sizeMax - sizeMin) + sizeMin,
          opacity: Math.random() * 0.4 + 0.6,
          life,
          maxLife: life,
          hueShift: Math.random() * 40 - 20,
        })
      }
    }

    function onMouseMove(e) {
      const x = e.clientX
      const y = e.clientY
      if (lastX === -9999) {
        lastX = x
        lastY = y
      }
      const dx = x - lastX
      const dy = y - lastY
      const dist = Math.sqrt(dx * dx + dy * dy)
      mouseMoving = true
      if (stopTimer) {
        clearTimeout(stopTimer)
        stopTimer = null
      }
      stopTimer = setTimeout(() => (mouseMoving = false), 200)

      if (dist > 0) {
        const count = Math.min(Math.ceil(dist * density * 0.02), maxPerFrame)
        emit(x, y, dx, dy, Math.max(1, count))
      }
      lastX = x
      lastY = y
    }

    function onTouchMove(e) {
      if (e.touches && e.touches[0]) {
        const t = e.touches[0]
        onMouseMove({ clientX: t.clientX, clientY: t.clientY })
      }
    }

    function animate() {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.vx *= friction
        p.vy = p.vy * friction + gravity
        p.x += p.vx
        p.y += p.vy
        p.life -= 1
        p.opacity = Math.max(0, (p.life / p.maxLife) * 0.9)
        p.size = Math.max(0, p.size * 0.985)

        if (p.life <= 0 || p.opacity <= 0.01 || p.size < 0.3) {
          particles.splice(i, 1)
          continue
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = hexToRgba(color, p.opacity)
        ctx.shadowBlur = 10
        ctx.shadowColor = hexToRgba(color, p.opacity * 0.6)
        ctx.fill()
      }
      ctx.shadowBlur = 0

      // 鼠标停顿时偶尔发射 1-2 个
      if (!mouseMoving && lastX !== -9999 && Math.random() < 0.08) {
        emit(lastX, lastY, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 1)
      }

      rafId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      if (stopTimer) clearTimeout(stopTimer)
    }
  }, [enabled, color, gravity, friction, life, density, maxPerFrame, sizeMin, sizeMax])

  return canvasRef
}
