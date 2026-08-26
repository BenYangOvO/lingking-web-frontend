/**
 * 登录态管理：token + 用户名 的本地存储，以及跨组件登录态刷新通知。
 *
 * 「记住我」勾选 → localStorage（关浏览器仍在）；否则 → sessionStorage（关标签页即失效）
 */
const TOKEN_KEY = 'lingking_token'
const USERNAME_KEY = 'lingking_username'
const AUTH_EVENT = 'lingking-auth-change'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export function saveLogin(token, user, remember) {
  const store = remember ? localStorage : sessionStorage
  store.setItem(TOKEN_KEY, token)
  store.setItem(USERNAME_KEY, user.username)
  // 清理另一种存储
  ;(remember ? sessionStorage : localStorage).removeItem(TOKEN_KEY)
  ;(remember ? sessionStorage : localStorage).removeItem(USERNAME_KEY)
  window.dispatchEvent(new CustomEvent(AUTH_EVENT))
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USERNAME_KEY)
  sessionStorage.removeItem(USERNAME_KEY)
  window.dispatchEvent(new CustomEvent(AUTH_EVENT))
}

export function isLoggedIn() {
  return Boolean(getToken())
}

export function getUsername() {
  return localStorage.getItem(USERNAME_KEY) || sessionStorage.getItem(USERNAME_KEY)
}

/** 登录态变化时触发回调，返回取消监听函数 */
export function onAuthChange(cb) {
  window.addEventListener(AUTH_EVENT, cb)
  return () => window.removeEventListener(AUTH_EVENT, cb)
}