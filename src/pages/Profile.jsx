import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Key, Save, Eye, EyeOff, Crown, Camera } from 'lucide-react'
import { getMyProfile, updateProfile, changePassword } from '../api'
import { updateLocalUser, isLoggedIn } from '../auth'

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #C4B5FD, #A78BFA)',
  'linear-gradient(135deg, #BAE6FD, #7DD3FC)',
  'linear-gradient(135deg, #FBCFE8, #F9A8D4)',
  'linear-gradient(135deg, #BBF7D0, #86EFAC)',
  'linear-gradient(135deg, #FEF08A, #FDE047)',
  'linear-gradient(135deg, #FED7AA, #FDBA74)',
  'linear-gradient(135deg, #99F6E4, #5EEAD4)',
  'linear-gradient(135deg, #FECDD3, #FDA4AF)',
  'linear-gradient(135deg, #A5F3FC, #67E8F9)',
]

function pickInitial(name) {
  if (!name) return AVATAR_GRADIENTS[0]
  let sum = 0
  for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i)
  return AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length]
}

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [success, setSuccess] = useState('')

  const [editForm, setEditForm] = useState({ username: '', nickname: '', avatar: '', bio: '' })
  const [pwdForm, setPwdForm] = useState({ old: '', next: '', confirm: '' })
  const [showPwd, setShowPwd] = useState({ old: false, next: false, confirm: false })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/auth')
      return
    }
    getMyProfile().then((d) => {
      const u = d.user
      setUser(u)
      setEditForm({
        username: u.username || '',
        nickname: u.nickname || '',
        avatar: u.avatar || pickInitial(u.username),
        bio: u.bio || '',
      })
    }).catch((e) => setErr(e.message || '加载失败'))
      .finally(() => setLoading(false))
  }, [])

  const onEdit = (k, v) => setEditForm((f) => ({ ...f, [k]: v }))
  const onPwd = (k, v) => setPwdForm((f) => ({ ...f, [k]: v }))

  async function handleSaveProfile(e) {
    e.preventDefault()
    setErr(''); setSuccess(''); setSaving(true)
    try {
      const res = await updateProfile(editForm)
      if (res.user) updateLocalUser(res.user)
      setUser(res.user)
      setSuccess('资料已更新')
    } catch (e) {
      setErr(e.message || '保存失败')
    } finally { setSaving(false) }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setErr(''); setSuccess('')
    if (pwdForm.next !== pwdForm.confirm) {
      setErr('两次输入的新密码不一致')
      return
    }
    setSaving(true)
    try {
      await changePassword(pwdForm.old, pwdForm.next)
      setSuccess('密码已修改')
      setPwdForm({ old: '', next: '', confirm: '' })
    } catch (e) {
      setErr(e.message || '修改失败')
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div className="lj-fade-in" style={{ padding: 40, textAlign: 'center', color: 'var(--lj-ink-3)' }}>
        加载中...
      </div>
    )
  }

  return (
    <div className="lj-fade-in">
      <section className="lj-hero pt-16" style={{ minHeight: 'auto', padding: '80px 24px 40px' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div
            className="mx-auto mb-6"
            style={{
              width: 96, height: 96, borderRadius: '50%',
              background: user?.avatar || pickInitial(editForm.username),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, fontWeight: 700, color: '#fff',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            {(editForm.nickname || editForm.username || '?').charAt(0).toUpperCase()}
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">
            {editForm.nickname || editForm.username}
            {user?.role === 'admin' && (
              <span style={{ marginLeft: 8, color: '#FBBF24', fontSize: 20 }}>
                <Crown size={20} style={{ display: 'inline', verticalAlign: '-4px' }} />
              </span>
            )}
          </h1>
          <p style={{ color: 'var(--lj-ink-3)' }}>{user?.email}</p>
          {user?.bio && (
            <p style={{ maxWidth: 520, margin: '16px auto 0', color: 'var(--lj-ink-2)', lineHeight: 1.7 }}>
              {user.bio}
            </p>
          )}
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
          {err && (
            <div style={{
              background: 'rgba(248,113,113,0.12)', color: '#F87171',
              padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(248,113,113,0.3)',
            }}>{err}</div>
          )}
          {success && (
            <div style={{
              background: 'rgba(52,211,153,0.12)', color: '#34D399',
              padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(52,211,153,0.3)',
            }}>{success}</div>
          )}

          {/* 基本资料 */}
          <div className="lj-surface" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <User size={18} style={{ color: 'var(--lj-brand)' }} />
              基本资料
            </h2>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--lj-ink-3)' }}>用户名（用于登录）</span>
                <input
                  value={editForm.username}
                  onChange={(e) => onEdit('username', e.target.value)}
                  style={inputStyle}
                  placeholder="2-20位字母/数字/中文"
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--lj-ink-3)' }}>昵称</span>
                <input
                  value={editForm.nickname}
                  onChange={(e) => onEdit('nickname', e.target.value)}
                  style={inputStyle}
                  placeholder="显示名称"
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--lj-ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Camera size={14} /> 头像
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {AVATAR_GRADIENTS.map((g, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => onEdit('avatar', g)}
                      style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: g,
                        border: editForm.avatar === g ? '3px solid var(--lj-brand)' : '3px solid transparent',
                        cursor: 'pointer', padding: 0,
                      }}
                    />
                  ))}
                </div>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--lj-ink-3)' }}>个人简介</span>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => onEdit('bio', e.target.value)}
                  style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }}
                  placeholder="介绍一下自己吧..."
                  maxLength={500}
                />
                <span style={{ fontSize: 12, color: 'var(--lj-ink-3)', textAlign: 'right' }}>
                  {editForm.bio.length}/500
                </span>
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={saving} className="lj-btn-primary" style={{ opacity: saving ? 0.6 : 1 }}>
                  <Save size={16} />
                  {saving ? '保存中...' : '保存修改'}
                </button>
              </div>
            </form>
          </div>

          {/* 修改密码 */}
          <div className="lj-surface" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Key size={18} style={{ color: 'var(--lj-brand)' }} />
              修改密码
            </h2>
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <PwdInput
                label="当前密码"
                value={pwdForm.old}
                onChange={(v) => onPwd('old', v)}
                show={showPwd.old}
                onToggle={() => setShowPwd((s) => ({ ...s, old: !s.old }))}
              />
              <PwdInput
                label="新密码（至少6位）"
                value={pwdForm.next}
                onChange={(v) => onPwd('next', v)}
                show={showPwd.next}
                onToggle={() => setShowPwd((s) => ({ ...s, next: !s.next }))}
              />
              <PwdInput
                label="确认新密码"
                value={pwdForm.confirm}
                onChange={(v) => onPwd('confirm', v)}
                show={showPwd.confirm}
                onToggle={() => setShowPwd((s) => ({ ...s, confirm: !s.confirm }))}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={saving} className="lj-btn-primary" style={{ opacity: saving ? 0.6 : 1 }}>
                  <Key size={16} />
                  {saving ? '修改中...' : '修改密码'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}

const inputStyle = {
  background: 'var(--lj-bg-alt)',
  border: '1px solid var(--lj-line)',
  borderRadius: 8,
  padding: '10px 14px',
  color: 'var(--lj-ink)',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 160ms',
}

function PwdInput({ label, value, onChange, show, onToggle }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 13, color: 'var(--lj-ink-3)' }}>{label}</span>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, width: '100%', paddingRight: 44 }}
          placeholder={label}
        />
        <button
          type="button"
          onClick={onToggle}
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'transparent', border: 'none', color: 'var(--lj-ink-3)', cursor: 'pointer',
          }}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  )
}

export default Profile
