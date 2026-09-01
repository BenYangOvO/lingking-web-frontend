import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardBody, Avatar, Chip, Spinner } from '@heroui/react'
import { Crown } from 'lucide-react'
import { api } from '../api'
import '../styles/pages/members.css'

function Members() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/members').then((data) => {
      setMembers(data.members || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <>
      <section className="lj-page-header">
        <div className="lj-page-header-inner">
          <div className="lj-breadcrumb">
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <span className="current">凌镜成员</span>
          </div>
          <h1 className="lj-page-title">凌镜成员</h1>
          <p className="lj-page-subtitle">真实成员 · 每个人都是主角</p>
        </div>
      </section>

      <div className="lj-glow-line" />

      <section className="max-w-6xl mx-auto px-4 py-12">
        {loading && (
          <div className="flex justify-center py-16">
            <Spinner color="primary" label="加载成员列表中..." size="lg" />
          </div>
        )}

        {!loading && members.length === 0 && (
          <div className="text-center py-16 text-default-400">
            还没有注册成员。注册账号并在个人资料中完善信息后，就会出现在这里。
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {members.map((m) => {
              const displayName = m.name || m.nickname || m.username || '匿名社员'
              const avatarSrc = m.avatar && (m.avatar.startsWith('http') || m.avatar.startsWith('/')) ? m.avatar : undefined
              const emojiChar = m.avatar && m.avatar.startsWith('emoji:') ? m.avatar.slice(6) : undefined
              const isGrad = m.avatar && m.avatar.startsWith('linear-gradient')

              return (
                <Card key={m.id || m.name} className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-md hover:shadow-xl transition-all">
                  <CardBody className="flex flex-col items-center text-center p-6 gap-3">
                    <div className="relative">
                      {avatarSrc ? (
                        <Avatar src={avatarSrc} className="w-20 h-20 text-large" />
                      ) : emojiChar ? (
                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl bg-default-100 border border-[var(--lj-surface-2)]">
                          {emojiChar}
                        </div>
                      ) : (
                        <div
                          className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md"
                          style={{ background: isGrad ? m.avatar : 'linear-gradient(135deg, #6366f1, #818cf8)' }}
                        >
                          {displayName[0].toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-lg">{displayName}</h3>
                      {m.nickname && m.nickname !== m.name && (
                        <p className="text-xs text-default-400 mt-0.5">@{m.username || m.nickname}</p>
                      )}
                    </div>

                    <Chip
                      size="sm"
                      variant="flat"
                      color={m.role === 'admin' ? 'warning' : 'default'}
                      startContent={m.role === 'admin' ? <Crown size={12} className="text-amber-400" /> : null}
                    >
                      {m.role === 'admin' ? '社长 / 管理员' : '社团成员'}
                    </Chip>

                    <p className="text-xs text-[var(--lj-ink-2)] line-clamp-3 mt-2 leading-relaxed italic">
                      {m.bio || '这位成员还没有留下自我介绍'}
                    </p>
                  </CardBody>
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}

export default Members