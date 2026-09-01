import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardBody, CardFooter, Button, Chip, Avatar, Spinner } from '@heroui/react'
import { Calendar, Heart, MessageCircle, ArrowLeft, User } from 'lucide-react'
import { api } from '../api'
import MarkdownText from '../components/MarkdownText'
import '../styles/pages/diary.css'

function DiaryStats({ likes, comments }) {
  return (
    <div className="flex items-center gap-3">
      <Chip size="sm" variant="flat" className="bg-rose-500/10 text-rose-400" startContent={<Heart size={12} className="fill-current" />}>
        {likes || 0}
      </Chip>
      <Chip size="sm" variant="flat" className="bg-sky-500/10 text-sky-400" startContent={<MessageCircle size={12} />}>
        {comments || 0}
      </Chip>
    </div>
  )
}

function Diary() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [singlePost, setSinglePost] = useState(null)
  const [singleLoading, setSingleLoading] = useState(false)

  useEffect(() => {
    api('/diary').then((data) => {
      setEntries(data.entries || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!id) {
      setSinglePost(null)
      return
    }
    const found = entries.find((e) => String(e.uuid) === String(id) || String(e.id) === String(id) || String(e.submission_id) === String(id))
    if (found) {
      setSinglePost(found)
    } else {
      setSingleLoading(true)
      api(`/posts/${id}`).then((res) => {
        if (res.ok && res.post) {
          const p = res.post.payload || res.post
          setSinglePost({
            id: res.post.id,
            uuid: res.post.uuid || id,
            title: p.title || '无标题',
            date: p.date || '',
            author: p.author || res.post.submitter_name || '社员',
            mood: p.mood || 'happy',
            content: p.content || '',
            bg: p.bg || 'linear-gradient(145deg,#1E3A5F,#2D5F8A,#4A90D9)',
            avatar: (p.author || '社')[0],
            avatar_bg: 'linear-gradient(135deg,#4A90D9,#6AADE8)',
          })
        }
      }).catch(() => {}).finally(() => setSingleLoading(false))
    }
  }, [id, entries])

  const featured = entries[0]
  const rest = entries.slice(1)

  if (id) {
    const item = singlePost || entries.find((e) => String(e.uuid) === String(id) || String(e.id) === String(id))
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Button
            size="sm"
            variant="flat"
            onClick={() => navigate('/diary')}
            startContent={<ArrowLeft size={16} />}
          >
            返回日记列表
          </Button>
          <div className="lj-breadcrumb m-0">
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <Link to="/diary">凌镜日记本</Link>
            <span className="sep">/</span>
            <span className="current">{item?.title || '日记详情'}</span>
          </div>
        </div>

        {singleLoading && (
          <div className="flex justify-center py-16">
            <Spinner color="primary" label="正在加载日记详情..." />
          </div>
        )}

        {!singleLoading && !item && (
          <div className="text-center py-16 text-default-400">
            <h2 className="text-xl font-bold">未找到该篇日记</h2>
            <p className="mt-2 text-sm">可能已被删除或链接有误</p>
          </div>
        )}

        {!singleLoading && item && (
          <Card className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-xl p-4 md:p-8">
            <CardHeader className="flex flex-col items-start gap-2 border-b border-[var(--lj-surface-2)] pb-4">
              <div className="flex items-center gap-2 text-xs text-default-400">
                <Calendar size={14} />
                <span>{item.date}</span>
                <span>•</span>
                <User size={14} />
                <span>{item.author}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">{item.title}</h1>
            </CardHeader>

            <CardBody className="py-6 text-base leading-relaxed text-[var(--lj-ink)]">
              <MarkdownText content={item.content} />
            </CardBody>

            <CardFooter className="border-t border-[var(--lj-surface-2)] pt-4 flex justify-between items-center">
              <DiaryStats likes={item.likes || 12} comments={item.comments || 3} />
            </CardFooter>
          </Card>
        )}
      </div>
    )
  }

  return (
    <>
      <section className="lj-page-header">
        <div className="lj-page-header-inner">
          <div className="lj-breadcrumb">
            <Link to="/">首页</Link>
            <span className="sep">/</span>
            <span className="current">日记本</span>
          </div>
          <h1 className="lj-page-title">凌镜日记本</h1>
          <p className="lj-page-subtitle">记录摄影社团外拍日常、活动花絮与拍摄心情</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
        {loading && (
          <div className="flex justify-center py-16">
            <Spinner color="primary" label="加载日记列表中..." size="lg" />
          </div>
        )}

        {!loading && entries.length === 0 && (
          <div className="text-center py-16 text-default-400">暂无日记</div>
        )}

        {/* 推荐大日记卡片 */}
        {!loading && featured && (
          <Card
            isPressable
            onClick={() => navigate(`/diary/${featured.uuid || featured.id}`)}
            className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] shadow-xl p-4 md:p-6 transition-transform hover:-translate-y-1"
          >
            <CardBody className="gap-3">
              <div className="flex items-center justify-between text-xs text-default-400">
                <Chip size="sm" color="primary" variant="flat">最新推荐</Chip>
                <div className="flex items-center gap-2">
                  <Calendar size={13} />
                  <span>{featured.date}</span>
                </div>
              </div>

              <h2 className="text-xl font-bold">{featured.title}</h2>

              <p className="text-sm text-default-400 line-clamp-3 leading-relaxed">
                {featured.content?.replace(/#|\*|`/g, '').slice(0, 150)}...
              </p>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--lj-surface-2)]">
                <div className="flex items-center gap-2">
                  <Avatar name={featured.author?.[0]} size="sm" color="primary" />
                  <span className="text-xs font-semibold">{featured.author}</span>
                </div>
                <DiaryStats likes={featured.likes || 18} comments={featured.comments || 5} />
              </div>
            </CardBody>
          </Card>
        )}

        {/* 其它日记网格列表 */}
        {!loading && rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rest.map((entry) => (
              <Card
                key={entry.uuid || entry.id || entry.title}
                isPressable
                onClick={() => navigate(`/diary/${entry.uuid || entry.id}`)}
                className="bg-[var(--lj-surface)] border border-[var(--lj-surface-2)] p-3 hover:border-default-400 transition-all"
              >
                <CardBody className="gap-2">
                  <div className="flex items-center justify-between text-xs text-default-400">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {entry.date}</span>
                  </div>

                  <h3 className="text-base font-bold line-clamp-1">{entry.title}</h3>

                  <p className="text-xs text-default-400 line-clamp-2 leading-relaxed">
                    {entry.content?.replace(/#|\*|`/g, '').slice(0, 80)}...
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--lj-surface-2)]">
                    <span className="text-xs text-default-400">by {entry.author}</span>
                    <DiaryStats likes={entry.likes || 5} comments={entry.comments || 1} />
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Diary