/**
 * 登录态管理：token + 用户名 + role 的本地存储，跨组件登录态刷新通知。
 */
const TOKEN_KEY = 'lingking_token'
const USERNAME_KEY = 'lingking_username'
const ROLE_KEY = 'lingking_role'
const AUTH_EVENT = 'lingking-auth-change'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

function _readStore(key) {
  return localStorage.getItem(key) || sessionStorage.getItem(key)
}

function _writeStore(store, key, value) {
  store.setItem(key, value)
}

function _removeFromBoth(key) {
  localStorage.removeItem(key)
  sessionStorage.removeItem(key)
}

export function saveLogin(token, user, remember) {
  const store = remember ? localStorage : sessionStorage
  _writeStore(store, TOKEN_KEY, token)
  _writeStore(store, USERNAME_KEY, user ? user.username : '')
  _writeStore(store, ROLE_KEY, user ? user.role || 'member' : 'member')
  // 清理另一种存储
  const other = remember ? sessionStorage : localStorage
  other.removeItem(TOKEN_KEY)
  other.removeItem(USERNAME_KEY)
  other.removeItem(ROLE_KEY)
  window.dispatchEvent(new CustomEvent(AUTH_EVENT))
}

export function logout() {
  _removeFromBoth(TOKEN_KEY)
  _removeFromBoth(USERNAME_KEY)
  _removeFromBoth(ROLE_KEY)
  window.dispatchEvent(new CustomEvent(AUTH_EVENT))
}

export function isLoggedIn() {
  return Boolean(getToken())
}

export function getUsername() {
  return _readStore(USERNAME_KEY)
}

export function getUserRole() {
  return _readStore(ROLE_KEY) || 'member'
}

export function isAdmin() {
  return getUserRole() === 'admin'
}

/** 登录态变化时触发回调，返回取消监听函数 */
export function onAuthChange(cb) {
  const handler = () => cb({ loggedIn: isLoggedIn(), username: getUsername(), role: getUserRole() })
  window.addEventListener(AUTH_EVENT, handler)
  handler() // 立即回调一次
  return () => window.removeEventListener(AUTH_EVENT, handler)
}
