import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Key, Save, Eye, EyeOff, Crown, Camera, Cake, Image as ImageIcon, FileImage } from 'lucide-react'
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
  'linear-gradient(135deg, #FCA5A5, #F87171)',
  'linear-gradient(135deg, #818CF8, #6366F1)',
  'linear-gradient(135deg, #34D399, #10B981)',
]

const AVATAR_EMOJI = [
  '📷', '🎨', '🌙', '🌸', '🍂', '🎯', '🎬', '📚',
  '🌊', '🏔️', '🌆', '🌈', '🔥', '💫', '🎵', '🚀',
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

  const [editForm, setEditForm] = useState({ username: '', nickname: '', avatar: '', birthday: '', bio: '' })
  const [avatarMode, setAvatarMode] = useState('gradient') // gradient | emoji | image
  const [customImg, setCustomImg] = useState('')
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
      const a = u.avatar || pickInitial(u.username)
      const detectedMode = a.startsWith('emoji:')
        ? 'emoji'
        : (a.startsWith('http://') || a.startsWith('https://') || a.startsWith('data:'))
          ? 'image'
          : 'gradient'
      setAvatarMode(detectedMode)
      if (detectedMode === 'image') setCustomImg(a)
      setEditForm({
        username: u.username || '',
        nickname: u.nickname || '',
        avatar: a,
        birthday: u.birthday || '',
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
          <AvatarDisplay avatar={user?.avatar || pickInitial(editForm.username)} initial={(editForm.nickname || editForm.username || '?').charAt(0).toUpperCase()} size={96} />
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">
            {editForm.nickname || editForm.username}
            {user?.role === 'admin' && (
              <span style={{ marginLeft: 8, color: '#FBBF24', fontSize: 20 }}>
                <Crown size={20} style={{ display: 'inline', verticalAlign: '-4px' }} />
              </span>
            )}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, color: 'var(--lj-ink-3)', fontSize: 14, marginTop: 6 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Mail size={14} /> {user?.email}</span>
            {user?.birthday && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Cake size={14} /> {user.birthday}</span>
            )}
          </div>
          {user?.bio && (
            <p style={{ maxWidth: 520, margin: '20px auto 0', color: 'var(--lj-ink-2)', lineHeight: 1.8, fontSize: 15 }}>
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
                <span style={{ fontSize: 13, color: 'var(--lj-ink-3)' }}>昵称（对外展示）</span>
                <input
                  value={editForm.nickname}
                  onChange={(e) => onEdit('nickname', e.target.value)}
                  style={inputStyle}
                  placeholder="给自己取个展示名称吧"
                />
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--lj-ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Cake size={14} /> 生日
                </span>
                <input
                  type="date"
                  value={editForm.birthday}
                  onChange={(e) => onEdit('birthday', e.target.value)}
                  style={inputStyle}
                />
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--lj-ink-3)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Camera size={14} /> 头像
                </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => { setAvatarMode('gradient'); if (!AVATAR_GRADIENTS.includes(editForm.avatar)) onEdit('avatar', AVATAR_GRADIENTS[0]) }}
                    className={`lj-admin-tab small${avatarMode === 'gradient' ? ' active' : ''}`}
                    style={{ padding: '6px 12px', borderRadius: 999, marginBottom: 0, width: 'auto' }}
                  >
                    渐变配色
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAvatarMode('emoji'); if (!editForm.avatar.startsWith('emoji:')) onEdit('avatar', 'emoji:' + AVATAR_EMOJI[0]) }}
                    className={`lj-admin-tab small${avatarMode === 'emoji' ? ' active' : ''}`}
                    style={{ padding: '6px 12px', borderRadius: 999, marginBottom: 0, width: 'auto' }}
                  >
                    表情符号
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAvatarMode('image'); if (!customImg) { const g = 'https://picsum.photos/seed/' + Date.now() + '/160'; setCustomImg(g); onEdit('avatar', g) } }}
                    className={`lj-admin-tab small${avatarMode === 'image' ? ' active' : ''}`}
                    style={{ padding: '6px 12px', borderRadius: 999, marginBottom: 0, width: 'auto' }}
                  >
                    <FileImage size={14} style={{ marginRight: 4 }} /> 图片/链接
                  </button>
                </div>

                {avatarMode === 'gradient' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {AVATAR_GRADIENTS.map((g, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => onEdit('avatar', g)}
                        style={{
                          width: 48, height: 48, borderRadius: '50%',
                          background: g,
                          border: editForm.avatar === g ? '3px solid var(--lj-brand)' : '3px solid transparent',
                          cursor: 'pointer', padding: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                        title={`渐变配色 ${i + 1}`}
                      />
                    ))}
                  </div>
                )}

                {avatarMode === 'emoji' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {AVATAR_EMOJI.map((e, i) => {
                      const val = 'emoji:' + e
                      return (
                        <button
                          type="button"
                          key={i}
                          onClick={() => onEdit('avatar', val)}
                          style={{
                            width: 48, height: 48, borderRadius: '50%',
                            background: 'var(--lj-bg-alt)',
                            border: editForm.avatar === val ? '3px solid var(--lj-brand)' : '3px solid transparent',
                            cursor: 'pointer', padding: 0, fontSize: 22, lineHeight: 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                          title={e}
                        >
                          {e}
                        </button>
                      )
                    })}
                  </div>
                )}

                {avatarMode === 'image' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        type="text"
                        value={customImg}
                        onChange={(e) => { setCustomImg(e.target.value); onEdit('avatar', e.target.value) }}
                        style={{ ...inputStyle, flex: 1 }}
                        placeholder="输入图片 URL 或 data:image/..."
                      />
                      <button
                        type="button"
                        onClick={() => { const g = 'https://picsum.photos/seed/' + Date.now() + '/160'; setCustomImg(g); onEdit('avatar', g) }}
                        className="lj-btn-ghost"
                        style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}
                      >
                        <ImageIcon size={14} /> 随机
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <AvatarDisplay avatar={editForm.avatar} initial="图" size={60} />
                      <span style={{ color: 'var(--lj-ink-3)', fontSize: 12, alignSelf: 'center' }}>
                        预览：{customImg ? '已设置' : '暂未设置，将使用渐变配色'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--lj-ink-3)' }}>个人简介（自我介绍）</span>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => onEdit('bio', e.target.value)}
                  style={{ ...inputStyle, minHeight: 120, resize: 'vertical', lineHeight: 1.7 }}
                  placeholder="介绍一下自己吧，比如喜欢的摄影风格、常用器材、座右铭..."
                  maxLength={1000}
                />
                <span style={{ fontSize: 12, color: 'var(--lj-ink-3)', textAlign: 'right' }}>
                  {editForm.bio.length}/1000
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

function AvatarDisplay({ avatar, initial = '?', size = 44, style = {} }) {
  let bg = AVATAR_GRADIENTS[0]
  let content = initial || '?'
  let isImg = false
  if (avatar) {
    if (avatar.startsWith('emoji:')) {
      content = avatar.slice(6)
    } else if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:')) {
      isImg = true
      bg = avatar
    } else if (avatar.startsWith('linear-gradient') || avatar.startsWith('radial-gradient') || avatar.startsWith('#') || avatar.startsWith('rgb')) {
      bg = avatar
    } else {
      bg = avatar
    }
  }
  const baseStyle = {
    width: size, height: size, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
    flexShrink: 0,
    ...style,
  }
  if (isImg) {
    return (
      <img
        src={bg}
        alt=""
        style={{
          ...baseStyle,
          background: AVATAR_GRADIENTS[0],
          objectFit: 'cover',
          border: 'none',
          fontSize: Math.floor(size * 0.45),
          color: '#fff',
        }}
        onError={(e) => { e.currentTarget.style.display = 'none' }}
      />
    )
  }
  return (
    <div style={{
      ...baseStyle,
      background: bg,
      color: '#fff',
      fontSize: avatar?.startsWith('emoji:') ? Math.floor(size * 0.55) : Math.floor(size * 0.42),
    }}>
      {content}
    </div>
  )
}

export { AvatarDisplay }
export default Profile
