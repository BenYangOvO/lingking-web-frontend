import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, Tabs, Tab, Input, Textarea, Avatar, Button, Chip, Spinner } from '@heroui/react'
import { User, Mail, Key, Save, Eye, EyeOff, Crown, Camera, Cake, Image as ImageIcon, FileImage, Pencil, CheckCircle, AlertCircle } from 'lucide-react'
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
  const [tab, setTab] = useState('edit')

  const [editForm, setEditForm] = useState({ username: '', nickname: '', avatar: '', birthday: '', bio: '' })
  const [avatarMode, setAvatarMode] = useState('gradient')
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
      setErr(e.message || '更新失败')
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePwd(e) {
    e.preventDefault()
    setErr(''); setSuccess('')
    if (pwdForm.next !== pwdForm.confirm) {
      setErr('新密码与确认密码不一致')
      return
    }
    setSaving(true)
    try {
      await changePassword({ oldPassword: pwdForm.old, newPassword: pwdForm.next })
      setSuccess('密码修改成功')
      setPwdForm({ old: '', next: '', confirm: '' })
    } catch (e) {
      setErr(e.message || '密码修改失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Spinner color="primary" label="加载个人资料中..." size="lg" />
      </div>
    )
  }

  const currentAvatar = editForm.avatar || pickInitial(user?.username)
  const isEmoji = currentAvatar.startsWith('emoji:')
  const emojiChar = isEmoji ? currentAvatar.slice(6) : ''
  const isImg = currentAvatar.startsWith('http://') || currentAvatar.startsWith('https://') || currentAvatar.startsWith('data:')

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 顶部 Header Card */}
      <Card className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-xl p-4 md:p-6 mb-8">
        <CardBody className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            {isImg ? (
              <Avatar src={currentAvatar} className="w-24 h-24 text-large" />
            ) : isEmoji ? (
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl bg-default-100 border border-[var(--lj-surface-2)]">
                {emojiChar}
              </div>
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-md"
                style={{ background: currentAvatar }}
              >
                {(user?.nickname || user?.username || '凌')[0].toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold">{user?.nickname || user?.username}</h1>
              {user?.role === 'admin' && (
                <Chip size="sm" color="warning" variant="flat" startContent={<Crown size={12} className="text-amber-400" />}>
                  管理员
                </Chip>
              )}
            </div>
            <p className="text-xs text-default-400">{user?.email}</p>
            {user?.bio && <p className="text-sm mt-2 text-[var(--lj-ink-2)] italic max-w-md">{user.bio}</p>}
          </div>
        </CardBody>
      </Card>

      {/* 功能 Tabs */}
      <Card className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-xl p-2 md:p-6">
        <CardBody className="gap-6">
          <Tabs
            selectedKey={tab}
            onSelectionChange={(k) => { setTab(String(k)); setErr(''); setSuccess('') }}
            color="primary"
            variant="solid"
            size="lg"
          >
            <Tab
              key="edit"
              title={
                <div className="flex items-center gap-2">
                  <Pencil size={16} />
                  <span>编辑资料</span>
                </div>
              }
            />
            <Tab
              key="password"
              title={
                <div className="flex items-center gap-2">
                  <Key size={16} />
                  <span>修改密码</span>
                </div>
              }
            />
          </Tabs>

          {err && (
            <div className="p-3 text-sm rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{err}</span>
            </div>
          )}

          {success && (
            <div className="p-3 text-sm rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center gap-2">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          {tab === 'edit' ? (
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="用户名"
                  value={editForm.username}
                  onValueChange={(v) => onEdit('username', v)}
                  variant="bordered"
                  isDisabled
                  startContent={<User size={18} className="text-default-400" />}
                />

                <Input
                  label="昵称"
                  placeholder="个性化的称呼"
                  value={editForm.nickname}
                  onValueChange={(v) => onEdit('nickname', v)}
                  variant="bordered"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="邮箱 (不可修改)"
                  value={user?.email || ''}
                  variant="bordered"
                  isDisabled
                  startContent={<Mail size={18} className="text-default-400" />}
                />

                <Input
                  type="date"
                  label="生日"
                  value={editForm.birthday}
                  onValueChange={(v) => onEdit('birthday', v)}
                  variant="bordered"
                />
              </div>

              <Textarea
                label="个人简介"
                placeholder="分享你的摄影理念、常用的相机与设备习惯..."
                value={editForm.bio}
                onValueChange={(v) => onEdit('bio', v)}
                variant="bordered"
                minRows={3}
              />

              {/* 头像预设选择器 */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-default-600">选择个性头像风格</label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_GRADIENTS.map((g, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onEdit('avatar', g)}
                      className={`w-8 h-8 rounded-full border-2 transition-transform ${
                        editForm.avatar === g ? 'border-[var(--lj-brand)] scale-110 shadow-md' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ background: g }}
                    />
                  ))}
                  {AVATAR_EMOJI.map((e, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onEdit('avatar', `emoji:${e}`)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm bg-default-100 transition-transform ${
                        editForm.avatar === `emoji:${e}` ? 'border-[var(--lj-brand)] scale-110 shadow-md' : 'border-transparent hover:scale-105'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={saving}
                startContent={!saving && <Save size={18} />}
                className="w-full md:w-auto self-start font-bold shadow-md shadow-indigo-500/20 px-8 mt-2"
              >
                {saving ? '保存中…' : '保存修改'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleChangePwd} className="flex flex-col gap-5 max-w-md">
              <Input
                label="当前密码"
                type={showPwd.old ? 'text' : 'password'}
                value={pwdForm.old}
                onValueChange={(v) => onPwd('old', v)}
                variant="bordered"
                isRequired
                endContent={
                  <button type="button" onClick={() => setShowPwd((s) => ({ ...s, old: !s.old }))}>
                    {showPwd.old ? <EyeOff size={18} className="text-default-400" /> : <Eye size={18} className="text-default-400" />}
                  </button>
                }
              />

              <Input
                label="新密码"
                type={showPwd.next ? 'text' : 'password'}
                value={pwdForm.next}
                onValueChange={(v) => onPwd('next', v)}
                variant="bordered"
                isRequired
                endContent={
                  <button type="button" onClick={() => setShowPwd((s) => ({ ...s, next: !s.next }))}>
                    {showPwd.next ? <EyeOff size={18} className="text-default-400" /> : <Eye size={18} className="text-default-400" />}
                  </button>
                }
              />

              <Input
                label="确认新密码"
                type={showPwd.confirm ? 'text' : 'password'}
                value={pwdForm.confirm}
                onValueChange={(v) => onPwd('confirm', v)}
                variant="bordered"
                isRequired
                endContent={
                  <button type="button" onClick={() => setShowPwd((s) => ({ ...s, confirm: !s.confirm }))}>
                    {showPwd.confirm ? <EyeOff size={18} className="text-default-400" /> : <Eye size={18} className="text-default-400" />}
                  </button>
                }
              />

              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={saving}
                className="w-full font-bold shadow-md shadow-indigo-500/20 mt-2"
              >
                {saving ? '修改中…' : '确认修改密码'}
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

export default Profile
