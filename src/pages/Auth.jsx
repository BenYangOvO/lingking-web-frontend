import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { saveLogin } from '../auth'
import '../styles/pages/auth.css'

function Auth() {
  const [panel, setPanel] = useState('login')
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 登录表单
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  // 注册表单
  const [rUsername, setRUsername] = useState('')
  const [rEmail, setREmail] = useState('')
  const [rPassword, setRPassword] = useState('')
  const [rConfirm, setRConfirm] = useState('')
  const [agree, setAgree] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: { identifier, password },
      })
      saveLogin(data.token, data.user, remember)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    if (rPassword !== rConfirm) {
      setError('两次输入的密码不一致')
      return
    }
    if (!agree) {
      setError('请先阅读并同意《凌镜摄影社团用户协议》')
      return
    }
    setLoading(true)
    try {
      const data = await api('/auth/register', {
        method: 'POST',
        body: { username: rUsername, email: rEmail, password: rPassword },
      })
      saveLogin(data.token, data.user, false)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="lj-auth-page">
      <div className="lj-auth-card">
        <a href="/" className="lj-auth-logo" style={{ display: 'block', textDecoration: 'none', color: 'var(--lj-brand)' }}>
          凌镜
        </a>

        <div className="lj-auth-tabs">
          <button
            className={`lj-auth-tab${panel === 'login' ? ' active' : ''}`}
            onClick={() => { setPanel('login'); setError('') }}
          >
            登录
          </button>
          <button
            className={`lj-auth-tab${panel === 'register' ? ' active' : ''}`}
            onClick={() => { setPanel('register'); setError('') }}
          >
            注册
          </button>
        </div>

        {error && <div className="lj-form-error">{error}</div>}

        {panel === 'login' ? (
          <div className="lj-auth-panel active">
            <form onSubmit={handleLogin} autoComplete="off">
              <div className="lj-form-group">
                <label className="lj-form-label">用户名 / 邮箱</label>
                <input
                  className="lj-form-input"
                  type="text"
                  placeholder="请输入用户名或邮箱"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
              <div className="lj-form-group">
                <label className="lj-form-label">密码</label>
                <input
                  className="lj-form-input"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="lj-form-row">
                <label className="lj-form-checkbox">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> 记住我
                </label>
                <a href="#" className="lj-form-link" onClick={(e) => e.preventDefault()}>忘记密码?</a>
              </div>
              <button type="submit" className="lj-auth-submit" disabled={loading}>
                {loading ? '登录中…' : '登录'}
              </button>
            </form>
          </div>
        ) : (
          <div className="lj-auth-panel active">
            <form onSubmit={handleRegister} autoComplete="off">
              <div className="lj-form-group">
                <label className="lj-form-label">用户名</label>
                <input
                  className="lj-form-input"
                  type="text"
                  placeholder="请输入用户名"
                  value={rUsername}
                  onChange={(e) => setRUsername(e.target.value)}
                />
              </div>
              <div className="lj-form-group">
                <label className="lj-form-label">邮箱</label>
                <input
                  className="lj-form-input"
                  type="email"
                  placeholder="请输入邮箱地址"
                  value={rEmail}
                  onChange={(e) => setREmail(e.target.value)}
                />
              </div>
              <div className="lj-form-group">
                <label className="lj-form-label">密码</label>
                <input
                  className="lj-form-input"
                  type="password"
                  placeholder="请设置密码（至少 6 位）"
                  value={rPassword}
                  onChange={(e) => setRPassword(e.target.value)}
                />
              </div>
              <div className="lj-form-group">
                <label className="lj-form-label">确认密码</label>
                <input
                  className="lj-form-input"
                  type="password"
                  placeholder="请再次输入密码"
                  value={rConfirm}
                  onChange={(e) => setRConfirm(e.target.value)}
                />
              </div>
              <label className="lj-form-agreement">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> 我已阅读并同意《凌镜摄影社团用户协议》
              </label>
              <button type="submit" className="lj-auth-submit" disabled={loading}>
                {loading ? '注册中…' : '注册'}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}

export default Auth