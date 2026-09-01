import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Card, CardBody, Tabs, Tab, Input, Checkbox, Button } from '@heroui/react'
import { User, Lock, Mail, AlertCircle } from 'lucide-react'
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
    <section className="lj-auth-page min-h-[85vh] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-xl p-3">
        <CardBody className="gap-4">
          <Link to="/" className="text-center text-3xl font-extrabold text-[var(--lj-brand)] mb-2 tracking-tight">
            凌镜
          </Link>

          <Tabs
            fullWidth
            selectedKey={panel}
            onSelectionChange={(key) => {
              setPanel(String(key))
              setError('')
            }}
            color="primary"
            variant="solid"
            size="lg"
            className="mb-2"
          >
            <Tab key="login" title="登录" />
            <Tab key="register" title="注册" />
          </Tabs>

          {error && (
            <div className="p-3 text-sm rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {panel === 'login' ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input
                label="用户名 / 邮箱"
                placeholder="请输入用户名或邮箱"
                value={identifier}
                onValueChange={setIdentifier}
                variant="bordered"
                startContent={<User size={18} className="text-default-400" />}
                isRequired
              />

              <Input
                label="密码"
                type="password"
                placeholder="请输入密码"
                value={password}
                onValueChange={setPassword}
                variant="bordered"
                startContent={<Lock size={18} className="text-default-400" />}
                isRequired
              />

              <div className="flex items-center justify-between px-1">
                <Checkbox
                  size="sm"
                  color="primary"
                  isSelected={remember}
                  onValueChange={setRemember}
                >
                  <span className="text-xs text-[var(--lj-ink-2)]">记住我</span>
                </Checkbox>
                <a href="#" className="text-xs text-[var(--lj-brand)] hover:underline" onClick={(e) => e.preventDefault()}>
                  忘记密码?
                </a>
              </div>

              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={loading}
                className="w-full font-bold shadow-md shadow-indigo-500/20 mt-2"
              >
                {loading ? '登录中…' : '登录'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              <Input
                label="用户名"
                placeholder="请输入用户名"
                value={rUsername}
                onValueChange={setRUsername}
                variant="bordered"
                startContent={<User size={18} className="text-default-400" />}
                isRequired
              />

              <Input
                label="邮箱"
                type="email"
                placeholder="请输入邮箱地址"
                value={rEmail}
                onValueChange={setREmail}
                variant="bordered"
                startContent={<Mail size={18} className="text-default-400" />}
                isRequired
              />

              <Input
                label="密码"
                type="password"
                placeholder="请设置密码（至少 6 位）"
                value={rPassword}
                onValueChange={setRPassword}
                variant="bordered"
                startContent={<Lock size={18} className="text-default-400" />}
                isRequired
              />

              <Input
                label="确认密码"
                type="password"
                placeholder="请再次输入密码"
                value={rConfirm}
                onValueChange={setRConfirm}
                variant="bordered"
                startContent={<Lock size={18} className="text-default-400" />}
                isRequired
              />

              <Checkbox
                size="sm"
                color="primary"
                isSelected={agree}
                onValueChange={setAgree}
                className="px-1"
              >
                <span className="text-xs text-[var(--lj-ink-2)]">
                  我已阅读并同意《凌镜摄影社团用户协议》
                </span>
              </Checkbox>

              <Button
                type="submit"
                color="primary"
                size="lg"
                isLoading={loading}
                className="w-full font-bold shadow-md shadow-indigo-500/20 mt-2"
              >
                {loading ? '注册中…' : '注册'}
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </section>
  )
}

export default Auth