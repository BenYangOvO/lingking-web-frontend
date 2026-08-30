/**
 * 用户偏好设置：主题（深色原版/白色简约版）+ 鼠标粒子拖曳效果开关
 * localStorage 持久化，通过自定义事件 lj-prefs-change 通知组件更新
 */

const THEME_KEY = 'lj-theme'
const PARTICLES_KEY = 'lj-cursor-particles'
const EVT = 'lj-prefs-change'

export function getTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function setTheme(theme) {
  const t = theme === 'light' ? 'light' : 'dark'
  try { localStorage.setItem(THEME_KEY, t) } catch { /* ignore */ }
  applyTheme(t)
  window.dispatchEvent(new CustomEvent(EVT, { detail: { theme: t } }))
}

export function toggleTheme() {
  setTheme(getTheme() === 'light' ? 'dark' : 'light')
}

// 将 light class 挂到 <html>，触发 CSS 变量切换
export function applyTheme(theme) {
  const t = theme || getTheme()
  document.documentElement.classList.toggle('light', t === 'light')
}

export function isLight() {
  return getTheme() === 'light'
}

// ===== 鼠标粒子拖曳开关（默认开启） =====
export function getParticlesEnabled() {
  try {
    const v = localStorage.getItem(PARTICLES_KEY)
    return v === null ? true : v === '1'
  } catch {
    return true
  }
}

export function setParticlesEnabled(enabled) {
  const v = enabled ? '1' : '0'
  try { localStorage.setItem(PARTICLES_KEY, v) } catch { /* ignore */ }
  window.dispatchEvent(new CustomEvent(EVT, { detail: { particles: enabled } }))
}

export function toggleParticles() {
  setParticlesEnabled(!getParticlesEnabled())
}

// 订阅偏好变化，返回取消函数
export function onPrefsChange(cb) {
  const handler = () => cb()
  window.addEventListener(EVT, handler)
  return () => window.removeEventListener(EVT, handler)
}
