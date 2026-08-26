import { useEffect, useRef } from 'react'

function hexToRgb(hex) {
  const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  let h = hex.replace(shorthand, (m, r, g, b) => r + r + g + g + b + b)
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 74, g: 144, b: 217 }
}

/**
 * 全屏粒子背景动画（由 pages-draft 的 particle background 重构而来）
 * @param {object} opts
 * @param {number} opts.count 粒子数量
 * @param {number} opts.speed 速度
 * @param {number} opts.connectDistance 连线距离
 * @param {string} opts.color 颜色 hex
 * @returns canvas ref
 */
export default function useParticleBackground({
  count = 80,
  speed = 0.5,
  connectDistance = 120,
  color = '#4A90D9',
} = {}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const brand = hexToRgb(color)
    let particles = []
    let rafId
    let running = true

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.3,
      }
    }

    function init() {
      resize()
      particles = []
      for (let i = 0; i < count; i++) particles.push(createParticle())
    }

    function animate() {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < -10) p.x = canvas.width + 10
        if (p.x > canvas.width + 10) p.x = -10
        if (p.y < -10) p.y = canvas.height + 10
        if (p.y > canvas.height + 10) p.y = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${brand.r},${brand.g},${brand.b},${p.opacity})`
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < connectDistance) {
            const lineOpacity = (1 - dist / connectDistance) * 0.15
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(${brand.r},${brand.g},${brand.b},${lineOpacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      rafId = requestAnimationFrame(animate)
    }

    init()
    animate()
    window.addEventListener('resize', resize)
    return () => {
      running = false
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [count, speed, connectDistance, color])

  return canvasRef
}