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

export function listAdminContent(type) {
  return api(`/admin/content?type=${type}`, { auth: true })
}

export function deleteContent(type, id) {
  return api(`/admin/content?type=${type}&id=${id}`, { method: 'DELETE', auth: true })
}

export function setUserRole(uid, role) {
  return api(`/admin/users/${uid}/role`, { method: 'POST', auth: true, body: { role } })
}

export function deleteUser(uid) {
  return api(`/admin/users/${uid}`, { method: 'DELETE', auth: true })
}

// 站点固定内容：公共读，管理员写（PUT）
export function getSiteContent(slug) {
  return api(`/site/${slug}`)
}

export function updateSiteContent(slug, content) {
  return api(`/site/${slug}`, { method: 'PUT', auth: true, body: { content } })
}

// ---------- 用户资料 ---------- //

export function getMyProfile() {
  return api('/auth/me', { auth: true })
}

export function updateProfile({ username, nickname, avatar, birthday, bio }) {
  return api('/auth/profile', { method: 'POST', auth: true, body: { username, nickname, avatar, birthday, bio } })
}

export function changePassword(oldPassword, newPassword) {
  return api('/auth/password', {
    method: 'POST',
    auth: true,
    body: { old_password: oldPassword, new_password: newPassword },
  })
}

// 图片上传：File -> base64 -> POST /api/upload -> { url, size, ext }
export function uploadImage(file, { onProgress } = {}) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File || file instanceof Blob)) {
      reject(new Error('参数必须是文件对象'))
      return
    }
    const maxMB = 10
    if (file.size > maxMB * 1024 * 1024) {
      reject(new Error(`图片大小不能超过 ${maxMB}MB`))
      return
    }
    const reader = new FileReader()
    reader.onprogress = (e) => {
      if (onProgress && e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    reader.onerror = () => reject(new Error('读取图片失败，文件可能损坏或格式不支持'))
    reader.onload = async () => {
      try {
        if (onProgress) onProgress(95)
        const image_b64 = String(reader.result || '')
        const res = await api('/upload', { method: 'POST', auth: true, body: { image_b64 } })
        if (onProgress) onProgress(100)
        resolve(res)
      } catch (err) {
        reject(err)
      }
    }
    reader.readAsDataURL(file)
  })
}

// 文档上传（doc/docx/pdf）：File -> base64 -> POST /api/upload -> { url, size, ext }
export function uploadFile(file, { onProgress } = {}) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File || file instanceof Blob)) {
      reject(new Error('参数必须是文件对象'))
      return
    }
    const maxMB = 20
    if (file.size > maxMB * 1024 * 1024) {
      reject(new Error(`文档大小不能超过 ${maxMB}MB`))
      return
    }
    const name = file.name || ''
    const ext = name.includes('.') ? name.split('.').pop().toLowerCase() : ''
    if (!['doc', 'docx', 'pdf'].includes(ext)) {
      reject(new Error('仅支持 doc / docx / pdf 格式文档'))
      return
    }
    const reader = new FileReader()
    reader.onprogress = (e) => {
      if (onProgress && e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    reader.onerror = () => reject(new Error('读取文档失败，文件可能损坏'))
    reader.onload = async () => {
      try {
        if (onProgress) onProgress(95)
        const image_b64 = String(reader.result || '')
        const res = await api('/upload', { method: 'POST', auth: true, body: { image_b64, ext } })
        if (onProgress) onProgress(100)
        resolve(res)
      } catch (err) {
        reject(err)
      }
    }
    reader.readAsDataURL(file)
  })
}
