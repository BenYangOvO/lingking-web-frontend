/**
 * 统一的 API 调用封装。
 *
 * 开发环境：Vite dev server 将 /api 代理到 http://localhost:8000（见 vite.config.js）
 * 生产环境：nginx 将 /api 反向代理到 http://127.0.0.1:8000
 *
 * 因此前端代码里永远只写相对路径 /api/*，不需要区分环境。
 */
const BASE = '/api'

export async function api(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`

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