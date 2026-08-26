/**
 * 统一的 API 调用封装。
 *
 * 开发环境：Vite dev server 将 /api 代理到 http://localhost:8000（见 vite.config.js）
 * 生产环境：nginx 将 /api 反向代理到 http://127.0.0.1:8000
 *
 * 因此前端代码里永远只写相对路径 /api/*，不需要区分环境。
 */
import { getToken } from './auth'

const BASE = '/api'

export async function api(path, { method = 'GET', body, token, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const t = token || (auth ? getToken() : null)
  if (t) headers.Authorization = `Bearer ${t}`

  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('网络错误，请检查后端服务是否已启动')
  }

  let data = {}
  try {
    data = await res.json()
  } catch {
    /* 非 JSON 响应 */
  }

  if (!res.ok) {
    throw new Error(data.error || `请求失败 (${res.status})`)
  }
  return data
}

// ---------- 投稿（需登录） ---------- //

export function submitWork(board, payload) {
  return api('/submissions', { method: 'POST', auth: true, body: { board, payload } })
}

export function listMySubmissions() {
  return api('/submissions/mine', { auth: true })
}

// ---------- 管理员 ---------- //

export function getAdminStats() {
  return api('/admin/stats', { auth: true })
}

export function listAdminSubmissions({ board, status } = {}) {
  const q = new URLSearchParams()
  if (board) q.set('board', board)
  if (status) q.set('status', status)
  const qs = q.toString()
  return api(`/admin/submissions${qs ? '?' + qs : ''}`, { auth: true })
}

export function listAdminUsers() {
  return api('/admin/users', { auth: true })
}

export function reviewSubmission(id, status, note) {
  return api(`/admin/submissions/${id}/review`, {
    method: 'POST',
    auth: true,
    body: { status, note },
  })
}

export function deleteSubmission(id) {
  return api(`/admin/submissions/${id}`, { method: 'DELETE', auth: true })
}

export function setUserRole(uid, role) {
  return api(`/admin/users/${uid}/role`, { method: 'POST', auth: true, body: { role } })
}
